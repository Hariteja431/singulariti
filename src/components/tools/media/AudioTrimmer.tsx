"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Scissors, UploadCloud, Download, Play, Pause, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Dropzone } from '../../ui/Dropzone';
import { ToolRegistryItem } from '../../../registry/types';
import { convertAudioToMP3 } from '../../../lib/media/audioConverter';

interface Props {
  tool: ToolRegistryItem;
}

export function AudioTrimmer({ tool }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    // Initialize AudioContext on first user interaction or mount if allowed
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioContextRef.current = new AudioContextClass();
    
    return () => {
      stopPlayback();
      if (audioContextRef.current?.state !== 'closed') {
        audioContextRef.current?.close();
      }
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  const processFile = async (selectedFile: File) => {
    if (!selectedFile.type.startsWith('audio/')) {
      setError('Please select a valid audio file.');
      return;
    }
    
    setFile(selectedFile);
    setError(null);
    setIsProcessing(true);
    setResultUrl(null);
    
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      if (!audioContextRef.current) return;
      
      const buffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      setAudioBuffer(buffer);
      setDuration(buffer.duration);
      setEndTime(buffer.duration);
      setStartTime(0);
      setCurrentTime(0);
      drawWaveform(buffer);
    } catch (err: any) {
      console.warn("AudioTrimmer decode error:", err.message);
      setError('Failed to decode audio file. It might be corrupted or unsupported.');
    } finally {
      setIsProcessing(false);
    }
  };

  const drawWaveform = (buffer: AudioBuffer) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const data = buffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    const amp = height / 2;

    ctx.fillStyle = '#94a3b8'; // slate-400
    for (let i = 0; i < width; i++) {
      let min = 1.0;
      let max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = data[i * step + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      ctx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
    }
  };

  const togglePlayback = () => {
    if (!audioBuffer || !audioContextRef.current) return;

    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  const startPlayback = () => {
    if (!audioBuffer || !audioContextRef.current) return;
    
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);
    
    // Start from current time (or startTime if we are outside bounds)
    let playFrom = currentTime;
    if (playFrom < startTime || playFrom >= endTime) {
      playFrom = startTime;
    }

    source.start(0, playFrom, endTime - playFrom);
    sourceNodeRef.current = source;
    startTimeRef.current = audioContextRef.current.currentTime - playFrom;
    setIsPlaying(true);

    const updateTime = () => {
      if (!audioContextRef.current || !isPlaying) return;
      const t = audioContextRef.current.currentTime - startTimeRef.current;
      setCurrentTime(t);
      
      if (t >= endTime) {
        stopPlayback();
        setCurrentTime(startTime);
      } else {
        animationFrameRef.current = requestAnimationFrame(updateTime);
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(updateTime);
    
    source.onended = () => {
      // Handled by updateTime
    };
  };

  const stopPlayback = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.onended = null;
      try { sourceNodeRef.current.stop(); } catch(e) {}
      sourceNodeRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsPlaying(false);
  };

  const handleTrim = async () => {
    if (!audioBuffer || !audioContextRef.current) return;
    setIsProcessing(true);
    
    try {
      // Create new buffer
      const sampleRate = audioBuffer.sampleRate;
      const channels = audioBuffer.numberOfChannels;
      const startOffset = Math.floor(startTime * sampleRate);
      const endOffset = Math.floor(endTime * sampleRate);
      const frameCount = endOffset - startOffset;
      
      const newBuffer = audioContextRef.current.createBuffer(channels, frameCount, sampleRate);
      
      for (let i = 0; i < channels; i++) {
        const channelData = new Float32Array(frameCount);
        audioBuffer.copyFromChannel(channelData, i, startOffset);
        newBuffer.copyToChannel(channelData, i);
      }
      
      // We need to encode the newBuffer to WAV
      // Simple WAV encoder
      const wavBlob = bufferToWave(newBuffer, frameCount);
      const mp3Blob = await convertAudioToMP3(wavBlob);
      const url = URL.createObjectURL(mp3Blob);
      setResultUrl(url);
    } catch (err: any) {
      console.warn("AudioTrimmer trim error:", err.message);
      setError("Failed to trim audio.");
    } finally {
      setIsProcessing(false);
    }
  };

  const bufferToWave = (abuffer: AudioBuffer, len: number) => {
    const numOfChan = abuffer.numberOfChannels;
    const length = len * numOfChan * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);
    const channels = [], sampleRate = abuffer.sampleRate;
    let offset = 0;
    let pos = 0;

    // write WAVE header
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    setUint32(0x20746d66); // "fmt " chunk
    setUint32(16); // length = 16
    setUint16(1); // PCM (uncompressed)
    setUint16(numOfChan);
    setUint32(sampleRate);
    setUint32(sampleRate * 2 * numOfChan); // avg. bytes/sec
    setUint16(numOfChan * 2); // block-align
    setUint16(16); // 16-bit (hardcoded in this demo)

    setUint32(0x61746164); // "data" - chunk
    setUint32(length - pos - 4); // chunk length

    for (let i = 0; i < abuffer.numberOfChannels; i++)
      channels.push(abuffer.getChannelData(i));

    while (pos < length) {
      for (let i = 0; i < numOfChan; i++) {
        let sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
        view.setInt16(pos, sample, true); // write 16-bit sample
        pos += 2;
      }
      offset++; // next source sample
    }

    return new Blob([buffer], { type: "audio/wav" });

    function setUint16(data: number) {
      view.setUint16(pos, data, true);
      pos += 2;
    }

    function setUint32(data: number) {
      view.setUint32(pos, data, true);
      pos += 4;
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${m}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-8 w-full shadow-sm flex flex-col items-center">
      <div className="w-full max-w-3xl flex flex-col items-center">
        
        {error && (
          <div className="w-full bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-6 flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {!audioBuffer && !isProcessing && (
          <Dropzone
            onFileSelect={processFile}
            accept="audio/*"
            title="Drop your audio file here"
            subtitle="Supports MP3, WAV, AAC, M4A"
          />
        )}

        {isProcessing && !audioBuffer && (
          <div className="flex flex-col items-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-slate font-medium">Processing audio file...</p>
          </div>
        )}

        {audioBuffer && (
          <div className="w-full animate-fade-in flex flex-col items-center">
            
            {/* Custom Waveform & Playback UI */}
            <div className="w-full bg-slate-50 border border-border rounded-xl p-6 mb-8 relative">
              <div className="flex items-center justify-between mb-4">
                <Button variant="outline" size="sm" onClick={togglePlayback} className="rounded-full w-10 h-10 p-0 flex items-center justify-center text-ink">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-1" />}
                </Button>
                <div className="font-mono text-sm font-medium text-slate">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              {/* Waveform Canvas Container */}
              <div className="relative w-full h-24 mb-6">
                <canvas ref={canvasRef} className="w-full h-full rounded" width={800} height={100} />
                
                {/* Playhead */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none"
                  style={{ left: `${(currentTime / duration) * 100}%` }}
                />

                {/* Unselected regions overlay */}
                <div 
                  className="absolute top-0 bottom-0 left-0 bg-white/60 z-10 pointer-events-none"
                  style={{ width: `${(startTime / duration) * 100}%` }}
                />
                <div 
                  className="absolute top-0 bottom-0 right-0 bg-white/60 z-10 pointer-events-none"
                  style={{ width: `${(1 - endTime / duration) * 100}%` }}
                />
              </div>

              {/* Trimmer Controls */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate mb-2">Start Time (sec)</label>
                  <input 
                    type="number" 
                    min={0} 
                    max={endTime - 0.1} 
                    step={0.1}
                    value={startTime.toFixed(2)} 
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      if (!isNaN(v) && v < endTime) setStartTime(Math.max(0, v));
                    }}
                    className="w-full h-10 px-3 bg-white border border-border rounded-lg text-sm"
                  />
                  <input 
                    type="range" 
                    min={0} 
                    max={duration} 
                    step={0.1} 
                    value={startTime} 
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      if (v < endTime) setStartTime(v);
                    }}
                    className="w-full mt-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate mb-2">End Time (sec)</label>
                  <input 
                    type="number" 
                    min={startTime + 0.1} 
                    max={duration} 
                    step={0.1}
                    value={endTime.toFixed(2)} 
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      if (!isNaN(v) && v > startTime) setEndTime(Math.min(duration, v));
                    }}
                    className="w-full h-10 px-3 bg-white border border-border rounded-lg text-sm"
                  />
                  <input 
                    type="range" 
                    min={0} 
                    max={duration} 
                    step={0.1} 
                    value={endTime} 
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      if (v > startTime) setEndTime(v);
                    }}
                    className="w-full mt-2"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setAudioBuffer(null);
                  setFile(null);
                  setResultUrl(null);
                  stopPlayback();
                }}
                size="lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Select Another File
              </Button>
              <Button onClick={handleTrim} size="lg" disabled={isProcessing} className="px-8">
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Scissors className="w-4 h-4 mr-2" />
                )}
                Trim Audio
              </Button>
            </div>
            
            {resultUrl && (
              <div className="mt-8 p-6 bg-green-50 border border-green-100 rounded-xl w-full flex flex-col items-center animate-fade-in">
                <p className="text-green-800 font-medium mb-4">Audio trimmed successfully!</p>
                <audio src={resultUrl} controls className="w-full max-w-sm mb-4" />
                <a 
                  href={resultUrl} 
                  download={`trimmed-${file?.name || 'audio'}.mp3`}
                  className="inline-flex items-center justify-center font-sans font-medium transition-all active:scale-[0.97] h-12 px-8 text-[17px] rounded-full bg-primary text-dark hover:brightness-110 shadow-sm"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download MP3
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
