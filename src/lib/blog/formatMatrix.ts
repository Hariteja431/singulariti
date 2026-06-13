export type FormatType = "document" | "image" | "text" | "code" | "data";

export interface FormatProfile {
  format: string;
  type: FormatType;
  strengths: string[];
  limitations: string[];
  commonUses: string[];
  preserves?: string[];
  losesOrChanges?: string[];
}

export interface ConversionIntentProfile {
  from: string;
  to: string;
  userIntent: string;
  userProblem: string;
  transformation: string;
  keyBenefit: string;
  bestUseCases: string[];
  warnings: string[];
  outputChecks: string[];
  faqSet: { question: string; answer: string }[];
}

export const formatProfiles: Record<string, FormatProfile> = {
  pdf: {
    format: "PDF",
    type: "document",
    strengths: [
      "Vector layouts and fonts are preserved across all devices",
      "Support for security controls like encryption, passwords, and read-only locks",
      "Standard format for official submissions and corporate documents"
    ],
    limitations: [
      "Extremely difficult to edit or modify structural layout post-export",
      "Typically results in larger file sizes than raster formats for image-heavy documents",
      "Requires dedicated rendering libraries or software to view"
    ],
    commonUses: [
      "Official applications, invoices, resumes, contracts, e-books, and reports"
    ],
    preserves: [
      "Text selectors, vector shapes, fonts, page bounds, and layers"
    ]
  },
  jpg: {
    format: "JPG/JPEG",
    type: "image",
    strengths: [
      "Highly efficient lossy compression optimized for complex real-world photographs",
      "Universal support across all web browsers, email clients, and smartphones",
      "Compact file footprint ideal for network sharing and uploads"
    ],
    limitations: [
      "Lossy compression degrades visual quality slightly with every save",
      "No support for alpha transparency channels",
      "Text rasterization makes textual overlays look fuzzy or unselectable"
    ],
    commonUses: [
      "Camera photographs, website banner graphics, and email photo attachments"
    ]
  },
  png: {
    format: "PNG",
    type: "image",
    strengths: [
      "Lossless pixel compression preserves exact color values and details",
      "Supports alpha channels for transparent background graphics",
      "Renders sharp text boundaries and geometric lines perfectly"
    ],
    limitations: [
      "Produces significantly larger file sizes than JPG for photographs",
      "Does not support embedded metadata profiles like EXIF as efficiently as JPG",
      "Lacks native multi-page document representations"
    ],
    commonUses: [
      "Website icons, logos, screenshots, transparent graphics, and design assets"
    ]
  },
  webp: {
    format: "WebP",
    type: "image",
    strengths: [
      "Modern format offering both lossy and lossless compression superior to JPG/PNG",
      "Full support for alpha channel transparency and animation sheets",
      "Significantly reduces load times for search engine visibility"
    ],
    limitations: [
      "Older legacy browsers or desktop applications may lack native format support",
      "Visual artifacts can occur at extremely low-quality compression thresholds",
      "Re-encoding already compressed JPGs to WebP does not magically restore details"
    ],
    commonUses: [
      "Optimized website images, blog hero graphics, and lightweight digital assets"
    ]
  },
  svg: {
    format: "SVG",
    type: "image",
    strengths: [
      "Vector-based code rendering allows scaling to any size without quality loss",
      "Fully editable XML code structures styled with CSS or manipulated via JS",
      "Extremely tiny file footprint for vector drawings and logos"
    ],
    limitations: [
      "Not suitable for complex photographic images with millions of pixels",
      "Complex nested vector paths can slow down browser rendering performance",
      "Can contain security vulnerabilities if malicious scripts are injected"
    ],
    commonUses: [
      "Logos, clean website icons, technical diagrams, and scalable illustrations"
    ]
  },
  word: {
    format: "DOC/DOCX",
    type: "document",
    strengths: [
      "Highly interactive text and layout editing templates",
      "Support for spell check, comments, and collaborative tracking changes",
      "Flexible page headers, margins, table structures, and drawing objects"
    ],
    limitations: [
      "Layout and spacing frequently shift when opened in different programs",
      "No native security restrictions against modifying visual content",
      "Requires Microsoft Word or compatible office suite to edit"
    ],
    commonUses: [
      "Drafting letters, essays, corporate contracts, and internal notes"
    ]
  },
  txt: {
    format: "TXT",
    type: "text",
    strengths: [
      "Zero formatting bloat allows complete cross-platform readability",
      "Minimal storage size and absolute speed of operation",
      "Universally supported by every computer platform and scripting language"
    ],
    limitations: [
      "Lacks text styling, sizing, alignment, or image embedded arrays",
      "Does not support page layouts, margins, headers, or bullet symbols",
      "Cannot group structural tables or vectors"
    ],
    commonUses: [
      "Writing raw code configs, readme files, and basic text notes"
    ]
  }
};

