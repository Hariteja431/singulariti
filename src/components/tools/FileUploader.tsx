"use client";

import React, { useState } from 'react';
import { useDropzone, Accept } from 'react-dropzone';
import { UploadCloud, File as FileIcon, X, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  accept?: Accept;
  multiple?: boolean;
  title?: string;
  subtitle?: string;
  maxSize?: number; // in bytes
}

export function FileUploader({
  onFilesSelected,
  accept = { 'application/pdf': ['.pdf'] },
  multiple = false,
  title,
  subtitle,
  maxSize
}: FileUploaderProps) {
  const [error, setError] = useState<string | null>(null);
  const defaultTitle = multiple ? 'Drop files here' : 'Drop file here';
  const defaultSubtitle = multiple ? 'or click to upload multiple files' : 'or click to browse your device';

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    multiple,
    maxSize,
    onDrop: (acceptedFiles) => {
      setError(null);
      if (acceptedFiles && acceptedFiles.length > 0) {
        onFilesSelected(acceptedFiles);
      }
    },
    onDropRejected: (fileRejections) => {
      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        const isSizeError = rejection.errors.some(e => e.code === 'file-too-large');
        const isTypeError = rejection.errors.some(e => e.code === 'file-invalid-type');
        
        if (isTypeError) {
          // Extract expected extensions from accept object
          const allowedExts = Object.values(accept).flat().join(', ');
          setError(`Invalid file format. Please upload: ${allowedExts || 'the correct format'}`);
        } else if (isSizeError && maxSize) {
          setError(`File is too large. Max size is ${(maxSize / (1024 * 1024)).toFixed(1)}MB`);
        } else {
          setError('File upload rejected. Please try another file.');
        }
      }
    }
  });

  return (
    <div className="w-full flex flex-col gap-4">
      {error && (
        <div className="w-full p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
          isDragActive
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : error 
              ? 'border-red-500/50 bg-red-500/5 hover:border-red-500'
              : 'border-border bg-surface hover:border-slate'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="w-20 h-20 mx-auto bg-background rounded-full flex items-center justify-center text-primary mb-6 pointer-events-none">
          <UploadCloud className="w-10 h-10" />
        </div>
        
        <h3 className="font-display font-bold text-2xl text-ink mb-2 pointer-events-none">
          {title || defaultTitle}
        </h3>
        
        <p className="text-slate font-sans mb-8 pointer-events-none">
          {subtitle || defaultSubtitle}
        </p>
        
        <div className="flex justify-center pointer-events-none">
          <Button variant="primary" size="lg" className="w-full max-w-xs">
            Choose {multiple ? 'Files' : 'File'}
          </Button>
        </div>
        
        <div className="mt-6 flex flex-col items-center justify-center gap-2 text-[13px] font-sans text-slate pointer-events-none">
          <div className="flex items-center gap-4">
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>Browser-based
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>No upload
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>Secure
            </span>
          </div>
          <p className="text-[12px] text-slate/85 mt-1.5 font-medium text-center max-w-md">
            Your file is processed in your browser and is not uploaded to our server.
          </p>
        </div>
      </div>
    </div>
  );
}
