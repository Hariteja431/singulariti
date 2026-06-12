"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Download, Loader2, RotateCcw, FlipHorizontal, FlipVertical, Crop, Sliders, Maximize2, Trash2, RefreshCw } from 'lucide-react';
import { ToolRegistryItem } from '../../registry/types';
import { Button } from '../ui/Button';
import { Dropzone } from '../ui/Dropzone';
import ReactCrop, { type Crop as CropType, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface EditingEngineProps {
  tool: ToolRegistryItem;
}

export function EditingEngine({ tool }: EditingEngineProps) {
  const [file, setFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Refs
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cropImgRef = useRef<HTMLImageElement>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  // Unified Editor Active Tab
  const [activeTab, setActiveTab] = useState<string>('resize');

  // Tool specific states
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<CropType | null>(null);

  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  
  const [blur, setBlur] = useState(0);
  const [pixelSize, setPixelSize] = useState(1);
  const [grayscale, setGrayscale] = useState(false);

  // Set initial tab and preset parameters based on the specific tool route selected by the user
  useEffect(() => {
    if (tool.id === 'image-resizer') {
      setActiveTab('resize');
    } else if (tool.id === 'image-cropper') {
      setActiveTab('crop');
    } else if (tool.id === 'rotate-image' || tool.id === 'flip-image') {
      setActiveTab('transform');
      if (tool.id === 'rotate-image') setRotation(90);
      if (tool.id === 'flip-image') setFlipH(true);
    } else if (tool.id === 'blur-image' || tool.id === 'pixelate-image' || tool.id === 'grayscale-image') {
      setActiveTab('filters');
      if (tool.id === 'blur-image') setBlur(10);
      if (tool.id === 'pixelate-image') setPixelSize(8);
      if (tool.id === 'grayscale-image') setGrayscale(true);
    }
  }, [tool.id]);

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [originalUrl, resultUrl]);

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    
    const url = URL.createObjectURL(selectedFile);
    setOriginalUrl(url);
    setImageLoaded(false);
    setResultUrl(null);
    
    // Reset states
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setBlur(0);
    setPixelSize(1);
    setGrayscale(false);
    setCrop(undefined);
    setCompletedCrop(null);

    // Apply specific tool presets
    if (tool.id === 'rotate-image') setRotation(90);
    else if (tool.id === 'flip-image') setFlipH(true);
    else if (tool.id === 'blur-image') setBlur(10);
    else if (tool.id === 'pixelate-image') setPixelSize(8);
    else if (tool.id === 'grayscale-image') setGrayscale(true);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setWidth(naturalWidth);
    setHeight(naturalHeight);
    setImageLoaded(true);

    const initialCrop = centerCrop(
      makeAspectCrop(
        { unit: '%', width: 90 },
        naturalWidth / naturalHeight,
        naturalWidth,
        naturalHeight
      ),
      naturalWidth,
      naturalHeight
    );
    setCrop(initialCrop);
  };

  const handleWidthChange = (val: string) => {
    const num = parseInt(val) || 0;
    if (lockAspect && imgRef.current) {
      // Calculate aspect ratio dynamically based on current crop & rotation
      let baseW = imgRef.current.naturalWidth;
      let baseH = imgRef.current.naturalHeight;

      if (completedCrop) {
        baseW = completedCrop.width;
        baseH = completedCrop.height;
      }

      // If rotated 90 or 270 degrees, dimensions swap
      const isSwapped = rotation % 180 !== 0;
      const ratio = isSwapped ? baseW / baseH : baseH / baseW;
      setHeight(Math.round(num * ratio));
    }
    setWidth(num);
  };

  const handleHeightChange = (val: string) => {
    const num = parseInt(val) || 0;
    if (lockAspect && imgRef.current) {
      let baseW = imgRef.current.naturalWidth;
      let baseH = imgRef.current.naturalHeight;

      if (completedCrop) {
        baseW = completedCrop.width;
        baseH = completedCrop.height;
      }

      const isSwapped = rotation % 180 !== 0;
      const ratio = isSwapped ? baseH / baseW : baseW / baseH;
      setWidth(Math.round(num * ratio));
    }
    setHeight(num);
  };

  const handleResetAll = () => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setBlur(0);
    setPixelSize(1);
    setGrayscale(false);
    setCompletedCrop(null);
    if (imgRef.current) {
      setWidth(imgRef.current.naturalWidth);
      setHeight(imgRef.current.naturalHeight);
      const initialCrop = centerCrop(
        makeAspectCrop(
          { unit: '%', width: 90 },
          imgRef.current.naturalWidth / imgRef.current.naturalHeight,
          imgRef.current.naturalWidth,
          imgRef.current.naturalHeight
        ),
        imgRef.current.naturalWidth,
        imgRef.current.naturalHeight
      );
      setCrop(initialCrop);
    }
  };

  const handleRemoveCrop = () => {
    setCompletedCrop(null);
    setCrop(undefined);
  };

  // Recalculate dimensions automatically when rotation or crop selection completes
  useEffect(() => {
    if (imageLoaded && imgRef.current) {
      let srcW = imgRef.current.naturalWidth;
      let srcH = imgRef.current.naturalHeight;

      if (completedCrop && cropImgRef.current) {
        const scaleX = imgRef.current.naturalWidth / cropImgRef.current.width;
        const scaleY = imgRef.current.naturalHeight / cropImgRef.current.height;
        srcW = completedCrop.width * scaleX;
        srcH = completedCrop.height * scaleY;
      }

      const rad = (rotation * Math.PI) / 180;
      const rotW = Math.abs(srcW * Math.cos(rad)) + Math.abs(srcH * Math.sin(rad));
      const rotH = Math.abs(srcW * Math.sin(rad)) + Math.abs(srcH * Math.cos(rad));

      setWidth(Math.round(rotW));
      setHeight(Math.round(rotH));
    }
  }, [rotation, completedCrop, imageLoaded]);

  // Re-apply pipeline effects when state variables change
  useEffect(() => {
    if (imageLoaded && imgRef.current && activeTab !== 'crop') {
      const debounce = setTimeout(() => {
        applyEffect(imgRef.current!);
      }, 50);
      return () => clearTimeout(debounce);
    }
  }, [width, height, rotation, flipH, flipV, blur, pixelSize, grayscale, completedCrop, imageLoaded, activeTab]);

  const applyEffect = async (img: HTMLImageElement, isFinalRender = false) => {
    const canvas = canvasRef.current || document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (isFinalRender) setIsProcessing(true);

    try {
      // 1. Calculate Crop source coordinates
      let srcX = 0;
      let srcY = 0;
      let srcW = img.naturalWidth;
      let srcH = img.naturalHeight;

      if (completedCrop && cropImgRef.current) {
        const scaleX = img.naturalWidth / cropImgRef.current.width;
        const scaleY = img.naturalHeight / cropImgRef.current.height;
        srcX = completedCrop.x * scaleX;
        srcY = completedCrop.y * scaleY;
        srcW = completedCrop.width * scaleX;
        srcH = completedCrop.height * scaleY;
      }

      srcW = Math.max(1, srcW);
      srcH = Math.max(1, srcH);

      // 2. Draw cropped image to a temporary canvas
      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = srcW;
      cropCanvas.height = srcH;
      const cropCtx = cropCanvas.getContext('2d');
      if (cropCtx) {
        cropCtx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);
      }

      // 3. Handle rotation & flipping onto a second temporary canvas
      const transformCanvas = document.createElement('canvas');
      const rad = (rotation * Math.PI) / 180;
      const rotW = Math.abs(srcW * Math.cos(rad)) + Math.abs(srcH * Math.sin(rad));
      const rotH = Math.abs(srcW * Math.sin(rad)) + Math.abs(srcH * Math.cos(rad));
      
      transformCanvas.width = Math.max(1, rotW);
      transformCanvas.height = Math.max(1, rotH);

      const transCtx = transformCanvas.getContext('2d');
      if (transCtx) {
        transCtx.save();
        transCtx.translate(transformCanvas.width / 2, transformCanvas.height / 2);
        transCtx.rotate(rad);
        transCtx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
        transCtx.drawImage(cropCanvas, -srcW / 2, -srcH / 2, srcW, srcH);
        transCtx.restore();
      }

      // 4. Resize and filter onto the final canvas
      const finalW = width || Math.round(transformCanvas.width);
      const finalH = height || Math.round(transformCanvas.height);

      canvas.width = Math.max(1, finalW);
      canvas.height = Math.max(1, finalH);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      // Apply filters (blur & grayscale)
      let filterString = '';
      if (blur > 0) filterString += `blur(${blur}px) `;
      if (grayscale) filterString += `grayscale(100%) `;
      ctx.filter = filterString.trim() || 'none';

      // Apply pixelation or normal drawing with resizing
      if (pixelSize > 1) {
        ctx.imageSmoothingEnabled = false;
        const scaledW = Math.max(1, Math.round(canvas.width / pixelSize));
        const scaledH = Math.max(1, Math.round(canvas.height / pixelSize));

        const pixelCanvas = document.createElement('canvas');
        pixelCanvas.width = scaledW;
        pixelCanvas.height = scaledH;
        const pixelCtx = pixelCanvas.getContext('2d');
        if (pixelCtx) {
          pixelCtx.drawImage(transformCanvas, 0, 0, scaledW, scaledH);
        }

        ctx.drawImage(pixelCanvas, 0, 0, scaledW, scaledH, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.drawImage(transformCanvas, 0, 0, canvas.width, canvas.height);
      }

      ctx.restore();

      if (isFinalRender) {
        canvas.toBlob((blob) => {
          if (!blob) {
            setIsProcessing(false);
            return;
          }
          if (resultUrl) URL.revokeObjectURL(resultUrl);
          setResultUrl(URL.createObjectURL(blob));
          setIsProcessing(false);
        }, file?.type || 'image/jpeg', 0.95);
      }
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) {
      if (imgRef.current) applyEffect(imgRef.current, true);
    } else {
      const a = document.createElement('a');
      a.href = resultUrl;
      a.download = `singulariti_edited_${file?.name || 'image.jpg'}`;
      a.click();
    }
  };

  // Download trigger when compilation finishes
  useEffect(() => {
    if (resultUrl && isProcessing === false) {
      const a = document.createElement('a');
      a.href = resultUrl;
      a.download = `singulariti_edited_${file?.name || 'image.jpg'}`;
      a.click();
    }
  }, [resultUrl, isProcessing]);

  return (
    <div className="w-full max-w-6xl mx-auto my-6 px-2">
      {!file ? (
        <Dropzone 
          onFileSelect={processFile} 
          title="Drop image to edit"
          accept="image/jpeg, image/png, image/webp, .jpg, .jpeg, .png, .webp"
        />
      ) : (
        <div className="bg-surface border border-border rounded-xl p-5 md:p-6 shadow-sm">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
            <div className="min-w-0">
              <p className="font-sans text-[11px] font-bold text-slate uppercase tracking-wider mb-0.5">Image Editor Workspace</p>
              <h4 className="font-display font-bold text-base text-ink truncate max-w-md">{file.name}</h4>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" leftIcon={<RefreshCw className="w-3.5 h-3.5" />} onClick={handleResetAll}>
                Reset Editor
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
                Change File
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Sidebar Tabs & Controls */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              
              {/* Tab Selector */}
              <div className="flex bg-background border border-border rounded-xl p-1 w-full">
                {[
                  { id: 'crop', name: 'Crop', icon: Crop },
                  { id: 'resize', name: 'Resize', icon: Maximize2 },
                  { id: 'transform', name: 'Rotate', icon: RotateCcw },
                  { id: 'filters', name: 'Filters', icon: Sliders },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-2 px-1 rounded-lg font-sans font-bold text-[11px] uppercase tracking-wider flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
                        activeTab === tab.id
                          ? 'bg-surface text-primary shadow-xs'
                          : 'text-slate hover:text-ink'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Tab Panel */}
              <div className="p-5 bg-background border border-border rounded-xl min-h-[220px] flex flex-col justify-between">
                <div>
                  {activeTab === 'crop' && (
                    <div className="space-y-4">
                      <h5 className="font-display font-bold text-xs text-ink flex items-center uppercase tracking-wider">
                        <Crop className="w-4 h-4 mr-2 text-primary" /> Crop Image
                      </h5>
                      <p className="text-[12px] font-sans text-slate leading-relaxed">
                        Drag or resize the selection box on the image preview. The crop selection is applied automatically when viewing other controls.
                      </p>
                      {completedCrop ? (
                        <div className="space-y-3 pt-2">
                          <div className="flex items-center justify-between text-xs font-sans text-slate">
                            <span>Crop Dimensions:</span>
                            <span className="font-bold text-ink font-mono">
                              {Math.round(completedCrop.width)} × {Math.round(completedCrop.height)} px
                            </span>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full text-red-500 border-red-500/20 hover:bg-red-500/10" 
                            onClick={handleRemoveCrop}
                            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                          >
                            Remove Crop
                          </Button>
                        </div>
                      ) : (
                        <div className="p-3 bg-surface border border-border border-dashed rounded-lg text-center text-xs text-slate font-sans">
                          Select an area on the image preview
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'resize' && (
                    <div className="space-y-4">
                      <h5 className="font-display font-bold text-xs text-ink flex items-center uppercase tracking-wider">
                        <Maximize2 className="w-4 h-4 mr-2 text-primary" /> Custom Resize
                      </h5>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-sans font-bold text-slate uppercase tracking-wider mb-1.5">Width (px)</label>
                          <input
                            type="number"
                            value={width || ''}
                            onChange={(e) => handleWidthChange(e.target.value)}
                            className="w-full h-10 px-3 bg-surface border border-border rounded-lg text-sm text-ink outline-none focus:border-primary transition-colors font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-sans font-bold text-slate uppercase tracking-wider mb-1.5">Height (px)</label>
                          <input
                            type="number"
                            value={height || ''}
                            onChange={(e) => handleHeightChange(e.target.value)}
                            className="w-full h-10 px-3 bg-surface border border-border rounded-lg text-sm text-ink outline-none focus:border-primary transition-colors font-mono"
                          />
                        </div>
                      </div>
                      <label className="flex items-center gap-2 cursor-pointer pt-2 select-none">
                        <input
                          type="checkbox"
                          checked={lockAspect}
                          onChange={(e) => setLockAspect(e.target.checked)}
                          className="accent-primary rounded"
                        />
                        <span className="text-[12px] font-sans text-slate">Lock Aspect Ratio</span>
                      </label>
                    </div>
                  )}

                  {activeTab === 'transform' && (
                    <div className="space-y-4">
                      <h5 className="font-display font-bold text-xs text-ink flex items-center uppercase tracking-wider">
                        <RotateCcw className="w-4 h-4 mr-2 text-primary" /> Transform Rotation
                      </h5>
                      
                      <div className="space-y-2">
                        <label className="block text-[10px] font-sans font-bold text-slate uppercase tracking-wider">
                          Quick Rotation
                        </label>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => setRotation((r) => (r - 90 + 360) % 360)}>
                            -90°
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => setRotation((r) => (r + 90) % 360)}>
                            +90°
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => setRotation(180)}>
                            180°
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <div className="flex justify-between text-[11px] font-sans text-slate font-bold uppercase">
                          <span>Custom Angle</span>
                          <span>{rotation}°</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="359"
                          value={rotation}
                          onChange={(e) => setRotation(Number(e.target.value))}
                          className="w-full accent-primary"
                        />
                      </div>

                      <div className="space-y-2 pt-3 border-t border-border">
                        <label className="block text-[10px] font-sans font-bold text-slate uppercase tracking-wider">
                          Mirror Flip
                        </label>
                        <div className="flex gap-2">
                          <Button variant={flipH ? "primary" : "outline"} size="sm" className="flex-1" onClick={() => setFlipH(!flipH)}>
                            <FlipHorizontal className="w-3.5 h-3.5 mr-1.5" /> Horiz
                          </Button>
                          <Button variant={flipV ? "primary" : "outline"} size="sm" className="flex-1" onClick={() => setFlipV(!flipV)}>
                            <FlipVertical className="w-3.5 h-3.5 mr-1.5" /> Vert
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'filters' && (
                    <div className="space-y-4">
                      <h5 className="font-display font-bold text-xs text-ink flex items-center uppercase tracking-wider">
                        <Sliders className="w-4 h-4 mr-2 text-primary" /> Visual Filters
                      </h5>

                      <label className="flex items-center justify-between p-3 bg-surface border border-border rounded-lg cursor-pointer select-none">
                        <span className="text-[12px] font-sans text-ink font-semibold">Grayscale Effect</span>
                        <input
                          type="checkbox"
                          checked={grayscale}
                          onChange={(e) => setGrayscale(e.target.checked)}
                          className="accent-primary"
                        />
                      </label>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-sans text-slate font-bold uppercase">
                          <span>Gaussian Blur</span>
                          <span>{blur}px</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="40"
                          value={blur}
                          onChange={(e) => setBlur(Number(e.target.value))}
                          className="w-full accent-primary"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[11px] font-sans text-slate font-bold uppercase">
                          <span>Pixelate Blur</span>
                          <span>{pixelSize}px</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="50"
                          value={pixelSize}
                          onChange={(e) => setPixelSize(Number(e.target.value))}
                          className="w-full accent-primary"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Trigger */}
              <Button 
                variant="primary" 
                size="lg" 
                className="w-full" 
                onClick={handleDownload}
                isLoading={isProcessing}
                leftIcon={<Download className="w-5 h-5" />}
              >
                Apply & Download
              </Button>
            </div>

            {/* Right Column: Visual Canvas / Crop Viewport */}
            <div className="lg:col-span-8 flex flex-col justify-center">
              <div className="relative rounded-xl border border-border bg-background/50 overflow-hidden min-h-[400px] flex items-center justify-center p-4">
                {originalUrl && (
                  <img 
                    ref={imgRef}
                    src={originalUrl} 
                    alt="Original hidden reference source" 
                    className="hidden" 
                    onLoad={onImageLoad} 
                  />
                )}
                
                {!imageLoaded && originalUrl && (
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                )}

                {imageLoaded && activeTab === 'crop' ? (
                  <div className="max-w-full max-h-[60vh] flex justify-center items-center">
                    <ReactCrop crop={crop} onChange={c => setCrop(c)} onComplete={c => setCompletedCrop(c)}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img ref={cropImgRef} src={originalUrl!} alt="Crop bounding viewport" className="max-w-full max-h-[55vh] object-contain shadow-xs rounded-lg" />
                    </ReactCrop>
                  </div>
                ) : (
                  imageLoaded && <canvas ref={canvasRef} className="max-w-full max-h-[60vh] object-contain shadow-sm bg-white rounded-lg border border-border" />
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
