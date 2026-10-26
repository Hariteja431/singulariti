"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as fabric from 'fabric';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/tools/LoadingSpinner';
import { 
  Award, Type, Square, Circle, Sparkles, Undo2, Redo2, ZoomIn, ZoomOut, 
  RotateCcw, Trash2, PenTool, Upload, Download, Check, X, Image as ImageIcon, 
  Layers, AlignLeft, AlignCenter, AlignRight, Bold, Italic, Underline,
  Maximize2, Minimize2, Copy, Sliders, ChevronDown, FileText, CheckCircle2,
  Calendar, ShieldCheck, Feather, MoveHorizontal, MoveVertical, Palette,
  FolderOpen, Save, RefreshCw, QrCode as QrIcon, Users, Stamp, ArrowUpRight
} from 'lucide-react';
import { loadPdfDocument, renderPageToDataUrl } from '@/lib/pdf/pdfRenderHelpers';
import { CERTIFICATE_TEMPLATES, CertificateTheme } from './certificateTemplates';
import { DECORATIVE_ELEMENTS, BadgeElement } from './decorativeElements';

const PRESET_CERTIFICATES = [
  {
    type: 'completion',
    title: 'CERTIFICATE OF COMPLETION',
    presentation: 'THIS IS PROUDLY PRESENTED TO',
    description: 'For successfully completing all requirements of the curriculum with distinguished excellence and dedication.',
    badgeId: 'gold-seal-rosette',
  },
  {
    type: 'achievement',
    title: 'CERTIFICATE OF ACHIEVEMENT',
    presentation: 'IN RECOGNITION OF OUTSTANDING MERIT TO',
    description: 'For exceptional performance, relentless perseverance, and accomplishing the highest standard of excellence.',
    badgeId: 'laurel-wreath',
  },
  {
    type: 'appreciation',
    title: 'CERTIFICATE OF APPRECIATION',
    presentation: 'WITH HEARTFELT GRATITUDE AWARDED TO',
    description: 'In honor of your generous contributions, steadfast leadership, and invaluable support towards our mission.',
    badgeId: 'seal-with-ribbon',
  },
  {
    type: 'excellence',
    title: 'DIPLOMA OF EXCELLENCE',
    presentation: 'HAVING MET THE HIGHEST ACADEMIC CRITERIA CONFERRED UPON',
    description: 'Demonstrating supreme mastery of foundational principles, research rigor, and exemplary scholarship.',
    badgeId: 'laurel-wreath',
  },
  {
    type: 'participation',
    title: 'CERTIFICATE OF PARTICIPATION',
    presentation: 'THIS CERTIFICATE IS OFFICIALLY PRESENTED TO',
    description: 'For active and enthusiastic participation in the international seminar and collaborative workshop series.',
    badgeId: 'verified-stamp',
  },
  {
    type: 'employee',
    title: 'EMPLOYEE OF THE MONTH',
    presentation: 'PROUDLY CONFERRED UPON OUR OUTSTANDING COLLEAGUE',
    description: 'In deep recognition of extraordinary commitment, collaborative spirit, and driving record-setting milestones.',
    badgeId: 'gold-seal-rosette',
  },
];

const FONT_OPTIONS = [
  { name: 'Cinzel (Classical Imperial)', value: 'Cinzel', family: 'serif' },
  { name: 'Playfair Display (Editorial Serif)', value: 'Playfair Display', family: 'serif' },
  { name: 'Great Vibes (Master Calligraphy)', value: 'Great Vibes', family: 'cursive' },
  { name: 'Alex Brush (Fluid Signature)', value: 'Alex Brush', family: 'cursive' },
  { name: 'Pinyon Script (Regal Cursive)', value: 'Pinyon Script', family: 'cursive' },
  { name: 'Montserrat (Modern Bold Sans)', value: 'Montserrat', family: 'sans-serif' },
  { name: 'Inter (Clean Swiss Sans)', value: 'Inter', family: 'sans-serif' },
  { name: 'EB Garamond (Academic)', value: 'EB Garamond', family: 'serif' },
];

const COLOR_SWATCHES = [
  '#f59e0b', '#fbbf24', '#0d9488', '#0284c7', '#1e3a8a', 
  '#881337', '#065f46', '#0f172a', '#e2e8f0', '#ffffff'
];

interface Props {
  article?: string;
  externalError?: string | null;
  setExternalError?: (err: string | null) => void;
}