const conversionIntentMatrix: ConversionIntentProfile[] = [
  {
    from: "pdf",
    to: "jpg",
    userIntent: "Convert document layouts into raster image sheets for visual sharing.",
    userProblem: "Many messaging apps and social channels do not support previewing multi-page PDF files, forcing users to convert pages to images.",
    transformation: "Rasterizes vector layout coordinates, shapes, and text fonts of each PDF page into a 2D pixel grid container.",
    keyBenefit: "Enables instant photo previews of PDF pages on any app, without requiring specialized PDF reader installations.",
    bestUseCases: [
      "Sharing certificate proofs on LinkedIn or social media posts",
      "Sending invoice mockups to messaging group chats",
      "Creating image thumbnails of document covers for web interfaces"
    ],
    warnings: [
      "The output image text becomes flat pixels; you will lose the ability to select, copy, or search text characters.",
      "Interactive form fields, hyperlinks, and document metadata will be stripped entirely."
    ],
    outputChecks: [
      "Check that the text contrast is legible and characters are not pixelated.",
      "Verify that margins and borders are not cropped at the page edges."
    ],
    faqSet: [
      {
        question: "Does the output image maintain the original text editability?",
        answer: "No. Conversion to JPG rasterizes the pages. The text elements are baked into flat pixels and can no longer be searched or copied."
      },
      {
        question: "How are multi-page PDFs handled?",
        answer: "Each page in the source PDF document is processed separately, creating a distinct JPG file for download."
      }
    ]
  },
  {
    from: "jpg",
    to: "pdf",
    userIntent: "Combine photographs or image scans into a single, standardized document wrapper.",
    userProblem: "Uploading multiple separate JPEG photos for application portals or class submissions is tedious and often blocked by single-file upload caps.",
    transformation: "Creates a structured PDF page flow, wrapping each JPG image inside vector coordinates without re-compressing the original pixels.",
    keyBenefit: "Consolidates individual image scans into a single, easy-to-read document with standard margins.",
    bestUseCases: [
      "Combining camera photos of handwritten homework sheets for submission",
      "Packaging photo scans of ID cards and certificates into a single application file",
      "Creating clean digital portfolios from photo collections"
    ],
    warnings: [
      "The output PDF document will not contain selectable text unless you run external OCR engines.",
      "Embedding high-resolution photos will make the output PDF large, possibly needing compression next."
    ],
    outputChecks: [
      "Verify the page order of images matches the intended layout.",
      "Ensure image sizes fit within Letter or A4 dimensions without getting cut off."
    ],
    faqSet: [
      {
        question: "Can I copy text from the generated PDF?",
        answer: "No. Since the source files are flat JPG images, the output PDF will contain image sheets. OCR software is needed to extract text."
      },
      {
        question: "Is there a limit to the number of JPG files I can merge?",
        answer: "You can merge as many photos as your browser memory permits. For lists larger than 30 photos, scaling may cause minor memory lags."
      }
    ]
  },
  {
    from: "pdf",
    to: "word",
    userIntent: "Extract document structures back into editable word processor text fields.",
    userProblem: "Modifying locked contracts or schedules inside a PDF is difficult without expensive editing software.",
    transformation: "Parses layout structures, text coordinates, and shapes to construct equivalent Word elements.",
    keyBenefit: "Restores text paragraphs, headers, and tables into an editable form for document draft changes.",
    bestUseCases: [
      "Editing template contracts where the original word file was misplaced",
      "Extracting text tables from academic reports for review",
      "Updating older resumes without typing them from scratch"
    ],
    warnings: [
      "Font spacing, complex tables, and columns may shift during layout reconstruction.",
      "If the PDF contains scanned photos of text, the word document will only show images unless OCR is active."
    ],
    outputChecks: [
      "Review the document spacing and verify paragraphs are not broken into single-line spans.",
      "Check that table headers and columns are properly aligned."
    ],
    faqSet: [
      {
        question: "Will the formatting remain identical to the PDF?",
        answer: "Simple layouts transfer accurately. Complex nested tables, fonts, and overlapping boxes may require minor spacing adjustments in Microsoft Word."
      }
    ]
  },
  {
    from: "word",
    to: "pdf",
    userIntent: "Lock editable word documents into a static, cross-platform presentation format.",
    userProblem: "Sharing word files directly often results in broken layouts, missing fonts, or unintended modifications when opened on different devices.",
    transformation: "Renders Word page layouts, text alignments, and fonts into a standardized PDF coordinate structure.",
    keyBenefit: "Ensures the document looks exactly the same on all screens, computers, and printing systems.",
    bestUseCases: [
      "Converting resumes before sending to recruiters to prevent spacing issues",
      "Finalizing business contracts before sending for electronic signatures",
      "Locking student assignments to prevent alteration"
    ],
    warnings: [
      "The text will become difficult to edit directly once converted to PDF.",
      "Double-check that all track changes and comments are resolved before conversion, as they may remain visible."
    ],
    outputChecks: [
      "Verify the page numbers and headers align correctly.",
      "Ensure custom fonts are properly rendered."
    ],
    faqSet: [
      {
        question: "Can I edit the PDF document later?",
        answer: "No. PDF is a final presentation format. To make changes, edit the source Word document and re-convert it."
      }
    ]
  },
  {
    from: "png",
    to: "jpg",
    userIntent: "Convert lossless transparent images to highly compressed photos.",
    userProblem: "Lossless PNG exports from graphics editors or screenshots are too large to email, share, or upload to platforms with strict file size limits.",
    transformation: "Discards transparency channels (alpha index) and applies lossy compression block coding to the pixel grid.",
    keyBenefit: "Drastically reduces image file sizes (up to 80%) for sharing, with universal compatibility.",
    bestUseCases: [
      "Reducing file sizes of high-resolution screenshot captures for email sharing",
      "Preparing web graphic designs for system uploads",
      "Converting mockups for presentation slide packages"
    ],
    warnings: [
      "Transparent backgrounds will be filled with a solid color (usually white).",
      "Lossy compression introduces minor noise artifacts around sharp text boundaries."
    ],
    outputChecks: [
      "Ensure transparent zones were not filled with black or corrupted colors.",
      "Verify sharp lines or text are still legible."
    ],
    faqSet: [
      {
        question: "What happens to the transparent background of my PNG?",
        answer: "JPEG does not support transparency. The transparent areas are filled with a solid background color (defaulting to white)."
      }
    ]
  },
  {
    from: "jpg",
    to: "png",
    userIntent: "Convert compressed photos to a lossless format for editing or transparency support.",
    userProblem: "Editing lossy JPEG files repeatedly causes visual quality to degrade, and you cannot add transparent backdrops to photos.",
    transformation: "Decodes the compressed blocks and wraps the pixel map into a lossless PNG structure with alpha capabilities.",
    keyBenefit: "Stops the degradation of visual details during edits and enables transparency channels.",
    bestUseCases: [
      "Preparing photo elements to isolate objects with transparency",
      "Stopping generation loss during multi-stage image edits",
      "Fulfilling portal guidelines that require lossless PNG uploads"
    ],
    warnings: [
      "Converting to PNG will significantly increase the file size without restoring lost JPEG details.",
      "The source JPG artifacts (noise) will be preserved in the PNG file."
    ],
    outputChecks: [
      "Check the output file size to ensure it fits within upload bounds.",
      "Confirm transparency options are enabled if you plan to edit the canvas."
    ],
    faqSet: [
      {
        question: "Does converting a JPG to PNG make it look sharper?",
        answer: "No. PNG is lossless, but it cannot restore pixels lost during original JPEG compression. It simply preserves the current visual state."
      }
    ]
  },
  {
    from: "webp",
    to: "png",
    userIntent: "Convert modern web images to a lossless, widely supported editing format.",
    userProblem: "Many legacy desktop image editors and vector programs do not import newer WebP files, blocking design workflows.",
    transformation: "Decodes WebP lossy/lossless pixel structures into a standard PNG pixel grid.",
    keyBenefit: "Enables editing WebP files in older design suites while retaining transparency.",
    bestUseCases: [
      "Opening web-optimized assets in legacy editors",
      "Converting WebP icons to PNG for system compatibility",
      "Preparing graphics for design pipelines that only accept PNG formats"
    ],
    warnings: [
      "The conversion will increase file size, often by 2x to 5x.",
      "Any lossy visual artifacts from the source WebP will be preserved."
    ],
    outputChecks: [
      "Confirm alpha transparency is preserved correctly.",
      "Verify image dimensions remain unchanged."
    ],
    faqSet: [
      {
        question: "Why did the file size increase after converting WebP to PNG?",
        answer: "WebP uses advanced compression models. PNG's lossless storage rules require more space to keep matching pixel data."
      }
    ]
  },
  {
    from: "png",
    to: "webp",
    userIntent: "Convert lossless transparent graphics into web-optimized images.",
    userProblem: "High-resolution transparent PNG logos and screenshots make landing pages load slowly, degrading SEO performance.",
    transformation: "Translates PNG transparent grids into WebP vector entropy blocks.",
    keyBenefit: "Shrinks file size by 30-50% compared to PNG while fully preserving transparent details.",
    bestUseCases: [
      "Optimizing transparent logos and interface assets for websites",
      "Compressing screenshots for blog posts to improve page speeds",
      "Reducing file weights of interface mockups for web projects"
    ],
    warnings: [
      "Older internet browsers (like IE11) cannot render WebP images without polyfills.",
      "Ensure quality sliders are set correctly if choosing lossy mode to prevent logo noise."
    ],
    outputChecks: [
      "Check that transparency margins are clean and sharp.",
      "Test page loading performance using the new file format."
    ],
    faqSet: [
      {
        question: "Does WebP support transparency as well as PNG?",
        answer: "Yes. WebP supports full alpha transparency channels with smaller file footprints than PNG."
      }
    ]
  },
  {
    from: "svg",
    to: "png",
    userIntent: "Rasterize vector illustrations into flat images for standard applications.",
    userProblem: "SVGs can render inconsistently on some social boards or email clients, and you cannot upload vectors directly to most user profiles.",
    transformation: "Renders vector coordinate paths onto a fixed pixel grid canvas at a specified width/height scale.",
    keyBenefit: "Creates a flat, highly compatible image sheet suitable for any portal or media device.",
    bestUseCases: [
      "Converting vector icons into PNGs for slide presentations",
      "Exporting illustrations for profile pictures on messaging platforms",
      "Creating static graphics from dynamic vector sketches"
    ],
    warnings: [
      "The output image will lose its vector scaling capabilities and will look pixelated if scaled up.",
      "Once converted, you cannot edit individual vector path nodes or layers."
    ],
    outputChecks: [
      "Ensure resolution parameters are set high enough to prevent fuzzy text.",
      "Verify transparency is preserved correctly."
    ],
    faqSet: [
      {
        question: "Can I scale the output PNG without losing quality?",
        answer: "No. PNG is a raster format. Scaling it up will stretch the pixel grid, causing blurriness. Choose correct export dimensions before converting."
      }
    ]
  },
  {
    from: "png",
    to: "svg",
    userIntent: "Trace raster pixel shapes into scalable vector coordinates.",
    userProblem: "Scaling small PNG logos or design assets for large prints makes them pixelated and blurry.",
    transformation: "Traces pixel boundaries and groups matching color zones into scalable vector paths.",
    keyBenefit: "Generates scalable shapes that can be sized infinitely without losing sharp edges.",
    bestUseCases: [
      "Converting low-resolution logo files into vector prints",
      "Creating scalable assets for sign boards or print layouts",
      "Tracing hand-drawn raster sketches into clean vectors"
    ],
    warnings: [
      "Complex photographs do not convert well into vectors and will create huge, slow SVG files.",
      "Output paths may require manual node editing to look clean."
    ],
    outputChecks: [
      "Zoom in on curves to ensure the path tracing is smooth.",
      "Verify the output file footprint is not excessively large."
    ],
    faqSet: [
      {
        question: "Can I convert high-resolution photos to SVG vectors?",
        answer: "Tracer engines convert flat colors and simple shapes best. Photographic images create millions of complex paths, making the SVG slow to render."
      }
    ]
  }
];

export function getConversionIntent(from: string, to: string): ConversionIntentProfile | undefined {
  const cleanFrom = from.toLowerCase().trim();
  const cleanTo = to.toLowerCase().trim();
  return conversionIntentMatrix.find(c => c.from === cleanFrom && c.to === cleanTo);
}
