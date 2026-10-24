"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as fabric from 'fabric';
import { jsPDF } from 'jspdf';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/tools/LoadingSpinner';
import { 
  Award, Type, Square, Circle, Sparkles, Undo2, Redo2, ZoomIn, ZoomOut, 
  RotateCcw, Trash2, PenTool, Upload, Download, Check, X, Image as ImageIcon, 
  Layers, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline, ArrowLeft,
  Maximize2, Minimize2, Copy, Sliders, ChevronDown, FileText, CheckCircle2,
  Calendar, ShieldCheck, Feather, MoveHorizontal, MoveVertical, Palette, HelpCircle,
  FolderOpen, Save
} from 'lucide-react';
import { loadPdfDocument, renderPageToDataUrl } from '@/lib/pdf/pdfRenderHelpers';
import { CERTIFICATE_TEMPLATES, CertificateTheme } from './certificateTemplates';
import { DECORATIVE_ELEMENTS, BadgeElement } from './decorativeElements';

const PRESET_TITLES = [
  "CERTIFICATE OF ACHIEVEMENT",
  "CERTIFICATE OF COMPLETION",
  "CERTIFICATE OF APPRECIATION",
  "DIPLOMA OF EXCELLENCE",
  "CERTIFICATE OF RECOGNITION",
  "AWARD OF PARTICIPATION",
  "EMPLOYEE OF THE MONTH",
];

const FONT_OPTIONS = [
  { name: 'Cinzel (Regal Classic)', value: 'Cinzel', family: 'serif' },
  { name: 'Playfair Display (Editorial)', value: 'Playfair Display', family: 'serif' },
  { name: 'Great Vibes (Luxury Script)', value: 'Great Vibes', family: 'cursive' },
  { name: 'Alex Brush (Calligraphy)', value: 'Alex Brush', family: 'cursive' },
  { name: 'Pinyon Script (Royal Cursive)', value: 'Pinyon Script', family: 'cursive' },
  { name: 'Montserrat (Modern Bold)', value: 'Montserrat', family: 'sans-serif' },
  { name: 'Inter (Clean Sans)', value: 'Inter', family: 'sans-serif' },
  { name: 'EB Garamond (Academic)', value: 'EB Garamond', family: 'serif' },
];

