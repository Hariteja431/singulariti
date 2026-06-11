'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Upload, X, Download, ChevronUp, ChevronDown, Play, Loader2 } from 'lucide-react';

interface Frame {
  id: string;
  src: string;
  name: string;
  delay: number; // ms
}

export function GifMakerClient() {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [globalDelay, setGlobalDelay] = useState(100);
  const [loops, setLoops] = useState(0); // 0 = infinite
  const [maxWidth, setMaxWidth] = useState(640);
  const [isGenerating, setIsGenerating] = useState(false);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [gifSize, setGifSize] = useState<number>(0);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLImageElement>(null);

  const loadImage = (file: File): Promise<Frame> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          id: `${Date.now()}-${Math.random()}`,
          src: e.target?.result as string,
          name: file.name,
          delay: globalDelay,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArr = Array.from(files).filter(f =>
      f.type.startsWith('image/') && !f.name.toLowerCase().endsWith('.gif')
    );
    if (!fileArr.length) { setError('Please upload JPG, PNG, or WebP images (not GIFs).'); return; }
    if (frames.length + fileArr.length > 50) { setError('Maximum 50 frames allowed.'); return; }
    setError('');
    try {
      const newFrames = await Promise.all(fileArr.map(loadImage));
      setFrames(prev => [...prev, ...newFrames]);
      setGifUrl(null);
    } catch {
      setError('Failed to load one or more images.');
    }
  }, [frames.length, globalDelay]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const moveFrame = (idx: number, dir: -1 | 1) => {
    const next = idx + dir;
    if (next < 0 || next >= frames.length) return;
    setFrames(prev => {
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr;
    });
    setGifUrl(null);
  };

  const removeFrame = (id: string) => {
    setFrames(prev => prev.filter(f => f.id !== id));
    setGifUrl(null);
  };

  const updateFrameDelay = (id: string, delay: number) => {
    setFrames(prev => prev.map(f => f.id === id ? { ...f, delay } : f));
    setGifUrl(null);
  };

  const applyGlobalDelay = () => {
    setFrames(prev => prev.map(f => ({ ...f, delay: globalDelay })));
    setGifUrl(null);
  };

  const generateGif = async () => {
    if (frames.length < 2) { setError('Add at least 2 frames to create a GIF.'); return; }
    setError('');
    setIsGenerating(true);
    setProgress(0);
    setGifUrl(null);

    try {
      // @ts-ignore
      const { GIFEncoder, quantize, applyPalette } = await import('gifenc');

      // Render each frame to canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      // Determine GIF dimensions from first frame
      const firstImg = await new Promise<HTMLImageElement>((res, rej) => {
        const img = new Image();
        img.onload = () => res(img);
        img.onerror = rej;
        img.src = frames[0].src;
      });

      const ratio = Math.min(1, maxWidth / firstImg.naturalWidth);
      const width = Math.round(firstImg.naturalWidth * ratio);
      const height = Math.round(firstImg.naturalHeight * ratio);
      canvas.width = width;
      canvas.height = height;

      const gif = GIFEncoder();

      for (let i = 0; i < frames.length; i++) {
        setProgress(Math.round((i / frames.length) * 90));
        const frame = frames[i];
        const img = await new Promise<HTMLImageElement>((res, rej) => {
          const im = new Image();
          im.onload = () => res(im);
          im.onerror = rej;
          im.src = frame.src;
        });
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const { data } = imageData;
        // Convert to RGB array for gifenc
        const pixels = new Uint8Array(width * height * 4);
        for (let j = 0; j < data.length; j++) pixels[j] = data[j];
        const palette = quantize(pixels, 256, { format: 'rgba4444' });
        const index = applyPalette(pixels, palette, 'rgba4444');
        gif.writeFrame(index, width, height, {
          palette,
          delay: frame.delay,
          repeat: loops,
        });
      }

      gif.finish();
      setProgress(100);
      const bytes = gif.bytes();
      const blob = new Blob([bytes], { type: 'image/gif' });
      const url = URL.createObjectURL(blob);
      setGifUrl(url);
      setGifSize(bytes.length);
    } catch (err) {
      console.error('GIF generation error:', err);
      setError('GIF generation failed. Try reducing the number of frames or image size.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadGif = () => {
    if (!gifUrl) return;
    const a = document.createElement('a');
    a.href = gifUrl;
    a.download = 'singulariti-animated.gif';
    a.click();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  return (
    <>
      <Header />
      <main className="flex-1 w-full pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Page Header */}
          <div className="mb-8">
            <nav className="text-[12px] text-slate mb-4 font-sans">
              <a href="/image" className="hover:text-primary transition-colors">Image Tools</a>
              <span className="mx-2">/</span>
              <a href="/image/animation" className="hover:text-primary transition-colors">Animation Tools</a>
              <span className="mx-2">/</span>
              <span className="text-ink">GIF Maker</span>
            </nav>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-ink mb-2">GIF Maker</h1>
            <p className="text-slate font-sans">Create animated GIFs from multiple images. Drag frames to reorder. 100% browser-based — no uploads.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Settings + Upload */}
            <div className="space-y-4">
              {/* Upload Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-colors ${
                  isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-surface/50'
                }`}
              >
                <Upload className="w-8 h-8 text-slate" />
                <div className="text-center">
                  <p className="font-medium text-ink text-sm">Add Images</p>
                  <p className="text-xs text-slate mt-1">JPG, PNG, WebP — up to 50 frames</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={e => e.target.files && handleFiles(e.target.files)}
                />
              </div>

              {/* Settings */}
              <div className="bg-background border border-border rounded-2xl p-5 space-y-4 font-sans">
                <h3 className="font-bold text-ink text-[13px] uppercase tracking-wider">GIF Settings</h3>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label className="text-[12px] font-bold text-slate">Frame Delay</label>
                    <span className="text-[12px] font-bold text-primary">{globalDelay}ms ({(1000/globalDelay).toFixed(1)} fps)</span>
                  </div>
                  <input type="range" min={50} max={2000} step={50} value={globalDelay}
                    onChange={e => setGlobalDelay(Number(e.target.value))}
                    className="w-full accent-primary" />
                  <button onClick={applyGlobalDelay} className="text-[12px] text-primary hover:underline">
                    Apply to all frames
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <label className="text-[12px] font-bold text-slate">Max Width</label>
                    <span className="text-[12px] font-bold text-primary">{maxWidth}px</span>
                  </div>
                  <input type="range" min={160} max={1280} step={80} value={maxWidth}
                    onChange={e => { setMaxWidth(Number(e.target.value)); setGifUrl(null); }}
                    className="w-full accent-primary" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate">Loop Count</label>
                  <select
                    value={loops}
                    onChange={e => { setLoops(Number(e.target.value)); setGifUrl(null); }}
                    className="w-full p-2 bg-surface border border-border rounded-lg text-ink text-sm outline-none"
                  >
                    <option value={0}>Infinite loop</option>
                    <option value={1}>Play once</option>
                    <option value={3}>3 times</option>
                    <option value={5}>5 times</option>
                  </select>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateGif}
                disabled={isGenerating || frames.length < 2}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-base hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Generating... {progress}%</>
                ) : (
                  <><Play className="w-5 h-5" /> Create GIF ({frames.length} frames)</>
                )}
              </button>

              {error && <p className="text-sm text-red-500 font-medium text-center">{error}</p>}
            </div>

            {/* Center: Frame Timeline */}
            <div className="space-y-3">
              <h3 className="font-bold text-ink text-[13px] uppercase tracking-wider font-sans">
                Frames ({frames.length}/50)
              </h3>
              {frames.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-border rounded-2xl text-slate text-sm">
                  <p>Add images to see frames here</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                  {frames.map((frame, i) => (
                    <div key={frame.id} className="flex items-center gap-3 p-3 bg-background border border-border rounded-xl">
                      <div className="flex flex-col gap-0.5">
                        <button onClick={() => moveFrame(i,-1)} disabled={i===0}
                          className="p-0.5 text-slate hover:text-ink disabled:opacity-30 transition-colors">
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <span className="text-[11px] font-bold text-slate text-center">{i+1}</span>
                        <button onClick={() => moveFrame(i,1)} disabled={i===frames.length-1}
                          className="p-0.5 text-slate hover:text-ink disabled:opacity-30 transition-colors">
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={frame.src} alt={frame.name} className="w-14 h-14 object-cover rounded-lg border border-border shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-medium text-ink truncate">{frame.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="number" min={50} max={5000} step={50} value={frame.delay}
                            onChange={e => updateFrameDelay(frame.id, Math.max(50, Number(e.target.value)))}
                            className="w-20 text-[12px] font-mono p-1 border border-border rounded bg-surface text-ink outline-none"
                          />
                          <span className="text-[11px] text-slate">ms</span>
                        </div>
                      </div>
                      <button onClick={() => removeFrame(frame.id)}
                        className="text-slate hover:text-red-400 transition-colors shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Preview */}
            <div className="space-y-4">
              <h3 className="font-bold text-ink text-[13px] uppercase tracking-wider font-sans">Preview</h3>
              {gifUrl ? (
                <div className="space-y-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={previewRef}
                    src={gifUrl}
                    alt="Generated GIF Preview"
                    className="w-full rounded-2xl border border-border"
                  />
                  <div className="p-4 bg-background border border-border rounded-xl space-y-3">
                    <div className="flex justify-between text-[12px]">
                      <span className="text-slate">File size</span>
                      <span className="font-bold text-ink">{formatSize(gifSize)}</span>
                    </div>
                    <div className="flex justify-between text-[12px]">
                      <span className="text-slate">Frames</span>
                      <span className="font-bold text-ink">{frames.length}</span>
                    </div>
                    <button
                      onClick={downloadGif}
                      className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" /> Download GIF
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-2xl text-slate text-sm gap-2">
                  <Play className="w-8 h-8" />
                  <p>GIF preview will appear here</p>
                  <p className="text-[12px]">Add frames and click Create GIF</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
