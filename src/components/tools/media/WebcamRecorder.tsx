"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Video, Square, Download, RefreshCw, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../ui/Button';
import { ToolRegistryItem } from '../../../registry/types';

interface Props {
  tool: ToolRegistryItem;
}

export function WebcamRecorder({ tool }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<{ url: string, type: 'video' | 'image' } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    return () => {
      stopRecording(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (mediaUrl) URL.revokeObjectURL(mediaUrl.url);
    };
  }, [mediaUrl]);

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } },
        audio: true
      });
      streamRef.current = stream;
      setIsCameraActive(true);

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
        videoPreviewRef.current.play();
      }
    } catch (err: any) {
      console.warn("Error starting webcam:", err.message);
      if (err.name === 'NotAllowedError' || err.message?.includes('Permission denied')) {
        setError("Webcam access was denied. Please allow camera access in your browser settings (usually the lock icon in the address bar) and try again.");
      } else {
        setError(err.message || "Failed to access webcam. Please ensure you granted permissions.");
      }
    }
  };

  const takeSnapshot = () => {
    if (!videoPreviewRef.current || !canvasRef.current) return;
    
    const video = videoPreviewRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const url = canvas.toDataURL('image/png');
      setMediaUrl({ url, type: 'image' });
      // Stop camera after snapshot
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        setIsCameraActive(false);
      }
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;

    try {
      let mimeType = 'video/webm';
      if (MediaRecorder.isTypeSupported('video/mp4')) {
        mimeType = 'video/mp4';
      } else if (MediaRecorder.isTypeSupported('video/webm; codecs=h264')) {
        mimeType = 'video/webm; codecs=h264';
      } else if (MediaRecorder.isTypeSupported('video/webm; codecs=vp9')) {
        mimeType = 'video/webm; codecs=vp9';
      }

      const mediaRecorder = new MediaRecorder(streamRef.current, { 
        mimeType,
        videoBitsPerSecond: 2500000 // 2.5 Mbps
      });
      
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const type = mediaRecorder.mimeType || 'video/webm';
        const blob = new Blob(recordedChunksRef.current, { type });
        const url = URL.createObjectURL(blob);
        setMediaUrl({ url, type: 'video' });
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      console.warn("Error starting recording:", err.message);
      setError("Failed to start recording. Your browser might not support this format.");
    }
  };

  const stopRecording = (createFile: boolean = true) => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      if (!createFile) {
        mediaRecorderRef.current.onstop = null;
      }
      mediaRecorderRef.current.stop();
    }
    
    setIsRecording(false);
    
    // Stop camera
    if (streamRef.current && createFile) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const reset = () => {
    setMediaUrl(null);
    startCamera();
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-8 w-full shadow-sm flex flex-col items-center">
      <div className="w-full max-w-3xl flex flex-col items-center">
        
        {/* Hidden Canvas for Snapshots */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Error Alert */}
        {error && (
          <div className="w-full bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-6 flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Media Preview Area */}
        {!mediaUrl ? (
          <div className="w-full aspect-video bg-black rounded-xl overflow-hidden mb-6 relative shadow-inner">
            <video 
              ref={videoPreviewRef} 
              autoPlay
              playsInline
              className="w-full h-full object-cover scale-x-[-1]" // Mirror effect for webcam
              muted 
            />
            {!isCameraActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50 bg-black/50 z-10">
                <Camera className="w-16 h-16 mb-4 opacity-50" />
                <Button size="lg" onClick={startCamera} className="rounded-full px-8 shadow-sm">
                  Enable Camera
                </Button>
              </div>
            )}
            {isRecording && (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full text-white text-sm font-medium animate-pulse z-10">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                Recording
              </div>
            )}
          </div>
        ) : (
          <div className="w-full aspect-video bg-black rounded-xl overflow-hidden mb-8 shadow-inner relative flex items-center justify-center">
            {mediaUrl.type === 'video' ? (
              <video src={mediaUrl.url} controls className="w-full h-full object-contain" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mediaUrl.url} alt="Snapshot" className="w-full h-full object-contain" />
            )}
          </div>
        )}

        {/* Controls */}
        {isCameraActive && !mediaUrl && (
          <div className="flex items-center gap-4 mt-2">
            {!isRecording ? (
              <>
                <Button size="lg" variant="outline" onClick={takeSnapshot} className="rounded-full px-6 h-14 text-base">
                  <Camera className="w-5 h-5 mr-2" />
                  Take Photo
                </Button>
                <Button size="lg" onClick={startRecording} className="rounded-full px-8 h-14 text-base shadow-sm">
                  <Video className="w-5 h-5 mr-2" />
                  Record Video
                </Button>
              </>
            ) : (
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => stopRecording(true)} 
                className="rounded-full px-8 h-14 bg-red-500 hover:bg-red-600 border-none text-white shadow-lg text-base"
              >
                <Square className="w-5 h-5 mr-2 fill-current" />
                Stop Recording
              </Button>
            )}
          </div>
        )}

        {/* Download & Reset */}
        {mediaUrl && (
          <div className="flex gap-4 animate-fade-in">
            <Button 
              variant="outline" 
              onClick={reset}
              size="lg"
              className="rounded-full px-6"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Start Over
            </Button>
            <a 
              href={mediaUrl.url} 
              download={mediaUrl.type === 'video' ? `webcam-${new Date().getTime()}.mp4` : `snapshot-${new Date().getTime()}.png`}
              className="inline-flex items-center justify-center font-sans font-medium transition-all active:scale-[0.97] h-12 px-8 text-[17px] rounded-full bg-primary text-dark hover:brightness-110 shadow-sm"
            >
              <Download className="w-5 h-5 mr-2" />
              Download {mediaUrl.type === 'video' ? 'Video' : 'Photo'}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
