"use client";

import React, { useState, useRef, useEffect } from 'react';
import * as fabric from 'fabric';
import { jsPDF } from 'jspdf';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/tools/LoadingSpinner';
import { 
  Award, Type, Square, Circle, Sparkles, Undo2, Redo2, ZoomIn, ZoomOut, 
  RotateCcw, Trash2, PenTool, Upload, Download, Check, X, Image as ImageIcon, 
  Layers, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, ArrowLeft,
  Maximize2, Minimize2
} from 'lucide-react';
import { loadPdfDocument, renderPageToDataUrl } from '@/lib/pdf/pdfRenderHelpers';

// SVG templates defined as raw strings
const templateClassicNavy = `
<svg width="1000" height="707" viewBox="0 0 1000 707" xmlns="http://www.w3.org/2000/svg">
  <rect width="1000" height="707" fill="#0f172a" />
  <rect x="25" y="25" width="950" height="657" fill="none" stroke="#d4af37" stroke-width="4" />
  <rect x="35" y="35" width="930" height="637" fill="none" stroke="#f1f5f9" stroke-width="1.5" stroke-dasharray="8,8" />
  <path d="M 25,60 L 60,25 M 975,60 L 940,25 M 25,647 L 60,682 M 975,647 L 940,682" stroke="#d4af37" stroke-width="2" />
  <!-- Corner gold corners -->
  <path d="M 25,50 L 50,25" stroke="#d4af37" stroke-width="3" />
  <path d="M 975,50 L 950,25" stroke="#d4af37" stroke-width="3" />
  <path d="M 25,657 L 50,682" stroke="#d4af37" stroke-width="3" />
  <path d="M 975,657 L 950,682" stroke="#d4af37" stroke-width="3" />
</svg>
`;

const templateModernTeal = `
<svg width="1000" height="707" viewBox="0 0 1000 707" xmlns="http://www.w3.org/2000/svg">
  <rect width="1000" height="707" fill="#f8fafc" />
  <path d="M 0,0 L 250,0 L 0,250 Z" fill="#0d9488" fill-opacity="0.1" />
  <path d="M 0,0 L 150,0 L 0,150 Z" fill="#0d9488" fill-opacity="0.3" />
  <path d="M 1000,707 L 750,707 L 1000,457 Z" fill="#0d9488" fill-opacity="0.1" />
  <path d="M 1000,707 L 850,707 L 1000,557 Z" fill="#0d9488" fill-opacity="0.3" />
  <rect x="25" y="25" width="950" height="657" fill="none" stroke="#cbd5e1" stroke-width="2" />
  <rect x="33" y="33" width="934" height="641" fill="none" stroke="#0d9488" stroke-width="1.5" />
</svg>
`;

const templateElegantEmerald = `
<svg width="1000" height="707" viewBox="0 0 1000 707" xmlns="http://www.w3.org/2000/svg">
  <rect width="1000" height="707" fill="#fcfcf9" />
  <rect x="30" y="30" width="940" height="647" fill="none" stroke="#065f46" stroke-width="6" />
  <rect x="42" y="42" width="916" height="623" fill="none" stroke="#b45309" stroke-width="2" />
  <path d="M 30,70 L 70,30 M 970,70 L 930,30 M 30,637 L 70,677 M 970,637 L 930,677" stroke="#b45309" stroke-width="2" />
</svg>
`;

const templateMinimalist = `
<svg width="1000" height="707" viewBox="0 0 1000 707" xmlns="http://www.w3.org/2000/svg">
  <rect width="1000" height="707" fill="#ffffff" />
  <rect x="20" y="20" width="960" height="667" fill="none" stroke="#1e293b" stroke-width="2" />
  <rect x="26" y="26" width="948" height="655" fill="none" stroke="#94a3b8" stroke-width="0.75" />
</svg>
`;

type TemplateId = 'classic' | 'modern' | 'emerald' | 'minimalist' | 'custom';

