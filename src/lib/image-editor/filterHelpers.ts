export function sharpenImageData(imageData: ImageData, strength: number): ImageData {
  const w = imageData.width;
  const h = imageData.height;
  const src = imageData.data;
  
  const factor = strength / 100;
  if (factor === 0) return imageData;
  
  const dst = new Uint8ClampedArray(src.length);
  
  const centerWeight = 1 + 4 * factor;
  const edgeWeight = -factor;
  
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      
      if (y === 0 || y === h - 1 || x === 0 || x === w - 1) {
        dst[idx] = src[idx];
        dst[idx+1] = src[idx+1];
        dst[idx+2] = src[idx+2];
        dst[idx+3] = src[idx+3];
        continue;
      }
      
      for (let c = 0; c < 3; c++) {
        const val = src[idx + c] * centerWeight +
                    (src[((y - 1) * w + x) * 4 + c] +
                     src[((y + 1) * w + x) * 4 + c] +
                     src[(y * w + (x - 1)) * 4 + c] +
                     src[(y * w + (x + 1)) * 4 + c]) * edgeWeight;
        dst[idx + c] = Math.min(255, Math.max(0, val));
      }
      dst[idx + 3] = src[idx + 3];
    }
  }
  
  src.set(dst);
  return imageData;
}

export function denoiseImageData(imageData: ImageData, strength: number): ImageData {
  const w = imageData.width;
  const h = imageData.height;
  const src = imageData.data;
  
  const factor = strength / 100;
  if (factor === 0) return imageData;
  
  const dst = new Uint8ClampedArray(src.length);
  const radius = Math.max(1, Math.round(factor * 2));
  
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      
      let sumR = 0, sumG = 0, sumB = 0, count = 0;
      
      for (let ky = -radius; ky <= radius; ky++) {
        const ny = y + ky;
        if (ny < 0 || ny >= h) continue;
        
        for (let kx = -radius; kx <= radius; kx++) {
          const nx = x + kx;
          if (nx < 0 || nx >= w) continue;
          
          const nidx = (ny * w + nx) * 4;
          sumR += src[nidx];
          sumG += src[nidx+1];
          sumB += src[nidx+2];
          count++;
        }
      }
      
      const blend = factor * 0.7;
      dst[idx] = Math.round(src[idx] * (1 - blend) + (sumR / count) * blend);
      dst[idx+1] = Math.round(src[idx+1] * (1 - blend) + (sumG / count) * blend);
      dst[idx+2] = Math.round(src[idx+2] * (1 - blend) + (sumB / count) * blend);
      dst[idx+3] = src[idx+3];
    }
  }
  
  src.set(dst);
  return imageData;
}

export function enhanceImageData(
  imageData: ImageData, 
  settings: { color: boolean; clarity: boolean; exposure: boolean; saturation: boolean }
): ImageData {
  const src = imageData.data;
  
  for (let i = 0; i < src.length; i += 4) {
    let r = src[i];
    let g = src[i+1];
    let b = src[i+2];
    
    // Saturation boost
    if (settings.saturation || settings.color) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = gray + (r - gray) * 1.3;
      g = gray + (g - gray) * 1.3;
      b = gray + (b - gray) * 1.3;
    }
    
    // Contrast/Exposure boost
    if (settings.exposure) {
      r = 128 + (r - 128) * 1.12;
      g = 128 + (g - 128) * 1.12;
      b = 128 + (b - 128) * 1.12;
      
      r += 8;
      g += 8;
      b += 8;
    }
    
    // Clarity / S-curve boost
    if (settings.clarity) {
      const sCurve = (val: number) => {
        const norm = val / 255;
        const res = norm < 0.5 ? 2 * norm * norm : 1 - 2 * (1 - norm) * (1 - norm);
        return res * 255;
      };
      r = r * 0.75 + sCurve(r) * 0.25;
      g = g * 0.75 + sCurve(g) * 0.25;
      b = b * 0.75 + sCurve(b) * 0.25;
    }
    
    src[i] = Math.min(255, Math.max(0, r));
    src[i+1] = Math.min(255, Math.max(0, g));
    src[i+2] = Math.min(255, Math.max(0, b));
  }
  
  return imageData;
}

export function bwToColorTone(
  imageData: ImageData, 
  mode: 'warm' | 'cool' | 'sepia' | 'vintage' | 'tint',
  tintColor: string
): ImageData {
  const src = imageData.data;
  
  let tintR = 100, tintG = 100, tintB = 100;
  if (mode === 'tint' && tintColor) {
    try {
      const hex = tintColor.replace('#', '');
      tintR = parseInt(hex.substring(0, 2), 16) || 100;
      tintG = parseInt(hex.substring(2, 4), 16) || 100;
      tintB = parseInt(hex.substring(4, 6), 16) || 100;
    } catch {}
  }
  
  for (let i = 0; i < src.length; i += 4) {
    const r = src[i];
    const g = src[i+1];
    const b = src[i+2];
    
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
    
    let outR = gray;
    let outG = gray;
    let outB = gray;
    
    if (mode === 'sepia') {
      outR = gray * 0.95 + 40;
      outG = gray * 0.90 + 20;
      outB = gray * 0.80;
    } else if (mode === 'warm') {
      outR = gray * 1.06 + 12;
      outG = gray * 1.01 + 4;
      outB = gray * 0.88 - 8;
    } else if (mode === 'cool') {
      outR = gray * 0.88 - 8;
      outG = gray * 0.98;
      outB = gray * 1.08 + 12;
    } else if (mode === 'vintage') {
      outR = gray * 0.94 + 25;
      outG = gray * 0.94 + 10;
      outB = gray * 0.84 + 18;
    } else if (mode === 'tint') {
      outR = (gray / 255) * tintR;
      outG = (gray / 255) * tintG;
      outB = (gray / 255) * tintB;
    }
    
    src[i] = Math.min(255, Math.max(0, outR));
    src[i+1] = Math.min(255, Math.max(0, outG));
    src[i+2] = Math.min(255, Math.max(0, outB));
  }
  
  return imageData;
}

export function colorToBw(
  imageData: ImageData, 
  mode: 'grayscale' | 'high-contrast' | 'soft' | 'vintage' | 'custom',
  customContrast: number
): ImageData {
  const src = imageData.data;
  
  let contrastFactor = 1.0;
  if (mode === 'high-contrast') contrastFactor = 1.6;
  if (mode === 'soft') contrastFactor = 0.75;
  if (mode === 'custom') {
    contrastFactor = customContrast >= 0 
      ? 1.0 + (customContrast / 100) * 1.8 
      : 1.0 + (customContrast / 100) * 0.85;
  }
  
  for (let i = 0; i < src.length; i += 4) {
    const r = src[i];
    const g = src[i+1];
    const b = src[i+2];
    
    let gray = 0.299 * r + 0.587 * g + 0.114 * b;
    
    // Contrast Adjustment
    gray = 128 + (gray - 128) * contrastFactor;
    
    if (mode === 'vintage') {
      src[i] = Math.min(255, Math.max(0, gray * 0.94 + 12));
      src[i+1] = Math.min(255, Math.max(0, gray * 0.94 + 8));
      src[i+2] = Math.min(255, Math.max(0, gray * 0.88));
    } else {
      const finalGray = Math.min(255, Math.max(0, gray));
      src[i] = finalGray;
      src[i+1] = finalGray;
      src[i+2] = finalGray;
    }
  }
  
  return imageData;
}
