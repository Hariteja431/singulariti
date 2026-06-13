export interface CompressionProfile {
  id: string;
  name: string;
  targetFormat: string;
  introDetails: string;
  mechanics: string;
  advantages: string[];
  mistakes: string[];
  faqs: { question: string; answer: string }[];
  relatedTools: string[];
  safeUsageNote: string;
}

export const compressionProfiles: Record<string, CompressionProfile> = {
  "image-compressor": {
    id: "image-compressor",
    name: "Image Compressor",
    targetFormat: "Various (JPG, PNG, WebP)",
    introDetails: "A comprehensive image compression utility that handles multiple formats simultaneously. It automatically selects the optimal encoder path for JPEGs, PNGs, and WebPs in a unified interface.",
    mechanics: "Uses intelligent format routing. It delegates JPG files to lossy quantization pipelines, PNG files to lossless palette-reduction algorithms, and WebPs to entropy block mapping depending on input characteristics.",
    advantages: [
      "Process multiple images of different formats in one batch",
      "Unified slider settings to adjust quality indexes quickly",
      "Automatic detection of transparency masks to prevent graphic corruption"
    ],
    mistakes: [
      "Applying the same low quality factor to logos and photographs in the same batch",
      "Expecting vector files like SVGs or PDFs to compile in standard image encoders"
    ],
    faqs: [
      {
        question: "Can I compress different file formats at once?",
        answer: "Yes, the tool is format-agnostic. It routes JPEGs, PNGs, and WebPs through their respective browser encoders in the same queue."
      },
      {
        question: "Does it convert format types during compression?",
        answer: "No, files are compressed and exported in their original formats unless you explicitly opt to convert them."
      }
    ],
    relatedTools: ["jpg-compressor", "png-compressor", "webp-compressor"],
    safeUsageNote: "Verify image quality outputs visually before deleting source files from your local storage."
  },
  "jpg-compressor": {
    id: "jpg-compressor",
    name: "JPG Compressor",
    targetFormat: "JPG/JPEG",
    introDetails: "A highly specialized compressor fine-tuned for photographic JPEG file structures. It targeting lossy block compression parameters to shrink heavy camera files for email or form uploads.",
    mechanics: "Applies discrete cosine transform (DCT) coefficient modifications and quantization matrices. By fine-tuning the chroma subsampling factors, it reduces visual high-frequency weight where human eyes notice it least.",
    advantages: [
      "Substantial file weight reduction (often 70-80%) with minimal visual decay",
      "Preserves or strips EXIF camera metadata tags based on options",
      "Universal loading speed improvements on mobile platforms"
    ],
    mistakes: [
      "Reducing quality factor below 50% for text-heavy sheets, causing character noise",
      "Attempting to compress PNG transparency files, which will replace transparent elements with solid backdrops"
    ],
    faqs: [
      {
        question: "Will I lose camera EXIF metadata details?",
        answer: "You can toggle options to preserve or discard camera models, GPS data, and timestamps to optimize file size further."
      },
      {
        question: "Why does text inside my JPG look fuzzy after compression?",
        answer: "JPG compression is lossy and groups pixels into 8x8 blocks, which can create visual noise around high-contrast text edges."
      }
    ],
    relatedTools: ["jpeg-compressor", "image-compressor", "jpg-to-png"],
    safeUsageNote: "High compression settings strip visual EXIF details. Check outputs before uploading files to portfolios."
  },
  "jpeg-compressor": {
    id: "jpeg-compressor",
    name: "JPEG Compressor",
    targetFormat: "JPEG",
    introDetails: "Optimizes standard compliant JPEG files, with focus on maintaining structural compatibility for official portals, scanning documents, and camera records.",
    mechanics: "Re-quantizes raw pixel arrays by scaling luminance coefficients, utilizing standard browser encoding profiles to guarantee strict compliance with standard JPEG renderers.",
    advantages: [
      "Strict conformance to standard JPEG rendering guidelines",
      "Optimized block compression parameters for scanning forms and bills",
      "Maintains correct color profiling tags during export"
    ],
    mistakes: [
      "Re-compressing already compressed small JPEG files, which will only degrade visual quality further",
      "Assuming the compressor converts vector files like SVGs"
    ],
    faqs: [
      {
        question: "Is JPEG different from JPG in this compressor?",
        answer: "JPG and JPEG refer to the same image container standard. This compressor processes files with either extension using identical parameters."
      }
    ],
    relatedTools: ["jpg-compressor", "image-compressor", "jpg-to-pdf"],
    safeUsageNote: "Ensure files conform to standard color parameters when compressing scans of legal documents."
  },
  "png-compressor": {
    id: "png-compressor",
    name: "PNG Compressor",
    targetFormat: "PNG",
    introDetails: "A lossless compression utility built to optimize transparency channels, UI design assets, high-contrast screenshots, and logos with crisp vector-like edges.",
    mechanics: "Reduces size using pixel-line filter prediction and 8-bit palette-index color reductions, mapping redundant pixels into a single index value while preserving alpha masking channels.",
    advantages: [
      "Absolute preservation of transparent background alpha details",
      "Lossless quality guarantees zero text blur or geometric edge corruption",
      "Optimizes large vector-exported PNG illustrations for web use"
    ],
    mistakes: [
      "Using PNG compression for heavy camera photographs, which produces large file footprints compared to JPG",
      "Assuming the file footprint will drop by 90% without utilizing color indexing options"
    ],
    faqs: [
      {
        question: "Is PNG compression lossy or lossless?",
        answer: "PNG compression is lossless, meaning it preserves exact color values. You can opt to compress via color quantization (lossy index) for smaller sizes."
      },
      {
        question: "Will my graphic's transparent background stay intact?",
        answer: "Yes, the transparency channel (alpha mask) is preserved during the compression."
      }
    ],
    relatedTools: ["image-compressor", "png-to-webp", "png-to-jpg"],
    safeUsageNote: "Color palette indexing reduces overall colors to 256. Verify gradient maps look smooth before final export."
  },
  "webp-compressor": {
    id: "webp-compressor",
    name: "WebP Compressor",
    targetFormat: "WebP",
    introDetails: "Optimizes WebP files, a modern web image format. It adjusts lossy/lossless factors to optimize assets for faster page speeds and SEO performance.",
    mechanics: "Employs key-frame predictive block mapping. It maps nearby pixels to represent visual steps in blocks, maintaining small file footprints for both photos and illustrations.",
    advantages: [
      "Extremely tiny file sizes compared to JPG/PNG at matching quality",
      "Supports both lossy quality adjustments and lossless alpha channel compression",
      "Direct optimization of visual resources to boost page speeds"
    ],
    mistakes: [
      "Compressing WebP assets multiple times, which quickly adds compression artifacts",
      "Discarding lossless modes when compressing transparent UI buttons"
    ],
    faqs: [
      {
        question: "Should I choose lossy or lossless mode for WebP?",
        answer: "Use lossless mode for icons, logos, and screenshots. Choose lossy mode for photos and banners to get substantial size reduction."
      }
    ],
    relatedTools: ["image-compressor", "webp-to-png", "webp-to-jpg"],
    safeUsageNote: "Confirm older legacy browsers can render your outputs if target audiences use older systems."
  },
  "svg-compressor": {
    id: "svg-compressor",
    name: "SVG Compressor",
    targetFormat: "SVG (XML Code)",
    introDetails: "A code-level optimization tool designed to clean XML vector structures, remove software export metadata, and simplify math path descriptions.",
    mechanics: "Parses the SVG XML document tree. It removes editor metadata tags (such as Illustrator or Inkscape tags), strips unnecessary whitespace, minifies path points, and rounds decimal coordinates.",
    advantages: [
      "Strips software comments, namespaces, and unused styles without affecting paths",
      "Rounds coordinate numbers to reduce vector code weight",
      "Safe cleanup of vector graphics for clean inline web design integration"
    ],
    mistakes: [
      "Rounding coordinates too much, which can distort curves or complex shapes",
      "Trying to compress pixel photo files using this vector minifier"
    ],
    faqs: [
      {
        question: "Does SVG compression blur vector curves?",
        answer: "No. The paths remain mathematical formulas. Severe decimal rounding can cause minor curve shifts, but shapes remain sharp."
      },
      {
        question: "What metadata does the tool strip?",
        answer: "It removes export comments, editor-specific metadata, unused attributes, empty groups, and XML declarations."
      }
    ],
    relatedTools: ["image-compressor", "svg-to-png", "png-to-svg"],
    safeUsageNote: "Verify curved paths inside complex graphics look correct after rounding coordinates."
  }
};

export function getCompressionProfile(id: string): CompressionProfile | undefined {
  const cleanId = id.toLowerCase().trim();
  return compressionProfiles[cleanId];
}
