import React from 'react';
import { ImageEditorClient } from '@/components/tools/image-editor/ImageEditorClient';

export const metadata = {
  title: 'Image Editor Tools — Edit & Adjust Images Online | Singularity',
  description: 'Free online browser-based image editor. Upscale, sharpen, denoise, enhance, adjust brightness, and overlay watermarks locally without uploading.',
};

export default function ImageEditorPage() {
  return <ImageEditorClient />;
}
