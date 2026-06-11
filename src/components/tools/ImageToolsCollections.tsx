import React from 'react';
import Link from 'next/link';
import { 
  Minimize2, 
  RefreshCw, 
  Info, 
  Code2, 
  ImageDown, 
  ArrowRightLeft, 
  Search, 
  Ruler, 
  ScanSearch, 
  Pipette, 
  Palette, 
  Binary 
} from 'lucide-react';

export type ToolCardItem = {
  name: string;
  description: string;
  href: string;
  icon?: React.ElementType;
};

export type ToolCollection = {
  title: string;
  description: string;
  href: string;
  icon: React.ElementType;
  blogHref?: string;
  tools: ToolCardItem[];
};

const imageCollections: ToolCollection[] = [
  {
    title: 'Compression Tools',
    description: 'Reduce image file sizes for upload, sharing, and storage while keeping the result easy to use.',
    href: '/image/compression',
    icon: Minimize2,
    blogHref: '/blog/image-tools',
    tools: [
      {
        name: 'Image Compressor',
        description: 'Reduce image file size for upload, sharing, and storage.',
        href: '/image/compression/image-compressor',
        icon: ImageDown,
      },
      {
        name: 'JPG Compressor',
        description: 'Compress JPG images while keeping them clear enough to use.',
        href: '/image/compression/jpg-compressor',
        icon: ImageDown,
      },
      {
        name: 'JPEG Compressor',
        description: 'Reduce JPEG image size for forms, websites, and sharing.',
        href: '/image/compression/jpeg-compressor',
        icon: ImageDown,
      },
      {
        name: 'PNG Compressor',
        description: 'Compress PNG files while keeping important image details.',
        href: '/image/compression/png-compressor',
        icon: ImageDown,
      },
      {
        name: 'WebP Compressor',
        description: 'Reduce WebP file size for faster web and app usage.',
        href: '/image/compression/webp-compressor',
        icon: ImageDown,
      },
      {
        name: 'SVG Compressor',
        description: 'Minify SVG files by reducing unnecessary code and data.',
        href: '/image/compression/svg-compressor',
        icon: ImageDown,
      },
    ],
  },
  {
    title: 'Conversion Tools',
    description: 'Convert images between common formats for websites, documents, sharing, and editing workflows.',
    href: '/image/conversion',
    icon: RefreshCw,
    blogHref: '/blog/image-tools',
    tools: [
      {
        name: 'JPG to PNG',
        description: 'Convert JPG images into PNG format when you need a different output type.',
        href: '/image/conversion/jpg-to-png',
        icon: ArrowRightLeft,
      },
      {
        name: 'PNG to JPG',
        description: 'Convert PNG images into JPG format for smaller and shareable files.',
        href: '/image/conversion/png-to-jpg',
        icon: ArrowRightLeft,
      },
      {
        name: 'JPG to WebP',
        description: 'Convert JPG images into WebP for modern web optimization.',
        href: '/image/conversion/jpg-to-webp',
        icon: ArrowRightLeft,
      },
      {
        name: 'PNG to WebP',
        description: 'Convert PNG images into WebP for better web-friendly compression.',
        href: '/image/conversion/png-to-webp',
        icon: ArrowRightLeft,
      },
      {
        name: 'WebP to JPG',
        description: 'Convert WebP images into JPG for wider compatibility.',
        href: '/image/conversion/webp-to-jpg',
        icon: ArrowRightLeft,
      },
      {
        name: 'WebP to PNG',
        description: 'Convert WebP images into PNG for editing and transparent workflows.',
        href: '/image/conversion/webp-to-png',
        icon: ArrowRightLeft,
      },
      {
        name: 'JPG to JPEG',
        description: 'Convert JPG files into JPEG format for naming or compatibility needs.',
        href: '/image/conversion/jpg-to-jpeg',
        icon: ArrowRightLeft,
      },
      {
        name: 'JPEG to JPG',
        description: 'Convert JPEG files into JPG format for simpler file naming.',
        href: '/image/conversion/jpeg-to-jpg',
        icon: ArrowRightLeft,
      },
      {
        name: 'SVG to PNG',
        description: 'Convert SVG vector graphics into PNG image files.',
        href: '/image/conversion/svg-to-png',
        icon: ArrowRightLeft,
      },
      {
        name: 'SVG to JPG',
        description: 'Convert SVG graphics into JPG format for sharing or previews.',
        href: '/image/conversion/svg-to-jpg',
        icon: ArrowRightLeft,
      },
      {
        name: 'SVG to WebP',
        description: 'Convert SVG graphics into WebP for modern web usage.',
        href: '/image/conversion/svg-to-webp',
        icon: ArrowRightLeft,
      },
      {
        name: 'PNG to SVG',
        description: 'Convert PNG images into SVG-style output when supported by the tool.',
        href: '/image/conversion/png-to-svg',
        icon: ArrowRightLeft,
      },
      {
        name: 'JPG to SVG',
        description: 'Convert JPG images into SVG-style output when supported by the tool.',
        href: '/image/conversion/jpg-to-svg',
        icon: ArrowRightLeft,
      },
      {
        name: 'WebP to SVG',
        description: 'Convert WebP images into SVG-style output when supported by the tool.',
        href: '/image/conversion/webp-to-svg',
        icon: ArrowRightLeft,
      },
    ],
  },
  {
    title: 'Utility Tools',
    description: 'Check image details, inspect metadata, detect formats, and extract useful visual information.',
    href: '/image/utility',
    icon: Search,
    blogHref: '/blog/image-tools',
    tools: [
      {
        name: 'Image Metadata Viewer',
        description: 'View available image metadata, file details, and EXIF information.',
        href: '/image/utility/image-metadata-viewer',
        icon: Search, // Fallback for FileSearch
      },
      {
        name: 'Image Dimension Checker',
        description: 'Check image width, height, and aspect ratio instantly.',
        href: '/image/utility/image-dimension-checker',
        icon: Ruler,
      },
      {
        name: 'Image Format Detector',
        description: 'Detect the real image format and MIME type.',
        href: '/image/utility/image-format-detector',
        icon: ScanSearch,
      },
      {
        name: 'Color Picker From Image',
        description: 'Pick colors from an image and copy HEX or RGB values.',
        href: '/image/utility/color-picker-from-image',
        icon: Pipette,
      },
      {
        name: 'Image Color Palette Extractor',
        description: 'Extract dominant colors from an image for design and branding.',
        href: '/image/utility/image-color-palette-extractor',
        icon: Palette,
      },
    ],
  },
  {
    title: 'Developer Tools',
    description: 'Convert images and Base64 strings for web development, CSS, HTML, and data workflows.',
    href: '/image/developer',
    icon: Code2,
    blogHref: '/blog/developer-tools',
    tools: [
      {
        name: 'Image to Base64',
        description: 'Convert image files into Base64 strings for web usage.',
        href: '/image/developer/image-to-base64',
        icon: Binary,
      },
      {
        name: 'Base64 to Image',
        description: 'Convert Base64 image data back into a downloadable image file.',
        href: '/image/developer/base64-to-image',
        icon: Code2,
      },
    ],
  },
];

