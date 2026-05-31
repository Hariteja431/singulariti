import React from 'react';
import { EditorToolId } from '../../../lib/image-editor/editorTypes';
import { 
  Scale, Sparkles, Zap, Droplets, Palette, Sun, 
  Copyright, Type, Image as ImageIcon, Paintbrush, Contrast,
  Crop, Maximize2, RotateCw, FlipHorizontal, Sliders, Grid, Eye
} from 'lucide-react';

interface ToolItem {
  id: EditorToolId;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface ToolGroup {
  name: string;
  tools: ToolItem[];
}

const GROUPS_LIST: ToolGroup[] = [
  {
    name: 'Transform & Geometry',
    tools: [
      { id: 'crop', name: 'Crop Image', description: 'Cut or trim image boundaries', icon: Crop },
      { id: 'resize', name: 'Image Resizer', description: 'Resize width & height', icon: Maximize2 },
      { id: 'rotate', name: 'Rotate Image', description: 'Rotate by angles', icon: RotateCw },
      { id: 'flip', name: 'Flip Image', description: 'Mirror image direction', icon: FlipHorizontal },
    ]
  },
  {
    name: 'Quality & Enhance',
    tools: [
      { id: 'upscaler', name: 'Image Upscaler', description: 'Upscale resolution up to 4x', icon: Scale },
      { id: 'enhancer', name: 'Image Enhancer', description: 'Auto clarity and color boost', icon: Sparkles },
      { id: 'sharpen', name: 'Image Sharpen', description: 'Enhance details and edges', icon: Zap },
      { id: 'denoiser', name: 'Image Denoiser', description: 'Smooth out digital noise', icon: Droplets },
    ]
  },
  {
    name: 'Filters & Adjust',
    tools: [
      { id: 'brightnessContrast', name: 'Brightness & Contrast', description: 'Exposure, highlights, shadows', icon: Sun },
      { id: 'colorAdjust', name: 'Color Adjuster', description: 'Saturation, hue, warmth', icon: Palette },
      { id: 'grayscale', name: 'Grayscale', description: 'Quick black & white toggle', icon: Eye },
      { id: 'colorToBw', name: 'Color to B&W', description: 'Convert to custom monochrome', icon: Contrast },
      { id: 'bwToColor', name: 'B&W to Color Tone', description: 'Apply tinted vintage tones', icon: Paintbrush },
      { id: 'blur', name: 'Blur Image', description: 'Apply gaussian smoothing', icon: Sliders },
      { id: 'pixelate', name: 'Pixelate Image', description: 'Add pixel/censor filter', icon: Grid },
    ]
  },
  {
    name: 'Overlays & Markup',
    tools: [
      { id: 'watermark', name: 'Add Watermark', description: 'Overlay copyright texts', icon: Copyright },
      { id: 'text', name: 'Add Text', description: 'Write customized text layers', icon: Type },
      { id: 'logo', name: 'Add Logo Overlay', description: 'Overlay transparent logo files', icon: ImageIcon },
    ]
  }
];

interface EditorSidebarProps {
  activeTool: EditorToolId;
  onChangeTool: (toolId: EditorToolId) => void;
}

export function EditorSidebar({ activeTool, onChangeTool }: EditorSidebarProps) {
  return (
    <div className="w-full flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1 select-none scrollbar-thin">
      {GROUPS_LIST.map((group) => (
        <div key={group.name} className="flex flex-col gap-1.5">
          <span className="text-[10px] font-sans text-slate font-bold uppercase tracking-wider px-1 block mb-0.5 opacity-80">
            {group.name}
          </span>
          <div className="flex flex-col gap-1">
            {group.tools.map((tool) => {
              const Icon = tool.icon;
              const isSelected = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => onChangeTool(tool.id)}
                  className={`w-full text-left p-2 rounded-lg border font-sans transition-all flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-primary/10 border-primary text-primary shadow-xs'
                      : 'bg-surface border-border text-ink hover:border-slate hover:shadow-xs'
                  }`}
                >
                  <div className={`p-1 rounded-md transition-colors ${isSelected ? 'bg-primary/20 text-primary' : 'bg-background text-slate'}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-semibold leading-none">{tool.name}</span>
                    <span className="block text-[9px] text-slate mt-0.5 truncate">{tool.description}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
