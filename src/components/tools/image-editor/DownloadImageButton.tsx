import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { Button } from '../../ui/Button';

export interface DownloadParams {
  fileName: string;
  format: 'image/png' | 'image/jpeg' | 'image/webp';
  quality: number;
}

interface DownloadImageButtonProps {
  defaultFileName: string;
  onDownload: (params: DownloadParams) => void;
  isProcessing: boolean;
}

export function DownloadImageButton({
  defaultFileName,
  onDownload,
  isProcessing
}: DownloadImageButtonProps) {
  const [fileName, setFileName] = useState(defaultFileName);
  const [format, setFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');
  const [quality, setQuality] = useState(90);

  // Keep file name in sync if user changes original file
  useEffect(() => {
    setFileName(defaultFileName);
  }, [defaultFileName]);

  const handleDownloadClick = () => {
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
    onDownload({
      fileName: nameWithoutExt,
      format,
      quality
    });
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-5 shadow-xs flex flex-col gap-4 w-full">
      <div className="border-b border-border pb-1.5">
        <h5 className="text-[11px] font-display font-bold text-slate uppercase tracking-wider">
          Export Configurations
        </h5>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="block text-[10px] font-sans font-bold text-slate uppercase tracking-wider">File Name</label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full h-10 px-3 bg-background border border-border rounded-lg text-xs text-ink outline-none focus:border-primary"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-sans font-bold text-slate uppercase tracking-wider">Output Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as any)}
            className="w-full h-10 px-3 bg-background border border-border rounded-lg text-xs"
          >
            <option value="image/png">PNG (Lossless)</option>
            <option value="image/jpeg">JPG (Compressed)</option>
            <option value="image/webp">WEBP (High Efficiency)</option>
          </select>
        </div>

        {format !== 'image/png' ? (
          <div className="space-y-1 animate-in fade-in duration-200">
            <div className="flex justify-between text-[10px] font-sans font-bold text-slate uppercase">
              <span>Compression Quality</span>
              <span>{quality}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full h-10 accent-primary"
            />
          </div>
        ) : (
          <div className="flex items-center text-[11px] text-slate font-sans italic pt-6 sm:pl-2 select-none">
            PNG format exports at maximum quality
          </div>
        )}
      </div>

      <Button
        variant="primary"
        size="lg"
        onClick={handleDownloadClick}
        isLoading={isProcessing}
        className="w-full mt-2"
        leftIcon={<Download className="w-5 h-5" />}
      >
        Download Final Image
      </Button>
    </div>
  );
}