export function CertificateEditorClient({ article }: { article?: string }) {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMaximized) {
        setIsMaximized(false);
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isMaximized) {
        setIsMaximized(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isMaximized]);

  const handleToggleMaximize = () => {
    if (!isMaximized) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
        });
      }
      setIsMaximized(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsMaximized(false);
    }
  };

  const [mode, setMode] = useState<'select' | 'editor'>('select');
  const [template, setTemplate] = useState<TemplateId>('classic');
  const [documentState, setDocumentState] = useState({
    width: 1000,
    height: 707,
    aspectRatio: 1000 / 707,
    orientation: 'landscape' as 'portrait' | 'landscape',
  });
  const canvasSize = {
    width: documentState.width,
    height: documentState.height,
  };
  const [customBgDataUrl, setCustomBgDataUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  // Undo/Redo & Zoom States
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [zoom, setZoom] = useState(1);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#00C4B4');
  const [brushWidth, setBrushWidth] = useState(4);

  // Active object selection properties
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [textVal, setTextVal] = useState('');
  const [fontFamily, setFontFamily] = useState('Montserrat');
  const [fontSize, setFontSize] = useState(24);
  const [textColor, setTextColor] = useState('#ffffff');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');

  // Shape properties
  const [shapeColor, setShapeColor] = useState('#00C4B4');
  const [shapeStrokeColor, setShapeStrokeColor] = useState('#d4af37');
  const [shapeStrokeWidth, setShapeStrokeWidth] = useState(2);

  // Signature Pad Modal
  const [isSigModalOpen, setIsSigModalOpen] = useState(false);
  const [sigPadDrawing, setSigPadDrawing] = useState(false);

  // Canvas Refs
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvas = useRef<fabric.Canvas | null>(null);
  const sigPadElRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const documentStateRef = useRef(documentState);
  documentStateRef.current = documentState;

  const fitCanvasToScreenRef = useRef<(() => void) | null>(null);

  const fitDocumentToContainer = (
    docW: number,
    docH: number,
    containerW: number,
    containerH: number
  ) => {
    const padding = 32;
    const availW = Math.max(0, containerW - padding);
    let scale = 1;
    if (availW < docW) {
      scale = availW / docW;
    }
    scale = Math.max(0.3, Math.min(scale, 3.0));
    const left = Math.max(0, (containerW - docW * scale) / 2);
    const top = Math.max(0, (containerH - docH * scale) / 2);
    return { scale, left, top };
  };

  const updateDocumentState = (width: number, height: number) => {
    const aspectRatio = width / height;
    const orientation = width >= height ? 'landscape' as const : 'portrait' as const;
    setDocumentState({ width, height, aspectRatio, orientation });
  };

  const fitCanvasToScreen = (customW?: number, customH?: number) => {
    const container = containerRef.current;
    if (!container) return;
    if (container.clientWidth <= 0 || container.clientHeight <= 0) {
      return;
    }
    const docW = customW || documentStateRef.current.width;
    const docH = customH || documentStateRef.current.height;
    const { scale } = fitDocumentToContainer(
      docW,
      docH,
      container.clientWidth,
      container.clientHeight
    );
    setZoom(scale);
  };

  fitCanvasToScreenRef.current = fitCanvasToScreen;

  // History stacks
  const undoStack = useRef<string[]>([]);
  const redoStack = useRef<string[]>([]);

  // SVG dynamic data urls helper
  const getTemplateDataUrl = (tempId: TemplateId): string => {
    let svg = '';
    switch (tempId) {
      case 'classic': svg = templateClassicNavy; break;
      case 'modern': svg = templateModernTeal; break;
      case 'emerald': svg = templateElegantEmerald; break;
      case 'minimalist': svg = templateMinimalist; break;
      default: return '';
    }
    const base64 = window.btoa(unescape(encodeURIComponent(svg.trim())));
    return `data:image/svg+xml;base64,${base64}`;
  };

  const getThemeTextColors = (tempId: TemplateId) => {
    switch (tempId) {
      case 'classic':
        return { text: '#e2e8f0', accent: '#f5a524' }; // light gold and gray
      case 'modern':
        return { text: '#334155', accent: '#0d9488' }; // dark gray and teal
      case 'emerald':
        return { text: '#064e3b', accent: '#b45309' }; // emerald and amber
      case 'minimalist':
      default:
        return { text: '#0f172a', accent: '#1e293b' }; // dark slate
    }
  };

  // Save Canvas State for Undo/Redo
  const saveState = () => {
    if (!fabricCanvas.current) return;
    const json = JSON.stringify((fabricCanvas.current as any).toJSON(['selectable', 'evented', 'isBackground']));
    undoStack.current.push(json);
    if (undoStack.current.length > 40) {
      undoStack.current.shift();
    }
    redoStack.current = [];
    setCanUndo(true);
    setCanRedo(false);
  };

  // Initialize Canvas
  useEffect(() => {
    if (mode !== 'editor' || !canvasElRef.current) return;

    // Set default origins to avoid center-positioning rendering issues in Fabric v7
    if (fabric.Object && fabric.Object.prototype) {
      (fabric.Object.prototype as any).originX = 'left';
      (fabric.Object.prototype as any).originY = 'top';
    }
    const FabricObj = (fabric as any).FabricObject;
    if (FabricObj && FabricObj.prototype) {
      FabricObj.prototype.originX = 'left';
      FabricObj.prototype.originY = 'top';
    }

    const canvas = new fabric.Canvas(canvasElRef.current, {
      width: canvasSize.width,
      height: canvasSize.height,
      backgroundColor: '#f8fafc',
      selection: true,
      preserveObjectStacking: true,
      enableRetinaScaling: true, // Enable retina scaling to maintain sharp quality and correct dimensions
    });

    fabricCanvas.current = canvas;

    // Load Initial Background
    if (template !== 'custom') {
      loadTemplateBackground(template, true);
    } else if (customBgDataUrl) {
      loadCustomBackgroundOnCanvas(customBgDataUrl);
    }

    // Track active object selections
    const handleSelection = () => {
      const activeObj = canvas.getActiveObject();
      if (!activeObj) {
        setSelectedType(null);
        return;
      }
      setSelectedType(activeObj.type || null);
      if (activeObj.type === 'textbox' || activeObj.type === 'text') {
        const textObj = activeObj as fabric.Textbox;
        setTextVal(textObj.text || '');
        setFontFamily(textObj.fontFamily || 'Montserrat');
        setFontSize(textObj.fontSize || 24);
        setTextColor(textObj.fill as string || '#000000');
        setIsBold(textObj.fontWeight === 'bold');
        setIsItalic(textObj.fontStyle === 'italic');
        setIsUnderline(textObj.underline || false);
        setTextAlign((textObj.textAlign as 'left' | 'center' | 'right') || 'center');
      } else if (['rect', 'circle', 'path', 'polygon'].includes(activeObj.type || '')) {
        setShapeColor(activeObj.fill as string || 'transparent');
        setShapeStrokeColor(activeObj.stroke as string || '#000000');
        setShapeStrokeWidth(activeObj.strokeWidth || 1);
      }
    };

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', () => setSelectedType(null));
    canvas.on('object:modified', saveState);

    // Keyboard delete shortcut
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeObj = canvas.getActiveObject();
        if (activeObj && !(activeObj as any).isEditing) {
          saveState();
          if (activeObj.type === 'activeSelection') {
            (activeObj as fabric.ActiveSelection).forEachObject((o) => canvas.remove(o));
            canvas.discardActiveObject();
          } else {
            canvas.remove(activeObj);
          }
          canvas.requestRenderAll();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Set up ResizeObserver for container dimension changes
    const container = containerRef.current;
    let resizeObserver: ResizeObserver | null = null;
    if (container) {
      resizeObserver = new ResizeObserver(() => {
        fitCanvasToScreenRef.current?.();
      });
      resizeObserver.observe(container);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      canvas.dispose();
      fabricCanvas.current = null;
    };
  }, [mode]);

  // Update Freehand Drawing Brush settings when states change
  useEffect(() => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    canvas.isDrawingMode = isDrawing;
    if (isDrawing) {
      if (!canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      }
      canvas.freeDrawingBrush.color = brushColor;
      canvas.freeDrawingBrush.width = brushWidth;
    }
  }, [isDrawing, brushColor, brushWidth]);

  // Load Background Helper for templates
  const loadTemplateBackground = (tempId: TemplateId, insertDefaults = false) => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    setError(null);
    const dataUrl = getTemplateDataUrl(tempId);
    if (!dataUrl) return;

    canvas.setDimensions({ width: 1000, height: 707 });
    updateDocumentState(1000, 707);
    
    canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
    canvas.setZoom(1);

    // Call fitCanvasToScreen synchronously using correct width and height
    fitCanvasToScreen(1000, 707);

    fabric.Image.fromURL(dataUrl, { crossOrigin: 'anonymous' }).then((img) => {
        canvas.clear();
        canvas.backgroundColor = '#0b0b0f';

        img.set({
          scaleX: 1000 / (img.width || 1),
          scaleY: 707 / (img.height || 1),
          left: 0,
          top: 0,
          originX: 'left',
          originY: 'top',
          selectable: false,
          evented: false,
          objectCaching: false,
          isBackground: true,
        } as any);

        canvas.add(img);
        canvas.sendObjectToBack(img);

        if (insertDefaults) {
          const colors = getThemeTextColors(tempId);
          const title = new fabric.Textbox('CERTIFICATE OF ACHIEVEMENT', {
            left: 100,
            top: 150,
            width: 800,
            fontSize: 42,
            fontFamily: 'Montserrat',
            fontWeight: 'bold',
            fill: colors.accent,
            textAlign: 'center',
            selectable: true,
            originX: 'left',
            originY: 'top',
          });

          const pres = new fabric.Textbox('THIS IS PROUDLY PRESENTED TO', {
            left: 100,
            top: 245,
            width: 800,
            fontSize: 14,
            fontFamily: 'Montserrat',
            fontWeight: '600',
            fill: colors.text,
            textAlign: 'center',
            charSpacing: 180,
            selectable: true,
            originX: 'left',
            originY: 'top',
          });

          const name = new fabric.Textbox('Jane Doe', {
            left: 100,
            top: 295,
            width: 800,
            fontSize: 56,
            fontFamily: 'Great Vibes',
            fontWeight: 'bold',
            fill: colors.accent,
            textAlign: 'center',
            selectable: true,
            originX: 'left',
            originY: 'top',
          });

          const desc = new fabric.Textbox('for outstanding performance, exceptional dedication, and successful completion of all training requirements and modules in the course.', {
            left: 150,
            top: 395,
            width: 700,
            fontSize: 16,
            fontFamily: 'Inter',
            fontWeight: 'normal',
            fill: colors.text,
            textAlign: 'center',
            lineHeight: 1.4,
            selectable: true,
            originX: 'left',
            originY: 'top',
          });

          const date = new fabric.Textbox('Date: June 16, 2026', {
            left: 150,
            top: 535,
            width: 300,
            fontSize: 14,
            fontFamily: 'Inter',
            fontWeight: 'normal',
            fill: colors.text,
            textAlign: 'left',
            selectable: true,
            originX: 'left',
            originY: 'top',
          });

          const sig = new fabric.Textbox('Authorized Signature', {
            left: 550,
            top: 535,
            width: 300,
            fontSize: 14,
            fontFamily: 'Inter',
            fontWeight: 'normal',
            fill: colors.text,
            textAlign: 'right',
            selectable: true,
            originX: 'left',
            originY: 'top',
          });

          canvas.add(title, pres, name, desc, date, sig);
        }

        canvas.requestRenderAll();
        // Reset stacks
        undoStack.current = [];
        redoStack.current = [];
        setCanUndo(false);
        setCanRedo(false);
      })
      .catch((err) => {
        console.error("Failed to load template background:", err);
        setError("Could not load template background.");
      });
  };

  // Load Custom Background Helper
  const loadCustomBackgroundOnCanvas = (dataUrl: string) => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    const imgEl = new Image();
    imgEl.src = dataUrl;
    imgEl.onload = () => {
      const aspect = imgEl.naturalWidth / imgEl.naturalHeight;
      const newWidth = 1000;
      const newHeight = Math.round(1000 / aspect);

      canvas.setDimensions({ width: newWidth, height: newHeight });
      updateDocumentState(newWidth, newHeight);
      
      // Reset viewport transforms and zoom levels to prevent offset and coordinate shift issues
      canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
      canvas.setZoom(1);

      // Call fitCanvasToScreen synchronously using correct width and height
      fitCanvasToScreen(newWidth, newHeight);

      fabric.Image.fromURL(dataUrl, { crossOrigin: 'anonymous' }).then((img) => {
        img.set({
          scaleX: newWidth / (img.width || 1),
          scaleY: newHeight / (img.height || 1),
          left: 0,
          top: 0,
          originX: 'left',
          originY: 'top',
          selectable: false,
          evented: false,
          objectCaching: false,
          isBackground: true, // Mark it as background
        } as any);

        canvas.clear();
        canvas.backgroundColor = '#0b0b0f';
        canvas.add(img);
        canvas.sendObjectToBack(img);
        
        // Add one default title textbox centered nicely
        const titleText = new fabric.Textbox('ADD TEXT / SIGNATURE HERE', {
          left: 100,
          top: Math.round(newHeight / 2) - 20,
          width: 800,
          fontSize: 28,
          fontFamily: 'Montserrat',
          textAlign: 'center',
          fill: '#0f172a',
          originX: 'left',
          originY: 'top',
        });
        canvas.add(titleText);
        canvas.setActiveObject(titleText);
        
        canvas.requestRenderAll();
        undoStack.current = [];
        redoStack.current = [];
        setCanUndo(false);
        setCanRedo(false);
      });
    };
  };

  // Parse uploaded file (Image or PDF)
  const processUploadedFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    try {
      let dataUrl = '';
      if (file.type === 'application/pdf') {
        const pdfDoc = await loadPdfDocument(file);
        if (pdfDoc.numPages === 0) {
          throw new Error('This PDF document has no pages.');
        }
        // Render first page to high-res PNG image
        dataUrl = await renderPageToDataUrl(pdfDoc, 1, 2.0, 'image/png');
      } else if (file.type.startsWith('image/')) {
        dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = (e) => reject(new Error('Failed to read image file.'));
          reader.readAsDataURL(file);
        });
      } else {
        throw new Error('Unsupported file format. Please upload a PDF or an Image.');
      }

      setCustomBgDataUrl(dataUrl);
      setTemplate('custom');
      
      const imgEl = new Image();
      imgEl.src = dataUrl;
      imgEl.onload = () => {
        const aspect = imgEl.naturalWidth / imgEl.naturalHeight;
        const newWidth = 1000;
        const newHeight = Math.round(1000 / aspect);
        updateDocumentState(newWidth, newHeight);
        setMode('editor');
        setIsProcessing(false);
        
        if (fabricCanvas.current) {
          loadCustomBackgroundOnCanvas(dataUrl);
        }
      };
    } catch (e) {
      console.error(e);
      setError((e as Error).message || 'Failed to load file.');
      setIsProcessing(false);
    }
  };

  // Drag-and-drop event handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processUploadedFile(e.target.files[0]);
    }
  };

  // Change active template handler
  const handleTemplateChange = (tempId: TemplateId) => {
    if (tempId === 'custom') {
      document.getElementById('bg-upload-file')?.click();
      return;
    }
    setTemplate(tempId);
    loadTemplateBackground(tempId, true);
  };

  // Start with preset layout from dashboard
  const startWithPreset = (tempId: TemplateId) => {
    setTemplate(tempId);
    setMode('editor');
  };

  const handleBackToStart = () => {
    if (window.confirm("Are you sure you want to go back? Unsaved edits on this certificate will be lost.")) {
      setMode('select');
      setTemplate('classic');
      setCustomBgDataUrl(null);
      undoStack.current = [];
      redoStack.current = [];
      setCanUndo(false);
      setCanRedo(false);
      setIsDrawing(false);
    }
  };

  // Add Elements on Canvas
  const addTextElement = (type: 'title' | 'subtitle' | 'body' | 'custom') => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    saveState();
    let text = 'Double click to edit';
    let size = 20;
    let weight = 'normal';
    let font = 'Inter';
    let color = template === 'classic' ? '#ffffff' : '#0f172a';

    if (type === 'title') {
      text = 'CERTIFICATE TITLE';
      size = 38;
      weight = 'bold';
      font = 'Montserrat';
      color = template === 'classic' ? '#f5a524' : '#0d9488';
    } else if (type === 'subtitle') {
      text = 'RECIPIENT NAME';
      size = 48;
      weight = 'bold';
      font = 'Great Vibes';
      color = template === 'classic' ? '#f5a524' : '#0d9488';
    } else if (type === 'body') {
      text = 'For demonstrating exceptional commitment, academic diligence, and practical mastery during the curriculum course studies.';
      size = 16;
      font = 'Inter';
    }

    const textObj = new fabric.Textbox(text, {
      left: 150,
      top: Math.round(canvasSize.height / 2) - 40,
      width: 700,
      fontSize: size,
      fontWeight: weight,
      fontFamily: font,
      fill: color,
      textAlign: 'center',
      originX: 'left',
      originY: 'top',
    });

    canvas.add(textObj);
    canvas.setActiveObject(textObj);
    canvas.requestRenderAll();
  };

  const addShapeElement = (shape: 'rect' | 'circle' | 'line' | 'seal') => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    saveState();
    let obj: fabric.Object;

    if (shape === 'rect') {
      obj = new fabric.Rect({
        left: 200,
        top: 200,
        width: 150,
        height: 100,
        fill: 'transparent',
        stroke: '#00C4B4',
        strokeWidth: 3,
        originX: 'left',
        originY: 'top',
      });
    } else if (shape === 'circle') {
      obj = new fabric.Circle({
        left: 200,
        top: 200,
        radius: 60,
        fill: 'transparent',
        stroke: '#00C4B4',
        strokeWidth: 3,
        originX: 'left',
        originY: 'top',
      });
    } else if (shape === 'line') {
      obj = new fabric.Line([100, 100, 300, 100], {
        stroke: '#00C4B4',
        strokeWidth: 3,
        originX: 'left',
        originY: 'top',
      });
    } else {
      // 12-point seal path
      obj = new fabric.Path('M 50 12 L 62 24 L 78 20 L 80 37 L 95 44 L 88 59 L 95 75 L 80 81 L 78 98 L 62 94 L 50 106 L 38 94 L 22 98 L 20 81 L 5 75 L 12 59 L 5 44 L 20 37 L 22 20 L 38 24 Z', {
        left: 450,
        top: 250,
        fill: '#F5A52A',
        stroke: '#d4af37',
        strokeWidth: 2,
        scaleX: 0.8,
        scaleY: 0.8,
        originX: 'left',
        originY: 'top',
      });
    }

    canvas.add(obj);
    canvas.setActiveObject(obj);
    canvas.requestRenderAll();
  };

  // Handle Logo/Signature Image uploads
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (fEvent) => {
      const data = fEvent.target?.result;
      if (typeof data !== 'string') return;

      const canvas = fabricCanvas.current;
      if (!canvas) return;

      fabric.Image.fromURL(data, { crossOrigin: 'anonymous' }).then((img) => {
        const maxDim = 150;
        let scale = 1;
        if (img.width && img.width > maxDim) {
          scale = maxDim / img.width;
        }

        saveState();
        img.set({
          left: 420,
          top: 100,
          scaleX: scale,
          scaleY: scale,
          selectable: true,
          originX: 'left',
          originY: 'top',
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.requestRenderAll();
      });
    };
    reader.readAsDataURL(file);
  };

  // Property modifiers
  const handleTextPropertyChange = (prop: string, val: any) => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (!activeObj || !(activeObj.type === 'textbox' || activeObj.type === 'text')) return;

    saveState();
    if (prop === 'text') {
      (activeObj as fabric.Textbox).set({ text: val });
      setTextVal(val);
    } else if (prop === 'fontFamily') {
      activeObj.set({ fontFamily: val });
      setFontFamily(val);
    } else if (prop === 'fontSize') {
      activeObj.set({ fontSize: Number(val) });
      setFontSize(Number(val));
    } else if (prop === 'color') {
      activeObj.set({ fill: val });
      setTextColor(val);
    } else if (prop === 'bold') {
      activeObj.set({ fontWeight: val ? 'bold' : 'normal' });
      setIsBold(val);
    } else if (prop === 'italic') {
      activeObj.set({ fontStyle: val ? 'italic' : 'normal' });
      setIsItalic(val);
    } else if (prop === 'underline') {
      activeObj.set({ underline: val });
      setIsUnderline(val);
    } else if (prop === 'align') {
      activeObj.set({ textAlign: val });
      setTextAlign(val);
    }

    canvas.requestRenderAll();
  };

  const handleShapePropertyChange = (prop: string, val: any) => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;

    saveState();
    if (prop === 'fill') {
      activeObj.set({ fill: val });
      setShapeColor(val);
    } else if (prop === 'stroke') {
      activeObj.set({ stroke: val });
      setShapeStrokeColor(val);
    } else if (prop === 'strokeWidth') {
      activeObj.set({ strokeWidth: Number(val) });
      setShapeStrokeWidth(Number(val));
    }

    canvas.requestRenderAll();
  };

  const deleteSelected = () => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;

    saveState();
    if (activeObj.type === 'activeSelection') {
      (activeObj as fabric.ActiveSelection).forEachObject((o) => canvas.remove(o));
      canvas.discardActiveObject();
    } else {
      canvas.remove(activeObj);
    }
    canvas.requestRenderAll();
  };

  const layerArrange = (action: 'front' | 'back') => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (!activeObj) return;

    saveState();
    if (action === 'front') {
      canvas.bringObjectToFront(activeObj);
    } else {
      canvas.sendObjectToBack(activeObj);
      // Ensure background remains at the very back (below the sent object)
      const bgObj = canvas.getObjects().find((o: any) => o.isBackground);
      if (bgObj) {
        canvas.sendObjectToBack(bgObj);
      }
    }
    canvas.requestRenderAll();
  };

  // Zoom helpers
  const handleZoomChange = (factor: number) => {
    let z = zoom * factor;
    z = Math.max(0.3, Math.min(z, 3));
    setZoom(z);
  };

  const resetZoom = () => {
    setZoom(1);
  };

  // Undo / Redo
  const handleUndo = () => {
    const canvas = fabricCanvas.current;
    if (!canvas || undoStack.current.length === 0) return;

    const current = JSON.stringify((canvas as any).toJSON(['selectable', 'evented', 'isBackground']));
    redoStack.current.push(current);

    const prev = undoStack.current.pop()!;
    canvas.loadFromJSON(prev, () => {
      canvas.getObjects().forEach((obj) => {
        if ((obj as any).isBackground) {
          obj.set({ selectable: false, evented: false });
        } else {
          obj.set({ selectable: true, evented: true });
        }
      });
      canvas.requestRenderAll();
      setCanUndo(undoStack.current.length > 0);
      setCanRedo(true);
    });
  };

  const handleRedo = () => {
    const canvas = fabricCanvas.current;
    if (!canvas || redoStack.current.length === 0) return;

    const current = JSON.stringify((canvas as any).toJSON(['selectable', 'evented', 'isBackground']));
    undoStack.current.push(current);

    const next = redoStack.current.pop()!;
    canvas.loadFromJSON(next, () => {
      canvas.getObjects().forEach((obj) => {
        if ((obj as any).isBackground) {
          obj.set({ selectable: false, evented: false });
        } else {
          obj.set({ selectable: true, evented: true });
        }
      });
      canvas.requestRenderAll();
      setCanUndo(true);
      setCanRedo(redoStack.current.length > 0);
    });
  };

  // Reset Canvas to base
  const handleResetCanvas = () => {
    if (window.confirm("Are you sure you want to discard all changes and reset this template?")) {
      if (template !== 'custom') {
        loadTemplateBackground(template, true);
      } else if (customBgDataUrl) {
        loadCustomBackgroundOnCanvas(customBgDataUrl);
      }
    }
  };

  // Signature Pad Modal Drawing Logic
  const startSigPadDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = sigPadElRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setSigPadDrawing(true);
  };

  const drawSigPad = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!sigPadDrawing) return;
    e.preventDefault();
    const canvas = sigPadElRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopSigPadDrawing = () => {
    setSigPadDrawing(false);
  };

  const clearSigPad = () => {
    const canvas = sigPadElRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const insertSigPadSignature = () => {
    const canvas = sigPadElRef.current;
    if (!canvas) return;

    const buffer = new Uint32Array(canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height).data.buffer);
    const isEmpty = !buffer.some(color => color !== 0);

    if (isEmpty) {
      alert("Please draw your signature before inserting.");
      return;
    }

    const dataUrl = canvas.toDataURL('image/png');
    const fCanvas = fabricCanvas.current;
    if (fCanvas) {
      fabric.Image.fromURL(dataUrl, { crossOrigin: 'anonymous' }).then((img) => {
        img.set({
          left: 400,
          top: Math.round(canvasSize.height / 2) + 100,
          scaleX: 0.6,
          scaleY: 0.6,
          selectable: true,
          originX: 'left',
          originY: 'top',
        });
        saveState();
        fCanvas.add(img);
        fCanvas.setActiveObject(img);
        fCanvas.requestRenderAll();
        setIsSigModalOpen(false);
      });
    }
  };

  // Export File logic
  const handleExport = async (type: 'png' | 'pdf') => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    setIsProcessing(true);
    setError(null);

    canvas.discardActiveObject();
    canvas.requestRenderAll();

    await new Promise((resolve) => setTimeout(resolve, 150));

    try {
      const dataUrl = canvas.toDataURL({
        format: 'png',
        multiplier: 2,
      });

      if (type === 'png') {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'certificate.png';
        link.click();
      } else {
        const isPortrait = canvasSize.width < canvasSize.height;
        const pdf = new jsPDF({
          orientation: isPortrait ? 'portrait' : 'landscape',
          unit: 'mm',
          format: 'a4',
        });
        
        const pdfW = isPortrait ? 210 : 297;
        const pdfH = isPortrait ? 297 : 210;
        
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfW, pdfH);
        pdf.save('certificate.pdf');
      }
    } catch (e) {
      console.error(e);
      setError("Failed to export certificate. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      article={article}
      howToUse={[
        "Choose to start from a pre-made design template, or upload any PDF/Image certificate from your local path.",
        "Add headings, recipient names, custom paragraphs, or dates to the certificate template.",
        "Double click any text on the canvas to customize and edit its words.",
        "Modify visual details like fonts, sizes, colors, and line styles using the properties panel.",
        "Overlay transparent brand logos or paint signature brushstrokes directly onto the layout.",
        "Open the Signature Pad modal to sketch and insert smooth vector-like digital signatures.",
        "Export the final print-ready design as a vector PDF document or high-quality PNG graphics."
      ]}
      faqs={[
        {
          "question": "Can I edit certificates in my own local folder path?",
          "answer": "Yes. Select 'Upload Existing Certificate' on the landing screen, and upload your file (Image or PDF) from any directory on your computer."
        },
        {
          "question": "Are my files, signatures, or logos secure?",
          "answer": "Yes, absolutely. This utility runs entirely locally in your browser sandbox. None of your certificates, text, signatures, or logo images are sent to any external server."
        },
        {
          "question": "What formats can I export?",
          "answer": "You can export the customized certificate as a print-ready vector PDF document (A4 scale) or a high-resolution PNG image."
        }
      ]}
      title="Certificate Editor"
      description="Create, edit, and design professional certificates directly in your browser. Choose elegant pre-made layouts or upload custom backgrounds. Processed 100% locally."
      categoryName="Image Editing Tools"
      categoryHref="/editing"
      error={error}
      onClearError={() => setError(null)}
    >
      {/* Dynamic Font Loader Link */}
      <link 
        rel="stylesheet" 
        href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;600&family=Alex+Brush&display=swap" 
      />

      {/* MODE 1: SELECTOR DASHBOARD */}
      {mode === 'select' && (
        <div className="max-w-4xl mx-auto py-4 px-2 animate-in fade-in duration-300">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-ink mb-3">How would you like to start?</h2>
            <p className="text-sm text-slate max-w-xl mx-auto font-sans leading-relaxed">
              Choose whether to customize one of our pre-made layouts, or upload any PDF or Image certificate to sign and edit directly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Start with a Template */}
            <div className="bg-surface border border-border hover:border-primary/40 rounded-2xl p-6 md:p-8 flex flex-col justify-between transition-all duration-300 shadow-md group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition duration-300">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-display font-bold text-ink mb-3">Create from a Template</h3>
                <p className="text-xs text-slate mb-6 leading-relaxed font-sans">
                  Start with a beautifully styled certificate preset layout. Customize text fields, shapes, colors, and place signatures.
                </p>
                
                <div className="grid grid-cols-2 gap-2 mb-6">
                  <button 
                    onClick={() => startWithPreset('classic')} 
                    className="p-2.5 text-left border border-border hover:border-primary hover:text-primary rounded-lg text-xs font-semibold bg-background hover:bg-primary/5 transition font-sans"
                  >
                    Classic Navy
                  </button>
                  <button 
                    onClick={() => startWithPreset('modern')} 
                    className="p-2.5 text-left border border-border hover:border-primary hover:text-primary rounded-lg text-xs font-semibold bg-background hover:bg-primary/5 transition font-sans"
                  >
                    Modern Teal
                  </button>
                  <button 
                    onClick={() => startWithPreset('emerald')} 
                    className="p-2.5 text-left border border-border hover:border-primary hover:text-primary rounded-lg text-xs font-semibold bg-background hover:bg-primary/5 transition font-sans"
                  >
                    Emerald
                  </button>
                  <button 
                    onClick={() => startWithPreset('minimalist')} 
                    className="p-2.5 text-left border border-border hover:border-primary hover:text-primary rounded-lg text-xs font-semibold bg-background hover:bg-primary/5 transition font-sans"
                  >
                    Minimalist
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Upload Existing Certificate */}
            <div className="bg-surface border border-border hover:border-primary/40 rounded-2xl p-6 md:p-8 flex flex-col justify-between transition-all duration-300 shadow-md group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition duration-300">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-display font-bold text-ink mb-3">Upload Existing Certificate</h3>
                <p className="text-xs text-slate mb-6 leading-relaxed font-sans">
                  Upload any PDF or Image certificate to quickly place signatures, logos, stamps, custom dates, or recipient name blocks.
                </p>

                {/* File Dropper Dropzone */}
                <div 
                  className={`border-2 border-dashed rounded-xl p-6 transition text-center cursor-pointer relative font-sans ${
                    dragActive 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50 bg-background hover:bg-primary/5/20'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('dashboard-file-upload')?.click()}
                >
                  <input
                    type="file"
                    id="dashboard-file-upload"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-slate mx-auto mb-2 opacity-60" />
                  <span className="text-xs font-bold text-ink block">Click or drag file here</span>
                  <span className="text-[10px] text-slate block mt-1">Supports PDF, PNG, JPG, JPEG</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: ACTIVE EDITOR WORKSPACE */}
      {mode === 'editor' && (
        <div className={isMaximized 
          ? "fixed inset-0 z-[150] bg-slate-50 dark:bg-zinc-950 flex flex-col p-4 md:p-6 gap-4 w-[100dvw] h-[100dvh] overflow-hidden animate-in fade-in duration-200" 
          : "bg-surface border border-border rounded-xl p-4 md:p-6 shadow-sm animate-in fade-in duration-300 flex flex-col"
        }>
          
          {/* Maximized View Header */}
          {isMaximized && (
            <div className="flex items-center justify-between border-b border-border dark:border-zinc-800 pb-2 flex-shrink-0">
              <div>
                <h2 className="text-sm font-sans font-bold text-ink dark:text-zinc-100">Certificate Editor (Maximized Workspace)</h2>
                <p className="text-[10px] text-slate dark:text-zinc-400 font-sans">Press <kbd className="bg-background dark:bg-zinc-800 px-1 border dark:border-zinc-700 rounded text-ink dark:text-zinc-300">ESC</kbd> or click the restore button to exit.</p>
              </div>
            </div>
          )}

          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${isMaximized ? 'flex-1 min-h-0 overflow-hidden' : ''}`}>
            
            {/* LEFT PANEL: Templates & Insert Elements (Col 3) */}
            <div className={`lg:col-span-3 space-y-5 ${isMaximized ? 'overflow-y-auto pr-2 custom-scrollbar h-full pb-4' : ''}`}>
              
              {/* Template Selector */}
              <div className="p-4 bg-background border border-border rounded-xl">
                <h3 className="font-display font-bold text-xs text-ink uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-primary" /> Certificate Layout
                </h3>
                
                {template === 'custom' ? (
                  <div className="space-y-3">
                    <div className="p-2.5 bg-primary/5 border border-primary/20 rounded-lg text-center">
                      <span className="text-[11px] font-sans font-bold text-primary block">Custom Document Loaded</span>
                      <span className="text-[10px] text-slate block mt-0.5">Aspect ratio and dimensions preserved.</span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-center text-xs py-1.5"
                      leftIcon={<Upload className="w-3.5 h-3.5" />}
                      onClick={() => document.getElementById('bg-upload-file')?.click()}
                    >
                      Change Background
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleTemplateChange('classic')}
                      className={`p-2 rounded-lg border text-xs font-semibold text-left transition ${template === 'classic' ? 'bg-primary/10 border-primary text-primary' : 'bg-surface border-border text-slate hover:text-ink'}`}
                    >
                      Classic Navy
                    </button>
                    <button
                      onClick={() => handleTemplateChange('modern')}
                      className={`p-2 rounded-lg border text-xs font-semibold text-left transition ${template === 'modern' ? 'bg-primary/10 border-primary text-primary' : 'bg-surface border-border text-slate hover:text-ink'}`}
                    >
                      Modern Teal
                    </button>
                    <button
                      onClick={() => handleTemplateChange('emerald')}
                      className={`p-2 rounded-lg border text-xs font-semibold text-left transition ${template === 'emerald' ? 'bg-primary/10 border-primary text-primary' : 'bg-surface border-border text-slate hover:text-ink'}`}
                    >
                      Emerald
                    </button>
                    <button
                      onClick={() => handleTemplateChange('minimalist')}
                      className={`p-2 rounded-lg border text-xs font-semibold text-left transition ${template === 'minimalist' ? 'bg-primary/10 border-primary text-primary' : 'bg-surface border-border text-slate hover:text-ink'}`}
                    >
                      Minimalist
                    </button>
                  </div>
                )}

                <div className="hidden">
                  <input
                    type="file"
                    id="bg-upload-file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Element Insertion */}
              <div className="p-4 bg-background border border-border rounded-xl space-y-4">
                <div>
                  <h3 className="font-display font-bold text-xs text-ink uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Type className="w-4 h-4 text-primary" /> Insert Text
                  </h3>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => addTextElement('title')}
                      className="w-full text-left py-1.5 px-3 bg-surface hover:bg-surface/80 border border-border rounded text-xs font-medium text-ink transition font-sans"
                    >
                      + Heading (Title)
                    </button>
                    <button
                      onClick={() => addTextElement('subtitle')}
                      className="w-full text-left py-1.5 px-3 bg-surface hover:bg-surface/80 border border-border rounded text-xs font-medium text-ink transition font-sans"
                    >
                      + Recipient Name
                    </button>
                    <button
                      onClick={() => addTextElement('body')}
                      className="w-full text-left py-1.5 px-3 bg-surface hover:bg-surface/80 border border-border rounded text-xs font-medium text-ink transition font-sans"
                    >
                      + Details / Paragraph
                    </button>
                    <button
                      onClick={() => addTextElement('custom')}
                      className="w-full text-left py-1.5 px-3 bg-surface hover:bg-surface/80 border border-border rounded text-xs font-medium text-ink transition font-sans"
                    >
                      + Custom Text block
                    </button>
                  </div>
                </div>

                <div className="border-t border-border/60 pt-3">
                  <h3 className="font-display font-bold text-xs text-ink uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <Square className="w-4 h-4 text-primary" /> Insert Shapes
                  </h3>
                  <div className="grid grid-cols-2 gap-1.5 font-sans">
                    <button
                      onClick={() => addShapeElement('rect')}
                      className="py-1.5 px-2 bg-surface hover:bg-surface/80 border border-border rounded text-xs text-ink text-center transition"
                    >
                      Rectangle
                    </button>
                    <button
                      onClick={() => addShapeElement('circle')}
                      className="py-1.5 px-2 bg-surface hover:bg-surface/80 border border-border rounded text-xs text-ink text-center transition"
                    >
                      Circle
                    </button>
                    <button
                      onClick={() => addShapeElement('line')}
                      className="py-1.5 px-2 bg-surface hover:bg-surface/80 border border-border rounded text-xs text-ink text-center transition"
                    >
                      Line
                    </button>
                    <button
                      onClick={() => addShapeElement('seal')}
                      className="py-1.5 px-2 bg-surface hover:bg-surface/80 border border-border rounded text-xs text-ink text-center flex items-center justify-center gap-1 transition"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" /> Star Seal
                    </button>
                  </div>
                </div>

                <div className="border-t border-border/60 pt-3 space-y-2">
                  <h3 className="font-display font-bold text-xs text-ink uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-primary" /> Logos & Signatures
                  </h3>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs py-1.5 justify-center"
                    leftIcon={<PenTool className="w-3.5 h-3.5" />}
                    onClick={() => setIsSigModalOpen(true)}
                  >
                    Signature Pad
                  </Button>

                  <div>
                    <input
                      type="file"
                      id="logo-upload-file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-xs py-1.5 justify-center"
                      leftIcon={<Upload className="w-3.5 h-3.5" />}
                      onClick={() => document.getElementById('logo-upload-file')?.click()}
                    >
                      Upload Logo/Image
                    </Button>
                  </div>
                </div>
              </div>

              {/* Drawing Mode Toggle */}
              <div className="p-4 bg-background border border-border rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-xs text-ink uppercase tracking-wider flex items-center gap-1.5">
                    <PenTool className="w-4 h-4 text-primary" /> Freehand Drawing
                  </h3>
                  <button
                    onClick={() => setIsDrawing(!isDrawing)}
                    className={`px-3 py-1 text-[11px] font-sans font-bold rounded-lg transition ${isDrawing ? 'bg-primary text-white' : 'bg-surface border border-border text-slate'}`}
                  >
                    {isDrawing ? 'ON' : 'OFF'}
                  </button>
                </div>

                {isDrawing && (
                  <div className="space-y-2.5 pt-2 animate-in slide-in-from-top-1 duration-200">
                    <div className="flex justify-between items-center text-xs text-slate">
                      <span>Brush Size</span>
                      <span className="font-mono">{brushWidth}px</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={brushWidth}
                      onChange={(e) => setBrushWidth(Number(e.target.value))}
                      className="w-full accent-primary"
                    />

                    <div className="flex items-center justify-between text-xs text-slate">
                      <span>Brush Color</span>
                      <input
                        type="color"
                        value={brushColor}
                        onChange={(e) => setBrushColor(e.target.value)}
                        className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* MIDDLE: Interactive Canvas (Col 6) */}
            <div className={`lg:col-span-6 flex flex-col items-center ${isMaximized ? 'h-full overflow-hidden' : ''}`}>
              
              {/* Top Toolbar Wrapper */}
              <div className="w-full flex items-center gap-2 bg-background border border-border rounded-xl px-2 py-2 mb-4">
                <div className="flex-1 flex items-center justify-between overflow-x-auto px-2 gap-4 custom-scrollbar-thin">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={handleBackToStart}
                      title="Back to start screen"
                      className="flex items-center gap-1 px-2.5 py-1.5 bg-surface hover:bg-surface/85 border border-border rounded-lg text-xs font-semibold text-ink transition"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back</span>
                    </button>
                    
                    <div className="w-[1px] h-6 bg-border mx-1" />

                    <button
                      onClick={handleUndo}
                      disabled={!canUndo}
                      title="Undo"
                      className="p-2 bg-surface hover:bg-surface/80 disabled:opacity-40 border border-border rounded-lg text-ink transition"
                    >
                      <Undo2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleRedo}
                      disabled={!canRedo}
                      title="Redo"
                      className="p-2 bg-surface hover:bg-surface/80 disabled:opacity-40 border border-border rounded-lg text-ink transition"
                    >
                      <Redo2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleResetCanvas}
                      title="Reset Canvas"
                      className="p-2 bg-surface hover:bg-surface/80 border border-border rounded-lg text-ink hover:text-red-500 transition"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleZoomChange(0.9)}
                      title="Zoom Out"
                      className="p-2 bg-surface hover:bg-surface/80 border border-border rounded-lg text-ink transition"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono text-slate bg-surface border border-border px-2 py-1 rounded-lg">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      onClick={() => handleZoomChange(1.1)}
                      title="Zoom In"
                      className="p-2 bg-surface hover:bg-surface/80 border border-border rounded-lg text-ink transition"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={resetZoom}
                      title="100%"
                      className="px-2.5 py-1 bg-surface hover:bg-surface/80 border border-border rounded-lg text-xs text-ink transition font-sans"
                    >
                      Actual Size
                    </button>
                  </div>
                </div>
                
                {/* Fullscreen Button pinned to the right */}
                <div className="flex items-center pl-2 border-l border-border flex-shrink-0">
                  <button
                    onClick={handleToggleMaximize}
                    title={isMaximized ? "Exit Fullscreen" : "Enter Fullscreen"}
                    className="p-2 bg-surface hover:bg-surface/80 border border-border rounded-lg text-ink transition"
                  >
                    {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* The actual canvas container with scroll/scale */}
              <div 
                ref={containerRef}
                className={`w-full relative border border-border rounded-xl bg-background/50 overflow-auto flex justify-center items-center p-4 ${isMaximized ? 'flex-1 min-h-0' : 'min-h-[480px]'}`}
              >
                {/* Prevent global canvas rules from distorting Fabric layout */}
                <style dangerouslySetInnerHTML={{ __html: `
                  .canvas-container, .canvas-container canvas {
                    max-width: none !important;
                    max-height: none !important;
                  }
                `}} />

                {/* Sized container matching scaled layout footprint */}
                <div 
                  style={{
                    width: `${canvasSize.width * zoom}px`,
                    height: `${canvasSize.height * zoom}px`,
                  }}
                  className="relative flex-shrink-0 overflow-hidden transition-all duration-200"
                >
                  {/* Visually scaled wrapper centered inside layout wrapper */}
                  <div 
                    className="absolute border border-slate/30 shadow-lg bg-white overflow-hidden origin-top-left animate-in fade-in duration-300"
                    style={{ 
                      width: `${canvasSize.width}px`, 
                      height: `${canvasSize.height}px`, 
                      transform: `scale(${zoom})`,
                      transformOrigin: 'top left',
                      left: 0,
                      top: 0
                    }}
                  >
                    <canvas ref={canvasElRef} className="block" />
                  </div>
                </div>
              </div>

              <p className="text-[11px] font-sans text-slate mt-2 text-center">
                * Select any element to edit details. Use the properties panel to style, delete or position items.
              </p>
            </div>

            {/* RIGHT PANEL: Object Properties Panel (Col 3) */}
            <div className={`lg:col-span-3 space-y-4 ${isMaximized ? 'overflow-y-auto pr-2 custom-scrollbar h-full pb-4' : ''}`}>
              
              {/* Contextual Properties Box */}
              <div className="p-4 bg-background border border-border rounded-xl space-y-4 min-h-[350px]">
                <h3 className="font-display font-bold text-xs text-ink uppercase tracking-wider mb-2 pb-2 border-b border-border flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-primary" /> Element Properties
                </h3>

                {!selectedType ? (
                  <div className="flex flex-col items-center justify-center text-center py-12 text-slate space-y-2">
                    <Award className="w-8 h-8 opacity-40 text-primary" />
                    <p className="text-xs font-sans font-bold">No element selected</p>
                    <p className="text-[10px] max-w-[150px] leading-relaxed font-sans">
                      Click on any text, shape, or image on the certificate to modify its properties.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    
                    {/* TEXT PROPERTIES */}
                    {(selectedType === 'textbox' || selectedType === 'text') && (
                      <div className="space-y-3.5 font-sans">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate uppercase tracking-wider">
                            Edit Content
                          </label>
                          <textarea
                            rows={2}
                            value={textVal}
                            onChange={(e) => handleTextPropertyChange('text', e.target.value)}
                            className="w-full p-2 bg-surface border border-border rounded text-xs text-ink outline-none focus:border-primary resize-y"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate uppercase tracking-wider">
                            Font Family
                          </label>
                          <select
                            value={fontFamily}
                            onChange={(e) => handleTextPropertyChange('fontFamily', e.target.value)}
                            className="w-full h-8 px-2 bg-surface border border-border rounded text-xs text-ink outline-none focus:border-primary"
                          >
                            <option value="Montserrat">Montserrat (Modern Serif)</option>
                            <option value="Great Vibes">Great Vibes (Elegant Script)</option>
                            <option value="Playfair Display">Playfair Display (Serif)</option>
                            <option value="Inter">Inter (Sans-serif)</option>
                            <option value="Alex Brush">Alex Brush (Calligraphy)</option>
                            <option value="Courier New">Courier New (Monospace)</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate uppercase tracking-wider">
                              Size ({fontSize}px)
                            </label>
                            <input
                              type="number"
                              min="8"
                              max="120"
                              value={fontSize}
                              onChange={(e) => handleTextPropertyChange('fontSize', e.target.value)}
                              className="w-full h-8 px-2 bg-surface border border-border rounded text-xs text-ink outline-none focus:border-primary"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate uppercase tracking-wider">
                              Color
                            </label>
                            <div className="flex gap-2 items-center">
                              <input
                                type="color"
                                value={textColor}
                                onChange={(e) => handleTextPropertyChange('color', e.target.value)}
                                className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent"
                              />
                              <span className="text-[10px] font-mono text-slate uppercase">{textColor}</span>
                            </div>
                          </div>
                        </div>

                        {/* Text Styles */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate uppercase tracking-wider">
                            Styles
                          </label>
                          <div className="flex bg-surface border border-border rounded p-0.5 w-fit gap-0.5">
                            <button
                              onClick={() => handleTextPropertyChange('bold', !isBold)}
                              className={`p-1.5 rounded transition text-xs ${isBold ? 'bg-primary/20 text-primary font-bold' : 'text-slate hover:text-ink'}`}
                              title="Bold"
                            >
                              <Bold className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleTextPropertyChange('italic', !isItalic)}
                              className={`p-1.5 rounded transition text-xs ${isItalic ? 'bg-primary/20 text-primary font-bold' : 'text-slate hover:text-ink'}`}
                              title="Italic"
                            >
                              <Italic className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleTextPropertyChange('underline', !isUnderline)}
                              className={`p-1.5 rounded transition text-xs ${isUnderline ? 'bg-primary/20 text-primary font-bold' : 'text-slate hover:text-ink'}`}
                              title="Underline"
                            >
                              <Underline className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Alignments */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate uppercase tracking-wider">
                            Alignment
                          </label>
                          <div className="flex bg-surface border border-border rounded p-0.5 w-fit gap-0.5">
                            <button
                              onClick={() => handleTextPropertyChange('align', 'left')}
                              className={`p-1.5 rounded transition text-xs ${textAlign === 'left' ? 'bg-primary/20 text-primary' : 'text-slate hover:text-ink'}`}
                              title="Align Left"
                            >
                              <AlignLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleTextPropertyChange('align', 'center')}
                              className={`p-1.5 rounded transition text-xs ${textAlign === 'center' ? 'bg-primary/20 text-primary' : 'text-slate hover:text-ink'}`}
                              title="Align Center"
                            >
                              <AlignCenter className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleTextPropertyChange('align', 'right')}
                              className={`p-1.5 rounded transition text-xs ${textAlign === 'right' ? 'bg-primary/20 text-primary' : 'text-slate hover:text-ink'}`}
                              title="Align Right"
                            >
                              <AlignRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* SHAPE PROPERTIES */}
                    {['rect', 'circle', 'path', 'polygon'].includes(selectedType) && (
                      <div className="space-y-3.5 font-sans">
                        
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate uppercase tracking-wider">
                            Fill Color
                          </label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={shapeColor === 'transparent' ? '#ffffff' : shapeColor}
                              onChange={(e) => handleShapePropertyChange('fill', e.target.value)}
                              className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent"
                            />
                            <button 
                              onClick={() => handleShapePropertyChange('fill', 'transparent')}
                              className="px-2 py-1 bg-surface border border-border rounded text-[10px] text-slate hover:text-ink"
                            >
                              Transparent
                            </button>
                            <span className="text-[10px] font-mono text-slate uppercase">{shapeColor}</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate uppercase tracking-wider">
                            Stroke Color
                          </label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={shapeStrokeColor === 'transparent' ? '#000000' : shapeStrokeColor}
                              onChange={(e) => handleShapePropertyChange('stroke', e.target.value)}
                              className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent"
                            />
                            <button 
                              onClick={() => handleShapePropertyChange('stroke', 'transparent')}
                              className="px-2 py-1 bg-surface border border-border rounded text-[10px] text-slate hover:text-ink"
                            >
                              None
                            </button>
                            <span className="text-[10px] font-mono text-slate uppercase">{shapeStrokeColor}</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-slate uppercase tracking-wider">
                            <span>Stroke Width</span>
                            <span>{shapeStrokeWidth}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="15"
                            value={shapeStrokeWidth}
                            onChange={(e) => handleShapePropertyChange('strokeWidth', e.target.value)}
                            className="w-full accent-primary"
                          />
                        </div>

                      </div>
                    )}

                    {/* LAYERING & ARRANGE CONTROL (Common for all) */}
                    <div className="border-t border-border/80 pt-3 space-y-2 font-sans">
                      <label className="block text-[10px] font-bold text-slate uppercase tracking-wider">
                        Arrange Layers
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => layerArrange('front')}
                          className="flex-1 py-1.5 px-2.5 bg-surface hover:bg-surface/80 border border-border rounded text-xs text-ink transition text-center"
                        >
                          Bring to Front
                        </button>
                        <button
                          onClick={() => layerArrange('back')}
                          className="flex-1 py-1.5 px-2.5 bg-surface hover:bg-surface/80 border border-border rounded text-xs text-ink transition text-center"
                        >
                          Send to Back
                        </button>
                      </div>
                    </div>

                    {/* DELETE OBJECT */}
                    <div className="border-t border-border/80 pt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 text-xs justify-center py-2"
                        leftIcon={<Trash2 className="w-4 h-4" />}
                        onClick={deleteSelected}
                      >
                        Delete Element
                      </Button>
                    </div>

                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Loading overlay for exports */}
          {isProcessing && <LoadingSpinner text="Processing/Generating files..." />}

          {/* BOTTOM EXPORT ACTIONS */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-border mt-8">
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => handleExport('png')}
              disabled={isProcessing}
              leftIcon={<ImageIcon className="w-5 h-5" />}
            >
              Export PNG Image
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => handleExport('pdf')}
              disabled={isProcessing}
              leftIcon={<Download className="w-5 h-5" />}
            >
              Download PDF
            </Button>
          </div>

        </div>
      )}

      {/* SIGNATURE PAD MODAL DIALOG */}
      {isSigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-border rounded-xl max-w-md w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setIsSigModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-background text-slate transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-bold text-lg text-ink mb-2">Signature Pad</h3>
            <p className="font-sans text-xs text-slate mb-4">
              Draw your signature in the frame below. It will be added as a transparent PNG onto the certificate.
            </p>

            <div className="bg-white border-2 border-dashed border-border rounded-lg overflow-hidden relative cursor-crosshair">
              <canvas
                ref={sigPadElRef}
                width={400}
                height={160}
                onMouseDown={startSigPadDrawing}
                onMouseMove={drawSigPad}
                onMouseUp={stopSigPadDrawing}
                onMouseLeave={stopSigPadDrawing}
                onTouchStart={startSigPadDrawing}
                onTouchMove={drawSigPad}
                onTouchEnd={stopSigPadDrawing}
                className="w-full bg-white block touch-none"
              />
            </div>

            <div className="flex justify-between items-center gap-2 mt-5 pt-4 border-t border-border">
              <Button 
                variant="outline" 
                size="sm" 
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                onClick={clearSigPad}
              >
                Clear
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsSigModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  size="sm" 
                  leftIcon={<Check className="w-3.5 h-3.5" />}
                  onClick={insertSigPadSignature}
                >
                  Insert
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}

    </ToolLayout>
  );
}
