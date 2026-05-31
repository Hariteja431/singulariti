"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ToolRegistryItem } from '../../registry/types';
import { Dropzone } from '../ui/Dropzone';
import { Button } from '../ui/Button';
import { Download, Copy, CheckCircle2, Code2, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface DeveloperEngineProps {
  tool: ToolRegistryItem;
}

export function DeveloperEngine({ tool }: DeveloperEngineProps) {
  const [file, setFile] = useState<File | null>(null);
  const [base64String, setBase64String] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    return () => {
      if (imagePreview && tool.id === 'image-to-base64') {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview, tool.id]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(base64String);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const processFileToBase64 = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    
    const url = URL.createObjectURL(selectedFile);
    setImagePreview(url);

    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64String(reader.result as string);
    };
    reader.onerror = () => {
      setError("Failed to read file.");
    };
    reader.readAsDataURL(selectedFile);
  };

  const processBase64ToImage = (val: string) => {
    setBase64String(val);
    setError(null);
    
    if (!val.trim()) {
      setImagePreview(null);
      return;
    }

    // Basic validation for base64 data URI
    if (!val.startsWith('data:image/')) {
      setError("Invalid Base64 format. It must start with 'data:image/...'");
      setImagePreview(null);
      return;
    }

    setImagePreview(val);
  };

  const handleDownload = () => {
    if (!imagePreview) return;
    
    // Extract mime type and extension from data URI
    let extension = 'png';
    const mimeMatch = imagePreview.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
    if (mimeMatch && mimeMatch.length > 1) {
      extension = mimeMatch[1].split('/')[1];
    }

    const a = document.createElement('a');
    a.href = imagePreview;
    a.download = `singulariti_decoded.${extension}`;
    a.click();
  };

  // Reset state when tool changes
  useEffect(() => {
    setFile(null);
    setBase64String('');
    setImagePreview(null);
    setError(null);
  }, [tool.id]);

  return (
    <div className="w-full max-w-5xl mx-auto my-12">
      
      {/* TOOL 1: IMAGE TO BASE64 */}
      {tool.id === 'image-to-base64' && (
        <>
          {!file ? (
            <Dropzone 
              onFileSelect={processFileToBase64} 
              title="Drop image to encode"
              subtitle="Get the Base64 data URI string"
            />
          ) : (
            <div className="bg-surface border border-border rounded-xl p-6 md:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
                <div>
                  <p className="font-sans text-[13px] text-slate mb-1">Encoding file</p>
                  <h4 className="font-display font-bold text-lg text-ink truncate max-w-md">{file.name}</h4>
                </div>
                <Button variant="outline" size="sm" onClick={() => setFile(null)}>
                  Start Over
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-display font-bold flex items-center text-ink mb-4"><Code2 className="w-5 h-5 mr-2" /> Base64 Output</h3>
                  
                  {error ? (
                    <div className="text-red-500 text-sm">{error}</div>
                  ) : (
                    <div className="relative">
                      <textarea 
                        readOnly
                        value={base64String}
                        className="w-full h-[300px] bg-background border border-border rounded-lg p-4 font-mono text-[11px] text-slate resize-none focus:outline-primary"
                      />
                      <div className="absolute top-4 right-4">
                        <Button variant="primary" size="sm" onClick={copyToClipboard} leftIcon={copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}>
                          {copied ? 'Copied!' : 'Copy to Clipboard'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative rounded-lg border border-border bg-background overflow-hidden min-h-[300px] flex items-center justify-center">
                  {imagePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imagePreview} alt="Preview" className="max-w-full max-h-[400px] object-contain shadow-sm" />
                  ) : (
                    <span className="text-slate text-sm">Encoding...</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}


      {/* TOOL 2: BASE64 TO IMAGE */}
      {tool.id === 'base64-to-image' && (
        <div className="bg-surface border border-border rounded-xl p-6 md:p-8 shadow-sm">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold flex items-center text-ink"><Code2 className="w-5 h-5 mr-2" /> Base64 Input</h3>
                <Button variant="outline" size="sm" onClick={() => {
                  setBase64String('');
                  setImagePreview(null);
                  setError(null);
                }}>Clear</Button>
              </div>
              
              <textarea 
                value={base64String}
                onChange={(e) => processBase64ToImage(e.target.value)}
                placeholder="Paste your data:image/... base64 string here..."
                className="flex-1 min-h-[400px] bg-background border border-border rounded-lg p-4 font-mono text-[11px] text-ink resize-none focus:outline-primary transition-all"
              />
              
              {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-lg flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {error}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <h3 className="font-display font-bold flex items-center text-ink mb-4"><ImageIcon className="w-5 h-5 mr-2" /> Decoded Preview</h3>
              
              <div className="flex-1 relative rounded-lg border border-border bg-background overflow-hidden min-h-[400px] flex flex-col items-center justify-center">
                {imagePreview ? (
                  <>
                    <div className="p-4 flex-1 flex items-center justify-center w-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imagePreview} alt="Decoded Preview" className="max-w-full max-h-[300px] object-contain shadow-sm" />
                    </div>
                    <div className="w-full p-4 border-t border-border bg-surface flex justify-center">
                      <Button variant="primary" onClick={handleDownload} leftIcon={<Download className="w-4 h-4" />}>
                        Download Image
                      </Button>
                    </div>
                  </>
                ) : (
                  <span className="text-slate text-sm">Paste a valid Base64 string to see the image</span>
                )}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
