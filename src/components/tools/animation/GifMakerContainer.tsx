"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ToolRegistryItem } from '../../../registry/types';
import { FileUploader } from '../FileUploader';
import { Button } from '../../ui/Button';
import { 
  Trash2, ArrowLeft, ArrowRight, Download, Plus, 
  Settings2, Loader2, Image as ImageIcon, Play
} from 'lucide-react';
import { GIFEncoder, quantize, applyPalette } from 'gifenc';

interface GifMakerContainerProps {
  tool: ToolRegistryItem;
}

interface Frame {
  id: string;
  file: File;
  previewUrl: string;
}

export function GifMakerContainer({ tool }: GifMakerContainerProps) {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [width, setWidth] = useState<number>(500);
  const [height, setHeight] = useState<number>(500);
  const [delay, setDelay] = useState<number>(500); // ms per frame
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-detect dimensions from first frame if not explicitly set
  const firstFrameAdded = useRef(false);

  useEffect(() => {
    return () => {
      // Cleanup URLs
      frames.forEach(f => URL.revokeObjectURL(f.previewUrl));
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilesSelected = (files: File[]) => {
    const newFrames = files.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      previewUrl: URL.createObjectURL(file)
    }));
    
    setFrames(prev => [...prev, ...newFrames]);
    
    // Auto-detect dimensions from first image
    if (!firstFrameAdded.current && newFrames.length > 0) {
      firstFrameAdded.current = true;
      const img = new Image();
      img.onload = () => {
        // Cap max dimensions to 800x800 to prevent crashing the browser
        let w = img.naturalWidth;
        let h = img.naturalHeight;
        if (w > 800 || h > 800) {
          const ratio = Math.min(800 / w, 800 / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }
        setWidth(w);
        setHeight(h);
      };
      img.src = newFrames[0].previewUrl;
    }
    
    setError(null);
    setResultUrl(null);
  };

  const removeFrame = (id: string) => {
    setFrames(prev => {
      const idx = prev.findIndex(f => f.id === id);
      if (idx !== -1) URL.revokeObjectURL(prev[idx].previewUrl);
      return prev.filter(f => f.id !== id);
    });
    setResultUrl(null);
  };

  const moveFrame = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index > 0) {
      setFrames(prev => {
        const arr = [...prev];
        [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
        return arr;
      });
    } else if (direction === 'right' && index < frames.length - 1) {
      setFrames(prev => {
        const arr = [...prev];
        [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
        return arr;
      });
    }
    setResultUrl(null);
  };

  const generateGif = async () => {
    if (frames.length === 0) {
      setError("Please add at least one frame.");
      return;
    }
    if (width < 10 || height < 10 || width > 2000 || height > 2000) {
      setError("Width and height must be between 10px and 2000px.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Use setTimeout to allow UI to update to loading state
      await new Promise(resolve => setTimeout(resolve, 50));

      const gif = GIFEncoder();
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      if (!ctx) throw new Error("Could not initialize canvas context");

      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        
        // Load image
        const img = new Image();
        img.crossOrigin = "anonymous";
        const imgLoadPromise = new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        img.src = frame.previewUrl;
        await imgLoadPromise;

        // Clear and fill background (white)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // Draw image (contain logic)
        const scale = Math.min(width / img.width, height / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (width - w) / 2;
        const y = (height - h) / 2;
        ctx.drawImage(img, x, y, w, h);

        // Extract pixel data
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        // Quantize colors (256 colors max)
        const palette = quantize(data, 256, { format: 'rgba4444' });
        const index = applyPalette(data, palette, { format: 'rgba4444' });

        // Write frame
        gif.writeFrame(index, width, height, { palette, delay });
      }

      gif.finish();
      const bytes = gif.bytesView();
      const blob = new Blob([bytes], { type: 'image/gif' });
      
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));

    } catch (err) {
      console.error(err);
      setError("Failed to generate GIF. The images might be too large or corrupted.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = 'singulariti_animated.gif';
    a.click();
  };

  const clearAll = () => {
    frames.forEach(f => URL.revokeObjectURL(f.previewUrl));
    setFrames([]);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setError(null);
    firstFrameAdded.current = false;
  };

  return (
    <div className="w-full max-w-6xl mx-auto my-6 px-2">
      {frames.length === 0 ? (
        <FileUploader
          onFilesSelected={handleFilesSelected}
          multiple={true}
          accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'] }}
          title={`Upload images to ${tool.name.toLowerCase()}`}
          subtitle="Select multiple JPG, PNG, or WEBP files. You can add more later."
        />
      ) : (
        <div className="bg-surface border border-border rounded-xl p-5 md:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
            <div>
              <p className="font-sans text-[11px] font-bold text-slate uppercase tracking-wider mb-0.5">GIF Animation Studio</p>
              <h4 className="font-display font-bold text-base text-ink">{frames.length} frames selected</h4>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={clearAll} leftIcon={<Trash2 className="w-3.5 h-3.5" />}>
                Clear All
              </Button>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg flex items-center">
              <span className="font-medium">{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Settings & Frames */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Settings Panel */}
              <div className="bg-background border border-border rounded-lg p-4">
                <h5 className="font-display font-bold text-xs text-ink flex items-center uppercase tracking-wider mb-4">
                  <Settings2 className="w-4 h-4 mr-2 text-primary" /> Output Settings
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-sans font-bold text-slate uppercase tracking-wider mb-1.5">Width (px)</label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => { setWidth(Number(e.target.value)); setResultUrl(null); }}
                      className="w-full h-9 px-3 bg-surface border border-border rounded-lg text-sm text-ink outline-none focus:border-primary transition-colors font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-sans font-bold text-slate uppercase tracking-wider mb-1.5">Height (px)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => { setHeight(Number(e.target.value)); setResultUrl(null); }}
                      className="w-full h-9 px-3 bg-surface border border-border rounded-lg text-sm text-ink outline-none focus:border-primary transition-colors font-mono"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[10px] font-sans font-bold text-slate uppercase tracking-wider mb-1.5">Frame Delay (ms)</label>
                    <input
                      type="number"
                      value={delay}
                      step={50}
                      min={20}
                      onChange={(e) => { setDelay(Number(e.target.value)); setResultUrl(null); }}
                      className="w-full h-9 px-3 bg-surface border border-border rounded-lg text-sm text-ink outline-none focus:border-primary transition-colors font-mono"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate mt-3 leading-relaxed">
                  Default delay is 500ms (2 FPS). 100ms = 10 FPS. Lower delay means faster animation.
                </p>
              </div>

              {/* Frames Timeline */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-display font-bold text-xs text-ink flex items-center uppercase tracking-wider">
                    <ImageIcon className="w-4 h-4 mr-2 text-primary" /> Frames Sequence
                  </h5>
                  <label className="cursor-pointer">
                    <span className="flex items-center text-xs font-bold text-primary hover:text-primary/80 transition-colors">
                      <Plus className="w-3.5 h-3.5 mr-1" /> Add Frames
                    </span>
                    <input 
                      type="file" 
                      multiple 
                      accept="image/jpeg, image/png, image/webp" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files) handleFilesSelected(Array.from(e.target.files));
                        e.target.value = '';
                      }}
                    />
                  </label>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {frames.map((frame, index) => (
                    <div key={frame.id} className="group relative aspect-square bg-background border border-border rounded-lg overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={frame.previewUrl} alt={`Frame ${index + 1}`} className="w-full h-full object-cover" />
                      
                      {/* Frame Number Badge */}
                      <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] font-mono px-1.5 py-0.5 rounded backdrop-blur-sm z-10">
                        {index + 1}
                      </div>
                      
                      {/* Controls Overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        <div className="flex gap-1">
                          <button 
                            disabled={index === 0}
                            onClick={() => moveFrame(index, 'left')}
                            className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded disabled:opacity-30 disabled:hover:bg-white/10 transition-colors"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => removeFrame(frame.id)}
                            className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            disabled={index === frames.length - 1}
                            onClick={() => moveFrame(index, 'right')}
                            className="p-1.5 bg-white/10 hover:bg-white/20 text-white rounded disabled:opacity-30 disabled:hover:bg-white/10 transition-colors"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Preview & Generate */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="bg-background border border-border rounded-xl p-4 flex-1 flex flex-col min-h-[400px]">
                <h5 className="font-display font-bold text-xs text-ink flex items-center justify-between uppercase tracking-wider mb-4">
                  <span className="flex items-center"><Play className="w-4 h-4 mr-2 text-primary" /> Output Preview</span>
                  {resultUrl && <span className="bg-green-500/10 text-green-600 px-2 py-0.5 rounded text-[10px]">Ready</span>}
                </h5>
                
                <div className="flex-1 bg-surface border border-border border-dashed rounded-lg flex flex-col items-center justify-center p-4 relative overflow-hidden">
                  {isProcessing ? (
                    <div className="flex flex-col items-center gap-3 text-primary">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <span className="text-sm font-medium">Encoding GIF...</span>
                    </div>
                  ) : resultUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={resultUrl} alt="Generated GIF" className="max-w-full max-h-[400px] object-contain shadow-md rounded" />
                  ) : (
                    <div className="text-center text-slate max-w-xs">
                      <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="text-sm font-sans">Click "Generate GIF" to compile your frames into an animation.</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex flex-col gap-3 pt-4 border-t border-border">
                  <Button 
                    variant="primary" 
                    className="w-full"
                    onClick={generateGif}
                    isLoading={isProcessing}
                    leftIcon={<Play className="w-4 h-4" />}
                  >
                    Generate GIF
                  </Button>
                  
                  {resultUrl && (
                    <Button 
                      variant="outline" 
                      className="w-full border-primary text-primary hover:bg-primary/5"
                      onClick={handleDownload}
                      leftIcon={<Download className="w-4 h-4" />}
                    >
                      Download Result
                    </Button>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
