"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Download, RefreshCw, Play, Pause, AlertCircle } from 'lucide-react';
import { Button } from '../../ui/Button';
import { ToolRegistryItem } from '../../../registry/types';
import { convertAudioToMP3 } from '../../../lib/media/audioConverter';

interface Props {
  tool: ToolRegistryItem;
}

export function VoiceRecorder({ tool }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopRecording(false);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }
    };
  }, [audioUrl]);

  const drawVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = 'rgb(248, 250, 252)'; // Tailwind slate-50 roughly, matching bg-surface
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(59, 130, 246)'; // Tailwind blue-500
      canvasCtx.beginPath();

      const sliceWidth = canvas.width * 1.0 / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };

    draw();
  };

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Set up AudioContext for visualization
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContext();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyserRef.current = analyser;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 2048;
      drawVisualizer();

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        try {
          const type = mediaRecorder.mimeType || 'audio/webm';
          const audioBlob = new Blob(audioChunksRef.current, { type });
          const mp3Blob = await convertAudioToMP3(audioBlob);
          const url = URL.createObjectURL(mp3Blob);
          setAudioUrl(url);
        } catch (err) {
          console.error("MP3 conversion failed:", err);
          setError("Failed to encode MP3. Downloading raw format instead.");
          const type = mediaRecorder.mimeType || 'audio/webm';
          const fallbackBlob = new Blob(audioChunksRef.current, { type });
          const url = URL.createObjectURL(fallbackBlob);
          setAudioUrl(url);
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      setAudioUrl(null);

      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.warn("Error accessing microphone:", err.message);
      if (err.name === 'NotAllowedError' || err.message?.includes('Permission denied')) {
        setError("Microphone access was denied. Please allow microphone access in your browser settings (usually the lock icon in the address bar) and try again.");
      } else {
        setError(err.message || "Microphone access denied or unavailable.");
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    } else if (mediaRecorderRef.current?.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = (createFile: boolean = true) => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      if (!createFile) {
        mediaRecorderRef.current.onstop = null; // Prevent file creation if discarded
      }
      mediaRecorderRef.current.stop();
    }
    
    streamRef.current?.getTracks().forEach(track => track.stop());
    setIsRecording(false);
    setIsPaused(false);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current?.state !== 'closed') {
      audioContextRef.current?.close();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-8 w-full shadow-sm flex flex-col items-center">
      <div className="w-full max-w-xl flex flex-col items-center">
        {error && (
          <div className="w-full bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-6 flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Visualizer Canvas */}
        <div className="w-full h-32 bg-slate-50 border border-border rounded-xl mb-6 overflow-hidden flex items-center justify-center relative">
          <canvas ref={canvasRef} className="w-full h-full" width={600} height={128} />
          {!isRecording && !audioUrl && (
            <div className="absolute inset-0 flex items-center justify-center text-slate">
              <Mic className="w-8 h-8 opacity-20" />
            </div>
          )}
        </div>

        {/* Timer */}
        <div className="text-4xl font-display font-bold text-ink mb-8 font-mono">
          {formatTime(recordingTime)}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {!isRecording && !audioUrl && (
            <Button size="lg" onClick={startRecording} className="rounded-full w-16 h-16 p-0 flex items-center justify-center">
              <Mic className="w-6 h-6" />
            </Button>
          )}

          {isRecording && (
            <>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={pauseRecording} 
                className="rounded-full w-14 h-14 p-0 flex items-center justify-center text-ink"
              >
                {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
              </Button>
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => stopRecording(true)} 
                className="rounded-full w-16 h-16 p-0 flex items-center justify-center bg-red-500 hover:bg-red-600 border-none text-white shadow-lg"
              >
                <Square className="w-6 h-6 fill-current" />
              </Button>
            </>
          )}
        </div>

        {/* Playback & Download */}
        {isProcessing && (
          <div className="w-full mt-8 flex flex-col items-center animate-fade-in">
            <RefreshCw className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-slate font-medium">Encoding to MP3...</p>
          </div>
        )}
        {audioUrl && !isRecording && !isProcessing && (
          <div className="w-full mt-8 flex flex-col items-center animate-fade-in">
            <audio src={audioUrl} controls className="w-full mb-6" />
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setAudioUrl(null);
                  setRecordingTime(0);
                }}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Record Again
              </Button>
              <a 
                href={audioUrl} 
                download={`recording-${new Date().getTime()}.mp3`}
                className="inline-flex items-center justify-center font-sans font-medium transition-all active:scale-[0.97] h-10 px-4 text-[15px] rounded-md bg-primary text-dark hover:brightness-110"
              >
                <Download className="w-4 h-4 mr-2" />
                Download MP3
              </a>
            </div>
            <p className="text-xs text-slate mt-4 text-center">
              Your audio was processed completely on your device. It has not been uploaded to any server.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
