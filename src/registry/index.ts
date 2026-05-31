import { EcosystemRegistry } from './types';

export const registry: EcosystemRegistry = {
  categories: [
    {
      id: 'image',
      name: 'Image Tools',
      description: 'Free online image tools to compress, convert, and edit images entirely in your browser.',
      seoTitle: 'Image Tools — Free Image Tools Online | Singulariti',
      seoDescription: 'A complete collection of free online image tools. Compress, convert, and resize images without uploading them to any server.',
      path: '/image',
      collections: [
        {
          id: 'compression',
          name: 'Compression Tools',
          description: 'Reduce image file sizes without losing quality. Works instantly in your browser.',
          seoTitle: 'Image Compression Tools — Compress Images Online Free | Singulariti',
          seoDescription: 'Free image compression tools. Compress JPG, PNG, and WebP images quickly and securely in your browser.',
          path: '/image/compression',
          tools: [
            {
              id: 'image-compressor',
              name: 'Image Compressor',
              description: 'Reduce image file size while keeping quality. Free, secure, no upload to server.',
              seoTitle: 'Image Compressor — Compress Images Online Free | singulariti.in',
              seoDescription: 'Compress images online for free. Reduce file size up to 90% while maintaining quality.',
              engine: 'compression',
              path: '/image/compression/image-compressor',
            },
            {
              id: 'jpg-compressor',
              name: 'JPG Compressor',
              description: 'Reduce JPG file size while keeping quality. Free, secure, no upload to server.',
              seoTitle: 'JPG Compressor — Compress JPG Online Free | singulariti.in',
              seoDescription: 'Compress JPG files online for free. Reduce file size up to 90% while maintaining quality.',
              engine: 'compression',
              path: '/image/compression/jpg-compressor',
            },
            {
              id: 'jpeg-compressor',
              name: 'JPEG Compressor',
              description: 'Reduce JPEG file size while keeping quality. Free, secure, no upload to server.',
              seoTitle: 'JPEG Compressor — Compress JPEG Online Free | singulariti.in',
              seoDescription: 'Compress JPEG files online for free. Reduce file size up to 90% while maintaining quality.',
              engine: 'compression',
              path: '/image/compression/jpeg-compressor',
            },
            {
              id: 'png-compressor',
              name: 'PNG Compressor',
              description: 'Reduce PNG file size while keeping quality. Free, secure, no upload to server.',
              seoTitle: 'PNG Compressor — Compress PNG Online Free | singulariti.in',
              seoDescription: 'Compress PNG files online for free. Reduce file size up to 90% while maintaining quality.',
              engine: 'compression',
              path: '/image/compression/png-compressor',
            },
            {
              id: 'webp-compressor',
              name: 'WebP Compressor',
              description: 'Reduce WebP file size while keeping quality. Free, secure, no upload to server.',
              seoTitle: 'WebP Compressor — Compress WebP Online Free | singulariti.in',
              seoDescription: 'Compress WebP files online for free. Reduce file size up to 90% while maintaining quality.',
              engine: 'compression',
              path: '/image/compression/webp-compressor',
            }
          ]
        },
        {
          id: 'conversion',
          name: 'Conversion Tools',
          description: 'Convert images between different formats instantly and securely.',
          seoTitle: 'Image Conversion Tools — Convert Images Online Free | Singulariti',
          seoDescription: 'Free image conversion tools. Convert between JPG, PNG, and WebP instantly in your browser.',
          path: '/image/conversion',
          tools: [
            {
              id: 'jpg-to-png',
              name: 'JPG to PNG',
              description: 'Convert JPG images to PNG format with transparency support. Free, secure, no upload to server.',
              seoTitle: 'JPG to PNG — Convert JPG to PNG Online Free | singulariti.in',
              seoDescription: 'Convert JPG images to PNG online for free. Fast, secure, and entirely in your browser.',
              engine: 'conversion',
              path: '/image/conversion/jpg-to-png',
              options: { from: 'image/jpeg', to: 'image/png' }
            },
            {
              id: 'png-to-jpg',
              name: 'PNG to JPG',
              description: 'Convert PNG images to JPG format. Free, secure, no upload to server.',
              seoTitle: 'PNG to JPG — Convert PNG to JPG Online Free | singulariti.in',
              seoDescription: 'Convert PNG images to JPG online for free. Fast, secure, and entirely in your browser.',
              engine: 'conversion',
              path: '/image/conversion/png-to-jpg',
              options: { from: 'image/png', to: 'image/jpeg' }
            },
            {
              id: 'jpg-to-webp',
              name: 'JPG to WebP',
              description: 'Convert JPG images to WebP format for better compression. Free, secure, no upload to server.',
              seoTitle: 'JPG to WebP — Convert JPG to WebP Online Free | singulariti.in',
              seoDescription: 'Convert JPG images to WebP online for free. Fast, secure, and entirely in your browser.',
              engine: 'conversion',
              path: '/image/conversion/jpg-to-webp',
              options: { from: 'image/jpeg', to: 'image/webp' }
            },
            {
              id: 'png-to-webp',
              name: 'PNG to WebP',
              description: 'Convert PNG images to WebP format for better compression. Free, secure, no upload to server.',
              seoTitle: 'PNG to WebP — Convert PNG to WebP Online Free | singulariti.in',
              seoDescription: 'Convert PNG images to WebP online for free. Fast, secure, and entirely in your browser.',
              engine: 'conversion',
              path: '/image/conversion/png-to-webp',
              options: { from: 'image/png', to: 'image/webp' }
            },
            {
              id: 'webp-to-jpg',
              name: 'WebP to JPG',
              description: 'Convert WebP images to JPG format. Free, secure, no upload to server.',
              seoTitle: 'WebP to JPG — Convert WebP to JPG Online Free | singulariti.in',
              seoDescription: 'Convert WebP images to JPG online for free. Fast, secure, and entirely in your browser.',
              engine: 'conversion',
              path: '/image/conversion/webp-to-jpg',
              options: { from: 'image/webp', to: 'image/jpeg' }
            },
            {
              id: 'webp-to-png',
              name: 'WebP to PNG',
              description: 'Convert WebP images to PNG format. Free, secure, no upload to server.',
              seoTitle: 'WebP to PNG — Convert WebP to PNG Online Free | singulariti.in',
              seoDescription: 'Convert WebP images to PNG online for free. Fast, secure, and entirely in your browser.',
              engine: 'conversion',
              path: '/image/conversion/webp-to-png',
              options: { from: 'image/webp', to: 'image/png' }
            },
            {
              id: 'jpg-to-jpeg',
              name: 'JPG to JPEG',
              description: 'Convert JPG images to JPEG format. Free, secure, no upload to server.',
              seoTitle: 'JPG to JPEG — Convert JPG to JPEG Online Free | singulariti.in',
              seoDescription: 'Convert JPG images to JPEG online for free. Fast, secure, and entirely in your browser.',
              engine: 'conversion',
              path: '/image/conversion/jpg-to-jpeg',
              options: { from: 'image/jpeg', to: 'image/jpeg' }
            },
            {
              id: 'jpeg-to-jpg',
              name: 'JPEG to JPG',
              description: 'Convert JPEG images to JPG format. Free, secure, no upload to server.',
              seoTitle: 'JPEG to JPG — Convert JPEG to JPG Online Free | singulariti.in',
              seoDescription: 'Convert JPEG images to JPG online for free. Fast, secure, and entirely in your browser.',
              engine: 'conversion',
              path: '/image/conversion/jpeg-to-jpg',
              options: { from: 'image/jpeg', to: 'image/jpeg' }
            }
          ]
        },
        {
          id: 'editing',
          name: 'Editing Tools',
          description: 'Edit, resize, crop, and apply filters to images instantly.',
          seoTitle: 'Image Editing Tools — Edit Images Online Free | Singulariti',
          seoDescription: 'Free online image editing tools. Resize, crop, rotate, flip, and apply filters to your images directly in the browser.',
          path: '/image/editing',
          tools: [
            {
              id: 'image-resizer',
              name: 'Image Resizer',
              description: 'Resize images to exact pixel dimensions. Free, secure, no upload to server.',
              seoTitle: 'Image Resizer — Resize Images Online Free | singulariti.in',
              seoDescription: 'Resize images online for free. Set custom width and height while maintaining aspect ratio.',
              engine: 'editing',
              path: '/image/editing/image-resizer',
              options: { action: 'resize' }
            },
            {
              id: 'image-cropper',
              name: 'Image Cropper',
              description: 'Crop images easily. Free, secure, no upload to server.',
              seoTitle: 'Image Cropper — Crop Images Online Free | singulariti.in',
              seoDescription: 'Crop images online for free. Adjust bounding box to cut out unwanted parts of an image.',
              engine: 'editing',
              path: '/image/editing/image-cropper',
              options: { action: 'crop' }
            },
            {
              id: 'rotate-image',
              name: 'Rotate Image',
              description: 'Rotate images by degrees. Free, secure, no upload to server.',
              seoTitle: 'Rotate Image — Rotate Images Online Free | singulariti.in',
              seoDescription: 'Rotate images online for free. Rotate 90, 180, 270 degrees or any custom angle.',
              engine: 'editing',
              path: '/image/editing/rotate-image',
              options: { action: 'rotate' }
            },
            {
              id: 'flip-image',
              name: 'Flip Image',
              description: 'Flip images horizontally or vertically. Free, secure, no upload to server.',
              seoTitle: 'Flip Image — Mirror Images Online Free | singulariti.in',
              seoDescription: 'Flip and mirror images online for free. Instantly flip pictures horizontally or vertically.',
              engine: 'editing',
              path: '/image/editing/flip-image',
              options: { action: 'flip' }
            },
            {
              id: 'blur-image',
              name: 'Blur Image',
              description: 'Apply blur filters to images. Free, secure, no upload to server.',
              seoTitle: 'Blur Image — Add Blur Effect Online Free | singulariti.in',
              seoDescription: 'Blur images online for free. Add customizable blur filters instantly in your browser.',
              engine: 'editing',
              path: '/image/editing/blur-image',
              options: { action: 'blur' }
            },
            {
              id: 'pixelate-image',
              name: 'Pixelate Image',
              description: 'Censor or pixelate parts of an image. Free, secure, no upload to server.',
              seoTitle: 'Pixelate Image — Pixelate Effect Online Free | singulariti.in',
              seoDescription: 'Pixelate images online for free. Add pixelated effects instantly in your browser.',
              engine: 'editing',
              path: '/image/editing/pixelate-image',
              options: { action: 'pixelate' }
            },
            {
              id: 'grayscale-image',
              name: 'Grayscale Image',
              description: 'Convert images to black and white grayscale. Free, secure, no upload to server.',
              seoTitle: 'Grayscale Image — Black and White Filter Online Free | singulariti.in',
              seoDescription: 'Convert images to grayscale online for free. Instantly apply black and white filters.',
              engine: 'editing',
              path: '/image/editing/grayscale-image',
              options: { action: 'grayscale' }
            }
          ]
        },
        {
          id: 'utility',
          name: 'Utility Tools',
          description: 'Extract metadata, colors, and analyze image dimensions.',
          seoTitle: 'Image Utility Tools — Analyze Images Online Free | Singulariti',
          seoDescription: 'Free online image utilities. Extract color palettes, pick colors, check dimensions, and view EXIF metadata.',
          path: '/image/utility',
          tools: [
            {
              id: 'image-metadata-viewer',
              name: 'Image Metadata Viewer',
              description: 'View EXIF and file metadata from an image. Free, secure, no upload to server.',
              seoTitle: 'Image Metadata Viewer — View EXIF Data Online Free | singulariti.in',
              seoDescription: 'View image EXIF data online for free. Extract camera metadata, dates, and file properties.',
              engine: 'utility',
              path: '/image/utility/image-metadata-viewer',
              options: { action: 'metadata' }
            },
            {
              id: 'image-dimension-checker',
              name: 'Image Dimension Checker',
              description: 'Instantly check exact width, height, and aspect ratio of an image.',
              seoTitle: 'Image Dimension Checker — Check Image Size Online Free | singulariti.in',
              seoDescription: 'Check image dimensions online for free. Quickly find the exact pixel width, height, and ratio.',
              engine: 'utility',
              path: '/image/utility/image-dimension-checker',
              options: { action: 'dimension' }
            },
            {
              id: 'image-format-detector',
              name: 'Image Format Detector',
              description: 'Detect the true MIME type and format of an image file.',
              seoTitle: 'Image Format Detector — Detect Image Type Online Free | singulariti.in',
              seoDescription: 'Detect true image format online. Analyzes file headers to determine the exact MIME type.',
              engine: 'utility',
              path: '/image/utility/image-format-detector',
              options: { action: 'format' }
            },
            {
              id: 'color-picker-from-image',
              name: 'Color Picker From Image',
              description: 'Click anywhere on an image to extract precise HEX and RGB colors.',
              seoTitle: 'Color Picker From Image — Pick Colors Online Free | singulariti.in',
              seoDescription: 'Pick colors from images online. Click on any pixel to instantly get HEX, RGB, and HSL codes.',
              engine: 'utility',
              path: '/image/utility/color-picker-from-image',
              options: { action: 'colorpicker' }
            },
            {
              id: 'image-color-palette-extractor',
              name: 'Image Color Palette Extractor',
              description: 'Automatically extract the dominant color palette from any image.',
              seoTitle: 'Image Color Palette Extractor — Extract Colors Online Free | singulariti.in',
              seoDescription: 'Extract color palettes from images online. Find dominant HEX colors for design inspiration.',
              engine: 'utility',
              path: '/image/utility/image-color-palette-extractor',
              options: { action: 'palette' }
            }
          ]
        },
        {
          id: 'developer',
          name: 'Developer Tools',
          description: 'Convert between base64 strings and image files.',
          seoTitle: 'Image Developer Tools — Base64 Converters Online Free | Singulariti',
          seoDescription: 'Free online image developer tools. Convert images to Base64 strings and vice versa securely.',
          path: '/image/developer',
          tools: [
            {
              id: 'image-to-base64',
              name: 'Image to Base64',
              description: 'Convert image files to Base64 strings for CSS and HTML embedding.',
              seoTitle: 'Image to Base64 — Convert Image to Base64 String Online Free | singulariti.in',
              seoDescription: 'Convert images to Base64 strings online for free. Instantly generate data URIs for web development.',
              engine: 'developer',
              path: '/image/developer/image-to-base64',
              options: { action: 'tobase64' }
            },
            {
              id: 'base64-to-image',
              name: 'Base64 to Image',
              description: 'Convert Base64 data URI strings back into downloadable image files.',
              seoTitle: 'Base64 to Image — Convert Base64 to Image Online Free | singulariti.in',
              seoDescription: 'Convert Base64 strings to images online for free. Instantly decode and download Base64 data URIs.',
              engine: 'developer',
              path: '/image/developer/base64-to-image',
              options: { action: 'frombase64' }
            }
          ]
        }
      ]
    }
  ]
};

// Helper methods for easy lookup

export function getCategoryById(id: string) {
  return registry.categories.find(c => c.id === id);
}

export function getCollectionByPath(categoryPath: string, collectionId: string) {
  const category = getCategoryById(categoryPath.replace('/', ''));
  return category?.collections.find(c => c.id === collectionId);
}

export function getToolByPath(categoryPath: string, collectionId: string, toolId: string) {
  const collection = getCollectionByPath(categoryPath, collectionId);
  return collection?.tools.find(t => t.id === toolId);
}

export function getAllTools() {
  return registry.categories.flatMap(category => 
    category.collections.flatMap(collection => collection.tools)
  );
}
