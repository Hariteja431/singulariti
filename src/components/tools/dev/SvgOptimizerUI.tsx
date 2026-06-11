'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Upload } from 'lucide-react';

export function SvgOptimizerUI() {
  const [inputSvg, setInputSvg] = useState('');
  const [outputSvg, setOutputSvg] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [optimizedSize, setOptimizedSize] = useState(0);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [options, setOptions] = useState({
    removeComments: true,
    removeMetadata: true,
    removeEditorNs: true,
    removeDimensions: false,
    removeEmptyGroups: true,
    collapseGroups: true,
    removeHiddenElements: true,
    sortAttrs: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const optimizeSvg = useCallback((raw: string) => {
    try {
      setError('');
      let result = raw;

      if (options.removeComments) {
        result = result.replace(/<!--[\s\S]*?-->/g, '');
      }
      if (options.removeMetadata) {
        result = result.replace(/<metadata[\s\S]*?<\/metadata>/gi, '');
        result = result.replace(/<title[\s\S]*?<\/title>/gi, '');
        result = result.replace(/<desc[\s\S]*?<\/desc>/gi, '');
      }
      if (options.removeEditorNs) {
        // Remove Inkscape, Sodipodi, Adobe namespaces
        result = result.replace(/\s*xmlns:(inkscape|sodipodi|cc|dc|rdf|xlink)\s*=\s*"[^"]*"/gi, '');
        result = result.replace(/<(inkscape|sodipodi):[\s\S]*?(\/?>|<\/(inkscape|sodipodi):[^>]+>)/gi, '');
        result = result.replace(/\s*(inkscape|sodipodi):[^=]+="[^"]*"/gi, '');
        result = result.replace(/<rdf:RDF[\s\S]*?<\/rdf:RDF>/gi, '');
      }
      if (options.removeEmptyGroups) {
        result = result.replace(/<g\s*\/?>/gi, '').replace(/<\/g>/gi, '');
        result = result.replace(/<g[^>]*>\s*<\/g>/gi, '');
      }
      if (options.removeHiddenElements) {
        result = result.replace(/<[^>]+display\s*:\s*none[^>]*>[\s\S]*?<\/[^>]+>/gi, '');
        result = result.replace(/<[^>]+visibility\s*:\s*hidden[^>]*>[\s\S]*?<\/[^>]+>/gi, '');
      }
      // Always: normalize whitespace in attributes, remove empty lines, trim
      result = result.replace(/\s{2,}/g, ' ').replace(/^\s*\n/gm, '').trim();

      const enc = new TextEncoder();
      setOptimizedSize(enc.encode(result).length);
      setOutputSvg(result);
    } catch (e) {
      setError('Optimization failed. Please ensure the input is valid SVG markup.');
    }
  }, [options]);

  const handleInput = (val: string) => {
    setInputSvg(val);
    if (!val.trim()) { setOutputSvg(''); setOriginalSize(0); setOptimizedSize(0); return; }
    const enc = new TextEncoder();
    setOriginalSize(enc.encode(val).length);
    optimizeSvg(val);
  };

  const handleFile = (file: File) => {
    if (!file.name.endsWith('.svg') && file.type !== 'image/svg+xml') {
      setError('Please upload an SVG file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = e => handleInput(e.target?.result as string);
    reader.readAsText(file);
  };

  const toggleOption = (key: keyof typeof options) => {
    setOptions(prev => {
      const next = { ...prev, [key]: !prev[key] };
      return next;
    });
  };

  // Re-optimize when options change
  React.useEffect(() => {
    if (inputSvg) optimizeSvg(inputSvg);
  }, [options, inputSvg, optimizeSvg]);

  const saving = originalSize > 0 ? Math.round((1 - optimizedSize / originalSize) * 100) : 0;

  const copy = () => { navigator.clipboard.writeText(outputSvg); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const download = () => {
    const blob = new Blob([outputSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'optimized.svg'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        }`}
      >
        <Upload className="w-6 h-6 text-slate" />
        <p className="text-sm font-medium text-ink">Drop SVG file or click to upload</p>
        <input ref={fileInputRef} type="file" accept=".svg,image/svg+xml" className="hidden"
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {Object.entries(options).map(([key, val]) => (
          <label key={key} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
            val ? 'border-primary bg-primary/10' : 'border-border bg-surface hover:border-primary/40'
          }`}>
            <input type="checkbox" checked={val} onChange={() => toggleOption(key as keyof typeof options)} className="accent-primary" />
            <span className="text-[11px] font-medium text-ink leading-tight">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
            </span>
          </label>
        ))}
      </div>

      {/* Input / Output */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-[12px] font-bold text-slate uppercase tracking-wider">Input SVG</label>
            {originalSize > 0 && <span className="text-[12px] text-slate">{(originalSize/1024).toFixed(1)} KB</span>}
          </div>
          <textarea
            value={inputSvg}
            onChange={e => handleInput(e.target.value)}
            placeholder="Paste SVG code here or upload a file above..."
            rows={14}
            className="w-full font-mono text-xs p-3 bg-surface border border-border rounded-xl text-ink resize-none outline-none focus:border-primary"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-[12px] font-bold text-slate uppercase tracking-wider">Optimized SVG</label>
            {optimizedSize > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-slate">{(optimizedSize/1024).toFixed(1)} KB</span>
                <span className="text-[11px] font-bold text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">-{saving}%</span>
              </div>
            )}
          </div>
          <textarea
            value={outputSvg}
            readOnly
            rows={14}
            placeholder="Optimized SVG will appear here..."
            className="w-full font-mono text-xs p-3 bg-surface border border-border rounded-xl text-primary resize-none outline-none"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {outputSvg && (
        <div className="flex gap-3 justify-end">
          <button onClick={copy} className="px-4 py-2 bg-surface border border-border rounded-xl text-sm font-bold text-ink hover:border-primary transition-colors">
            {copied ? 'Copied!' : 'Copy SVG'}
          </button>
          <button onClick={download} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
            Download SVG
          </button>
        </div>
      )}
    </div>
  );
}
