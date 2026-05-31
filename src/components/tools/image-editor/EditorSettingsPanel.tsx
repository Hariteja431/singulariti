import React, { useRef } from 'react';
import { EditorSettings, EditorToolId } from '../../../lib/image-editor/editorTypes';
import { Button } from '../../ui/Button';
import { validateLogoFile } from '../../../lib/image-editor/validationHelpers';
import { Upload, HelpCircle, AlertCircle } from 'lucide-react';

interface EditorSettingsPanelProps {
  activeTool: EditorToolId;
  settings: EditorSettings;
  onChangeSettings: (settings: EditorSettings) => void;
  originalWidth: number;
  originalHeight: number;
  logoFile: File | null;
  onLogoUpload: (file: File) => void;
  onLogoRemove: () => void;
  logoError: string | null;
  setLogoError: (err: string | null) => void;
}

const FONTS_LIST = ['Sans-serif', 'Serif', 'Monospace', 'Cursive', 'Georgia', 'Arial', 'Times New Roman'];

export function EditorSettingsPanel({
  activeTool,
  settings,
  onChangeSettings,
  originalWidth,
  originalHeight,
  logoFile,
  onLogoUpload,
  onLogoRemove,
  logoError,
  setLogoError,
}: EditorSettingsPanelProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Helper to update specific sub-settings
  const updateSettings = <K extends keyof EditorSettings>(
    key: K,
    updater: Partial<EditorSettings[K]>
  ) => {
    onChangeSettings({
      ...settings,
      [key]: {
        ...settings[key],
        ...updater,
      },
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogoError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateLogoFile(file);
    if (!validation.isValid) {
      setLogoError(validation.message);
      return;
    }

    onLogoUpload(file);
  };

  const handleRemoveLogo = () => {
    onLogoRemove();
  };

  return (
    <div className="w-full flex flex-col gap-4 font-sans bg-surface border border-border rounded-xl p-5 shadow-xs">
      <div className="border-b border-border pb-2">
        <span className="text-[10px] font-sans text-slate font-bold uppercase tracking-wider block">
          Settings Panel
        </span>
        <h4 className="text-sm font-display font-bold text-ink uppercase tracking-wide mt-1">
          {activeTool.replace(/([A-Z])/g, ' $1')} Settings
        </h4>
      </div>

      <div className="space-y-5">
        
        {/* 1. UPSCALER */}
        {activeTool === 'upscaler' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-slate uppercase tracking-wider">Scale Preset</label>
              <div className="grid grid-cols-2 gap-2">
                {['2x', '3x', '4x', 'custom'].map((val) => (
                  <button
                    key={val}
                    onClick={() => updateSettings('upscaler', { scale: val as any })}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-all ${
                      settings.upscaler.scale === val
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-background border-border text-ink hover:border-slate'
                    }`}
                  >
                    {val === 'custom' ? 'Custom Size' : val}
                  </button>
                ))}
              </div>
            </div>

            {settings.upscaler.scale === 'custom' && (
              <div className="space-y-3 p-3 bg-background border border-border rounded-lg animate-in fade-in duration-200">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate uppercase tracking-wider mb-1">Width (px)</label>
                    <input
                      type="number"
                      value={settings.upscaler.width}
                      onChange={(e) => {
                        const w = parseInt(e.target.value) || 0;
                        let h = settings.upscaler.height;
                        if (settings.upscaler.lockAspect && originalWidth > 0) {
                          h = Math.round(w * (originalHeight / originalWidth));
                        }
                        updateSettings('upscaler', { width: w, height: h });
                      }}
                      className="w-full h-9 px-3 bg-surface border border-border rounded-lg text-xs text-ink outline-none focus:border-primary font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate uppercase tracking-wider mb-1">Height (px)</label>
                    <input
                      type="number"
                      value={settings.upscaler.height}
                      onChange={(e) => {
                        const h = parseInt(e.target.value) || 0;
                        let w = settings.upscaler.width;
                        if (settings.upscaler.lockAspect && originalHeight > 0) {
                          w = Math.round(h * (originalWidth / originalHeight));
                        }
                        updateSettings('upscaler', { width: w, height: h });
                      }}
                      className="w-full h-9 px-3 bg-surface border border-border rounded-lg text-xs text-ink outline-none focus:border-primary font-mono"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={settings.upscaler.lockAspect}
                    onChange={(e) => updateSettings('upscaler', { lockAspect: e.target.checked })}
                    className="accent-primary rounded"
                  />
                  <span className="text-[11px] text-slate">Lock aspect ratio</span>
                </label>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate uppercase tracking-wider">Smoothing Quality</label>
              <select
                value={settings.upscaler.quality}
                onChange={(e) => updateSettings('upscaler', { quality: e.target.value as any })}
                className="w-full h-10 px-3 bg-background border border-border rounded-lg text-xs text-ink outline-none focus:border-primary"
              >
                <option value="low">Low (Fast)</option>
                <option value="medium">Medium</option>
                <option value="high">High (Bicubic approximation)</option>
              </select>
            </div>

            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-[11px] text-primary leading-relaxed flex gap-2">
              <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Browser-based upscaling increases image resolution, but AI-level upscaling may require server-side models.</span>
            </div>
          </div>
        )}

        {/* 2. ENHANCER */}
        {activeTool === 'enhancer' && (
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 bg-background border border-border rounded-lg cursor-pointer select-none">
              <span className="text-xs font-semibold text-ink">Auto Enhance All</span>
              <input
                type="checkbox"
                checked={settings.enhancer.auto}
                onChange={(e) => {
                  const check = e.target.checked;
                  updateSettings('enhancer', {
                    auto: check,
                    color: check,
                    clarity: check,
                    exposure: check,
                    saturation: check,
                  });
                }}
                className="accent-primary"
              />
            </label>

            <div className="space-y-2 border-t border-border pt-3">
              <span className="block text-[10px] font-bold text-slate uppercase tracking-wider mb-2">Enhancement Modules</span>
              {[
                { key: 'color', label: 'Color Correction' },
                { key: 'clarity', label: 'Improve Clarity & Details' },
                { key: 'exposure', label: 'Improve Contrast & Exposure' },
                { key: 'saturation', label: 'Boost Saturation' },
              ].map((item) => (
                <label key={item.key} className="flex items-center justify-between p-2.5 bg-background border border-border rounded-lg cursor-pointer select-none">
                  <span className="text-xs text-slate">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={(settings.enhancer as any)[item.key]}
                    onChange={(e) => updateSettings('enhancer', { [item.key]: e.target.checked, auto: false })}
                    className="accent-primary"
                  />
                </label>
              ))}
            </div>
          </div>
        )}

        {/* 3. SHARPEN */}
        {activeTool === 'sharpen' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-slate uppercase">
                <span>Sharpening Strength</span>
                <span>{settings.sharpen.strength}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.sharpen.strength}
                onChange={(e) => updateSettings('sharpen', { strength: Number(e.target.value) })}
                className="w-full accent-primary"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 20, label: 'Low' },
                { val: 50, label: 'Medium' },
                { val: 80, label: 'High' },
              ].map((preset) => (
                <Button
                  key={preset.val}
                  variant="outline"
                  size="sm"
                  onClick={() => updateSettings('sharpen', { strength: preset.val })}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* 4. DENOISER */}
        {activeTool === 'denoiser' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-slate uppercase">
                <span>Denoise Strength</span>
                <span>{settings.denoiser.strength}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.denoiser.strength}
                onChange={(e) => updateSettings('denoiser', { strength: Number(e.target.value) })}
                className="w-full accent-primary"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 25, label: 'Low' },
                { val: 50, label: 'Medium' },
                { val: 75, label: 'High' },
              ].map((preset) => (
                <Button
                  key={preset.val}
                  variant="outline"
                  size="sm"
                  onClick={() => updateSettings('denoiser', { strength: preset.val })}
                >
                  {preset.label}
                </Button>
              ))}
            </div>

            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-[11px] text-primary leading-relaxed flex gap-2">
              <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Browser-only denoising is basic and may not match AI denoising quality.</span>
            </div>
          </div>
        )}

        {/* 5. COLOR ADJUST */}
        {activeTool === 'colorAdjust' && (
          <div className="space-y-4">
            {[
              { key: 'saturation', label: 'Saturation', min: -100, max: 100, unit: '%' },
              { key: 'vibrance', label: 'Vibrance', min: -100, max: 100, unit: '%' },
              { key: 'temperature', label: 'Warmth (Temp)', min: -100, max: 100, unit: '%' },
              { key: 'tint', label: 'Green / Magenta Tint', min: -100, max: 100, unit: '%' },
              { key: 'exposure', label: 'Exposure', min: -100, max: 100, unit: '%' },
              { key: 'hue', label: 'Hue Rotate', min: -180, max: 180, unit: '°' },
            ].map((slide) => (
              <div key={slide.key} className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate uppercase">
                  <span>{slide.label}</span>
                  <span>{(settings.colorAdjust as any)[slide.key]}{slide.unit}</span>
                </div>
                <input
                  type="range"
                  min={slide.min}
                  max={slide.max}
                  value={(settings.colorAdjust as any)[slide.key]}
                  onChange={(e) => updateSettings('colorAdjust', { [slide.key]: Number(e.target.value) })}
                  className="w-full accent-primary"
                />
              </div>
            ))}

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate uppercase">
                <span>Gamma Correction</span>
                <span>{settings.colorAdjust.gamma}</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={settings.colorAdjust.gamma}
                onChange={(e) => updateSettings('colorAdjust', { gamma: Number(e.target.value) })}
                className="w-full accent-primary"
              />
            </div>
          </div>
        )}

        {/* 6. BRIGHTNESS & CONTRAST */}
        {activeTool === 'brightnessContrast' && (
          <div className="space-y-4">
            {[
              { key: 'brightness', label: 'Brightness', min: -100, max: 100 },
              { key: 'contrast', label: 'Contrast', min: -100, max: 100 },
              { key: 'highlights', label: 'Highlights Correction', min: -100, max: 100 },
              { key: 'shadows', label: 'Shadows Correction', min: -100, max: 100 },
            ].map((slide) => (
              <div key={slide.key} className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold text-slate uppercase">
                  <span>{slide.label}</span>
                  <span>{slide.key === 'brightness' || slide.key === 'contrast' ? '' : ''}{(settings.brightnessContrast as any)[slide.key]}%</span>
                </div>
                <input
                  type="range"
                  min={slide.min}
                  max={slide.max}
                  value={(settings.brightnessContrast as any)[slide.key]}
                  onChange={(e) => updateSettings('brightnessContrast', { [slide.key]: Number(e.target.value) })}
                  className="w-full accent-primary"
                />
              </div>
            ))}
          </div>
        )}

        {/* 7. WATERMARK */}
        {activeTool === 'watermark' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate uppercase tracking-wider">Watermark Text</label>
              <input
                type="text"
                placeholder="© Copyright 2026"
                value={settings.watermark.text}
                onChange={(e) => updateSettings('watermark', { text: e.target.value })}
                className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm text-ink outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate uppercase tracking-wider">Font Size</label>
                <input
                  type="number"
                  min="8"
                  max="120"
                  value={settings.watermark.fontSize}
                  onChange={(e) => updateSettings('watermark', { fontSize: Number(e.target.value) })}
                  className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm text-ink font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate uppercase tracking-wider">Text Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.watermark.color}
                    onChange={(e) => updateSettings('watermark', { color: e.target.value })}
                    className="w-10 h-10 p-0 border-0 bg-transparent cursor-pointer rounded-lg overflow-hidden"
                  />
                  <input
                    type="text"
                    value={settings.watermark.color}
                    onChange={(e) => updateSettings('watermark', { color: e.target.value })}
                    className="flex-1 h-10 px-3 bg-background border border-border rounded-lg text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate uppercase tracking-wider">Font Family</label>
              <select
                value={settings.watermark.fontFamily}
                onChange={(e) => updateSettings('watermark', { fontFamily: e.target.value })}
                className="w-full h-10 px-3 bg-background border border-border rounded-lg text-xs"
              >
                {FONTS_LIST.map((font) => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate uppercase">
                <span>Opacity</span>
                <span>{settings.watermark.opacity}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={settings.watermark.opacity}
                onChange={(e) => updateSettings('watermark', { opacity: Number(e.target.value) })}
                className="w-full accent-primary"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate uppercase">
                <span>Rotation</span>
                <span>{settings.watermark.rotation}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                value={settings.watermark.rotation}
                onChange={(e) => updateSettings('watermark', { rotation: Number(e.target.value) })}
                className="w-full accent-primary"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={settings.watermark.repeat}
                onChange={(e) => updateSettings('watermark', { repeat: e.target.checked })}
                className="accent-primary"
              />
              <span className="text-xs font-semibold text-ink">Repeat Watermark Pattern</span>
            </label>

            {!settings.watermark.repeat && (
              <div className="space-y-3 pt-3 border-t border-border animate-in fade-in duration-200">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate uppercase tracking-wider">Position</label>
                  <select
                    value={settings.watermark.position}
                    onChange={(e) => updateSettings('watermark', { position: e.target.value as any })}
                    className="w-full h-10 px-3 bg-background border border-border rounded-lg text-xs"
                  >
                    <option value="topLeft">Top Left</option>
                    <option value="topRight">Top Right</option>
                    <option value="center">Center</option>
                    <option value="bottomLeft">Bottom Left</option>
                    <option value="bottomRight">Bottom Right</option>
                    <option value="custom">Custom Position</option>
                  </select>
                </div>

                {settings.watermark.position === 'custom' && (
                  <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-1">
                      <span className="block text-[10px] text-slate font-bold uppercase">X Pos ({settings.watermark.posX}%)</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.watermark.posX}
                        onChange={(e) => updateSettings('watermark', { posX: Number(e.target.value) })}
                        className="w-full accent-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="block text-[10px] text-slate font-bold uppercase">Y Pos ({settings.watermark.posY}%)</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.watermark.posY}
                        onChange={(e) => updateSettings('watermark', { posY: Number(e.target.value) })}
                        className="w-full accent-primary"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 8. ADD TEXT */}
        {activeTool === 'text' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate uppercase tracking-wider">Text Content</label>
              <textarea
                placeholder="Type overlay text here..."
                value={settings.text.content}
                onChange={(e) => updateSettings('text', { content: e.target.value })}
                className="w-full h-20 p-3 bg-background border border-border rounded-lg text-xs outline-none focus:border-primary resize-none font-sans"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate uppercase tracking-wider">Font Size</label>
                <input
                  type="number"
                  min="8"
                  max="150"
                  value={settings.text.fontSize}
                  onChange={(e) => updateSettings('text', { fontSize: Number(e.target.value) })}
                  className="w-full h-10 px-3 bg-background border border-border rounded-lg text-sm text-ink font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate uppercase tracking-wider">Font Family</label>
                <select
                  value={settings.text.fontFamily}
                  onChange={(e) => updateSettings('text', { fontFamily: e.target.value })}
                  className="w-full h-10 px-3 bg-background border border-border rounded-lg text-xs"
                >
                  {FONTS_LIST.map((font) => (
                    <option key={font} value={font}>{font}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => updateSettings('text', { bold: !settings.text.bold })}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg border text-center transition-all ${
                  settings.text.bold ? 'bg-primary/10 border-primary text-primary' : 'bg-background border-border text-slate'
                }`}
              >
                Bold
              </button>
              <button
                onClick={() => updateSettings('text', { italic: !settings.text.italic })}
                className={`flex-1 py-2 px-3 text-xs font-semibold italic rounded-lg border text-center transition-all ${
                  settings.text.italic ? 'bg-primary/10 border-primary text-primary' : 'bg-background border-border text-slate'
                }`}
              >
                Italic
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border pt-3">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate uppercase tracking-wider">Text Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.text.color}
                    onChange={(e) => updateSettings('text', { color: e.target.value })}
                    className="w-8 h-8 p-0 border-0 bg-transparent cursor-pointer rounded-lg overflow-hidden"
                  />
                  <input
                    type="text"
                    value={settings.text.color}
                    onChange={(e) => updateSettings('text', { color: e.target.value })}
                    className="flex-1 h-9 px-2 bg-background border border-border rounded-lg text-xs font-mono min-w-0"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate uppercase tracking-wider">Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.text.bgColor === 'transparent' ? '#ffffff' : settings.text.bgColor}
                    disabled={settings.text.bgColor === 'transparent'}
                    onChange={(e) => updateSettings('text', { bgColor: e.target.value })}
                    className="w-8 h-8 p-0 border-0 bg-transparent cursor-pointer rounded-lg overflow-hidden disabled:opacity-30"
                  />
                  <select
                    value={settings.text.bgColor === 'transparent' ? 'transparent' : 'color'}
                    onChange={(e) => {
                      const mode = e.target.value;
                      updateSettings('text', { bgColor: mode === 'transparent' ? 'transparent' : '#000000' });
                    }}
                    className="flex-1 h-9 px-2 bg-background border border-border rounded-lg text-xs"
                  >
                    <option value="transparent">None</option>
                    <option value="color">Solid</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate uppercase">
                <span>Opacity</span>
                <span>{settings.text.opacity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={settings.text.opacity}
                onChange={(e) => updateSettings('text', { opacity: Number(e.target.value) })}
                className="w-full accent-primary"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate uppercase">
                <span>Rotation</span>
                <span>{settings.text.rotation}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                value={settings.text.rotation}
                onChange={(e) => updateSettings('text', { rotation: Number(e.target.value) })}
                className="w-full accent-primary"
              />
            </div>

            <div className="space-y-3 pt-3 border-t border-border">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate uppercase tracking-wider">Position</label>
                <select
                  value={settings.text.position}
                  onChange={(e) => updateSettings('text', { position: e.target.value as any })}
                  className="w-full h-10 px-3 bg-background border border-border rounded-lg text-xs"
                >
                  <option value="topLeft">Top Left</option>
                  <option value="topRight">Top Right</option>
                  <option value="center">Center</option>
                  <option value="bottomLeft">Bottom Left</option>
                  <option value="bottomRight">Bottom Right</option>
                  <option value="custom">Custom Position</option>
                </select>
              </div>

              {settings.text.position === 'custom' && (
                <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="space-y-1">
                    <span className="block text-[10px] text-slate font-bold uppercase">X Pos ({settings.text.posX}%)</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.text.posX}
                      onChange={(e) => updateSettings('text', { posX: Number(e.target.value) })}
                      className="w-full accent-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="block text-[10px] text-slate font-bold uppercase">Y Pos ({settings.text.posY}%)</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={settings.text.posY}
                      onChange={(e) => updateSettings('text', { posY: Number(e.target.value) })}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 9. ADD LOGO */}
        {activeTool === 'logo' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate uppercase tracking-wider">Logo Image</label>
              
              {!logoFile ? (
                <div 
                  onClick={() => logoInputRef.current?.click()}
                  className="flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-slate bg-background p-5 rounded-lg text-center cursor-pointer transition-colors"
                >
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <Upload className="w-5 h-5 text-primary mb-1" />
                  <span className="text-[11px] text-slate">Upload logo file (PNG, JPG)</span>
                </div>
              ) : (
                <div className="p-3 bg-background border border-border rounded-lg flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="block text-[11px] font-semibold text-ink truncate max-w-[150px]">
                      {logoFile.name}
                    </span>
                  </div>
                  <button 
                    onClick={handleRemoveLogo}
                    className="text-red-500 text-xs font-semibold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}

              {logoError && (
                <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-600 rounded-lg text-[10px] flex gap-1.5 leading-relaxed">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{logoError}</span>
                </div>
              )}
            </div>

            {logoFile && (
              <div className="space-y-4 pt-3 border-t border-border animate-in fade-in duration-200">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate uppercase">
                    <span>Logo Size</span>
                    <span>{settings.logo.size}% width</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={settings.logo.size}
                    onChange={(e) => updateSettings('logo', { size: Number(e.target.value) })}
                    className="w-full accent-primary"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate uppercase">
                    <span>Opacity</span>
                    <span>{settings.logo.opacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={settings.logo.opacity}
                    onChange={(e) => updateSettings('logo', { opacity: Number(e.target.value) })}
                    className="w-full accent-primary"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-slate uppercase">
                    <span>Rotation</span>
                    <span>{settings.logo.rotation}°</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={settings.logo.rotation}
                    onChange={(e) => updateSettings('logo', { rotation: Number(e.target.value) })}
                    className="w-full accent-primary"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={settings.logo.lockAspect}
                    onChange={(e) => updateSettings('logo', { lockAspect: e.target.checked })}
                    className="accent-primary"
                  />
                  <span className="text-xs font-semibold text-ink">Maintain Aspect Ratio</span>
                </label>

                <div className="space-y-2 pt-2 border-t border-border">
                  <label className="block text-[11px] font-bold text-slate uppercase tracking-wider">Position</label>
                  <select
                    value={settings.logo.position}
                    onChange={(e) => updateSettings('logo', { position: e.target.value as any })}
                    className="w-full h-10 px-3 bg-background border border-border rounded-lg text-xs"
                  >
                    <option value="topLeft">Top Left</option>
                    <option value="topRight">Top Right</option>
                    <option value="center">Center</option>
                    <option value="bottomLeft">Bottom Left</option>
                    <option value="bottomRight">Bottom Right</option>
                    <option value="custom">Custom Position</option>
                  </select>
                </div>

                {settings.logo.position === 'custom' && (
                  <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-1">
                      <span className="block text-[10px] text-slate font-bold uppercase">X Pos ({settings.logo.posX}%)</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.logo.posX}
                        onChange={(e) => updateSettings('logo', { posX: Number(e.target.value) })}
                        className="w-full accent-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="block text-[10px] text-slate font-bold uppercase">Y Pos ({settings.logo.posY}%)</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.logo.posY}
                        onChange={(e) => updateSettings('logo', { posY: Number(e.target.value) })}
                        className="w-full accent-primary"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 10. BLACK & WHITE TO COLOR */}
        {activeTool === 'bwToColor' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate uppercase tracking-wider">Colorization Effect</label>
              <select
                value={settings.bwToColor.mode}
                onChange={(e) => updateSettings('bwToColor', { mode: e.target.value as any })}
                className="w-full h-10 px-3 bg-background border border-border rounded-lg text-xs text-ink outline-none focus:border-primary"
              >
                <option value="warm">Warm Tone (Amber Tint)</option>
                <option value="cool">Cool Tone (Cyan Tint)</option>
                <option value="sepia">Sepia (Classic Retro)</option>
                <option value="vintage">Vintage Hue</option>
                <option value="tint">Custom Color Tint</option>
              </select>
            </div>

            {settings.bwToColor.mode === 'tint' && (
              <div className="space-y-2 p-3 bg-background border border-border rounded-lg animate-in fade-in duration-200">
                <label className="block text-[10px] font-bold text-slate uppercase tracking-wider">Custom Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.bwToColor.tintColor}
                    onChange={(e) => updateSettings('bwToColor', { tintColor: e.target.value })}
                    className="w-10 h-10 p-0 border-0 bg-transparent cursor-pointer rounded-lg overflow-hidden"
                  />
                  <input
                    type="text"
                    value={settings.bwToColor.tintColor}
                    onChange={(e) => updateSettings('bwToColor', { tintColor: e.target.value })}
                    className="flex-1 h-10 px-3 bg-background border border-border rounded-lg text-xs font-mono"
                  />
                </div>
              </div>
            )}

            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg text-[11px] text-primary leading-relaxed flex gap-2">
              <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>True black-and-white photo colorization usually requires AI models. This browser-only tool applies color tint and tone effects locally.</span>
            </div>
          </div>
        )}

        {/* 11. COLOR TO BLACK & WHITE */}
        {activeTool === 'colorToBw' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate uppercase tracking-wider">Monochrome Filter</label>
              <select
                value={settings.colorToBw.mode}
                onChange={(e) => updateSettings('colorToBw', { mode: e.target.value as any })}
                className="w-full h-10 px-3 bg-background border border-border rounded-lg text-xs text-ink outline-none focus:border-primary"
              >
                <option value="grayscale">Standard Grayscale</option>
                <option value="high-contrast">High Contrast Monochrome</option>
                <option value="soft">Soft Grayscale</option>
                <option value="vintage">Vintage Warm Gray</option>
                <option value="custom">Custom Contrast Grayscale</option>
              </select>
            </div>

            {settings.colorToBw.mode === 'custom' && (
              <div className="space-y-1.5 p-3 bg-background border border-border rounded-lg animate-in fade-in duration-200">
                <div className="flex justify-between text-[10px] font-bold text-slate uppercase">
                  <span>Custom Contrast</span>
                  <span>{settings.colorToBw.contrast}%</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={settings.colorToBw.contrast}
                  onChange={(e) => updateSettings('colorToBw', { contrast: Number(e.target.value) })}
                  className="w-full accent-primary"
                />
              </div>
            )}
          </div>
        )}

        {/* 12. CROP */}
        {activeTool === 'crop' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <p className="text-xs text-slate leading-relaxed">
              Drag or resize the selection box directly on the image preview in the center. Click the <strong className="text-primary font-bold">Apply Edit Layer</strong> button below to confirm and perform the crop.
            </p>
          </div>
        )}

        {/* 13. RESIZE */}
        {activeTool === 'resize' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate uppercase tracking-wider mb-1">Width (px)</label>
                <input
                  type="number"
                  value={settings.resize.width || ''}
                  onChange={(e) => {
                    const w = parseInt(e.target.value) || 0;
                    let h = settings.resize.height;
                    if (settings.resize.lockAspect && originalWidth > 0) {
                      h = Math.round(w * (originalHeight / originalWidth));
                    }
                    updateSettings('resize', { width: w, height: h });
                  }}
                  className="w-full h-9 px-3 bg-background border border-border rounded-lg text-xs text-ink outline-none focus:border-primary font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate uppercase tracking-wider mb-1">Height (px)</label>
                <input
                  type="number"
                  value={settings.resize.height || ''}
                  onChange={(e) => {
                    const h = parseInt(e.target.value) || 0;
                    let w = settings.resize.width;
                    if (settings.resize.lockAspect && originalHeight > 0) {
                      w = Math.round(h * (originalWidth / originalHeight));
                    }
                    updateSettings('resize', { width: w, height: h });
                  }}
                  className="w-full h-9 px-3 bg-background border border-border rounded-lg text-xs text-ink outline-none focus:border-primary font-mono"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={settings.resize.lockAspect}
                onChange={(e) => updateSettings('resize', { lockAspect: e.target.checked })}
                className="accent-primary rounded"
              />
              <span className="text-[11px] text-slate">Lock aspect ratio</span>
            </label>
          </div>
        )}

        {/* 14. ROTATE */}
        {activeTool === 'rotate' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate uppercase tracking-wider">Quick Rotation</label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 text-[11px]" onClick={() => updateSettings('rotate', { angle: (settings.rotate.angle - 90 + 360) % 360 })}>
                  -90°
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-[11px]" onClick={() => updateSettings('rotate', { angle: (settings.rotate.angle + 90) % 360 })}>
                  +90°
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-[11px]" onClick={() => updateSettings('rotate', { angle: 180 })}>
                  180°
                </Button>
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-border">
              <div className="flex justify-between text-[11px] font-bold text-slate uppercase">
                <span>Custom Angle</span>
                <span>{settings.rotate.angle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="359"
                value={settings.rotate.angle}
                onChange={(e) => updateSettings('rotate', { angle: Number(e.target.value) })}
                className="w-full accent-primary"
              />
            </div>
          </div>
        )}

        {/* 15. FLIP */}
        {activeTool === 'flip' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-slate uppercase tracking-wider">Mirror Direction</label>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={settings.flip.horizontal ? "primary" : "outline"} 
                  size="sm" 
                  className="text-[11px]"
                  onClick={() => updateSettings('flip', { horizontal: !settings.flip.horizontal })}
                >
                  Flip Horizontal
                </Button>
                <Button 
                  variant={settings.flip.vertical ? "primary" : "outline"} 
                  size="sm" 
                  className="text-[11px]"
                  onClick={() => updateSettings('flip', { vertical: !settings.flip.vertical })}
                >
                  Flip Vertical
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 16. BLUR */}
        {activeTool === 'blur' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-slate uppercase">
                <span>Gaussian Blur</span>
                <span>{settings.blur.strength}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={settings.blur.strength}
                onChange={(e) => updateSettings('blur', { strength: Number(e.target.value) })}
                className="w-full accent-primary"
              />
            </div>
          </div>
        )}

        {/* 17. PIXELATE */}
        {activeTool === 'pixelate' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold text-slate uppercase">
                <span>Pixel Size</span>
                <span>{settings.pixelate.size}px</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={settings.pixelate.size}
                onChange={(e) => updateSettings('pixelate', { size: Number(e.target.value) })}
                className="w-full accent-primary"
              />
            </div>
          </div>
        )}

        {/* 18. GRAYSCALE */}
        {activeTool === 'grayscale' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <label className="flex items-center justify-between p-3 bg-background border border-border rounded-lg cursor-pointer select-none">
              <span className="text-xs font-semibold text-ink">Grayscale Mode</span>
              <input
                type="checkbox"
                checked={settings.grayscale.enabled}
                onChange={(e) => updateSettings('grayscale', { enabled: e.target.checked })}
                className="accent-primary"
              />
            </label>
          </div>
        )}

      </div>
    </div>
  );
}
