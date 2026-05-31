"use client";

import React, { useState } from 'react';
import { Copy, ExternalLink, Download, Check, Clipboard } from 'lucide-react';
import { Button } from '../ui/Button';
import { downloadBlob } from '../../lib/downloadHelpers';
import { QRScanResult } from '../../lib/qr/qrHelpers';

interface QRScannerResultProps {
  result: QRScanResult;
  onClear?: () => void;
}

export function QRScannerResult({ result, onClear }: QRScannerResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([result.rawText], { type: 'text/plain;charset=utf-8' });
    const safeName = result.rawText.substring(0, 15).replace(/[^a-zA-Z0-9]/g, '_') || 'qr_result';
    downloadBlob(blob, `${safeName}_qr_result.txt`);
  };

  const isUrl = result.type === 'url' || result.rawText.startsWith('http://') || result.rawText.startsWith('https://');

  return (
    <div className="bg-surface border border-border rounded-xl p-6 shadow-sm max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
        <div>
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-full">
            Detected: {result.type}
          </span>
          <h4 className="font-display font-bold text-lg text-ink mt-2">Scan Result</h4>
        </div>
        {onClear && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[11px] font-sans text-slate uppercase tracking-wider font-semibold mb-1">
            Formatted Description
          </label>
          <div className="p-3 bg-background border border-border rounded-lg text-sm text-ink font-sans leading-relaxed">
            {result.formattedOutput}
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-sans text-slate uppercase tracking-wider font-semibold mb-1">
            Raw Content
          </label>
          <pre className="p-3 bg-background border border-border rounded-lg text-[12px] text-slate font-mono whitespace-pre-wrap break-all max-h-[150px] overflow-y-auto">
            {result.rawText}
          </pre>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            leftIcon={copied ? <Check className="w-4 h-4 text-green-500" /> : <Clipboard className="w-4 h-4" />}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>

          {isUrl && (
            <a
              href={result.rawText.startsWith('http') ? result.rawText : `https://${result.rawText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ExternalLink className="w-4 h-4" />}
              >
                Open Link
              </Button>
            </a>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Download Text
          </Button>
        </div>
      </div>
    </div>
  );
}
