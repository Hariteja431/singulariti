"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Monitor, Square, Download, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '../../ui/Button';
import { ToolRegistryItem } from '../../../registry/types';

interface Props {
  tool: ToolRegistryItem;
}

export function ScreenRecorder({ tool }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      stopRecording(false);
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  const startRecording = async () => {
    setError(null);
    try {
      // Prompt user to select screen
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'monitor',
          frameRate: { ideal: 30, max: 60 },
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 }
        },
        audio: true,
      });

      // Try to capture microphone audio as well
      let micStream: MediaStream | null = null;
      try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err) {
        console.warn("Microphone access denied or unavailable, recording without mic.");
      }

      // Combine streams if mic is available
      const tracks = [...displayStream.getTracks()];
      if (micStream) {
        tracks.push(...micStream.getAudioTracks());
      }
      
      const combinedStream = new MediaStream(tracks);
      streamRef.current = combinedStream;

      // Handle user clicking "Stop sharing" from the browser's native UI
      displayStream.getVideoTracks()[0].onended = () => {
        stopRecording(true);
      };

      // Show preview
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = combinedStream;
        videoPreviewRef.current.play();
      }

      let mimeType = 'video/webm';
      if (MediaRecorder.isTypeSupported('video/mp4')) {
        mimeType = 'video/mp4';
      } else if (MediaRecorder.isTypeSupported('video/webm; codecs=h264')) {
        mimeType = 'video/webm; codecs=h264';
      } else if (MediaRecorder.isTypeSupported('video/webm; codecs=vp9')) {
        mimeType = 'video/webm; codecs=vp9';
      }

      const mediaRecorder = new MediaRecorder(combinedStream, { 
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
        setVideoUrl(url);
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = null;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setVideoUrl(null);

    } catch (err: any) {
      console.warn("Error starting screen record:", err.message);
      if (err.name === 'NotAllowedError' || err.message?.includes('Permission denied')) {
        setError("Screen recording permission was denied or cancelled. Please try again and allow screen sharing.");
      } else {
        setError(err.message || "Failed to start screen recording. Please ensure you granted permissions.");
      }
    }
  };

  const stopRecording = (createFile: boolean = true) => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      if (!createFile) {
        mediaRecorderRef.current.onstop = null;
      }
      mediaRecorderRef.current.stop();
    }
    
    streamRef.current?.getTracks().forEach(track => track.stop());
    setIsRecording(false);
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-8 w-full shadow-sm flex flex-col items-center">
      <div className="w-full max-w-3xl flex flex-col items-center">
        
        {/* Error Alert */}
        {error && (
          <div className="w-full bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-6 flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Video Preview */}
        {!videoUrl && (
          <div className="w-full aspect-video bg-black rounded-xl overflow-hidden mb-6 relative shadow-inner">
            <video 
              ref={videoPreviewRef} 
              autoPlay
              playsInline
              className="w-full h-full object-contain"
              muted // Must mute preview to avoid echo
            />
            {!isRecording && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
                <Monitor className="w-16 h-16 mb-4 opacity-50" />
                <p className="font-medium text-lg">Click start to select a screen to record</p>
              </div>
            )}
            {isRecording && (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full text-white text-sm font-medium animate-pulse">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
                Recording
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        {!videoUrl && (
          <div className="flex items-center gap-4 mt-2">
            {!isRecording ? (
              <Button size="lg" onClick={startRecording} className="rounded-full px-8 h-14 text-base shadow-sm">
                <Monitor className="w-5 h-5 mr-2" />
                Start Recording
              </Button>
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

        {/* Playback & Download */}
        {videoUrl && !isRecording && (
          <div className="w-full animate-fade-in flex flex-col items-center">
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden mb-8 shadow-inner">
              <video src={videoUrl} controls className="w-full h-full object-contain" />
            </div>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => setVideoUrl(null)}
                size="lg"
                className="rounded-full px-6"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Record Another
              </Button>
              <a 
                href={videoUrl} 
                download={`screen-recording-${new Date().getTime()}.mp4`}
                className="inline-flex items-center justify-center font-sans font-medium transition-all active:scale-[0.97] h-12 px-8 text-[17px] rounded-full bg-primary text-dark hover:brightness-110 shadow-sm"
              >
                <Download className="w-5 h-5 mr-2" />
                Download MP4
              </a>
            </div>
            <p className="text-xs text-slate mt-6 text-center max-w-md">
              Your screen recording was processed securely on your device. It has not been uploaded to any server.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