export function ImageToolsCollections() {
  return (
    <section className="container mx-auto px-4 max-w-7xl">
      
      {/* Privacy & Safe Processing Disclaimer */}
      <div className="mb-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-teal-50 dark:bg-teal-950/40 p-5 shadow-sm">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300">
            <Info className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Privacy & Processing Notice
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Many Singulariti image tools are designed to work directly in your browser when supported. Some advanced operations may require different processing depending on how the tool is built. Always check the result before downloading, and avoid uploading highly sensitive files unless you understand how the tool processes them.
            </p>
          </div>
        </div>
      </div>

      {/* Collections Vertical Stack */}
      <div className="space-y-12">
        {imageCollections.map((collection) => (
          <div 
            key={collection.title} 
            className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5 md:p-7 dark:border-slate-800 dark:bg-slate-950/60"
          >
            {/* Collection Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <collection.icon className="h-6 h-6 text-teal-700 dark:text-teal-300" strokeWidth={2} />
                  {collection.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {collection.description}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm font-semibold">
                <Link 
                  href={collection.href}
                  className="text-teal-700 hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-200 hover:underline"
                >
                  View Collection →
                </Link>
                {collection.blogHref && (
                  <Link 
                    href={collection.blogHref}
                    className="text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300 hover:underline border-l border-slate-250 dark:border-slate-850 pl-4"
                  >
                    Read Guides
                  </Link>
                )}
              </div>
            </div>

            {/* Tool Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {collection.tools.map((tool) => {
                const ToolIconComponent = tool.icon;
                return (
                  <div 
                    key={tool.name}
                    className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-teal-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div>
                      <div className="flex items-center gap-2.5">
                        {ToolIconComponent && (
                          <div className="flex items-center justify-center p-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300">
                            <ToolIconComponent className="h-4.5 w-4.5" strokeWidth={2} />
                          </div>
                        )}
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-5">
                          {tool.name}
                        </h3>
                      </div>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {tool.description}
                      </p>
                    </div>
                    <Link 
                      href={tool.href}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-200 self-start group/link"
                    >
                      Open Tool 
                      <span className="transition-transform duration-200 group-hover/link:translate-x-0.5">→</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