export function CertificateEditorClient({ article }: { article?: string }) {
  // Navigation & Workspace Mode
  const [mode, setMode] = useState<'select' | 'editor'>('select');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('classic');
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'quick-fill' | 'design' | 'decorations'>('quick-fill');

  // Canvas & Document State (Standard Certificate 1000 x 707 A4 aspect)
  const [documentState, setDocumentState] = useState({
    width: 1000,
    height: 707,
    aspectRatio: 1000 / 707,
    orientation: 'landscape' as 'portrait' | 'landscape',
  });
  const [customBgDataUrl, setCustomBgDataUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('Processing...');
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Zoom & Viewport
  const [zoom, setZoom] = useState(1);
  const [autoFitScale, setAutoFitScale] = useState(1);

  // Undo / Redo Stacks
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const undoStack = useRef<string[]>([]);
  const redoStack = useRef<string[]>([]);

  // Freehand Drawing Tool
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#f59e0b');
  const [brushWidth, setBrushWidth] = useState(4);

  // Active Selected Element Properties
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [textVal, setTextVal] = useState('');
  const [fontFamily, setFontFamily] = useState('Montserrat');
  const [fontSize, setFontSize] = useState(24);
  const [textColor, setTextColor] = useState('#0f172a');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [elementOpacity, setElementOpacity] = useState(1);

  // Shape Properties
  const [shapeColor, setShapeColor] = useState('#0d9488');
  const [shapeStrokeColor, setShapeStrokeColor] = useState('#f59e0b');
  const [shapeStrokeWidth, setShapeStrokeWidth] = useState(2);

  // Quick Fill Form State
  const [quickFill, setQuickFill] = useState({
    title: 'CERTIFICATE OF ACHIEVEMENT',
    presentation: 'THIS IS PROUDLY PRESENTED TO',
    name: 'Alexander J. Bennett',
    description: 'for exceptional dedication, outstanding academic excellence, and successful mastery of all requirements in the advanced curriculum program.',
    date: 'October 24, 2026',
    certificateId: 'ID: CERT-2026-89421',
    signer1Name: 'Dr. Eleanor Vance',
    signer1Title: 'Academic Director',
    signer2Name: 'Marcus Holloway',
    signer2Title: 'Dean of Faculty',
  });

  // Signature Studio Modal
  const [isSigModalOpen, setIsSigModalOpen] = useState(false);
  const [sigModalTab, setSigModalTab] = useState<'draw' | 'type' | 'upload'>('draw');
  const [sigPenColor, setSigPenColor] = useState('#0f172a');
  const [sigPenWidth, setSigPenWidth] = useState(3);
  const [typedSigName, setTypedSigName] = useState('Alexander J. Bennett');
  const [typedSigFont, setTypedSigFont] = useState('Great Vibes');

  // DOM Refs
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvas = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sigPadElRef = useRef<HTMLCanvasElement>(null);
  const sigDrawingRef = useRef(false);
  const sigPointsRef = useRef<{ x: number; y: number }[]>([]);
  const isUpdatingFromCanvas = useRef(false);

  const documentStateRef = useRef(documentState);
  documentStateRef.current = documentState;

  // Show auto-dismissing notice
  const notify = (msg: string) => {
    setSuccessNotice(msg);
    setTimeout(() => setSuccessNotice(null), 3500);
  };

  // Safe History State Saver
  const saveState = useCallback(() => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;
    try {
      const json = JSON.stringify((canvas as any).toJSON([
        'selectable', 'evented', 'isBackground', 'fieldId', 'lockMovementX', 'lockMovementY', 'lockRotation', 'lockScalingX', 'lockScalingY'
      ]));
      undoStack.current.push(json);
      if (undoStack.current.length > 35) {
        undoStack.current.shift();
      }
      redoStack.current = [];
      setCanUndo(true);
      setCanRedo(false);
    } catch (e) {
      console.warn("Could not serialize canvas state:", e);
    }
  }, []);

  // Update canvas dimension & native zoom cleanly
  const applyCanvasZoom = useCallback((newZoom: number) => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;
    const { width, height } = documentStateRef.current;
    
    canvas.setDimensions({
      width: width * newZoom,
      height: height * newZoom
    });
    canvas.setZoom(newZoom);
    canvas.requestRenderAll();
    setZoom(newZoom);
  }, []);

  // Calculate container auto-fit scale
  const fitCanvasToContainer = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const padding = 36;
    const availW = Math.max(100, container.clientWidth - padding);
    const availH = Math.max(100, container.clientHeight - padding);

    const docW = documentStateRef.current.width;
    const docH = documentStateRef.current.height;

    const scaleW = availW / docW;
    const scaleH = availH / docH;
    let targetScale = Math.min(scaleW, scaleH);
    targetScale = Math.max(0.25, Math.min(targetScale, 1.6));

    setAutoFitScale(targetScale);
    applyCanvasZoom(targetScale);
  }, [applyCanvasZoom]);

  // Load Background Helper
  const loadTemplateBackground = useCallback((themeId: string, insertDefaultFields = true) => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    setError(null);
    const theme = CERTIFICATE_TEMPLATES[themeId] || CERTIFICATE_TEMPLATES.classic;
    const base64 = window.btoa(unescape(encodeURIComponent(theme.svg.trim())));
    const dataUrl = `data:image/svg+xml;base64,${base64}`;

    const docW = 1000;
    const docH = 707;
    setDocumentState({
      width: docW,
      height: docH,
      aspectRatio: docW / docH,
      orientation: 'landscape',
    });

    fabric.Image.fromURL(dataUrl, { crossOrigin: 'anonymous' }).then((bgImg) => {
      canvas.clear();
      canvas.backgroundColor = '#0b0b0f';

      bgImg.set({
        scaleX: docW / (bgImg.width || 1),
        scaleY: docH / (bgImg.height || 1),
        left: 0,
        top: 0,
        originX: 'left',
        originY: 'top',
        selectable: false,
        evented: false,
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        isBackground: true,
      } as any);

      canvas.add(bgImg);
      canvas.sendObjectToBack(bgImg);

      if (insertDefaultFields) {
        // Issuing Org
        const orgText = new fabric.Textbox('GLOBAL ACADEMY OF EXCELLENCE', {
          left: 100,
          top: 90,
          width: 800,
          fontSize: 13,
          fontFamily: theme.bodyFont,
          fontWeight: '600',
          fill: theme.secondaryTextColor,
          textAlign: 'center',
          charSpacing: 220,
          originX: 'left',
          originY: 'top',
          fieldId: 'org',
        } as any);

        // Main Title
        const titleText = new fabric.Textbox(quickFill.title, {
          left: 100,
          top: 140,
          width: 800,
          fontSize: 38,
          fontFamily: theme.titleFont,
          fontWeight: 'bold',
          fill: theme.accentColor,
          textAlign: 'center',
          charSpacing: 80,
          originX: 'left',
          originY: 'top',
          fieldId: 'title',
        } as any);

        // Presentation Line
        const presText = new fabric.Textbox(quickFill.presentation, {
          left: 100,
          top: 225,
          width: 800,
          fontSize: 13,
          fontFamily: theme.bodyFont,
          fontWeight: '600',
          fill: theme.secondaryTextColor,
          textAlign: 'center',
          charSpacing: 180,
          originX: 'left',
          originY: 'top',
          fieldId: 'presentation',
        } as any);

        // Recipient Name
        const nameText = new fabric.Textbox(quickFill.name, {
          left: 100,
          top: 275,
          width: 800,
          fontSize: 54,
          fontFamily: theme.nameFont,
          fontWeight: 'bold',
          fill: theme.accentColor,
          textAlign: 'center',
          originX: 'left',
          originY: 'top',
          fieldId: 'name',
        } as any);

        // Gold line under name
        const line = new fabric.Line([350, 360, 650, 360], {
          stroke: theme.accentColor,
          strokeWidth: 1.5,
          opacity: 0.6,
          selectable: true,
          fieldId: 'divider',
        } as any);

        // Description Paragraph
        const descText = new fabric.Textbox(quickFill.description, {
          left: 150,
          top: 385,
          width: 700,
          fontSize: 15,
          fontFamily: theme.bodyFont,
          fill: theme.textColor,
          textAlign: 'center',
          lineHeight: 1.5,
          originX: 'left',
          originY: 'top',
          fieldId: 'description',
        } as any);

        // Date Line (Left bottom)
        const dateText = new fabric.Textbox(`Issued on: ${quickFill.date}`, {
          left: 120,
          top: 550,
          width: 250,
          fontSize: 13,
          fontFamily: theme.bodyFont,
          fill: theme.secondaryTextColor,
          textAlign: 'center',
          originX: 'left',
          originY: 'top',
          fieldId: 'date',
        } as any);

        const dateLine = new fabric.Line([120, 540, 370, 540], {
          stroke: theme.secondaryTextColor,
          strokeWidth: 1,
          opacity: 0.4,
          selectable: true,
        });

        // Signer (Right bottom)
        const signerText = new fabric.Textbox(`${quickFill.signer1Name}\n${quickFill.signer1Title}`, {
          left: 630,
          top: 550,
          width: 250,
          fontSize: 13,
          fontFamily: theme.bodyFont,
          fill: theme.secondaryTextColor,
          textAlign: 'center',
          lineHeight: 1.3,
          originX: 'left',
          originY: 'top',
          fieldId: 'signer',
        } as any);

        const sigLine = new fabric.Line([630, 540, 880, 540], {
          stroke: theme.secondaryTextColor,
          strokeWidth: 1,
          opacity: 0.4,
          selectable: true,
        });

        // Certificate ID Footer
        const idText = new fabric.Textbox(quickFill.certificateId, {
          left: 100,
          top: 645,
          width: 800,
          fontSize: 11,
          fontFamily: theme.bodyFont,
          fill: theme.secondaryTextColor,
          textAlign: 'center',
          opacity: 0.7,
          originX: 'left',
          originY: 'top',
          fieldId: 'certId',
        } as any);

        // Default Gold Rosette Badge in center bottom
        const rosetteBadge = DECORATIVE_ELEMENTS[0];
        const b64 = window.btoa(unescape(encodeURIComponent(rosetteBadge.svg)));
        fabric.Image.fromURL(`data:image/svg+xml;base64,${b64}`, { crossOrigin: 'anonymous' }).then((sealImg) => {
          sealImg.set({
            left: 455,
            top: 485,
            scaleX: 90 / 200,
            scaleY: 90 / 200,
            originX: 'left',
            originY: 'top',
            fieldId: 'seal',
          } as any);
          canvas.add(sealImg);
          canvas.requestRenderAll();
        });

        canvas.add(orgText, titleText, presText, nameText, line, descText, dateLine, dateText, sigLine, signerText, idText);
      }

      // Re-trigger font load rendering
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          canvas.requestRenderAll();
        });
      }

      canvas.requestRenderAll();
      undoStack.current = [];
      redoStack.current = [];
      setCanUndo(false);
      setCanRedo(false);
      fitCanvasToContainer();
    }).catch((err) => {
      console.error("Failed to load certificate template:", err);
      setError("Unable to render the selected certificate background.");
    });
  }, [quickFill, fitCanvasToContainer]);

  // Load custom background onto canvas (image or uploaded PDF)
  const loadCustomBackgroundOnCanvas = useCallback((dataUrl: string) => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    const imgEl = new Image();
    imgEl.src = dataUrl;
    imgEl.onload = () => {
      const aspect = imgEl.naturalWidth / imgEl.naturalHeight;
      const newWidth = 1000;
      const newHeight = Math.round(1000 / aspect);

      setDocumentState({
        width: newWidth,
        height: newHeight,
        aspectRatio: aspect,
        orientation: aspect >= 1 ? 'landscape' : 'portrait',
      });

      fabric.Image.fromURL(dataUrl, { crossOrigin: 'anonymous' }).then((bgImg) => {
        canvas.clear();
        canvas.backgroundColor = '#0b0b0f';

        bgImg.set({
          scaleX: newWidth / (bgImg.width || 1),
          scaleY: newHeight / (bgImg.height || 1),
          left: 0,
          top: 0,
          originX: 'left',
          originY: 'top',
          selectable: false,
          evented: false,
          lockMovementX: true,
          lockMovementY: true,
          lockRotation: true,
          lockScalingX: true,
          lockScalingY: true,
          isBackground: true,
        } as any);

        canvas.add(bgImg);
        canvas.sendObjectToBack(bgImg);

        // Add starter text block
        const starterText = new fabric.Textbox('ADD RECIPIENT / CERTIFICATE TEXT', {
          left: 100,
          top: Math.round(newHeight / 2) - 30,
          width: 800,
          fontSize: 32,
          fontFamily: 'Montserrat',
          fontWeight: 'bold',
          textAlign: 'center',
          fill: '#0f172a',
          originX: 'left',
          originY: 'top',
        });
        canvas.add(starterText);
        canvas.setActiveObject(starterText);

        canvas.requestRenderAll();
        undoStack.current = [];
        redoStack.current = [];
        setCanUndo(false);
        setCanRedo(false);
        fitCanvasToContainer();
      });
    };
  }, [fitCanvasToContainer]);

  // Handle Quick Fill synchronization to canvas textboxes
  const handleQuickFillChange = (field: keyof typeof quickFill, val: string) => {
    setQuickFill((prev) => ({ ...prev, [field]: val }));
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    isUpdatingFromCanvas.current = true;
    let found = false;

    canvas.getObjects().forEach((obj: any) => {
      if (obj.fieldId === field) {
        found = true;
        if (field === 'date') {
          obj.set({ text: `Issued on: ${val}` });
        } else if (field === 'signer1Name' || field === 'signer1Title') {
          const s1 = field === 'signer1Name' ? val : quickFill.signer1Name;
          const s2 = field === 'signer1Title' ? val : quickFill.signer1Title;
          obj.set({ text: `${s1}\n${s2}` });
        } else {
          obj.set({ text: val });
        }
      }
    });

    isUpdatingFromCanvas.current = false;
    canvas.requestRenderAll();
  };

  // Preset Title selector
  const handlePresetTitle = (t: string) => {
    handleQuickFillChange('title', t);
  };

  // Preset Date (Today)
  const setTodayDate = () => {
    const today = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    handleQuickFillChange('date', today);
  };

  // Keyboard Shortcuts (Delete, Undo, Redo, Duplicate, Arrows for Nudging)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const canvas = fabricCanvas.current;
      if (!canvas) return;

      const activeObj = canvas.getActiveObject() as any;
      const isEditingText = activeObj && activeObj.isEditing;

      // Escape key handles deselect or fullscreen
      if (e.key === 'Escape') {
        if (isMaximized) setIsMaximized(false);
        canvas.discardActiveObject();
        canvas.requestRenderAll();
        return;
      }

      // If user is actively typing inside a textbox, let them type normally
      if (isEditingText) return;

      // Check if focus is in an input or textarea outside canvas
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || targetTag === 'select') {
        return;
      }

      // Undo: Ctrl+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')) {
        e.preventDefault();
        handleRedo();
        return;
      }

      // Duplicate: Ctrl+D
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        duplicateSelected();
        return;
      }

      // Delete: Delete or Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (activeObj && !activeObj.isBackground) {
          e.preventDefault();
          deleteSelected();
          return;
        }
      }

      // Micro-Nudge with Arrow Keys (1px normally, 10px with Shift)
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key) && activeObj && !activeObj.isBackground) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        if (e.key === 'ArrowLeft') activeObj.set({ left: (activeObj.left || 0) - step });
        if (e.key === 'ArrowRight') activeObj.set({ left: (activeObj.left || 0) + step });
        if (e.key === 'ArrowUp') activeObj.set({ top: (activeObj.top || 0) - step });
        if (e.key === 'ArrowDown') activeObj.set({ top: (activeObj.top || 0) + step });
        activeObj.setCoords();
        canvas.requestRenderAll();
        saveState();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMaximized, saveState]);

  // Initialize Canvas
  useEffect(() => {
    if (mode !== 'editor' || !canvasElRef.current) return;

    if (fabric.Object && fabric.Object.prototype) {
      (fabric.Object.prototype as any).originX = 'left';
      (fabric.Object.prototype as any).originY = 'top';
    }

    const canvas = new fabric.Canvas(canvasElRef.current, {
      width: documentState.width,
      height: documentState.height,
      backgroundColor: '#f8fafc',
      selection: true,
      preserveObjectStacking: true,
      enableRetinaScaling: true,
    });

    fabricCanvas.current = canvas;

    // Load Initial Background
    if (selectedTemplateId !== 'custom') {
      loadTemplateBackground(selectedTemplateId, true);
    } else if (customBgDataUrl) {
      loadCustomBackgroundOnCanvas(customBgDataUrl);
    }

    // Selection Tracking
    const handleSelection = () => {
      const activeObj = canvas.getActiveObject() as any;
      if (!activeObj || activeObj.isBackground) {
        setSelectedType(null);
        return;
      }
      setSelectedType(activeObj.type || null);
      setElementOpacity(activeObj.opacity ?? 1);

      if (activeObj.type === 'textbox' || activeObj.type === 'text') {
        const textObj = activeObj as fabric.Textbox;
        setTextVal(textObj.text || '');
        setFontFamily(textObj.fontFamily || 'Montserrat');
        setFontSize(textObj.fontSize || 24);
        setTextColor(textObj.fill as string || '#0f172a');
        setIsBold(textObj.fontWeight === 'bold' || textObj.fontWeight === '700');
        setIsItalic(textObj.fontStyle === 'italic');
        setIsUnderline(textObj.underline || false);
        setTextAlign((textObj.textAlign as 'left' | 'center' | 'right') || 'center');
        setLetterSpacing(textObj.charSpacing || 0);
      } else if (['rect', 'circle', 'path', 'polygon', 'line'].includes(activeObj.type || '')) {
        setShapeColor(activeObj.fill as string || 'transparent');
        setShapeStrokeColor(activeObj.stroke as string || '#000000');
        setShapeStrokeWidth(activeObj.strokeWidth || 1);
      }
    };

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', () => setSelectedType(null));
    canvas.on('object:modified', saveState);

    // ResizeObserver on the container to auto-fit
    const container = containerRef.current;
    let ro: ResizeObserver | null = null;
    if (container) {
      ro = new ResizeObserver(() => {
        fitCanvasToContainer();
      });
      ro.observe(container);
    }

    // Trigger initial fit
    setTimeout(() => {
      fitCanvasToContainer();
    }, 100);

    return () => {
      if (ro) ro.disconnect();
      canvas.dispose();
      fabricCanvas.current = null;
    };
  }, [mode, selectedTemplateId, loadTemplateBackground, loadCustomBackgroundOnCanvas, fitCanvasToContainer, saveState]);

  // Freehand drawing settings listener
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

  // Undo / Redo Handlers
  const handleUndo = () => {
    const canvas = fabricCanvas.current;
    if (!canvas || undoStack.current.length === 0) return;

    const current = JSON.stringify((canvas as any).toJSON(['selectable', 'evented', 'isBackground', 'fieldId']));
    redoStack.current.push(current);

    const prev = undoStack.current.pop()!;
    canvas.loadFromJSON(prev, () => {
      canvas.getObjects().forEach((obj: any) => {
        if (obj.isBackground) {
          obj.set({
            selectable: false,
            evented: false,
            lockMovementX: true,
            lockMovementY: true,
            lockRotation: true,
            lockScalingX: true,
            lockScalingY: true,
          });
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

    const current = JSON.stringify((canvas as any).toJSON(['selectable', 'evented', 'isBackground', 'fieldId']));
    undoStack.current.push(current);

    const next = redoStack.current.pop()!;
    canvas.loadFromJSON(next, () => {
      canvas.getObjects().forEach((obj: any) => {
        if (obj.isBackground) {
          obj.set({
            selectable: false,
            evented: false,
            lockMovementX: true,
            lockMovementY: true,
            lockRotation: true,
            lockScalingX: true,
            lockScalingY: true,
          });
        }
      });
      canvas.requestRenderAll();
      setCanUndo(true);
      setCanRedo(redoStack.current.length > 0);
    });
  };

  // Add New Elements
  const addTextElement = (type: 'title' | 'recipient' | 'body' | 'signature') => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    saveState();
    let text = 'New Text Block';
    let size = 20;
    let weight = 'normal';
    let font = 'Montserrat';
    let color = '#0f172a';

    if (type === 'title') {
      text = 'CERTIFICATE TITLE';
      size = 36;
      weight = 'bold';
      font = 'Cinzel';
      color = '#f59e0b';
    } else if (type === 'recipient') {
      text = 'Recipient Name';
      size = 52;
      weight = 'bold';
      font = 'Great Vibes';
      color = '#0f172a';
    } else if (type === 'body') {
      text = 'In recognition of outstanding dedication, exceptional accomplishments, and high honors.';
      size = 15;
      font = 'Inter';
    } else if (type === 'signature') {
      text = 'Authorized Signature\nTitle / Department';
      size = 13;
      font = 'Inter';
    }

    const textObj = new fabric.Textbox(text, {
      left: 150,
      top: Math.round(documentState.height / 2) - 40,
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
    notify("Text element added.");
  };

  const addShapeElement = (shape: 'rect' | 'circle' | 'line') => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    saveState();
    let obj: fabric.Object;

    if (shape === 'rect') {
      obj = new fabric.Rect({
        left: 200,
        top: 200,
        width: 160,
        height: 100,
        fill: 'transparent',
        stroke: '#f59e0b',
        strokeWidth: 2,
        originX: 'left',
        originY: 'top',
      });
    } else if (shape === 'circle') {
      obj = new fabric.Circle({
        left: 200,
        top: 200,
        radius: 50,
        fill: 'transparent',
        stroke: '#f59e0b',
        strokeWidth: 2,
        originX: 'left',
        originY: 'top',
      });
    } else {
      obj = new fabric.Line([100, 100, 400, 100], {
        stroke: '#f59e0b',
        strokeWidth: 2,
        originX: 'left',
        originY: 'top',
      });
    }

    canvas.add(obj);
    canvas.setActiveObject(obj);
    canvas.requestRenderAll();
  };

  // Add Badge / Rosette / Medal
  const addDecorativeElement = (badge: BadgeElement) => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    saveState();
    const b64 = window.btoa(unescape(encodeURIComponent(badge.svg)));
    fabric.Image.fromURL(`data:image/svg+xml;base64,${b64}`, { crossOrigin: 'anonymous' }).then((img) => {
      img.set({
        left: Math.round((documentState.width - badge.defaultWidth) / 2),
        top: Math.round((documentState.height - badge.defaultHeight) / 2),
        scaleX: badge.defaultWidth / (img.width || 1),
        scaleY: badge.defaultHeight / (img.height || 1),
        originX: 'left',
        originY: 'top',
      });
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.requestRenderAll();
      notify(`Added ${badge.name}`);
    });
  };

  // Alignment Tools: Center Horizontally & Vertically
  const centerObjectHorizontally = () => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (!activeObj || (activeObj as any).isBackground) return;

    saveState();
    const docW = documentState.width;
    const objW = (activeObj.width || 0) * (activeObj.scaleX || 1);
    activeObj.set({ left: (docW - objW) / 2 });
    activeObj.setCoords();
    canvas.requestRenderAll();
    notify("Centered horizontally.");
  };

  const centerObjectVertically = () => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (!activeObj || (activeObj as any).isBackground) return;

    saveState();
    const docH = documentState.height;
    const objH = (activeObj.height || 0) * (activeObj.scaleY || 1);
    activeObj.set({ top: (docH - objH) / 2 });
    activeObj.setCoords();
    canvas.requestRenderAll();
    notify("Centered vertically.");
  };

  // Duplicate Selected Element
  const duplicateSelected = () => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (!activeObj || (activeObj as any).isBackground) return;

    saveState();
    activeObj.clone().then((cloned: fabric.Object) => {
      cloned.set({
        left: (activeObj.left || 0) + 25,
        top: (activeObj.top || 0) + 25,
        originX: 'left',
        originY: 'top',
        selectable: true,
        evented: true,
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.requestRenderAll();
      notify("Element duplicated.");
    });
  };

  // Delete Selected Element
  const deleteSelected = () => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (!activeObj || (activeObj as any).isBackground) return;

    saveState();
    if (activeObj.type === 'activeSelection') {
      (activeObj as fabric.ActiveSelection).forEachObject((o) => canvas.remove(o));
      canvas.discardActiveObject();
    } else {
      canvas.remove(activeObj);
    }
    canvas.requestRenderAll();
    setSelectedType(null);
  };

  // Layer Arrangement
  const layerArrange = (action: 'front' | 'back' | 'forward' | 'backward') => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (!activeObj || (activeObj as any).isBackground) return;

    saveState();
    if (action === 'front') {
      canvas.bringObjectToFront(activeObj);
    } else if (action === 'back') {
      canvas.sendObjectToBack(activeObj);
      // Ensure background stays at bottom
      const bg = canvas.getObjects().find((o: any) => o.isBackground);
      if (bg) canvas.sendObjectToBack(bg);
    } else if (action === 'forward') {
      canvas.bringObjectForward(activeObj);
    } else if (action === 'backward') {
      canvas.sendObjectBackwards(activeObj);
      const bg = canvas.getObjects().find((o: any) => o.isBackground);
      if (bg) canvas.sendObjectToBack(bg);
    }
    canvas.requestRenderAll();
  };

  // Text Property Change Handler
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
      // Ensure web font rendering
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => canvas.requestRenderAll());
      }
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
    } else if (prop === 'letterSpacing') {
      activeObj.set({ charSpacing: Number(val) });
      setLetterSpacing(Number(val));
    } else if (prop === 'opacity') {
      activeObj.set({ opacity: Number(val) });
      setElementOpacity(Number(val));
    } else if (prop === 'case') {
      const current = (activeObj as fabric.Textbox).text || '';
      let transformed = current;
      if (val === 'upper') transformed = current.toUpperCase();
      if (val === 'lower') transformed = current.toLowerCase();
      if (val === 'title') transformed = current.replace(/\b\w/g, (c) => c.toUpperCase());
      (activeObj as fabric.Textbox).set({ text: transformed });
      setTextVal(transformed);
    }

    canvas.requestRenderAll();
  };

  // Shape Property Change Handler
  const handleShapePropertyChange = (prop: string, val: any) => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (!activeObj || (activeObj as any).isBackground) return;

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
    } else if (prop === 'opacity') {
      activeObj.set({ opacity: Number(val) });
      setElementOpacity(Number(val));
    }
    canvas.requestRenderAll();
  };

  // Process Uploaded Background (Image or PDF)
  const processUploadedFile = async (file: File) => {
    setIsProcessing(true);
    setProcessingMessage('Importing document...');
    setError(null);
    try {
      let dataUrl = '';
      if (file.type === 'application/pdf') {
        const pdfDoc = await loadPdfDocument(file);
        if (pdfDoc.numPages === 0) {
          throw new Error('This PDF document contains no pages.');
        }
        dataUrl = await renderPageToDataUrl(pdfDoc, 1, 2.0, 'image/png');
      } else if (file.type.startsWith('image/')) {
        dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = () => reject(new Error('Failed to read image file.'));
          reader.readAsDataURL(file);
        });
      } else {
        throw new Error('Unsupported format. Please upload a PDF or an Image (PNG, JPG).');
      }

      setCustomBgDataUrl(dataUrl);
      setSelectedTemplateId('custom');
      setMode('editor');
      setIsProcessing(false);

      if (fabricCanvas.current) {
        loadCustomBackgroundOnCanvas(dataUrl);
      }
    } catch (e) {
      console.error(e);
      setError((e as Error).message || 'Failed to load file.');
      setIsProcessing(false);
    }
  };

  // Drag and Drop for Uploads
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

  // Logo / Scanned Signature Upload
  const handleImageOverlayUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (fEvent) => {
      const data = fEvent.target?.result;
      if (typeof data !== 'string') return;

      const canvas = fabricCanvas.current;
      if (!canvas) return;

      fabric.Image.fromURL(data, { crossOrigin: 'anonymous' }).then((img) => {
        const maxDim = 180;
        let scale = 1;
        if (img.width && img.width > maxDim) {
          scale = maxDim / img.width;
        }
        saveState();
        img.set({
          left: Math.round((documentState.width - (img.width || 0) * scale) / 2),
          top: Math.round((documentState.height - (img.height || 0) * scale) / 2),
          scaleX: scale,
          scaleY: scale,
          originX: 'left',
          originY: 'top',
        });
        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.requestRenderAll();
        notify("Image placed on certificate.");
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Signature Studio: Bézier Smooth Drawing Handlers
  const startSigDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = sigPadElRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    sigDrawingRef.current = true;
    sigPointsRef.current = [{ x: clientX - rect.left, y: clientY - rect.top }];
  };

  const drawSigMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!sigDrawingRef.current) return;
    e.preventDefault();
    const canvas = sigPadElRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const pt = { x: clientX - rect.left, y: clientY - rect.top };
    sigPointsRef.current.push(pt);

    const pts = sigPointsRef.current;
    if (pts.length < 3) return;

    ctx.strokeStyle = sigPenColor;
    ctx.lineWidth = sigPenWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const p1 = pts[pts.length - 2];
    const p2 = pts[pts.length - 1];
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
    ctx.stroke();
  };

  const stopSigDrawing = () => {
    sigDrawingRef.current = false;
  };

  const clearSigPad = () => {
    const canvas = sigPadElRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    sigPointsRef.current = [];
  };

  const insertDrawnSignature = () => {
    const pad = sigPadElRef.current;
    if (!pad) return;

    const ctx = pad.getContext('2d');
    if (!ctx) return;
    const imgData = ctx.getImageData(0, 0, pad.width, pad.height);
    const hasInk = imgData.data.some((alpha, idx) => idx % 4 === 3 && alpha > 0);

    if (!hasInk) {
      alert("Please draw your signature first.");
      return;
    }

    const dataUrl = pad.toDataURL('image/png');
    insertSignatureDataUrl(dataUrl);
  };

  const insertTypedSignature = () => {
    if (!typedSigName.trim()) {
      alert("Please enter a name to sign.");
      return;
    }

    // Render typed text to temporary high-res canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 600;
    tempCanvas.height = 200;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;

    ctx.font = `64px '${typedSigFont}', cursive`;
    ctx.fillStyle = sigPenColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(typedSigName, 300, 100);

    const dataUrl = tempCanvas.toDataURL('image/png');
    insertSignatureDataUrl(dataUrl);
  };

  const insertSignatureDataUrl = (dataUrl: string) => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    fabric.Image.fromURL(dataUrl, { crossOrigin: 'anonymous' }).then((sigImg) => {
      saveState();
      sigImg.set({
        left: 630,
        top: 480,
        scaleX: 0.55,
        scaleY: 0.55,
        originX: 'left',
        originY: 'top',
        selectable: true,
      });
      canvas.add(sigImg);
      canvas.setActiveObject(sigImg);
      canvas.requestRenderAll();
      setIsSigModalOpen(false);
      clearSigPad();
      notify("Signature inserted successfully.");
    });
  };

  // High-Resolution Export Engine
  const handleExport = async (type: 'png' | 'pdf' | 'jpeg', quality: 'standard' | 'hd' | 'print' = 'hd') => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    setIsProcessing(true);
    setProcessingMessage(`Generating high-resolution ${type.toUpperCase()}...`);
    setError(null);

    canvas.discardActiveObject();
    canvas.requestRenderAll();

    // Short pause for repaint
    await new Promise((r) => setTimeout(r, 120));

    try {
      const origW = documentState.width;
      const origH = documentState.height;
      const currentZoom = canvas.getZoom();

      // Multiplier calculation for crisp raster output
      let multiplier = 2; // HD default
      if (quality === 'standard') multiplier = 1;
      if (quality === 'print') multiplier = 3; // 3000px ultra print

      // Temporarily reset canvas to native 100% dimensions
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      canvas.setDimensions({ width: origW, height: origH });

      const dataUrl = canvas.toDataURL({
        format: type === 'jpeg' ? 'jpeg' : 'png',
        quality: 0.95,
        multiplier,
      });

      // Restore responsive viewport zoom
      canvas.setDimensions({ width: origW * currentZoom, height: origH * currentZoom });
      canvas.setZoom(currentZoom);
      canvas.requestRenderAll();

      const filename = `certificate_${quickFill.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() || 'document'}`;

      if (type === 'png' || type === 'jpeg') {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${filename}.${type === 'jpeg' ? 'jpg' : 'png'}`;
        link.click();
        notify(`Certificate saved as ${type.toUpperCase()}!`);
      } else {
        // PDF Export
        const isPortrait = origW < origH;
        const pdf = new jsPDF({
          orientation: isPortrait ? 'portrait' : 'landscape',
          unit: 'mm',
          format: 'a4',
        });

        const pdfW = isPortrait ? 210 : 297;
        const pdfH = isPortrait ? 297 : 210;

        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfW, pdfH, undefined, 'FAST');
        pdf.save(`${filename}.pdf`);
        notify("Certificate exported as print-ready PDF!");
      }
    } catch (e) {
      console.error("Export error:", e);
      setError("Failed to export certificate. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Save / Load Project JSON
  const handleSaveProject = () => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    try {
      const json = (canvas as any).toJSON([
        'selectable', 'evented', 'isBackground', 'fieldId', 'lockMovementX', 'lockMovementY', 'lockRotation', 'lockScalingX', 'lockScalingY'
      ]);
      const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'certificate_project.cert';
      link.click();
      notify("Project file saved! You can reload it anytime.");
    } catch (e) {
      console.error(e);
      setError("Failed to save project file.");
    }
  };

  const handleLoadProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target?.result as string);
        const canvas = fabricCanvas.current;
        if (!canvas) return;

        canvas.loadFromJSON(json, () => {
          canvas.getObjects().forEach((obj: any) => {
            if (obj.isBackground) {
              obj.set({
                selectable: false,
                evented: false,
                lockMovementX: true,
                lockMovementY: true,
                lockRotation: true,
                lockScalingX: true,
                lockScalingY: true,
              });
            }
          });
          canvas.requestRenderAll();
          notify("Project loaded successfully!");
        });
      } catch (err) {
        alert("Invalid project file.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <ToolLayout
      article={article}
      howToUse={[
        "Choose an imperial, executive, or modern certificate theme, or upload your own certificate file (PDF or Image).",
        "Use the Quick Fill panel to enter recipient name, title, date, and signatures in seconds.",
        "Double click any text on the certificate canvas to edit words directly in-place.",
        "Customize fonts (Cinzel, Playfair Display, Great Vibes script), sizes, colors, and line spacing with precision.",
        "Use alignment controls to center names and titles with a single click.",
        "Add gold rosette seals, laurel wreaths, or sketch your personal signature with our smooth fountain pen tool.",
        "Export in ultra-sharp 300 DPI print quality, vector PDF, or save the project file to edit later."
      ]}
      faqs={[
        {
          "question": "Can I edit an existing certificate PDF without losing quality?",
          "answer": "Yes. Choose 'Upload Existing Certificate', select your PDF, and our local engine will render it with crystal-clear high fidelity. You can place signatures, names, stamps, and dates directly over it."
        },
        {
          "question": "Is my data and recipient information safe?",
          "answer": "100% safe. The entire Certificate Editor operates completely inside your browser sandbox. None of your certificates, names, or signatures are uploaded to external servers."
        },
        {
          "question": "How do I get high resolution for printing?",
          "answer": "When exporting, select 'Download PDF' or 'Ultra HD (Print 300 DPI)'. It scales the canvas to 3000px resolution, ensuring razor-sharp borders and text for physical printing on certificate parchment paper."
        }
      ]}
      title="Certificate Editor"
      description="Create, customize, and issue professional certificates in your browser. Handcrafted vector themes, calligraphy signatures, gold seals, and instant PDF/PNG export. 100% private."
      categoryName="Image Editing Tools"
      categoryHref="/editing"
      error={error}
      onClearError={() => setError(null)}
    >
      {/* Google Web Fonts Preloader */}
      <link 
        rel="stylesheet" 
        href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cinzel:wght@400;600;700;800&family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Great+Vibes&family=Inter:wght@400;500;600;700&family=Montserrat:wght@400;600;700;800&family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" 
      />

      {/* Floating Success Notice */}
      {successNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 1: DASHBOARD SELECTION                              */}
      {/* ======================================================== */}
      {mode === 'select' && (
        <div className="max-w-5xl mx-auto py-6 px-2 animate-in fade-in duration-300">
          
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
              <Award className="w-3.5 h-3.5" /> Professional Certificate Studio
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-ink mb-3 tracking-tight">
              Create Stunning Certificates in Minutes
            </h2>
            <p className="text-sm text-slate max-w-xl mx-auto font-sans leading-relaxed">
              Select an imperial award template, or upload any existing certificate PDF/Image to sign and edit with professional precision.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Template Gallery (Col 8) */}
            <div className="md:col-span-8 bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-display font-bold text-ink flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" /> Choose a Masterpiece Template
                  </h3>
                  <span className="text-xs text-slate font-sans">8 Presets Available</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.values(CERTIFICATE_TEMPLATES).map((tmpl) => (
                    <button
                      key={tmpl.id}
                      onClick={() => {
                        setSelectedTemplateId(tmpl.id);
                        setMode('editor');
                      }}
                      className="group relative flex flex-col items-center p-3 rounded-xl border border-border hover:border-primary bg-background hover:bg-primary/5 transition-all text-left overflow-hidden shadow-xs hover:shadow-md"
                    >
                      <div className="w-full h-20 rounded-lg overflow-hidden border border-border/50 mb-2.5 flex items-center justify-center bg-slate-900">
                        {/* Mini SVG Preview */}
                        <div 
                          className="w-full h-full transform scale-90 transition duration-300 group-hover:scale-100"
                          dangerouslySetInnerHTML={{ __html: tmpl.svg }}
                        />
                      </div>
                      <span className="text-xs font-bold text-ink group-hover:text-primary transition line-clamp-1">
                        {tmpl.name}
                      </span>
                      <span className="text-[10px] text-slate line-clamp-1 mt-0.5">
                        {tmpl.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-border mt-6 flex justify-between items-center text-xs text-slate">
                <span>Vector SVG format • Crisp A4 resolution</span>
                <span className="font-semibold text-primary">Click any template to start &rarr;</span>
              </div>
            </div>

            {/* Upload Existing Certificate Card (Col 4) */}
            <div className="md:col-span-4 bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Upload className="w-5 h-5" />
                </div>
                <h3 className="text-base font-display font-bold text-ink mb-1">Upload Existing Certificate</h3>
                <p className="text-xs text-slate font-sans mb-5 leading-relaxed">
                  Have a pre-designed certificate? Upload PDF or Image to place signatures, stamps, names, and dates over it.
                </p>

                {/* Dropzone */}
                <div 
                  className={`border-2 border-dashed rounded-xl p-6 transition text-center cursor-pointer relative font-sans ${
                    dragActive 
                      ? 'border-primary bg-primary/10 scale-102' 
                      : 'border-border hover:border-primary/60 bg-background/50 hover:bg-primary/5'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('initial-file-upload')?.click()}
                >
                  <input
                    type="file"
                    id="initial-file-upload"
                    accept="image/*,application/pdf"
                    onChange={(e) => e.target.files?.[0] && processUploadedFile(e.target.files[0])}
                    className="hidden"
                  />
                  <Upload className="w-7 h-7 text-primary/70 mx-auto mb-2" />
                  <span className="text-xs font-bold text-ink block">Click or Drop File</span>
                  <span className="text-[11px] text-slate block mt-0.5">PDF, PNG, JPG, JPEG</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border mt-4">
                <label className="flex items-center justify-center gap-1.5 text-xs text-slate hover:text-ink cursor-pointer">
                  <FolderOpen className="w-4 h-4" />
                  <span>Open Saved Project (.cert)</span>
                  <input type="file" accept=".cert,application/json" onChange={handleLoadProject} className="hidden" />
                </label>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 2: THE ACTIVE EDITOR WORKSPACE                      */}
      {/* ======================================================== */}
      {mode === 'editor' && (
        <div className={isMaximized 
          ? "fixed inset-0 z-[150] bg-slate-900 text-slate-100 flex flex-col p-3 md:p-5 w-[100dvw] h-[100dvh] overflow-hidden animate-in fade-in duration-200" 
          : "bg-surface border border-border rounded-2xl p-4 md:p-6 shadow-sm animate-in fade-in duration-300 flex flex-col"
        }>
          
          {/* Top Global Command Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border mb-4">
            
            {/* Left: Back & Title */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (window.confirm("Return to start screen? Any unsaved changes will be reset.")) {
                    setMode('select');
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-surface text-xs font-semibold text-ink transition shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Templates</span>
              </button>

              <div className="w-px h-5 bg-border mx-1" />

              <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                <Award className="w-4 h-4 text-primary" />
                {selectedTemplateId === 'custom' ? 'Custom Certificate' : CERTIFICATE_TEMPLATES[selectedTemplateId]?.name || 'Certificate'}
              </span>
            </div>

            {/* Middle: History & Canvas Tools */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleUndo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
                className="p-1.5 rounded-lg border border-border bg-background hover:bg-surface disabled:opacity-40 text-ink transition"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={!canRedo}
                title="Redo (Ctrl+Y)"
                className="p-1.5 rounded-lg border border-border bg-background hover:bg-surface disabled:opacity-40 text-ink transition"
              >
                <Redo2 className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-border mx-1" />

              {/* Zoom Controls */}
              <button
                onClick={() => applyCanvasZoom(Math.max(0.25, zoom - 0.1))}
                title="Zoom Out"
                className="p-1.5 rounded-lg border border-border bg-background hover:bg-surface text-ink transition"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono px-2 py-1 rounded bg-background border border-border text-slate">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => applyCanvasZoom(Math.min(2.0, zoom + 0.1))}
                title="Zoom In"
                className="p-1.5 rounded-lg border border-border bg-background hover:bg-surface text-ink transition"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={fitCanvasToContainer}
                title="Fit to Container"
                className="px-2 py-1 rounded-lg border border-border bg-background hover:bg-surface text-[11px] font-semibold text-ink transition"
              >
                Fit
              </button>

              <div className="w-px h-5 bg-border mx-1" />

              {/* Fullscreen Workspace Toggle */}
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                title={isMaximized ? "Exit Workspace Fullscreen" : "Full Screen Workspace"}
                className="p-1.5 rounded-lg border border-border bg-background hover:bg-surface text-ink transition"
              >
                {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Right: Project Save & Quick Export */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveProject}
                title="Save project file to edit later"
                leftIcon={<Save className="w-3.5 h-3.5" />}
              >
                Save File
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExport('png', 'hd')}
                disabled={isProcessing}
                leftIcon={<ImageIcon className="w-3.5 h-3.5" />}
              >
                Export PNG
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => handleExport('pdf', 'print')}
                disabled={isProcessing}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Download PDF
              </Button>
            </div>

          </div>

          {/* Editor 3-Column Studio Grid */}
          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-5 ${isMaximized ? 'flex-1 min-h-0 overflow-hidden' : ''}`}>
            
            {/* =================================================== */}
            {/* LEFT COLUMN: Toolset Tabs (Col 3)                  */}
            {/* =================================================== */}
            <div className={`lg:col-span-3 flex flex-col gap-4 ${isMaximized ? 'overflow-y-auto pr-2 custom-scrollbar h-full' : ''}`}>
              
              {/* Tab Selector */}
              <div className="flex p-1 bg-surface border border-border rounded-xl gap-1">
                <button
                  onClick={() => setActiveSidebarTab('quick-fill')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition font-sans flex items-center justify-center gap-1.5 ${
                    activeSidebarTab === 'quick-fill'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-slate hover:text-ink hover:bg-background'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" /> Quick Fill
                </button>
                <button
                  onClick={() => setActiveSidebarTab('design')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition font-sans flex items-center justify-center gap-1.5 ${
                    activeSidebarTab === 'design'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-slate hover:text-ink hover:bg-background'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" /> Elements
                </button>
                <button
                  onClick={() => setActiveSidebarTab('decorations')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition font-sans flex items-center justify-center gap-1.5 ${
                    activeSidebarTab === 'decorations'
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-slate hover:text-ink hover:bg-background'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" /> Badges
                </button>
              </div>

              {/* TAB 1: QUICK FILL PANEL */}
              {activeSidebarTab === 'quick-fill' && (
                <div className="p-4 bg-background border border-border rounded-xl space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <span className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-primary" /> Certificate Fields
                    </span>
                    <span className="text-[10px] text-slate">Live Sync</span>
                  </div>

                  {/* Title Preset Picker */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate">Certificate Title</label>
                    <input
                      type="text"
                      value={quickFill.title}
                      onChange={(e) => handleQuickFillChange('title', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs text-ink outline-none focus:border-primary font-medium"
                    />
                    <div className="flex flex-wrap gap-1 mt-1">
                      {PRESET_TITLES.slice(0, 3).map((t) => (
                        <button
                          key={t}
                          onClick={() => handlePresetTitle(t)}
                          className="px-2 py-0.5 rounded text-[10px] bg-surface hover:bg-primary/10 border border-border text-slate hover:text-primary transition"
                        >
                          {t.replace("CERTIFICATE OF ", "")}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recipient Name */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate">Recipient Full Name</label>
                    <input
                      type="text"
                      value={quickFill.name}
                      onChange={(e) => handleQuickFillChange('name', e.target.value)}
                      placeholder="e.g. Alexander J. Bennett"
                      className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs text-ink outline-none focus:border-primary font-bold text-primary"
                    />
                  </div>

                  {/* Presentation text */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate">Presentation Line</label>
                    <input
                      type="text"
                      value={quickFill.presentation}
                      onChange={(e) => handleQuickFillChange('presentation', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs text-ink outline-none focus:border-primary"
                    />
                  </div>

                  {/* Description / Citation */}
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-slate">Award Reason / Description</label>
                    <textarea
                      rows={3}
                      value={quickFill.description}
                      onChange={(e) => handleQuickFillChange('description', e.target.value)}
                      className="w-full p-2 bg-surface border border-border rounded-lg text-xs text-ink outline-none focus:border-primary resize-y leading-relaxed"
                    />
                  </div>

                  {/* Date with Today button */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="block text-[11px] font-bold text-slate">Issue Date</label>
                      <button
                        onClick={setTodayDate}
                        className="text-[10px] text-primary hover:underline font-semibold"
                      >
                        Set Today
                      </button>
                    </div>
                    <input
                      type="text"
                      value={quickFill.date}
                      onChange={(e) => handleQuickFillChange('date', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs text-ink outline-none focus:border-primary"
                    />
                  </div>

                  {/* Signer Details */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate">Signer Name</label>
                      <input
                        type="text"
                        value={quickFill.signer1Name}
                        onChange={(e) => handleQuickFillChange('signer1Name', e.target.value)}
                        className="w-full px-2 py-1 bg-surface border border-border rounded text-[11px] text-ink outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-slate">Signer Title</label>
                      <input
                        type="text"
                        value={quickFill.signer1Title}
                        onChange={(e) => handleQuickFillChange('signer1Title', e.target.value)}
                        className="w-full px-2 py-1 bg-surface border border-border rounded text-[11px] text-ink outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  {/* Certificate ID */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate">Certificate ID / Serial</label>
                    <input
                      type="text"
                      value={quickFill.certificateId}
                      onChange={(e) => handleQuickFillChange('certificateId', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs font-mono text-ink outline-none focus:border-primary"
                    />
                  </div>

                </div>
              )}

              {/* TAB 2: DESIGN & ELEMENT INSERTION */}
              {activeSidebarTab === 'design' && (
                <div className="p-4 bg-background border border-border rounded-xl space-y-4 animate-in fade-in duration-200">
                  
                  {/* Insert Text Blocks */}
                  <div>
                    <span className="text-[11px] font-bold text-slate uppercase tracking-wider block mb-2">
                      Add Text Blocks
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => addTextElement('title')}
                        className="py-2 px-2.5 bg-surface hover:bg-surface/80 border border-border rounded-lg text-xs font-semibold text-ink text-left transition flex items-center gap-1.5"
                      >
                        <Type className="w-3.5 h-3.5 text-primary" /> + Title
                      </button>
                      <button
                        onClick={() => addTextElement('recipient')}
                        className="py-2 px-2.5 bg-surface hover:bg-surface/80 border border-border rounded-lg text-xs font-semibold text-ink text-left transition flex items-center gap-1.5"
                      >
                        <Feather className="w-3.5 h-3.5 text-primary" /> + Recipient
                      </button>
                      <button
                        onClick={() => addTextElement('body')}
                        className="py-2 px-2.5 bg-surface hover:bg-surface/80 border border-border rounded-lg text-xs font-semibold text-ink text-left transition flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-primary" /> + Paragraph
                      </button>
                      <button
                        onClick={() => addTextElement('signature')}
                        className="py-2 px-2.5 bg-surface hover:bg-surface/80 border border-border rounded-lg text-xs font-semibold text-ink text-left transition flex items-center gap-1.5"
                      >
                        <PenTool className="w-3.5 h-3.5 text-primary" /> + Signature
                      </button>
                    </div>
                  </div>

                  {/* Signatures & Logos */}
                  <div className="pt-3 border-t border-border space-y-2">
                    <span className="text-[11px] font-bold text-slate uppercase tracking-wider block">
                      Signatures & Graphics
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-center text-xs py-2"
                      leftIcon={<PenTool className="w-3.5 h-3.5 text-primary" />}
                      onClick={() => setIsSigModalOpen(true)}
                    >
                      Signature Studio (Draw / Type)
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-center text-xs py-2"
                      leftIcon={<Upload className="w-3.5 h-3.5" />}
                      onClick={() => document.getElementById('overlay-img-upload')?.click()}
                    >
                      Upload Logo / Stamp
                    </Button>
                    <input
                      type="file"
                      id="overlay-img-upload"
                      accept="image/*"
                      onChange={handleImageOverlayUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Geometric Shapes */}
                  <div className="pt-3 border-t border-border">
                    <span className="text-[11px] font-bold text-slate uppercase tracking-wider block mb-2">
                      Basic Shapes
                    </span>
                    <div className="grid grid-cols-3 gap-2">
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
                    </div>
                  </div>

                  {/* Freehand Ink Drawing */}
                  <div className="pt-3 border-t border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate uppercase tracking-wider flex items-center gap-1.5">
                        <PenTool className="w-3.5 h-3.5 text-primary" /> Freehand Pen
                      </span>
                      <button
                        onClick={() => setIsDrawing(!isDrawing)}
                        className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full transition ${
                          isDrawing ? 'bg-primary text-white' : 'bg-surface border border-border text-slate'
                        }`}
                      >
                        {isDrawing ? 'ON' : 'OFF'}
                      </button>
                    </div>

                    {isDrawing && (
                      <div className="space-y-2 pt-1 animate-in fade-in duration-200">
                        <div className="flex justify-between items-center text-xs text-slate">
                          <span>Stroke Width</span>
                          <span className="font-mono">{brushWidth}px</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="16"
                          value={brushWidth}
                          onChange={(e) => setBrushWidth(Number(e.target.value))}
                          className="w-full accent-primary"
                        />
                        <div className="flex items-center justify-between text-xs text-slate">
                          <span>Pen Color</span>
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
              )}

              {/* TAB 3: DECORATIVE BADGES & ROSETTES */}
              {activeSidebarTab === 'decorations' && (
                <div className="p-4 bg-background border border-border rounded-xl space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <span className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Vector Medals & Seals
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {DECORATIVE_ELEMENTS.map((badge) => (
                      <button
                        key={badge.id}
                        onClick={() => addDecorativeElement(badge)}
                        className="p-3 bg-surface hover:bg-primary/5 border border-border hover:border-primary rounded-xl flex flex-col items-center text-center transition group shadow-xs"
                      >
                        <div 
                          className="w-16 h-16 flex items-center justify-center mb-2 transform group-hover:scale-105 transition"
                          dangerouslySetInnerHTML={{ __html: badge.svg }}
                        />
                        <span className="text-[11px] font-bold text-ink leading-tight line-clamp-2">
                          {badge.name}
                        </span>
                      </button>
                    ))}
                  </div>

                  <p className="text-[10px] text-slate font-sans text-center mt-3">
                    Click any badge to place it onto the certificate canvas.
                  </p>
                </div>
              )}

            </div>

            {/* =================================================== */}
            {/* MIDDLE COLUMN: Interactive Canvas (Col 6)          */}
            {/* =================================================== */}
            <div className={`lg:col-span-6 flex flex-col items-center ${isMaximized ? 'h-full overflow-hidden' : ''}`}>
              
              {/* Responsive Canvas Container with auto-fit centering */}
              <div 
                ref={containerRef}
                className={`w-full relative border border-border rounded-2xl bg-slate-900/40 dark:bg-black/60 overflow-auto flex justify-center items-center p-4 transition-all shadow-inner ${
                  isMaximized ? 'flex-1 min-h-0' : 'min-h-[500px]'
                }`}
              >
                <style dangerouslySetInnerHTML={{ __html: `
                  .canvas-container {
                    margin: auto !important;
                    box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.45) !important;
                    border-radius: 4px;
                  }
                `}} />

                <canvas ref={canvasElRef} className="block" />
              </div>

              {/* Bottom Quick Advice bar */}
              <div className="w-full flex items-center justify-between text-[11px] text-slate mt-2 px-1">
                <span>* Double-click any text to edit inline. Use arrow keys to micro-nudge.</span>
                <span className="font-mono">{documentState.width} &times; {documentState.height} px (A4)</span>
              </div>

            </div>

            {/* =================================================== */}
            {/* RIGHT COLUMN: Element Properties Inspector (Col 3) */}
            {/* =================================================== */}
            <div className={`lg:col-span-3 space-y-4 ${isMaximized ? 'overflow-y-auto pr-2 custom-scrollbar h-full' : ''}`}>
              
              <div className="p-4 bg-background border border-border rounded-xl space-y-4 min-h-[380px]">
                <div className="flex items-center justify-between pb-2 border-b border-border">
                  <span className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-primary" /> Inspector
                  </span>
                  {selectedType && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold">
                      {selectedType.toUpperCase()}
                    </span>
                  )}
                </div>

                {!selectedType ? (
                  <div className="flex flex-col items-center justify-center text-center py-14 text-slate space-y-3">
                    <Award className="w-10 h-10 opacity-30 text-primary" />
                    <div>
                      <p className="text-xs font-bold text-ink">No element selected</p>
                      <p className="text-[11px] max-w-[200px] leading-relaxed mt-1">
                        Click on any text, badge, or shape on the certificate to style, align, or color it.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    
                    {/* Quick Alignment Actions (Center Horizontally / Vertically) */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate uppercase tracking-wider block">
                        Position Alignment
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={centerObjectHorizontally}
                          className="py-1.5 px-2 bg-surface hover:bg-surface/80 border border-border rounded-lg text-xs font-semibold text-ink flex items-center justify-center gap-1.5 transition"
                          title="Center horizontally on certificate"
                        >
                          <MoveHorizontal className="w-3.5 h-3.5 text-primary" /> Center X
                        </button>
                        <button
                          onClick={centerObjectVertically}
                          className="py-1.5 px-2 bg-surface hover:bg-surface/80 border border-border rounded-lg text-xs font-semibold text-ink flex items-center justify-center gap-1.5 transition"
                          title="Center vertically on certificate"
                        >
                          <MoveVertical className="w-3.5 h-3.5 text-primary" /> Center Y
                        </button>
                      </div>
                    </div>

                    {/* TEXT SPECIFIC CONTROLS */}
                    {(selectedType === 'textbox' || selectedType === 'text') && (
                      <div className="space-y-3.5 pt-2 border-t border-border">
                        
                        {/* Inline Content Edit */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate uppercase tracking-wider">
                            Content
                          </label>
                          <textarea
                            rows={2}
                            value={textVal}
                            onChange={(e) => handleTextPropertyChange('text', e.target.value)}
                            className="w-full p-2 bg-surface border border-border rounded-lg text-xs text-ink outline-none focus:border-primary resize-y"
                          />
                        </div>

                        {/* Font Family Dropdown */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate uppercase tracking-wider">
                            Typography Font
                          </label>
                          <select
                            value={fontFamily}
                            onChange={(e) => handleTextPropertyChange('fontFamily', e.target.value)}
                            className="w-full h-8 px-2.5 bg-surface border border-border rounded-lg text-xs text-ink outline-none focus:border-primary font-medium"
                          >
                            {FONT_OPTIONS.map((f) => (
                              <option key={f.value} value={f.value}>
                                {f.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Size & Color */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate uppercase tracking-wider">
                              Font Size ({fontSize}px)
                            </label>
                            <input
                              type="number"
                              min="8"
                              max="130"
                              value={fontSize}
                              onChange={(e) => handleTextPropertyChange('fontSize', e.target.value)}
                              className="w-full h-8 px-2.5 bg-surface border border-border rounded-lg text-xs text-ink outline-none focus:border-primary font-mono"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate uppercase tracking-wider">
                              Text Color
                            </label>
                            <div className="flex items-center gap-2 h-8">
                              <input
                                type="color"
                                value={textColor}
                                onChange={(e) => handleTextPropertyChange('color', e.target.value)}
                                className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent"
                              />
                              <span className="text-[10px] font-mono text-slate uppercase truncate">
                                {textColor}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Formatting Styles: Bold, Italic, Underline, Casing */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate uppercase tracking-wider">
                            Styles & Case
                          </label>
                          <div className="flex flex-wrap items-center gap-1">
                            <button
                              onClick={() => handleTextPropertyChange('bold', !isBold)}
                              className={`p-1.5 rounded-lg border text-xs transition ${
                                isBold ? 'bg-primary text-white border-primary' : 'bg-surface border-border text-slate hover:text-ink'
                              }`}
                              title="Bold"
                            >
                              <Bold className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleTextPropertyChange('italic', !isItalic)}
                              className={`p-1.5 rounded-lg border text-xs transition ${
                                isItalic ? 'bg-primary text-white border-primary' : 'bg-surface border-border text-slate hover:text-ink'
                              }`}
                              title="Italic"
                            >
                              <Italic className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleTextPropertyChange('underline', !isUnderline)}
                              className={`p-1.5 rounded-lg border text-xs transition ${
                                isUnderline ? 'bg-primary text-white border-primary' : 'bg-surface border-border text-slate hover:text-ink'
                              }`}
                              title="Underline"
                            >
                              <Underline className="w-3.5 h-3.5" />
                            </button>

                            <div className="w-px h-5 bg-border mx-1" />

                            <button
                              onClick={() => handleTextPropertyChange('case', 'upper')}
                              className="px-2 py-1 bg-surface hover:bg-surface/80 border border-border rounded text-[10px] font-bold text-ink"
                              title="UPPERCASE"
                            >
                              AA
                            </button>
                            <button
                              onClick={() => handleTextPropertyChange('case', 'title')}
                              className="px-2 py-1 bg-surface hover:bg-surface/80 border border-border rounded text-[10px] font-semibold text-ink"
                              title="Title Case"
                            >
                              Aa
                            </button>
                          </div>
                        </div>

                        {/* Alignment */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate uppercase tracking-wider">
                            Alignment
                          </label>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleTextPropertyChange('align', 'left')}
                              className={`flex-1 py-1 rounded-lg border text-xs flex justify-center transition ${
                                textAlign === 'left' ? 'bg-primary text-white border-primary' : 'bg-surface border-border text-slate hover:text-ink'
                              }`}
                            >
                              <AlignLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleTextPropertyChange('align', 'center')}
                              className={`flex-1 py-1 rounded-lg border text-xs flex justify-center transition ${
                                textAlign === 'center' ? 'bg-primary text-white border-primary' : 'bg-surface border-border text-slate hover:text-ink'
                              }`}
                            >
                              <AlignCenter className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleTextPropertyChange('align', 'right')}
                              className={`flex-1 py-1 rounded-lg border text-xs flex justify-center transition ${
                                textAlign === 'right' ? 'bg-primary text-white border-primary' : 'bg-surface border-border text-slate hover:text-ink'
                              }`}
                            >
                              <AlignRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Letter Spacing (Tracking) */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-slate uppercase tracking-wider">
                            <span>Letter Spacing</span>
                            <span>{letterSpacing}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="300"
                            step="10"
                            value={letterSpacing}
                            onChange={(e) => handleTextPropertyChange('letterSpacing', e.target.value)}
                            className="w-full accent-primary"
                          />
                        </div>

                      </div>
                    )}

                    {/* SHAPES / GRAPHICS CONTROLS */}
                    {['rect', 'circle', 'path', 'polygon', 'line'].includes(selectedType) && (
                      <div className="space-y-3.5 pt-2 border-t border-border">
                        {selectedType !== 'line' && (
                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate uppercase tracking-wider">
                              Fill Color
                            </label>
                            <div className="flex items-center gap-2">
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
                            </div>
                          </div>
                        )}

                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate uppercase tracking-wider">
                            Border / Stroke Color
                          </label>
                          <div className="flex items-center gap-2">
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
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold text-slate uppercase tracking-wider">
                            <span>Stroke Thickness</span>
                            <span>{shapeStrokeWidth}px</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="20"
                            value={shapeStrokeWidth}
                            onChange={(e) => handleShapePropertyChange('strokeWidth', e.target.value)}
                            className="w-full accent-primary"
                          />
                        </div>
                      </div>
                    )}

                    {/* OPACITY SLIDER (All elements) */}
                    <div className="pt-2 border-t border-border space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate uppercase tracking-wider">
                        <span>Opacity</span>
                        <span>{Math.round(elementOpacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="1"
                        step="0.05"
                        value={elementOpacity}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          const canvas = fabricCanvas.current;
                          const active = canvas?.getActiveObject();
                          if (active && !(active as any).isBackground) {
                            saveState();
                            active.set({ opacity: val });
                            setElementOpacity(val);
                            canvas?.requestRenderAll();
                          }
                        }}
                        className="w-full accent-primary"
                      />
                    </div>

                    {/* LAYER CONTROLS (All elements) */}
                    <div className="pt-2 border-t border-border space-y-1.5">
                      <span className="text-[10px] font-bold text-slate uppercase tracking-wider block">
                        Layer Ordering
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => layerArrange('forward')}
                          className="py-1 px-2 bg-surface hover:bg-surface/80 border border-border rounded text-[11px] text-ink text-center transition"
                        >
                          Bring Forward
                        </button>
                        <button
                          onClick={() => layerArrange('backward')}
                          className="py-1 px-2 bg-surface hover:bg-surface/80 border border-border rounded text-[11px] text-ink text-center transition"
                        >
                          Send Backward
                        </button>
                        <button
                          onClick={() => layerArrange('front')}
                          className="py-1 px-2 bg-surface hover:bg-surface/80 border border-border rounded text-[11px] text-ink text-center transition"
                        >
                          To Front
                        </button>
                        <button
                          onClick={() => layerArrange('back')}
                          className="py-1 px-2 bg-surface hover:bg-surface/80 border border-border rounded text-[11px] text-ink text-center transition"
                        >
                          To Back
                        </button>
                      </div>
                    </div>

                    {/* DUPLICATE & DELETE BUTTONS */}
                    <div className="pt-3 border-t border-border space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs justify-center py-1.5"
                        leftIcon={<Copy className="w-3.5 h-3.5" />}
                        onClick={duplicateSelected}
                      >
                        Duplicate (Ctrl+D)
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-900/40 text-xs justify-center py-1.5"
                        leftIcon={<Trash2 className="w-3.5 h-3.5" />}
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

          {/* Loading Indicator Overlay */}
          {isProcessing && <LoadingSpinner text={processingMessage} />}

          {/* Export Action Bar Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t border-border mt-6">
            <div className="flex items-center gap-2 text-xs text-slate">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Processed 100% locally in your browser sandbox. Absolute privacy guaranteed.</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
              <Button
                variant="outline"
                size="md"
                onClick={() => handleExport('png', 'standard')}
                disabled={isProcessing}
              >
                Standard PNG
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={() => handleExport('png', 'print')}
                disabled={isProcessing}
                leftIcon={<Sparkles className="w-4 h-4 text-amber-500" />}
              >
                Ultra-HD 300 DPI
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => handleExport('pdf', 'print')}
                disabled={isProcessing}
                leftIcon={<Download className="w-4 h-4" />}
              >
                Print-Ready PDF
              </Button>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* SIGNATURE STUDIO MODAL                                   */}
      {/* ======================================================== */}
      {isSigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4 animate-in fade-in duration-200">
          <div className="bg-surface border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setIsSigModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-background text-slate transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-bold text-lg text-ink mb-1 flex items-center gap-2">
              <PenTool className="w-5 h-5 text-primary" /> Signature Studio
            </h3>
            <p className="text-xs text-slate mb-4">
              Add an authentic, vector-smooth signature to sign your certificates.
            </p>

            {/* Modal Tabs */}
            <div className="flex p-1 bg-background border border-border rounded-xl gap-1 mb-4">
              <button
                onClick={() => setSigModalTab('draw')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                  sigModalTab === 'draw' ? 'bg-primary text-white' : 'text-slate hover:text-ink'
                }`}
              >
                Draw Signature
              </button>
              <button
                onClick={() => setSigModalTab('type')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                  sigModalTab === 'type' ? 'bg-primary text-white' : 'text-slate hover:text-ink'
                }`}
              >
                Type Calligraphy
              </button>
            </div>

            {/* TAB 1: DRAW SIGNATURE */}
            {sigModalTab === 'draw' && (
              <div className="space-y-3">
                {/* Ink and Thickness bar */}
                <div className="flex items-center justify-between text-xs text-slate">
                  <div className="flex items-center gap-2">
                    <span>Ink Color:</span>
                    <button
                      onClick={() => setSigPenColor('#0f172a')}
                      className={`w-5 h-5 rounded-full bg-slate-900 border ${sigPenColor === '#0f172a' ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                      title="Charcoal Black"
                    />
                    <button
                      onClick={() => setSigPenColor('#1e40af')}
                      className={`w-5 h-5 rounded-full bg-blue-800 border ${sigPenColor === '#1e40af' ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                      title="Fountain Blue"
                    />
                    <button
                      onClick={() => setSigPenColor('#b45309')}
                      className={`w-5 h-5 rounded-full bg-amber-700 border ${sigPenColor === '#b45309' ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                      title="Gold Ink"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span>Pen:</span>
                    <button
                      onClick={() => setSigPenWidth(2)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${sigPenWidth === 2 ? 'bg-primary text-white' : 'bg-surface text-slate'}`}
                    >
                      Fine
                    </button>
                    <button
                      onClick={() => setSigPenWidth(3.5)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${sigPenWidth === 3.5 ? 'bg-primary text-white' : 'bg-surface text-slate'}`}
                    >
                      Medium
                    </button>
                    <button
                      onClick={() => setSigPenWidth(5)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${sigPenWidth === 5 ? 'bg-primary text-white' : 'bg-surface text-slate'}`}
                    >
                      Bold
                    </button>
                  </div>
                </div>

                {/* Drawing Surface */}
                <div className="bg-white border-2 border-dashed border-border rounded-xl overflow-hidden relative cursor-crosshair shadow-inner">
                  <canvas
                    ref={sigPadElRef}
                    width={460}
                    height={180}
                    onMouseDown={startSigDrawing}
                    onMouseMove={drawSigMove}
                    onMouseUp={stopSigDrawing}
                    onMouseLeave={stopSigDrawing}
                    onTouchStart={startSigDrawing}
                    onTouchMove={drawSigMove}
                    onTouchEnd={stopSigDrawing}
                    className="w-full bg-white block touch-none"
                  />
                  <span className="absolute bottom-2 right-3 text-[10px] text-slate-400 select-none pointer-events-none">
                    Sign above using mouse or touch
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
                    onClick={clearSigPad}
                  >
                    Clear Canvas
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    leftIcon={<Check className="w-3.5 h-3.5" />}
                    onClick={insertDrawnSignature}
                  >
                    Insert Signature
                  </Button>
                </div>
              </div>
            )}

            {/* TAB 2: TYPE CALLIGRAPHY */}
            {sigModalTab === 'type' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate">Type Signer Name</label>
                  <input
                    type="text"
                    value={typedSigName}
                    onChange={(e) => setTypedSigName(e.target.value)}
                    placeholder="e.g. Dr. Eleanor Vance"
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm text-ink outline-none focus:border-primary font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <span className="block text-[11px] font-bold text-slate">Select Calligraphy Style</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Great Vibes', font: 'Great Vibes' },
                      { name: 'Alex Brush', font: 'Alex Brush' },
                      { name: 'Pinyon Script', font: 'Pinyon Script' },
                      { name: 'Playfair Italic', font: 'Playfair Display' },
                    ].map((style) => (
                      <button
                        key={style.font}
                        onClick={() => setTypedSigFont(style.font)}
                        className={`p-3 rounded-xl border text-center transition ${
                          typedSigFont === style.font
                            ? 'bg-primary/10 border-primary text-primary shadow-xs'
                            : 'bg-background border-border text-slate hover:text-ink'
                        }`}
                      >
                        <span 
                          className="text-xl block truncate"
                          style={{ fontFamily: style.font, fontStyle: style.font === 'Playfair Display' ? 'italic' : 'normal' }}
                        >
                          {typedSigName || 'Signature'}
                        </span>
                        <span className="text-[10px] text-slate block mt-1">{style.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button 
                    variant="primary" 
                    size="sm" 
                    leftIcon={<Check className="w-3.5 h-3.5" />}
                    onClick={insertTypedSignature}
                  >
                    Insert as Signature
                  </Button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </ToolLayout>
  );
}
