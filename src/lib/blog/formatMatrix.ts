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
  },
  {
    from: "webp",
    to: "jpg",
    userIntent: "Convert web-optimized WebP images to standard JPG format for broad compatibility.",
    userProblem: "Many legacy desktop software suites and older upload portals reject WebP files, demanding traditional JPG formats.",
    transformation: "Decodes WebP image bytes and rasterizes them into a highly compressed standard JPG container.",
    keyBenefit: "Ensures your web-downloaded WebP assets can be opened, edited, or uploaded to any platform requiring JPGs.",
    bestUseCases: [
      "Converting web images for use in older document editors",
      "Uploading graphics to application forms that only support JPG files",
      "Sharing web assets with users on older device models"
    ],
    warnings: [
      "WebP transparency (alpha channel) is lost during JPG conversion, resulting in a solid background (usually white).",
      "Some file size increase might happen due to format structure overhead."
    ],
    outputChecks: [
      "Check that transparent background areas are white and clean.",
      "Confirm that text overlays in the image remain legible."
    ],
    faqSet: [
      {
        question: "Will the transparency of WebP be kept in the JPG?",
        answer: "No. The JPG format doesn't support transparency, so any transparent background will be filled with a solid color, defaulting to white."
      }
    ]
  },
  {
    from: "jpg",
    to: "jpeg",
    userIntent: "Normalize image file extensions from JPG to JPEG format.",
    userProblem: "Strict configuration schemas or legacy systems sometimes require file extensions to match .jpeg exactly, rejecting .jpg.",
    transformation: "Wraps the source JPG image stream into a standard JPEG named file container without changing the underlying compressed data.",
    keyBenefit: "Avoids portal rejection by matching file extensions to exact strict requirements without any quality loss.",
    bestUseCases: [
      "Satisfying strict database import rules that require .jpeg formats",
      "Standardizing image file extensions in development repositories",
      "Preparing batches of photos for legacy processing systems"
    ],
    warnings: [
      "This conversion only updates the container extension naming; the underlying compression remains exactly the same.",
      "No modifications are made to the pixel grid or colors."
    ],
    outputChecks: [
      "Confirm the file extension displays as .jpeg on your system.",
      "Verify the image opens normally in standard viewers."
    ],
    faqSet: [
      {
        question: "Is there any quality loss when converting JPG to JPEG?",
        answer: "No. JPG and JPEG represent the exact same image encoding rules. The conversion is a file extension wrapper rename with zero changes to data."
      }
    ]
  },
  {
    from: "jpeg",
    to: "jpg",
    userIntent: "Normalize image file extensions from JPEG to JPG format.",
    userProblem: "Some older mobile platforms or web portals require the 3-letter .jpg extension, rejecting the 4-letter .jpeg files.",
    transformation: "Wraps the source JPEG image stream into a standard JPG named file container without altering visual bytes.",
    keyBenefit: "Ensures complete compatibility with systems requiring short file extensions without re-encoding pixels.",
    bestUseCases: [
      "Meeting requirements for web upload forms accepting only .jpg extensions",
      "Saving disk directory namespace by standardizing all image extensions to 3-letter formats",
      "Sharing photos with older devices that do not recognize .jpeg extensions"
    ],
    warnings: [
      "This is a container mapping change; no pixel re-encoding or image compression takes place.",
      "The visual quality and metadata properties are fully preserved."
    ],
    outputChecks: [
      "Confirm the final output file extension is .jpg.",
      "Ensure the image remains fully readable and clean."
    ],
    faqSet: [
      {
        question: "Does this conversion change the file size?",
        answer: "No. Since the image data is not re-compressed, the file size remains identical."
      }
    ]
  },
  {
    from: "webp",
    to: "png",
    userIntent: "Convert compressed WebP images to lossless PNG format for printing or editing.",
    userProblem: "Editing programs and vector suites frequently fail to import newer WebP files, blocking design pipelines.",
    transformation: "Decodes WebP lossy/lossless pixel layouts and maps them to a standard lossless PNG pixel layout.",
    keyBenefit: "Preserves transparent boundaries and visual details while enabling edits in legacy design suites.",
    bestUseCases: [
      "Opening web graphics in older design suites",
      "Converting transparent WebP icons for print templates",
      "Preparing web assets for software pipelines requiring PNG formats"
    ],
    warnings: [
      "PNG files are typically larger than WebP, so expect an increase in file weight.",
      "Converting will not restore detail lost in original WebP lossy compression."
    ],
    outputChecks: [
      "Check that transparent background areas are properly preserved.",
      "Verify the file is recognized by your target editor."
    ],
    faqSet: [
      {
        question: "Why is the output PNG larger than the source WebP?",
        answer: "WebP uses next-generation compression. PNG is a legacy format that requires more disk bytes to store the same pixel array losslessly."
      }
    ]
  },
  {
    from: "jpg",
    to: "webp",
    userIntent: "Convert JPG photographs to WebP format to reduce web page loading times.",
    userProblem: "Heavy JPG files slow down page rendering, hurting search rankings and mobile user experience.",
    transformation: "Compresses JPG pixel grids into next-generation WebP entropy layers in client memory.",
    keyBenefit: "Reduces image file sizes by 30-40% compared to JPG while maintaining equal visual details.",
    bestUseCases: [
      "Optimizing photo assets for fast website rendering",
      "Reducing hosting bandwidth by serving lighter images",
      "Optimizing gallery pages for mobile web visitors"
    ],
    warnings: [
      "Very old web browsers (like Internet Explorer) do not support WebP images natively.",
      "Re-compressing already lossy JPGs to WebP does not recover lost pixel details."
    ],
    outputChecks: [
      "Ensure there are no excessive compression artifacts or pixel blur.",
      "Verify the new image footprint is smaller than the original JPG."
    ],
    faqSet: [
      {
        question: "Does converting JPG to WebP restore photo quality?",
        answer: "No. WebP is highly efficient, but it cannot recreate details that were discarded during the original JPG compression. It preserves the current visual state with a smaller size."
      }
    ]
  },
  {
    from: "webp",
    to: "svg",
    userIntent: "Trace raster WebP images into scalable vector SVG path structures.",
    userProblem: "WebP files are raster arrays that become blurry and pixelated when scaled up for prints or responsive web banners.",
    transformation: "Analyzes WebP pixel borders, groups color regions, and traces them into vector XML coordinates.",
    keyBenefit: "Produces scalable vector graphics that look clean at any scale, perfect for logos and diagrams.",
    bestUseCases: [
      "Tracing simple WebP logos into scalable print files",
      "Converting icons to vectors for responsive web interfaces",
      "Generating clean vector layouts from raster sketches"
    ],
    warnings: [
      "Photographs and complex gradients will produce massive, slow-to-render SVG files.",
      "The traced shapes might lose fine details and require manual node cleanups."
    ],
    outputChecks: [
      "Verify the output graphic is clean and curves are smooth.",
      "Ensure the SVG file footprint is small enough to load quickly."
    ],
    faqSet: [
      {
        question: "Can I convert complex WebP photos to SVG vectors?",
        answer: "Tracing is best for simple shapes and logos. Complex photos generate millions of vector paths, which can slow down web browsers."
      }
    ]
  },
  {
    from: "svg",
    to: "webp",
    userIntent: "Rasterize vector SVG files into optimized WebP graphics for web integration.",
    userProblem: "Complex SVG vector layouts can consume high CPU resources for rendering, causing lag on mobile screens.",
    transformation: "Draws vector XML path coordinates onto a raster canvas and exports it to optimized WebP format.",
    keyBenefit: "Generates web-optimized raster graphics that load quickly without client-side CPU rendering lag.",
    bestUseCases: [
      "Optimizing complex vector illustrations for website articles",
      "Creating web-friendly raster graphics from vector logo assets",
      "Reducing web page CPU loads for responsive designs"
    ],
    warnings: [
      "The output file is a raster grid and will look pixelated if scaled past export dimensions.",
      "All vector coordinates are flattened and cannot be edited as paths."
    ],
    outputChecks: [
      "Verify text and curved borders are sharp at the selected resolution.",
      "Confirm transparency layers are mapped correctly."
    ],
    faqSet: [
      {
        question: "Will the WebP file scale infinitely like the SVG?",
        answer: "No. WebP is a raster format. You must select correct width and height dimensions before rasterizing."
      }
    ]
  },
  {
    from: "svg",
    to: "jpg",
    userIntent: "Rasterize vector SVG assets to traditional JPG format.",
    userProblem: "Many document formats and print portals reject SVG vector formats, demanding standard JPG photos.",
    transformation: "Renders vector paths onto a flat pixel canvas and exports it to compressed JPG format.",
    keyBenefit: "Ensures complete compatibility with standard document portals and offline viewers.",
    bestUseCases: [
      "Converting vector layouts for profile uploads",
      "Preparing graphics for print shops requiring JPG sheets",
      "Ensuring consistent design previews across legacy browsers"
    ],
    warnings: [
      "Transparency is lost because the JPG format does not support alpha channels, resulting in a solid background (usually white).",
      "Rasterization means the output cannot be scaled without quality loss."
    ],
    outputChecks: [
      "Ensure transparent backgrounds are white and clean.",
      "Verify the export resolution is high enough to keep text legible."
    ],
    faqSet: [
      {
        question: "What happens to the transparent background of the SVG?",
        answer: "Since JPG doesn't support transparency, the transparent areas are filled with a solid background color (defaulting to white)."
      }
    ]
  },
  {
    from: "base64",
    to: "image",
    userIntent: "decode base64 encoded text strings back into viewable image graphic files",
    userProblem: "data URI schemes and inline base64 image strings are unreadable text streams, preventing direct visual rendering in standard photo viewers",
    transformation: "decodes the alphanumeric base64 character blocks and converts the binary stream into a downloadable image blob",
    keyBenefit: "reclaims visual graphic files from raw text representations securely in the browser",
    bestUseCases: [
      "Restoring graphic assets from base64 database backups",
      "Debugging inline HTML data URI image sources",
      "Converting embedded CSS asset strings into separate image files"
    ],
    warnings: [
      "Ensure the input base64 string includes standard MIME type headers (e.g., data:image/png;base64).",
      "Corrupted character segments will cause visual distortion or decoding failure."
    ],
    outputChecks: [
      "Verify the output image displays correctly without broken pixels.",
      "Check that the image dimensions match the source parameters."
    ],
    faqSet: [
      {
        question: "Does decoding base64 restore lost image resolution?",
        answer: "No. Decoding reconstructs the exact original file structure. If the original image was low-quality, the decoded image will have the matching resolution."
      }
    ]
  },
  {
    from: "image",
    to: "base64",
    userIntent: "encode image files into base64 text strings for direct HTML/CSS embed formats",
    userProblem: "serving separate small logo and icon graphic files creates extra HTTP network requests, slowing down page loading speeds",
    transformation: "reads the binary image array and translates the bytes into a standard RFC 4648 base64 text stream",
    keyBenefit: "enables inline visual styling directly inside stylesheets or markup documents, bypassing external source links",
    bestUseCases: [
      "Embedding small logo graphics directly inside email templates",
      "Packaging visual icons directly within CSS files for fast loading",
      "Serializing graphic attachments for API data payloads"
    ],
    warnings: [
      "Encoding large photos (above 1MB) creates massive base64 text strings, which increases stylesheet sizes.",
      "Ensure the target platform supports data URI formats for standard rendering."
    ],
    outputChecks: [
      "Verify that the generated string starts with data:image/ format prefix.",
      "Test the output string in a browser address bar to verify it renders the image."
    ],
    faqSet: [
      {
        question: "Does base64 encoding increase the file size?",
        answer: "Yes. Base64 encoding represents binary data using 64 ASCII characters. This increases the character count, making the base64 text roughly 33% larger than the binary file."
      }
    ]
  },
  {
    from: "black-and-white",
    to: "color",
    userIntent: "colorize monochrome photos to restore vibrant, life-like color spaces",
    userProblem: "historical or old archives are restricted to grayscale tones, hiding original ambient hues and visual details",
    transformation: "runs local colorization scripts and canvas layer overlays to predict and apply vibrant color channels to monochrome layers",
    keyBenefit: "breathes new life into historical black and white graphics by generating realistic visual color palettes client-side",
    bestUseCases: [
      "Colorizing family vintage grayscale photos",
      "Restoring historical archive images for presentations",
      "Enhancing artistic monochrome assets with natural color hues"
    ],
    warnings: [
      "Generated color channels are mathematical estimations and might not represent the exact historical colors.",
      "High-contrast shadows or overexposed segments might not colorize evenly."
    ],
    outputChecks: [
      "Review the color balance to ensure skin tones and environments look natural.",
      "Verify that the output does not contain bleeding color edges."
    ],
    faqSet: [
      {
        question: "Is the colorized output 100% historically accurate?",
        answer: "No. The system uses colorization algorithms to predict hues based on luminance gradients. It provides a realistic estimate rather than a historical record."
      }
    ]
  },
  {
    from: "color",
    to: "black-and-white",
    userIntent: "convert vibrant color images to dramatic monochrome or grayscale formats",
    userProblem: "color graphics can look cluttered or lack artistic emphasis, and printing full color requires high printer ink costs",
    transformation: "strips RGB saturation components and evaluates pixel luminance values to calculate uniform grayscale weights",
    keyBenefit: "creates clean, artistic black and white graphics instantly while reducing print ink requirements",
    bestUseCases: [
      "Creating dramatic grayscale art layouts from family photos",
      "Preparing documents for monochrome office printing",
      "Isolating high-contrast shadow details for graphics editing"
    ],
    warnings: [
      "All original color channel information is discarded; save a backup of your color source.",
      "Low contrast color transitions might render as a single flat gray tone."
    ],
    outputChecks: [
      "Ensure shadow details are still visible and contrast is balanced.",
      "Check that the output format meets standard grayscale layout rules."
    ],
    faqSet: [
      {
        question: "Can I recover the original colors of my photo from the black and white output?",
        answer: "No. Once converted to black and white, the individual RGB color channel details are permanently discarded. Keep a copy of the original color file."
      }
    ]
  }
];

export function getConversionIntent(from: string, to: string): ConversionIntentProfile | undefined {
  const cleanFrom = from.toLowerCase().trim();
  const cleanTo = to.toLowerCase().trim();
  return conversionIntentMatrix.find(c => c.from === cleanFrom && c.to === cleanTo);
}
