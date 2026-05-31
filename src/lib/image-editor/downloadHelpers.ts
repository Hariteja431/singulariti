export interface DownloadSettings {
  fileName: string;
  format: 'image/png' | 'image/jpeg' | 'image/webp';
  quality: number; // 0 to 100
}

/**
 * Triggers the browser download of a canvas element as an image file.
 */
export async function downloadCanvasAsImage(
  canvas: HTMLCanvasElement,
  settings: DownloadSettings
): Promise<void> {
  const mimeType = settings.format;
  const quality = settings.quality / 100;

  let ext = 'png';
  if (mimeType === 'image/jpeg') ext = 'jpg';
  if (mimeType === 'image/webp') ext = 'webp';

  // Get file name without extension, then append new extension
  let cleanName = settings.fileName || 'edited_image';
  cleanName = cleanName.replace(/\.[^/.]+$/, ''); // Strip current extension

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to generate image file.'));
          return;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${cleanName}.${ext}`;
        
        // Trigger click event
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        resolve();
      },
      mimeType,
      mimeType === 'image/png' ? undefined : quality
    );
  });
}
