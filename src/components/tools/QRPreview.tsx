"use client";

import React, { useEffect, useState } from 'react';
import { generateQRDataURL, QRSettings } from '../../lib/qr/qrHelpers';
import { Loader2 } from 'lucide-react';

interface QRPreviewProps {
  value: string;
  settings: QRSettings;
  onDataUrlGenerated?: (url: string) => void;
}

export function QRPreview({ value, settings, onDataUrlGenerated }: QRPreviewProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function generate() {
      if (!value.trim()) {
        setQrDataUrl(null);
        return;
      }
      setGenerating(true);
      setError(null);

      try {
        const url = await generateQRDataURL(value, settings);
        if (active) {
          setQrDataUrl(url);
          setGenerating(false);
          if (onDataUrlGenerated) {
            onDataUrlGenerated(url);
          }
        }
      } catch (err: any) {
        console.error('Error generating QR preview: ', err);
        if (active) {
          setError('Failed to generate QR');
          setGenerating(false);
        }
      }
    }

    generate();

    return () => {
      active = false;
    };
  }, [value, settings, onDataUrlGenerated]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-surface border border-border rounded-xl aspect-square w-full max-w-[280px] mx-auto shadow-sm relative overflow-hidden">
      {generating && !qrDataUrl && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface/80 backdrop-blur-xs z-10">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {error ? (
        <div className="text-red-500 text-sm text-center font-sans p-4">{error}</div>
      ) : qrDataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={qrDataUrl}
          alt="QR Code Preview"
          className="max-w-full max-h-full object-contain rounded animate-in fade-in duration-200"
          style={{ width: `${settings.size}px`, height: `${settings.size}px` }}
        />
      ) : (
        <span className="text-slate text-sm font-sans text-center">Fill out the fields to preview QR Code</span>
      )}
    </div>
  );
}