export function CertificateEditorClient({ article, externalError, setExternalError }: Props) {
  // Navigation & Workspace State
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('classic');
  const [activeTab, setActiveTab] = useState<'templates' | 'content' | 'signatures' | 'seals' | 'qr' | 'elements'>('content');
  const [isMaximized, setIsMaximized] = useState(false);
  const [customBgDataUrl, setCustomBgDataUrl] = useState<string | null>(null);

  // Document Canvas State (Standard Landscape A4 Aspect: 1000 x 707)
  const [documentState, setDocumentState] = useState({
    width: 1000,
    height: 707,
    aspectRatio: 1000 / 707,
    orientation: 'landscape' as 'landscape' | 'portrait',
  });

  // Zoom & Viewport
  const [zoom, setZoom] = useState(1);

  // Undo / Redo Stacks
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const undoStack = useRef<string[]>([]);
  const redoStack = useRef<string[]>([]);

  // Selection & Properties Inspector State
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [textVal, setTextVal] = useState('');
  const [fontFamily, setFontFamily] = useState('Cinzel');
  const [fontSize, setFontSize] = useState(24);
  const [textColor, setTextColor] = useState('#f59e0b');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [elementOpacity, setElementOpacity] = useState(1);

  // Shape Properties
  const [shapeColor, setShapeColor] = useState('transparent');
  const [shapeStrokeColor, setShapeStrokeColor] = useState('#f59e0b');
  const [shapeStrokeWidth, setShapeStrokeWidth] = useState(2);

  // Signatures State
  const [signerCount, setSignerCount] = useState<'single' | 'double'>('double');
  const [isSigModalOpen, setIsSigModalOpen] = useState(false);
  const [sigModalTab, setSigModalTab] = useState<'type' | 'draw' | 'upload'>('type');
  const [typedSigText, setTypedSigText] = useState('Dr. Marcus Vance');
  const [typedSigFont, setTypedSigFont] = useState('Great Vibes');
  const [typedSigColor, setTypedSigColor] = useState('#0f172a');
  const [sigTarget, setSigTarget] = useState<'signer1' | 'signer2'>('signer1');

  // Drawing Pad for Signature
  const [sigPenColor, setSigPenColor] = useState('#0f172a');
  const [sigPenWidth, setSigPenWidth] = useState(2.5);

  // Freehand Canvas Brush (direct on certificate)
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#f59e0b');
  const [brushWidth, setBrushWidth] = useState(3);

  // Form Fields Quick Fill State
  const [quickFill, setQuickFill] = useState({
    org: 'GLOBAL ACADEMY OF EXCELLENCE',
    title: 'CERTIFICATE OF COMPLETION',
    presentation: 'THIS IS PROUDLY PRESENTED TO',
    name: 'Alexander J. Mercer',
    description: 'For successfully completing all requirements of the Advanced Web Architecture & Cloud Systems Program with distinguished honors.',
    date: 'October 27, 2026',
    certificateId: 'CERT-2026-X89',
    signer1Name: 'Dr. Marcus Vance',
    signer1Title: 'Director of Academic Affairs',
    signer2Name: 'Prof. Eleanor Cross',
    signer2Title: 'Program Chair & Dean',
    verificationUrl: 'https://www.singulariti.in/verify?id=CERT-2026-X89',
  });

  // App Alerts & Notifications
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Canvas Refs
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvas = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sigPadElRef = useRef<HTMLCanvasElement>(null);
  const sigDrawingRef = useRef(false);
  const sigPointsRef = useRef<{ x: number; y: number }[]>([]);

  const documentStateRef = useRef(documentState);
  documentStateRef.current = documentState;

  const notify = (msg: string) => {
    setSuccessNotice(msg);
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  const setError = (msg: string | null) => {
    setLocalError(msg);
    if (setExternalError) setExternalError(msg);
  };

  const error = externalError || localError;

  // Safe History State Saver
  const saveState = useCallback(() => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;
    try {
      const json = JSON.stringify(
        (canvas as any).toJSON([
          'selectable', 'evented', 'isBackground', 'fieldId', 'lockMovementX', 'lockMovementY', 'lockRotation', 'lockScalingX', 'lockScalingY'
        ])
      );
      undoStack.current.push(json);
      if (undoStack.current.length > 30) {
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
    const padding = 32;
    const availW = Math.max(100, container.clientWidth - padding);
    const availH = Math.max(100, container.clientHeight - padding);

    const docW = documentStateRef.current.width;
    const docH = documentStateRef.current.height;

    const scaleW = availW / docW;
    const scaleH = availH / docH;
    let targetScale = Math.min(scaleW, scaleH);
    targetScale = Math.max(0.3, Math.min(targetScale, 1.4));

    applyCanvasZoom(targetScale);
  }, [applyCanvasZoom]);

  // Robust SVG to Data URL generator
  const getSvgDataUrl = (svgContent: string): string => {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent.trim())}`;
  };

  // Core Template Loader: supports initial creation AND live seamless switching
  const loadTemplateBackground = useCallback((themeId: string, isInitial = false) => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    setError(null);
    const theme = CERTIFICATE_TEMPLATES[themeId] || CERTIFICATE_TEMPLATES.classic;
    setSelectedTemplateId(themeId);

    const docW = 1000;
    const docH = 707;
    setDocumentState({
      width: docW,
      height: docH,
      aspectRatio: docW / docH,
      orientation: 'landscape',
    });

    const imgEl = new Image();
    imgEl.onload = () => {
      // 1. Remove existing background image if present
      const existingBg = canvas.getObjects().find((o: any) => o.isBackground);
      if (existingBg) {
        canvas.remove(existingBg);
      }

      // 2. Create high-performance background FabricImage
      const bgImg = new (fabric as any).FabricImage(imgEl, {
        scaleX: docW / (imgEl.naturalWidth || 1000),
        scaleY: docH / (imgEl.naturalHeight || 707),
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
      });

      canvas.add(bgImg);
      canvas.sendObjectToBack(bgImg);

      const existingTexts = canvas.getObjects().filter((o: any) => o.type === 'textbox' || o.type === 'text');

      // 3. If initial load or canvas has no text, create full default fields
      if (isInitial || existingTexts.length === 0) {
        canvas.getObjects().forEach((o: any) => {
          if (!o.isBackground) canvas.remove(o);
        });

        // Issuing Org
        const orgText = new fabric.Textbox(quickFill.org, {
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
          top: 135,
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
          top: 220,
          width: 800,
          fontSize: 12,
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
          top: 265,
          width: 800,
          fontSize: 56,
          fontFamily: theme.nameFont,
          fontWeight: 'bold',
          fill: theme.accentColor,
          textAlign: 'center',
          originX: 'left',
          originY: 'top',
          fieldId: 'name',
        } as any);

        // Accent divider rule under name
        const line = new fabric.Line([350, 350, 650, 350], {
          stroke: theme.accentColor,
          strokeWidth: 1.5,
          opacity: 0.6,
          selectable: true,
          fieldId: 'divider',
        } as any);

        // Description Paragraph
        const descText = new fabric.Textbox(quickFill.description, {
          left: 150,
          top: 375,
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
          left: 110,
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

        const dateLine = new fabric.Line([110, 540, 360, 540], {
          stroke: theme.secondaryTextColor,
          strokeWidth: 1,
          opacity: 0.4,
          selectable: true,
        });

        // Signer 1 / Signer 2 (Right bottom)
        const signerText = new fabric.Textbox(`${quickFill.signer1Name}\n${quickFill.signer1Title}`, {
          left: 640,
          top: 550,
          width: 250,
          fontSize: 13,
          fontFamily: theme.bodyFont,
          fill: theme.secondaryTextColor,
          textAlign: 'center',
          lineHeight: 1.3,
          originX: 'left',
          originY: 'top',
          fieldId: 'signer1',
        } as any);

        const sigLine = new fabric.Line([640, 540, 890, 540], {
          stroke: theme.secondaryTextColor,
          strokeWidth: 1,
          opacity: 0.4,
          selectable: true,
        });

        // Certificate ID Footer
        const idText = new fabric.Textbox(`Certificate ID: ${quickFill.certificateId}`, {
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
        const badgeEl = new Image();
        badgeEl.onload = () => {
          const sealImg = new (fabric as any).FabricImage(badgeEl, {
            left: 455,
            top: 485,
            scaleX: 90 / 200,
            scaleY: 90 / 200,
            originX: 'left',
            originY: 'top',
            fieldId: 'seal',
          });
          canvas.add(sealImg);
          canvas.requestRenderAll();
        };
        badgeEl.src = getSvgDataUrl(rosetteBadge.svg);

        canvas.add(orgText, titleText, presText, nameText, line, descText, dateLine, dateText, sigLine, signerText, idText);
      } else {
        // 4. Live switching: Intelligently adapt existing text colors and fonts to match the new theme!
        canvas.getObjects().forEach((obj: any) => {
          if (obj.fieldId === 'title') {
            obj.set({ fill: theme.accentColor, fontFamily: theme.titleFont });
          } else if (obj.fieldId === 'name') {
            obj.set({ fill: theme.accentColor, fontFamily: theme.nameFont });
          } else if (obj.fieldId === 'divider') {
            obj.set({ stroke: theme.accentColor });
          } else if (obj.fieldId === 'description') {
            obj.set({ fill: theme.textColor, fontFamily: theme.bodyFont });
          } else if (['org', 'presentation', 'date', 'signer1', 'signer2', 'certId'].includes(obj.fieldId)) {
            obj.set({ fill: theme.secondaryTextColor, fontFamily: theme.bodyFont });
          }
        });
        notify(`Switched to ${theme.name} layout!`);
      }

      // Re-trigger font load rendering
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          canvas.requestRenderAll();
        });
      }

      canvas.requestRenderAll();
      saveState();
      fitCanvasToContainer();
    };

    imgEl.src = getSvgDataUrl(theme.svg);
  }, [quickFill, fitCanvasToContainer, saveState]);

  // Load Custom Background (PDF or User Image)
  const loadCustomBackgroundOnCanvas = useCallback((dataUrl: string) => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    setCustomBgDataUrl(dataUrl);
    setSelectedTemplateId('custom');

    const imgEl = new Image();
    imgEl.onload = () => {
      const origW = imgEl.naturalWidth || 1000;
      const origH = imgEl.naturalHeight || 707;

      let newWidth = 1000;
      let newHeight = Math.round(1000 * (origH / origW));

      if (origW < origH) {
        newHeight = 1000;
        newWidth = Math.round(1000 * (origW / origH));
      }

      setDocumentState({
        width: newWidth,
        height: newHeight,
        aspectRatio: newWidth / newHeight,
        orientation: newWidth >= newHeight ? 'landscape' : 'portrait',
      });

      canvas.clear();

      const bgImg = new (fabric as any).FabricImage(imgEl, {
        scaleX: newWidth / origW,
        scaleY: newHeight / origH,
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
      });

      canvas.add(bgImg);
      canvas.sendObjectToBack(bgImg);

      // Add default recipient placeholder
      const starterText = new fabric.Textbox('Alexander J. Mercer', {
        left: 100,
        top: Math.round(newHeight / 2) - 30,
        width: newWidth - 200,
        fontSize: 48,
        fontFamily: 'Great Vibes',
        fontWeight: 'bold',
        textAlign: 'center',
        fill: '#0f172a',
        originX: 'left',
        originY: 'top',
        fieldId: 'name',
      } as any);

      canvas.add(starterText);
      canvas.setActiveObject(starterText);
      canvas.requestRenderAll();

      undoStack.current = [];
      redoStack.current = [];
      setCanUndo(false);
      setCanRedo(false);
      fitCanvasToContainer();
      notify("Custom certificate document loaded.");
    };
    imgEl.src = dataUrl;
  }, [fitCanvasToContainer]);

  // Handle Quick Fill synchronization to canvas textboxes
  const handleQuickFillChange = (field: keyof typeof quickFill, val: string) => {
    setQuickFill((prev) => ({ ...prev, [field]: val }));
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    canvas.getObjects().forEach((obj: any) => {
      if (obj.fieldId === field) {
        if (field === 'date') {
          obj.set({ text: `Issued on: ${val}` });
        } else if (field === 'certificateId') {
          obj.set({ text: `Certificate ID: ${val}` });
        } else if (field === 'signer1Name' || field === 'signer1Title') {
          const s1 = field === 'signer1Name' ? val : quickFill.signer1Name;
          const s2 = field === 'signer1Title' ? val : quickFill.signer1Title;
          obj.set({ text: `${s1}\n${s2}` });
        } else if (field === 'signer2Name' || field === 'signer2Title') {
          const s1 = field === 'signer2Name' ? val : quickFill.signer2Name;
          const s2 = field === 'signer2Title' ? val : quickFill.signer2Title;
          obj.set({ text: `${s1}\n${s2}` });
        } else {
          obj.set({ text: val });
        }
      }
    });

    canvas.requestRenderAll();
  };

  // 1-Click Preset Certificate Archetypes
  const handleApplyPreset = (presetType: string) => {
    const p = PRESET_CERTIFICATES.find((item) => item.type === presetType);
    if (!p) return;

    setQuickFill((prev) => ({
      ...prev,
      title: p.title,
      presentation: p.presentation,
      description: p.description,
    }));

    const canvas = fabricCanvas.current;
    if (!canvas) return;

    canvas.getObjects().forEach((obj: any) => {
      if (obj.fieldId === 'title') obj.set({ text: p.title });
      if (obj.fieldId === 'presentation') obj.set({ text: p.presentation });
      if (obj.fieldId === 'description') obj.set({ text: p.description });
    });

    // Also replace badge if possible
    const badge = DECORATIVE_ELEMENTS.find((b) => b.id === p.badgeId);
    if (badge) {
      const existingSeal = canvas.getObjects().find((o: any) => o.fieldId === 'seal');
      if (existingSeal) {
        const badgeEl = new Image();
        badgeEl.onload = () => {
          const sealImg = new (fabric as any).FabricImage(badgeEl, {
            left: existingSeal.left || 455,
            top: existingSeal.top || 485,
            scaleX: 90 / 200,
            scaleY: 90 / 200,
            originX: 'left',
            originY: 'top',
            fieldId: 'seal',
          });
          canvas.remove(existingSeal);
          canvas.add(sealImg);
          canvas.requestRenderAll();
        };
        badgeEl.src = getSvgDataUrl(badge.svg);
      }
    }

    canvas.requestRenderAll();
    saveState();
    notify(`Applied ${p.title} preset!`);
  };

  // Toggle between 1 Signer (Centered) vs 2 Signers (Left/Right)
  const handleSignerCountToggle = (count: 'single' | 'double') => {
    setSignerCount(count);
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    const theme = CERTIFICATE_TEMPLATES[selectedTemplateId] || CERTIFICATE_TEMPLATES.classic;
    saveState();

    // Remove existing signers
    canvas.getObjects().forEach((o: any) => {
      if (['signer1', 'signer2', 'sigLine1', 'sigLine2'].includes(o.fieldId)) {
        canvas.remove(o);
      }
    });

    if (count === 'single') {
      const sigLine = new fabric.Line([375, 540, 625, 540], {
        stroke: theme.secondaryTextColor,
        strokeWidth: 1,
        opacity: 0.4,
        selectable: true,
        fieldId: 'sigLine1',
      } as any);

      const signerText = new fabric.Textbox(`${quickFill.signer1Name}\n${quickFill.signer1Title}`, {
        left: 350,
        top: 550,
        width: 300,
        fontSize: 13,
        fontFamily: theme.bodyFont,
        fill: theme.secondaryTextColor,
        textAlign: 'center',
        lineHeight: 1.3,
        originX: 'left',
        originY: 'top',
        fieldId: 'signer1',
      } as any);

      canvas.add(sigLine, signerText);
    } else {
      // Double signers
      const sigLine1 = new fabric.Line([110, 540, 360, 540], {
        stroke: theme.secondaryTextColor,
        strokeWidth: 1,
        opacity: 0.4,
        selectable: true,
        fieldId: 'sigLine1',
      } as any);

      const signerText1 = new fabric.Textbox(`${quickFill.signer1Name}\n${quickFill.signer1Title}`, {
        left: 110,
        top: 550,
        width: 250,
        fontSize: 13,
        fontFamily: theme.bodyFont,
        fill: theme.secondaryTextColor,
        textAlign: 'center',
        lineHeight: 1.3,
        originX: 'left',
        originY: 'top',
        fieldId: 'signer1',
      } as any);

      const sigLine2 = new fabric.Line([640, 540, 890, 540], {
        stroke: theme.secondaryTextColor,
        strokeWidth: 1,
        opacity: 0.4,
        selectable: true,
        fieldId: 'sigLine2',
      } as any);

      const signerText2 = new fabric.Textbox(`${quickFill.signer2Name}\n${quickFill.signer2Title}`, {
        left: 640,
        top: 550,
        width: 250,
        fontSize: 13,
        fontFamily: theme.bodyFont,
        fill: theme.secondaryTextColor,
        textAlign: 'center',
        lineHeight: 1.3,
        originX: 'left',
        originY: 'top',
        fieldId: 'signer2',
      } as any);

      canvas.add(sigLine1, signerText1, sigLine2, signerText2);
    }

    canvas.requestRenderAll();
    notify(`Updated signer layout to ${count === 'single' ? '1 signer' : '2 signers'}`);
  };

  // Add Verification QR Code
  const handleAddQrCode = async () => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    try {
      saveState();
      const qrDataUrl = await QRCode.toDataURL(quickFill.verificationUrl, {
        width: 160,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      });

      const imgEl = new Image();
      imgEl.onload = () => {
        // Remove existing QR code if present
        const existingQr = canvas.getObjects().find((o: any) => o.fieldId === 'qrcode');
        if (existingQr) canvas.remove(existingQr);

        const qrImg = new (fabric as any).FabricImage(imgEl, {
          left: 880,
          top: 40,
          scaleX: 70 / 160,
          scaleY: 70 / 160,
          originX: 'left',
          originY: 'top',
          fieldId: 'qrcode',
        });

        canvas.add(qrImg);
        canvas.setActiveObject(qrImg);
        canvas.requestRenderAll();
        notify("Verification QR Code added to top right!");
      };
      imgEl.src = qrDataUrl;
    } catch (e) {
      console.error(e);
      setError("Failed to generate QR code.");
    }
  };

  // Add Custom Logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const canvas = fabricCanvas.current;
      if (!canvas) return;

      saveState();
      const imgEl = new Image();
      imgEl.onload = () => {
        const naturalW = imgEl.naturalWidth || 200;
        const naturalH = imgEl.naturalHeight || 200;
        const maxDim = 80;
        const scale = Math.min(maxDim / naturalW, maxDim / naturalH);

        const logoImg = new (fabric as any).FabricImage(imgEl, {
          left: 100,
          top: 40,
          scaleX: scale,
          scaleY: scale,
          originX: 'left',
          originY: 'top',
          fieldId: 'logo',
        });

        canvas.add(logoImg);
        canvas.setActiveObject(logoImg);
        canvas.requestRenderAll();
        notify("Organization Logo added!");
      };
      imgEl.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Add Calligraphy Digital Signature
  const handleInsertTypedSignature = () => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    saveState();
    const sigText = new fabric.Textbox(typedSigText, {
      left: sigTarget === 'signer1' ? 140 : 670,
      top: 490,
      width: 200,
      fontSize: 36,
      fontFamily: typedSigFont,
      fill: typedSigColor,
      textAlign: 'center',
      originX: 'left',
      originY: 'top',
      fieldId: `sig_${sigTarget}`,
    } as any);

    canvas.add(sigText);
    canvas.setActiveObject(sigText);
    canvas.requestRenderAll();
    setIsSigModalOpen(false);
    notify("Calligraphy signature inserted!");
  };

  // Add Drawn Signature from Pad
  const handleInsertDrawnSignature = () => {
    const pad = sigPadElRef.current;
    if (!pad) return;

    const dataUrl = pad.toDataURL('image/png');
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    saveState();
    const imgEl = new Image();
    imgEl.onload = () => {
      const sigImg = new (fabric as any).FabricImage(imgEl, {
        left: sigTarget === 'signer1' ? 140 : 670,
        top: 480,
        scaleX: 160 / pad.width,
        scaleY: 60 / pad.height,
        originX: 'left',
        originY: 'top',
        fieldId: `sig_${sigTarget}`,
      });

      canvas.add(sigImg);
      canvas.setActiveObject(sigImg);
      canvas.requestRenderAll();
      setIsSigModalOpen(false);
      clearSigPad();
      notify("Handwritten signature inserted!");
    };
    imgEl.src = dataUrl;
  };

  // Signature Pad Drawing Canvas Logic
  const startSigDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    sigDrawingRef.current = true;
    const canvas = sigPadElRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    sigPointsRef.current = [{ x, y }];
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = sigPenColor;
      ctx.lineWidth = sigPenWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  };

  const drawSigMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!sigDrawingRef.current) return;
    const canvas = sigPadElRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    sigPointsRef.current.push({ x, y });
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopSigDrawing = () => {
    sigDrawingRef.current = false;
  };

  const clearSigPad = () => {
    const canvas = sigPadElRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    sigPointsRef.current = [];
  };

  // Set today date
  const setTodayDate = () => {
    const today = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    handleQuickFillChange('date', today);
  };

  // Generate Unique ID
  const generateNewId = () => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    const newId = `CERT-${new Date().getFullYear()}-${rand}`;
    handleQuickFillChange('certificateId', newId);
    handleQuickFillChange('verificationUrl', `https://www.singulariti.in/verify?id=${newId}`);
    notify(`Generated ID: ${newId}`);
  };

  // Center Object Horizontally
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
    notify("Centered horizontally");
  };

  // Center Object Vertically
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
    notify("Centered vertically");
  };

  // Duplicate Selected Element
  const duplicateSelected = () => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;
    const activeObj = canvas.getActiveObject();
    if (!activeObj || (activeObj as any).isBackground) return;

    saveState();
    (activeObj as any).clone((cloned: fabric.Object) => {
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
      notify("Element duplicated");
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

  // Add Freeform Text Elements
  const addTextElement = (type: 'heading' | 'subheading' | 'body') => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    saveState();
    let text = 'New Heading';
    let size = 28;
    let weight = 'bold';
    let font = 'Cinzel';
    let color = '#f59e0b';

    if (type === 'subheading') {
      text = 'Official Subheading / Program';
      size = 18;
      weight = '600';
      font = 'Montserrat';
      color = '#e2e8f0';
    } else if (type === 'body') {
      text = 'Additional honors, terms, or institutional remarks go here.';
      size = 14;
      weight = 'normal';
      font = 'Inter';
      color = '#cbd5e1';
    }

    const textObj = new fabric.Textbox(text, {
      left: 200,
      top: 400,
      width: 600,
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
    notify("Text block added");
  };

  // Add Badge / Rosette
  const addDecorativeElement = (badge: BadgeElement) => {
    const canvas = fabricCanvas.current;
    if (!canvas) return;

    saveState();
    const badgeEl = new Image();
    badgeEl.onload = () => {
      const img = new (fabric as any).FabricImage(badgeEl, {
        left: Math.round((documentState.width - badge.defaultWidth) / 2),
        top: Math.round((documentState.height - badge.defaultHeight) / 2),
        scaleX: badge.defaultWidth / (badgeEl.naturalWidth || 200),
        scaleY: badge.defaultHeight / (badgeEl.naturalHeight || 200),
        originX: 'left',
        originY: 'top',
      });
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.requestRenderAll();
      notify(`Added ${badge.name}`);
    };
    badgeEl.src = getSvgDataUrl(badge.svg);
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
        throw new Error('Please select a valid PDF or Image file (PNG/JPG).');
      }

      loadCustomBackgroundOnCanvas(dataUrl);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to open document.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Drag and Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
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

    await new Promise((r) => setTimeout(r, 100));

    try {
      const origW = documentState.width;
      const origH = documentState.height;
      const currentZoom = canvas.getZoom();

      let multiplier = 2; // HD default
      if (quality === 'standard') multiplier = 1;
      if (quality === 'print') multiplier = 3; // 3000px ultra print

      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      canvas.setDimensions({ width: origW, height: origH });

      const dataUrl = canvas.toDataURL({
        format: type === 'jpeg' ? 'jpeg' : 'png',
        quality: 0.95,
        multiplier,
      });

      canvas.setDimensions({ width: origW * currentZoom, height: origH * currentZoom });
      canvas.setZoom(currentZoom);
      canvas.requestRenderAll();

      const filename = `certificate_${quickFill.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() || 'award'}`;

      if (type === 'png' || type === 'jpeg') {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${filename}.${type === 'jpeg' ? 'jpg' : 'png'}`;
        link.click();
        notify(`Certificate saved as ${type.toUpperCase()}!`);
      } else {
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
        notify("Certificate exported as print-ready A4 PDF!");
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

  // Keyboard Shortcuts (Delete, Undo, Redo, Duplicate, Arrows for Nudging)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const canvas = fabricCanvas.current;
      if (!canvas) return;

      const activeObj = canvas.getActiveObject() as any;
      const isEditingText = activeObj && activeObj.isEditing;

      if (e.key === 'Escape') {
        if (isMaximized) setIsMaximized(false);
        canvas.discardActiveObject();
        canvas.requestRenderAll();
        return;
      }

      if (isEditingText) return;

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
    if (!canvasElRef.current) return;

    if (fabric.Object && fabric.Object.prototype) {
      (fabric.Object.prototype as any).originX = 'left';
      (fabric.Object.prototype as any).originY = 'top';
    }

    const canvas = new fabric.Canvas(canvasElRef.current, {
      width: documentState.width,
      height: documentState.height,
      backgroundColor: '#090d16',
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
        setFontFamily(textObj.fontFamily || 'Cinzel');
        setFontSize(textObj.fontSize || 24);
        setTextColor(textObj.fill as string || '#f59e0b');
        setIsBold(textObj.fontWeight === 'bold' || textObj.fontWeight === '700');
        setIsItalic(textObj.fontStyle === 'italic');
        setIsUnderline(textObj.underline || false);
        setTextAlign((textObj.textAlign as 'left' | 'center' | 'right') || 'center');
        setLetterSpacing(textObj.charSpacing || 0);
      } else if (['rect', 'circle', 'path', 'polygon', 'line'].includes(activeObj.type || '')) {
        setShapeColor(activeObj.fill as string || 'transparent');
        setShapeStrokeColor(activeObj.stroke as string || '#f59e0b');
        setShapeStrokeWidth(activeObj.strokeWidth || 2);
      }
    };

    canvas.on('selection:created', handleSelection);
    canvas.on('selection:updated', handleSelection);
    canvas.on('selection:cleared', () => setSelectedType(null));
    canvas.on('object:modified', saveState);

    // Auto-sync inline text editing back to Quick Fill form
    canvas.on('text:changed', (e: any) => {
      const target = e.target;
      if (target && target.fieldId) {
        const fid = target.fieldId;
        const text = target.text || '';
        if (fid in quickFill) {
          setQuickFill((prev) => ({ ...prev, [fid]: text }));
        }
      }
    });

    // ResizeObserver on the container to auto-fit
    const container = containerRef.current;
    let ro: ResizeObserver | null = null;
    if (container) {
      ro = new ResizeObserver(() => {
        fitCanvasToContainer();
      });
      ro.observe(container);
    }

    setTimeout(() => {
      fitCanvasToContainer();
    }, 120);

    return () => {
      if (ro) ro.disconnect();
      canvas.dispose();
      fabricCanvas.current = null;
    };
  }, []);

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

  return (
    <ToolLayout
      article={article}
      howToUse={[
        "Choose an imperial, modern, emerald, or minimalist template, or upload any existing certificate PDF or image.",
        "Use the Quick Fill panel to enter the organization, recipient name, title, citation, and date with real-time canvas sync.",
        "Pick a preset certificate type (Achievement, Completion, Appreciation, Diploma) to auto-fill appropriate formal wording.",
        "Add authentic cursive calligraphy signatures, sketch directly with our digital pen, or upload transparent signature PNGs.",
        "Insert official gold rosette seals, hanging ribbons, laurel wreaths, or a scannable verification QR code.",
        "Double-click any text on the certificate canvas to edit words directly in-place with instant font preview.",
        "Export in ultra-sharp 300 DPI print quality, vector PDF, or save the project file to resume anytime."
      ]}
      faqs={[
        {
          "question": "Can I switch certificate layouts without losing my typed recipient text?",
          "answer": "Yes! Clicking between Classic Navy, Modern Teal, Emerald, Minimalist, or Ruby switches the vector background and automatically adapts text colors for contrast, keeping your recipient name, date, citations, and signatures intact."
        },
        {
          "question": "Can I edit an existing certificate PDF or image without losing quality?",
          "answer": "Yes. Select 'Upload Custom' in the Templates tab, select your PDF or image, and our local engine will render it with crystal-clear high fidelity. You can place signatures, names, stamps, and dates directly over it."
        },
        {
          "question": "Is my recipient data, signatures, and certificates private?",
          "answer": "100% private. The entire Certificate Editor operates completely inside your browser sandbox. None of your certificates, names, or signatures are uploaded to external servers."
        },
        {
          "question": "How do I get high resolution for printing on parchment paper?",
          "answer": "When exporting, choose 'Download PDF (Print A4 300 DPI)'. It scales the canvas to 3000px resolution, ensuring razor-sharp borders and crisp typography for physical certificate parchment paper."
        }
      ]}
      title="Certificate Editor"
      description="Create, customize, and issue professional certificates in your browser. Handcrafted vector themes, calligraphy signatures, gold seals, and instant PDF/PNG export. 100% private."
      categoryName="Image Editing Tools"
      categoryHref="/editing"
      error={error}
      onClearError={() => setError(null)}
    >
      {/* Floating Success Notice */}
      {successNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Main Studio Container */}
      <div className={isMaximized 
        ? "fixed inset-0 z-[150] bg-slate-950 text-slate-100 flex flex-col p-3 md:p-5 w-[100dvw] h-[100dvh] overflow-hidden animate-in fade-in duration-200 font-sans" 
        : "bg-surface border border-border rounded-2xl p-4 md:p-6 shadow-sm animate-in fade-in duration-300 flex flex-col font-sans"
      }>
        
        {/* ======================================================== */}
        {/* TOP COMMAND & STUDIO HEADER BAR                          */}
        {/* ======================================================== */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border mb-4">
          
          {/* Left: Certificate Studio Title & Quick Presets Dropdown */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-ink tracking-tight">
                  Certificate Studio
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                  A4 Landscape
                </span>
              </div>
              <span className="text-[11px] text-slate block">
                {selectedTemplateId === 'custom' ? 'Custom Background' : CERTIFICATE_TEMPLATES[selectedTemplateId]?.name || 'Classic Navy'}
              </span>
            </div>

            <div className="hidden sm:block w-px h-6 bg-border mx-1" />

            {/* 1-Click Preset Certificate Type Picker */}
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate">Preset:</span>
              <select
                onChange={(e) => e.target.value && handleApplyPreset(e.target.value)}
                defaultValue=""
                className="h-8 px-2.5 bg-background border border-border rounded-lg text-xs font-semibold text-ink outline-none focus:border-primary cursor-pointer hover:bg-surface transition"
              >
                <option value="" disabled>Choose Certificate Type...</option>
                <option value="completion">🎓 Certificate of Completion</option>
                <option value="achievement">🏆 Certificate of Achievement</option>
                <option value="appreciation">🌟 Certificate of Appreciation</option>
                <option value="excellence">🏅 Diploma of Excellence</option>
                <option value="participation">📜 Certificate of Participation</option>
                <option value="employee">👔 Employee of the Month</option>
              </select>
            </div>
          </div>

          {/* Center: History, Zoom & Viewport Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              className="p-1.5 rounded-lg border border-border bg-background hover:bg-surface disabled:opacity-30 text-ink transition shadow-xs"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
              className="p-1.5 rounded-lg border border-border bg-background hover:bg-surface disabled:opacity-30 text-ink transition shadow-xs"
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
              title={isMaximized ? "Exit Fullscreen" : "Fullscreen Studio"}
              className="p-1.5 rounded-lg border border-border bg-background hover:bg-surface text-ink transition"
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Right: Project Save & Export Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveProject}
              title="Save project file (.cert) to edit later"
              leftIcon={<Save className="w-3.5 h-3.5" />}
            >
              Save Project
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
              Download PDF (Print 300 DPI)
            </Button>
          </div>

        </div>

        {/* ======================================================== */}
        {/* STUDIO 3-PANEL WORKSPACE                                 */}
        {/* ======================================================== */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-5 ${isMaximized ? 'flex-1 min-h-0 overflow-hidden' : ''}`}>
          
          {/* ======================================================= */}
          {/* LEFT COLUMN: Sidebar Navigation & Tools (Col 3)         */}
          {/* ======================================================= */}
          <div className={`lg:col-span-3 flex flex-col gap-3.5 ${isMaximized ? 'overflow-y-auto pr-2 custom-scrollbar h-full' : ''}`}>
            
            {/* Primary Navigation Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-background border border-border rounded-xl">
              <button
                onClick={() => setActiveTab('content')}
                className={`py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'content'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-slate hover:text-ink hover:bg-surface'
                }`}
              >
                <FileText className="w-3.5 h-3.5" /> Details
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'templates'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-slate hover:text-ink hover:bg-surface'
                }`}
              >
                <Palette className="w-3.5 h-3.5" /> Themes
              </button>
              <button
                onClick={() => setActiveTab('signatures')}
                className={`py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'signatures'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-slate hover:text-ink hover:bg-surface'
                }`}
              >
                <Feather className="w-3.5 h-3.5" /> Signatures
              </button>
            </div>

            <div className="grid grid-cols-3 gap-1 p-1 bg-background border border-border rounded-xl">
              <button
                onClick={() => setActiveTab('seals')}
                className={`py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'seals'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-slate hover:text-ink hover:bg-surface'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Seals
              </button>
              <button
                onClick={() => setActiveTab('qr')}
                className={`py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'qr'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-slate hover:text-ink hover:bg-surface'
                }`}
              >
                <QrIcon className="w-3.5 h-3.5" /> QR / Logo
              </button>
              <button
                onClick={() => setActiveTab('elements')}
                className={`py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                  activeTab === 'elements'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-slate hover:text-ink hover:bg-surface'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" /> Elements
              </button>
            </div>

            {/* TAB 1: DETAILS & CONTENT QUICK FILL */}
            {activeTab === 'content' && (
              <div className="p-4 bg-background border border-border rounded-xl space-y-3.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-1 border-b border-border">
                  <span className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-primary" /> Certificate Content
                  </span>
                  <span className="text-[10px] text-primary font-semibold">Live Synced</span>
                </div>

                {/* Recipient Full Name */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-ink">Recipient Name *</label>
                  <input
                    type="text"
                    value={quickFill.name}
                    onChange={(e) => handleQuickFillChange('name', e.target.value)}
                    placeholder="e.g. Alexander J. Mercer"
                    className="w-full px-3 py-1.5 bg-surface border border-border rounded-lg text-xs font-semibold text-ink outline-none focus:border-primary transition"
                  />
                </div>

                {/* Issuing Organization */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate">Issuing Organization / University</label>
                  <input
                    type="text"
                    value={quickFill.org}
                    onChange={(e) => handleQuickFillChange('org', e.target.value)}
                    placeholder="e.g. GLOBAL ACADEMY OF EXCELLENCE"
                    className="w-full px-3 py-1.5 bg-surface border border-border rounded-lg text-xs text-ink outline-none focus:border-primary transition"
                  />
                </div>

                {/* Title */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate">Certificate Title</label>
                  <input
                    type="text"
                    value={quickFill.title}
                    onChange={(e) => handleQuickFillChange('title', e.target.value)}
                    className="w-full px-3 py-1.5 bg-surface border border-border rounded-lg text-xs font-bold text-ink outline-none focus:border-primary transition"
                  />
                </div>

                {/* Presentation Line */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate">Presentation Phrase</label>
                  <input
                    type="text"
                    value={quickFill.presentation}
                    onChange={(e) => handleQuickFillChange('presentation', e.target.value)}
                    placeholder="e.g. THIS IS PROUDLY PRESENTED TO"
                    className="w-full px-3 py-1.5 bg-surface border border-border rounded-lg text-xs text-ink outline-none focus:border-primary transition"
                  />
                </div>

                {/* Description / Citation Paragraph */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate">Citation / Reason for Award</label>
                  <textarea
                    rows={3}
                    value={quickFill.description}
                    onChange={(e) => handleQuickFillChange('description', e.target.value)}
                    className="w-full p-2.5 bg-surface border border-border rounded-lg text-xs text-ink outline-none focus:border-primary resize-y transition"
                  />
                </div>

                {/* Date & ID Row */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-slate">Issue Date</label>
                      <button onClick={setTodayDate} className="text-[10px] text-primary hover:underline">Today</button>
                    </div>
                    <input
                      type="text"
                      value={quickFill.date}
                      onChange={(e) => handleQuickFillChange('date', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs text-ink outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-slate">Certificate ID</label>
                      <button onClick={generateNewId} className="text-[10px] text-primary hover:underline">New ID</button>
                    </div>
                    <input
                      type="text"
                      value={quickFill.certificateId}
                      onChange={(e) => handleQuickFillChange('certificateId', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-surface border border-border rounded-lg text-xs font-mono text-ink outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: TEMPLATES & BACKGROUNDS */}
            {activeTab === 'templates' && (
              <div className="p-4 bg-background border border-border rounded-xl space-y-3.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-1 border-b border-border">
                  <span className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-primary" /> Certificate Layouts
                  </span>
                  <span className="text-[10px] text-slate">8 Handcrafted</span>
                </div>

                {/* Template Cards Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(CERTIFICATE_TEMPLATES).map((tmpl) => {
                    const isSelected = selectedTemplateId === tmpl.id;
                    return (
                      <button
                        key={tmpl.id}
                        onClick={() => loadTemplateBackground(tmpl.id, false)}
                        className={`group relative flex flex-col p-2 rounded-xl border text-left transition-all ${
                          isSelected 
                            ? 'bg-primary/10 border-primary ring-2 ring-primary/20' 
                            : 'bg-surface border-border hover:border-primary/50 hover:bg-primary/5'
                        }`}
                      >
                        <div className="w-full h-16 rounded-lg overflow-hidden border border-border/50 mb-1.5 flex items-center justify-center bg-slate-900">
                          <div 
                            className="w-full h-full transform scale-90 transition duration-300 group-hover:scale-100"
                            dangerouslySetInnerHTML={{ __html: tmpl.svg }}
                          />
                        </div>
                        <span className="text-xs font-bold text-ink truncate block">
                          {tmpl.name}
                        </span>
                        <span className="text-[10px] text-slate truncate block">
                          {tmpl.description}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Upload Card */}
                <div className="pt-3 border-t border-border">
                  <span className="text-xs font-bold text-ink block mb-1.5">Upload Custom Background</span>
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('custom-bg-upload')?.click()}
                    className="border-2 border-dashed border-border hover:border-primary/60 rounded-xl p-3 text-center cursor-pointer bg-surface/50 hover:bg-primary/5 transition"
                  >
                    <input
                      type="file"
                      id="custom-bg-upload"
                      accept="image/*,application/pdf"
                      onChange={(e) => e.target.files?.[0] && processUploadedFile(e.target.files[0])}
                      className="hidden"
                    />
                    <Upload className="w-5 h-5 text-primary/70 mx-auto mb-1" />
                    <span className="text-xs font-bold text-ink block">Upload PDF or Image</span>
                    <span className="text-[10px] text-slate block">PNG, JPG, or PDF Certificate</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SIGNATURES & SIGNERS */}
            {activeTab === 'signatures' && (
              <div className="p-4 bg-background border border-border rounded-xl space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-1 border-b border-border">
                  <span className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                    <Feather className="w-3.5 h-3.5 text-primary" /> Signatures & Signers
                  </span>
                </div>

                {/* Signer Count Selector (1 vs 2 Signers) */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate block">Signer Layout</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleSignerCountToggle('single')}
                      className={`py-1.5 px-2.5 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        signerCount === 'single'
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-surface border-border text-slate hover:text-ink'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" /> 1 Signer (Center)
                    </button>
                    <button
                      onClick={() => handleSignerCountToggle('double')}
                      className={`py-1.5 px-2.5 rounded-lg border text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                        signerCount === 'double'
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-surface border-border text-slate hover:text-ink'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" /> 2 Signers (L & R)
                    </button>
                  </div>
                </div>

                {/* Signer 1 Form & Signature Insertion */}
                <div className="p-3 bg-surface border border-border rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-ink">Signer 1 {signerCount === 'double' ? '(Left)' : '(Primary)'}</span>
                    <button
                      onClick={() => {
                        setSigTarget('signer1');
                        setTypedSigText(quickFill.signer1Name);
                        setIsSigModalOpen(true);
                      }}
                      className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      <PenTool className="w-3 h-3" /> Add Signature
                    </button>
                  </div>
                  <input
                    type="text"
                    value={quickFill.signer1Name}
                    onChange={(e) => handleQuickFillChange('signer1Name', e.target.value)}
                    placeholder="Signer Name"
                    className="w-full px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs text-ink outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    value={quickFill.signer1Title}
                    onChange={(e) => handleQuickFillChange('signer1Title', e.target.value)}
                    placeholder="Signer Title / Department"
                    className="w-full px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs text-slate outline-none focus:border-primary"
                  />
                </div>

                {/* Signer 2 Form (if double) */}
                {signerCount === 'double' && (
                  <div className="p-3 bg-surface border border-border rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-ink">Signer 2 (Right)</span>
                      <button
                        onClick={() => {
                          setSigTarget('signer2');
                          setTypedSigText(quickFill.signer2Name);
                          setIsSigModalOpen(true);
                        }}
                        className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                      >
                        <PenTool className="w-3 h-3" /> Add Signature
                      </button>
                    </div>
                    <input
                      type="text"
                      value={quickFill.signer2Name}
                      onChange={(e) => handleQuickFillChange('signer2Name', e.target.value)}
                      placeholder="Signer 2 Name"
                      className="w-full px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs text-ink outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      value={quickFill.signer2Title}
                      onChange={(e) => handleQuickFillChange('signer2Title', e.target.value)}
                      placeholder="Signer 2 Title / Department"
                      className="w-full px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs text-slate outline-none focus:border-primary"
                    />
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: SEALS, MEDALS & BADGES */}
            {activeTab === 'seals' && (
              <div className="p-4 bg-background border border-border rounded-xl space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-1 border-b border-border">
                  <span className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Official Seals & Crests
                  </span>
                  <span className="text-[10px] text-slate">Click to Add</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {DECORATIVE_ELEMENTS.map((badge) => (
                    <button
                      key={badge.id}
                      onClick={() => addDecorativeElement(badge)}
                      className="p-2.5 bg-surface hover:bg-primary/5 border border-border hover:border-primary rounded-xl flex flex-col items-center text-center transition group shadow-xs"
                    >
                      <div 
                        className="w-14 h-14 flex items-center justify-center mb-1.5 transform group-hover:scale-105 transition"
                        dangerouslySetInnerHTML={{ __html: badge.svg }}
                      />
                      <span className="text-[11px] font-bold text-ink leading-tight line-clamp-1">
                        {badge.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: QR CODE & BRAND LOGO */}
            {activeTab === 'qr' && (
              <div className="p-4 bg-background border border-border rounded-xl space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-1 border-b border-border">
                  <span className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                    <QrIcon className="w-3.5 h-3.5 text-primary" /> Verification QR & Logo
                  </span>
                </div>

                {/* QR Code Section */}
                <div className="p-3 bg-surface border border-border rounded-xl space-y-2.5">
                  <span className="text-xs font-bold text-ink block">Instant Verification QR Code</span>
                  <p className="text-[11px] text-slate leading-relaxed">
                    Places a scannable QR code on the certificate that leads to your validation page.
                  </p>
                  <input
                    type="url"
                    value={quickFill.verificationUrl}
                    onChange={(e) => handleQuickFillChange('verificationUrl', e.target.value)}
                    placeholder="https://yourdomain.com/verify?id=..."
                    className="w-full px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs font-mono text-ink outline-none focus:border-primary"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={handleAddQrCode}
                    leftIcon={<QrIcon className="w-3.5 h-3.5" />}
                  >
                    Generate & Place QR Code
                  </Button>
                </div>

                {/* Organization Brand Logo Upload */}
                <div className="p-3 bg-surface border border-border rounded-xl space-y-2.5">
                  <span className="text-xs font-bold text-ink block">Add Organization Logo</span>
                  <p className="text-[11px] text-slate leading-relaxed">
                    Upload your school, university, or company insignia (PNG with transparency recommended).
                  </p>
                  <label className="flex items-center justify-center gap-2 w-full py-2 bg-background hover:bg-surface border border-border rounded-lg text-xs font-semibold text-ink cursor-pointer transition">
                    <Upload className="w-3.5 h-3.5 text-primary" />
                    <span>Upload Logo Image</span>
                    <input type="file" accept="image/png,image/jpeg,image/svg+xml" onChange={handleLogoUpload} className="hidden" />
                  </label>
                </div>
              </div>
            )}

            {/* TAB 6: ELEMENTS & SHAPES */}
            {activeTab === 'elements' && (
              <div className="p-4 bg-background border border-border rounded-xl space-y-3.5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-1 border-b border-border">
                  <span className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-primary" /> Custom Elements
                  </span>
                </div>

                {/* Add Text Blocks */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate block">Insert Text</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => addTextElement('heading')}
                      className="py-1.5 px-2 bg-surface hover:bg-primary/5 border border-border rounded-lg text-xs font-bold text-ink transition"
                    >
                      Heading
                    </button>
                    <button
                      onClick={() => addTextElement('subheading')}
                      className="py-1.5 px-2 bg-surface hover:bg-primary/5 border border-border rounded-lg text-xs font-semibold text-ink transition"
                    >
                      Subhead
                    </button>
                    <button
                      onClick={() => addTextElement('body')}
                      className="py-1.5 px-2 bg-surface hover:bg-primary/5 border border-border rounded-lg text-xs text-ink transition"
                    >
                      Body
                    </button>
                  </div>
                </div>

                {/* Freehand Brush */}
                <div className="pt-2 border-t border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate">Freehand Pen Tool</span>
                    <button
                      onClick={() => setIsDrawing(!isDrawing)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition ${
                        isDrawing 
                          ? 'bg-primary text-white border-primary shadow-xs' 
                          : 'bg-surface border-border text-slate hover:text-ink'
                      }`}
                    >
                      {isDrawing ? 'Pen Active' : 'Enable Pen'}
                    </button>
                  </div>
                  {isDrawing && (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="color"
                        value={brushColor}
                        onChange={(e) => setBrushColor(e.target.value)}
                        className="w-7 h-7 rounded border border-border cursor-pointer bg-transparent"
                      />
                      <input
                        type="range"
                        min="1"
                        max="12"
                        value={brushWidth}
                        onChange={(e) => setBrushWidth(Number(e.target.value))}
                        className="flex-1 accent-primary"
                      />
                      <span className="text-xs font-mono text-slate">{brushWidth}px</span>
                    </div>
                  )}
                </div>

                {/* Open Saved Project */}
                <div className="pt-2 border-t border-border">
                  <label className="flex items-center justify-center gap-1.5 py-2 bg-surface hover:bg-surface/80 border border-border rounded-lg text-xs font-semibold text-slate hover:text-ink cursor-pointer transition">
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Open Saved (.cert) Project</span>
                    <input type="file" accept=".cert,application/json" onChange={handleLoadProject} className="hidden" />
                  </label>
                </div>
              </div>
            )}

          </div>

          {/* ======================================================= */}
          {/* MIDDLE COLUMN: Interactive Canvas (Col 6)               */}
          {/* ======================================================= */}
          <div className={`lg:col-span-6 flex flex-col items-center ${isMaximized ? 'h-full overflow-hidden' : ''}`}>
            
            {/* Canvas Container with clean centering */}
            <div 
              ref={containerRef}
              className={`w-full relative border border-border rounded-2xl bg-slate-900/60 dark:bg-black/70 overflow-auto flex justify-center items-center p-4 transition-all shadow-inner ${
                isMaximized ? 'flex-1 min-h-0' : 'min-h-[520px]'
              }`}
            >
              <style dangerouslySetInnerHTML={{ __html: `
                .canvas-container {
                  margin: auto !important;
                  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6) !important;
                  border-radius: 4px;
                }
              `}} />

              <canvas ref={canvasElRef} className="block" />
            </div>

            {/* Quick Canvas Status bar */}
            <div className="w-full flex items-center justify-between text-[11px] text-slate mt-2 px-1">
              <span>* Double-click any text on the certificate to edit directly in-place.</span>
              <span className="font-mono">{documentState.width} &times; {documentState.height} px (A4 Landscape)</span>
            </div>

          </div>

          {/* ======================================================= */}
          {/* RIGHT COLUMN: Element Inspector & Controls (Col 3)      */}
          {/* ======================================================= */}
          <div className={`lg:col-span-3 space-y-3.5 ${isMaximized ? 'overflow-y-auto pr-2 custom-scrollbar h-full' : ''}`}>
            
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
                <div className="flex flex-col items-center justify-center text-center py-16 text-slate space-y-3">
                  <Award className="w-10 h-10 opacity-30 text-primary" />
                  <div>
                    <p className="text-xs font-bold text-ink">No element selected</p>
                    <p className="text-[11px] max-w-[200px] leading-relaxed mt-1">
                      Click any text, badge, or signature on the certificate to format, color, or re-align it.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-150">
                  
                  {/* Position Alignment Buttons */}
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

                  {/* TEXT-SPECIFIC FORMATTING CONTROLS */}
                  {(selectedType === 'textbox' || selectedType === 'text') && (
                    <div className="space-y-3.5 pt-2 border-t border-border">
                      
                      {/* Content Edit */}
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate uppercase tracking-wider">
                          Text Content
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
                          className="w-full h-8 px-2 bg-surface border border-border rounded-lg text-xs text-ink outline-none focus:border-primary font-medium"
                        >
                          {FONT_OPTIONS.map((f) => (
                            <option key={f.value} value={f.value}>
                              {f.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Font Size & Color */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate uppercase tracking-wider">
                            Size ({fontSize}px)
                          </label>
                          <input
                            type="number"
                            min="8"
                            max="130"
                            value={fontSize}
                            onChange={(e) => handleTextPropertyChange('fontSize', e.target.value)}
                            className="w-full h-8 px-2 bg-surface border border-border rounded-lg text-xs text-ink outline-none focus:border-primary font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-slate uppercase tracking-wider">
                            Color
                          </label>
                          <div className="flex items-center gap-1.5 h-8">
                            <input
                              type="color"
                              value={textColor}
                              onChange={(e) => handleTextPropertyChange('color', e.target.value)}
                              className="w-7 h-7 rounded border border-border cursor-pointer bg-transparent"
                            />
                            <span className="text-[10px] font-mono text-slate uppercase truncate">
                              {textColor}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Swatches Palette */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {COLOR_SWATCHES.map((swatch) => (
                          <button
                            key={swatch}
                            onClick={() => handleTextPropertyChange('color', swatch)}
                            className="w-5 h-5 rounded-full border border-border/80 shadow-xs hover:scale-110 transition"
                            style={{ backgroundColor: swatch }}
                            title={swatch}
                          />
                        ))}
                      </div>

                      {/* Styles: Bold, Italic, Underline & Casing */}
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

                    </div>
                  )}

                  {/* SHAPE OR BADGE CONTROLS */}
                  {['rect', 'circle', 'path', 'polygon', 'line', 'image'].includes(selectedType || '') && (
                    <div className="space-y-3 pt-2 border-t border-border">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-slate uppercase tracking-wider">
                          Opacity ({Math.round(elementOpacity * 100)}%)
                        </label>
                        <input
                          type="range"
                          min="0.05"
                          max="1"
                          step="0.05"
                          value={elementOpacity}
                          onChange={(e) => handleShapePropertyChange('opacity', Number(e.target.value))}
                          className="w-full accent-primary"
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Bar: Duplicate, Delete, Layer Reorder */}
                  <div className="pt-3 border-t border-border space-y-2">
                    <span className="text-[10px] font-bold text-slate uppercase tracking-wider block">
                      Element Actions
                    </span>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={duplicateSelected}
                        className="py-1.5 px-2 bg-surface hover:bg-surface/80 border border-border rounded-lg text-xs font-semibold text-ink flex items-center justify-center gap-1.5 transition"
                      >
                        <Copy className="w-3.5 h-3.5 text-primary" /> Duplicate
                      </button>
                      <button
                        onClick={deleteSelected}
                        className="py-1.5 px-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>

                    <div className="flex gap-1 pt-1">
                      <button
                        onClick={() => layerArrange('forward')}
                        className="flex-1 py-1 bg-surface border border-border rounded text-[11px] text-slate hover:text-ink transition"
                        title="Bring Forward"
                      >
                        Bring Up
                      </button>
                      <button
                        onClick={() => layerArrange('backward')}
                        className="flex-1 py-1 bg-surface border border-border rounded text-[11px] text-slate hover:text-ink transition"
                        title="Send Backward"
                      >
                        Send Down
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* SIGNATURE MODAL (CALLIGRAPHY TYPE / DRAW / UPLOAD)        */}
      {/* ======================================================== */}
      {isSigModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-background border border-border rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Feather className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">Add Signature for {sigTarget === 'signer1' ? quickFill.signer1Name : quickFill.signer2Name}</h3>
                  <span className="text-[11px] text-slate">Calligraphy Script, Digital Pen, or Image</span>
                </div>
              </div>
              <button
                onClick={() => setIsSigModalOpen(false)}
                className="p-1.5 rounded-lg border border-border hover:bg-surface text-slate hover:text-ink transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex p-1 bg-surface border border-border rounded-xl gap-1">
              <button
                onClick={() => setSigModalTab('type')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                  sigModalTab === 'type' ? 'bg-primary text-white shadow-xs' : 'text-slate hover:text-ink'
                }`}
              >
                Type Calligraphy
              </button>
              <button
                onClick={() => setSigModalTab('draw')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                  sigModalTab === 'draw' ? 'bg-primary text-white shadow-xs' : 'text-slate hover:text-ink'
                }`}
              >
                Draw with Pen
              </button>
              <button
                onClick={() => setSigModalTab('upload')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                  sigModalTab === 'upload' ? 'bg-primary text-white shadow-xs' : 'text-slate hover:text-ink'
                }`}
              >
                Upload PNG
              </button>
            </div>

            {/* TAB 1: TYPE CALLIGRAPHY */}
            {sigModalTab === 'type' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate block">Signer Full Name</label>
                  <input
                    type="text"
                    value={typedSigText}
                    onChange={(e) => setTypedSigText(e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm font-medium text-ink outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate block">Calligraphy Style</label>
                    <select
                      value={typedSigFont}
                      onChange={(e) => setTypedSigFont(e.target.value)}
                      className="w-full h-9 px-2 bg-surface border border-border rounded-xl text-xs text-ink outline-none focus:border-primary"
                    >
                      <option value="Great Vibes">Great Vibes (Classic)</option>
                      <option value="Alex Brush">Alex Brush (Flowing)</option>
                      <option value="Pinyon Script">Pinyon Script (Regal)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate block">Ink Color</label>
                    <div className="flex items-center gap-2 h-9">
                      <input
                        type="color"
                        value={typedSigColor}
                        onChange={(e) => setTypedSigColor(e.target.value)}
                        className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent"
                      />
                      <span className="text-xs font-mono text-slate uppercase">{typedSigColor}</span>
                    </div>
                  </div>
                </div>

                {/* Preview Box */}
                <div className="p-4 bg-surface/50 border border-border rounded-xl text-center min-h-[90px] flex items-center justify-center">
                  <span
                    style={{
                      fontFamily: typedSigFont,
                      color: typedSigColor,
                      fontSize: '38px',
                    }}
                  >
                    {typedSigText || 'Signer Signature'}
                  </span>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={handleInsertTypedSignature}
                  leftIcon={<Check className="w-4 h-4" />}
                >
                  Insert Signature
                </Button>
              </div>
            )}

            {/* TAB 2: DRAW WITH DIGITAL PEN */}
            {sigModalTab === 'draw' && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs text-slate">
                  <div className="flex items-center gap-2">
                    <span>Pen Color:</span>
                    <input
                      type="color"
                      value={sigPenColor}
                      onChange={(e) => setSigPenColor(e.target.value)}
                      className="w-6 h-6 rounded border border-border cursor-pointer bg-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Width:</span>
                    <input
                      type="range"
                      min="1"
                      max="6"
                      step="0.5"
                      value={sigPenWidth}
                      onChange={(e) => setSigPenWidth(Number(e.target.value))}
                      className="w-20 accent-primary"
                    />
                  </div>
                  <button
                    onClick={clearSigPad}
                    className="text-primary hover:underline font-semibold"
                  >
                    Clear
                  </button>
                </div>

                <div className="bg-white border-2 border-dashed border-border rounded-xl overflow-hidden relative cursor-crosshair shadow-inner">
                  <canvas
                    ref={sigPadElRef}
                    width={450}
                    height={160}
                    onMouseDown={startSigDrawing}
                    onMouseMove={drawSigMove}
                    onMouseUp={stopSigDrawing}
                    onMouseLeave={stopSigDrawing}
                    onTouchStart={startSigDrawing}
                    onTouchMove={drawSigMove}
                    onTouchEnd={stopSigDrawing}
                    className="w-full block"
                  />
                  <span className="absolute bottom-2 right-2 text-[10px] text-slate-400 select-none pointer-events-none">
                    Sign with mouse or touch
                  </span>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  onClick={handleInsertDrawnSignature}
                  leftIcon={<Check className="w-4 h-4" />}
                >
                  Insert Drawn Signature
                </Button>
              </div>
            )}

            {/* TAB 3: UPLOAD SIGNATURE IMAGE */}
            {sigModalTab === 'upload' && (
              <div className="space-y-4">
                <p className="text-xs text-slate leading-relaxed">
                  Upload an image of your signature on white paper or transparent PNG background.
                </p>
                <label className="border-2 border-dashed border-border hover:border-primary/60 rounded-xl p-6 text-center cursor-pointer bg-surface/50 hover:bg-primary/5 transition block">
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const dataUrl = ev.target?.result as string;
                        const canvas = fabricCanvas.current;
                        if (!canvas) return;

                        saveState();
                        const imgEl = new Image();
                        imgEl.onload = () => {
                          const sigImg = new (fabric as any).FabricImage(imgEl, {
                            left: sigTarget === 'signer1' ? 140 : 670,
                            top: 480,
                            scaleX: 160 / imgEl.naturalWidth,
                            scaleY: 60 / imgEl.naturalHeight,
                            originX: 'left',
                            originY: 'top',
                            fieldId: `sig_${sigTarget}`,
                          });

                          canvas.add(sigImg);
                          canvas.setActiveObject(sigImg);
                          canvas.requestRenderAll();
                          setIsSigModalOpen(false);
                          notify("Signature image placed!");
                        };
                        imgEl.src = dataUrl;
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="hidden"
                  />
                  <Upload className="w-6 h-6 text-primary mx-auto mb-1.5" />
                  <span className="text-xs font-bold text-ink block">Choose Signature Image</span>
                  <span className="text-[11px] text-slate block">PNG, JPG (transparent background recommended)</span>
                </label>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Loading & Processing Spinner Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-3">
            <LoadingSpinner size="lg" />
            <p className="text-xs font-bold text-ink">{processingMessage || 'Processing...'}</p>
          </div>
        </div>
      )}

    </ToolLayout>
  );
}
