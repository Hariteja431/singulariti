'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Upload, Download, X, Loader2, CheckCircle } from 'lucide-react';

interface ConvertedFile {
  id: string;
  originalName: string;
  originalSize: number;
  url: string;
  size: number;
  status: 'converting' | 'done' | 'error';
  error?: string;
}

export function HeicConverterClient() {
  const [files, setFiles] = useState<ConvertedFile[]>([]);
  const [quality, setQuality] = useState(0.85);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const processFiles = useCallback(async (rawFiles: File[]) => {
    const heicFiles = rawFiles.filter(f =>
      f.name.toLowerCase().endsWith('.heic') ||
      f.name.toLowerCase().endsWith('.heif') ||
      f.type === 'image/heic' ||
      f.type === 'image/heif'
    );
    if (!heicFiles.length) {
      setFiles(prev => [{ id: `${Date.now()}`, originalName: 'Invalid file', originalSize: 0, url: '', size: 0, status: 'error', error: 'Please upload HEIC/HEIF files only' }]);
      return;
    }

    setIsConverting(true);
    const initial: ConvertedFile[] = heicFiles.map(f => ({
      id: `${Date.now()}-${Math.random()}`,
      originalName: f.name,
      originalSize: f.size,
      url: '', size: 0, status: 'converting'
    }));
    setFiles(initial);

    try {
      const heic2any = (await import('heic2any')).default;
      const updated = await Promise.all(
        heicFiles.map(async (file, i) => {
          try {
            const blob = await heic2any({ blob: file, toType: 'image/jpeg', quality }) as Blob;
            const url = URL.createObjectURL(blob);
            return { ...initial[i], url, size: blob.size, status: 'done' as const };
          } catch (err) {
            return { ...initial[i], status: 'error' as const, error: 'Conversion failed. File may be corrupted.' };
          }
        })
      );
      setFiles(updated);
    } catch (err) {
      setFiles(initial.map(f => ({ ...f, status: 'error', error: 'heic2any failed to load.' })));
    } finally {
      setIsConverting(false);
    }
  }, [quality]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(Array.from(e.dataTransfer.files));
  }, [processFiles]);

  const downloadAll = () => {
    files.filter(f => f.status === 'done').forEach(f => {
      const a = document.createElement('a');
      a.href = f.url;
      a.download = f.originalName.replace(/\.heic$/i, '.jpg').replace(/\.heif$/i, '.jpg');
      a.click();
    });
  };

  const doneFiles = files.filter(f => f.status === 'done');

  return (
    <>
      <Header />
      <main className="flex-1 w-full pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-8">
            <nav className="text-[12px] text-slate mb-4 font-sans">
              <a href="/image" className="hover:text-primary">Image Tools</a>
              <span className="mx-2">/</span>
              <span className="text-ink">HEIC to JPG</span>
            </nav>
            <h1 className="font-display font-bold text-3xl md:text-4xl text-ink mb-2">HEIC to JPG Converter</h1>
            <p className="text-slate font-sans">Convert Apple iPhone HEIC photos to universally compatible JPG format. No upload — everything runs in your browser.</p>
          </div>

          {/* Quality Slider */}
          <div className="bg-background border border-border rounded-2xl p-5 mb-5 space-y-3 font-sans">
            <div className="flex justify-between">
              <label className="text-[12px] font-bold text-slate uppercase tracking-wider">Output Quality</label>
              <span className="text-[12px] font-bold text-primary">{Math.round(quality * 100)}%</span>
            </div>
            <input type="range" min={0.5} max={1} step={0.05} value={quality}
              onChange={e => setQuality(Number(e.target.value))}
              className="w-full accent-primary" />
            <div className="flex justify-between text-[11px] text-slate">
              <span>50% (smaller)</span><span>85% (recommended)</span><span>100% (lossless)</span>
            </div>
          </div>

          {/* Upload Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            className={`flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-2xl p-10 cursor-pointer mb-5 transition-colors ${
              isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
          >
            <Upload className="w-10 h-10 text-slate" />
            <div className="text-center">
              <p className="font-semibold text-ink">Drop HEIC files here or click to browse</p>
              <p className="text-sm text-slate mt-1">Supports .heic and .heif formats — batch conversion supported</p>
            </div>
            <input ref={fileInputRef} type="file" accept=".heic,.heif,image/heic,image/heif" multiple className="hidden"
              onChange={e => e.target.files && processFiles(Array.from(e.target.files))} />
          </div>

          {/* Results */}
          {files.length > 0 && (
            <div className="space-y-3">
              {doneFiles.length > 1 && (
                <div className="flex justify-end">
                  <button onClick={downloadAll}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors">
                    <Download className="w-4 h-4" /> Download All ({doneFiles.length})
                  </button>
                </div>
              )}
              {files.map(file => (
                <div key={file.id} className={`p-4 rounded-xl border font-sans ${
                  file.status === 'done' ? 'bg-background border-border'
                  : file.status === 'error' ? 'bg-red-500/5 border-red-500/30'
                  : 'bg-surface border-border'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {file.status === 'converting' && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
                      {file.status === 'done' && <CheckCircle className="w-5 h-5 text-green-400" />}
                      {file.status === 'error' && <X className="w-5 h-5 text-red-400" />}
                      <div>
                        <p className="text-sm font-medium text-ink">{file.originalName}</p>
                        {file.status === 'done' && (
                          <p className="text-[11px] text-slate">
                            {formatSize(file.originalSize)} → {formatSize(file.size)}
                            <span className="ml-2 text-green-400 font-bold">
                              -{Math.round((1 - file.size / file.originalSize) * 100)}% saved
                            </span>
                          </p>
                        )}
                        {file.status === 'error' && <p className="text-[11px] text-red-400">{file.error}</p>}
                        {file.status === 'converting' && <p className="text-[11px] text-slate">Converting...</p>}
                      </div>
                    </div>
                    {file.status === 'done' && (
                      <a
                        href={file.url}
                        download={file.originalName.replace(/\.heic$/i, '.jpg').replace(/\.heif$/i, '.jpg')}
                        className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 text-primary rounded-lg text-[12px] font-bold hover:bg-primary hover:text-white transition-colors"
                      >
                        <Download className="w-4 h-4" /> JPG
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
