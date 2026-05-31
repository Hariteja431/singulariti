export type EditorToolId =
  | 'crop'
  | 'resize'
  | 'rotate'
  | 'flip'
  | 'blur'
  | 'pixelate'
  | 'grayscale'
  | 'upscaler'
  | 'enhancer'
  | 'sharpen'
  | 'denoiser'
  | 'colorAdjust'
  | 'brightnessContrast'
  | 'watermark'
  | 'text'
  | 'logo'
  | 'bwToColor'
  | 'colorToBw';

export interface CropSettings {
  x: number;
  y: number;
  width: number;
  height: number;
  unit: 'px' | '%';
}

export interface ResizeSettings {
  width: number;
  height: number;
  lockAspect: boolean;
}

export interface RotateSettings {
  angle: number; // 0 to 359
}

export interface FlipSettings {
  horizontal: boolean;
  vertical: boolean;
}

export interface BlurSettings {
  strength: number; // 0 to 100
}

export interface PixelateSettings {
  size: number; // 1 to 100
}

export interface GrayscaleSettings {
  enabled: boolean;
}

export interface UpscalerSettings {
  scale: '1x' | '2x' | '3x' | '4x' | 'custom';
  width: number;
  height: number;
  lockAspect: boolean;
  quality: 'low' | 'medium' | 'high';
}

export interface EnhancerSettings {
  auto: boolean;
  color: boolean;
  clarity: boolean;
  exposure: boolean;
  saturation: boolean;
}

export interface SharpenSettings {
  strength: number; // 0 to 100
}

export interface DenoiserSettings {
  strength: number; // 0 to 100
}

export interface ColorAdjustSettings {
  saturation: number; // -100 to 100
  hue: number; // -180 to 180
  vibrance: number; // -100 to 100
  temperature: number; // -100 to 100
  tint: number; // -100 to 100
  exposure: number; // -100 to 100
  gamma: number; // 0.1 to 3.0 (default 1.0)
}

export interface BrightnessContrastSettings {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  highlights: number; // -100 to 100
  shadows: number; // -100 to 100
}

export interface WatermarkSettings {
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  opacity: number; // 0 to 100
  rotation: number; // -180 to 180
  position: 'topLeft' | 'topRight' | 'center' | 'bottomLeft' | 'bottomRight' | 'custom';
  posX: number;
  posY: number;
  repeat: boolean;
}

export interface TextSettings {
  content: string;
  fontSize: number;
  fontFamily: string;
  bold: boolean;
  italic: boolean;
  color: string;
  bgColor: string;
  opacity: number; // 0 to 100
  rotation: number; // -180 to 180
  position: 'topLeft' | 'topRight' | 'center' | 'bottomLeft' | 'bottomRight' | 'custom';
  posX: number;
  posY: number;
}

export interface LogoSettings {
  url: string | null;
  size: number;
  opacity: number;
  rotation: number;
  position: 'topLeft' | 'topRight' | 'center' | 'bottomLeft' | 'bottomRight' | 'custom';
  posX: number;
  posY: number;
  lockAspect: boolean;
}

export interface BwToColorSettings {
  mode: 'warm' | 'cool' | 'sepia' | 'vintage' | 'tint';
  tintColor: string;
}

export interface ColorToBwSettings {
  mode: 'grayscale' | 'high-contrast' | 'soft' | 'vintage' | 'custom';
  contrast: number; // -100 to 100 (for custom mode)
}

export interface EditorSettings {
  crop: CropSettings;
  resize: ResizeSettings;
  rotate: RotateSettings;
  flip: FlipSettings;
  blur: BlurSettings;
  pixelate: PixelateSettings;
  grayscale: GrayscaleSettings;
  upscaler: UpscalerSettings;
  enhancer: EnhancerSettings;
  sharpen: SharpenSettings;
  denoiser: DenoiserSettings;
  colorAdjust: ColorAdjustSettings;
  brightnessContrast: BrightnessContrastSettings;
  watermark: WatermarkSettings;
  text: TextSettings;
  logo: LogoSettings;
  bwToColor: BwToColorSettings;
  colorToBw: ColorToBwSettings;
}

export interface HistoryState {
  imageDataUrl: string;
  activeTool: EditorToolId;
  settings: EditorSettings;
  logoFile: File | null;
}

export interface ImageState {
  file: File | null;
  url: string | null;
  width: number;
  height: number;
}
