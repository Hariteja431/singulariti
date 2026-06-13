const fs = require('fs');
const path = require('path');

// Dictionary mapping each tool ID to its highly specific details
const toolDetailsMap = {
  // --- IMAGE & EDITING TOOLS ---
  "image-compressor": {
    purpose: "reduce the file size of digital images while maintaining visual quality",
    mechanism: "renders the pixel matrix to an offscreen canvas and applies lossy/lossless compression algorithms client-side",
    why: "Heavy image file sizes slow down web page loading speeds, consume excessive hosting bandwidth, and trigger upload size errors on web portals.",
    useCase: "optimizing website assets, fitting photos into email attachments, and preparing digital documents for form uploads",
    steps: [
      "Upload your high-resolution image file to the workspace.",
      "Adjust the quality compression slider (80% is recommended for best quality/size ratio).",
      "Inspect the live size comparison indicating the saved kilobytes.",
      "Download the compressed image file directly to your system."
    ],
    advs: ["Reduces image weight by up to 80% with minimal visual degradation", "Strips complex EXIF metadata details from images", "Executes locally on your CPU for secure processing"],
    errors: ["Compressing an already compressed image repeatedly, causing extreme pixel distortion", "Setting compression quality to 0% and causing blurry pixel outputs"],
    faqs: [
      { q: "Will the image dimensions change?", a: "No. The compressor only optimizes pixel compression; the width and height of the image remain identical." },
      { q: "Is PNG transparency preserved?", a: "Yes, the tool preserves alpha channels for transparent PNG and WebP files." }
    ]
  },
  "jpg-compressor": {
    purpose: "optimize and compress JPG/JPEG image files locally",
    mechanism: "adjusts the JPEG quantization table scale inside the browser rendering pipeline",
    why: "JPEG files from cameras are often multi-megabyte, which makes web sharing slow and eats up server space.",
    useCase: "compressing photographs, blog banner images, and scanned digital documents",
    steps: [
      "Upload your JPG/JPEG image file into the local tool interface.",
      "Select your target compression level using the slider.",
      "Click compress to run the client-side optimization script.",
      "Save the optimized JPG file to your device."
    ],
    advs: ["Tailored specifically for lossy JPEG quantization optimization", "Shows real-time before-and-after size indicators", "Runs offline without internet data transfers"],
    errors: ["Expecting lossy JPEG compression to reconstruct original sharp vector borders", "Attempting to compress non-JPEG files like raw vector designs"],
    faqs: [
      { q: "How much space can I save on JPGs?", a: "Typical JPG photos can be reduced by 50% to 75% with zero visible loss in sharpness." },
      { q: "Are EXIF data tables stripped?", a: "Yes, the compressor removes metadata to maximize compression gains." }
    ]
  },
  "jpeg-compressor": {
    purpose: "compress JPEG digital photos to minimize byte footprint",
    mechanism: "re-encodes the JPEG DCT coefficient matrices in browser volatile memory",
    why: "Camera and smartphone JPEG photos often contain heavy, unoptimized structures that slow down websites.",
    useCase: "reducing smartphone photo sizes, saving disk space, and preparing images for digital galleries",
    steps: [
      "Drag and drop your JPEG photo into the browser uploader.",
      "Adjust the quality slider (usually between 75% and 85%).",
      "Review the calculated byte reduction on the dashboard.",
      "Download your optimized JPEG file immediately."
    ],
    advs: ["Optimizes JPEG pixel blocks to eliminate bloating artifacts", "Maintains original resolution settings", "Operates entirely client-side for confidential photos"],
    errors: ["Running multiple compression loops on the same JPEG file, causing blocky artifacts", "Setting quality settings too low for high-resolution prints"],
    faqs: [
      { q: "What is the difference between JPG and JPEG compressors?", a: "They apply the same optimization logic, as JPG and JPEG refer to the exact same image format." }
    ]
  },
  "png-compressor": {
    purpose: "compress PNG graphic files while preserving lossless transparency",
    mechanism: "applies lossless PNG color reduction and compression filter optimization client-side",
    why: "PNG graphics are lossless, making them extremely heavy compared to lossy formats, which slows down websites.",
    useCase: "shrinking website icons, logos with transparency, and high-contrast digital illustrations",
    steps: [
      "Select and load your PNG graphic file.",
      "Adjust the optimization depth settings if available.",
      "Wait for the pixel filter analysis to complete locally.",
      "Save the optimized transparent PNG to your device."
    ],
    advs: ["Preserves transparent alpha channels perfectly", "Applies lossless color indexing to reduce file size", "Zero uploads to remote networks, protecting design assets"],
    errors: ["Expecting PNG compression to match the extreme compression ratios of lossy JPEG", "Using PNG for complex photographic portraits where JPEG is better suited"],
    faqs: [
      { q: "Will the transparency backdrop disappear?", a: "No. This compressor is designed to maintain transparent backdrops while optimizing file weight." }
    ]
  },
  "webp-compressor": {
    purpose: "optimize and compress modern next-generation WebP images",
    mechanism: "adjusts the WebP compression parameters in browser canvas encoding pipelines",
    why: "Even though WebP is lightweight, further optimization is often needed to meet strict performance scores.",
    useCase: "optimizing assets for web design, loading faster pages, and fitting upload thresholds",
    steps: [
      "Select a WebP file from your computer.",
      "Set your desired compression ratio.",
      "Run the browser-based WebP compression script.",
      "Save the compressed WebP photo."
    ],
    advs: ["Optimizes both lossy and lossless WebP structures", "Maintains high visual fidelity with small byte sizes", "Works locally on your CPU for secure rendering"],
    errors: ["Converting low-quality JPGs to WebP and compressing them expecting quality improvements"],
    faqs: [
      { q: "Does WebP support animation compression?", a: "Yes, WebP supports animated files, but this compressor is optimized for static images." }
    ]
  },
  "svg-compressor": {
    purpose: "minify SVG vector graphic code strings",
    mechanism: "parses the SVG XML nodes and strips metadata, comments, and redundant coordinate paths",
    why: "Design software exports SVG files with bloated comments, metadata, and overly long decimal coordinate points.",
    useCase: "cleaning vector logos, web graphics, and inline SVG assets for front-end development",
    steps: [
      "Paste your raw SVG code or upload your SVG graphic file.",
      "Toggle minification preferences like stripping metadata.",
      "Inspect the clean vector markup output.",
      "Download the minified SVG file or copy the raw code."
    ],
    advs: ["Strips out Adobe, Figma, or Sketch export bloat tags", "Reduces vector node precision to shrink XML text sizes", "Operates entirely client-side in browser RAM"],
    errors: ["Setting coordinate precision too low, causing vector shapes to distort or deform", "Pasting corrupted HTML tags expecting clean SVG validation"],
    faqs: [
      { q: "Will my vector lines remain sharp?", a: "Yes. SVGs are vector equations. Minification only cleans code structure and coordinates without changing rendering scale." }
    ]
  },
  "jpg-to-png": {
    purpose: "convert JPG photographic images into transparent PNG graphics",
    mechanism: "rasterizes the input JPG onto a canvas and encodes it as a PNG stream",
    why: "JPG images do not support transparency, making them unsuitable for web overlay designs, logos, and badges.",
    useCase: "converting photo assets to graphics and preparing logo layers",
    steps: [
      "Upload your JPG image file.",
      "Click the convert button to run the pixel converter.",
      "Download the exported PNG graphic file."
    ],
    advs: ["Converts files offline inside browser volatile memory", "Adds support for transparent pixel layouts", "Maintains original color parameters"],
    errors: ["Expecting the white background of a JPG to automatically become transparent without removing it first"],
    faqs: [
      { q: "Does this make the image transparent?", a: "It converts the format to PNG, which supports transparency, but it does not remove existing background pixels automatically." }
    ]
  },
  "png-to-jpg": {
    purpose: "convert PNG graphic images to standard flat JPG format",
    mechanism: "renders the PNG pixel grid onto a white canvas backdrop and exports JPEG bytes",
    why: "PNG files are lossless and heavy. If transparency is not needed, JPG offers a much smaller file footprint.",
    useCase: "reducing logo sizes for printing, formatting screenshots, and converting graphics for general share",
    steps: [
      "Select your PNG graphic file.",
      "Set background color padding options (defaults to white).",
      "Process the pixels locally and save the JPG output."
    ],
    advs: ["Reduces file weight significantly by shifting to lossy JPG format", "Fills transparent backdrops with solid color layers cleanly", "100% secure client-side execution"],
    errors: ["Converting transparent logos to JPG and wondering why the transparent background turned white"],
    faqs: [
      { q: "What happens to transparent regions?", a: "Since JPG doesn't support transparency, transparent areas are filled with a solid background color (default is white)." }
    ]
  },
  "jpg-to-webp": {
    purpose: "convert standard JPG files to optimized next-gen WebP format",
    mechanism: "renders JPG pixels to canvas and encodes it into modern WebP binary streams",
    why: "WebP is the current standard for web images, offering 30% better compression than JPG for faster websites.",
    useCase: "optimizing blog assets, converting galleries, and improving Google PageSpeed scores",
    steps: [
      "Upload your JPG files.",
      "Click convert to process the files client-side.",
      "Save the modern WebP image file."
    ],
    advs: ["Shrinks image weight by ~30% compared to JPG at similar quality", "Runs completely inside your active browser session", "Zero external server dependencies"],
    errors: ["Using legacy software that doesn't support WebP formats after conversion"],
    faqs: [
      { q: "Is WebP supported by all browsers?", a: "Yes, all modern web browsers support WebP image files." }
    ]
  },
  "png-to-webp": {
    purpose: "convert PNG graphics to modern WebP files",
    mechanism: "converts PNG pixel vectors and transparency grids into modern WebP bytes",
    why: "PNG graphics are extremely heavy. WebP supports transparency while cutting file size in half.",
    useCase: "optimizing website graphics, converting transparent icons, and reducing app asset weights",
    steps: [
      "Select the transparent PNG file.",
      "Click convert to translate pixel maps.",
      "Download the lightweight transparent WebP file."
    ],
    advs: ["Retains transparency channels with WebP compression", "Reduces file size by up to 50% compared to PNG", "Secure client-side processing"],
    errors: ["Setting compression values too high and causing transparency artifacts"],
    faqs: [
      { q: "Does WebP keep transparent layers?", a: "Yes, WebP supports both lossy and lossless transparency channels." }
    ]
  },
  "webp-to-jpg": {
    purpose: "convert modern WebP images to standard JPG format",
    mechanism: "rasterizes WebP image frames to canvas and exports standard JPG pixels",
    why: "Legacy applications and some photo editors do not support the WebP image format.",
    useCase: "preparing web assets for print, editing in legacy software, and sharing with old devices",
    steps: [
      "Select the WebP file.",
      "Click convert to process.",
      "Download the standard JPG image."
    ],
    advs: ["Ensures universal file compatibility", "Uses native canvas APIs for fast conversion", "Runs 100% locally in browser memory"],
    errors: ["Expecting the converted JPG to be smaller than the source WebP file"],
    faqs: [
      { q: "Will my file size increase?", a: "Yes. JPG is generally less optimized than WebP, so the converted file may be larger." }
    ]
  },
  "webp-to-png": {
    purpose: "convert WebP images into transparent PNG graphics",
    mechanism: "translates WebP pixel grids and alpha backdrops into lossless PNG structures",
    why: "Designers often need transparent PNG files for editing in software that lacks native WebP support.",
    useCase: "importing web graphics into design tools and preserving transparent layers for print",
    steps: [
      "Upload your WebP graphic file.",
      "Click the convert button.",
      "Save the lossless PNG graphic."
    ],
    advs: ["Preserves transparent alpha pixels during conversion", "Outputs standard lossless PNG structures", "Zero server risk"],
    errors: ["Expecting lossy WebP inputs to become higher resolution after PNG conversion"],
    faqs: [
      { q: "Does this restore lost details?", a: "No. PNG is lossless, but it cannot restore pixel detail that was lost when the file was originally compressed to WebP." }
    ]
  },
  "jpg-to-jpeg": {
    purpose: "format JPG image extensions to JPEG",
    mechanism: "renames or re-saves the JPG file binary stream into the JPEG standard",
    why: "Some older file upload systems explicitly require the .jpeg extension and reject .jpg files.",
    useCase: "conforming to strict portal uploads and renaming file extensions",
    steps: [
      "Upload your .jpg image.",
      "Run the renaming converter.",
      "Download the .jpeg file."
    ],
    advs: ["Ensures strict compliance with legacy portals", "Quick, instant renaming logic", "Runs locally on your device CPU"],
    errors: ["Expecting visual quality changes when only the extension/header standard shifts"],
    faqs: [
      { q: "Is there any quality difference?", a: "No. JPG and JPEG represent the exact same image format; only the filename extension changes." }
    ]
  },
  "jpeg-to-jpg": {
    purpose: "format JPEG image extensions to standard JPG",
    mechanism: "renames or re-saves the JPEG file binary stream to the JPG standard",
    why: "Some legacy operating systems and index portals require 3-character extensions like .jpg.",
    useCase: "organizing files and conforming to strict upload portals",
    steps: [
      "Upload your .jpeg image.",
      "Run the converter.",
      "Save the .jpg file."
    ],
    advs: ["Converts extensions in milliseconds", "Runs offline without data transfers", "Keeps files structured"],
    errors: ["Renaming files manually and breaking file headers, which this tool handles safely"],
    faqs: [
      { q: "Will this compress my image?", a: "No. This tool only updates the file extension and container mapping without re-compressing the pixels." }
    ]
  },
  "svg-to-png": {
    purpose: "convert scalable vector SVG graphics into transparent PNG raster files",
    mechanism: "rasterizes the SVG vector coordinates onto a canvas and outputs a transparent PNG file",
    why: "Vector SVGs are not supported on social media platforms or standard document viewers.",
    useCase: "formatting logos for presentation slides, sharing vector icons, and printing designs",
    steps: [
      "Select your vector SVG file.",
      "Set custom resolution dimensions if needed.",
      "Run the local rasterization script and save your PNG."
    ],
    advs: ["Renders vector equations into high-definition transparent PNGs", "Maintains sharp borders and margins", "Processes completely client-side"],
    errors: ["Setting output dimensions too low, resulting in blurry raster outputs"],
    faqs: [
      { q: "Can I scale the output size?", a: "Yes, you can choose custom dimensions to rasterize the SVG at any resolution without pixelation." }
    ]
  },
  "svg-to-jpg": {
    purpose: "convert scalable vector SVG graphics to flat JPG photos",
    mechanism: "rasterizes SVG equations onto a canvas with a white background and exports a JPG file",
    why: "Social media and standard image sharing platforms require flat JPG formats and reject SVG files.",
    useCase: "sharing designs on chat networks, posting logos, and printing designs",
    steps: [
      "Upload your SVG vector file.",
      "Specify output width and height dimensions.",
      "Convert and download the flat JPG file."
    ],
    advs: ["Rasterizes vectors at custom dimensions cleanly", "Applies solid backgrounds to transparency regions", "Runs locally in browser memory"],
    errors: ["Converting complex interactive SVG animations expecting them to play in static JPG format"],
    faqs: [
      { q: "What background color is used?", a: "Since JPG does not support transparency, transparent areas are filled with solid white." }
    ]
  },
  "svg-to-webp": {
    purpose: "convert vector SVG files into optimized WebP format",
    mechanism: "rasterizes SVG curves and exports them as optimized WebP image blobs",
    why: "Sharing vector assets on websites is sometimes risky due to security vulnerabilities in raw SVG XML; WebP is a secure, optimized alternative.",
    useCase: "creating secure web graphics, optimizing icons, and saving bandwidth",
    steps: [
      "Select the SVG file.",
      "Set the desired width and height.",
      "Convert and download the WebP file."
    ],
    advs: ["Generates highly optimized modern web graphics", "Retains alpha transparency vectors", "Zero network data leakage risks"],
    errors: ["Expecting the output WebP file to remain editable as vector shapes"],
    faqs: [
      { q: "Is WebP vector-based?", a: "No. WebP is a raster format, meaning the vector SVG is converted into a grid of pixels." }
    ]
  },
  "png-to-svg": {
    purpose: "convert PNG raster images into scalable SVG vector graphics",
    mechanism: "traces raster pixel boundaries using local image vectorization scripts",
    why: "Raster PNGs pixelate when scaled up; vector SVGs can be enlarged infinitely without losing quality.",
    useCase: "vectorizing logos, creating scalable illustrations, and converting low-res scans",
    steps: [
      "Upload your PNG file.",
      "Configure tracing threshold options.",
      "Generate and download the vector SVG file."
    ],
    advs: ["Traces pixel edges to create scalable vector paths", "Saves time compared to manual tracing in design tools", "Runs 100% locally in browser RAM"],
    errors: ["Uploading complex photographs expecting clean vector paths; works best on solid logos/icons"],
    faqs: [
      { q: "Can I vectorize a photo?", a: "Tracing photos results in massive files with thousands of complex paths. The tool works best for logos, shapes, and text designs." }
    ]
  },
  "jpg-to-svg": {
    purpose: "convert JPG photographic images to scalable SVG vector files",
    mechanism: "traces JPG pixel matrices to generate vector equations client-side",
    why: "JPG logos blur when stretched; converting to SVG allows infinite scaling for billboards or responsive webs.",
    useCase: "vectorizing simple sketches, logos, and icons",
    steps: [
      "Upload your JPG photo.",
      "Select color contrast parameters.",
      "Convert to SVG and save."
    ],
    advs: ["Traces high-contrast JPGs to SVG paths", "Creates editable vector lines from flat images", "Zero remote data transfers"],
    errors: ["Vectorizing highly detailed photo landscapes, which creates bloated XML files"],
    faqs: [
      { q: "Will the SVG look identical?", a: "Tracing converts pixel grids to flat color regions. It will look like a stylized or vectorized version of the original image." }
    ]
  },
  "webp-to-svg": {
    purpose: "convert WebP images into scalable vector SVG files",
    mechanism: "traces WebP pixel structures to compile SVG vector paths",
    why: "Extracting scalable logos from WebP web images is difficult without tracing software.",
    useCase: "saving vector icons from web assets and preparing graphics for edit",
    steps: [
      "Select your WebP image.",
      "Set path optimization constraints.",
      "Download the vector SVG file."
    ],
    advs: ["Transforms web graphics to editable vectors", "Runs client-side in secure memory", "No software installs"],
    errors: ["Tracing blurred WebP graphics, resulting in jagged vector edges"],
    faqs: [
      { q: "Does it support color vectorization?", a: "Yes, the tracing script groups matching pixel clusters into colored vector paths." }
    ]
  },
  "image-metadata-viewer": {
    purpose: "extract and display hidden EXIF metadata from photo files",
    mechanism: "reads the binary header blocks (EXIF, TIFF directories) of uploaded images",
    why: "Photos taken by smartphones contain sensitive GPS location history, camera serials, and timestamps that pose privacy risks.",
    useCase: "checking photo capture times, verifying camera settings, and auditing privacy tags before sharing",
    steps: [
      "Upload a JPEG, PNG, or WebP photo.",
      "Review the parsed metadata tables shown on the screen.",
      "Toggle between EXIF, GPS, and camera hardware tags."
    ],
    advs: ["Displays camera shutter, ISO, date, and lens metrics", "Shows geolocation tags with map coordinates", "Runs entirely client-side to ensure privacy"],
    errors: ["Expecting metadata from images that have been processed by social media platforms, which strip EXIF tables"],
    faqs: [
      { q: "Are my photos uploaded to find the metadata?", a: "No. The parsing code runs in your browser; your photos never leave your device." }
    ]
  },
  "image-dimension-checker": {
    purpose: "inspect the exact pixel resolution of image files",
    mechanism: "reads image headers and natural widths/heights in-memory",
    why: "Verifying if an image fits web portal rules or standard dimensions manually is slow.",
    useCase: "checking profile picture specifications, banner aspect ratios, and design sizes",
    steps: [
      "Select and drop your image file.",
      "Check the instant resolution indicator (Width x Height in pixels).",
      "Inspect the calculated aspect ratio (e.g. 16:9)."
    ],
    advs: ["Calculates exact aspect ratios instantly", "Supports multi-file dropping", "Operates offline in your browser"],
    errors: ["Pasting corrupted image files that fail browser rendering"],
    faqs: [
      { q: "Does it support multiple images?", a: "Yes, you can drop several images to inspect their sizes sequentially." }
    ]
  },
  "image-format-detector": {
    purpose: "detect the true MIME type and format headers of image files",
    mechanism: "inspects the first few bytes (magic numbers) of the file binary stream",
    why: "Files often have incorrect extensions, leading to upload failures on strict portals.",
    useCase: "troubleshooting corrupted images and verifying true file types",
    steps: [
      "Upload the image file.",
      "Review the true detected file type and MIME standard.",
      "Verify if it matches the active filename extension."
    ],
    advs: ["Reads file binary headers rather than trusting name extensions", "Identifies hidden file formats safely", "Runs client-side in secure sandbox"],
    errors: ["Expecting the tool to fix a corrupted file; it only diagnoses the true format"],
    faqs: [
      { q: "What are 'magic numbers'?", a: "They are unique byte signatures at the start of files that identify the file format, regardless of its name." }
    ]
  },
  "color-picker-from-image": {
    purpose: "extract exact colors from photos using an interactive eyedropper",
    mechanism: "renders the photo to a canvas and reads pixel RGBA values on click",
    why: "Matching exact colors from photos for designs or website themes is tedious.",
    useCase: "matching color schemes, choosing design assets, and analyzing color palettes",
    steps: [
      "Upload your photo.",
      "Click on the image preview to pick any pixel color.",
      "Copy the HEX, RGB, or HSL color codes displayed."
    ],
    advs: ["Interactive zoom preview for precise pixel selections", "Exports HEX, RGB, and HSL values", "Runs offline securely"],
    errors: ["Picking colors from highly compressed low-quality JPGs, which have color noise"],
    faqs: [
      { q: "Can I pick colors from transparent areas?", a: "Yes, the picker will read transparent pixels as empty or white, displaying alpha values." }
    ]
  },
  "image-color-palette-extractor": {
    purpose: "generate dominant color palettes from images",
    mechanism: "applies color quantization (median cut) algorithms to cluster pixel colors",
    why: "Creating harmonious designs that match photo color themes manually takes time.",
    useCase: "building web stylesheets, designing branding packages, and analyzing artwork color structures",
    steps: [
      "Select and upload the image file.",
      "Choose the target palette size (e.g. 5 or 8 colors).",
      "Copy the generated HEX palettes with one click."
    ],
    advs: ["Extracts dominant color palettes automatically", "Provides complementary color coordinates", "Runs 100% locally"],
    errors: ["Uploading black-and-white photos expecting vibrant palettes"],
    faqs: [
      { q: "How does it cluster colors?", a: "It uses pixel color clustering to group similar shades, selecting the most prominent groups." }
    ]
  },
  "image-to-base64": {
    purpose: "convert image files to Base64 encoded data URI strings",
    mechanism: "reads the file as binary buffer and encodes it into Base64 ASCII text",
    why: "Embedding small images directly into HTML or CSS reduces HTTP requests, speeding up web loading.",
    useCase: "inline coding for web developers, setting email signature graphics, and embedding icons",
    steps: [
      "Upload your image file.",
      "Copy the generated Base64 data URL string.",
      "Paste the code directly in your HTML `<img>` tag or CSS file."
    ],
    advs: ["Generates copy-paste ready HTML, CSS, and raw Base64 outputs", "Runs offline in browser cache", "Protects sensitive graphic files"],
    errors: ["Converting large multi-megabyte photos, which inflates code file size dramatically"],
    faqs: [
      { q: "Is there a file size limit?", a: "We recommend keeping images under 50KB when using Base64 to prevent bloated web code." }
    ]
  },
  "base64-to-image": {
    purpose: "decode Base64 data strings back into image files",
    mechanism: "converts Base64 text back into binary file blobs",
    why: "Extracting or viewing images that are stored as Base64 strings in database dumps is difficult without a decoder.",
    useCase: "debugging API payloads, extracting inline web graphics, and viewing database assets",
    steps: [
      "Paste the Base64 code string into the input box.",
      "Check the decoded image preview on screen.",
      "Download the image file (usually PNG or JPG) to your device."
    ],
    advs: ["Decodes and previews data URIs instantly", "Supports multiple image mime formats", "Runs client-side securely"],
    errors: ["Pasting incomplete or truncated Base64 strings, which causes decoding errors"],
    faqs: [
      { q: "What happens if there's no mime prefix?", a: "The decoder will attempt to auto-detect the image type from the binary headers." }
    ]
  },
  "crop-image": {
    purpose: "crop image boundaries to adjust layout structures",
    mechanism: "manipulates canvas clipping paths based on interactive drag coordinates",
    why: "Removing unwanted background edges or sizing photos to fit specific aspect ratios requires crop tools.",
    useCase: "cropping profile avatar shapes, adjusting photo compositions, and framing web graphics",
    steps: [
      "Upload the image you want to crop.",
      "Drag the crop handles or select an aspect ratio preset.",
      "Click crop and download your cropped image."
    ],
    advs: ["Interactive crop handles with grid lines", "Supports preset aspect ratios like 1:1, 16:9, and 4:3", "Works client-side for complete safety"],
    errors: ["Cropping too tightly and losing original image elements that cannot be restored after download"],
    faqs: [
      { q: "Can I crop to a circle?", a: "This crop tool generates standard rectangular grids, but you can set aspect ratios for avatars." }
    ]
  },
  "image-resizer": {
    purpose: "resize image dimensions while maintaining or modifying proportions",
    mechanism: "draws pixel matrices onto scaled canvases using interpolation algorithms",
    why: "Heavy resolutions exceed upload limits and slow down websites. Scaling down resolution saves space.",
    useCase: "scaling banners, resizing photos for social grids, and fitting upload specs",
    steps: [
      "Upload your photo file.",
      "Enter custom width and height dimensions, or select percentage scales.",
      "Toggle the aspect ratio lock setting.",
      "Download the resized image file."
    ],
    advs: ["Locks aspect ratio to prevent image stretching", "Reduces file size along with pixel width/height", "Runs locally on your device CPU"],
    errors: ["Scaling up small images, which causes pixelation and blur"],
    faqs: [
      { q: "What is interpolation?", a: "It's the algorithm the browser uses to calculate new pixel colors when scaling images up or down." }
    ]
  },
  "rotate-image": {
    purpose: "rotate images by custom degrees",
    mechanism: "rotates canvas coordinates and redraws image matrices on-device",
    why: "Photos captured by mobile devices often have wrong orientation metadata, appearing sideways.",
    useCase: "correcting sideways camera shots and rotating graphic layouts",
    steps: [
      "Upload your image file.",
      "Use the rotation controls to rotate 90 degrees or enter custom degrees.",
      "Download the rotated image."
    ],
    advs: ["Rotates images by custom angles or standard increments", "Maintains original image quality", "Zero server uploads"],
    errors: ["Rotating images repeatedly, which can lead to compression losses on lossy files"],
    faqs: [
      { q: "Does this affect the file format?", a: "No, it saves the output in the same format as your input unless customized." }
    ]
  },
  "flip-image": {
    purpose: "mirror images horizontally or vertically",
    mechanism: "scales canvas vectors by negative metrics to invert image matrices",
    why: "Selfies and webcam shots are often inverted, appearing backwards.",
    useCase: "correcting mirrored camera photos and creating symmetrical design layouts",
    steps: [
      "Upload your photo.",
      "Click Flip Horizontal or Flip Vertical.",
      "Save the mirrored output image."
    ],
    advs: ["Flips images horizontally or vertically in milliseconds", "Runs locally in browser RAM", "No accounts required"],
    errors: ["Flipping text layers, which makes the text unreadable"],
    faqs: [
      { q: "Can I flip both ways?", a: "Yes, you can apply both horizontal and vertical flips before saving." }
    ]
  },
  "image-upscaler": {
    purpose: "enlarge small images using canvas smoothing filters",
    mechanism: "applies bilinear or bicubic interpolation algorithms client-side",
    why: "Blowing up small graphics using standard software results in jagged pixel borders.",
    useCase: "enlarging website icons, cleaning low-res clips, and prepping graphics for print",
    steps: [
      "Upload your graphic file.",
      "Select your magnification factor (e.g. 2x, 4x).",
      "Save the upscaled image."
    ],
    advs: ["Smooths jagged edges using advanced browser filters", "Runs in client web tab browser cache", "No watermarks"],
    errors: ["Expecting upscaling to add fine photographic details that were never in the source file"],
    faqs: [
      { q: "Is this AI-based upscaling?", a: "It uses mathematical pixel smoothing algorithms in your browser rather than heavy server-side AI models." }
    ]
  },
  "image-enhancer": {
    purpose: "auto-enhance image lighting and color balance",
    mechanism: "applies histogram equalization and contrast filters client-side",
    why: "Photos are often dark, washed out, or lack color pop when captured in low light.",
    useCase: "improving photo exposure, brightening dark shots, and editing blog graphics",
    steps: [
      "Select your photo.",
      "Click Auto-Enhance or manually adjust parameters.",
      "Save the optimized photo."
    ],
    advs: ["Applies balanced light and color adjustments instantly", "Provides before-and-after previews", "Secure client-side execution"],
    errors: ["Enhancing low-res images, which can amplify image noise and grain"],
    faqs: [
      { q: "Can I adjust individual settings?", a: "Yes, the enhancer offers sliders for exposure, saturation, and contrast." }
    ]
  },
  "image-sharpen": {
    purpose: "sharpen blurry photos to improve edge crispness",
    mechanism: "applies high-pass convolution filters to highlight edges client-side",
    why: "Slight camera shake or soft focus makes images look blurry and unprofessional.",
    useCase: "fixing soft-focus photos, highlighting design details, and prepping prints",
    steps: [
      "Upload your photo.",
      "Adjust the sharpen radius and threshold sliders.",
      "Download the sharpened photo."
    ],
    advs: ["High-pass convolution filters enhance edge details", "Adjustable sliders prevent over-sharpening", "Runs locally in RAM"],
    errors: ["Over-sharpening, which creates harsh outlines and pixel noise"],
    faqs: [
      { q: "Can this fix highly blurred photos?", a: "It enhances soft details, but extreme motion blur cannot be fully corrected by standard sharpen filters." }
    ]
  },
  "image-denoiser": {
    purpose: "remove digital grain and noise from photos",
    mechanism: "applies bilateral or median blur filters to smooth out pixel noise client-side",
    why: "Photos taken in low-light settings have speckles and noise that degrade quality.",
    useCase: "cleaning low-light photos, fixing grain, and refining graphics",
    steps: [
      "Select the grainy photo.",
      "Adjust the noise reduction slider.",
      "Download the smoothed output image."
    ],
    advs: ["Median and bilateral filters smooth noise while preserving edges", "Reduces speckle artifacts", "Runs locally in browser cache"],
    errors: ["Applying too much noise reduction, which makes skin or textures look unnaturally plastic"],
    faqs: [
      { q: "Will my image lose sharpness?", a: "Bilateral filters attempt to preserve edges, but high denoising levels will naturally soften details." }
    ]
  },
  "brightness-and-contrast-adjuster": {
    purpose: "adjust exposure and contrast levels of photos",
    mechanism: "applies brightness and contrast filters to the canvas rendering context",
    why: "Improper lighting makes images look dark, flat, or overexposed.",
    useCase: "correcting backlit photos, improving contrast, and editing graphics",
    steps: [
      "Upload your photo.",
      "Adjust the brightness and contrast sliders.",
      "Download the edited image."
    ],
    advs: ["Adjusts light levels in real-time", "Simple, responsive slider controls", "100% secure client-side processing"],
    errors: ["Increasing brightness too much, causing washed-out highlights"],
    faqs: [
      { q: "Does this affect the original photo file?", a: "No, all edits are applied to a new file that you download." }
    ]
  },
  "color-adjuster": {
    purpose: "fine-tune saturation, hue, and color temperature of images",
    mechanism: "adjusts HSL and color matrix values client-side",
    why: "Photos often look cold, warm, or have incorrect color casts depending on lighting.",
    useCase: "fixing color casts, making colors pop, and applying warm filters",
    steps: [
      "Upload your photo file.",
      "Use sliders to adjust saturation, hue, and temperature.",
      "Save the color-corrected image."
    ],
    advs: ["Complete color correction sliders in-browser", "No loss of resolution", "Processed in memory for safety"],
    errors: ["Over-saturating photos, which causes unnatural neon colors"],
    faqs: [
      { q: "Can I reset adjustments?", a: "Yes, you can reset sliders to original settings at any time." }
    ]
  },
  "grayscale": {
    purpose: "convert color images to grayscale",
    mechanism: "weights color channels (0.299R + 0.587G + 0.114B) to calculate gray pixel values",
    why: "Converting photos to black-and-white is a standard requirement for documents or aesthetic styling.",
    useCase: "creating monochrome designs, printing documents, and styling web graphics",
    steps: [
      "Upload your color image.",
      "Click convert to apply grayscale weighting.",
      "Download the monochrome image file."
    ],
    advs: ["Applies standard weighted grayscale conversion", "Runs offline in browser cache", "No limits or watermarks"],
    errors: ["Expecting to retrieve original color values after converting and saving the grayscale file"],
    faqs: [
      { q: "Is the original color file overwritten?", a: "No, the tool generates a new grayscale file for download." }
    ]
  },
  "color-to-black-and-white": {
    purpose: "convert color photos to high-contrast black and white images",
    mechanism: "evaluates pixel brightness against thresholds to output binary black or white pixels",
    why: "Standard grayscale keeps gray tones, whereas black-and-white creates pure high-contrast silhouettes.",
    useCase: "creating stencil patterns, prep for vinyl cut, and high-contrast styling",
    steps: [
      "Upload your image.",
      "Adjust the threshold slider to set the black/white balance.",
      "Save the high-contrast graphic."
    ],
    advs: ["Creates pure threshold-based black and white stencils", "Adjustable threshold slider for detailed control", "Processed on-device"],
    errors: ["Converting low-contrast photos, which creates blobby, unrecognizable outputs"],
    faqs: [
      { q: "What is threshold?", a: "It is the brightness level that determines whether a pixel is turned to pure white or pure black." }
    ]
  },
  "black-and-white-to-color": {
    purpose: "tint black and white images with warm color washes",
    mechanism: "maps pixel luminance values to custom color gradients client-side",
    why: "Old historical photos look cold in pure gray; applying warm sepia tints adds depth.",
    useCase: "applying warm tones, sepia effects, and creative design styling",
    steps: [
      "Upload your monochrome image.",
      "Select color tint presets (sepia, warm gold, cool blue).",
      "Save the tinted image."
    ],
    advs: ["Applies vintage sepia and duotone tints", "Runs in browser memory with zero uploads", "No signup required"],
    errors: ["Expecting the tool to automatically restore original photographic colors; it applies stylized tints"],
    faqs: [
      { q: "Does this colorize old photos like AI?", a: "It applies uniform sepia or color washes; it does not predict individual colors of objects." }
    ]
  },
  "blur-image": {
    purpose: "apply Gaussian blur to images",
    mechanism: "convolves pixel matrices with Gaussian weighting profiles client-side",
    why: "Hiding background details or creating soft graphics is necessary for web backgrounds.",
    useCase: "blurring backgrounds, hiding text, and creative layouts",
    steps: [
      "Select your image file.",
      "Use the slider to adjust the blur radius.",
      "Save the blurred image."
    ],
    advs: ["Applies smooth adjustable Gaussian blur", "Processed in memory securely", "No watermarks"],
    errors: ["Blurring important credentials and sharing the file, as extreme de-blurring can sometimes recover text shape"],
    faqs: [
      { q: "Is the blur reversible after saving?", a: "No, once saved and downloaded, the blurred pixels are permanent." }
    ]
  },
  "pixelate-image": {
    purpose: "pixelate images with customizable block sizes",
    mechanism: "scales the canvas down and scales it back up using pixelated rendering algorithms",
    why: "Censoring sensitive faces or details in screenshots requires pixelation tools.",
    useCase: "censoring faces, blurring license plates, and retro design styling",
    steps: [
      "Upload your image file.",
      "Adjust the pixel size slider.",
      "Download the pixelated image."
    ],
    advs: ["Adjustable censor block size", "Runs offline on your CPU", "Ensures privacy by altering pixel data permanently"],
    errors: ["Using too small pixel blocks, which might fail to censor sensitive text fully"],
    faqs: [
      { q: "Does this protect my identity?", a: "Yes, pixelation alters the pixel values permanently, making reconstruction impossible if the block size is large enough." }
    ]
  },
  "add-watermark-to-image": {
    purpose: "add repeating text watermarks to protect images",
    mechanism: "overlays repeating text lines on canvas with transparency controls",
    why: "Photographers and creators need to protect their work from unauthorized sharing.",
    useCase: "protecting online store listings, watermarking portfolios, and brand protection",
    steps: [
      "Select your image file.",
      "Type your watermark text and adjust opacity and spacing.",
      "Save the protected image."
    ],
    advs: ["Supports repeating grid watermarks", "Adjustable opacity and rotation", "100% secure on-device processing"],
    errors: ["Using too low opacity, allowing thieves to erase watermarks easily"],
    faqs: [
      { q: "Can the watermark be removed?", a: "Once printed onto the image pixels, the watermark cannot be easily removed without cropping or editing." }
    ]
  },
  "add-text-on-image": {
    purpose: "write customizable text onto images",
    mechanism: "renders text strings on canvas coordinates with custom font metrics",
    why: "Creating social graphics or adding captions to images requires text overlay tools.",
    useCase: "adding captions, creating memes, and designing social posts",
    steps: [
      "Upload the photo.",
      "Click to add text boxes, type your text, and choose fonts/colors.",
      "Download the captioned photo."
    ],
    advs: ["Custom fonts, colors, and positioning", "Clean text rendering layout", "Runs locally in browser RAM"],
    errors: ["Adding text too close to margins where it might get cropped on sharing sites"],
    faqs: [
      { q: "What fonts are supported?", a: "It supports standard system fonts and custom Google Fonts loaded in the page." }
    ]
  },
  "add-logo-overlay": {
    purpose: "overlay a secondary logo image on top of another photo",
    mechanism: "draws multiple image layers onto a single canvas workspace",
    why: "Adding brand logos to product photos or overlaying watermarks is slow in complex editors.",
    useCase: "branding product photos, adding logo badges, and creating layouts",
    steps: [
      "Upload the base photo.",
      "Upload your logo graphic (transparent PNG is recommended).",
      "Position and scale the logo overlay, then save."
    ],
    advs: ["Supports logo resizing and transparency adjustment", "Ensures logos remain sharp during merge", "Processed client-side safely"],
    errors: ["Using logo files with solid background colors instead of transparent PNG formats"],
    faqs: [
      { q: "Can I overlay multiple logos?", a: "The tool is optimized for placing a single logo or icon overlay." }
    ]
  },

  // --- PDF TOOLS ---
  "merge-pdf": {
    purpose: "combine multiple PDF documents into a single file",
    mechanism: "parses multiple PDF binary buffers and stitches their page dictionaries together client-side",
    why: "Managing dozens of separate receipts or invoices is chaotic; merging them makes folders organized.",
    useCase: "combining invoice logs, gathering homework sheets, and compiling portfolio chapters",
    steps: [
      "Select and upload multiple PDF files.",
      "Drag and drop files to set the page order.",
      "Click merge and download the unified PDF."
    ],
    advs: ["Maintains document hyperlink and outline catalogs", "Supports merging dozens of files at once", "Runs locally on your CPU for secure files"],
    errors: ["Attempting to merge encrypted PDFs without entering passwords first"],
    faqs: [
      { q: "Is there a file count limit?", a: "No, but merging massive files is limited by your browser tab's RAM. Keep totals under 200MB for smooth operation." }
    ]
  },
  "split-pdf": {
    purpose: "divide a PDF into separate files by page ranges",
    mechanism: "extracts selected page directories and writes them into separate PDF files",
    why: "Sending a heavy 100-page corporate report is slow when you only need to share a single chapter.",
    useCase: "extracting tax chapters, splitting book segments, and dividing invoice logs",
    steps: [
      "Upload your PDF document.",
      "Enter target page ranges (e.g. '1-3, 5-8').",
      "Click split and download the resulting files."
    ],
    advs: ["Splits files by exact page ranges", "Maintains original document styling and vectors", "Processed client-side safely"],
    errors: ["Typing incorrect page formats (e.g., entering letters instead of number indexes)"],
    faqs: [
      { q: "Does this reduce page resolution?", a: "No. The pages are extracted as vector assets; no quality loss occurs." }
    ]
  },
  "rotate-pdf": {
    purpose: "rotate PDF document pages by 90, 180, or 270 degrees",
    mechanism: "updates the rotation metadata flags in the PDF catalog structure",
    why: "Sideways scans are impossible to read or present professionally.",
    useCase: "correcting sideways scans, turning landscape charts, and preparing files",
    steps: [
      "Upload your PDF document.",
      "Select specific pages to rotate, and click rotation angles.",
      "Download the rotated PDF."
    ],
    advs: ["Reorients pages without re-compressing vectors, keeping layout sharp", "Rotates individual pages or the entire document", "Runs offline client-side"],
    errors: ["Forgetting to save rotations before clicking download"],
    faqs: [
      { q: "Will the text remain selectable?", a: "Yes, since the tool only rotates page orientation tags rather than flat raster images, text remains selectable." }
    ]
  },
  "delete-pdf-pages": {
    purpose: "remove selected pages from PDF documents",
    mechanism: "filters out unwanted page indices from the document catalog tree",
    why: "Draft agreements often contain empty pages or obsolete clauses that need removal.",
    useCase: "purging empty layout pages, removing outdated contract slides, and cleaning documents",
    steps: [
      "Select and upload your PDF file.",
      "Click on page thumbnails to select pages for deletion.",
      "Save the cleaned PDF document."
    ],
    advs: ["Visual thumbnail preview makes page selection easy", "Purges pages in seconds in-memory", "100% secure client-side execution"],
    errors: ["Deleting wrong page pages and not keeping a backup copy"],
    faqs: [
      { q: "Can I recover deleted pages?", a: "Once downloaded, pages are removed. Make sure to keep your original file as a backup." }
    ]
  },
  "rearrange-pdf-pages": {
    purpose: "reorder the pages of a PDF document",
    mechanism: "rearranges the page index arrays in the PDF tree structure",
    why: "Scanned pages are often compiled out-of-order, creating confusing reading layouts.",
    useCase: "fixing scanned page orders, re-ordering slides, and organizing essays",
    steps: [
      "Upload the PDF document.",
      "Drag and drop page thumbnails to set the order.",
      "Click rearrange to save the new document order."
    ],
    advs: ["Visual drag-and-drop page sorting", "Processes PDF layouts instantly", "Runs locally in browser RAM"],
    errors: ["Dropping pages in incorrect positions without checking page numbers"],
    faqs: [
      { q: "Does it work for large PDFs?", a: "Yes, but rendering dozens of thumbnails requires browser memory. Keep files under 100 pages for best speed." }
    ]
  },
  "extract-pdf-pages": {
    purpose: "extract specific pages from a PDF document",
    mechanism: "copies selected page references into a new PDF document container",
    why: "You often need to save only the signature page or summary charts from a heavy document.",
    useCase: "saving signature pages, extracting charts, and separating statements",
    steps: [
      "Upload your PDF file.",
      "Select target page numbers visually or enter ranges.",
      "Extract and download the new document."
    ],
    advs: ["Extracts pages cleanly into a new lightweight PDF", "Preserves interactive forms and select text", "Runs client-side for safety"],
    errors: ["Extracting empty ranges or invalid page indexes"],
    faqs: [
      { q: "Does it extract images?", a: "It extracts the entire page layout; if you want to extract images only, use the PDF Image Extractor tool." }
    ]
  },
  "jpg-to-pdf": {
    purpose: "convert JPG images into a single PDF document",
    mechanism: "renders image frames onto PDF coordinate planes and packages them into a document",
    why: "Portals require scanned document pages to be uploaded as a single PDF rather than separate image files.",
    useCase: "combining passport photos, scanning receipts, and packaging portfolios",
    steps: [
      "Upload one or more JPG images.",
      "Set page layout preferences (margins, orientation).",
      "Convert and download the unified PDF document."
    ],
    advs: ["Packs multiple photos into a single structured PDF", "Maintains original image resolution", "Processed locally for secure documents"],
    errors: ["Adding heavy images, which makes the output PDF file extremely large"],
    faqs: [
      { q: "Can I adjust margins?", a: "Yes, you can configure margin sizes and fit orientations before conversion." }
    ]
  },
  "pdf-to-jpg": {
    purpose: "convert PDF document pages into high-resolution JPG images",
    mechanism: "rasterizes PDF pages using browser canvas rendering engines (pdf.js)",
    why: "Sharing specific PDF charts or slides on social channels or presentations requires image formats.",
    useCase: "posting document charts, converting presentations to slides, and viewing files on mobile",
    steps: [
      "Upload the PDF document.",
      "Select resolution scaling quality.",
      "Convert and download pages as a ZIP folder of JPG images."
    ],
    advs: ["Rasterizes PDF vectors to sharp, high-res JPGs", "Downloads all pages grouped in a ZIP package", "Executes locally in browser memory"],
    errors: ["Expecting converted JPG text to remain selectable (images are flat pixels)"],
    faqs: [
      { q: "Does this support multi-page PDFs?", a: "Yes. Every page is converted into a separate JPG file." }
    ]
  },
  "compress-pdf": {
    purpose: "optimize and reduce PDF file sizes",
    mechanism: "compresses embedded images and downscales vector resolutions client-side",
    why: "PDF documents with many images are often too heavy for email attachments and portal upload limits.",
    useCase: "shrinking portfolios, compressing scanned reports, and meeting email limits",
    steps: [
      "Upload your heavy PDF file.",
      "Select compression density settings.",
      "Save the optimized, lightweight PDF."
    ],
    advs: ["Reduces PDF weight while preserving readable text layouts", "Strips unneeded metadata and structures", "100% secure client-side execution"],
    errors: ["Compressing already optimized PDFs, which may degrade image quality without saving space"],
    faqs: [
      { q: "Will the text quality degrade?", a: "No. The compressor targets image assets inside the PDF; vector text lines remain perfectly sharp." }
    ]
  },
  "sign-pdf": {
    purpose: "place digital signatures onto PDF pages",
    mechanism: "draws signature lines or overlays signature images onto PDF layouts in browser",
    why: "Printing, signing, and scanning contracts manually is slow and wastes paper.",
    useCase: "signing rental agreements, signing client contracts, and marking reports",
    steps: [
      "Upload your PDF contract document.",
      "Draw your signature or upload a transparent signature image.",
      "Place and scale the signature on the page, then save."
    ],
    advs: ["Draw or upload signature layers easily", "Supports placing signatures on multiple page locations", "Runs locally in browser RAM for maximum security"],
    errors: ["Forgetting that standard digital overlays are not cryptographically binding certificates"],
    faqs: [
      { q: "Is this signature legally binding?", a: "It is a standard visual signature overlay. For official or corporate audits, verify whether your portal accepts scanned/drawn signatures." }
    ]
  },
  "watermark-pdf": {
    purpose: "add text or image watermarks to PDF pages",
    mechanism: "renders overlay layers on PDF page canvas coordinates client-side",
    why: "Preventing unauthorized copying of draft publications or contract agreements requires clear watermarks.",
    useCase: "watermarking draft manuscripts, branding reports, and protecting statements",
    steps: [
      "Upload your PDF file.",
      "Type your watermark text or select a watermark logo image.",
      "Set opacity, rotation, and save the watermarked PDF."
    ],
    advs: ["Supports both custom text and logo graphic watermarks", "Adjustable opacity and rotation parameters", "Zero server uploads"],
    errors: ["Watermarking over critical text, making the document hard to read"],
    faqs: [
      { q: "Can the watermark cover all pages?", a: "Yes, you can choose to apply the watermark to all pages or specific page ranges." }
    ]
  },
  "protect-pdf": {
    purpose: "encrypt and password-protect PDF files",
    mechanism: "encrypts PDF binary streams with passwords using browser encryption libraries",
    why: "Sharing confidential bank statements, tax records, or legal contracts over email poses interception risks.",
    useCase: "encrypting tax statements, locking legal files, and protecting personal details",
    steps: [
      "Select the PDF file to encrypt.",
      "Type a secure password in the input field.",
      "Set document permission flags (e.g., block printing or copying).",
      "Save the encrypted, locked PDF."
    ],
    advs: ["Locks files with standard PDF encryption", "Allows setting custom user permissions", "Runs client-side securely"],
    errors: ["Forgetting the password, as encrypted files cannot be recovered without it"],
    faqs: [
      { q: "Can I block printing?", a: "Yes, you can toggle permissions to restrict printing, editing, and copying of your PDF content." }
    ]
  },
  "metadata-viewer": {
    purpose: "inspect hidden metadata inside PDF files",
    mechanism: "parses the metadata catalog dictionary of PDF files in the browser",
    why: "PDFs contain hidden creation dates, author names, and software footprints that you may want to check.",
    useCase: "verifying document author details, auditing file edit dates, and checking metadata sizes",
    steps: [
      "Upload your PDF document.",
      "Inspect the parsed metadata table showing author, creator, creation date, and software.",
      "Verify the document statistics."
    ],
    advs: ["Extracts creation dates, author fields, and software details", "Processed on-device in browser memory", "Simple table overview"],
    errors: ["Expecting metadata from files that have been explicitly stripped of catalog details"],
    faqs: [
      { q: "Can I edit the metadata?", a: "This tool is a viewer; to edit metadata, search for dedicated PDF editors." }
    ]
  },
  "page-counter": {
    purpose: "count pages of multiple PDF documents",
    mechanism: "reads the page catalog index count of uploaded PDF documents",
    why: "Manually opening and counting pages of dozens of PDFs to calculate print totals is tedious.",
    useCase: "estimating printing costs, auditing document lengths, and sorting invoice packets",
    steps: [
      "Upload one or more PDF files.",
      "Review the total page count calculated for each file and the grand total.",
      "Check document summaries."
    ],
    advs: ["Counts pages of multiple PDFs simultaneously", "Calculates total sheets needed for printing", "Runs locally in browser RAM"],
    errors: ["Uploading corrupted PDFs that cannot be parsed by the browser"],
    faqs: [
      { q: "Are my files uploaded to count them?", a: "No, the parsing code runs entirely inside your browser tab." }
    ]
  },
  "pdf-to-text": {
    purpose: "extract selectable text from PDF documents",
    mechanism: "extracts text character vectors from PDF page streams using client-side parsers",
    why: "Copying text content from a heavy PDF document page-by-page is slow and tedious.",
    useCase: "copying content from ebooks, extracting reports, and analyzing text dumps",
    steps: [
      "Upload your PDF file.",
      "Wait for the text extraction to complete locally.",
      "Copy the extracted text to your clipboard or save it as a text file."
    ],
    advs: ["Extracts text from all document pages quickly", "Runs entirely client-side, keeping data secure", "No account required"],
    errors: ["Extracting text from scanned image PDFs; this tool works on native digital vector PDFs"],
    faqs: [
      { q: "Can it extract text from scanned images?", a: "This tool extracts selectable digital text. For scanned paper documents, OCR (Optical Character Recognition) is required." }
    ]
  },

  // --- QR CODE TOOLS ---
  "qr-code-generator": {
    purpose: "generate custom, styled QR codes",
    mechanism: "compiles text strings into matrix grids with Reed-Solomon error correction and exports SVGs",
    why: "Sharing links or text manually leads to spelling errors. QR codes allow quick scanning.",
    useCase: "printing codes for flyers, generating app download links, and business card setups",
    steps: [
      "Type or paste your link/text into the generator.",
      "Adjust styling settings (colors, block sizes).",
      "Download the vector SVG or PNG QR code."
    ],
    advs: ["Exports vector SVG graphics for sharp printing", "Includes adjustable error correction levels", "Generates permanent static codes"],
    errors: ["Generating low-contrast codes that are hard for cameras to scan"],
    faqs: [
      { q: "Do these QR codes expire?", a: "No. These are static codes containing data directly; they function permanently without expiration." }
    ]
  },
  "qr-code-scanner": {
    purpose: "scan and decode QR codes from camera feeds or files",
    mechanism: "applies image binarization and pattern recognition client-side to locate and decode codes",
    why: "You often need to decode QR codes from screenshots, files, or using a laptop camera.",
    useCase: "decoding QR codes from invoice images, scanning links, and testing print graphics",
    steps: [
      "Upload a QR code image file or enable your camera feed.",
      "Hold the QR code up to the scanner.",
      "Copy the decoded link or text output."
    ],
    advs: ["Decodes from both camera feeds and image files", "Runs locally in browser memory for secure scans", "Works offline instantly"],
    errors: ["Scanning highly blurred or low-contrast images"],
    faqs: [
      { q: "Is my camera feed private?", a: "Yes. The camera feed is processed in real-time in your browser memory; no video is ever sent to a server." }
    ]
  },
  "url-qr-code-generator": {
    purpose: "convert website addresses into scannable QR codes",
    mechanism: "encodes URL strings into QR code matrix grids",
    why: "Typing long URL paths on smartphones is frustrating and error-prone.",
    useCase: "sharing menus, linking product landing pages, and linking portfolios",
    steps: [
      "Enter the destination website URL.",
      "Select color and dot size parameters.",
      "Save the generated QR code graphic."
    ],
    advs: ["Specifically optimized for web links and URLs", "Exports sharp vector SVG paths", "Runs offline client-side"],
    errors: ["Entering broken or incorrect URLs that direct users to 404 pages"],
    faqs: [
      { q: "Can I change the URL later?", a: "No, these are static codes. To change the link, you must generate a new QR code." }
    ]
  },
  "text-qr-code-generator": {
    purpose: "convert plain text messages into scannable QR codes",
    mechanism: "encodes text characters into QR matrix grids",
    why: "Sharing passwords, instructions, or codes physically requires a quick scanner.",
    useCase: "sharing Wi-Fi keys, printing instruction blocks, and writing secure messages",
    steps: [
      "Type your message into the text area.",
      "Set block padding and color layouts.",
      "Download the scannable code image."
    ],
    advs: ["Encodes plain text sentences easily", "Supports large character sets", "Processed client-side safely"],
    errors: ["Packing too much text, which makes the QR dots tiny and hard to scan"],
    faqs: [
      { q: "How much text can I fit?", a: "We recommend keeping text under 300 characters to ensure fast scanning on all phone models." }
    ]
  },
  "wifi-qr-code-generator": {
    purpose: "create scannable QR codes containing Wi-Fi access credentials",
    mechanism: "encodes Wi-Fi format tags `WIFI:S:SSID;T:WPA;P:PASSWORD;;` into QR grids",
    why: "Dictating long, complex Wi-Fi passwords to office visitors is tedious.",
    useCase: "sharing customer Wi-Fi networks in cafes, restaurants, and offices",
    steps: [
      "Enter the Wi-Fi network SSID (name).",
      "Type the password and select the security protocol (WPA/WEP).",
      "Generate and download the scannable code."
    ],
    advs: ["Formats standard Wi-Fi connect strings automatically", "Generates permanent connect codes", "Runs locally in browser RAM"],
    errors: ["Entering wrong Wi-Fi security protocols, which blocks connections"],
    faqs: [
      { q: "Do users need an app to scan?", a: "No, standard smartphone cameras will scan the code and connect to Wi-Fi automatically." }
    ]
  },
  "vcard-qr-code-generator": {
    purpose: "generate contact-sharing vCard QR codes",
    mechanism: "encodes standardized vCard contact strings into QR code grids",
    why: "Sharing phone numbers, emails, and office locations verbally takes time and leads to spelling errors.",
    useCase: "printing contact QR codes on business cards and sharing contact cards physically",
    steps: [
      "Fill in name, phone, email, and company details.",
      "Click generate to encode the vCard structure.",
      "Save and print the QR code."
    ],
    advs: ["Formats standard vCard structure for instant contact import", "Works on business cards", "100% secure client-side execution"],
    errors: ["Adding too many details, making the QR grid extremely dense"],
    faqs: [
      { q: "Does this open a contact card on phones?", a: "Yes. Scanning the code prompts the phone's address book to add the contact details." }
    ]
  },
  "email-qr-code-generator": {
    purpose: "generate email-initiating QR codes",
    mechanism: "encodes standard mailto schemas into QR grids",
    why: "Allowing users to send emails with pre-filled support subjects and body templates increases conversion.",
    useCase: "sharing support links, setting up RSVP emails, and collecting feedback",
    steps: [
      "Enter recipient email address.",
      "Type the pre-filled subject line and message body.",
      "Download the scannable email QR code."
    ],
    advs: ["Pre-fills support subject and message parameters", "Launches mail client instantly on scan", "Processes locally securely"],
    errors: ["Entering invalid email formats"],
    faqs: [
      { q: "What happens on scan?", a: "Scanning the code launches the user's default email app (like Mail, Outlook) with your values pre-filled." }
    ]
  },
  "phone-number-qr-code-generator": {
    purpose: "generate dialer-initiating QR codes",
    mechanism: "encodes tel protocols into QR grids",
    why: "Typing business hotline numbers from billboards is slow.",
    useCase: "printing hotlines on billboards, contact flyers, and brochures",
    steps: [
      "Enter the phone number with country code.",
      "Generate the code and download the SVG/PNG file.",
      "Print the dialer code."
    ],
    advs: ["Formats direct tel links", "Quick phone dialer launch on scan", "Runs client-side securely"],
    errors: ["Forgetting country codes, which might cause wrong dialing"],
    faqs: [
      { q: "Does it make the phone call automatically?", a: "No, it opens the phone dialer pre-loaded with the number, and the user must tap call." }
    ]
  },
  "sms-qr-code-generator": {
    purpose: "generate SMS-initiating QR codes",
    mechanism: "encodes sms protocols into QR grids",
    why: "Collecting SMS alerts or coupon codes manually is frustrating.",
    useCase: "subscribing users to SMS channels and printing coupon alerts",
    steps: [
      "Enter recipient mobile number.",
      "Type the pre-loaded SMS message body.",
      "Generate and save the code."
    ],
    advs: ["Launches SMS messenger with pre-filled values", "Runs offline in browser cache", "No limits or logs"],
    errors: ["Pasting messages that are too long for standard SMS packages"],
    faqs: [
      { q: "Does it send the SMS automatically?", a: "No, it opens the phone's SMS app, and the user must press the send button." }
    ]
  },
  "upi-qr-code-generator": {
    purpose: "generate secure UPI payment QR codes",
    mechanism: "encodes standardized UPI payment strings containing merchant IDs and amounts client-side",
    why: "Typing merchant virtual addresses (VPA) manually leads to failed or wrong transfers.",
    useCase: "printing payment boards for retail shops, invoices, and billing counters",
    steps: [
      "Enter your merchant UPI VPA ID (e.g. name@upi).",
      "Specify merchant name and optional payment amount.",
      "Save the payment QR code."
    ],
    advs: ["Formats standardized UPI payment links", "Allows locking custom billing amounts", "Runs locally on your CPU for secure parameters"],
    errors: ["Entering an incorrect UPI VPA ID, which routes payments to the wrong user"],
    faqs: [
      { q: "Which apps can scan this code?", a: "Any UPI-enabled app (like Google Pay, PhonePe, Paytm, BHIM) can scan the code to complete payments." }
    ]
  },

  // --- CALCULATOR TOOLS ---
  "emi-calculator": {
    purpose: "calculate Equated Monthly Installments (EMI) for loans",
    mechanism: "applies standard reducing balance amortization equations",
    why: "Estimating monthly loan payments with varying interest rates manually is complex.",
    useCase: "planning home loans, car loans, and business financing repayments",
    steps: [
      "Enter the loan principal sum.",
      "Enter the annual interest rate.",
      "Select the loan tenure in years or months.",
      "Review the monthly EMI amount and amortization schedule."
    ],
    advs: ["Generates detailed monthly amortization schedules", "Displays total interest and principal splits", "Runs client-side in RAM safely"],
    errors: ["Entering incorrect compounding tenures"],
    faqs: [
      { q: "What is an amortization schedule?", a: "It is a table showing the month-by-month breakdown of how much of your payment goes to interest vs principal." }
    ]
  },
  "sip-calculator": {
    purpose: "project wealth returns from Systematic Investment Plans (SIP)",
    mechanism: "applies compounding interest formulas to regular monthly cash flows",
    why: "Calculating the future value of monthly mutual fund investments manually is tedious.",
    useCase: "projecting retirement funds, wealth planning, and mutual fund SIP checks",
    steps: [
      "Enter the monthly SIP investment amount.",
      "Enter the expected annual return percentage.",
      "Set the duration of the SIP in years.",
      "Review estimated returns and total wealth gains."
    ],
    advs: ["Calculates compounding interest on regular monthly deposits", "Displays visual growth charts", "100% secure client-side calculation"],
    errors: ["Expecting guaranteed returns since investments are subject to market changes"],
    faqs: [
      { q: "What is the formula used?", a: "The calculator uses the standard future value formula for annuity compounding." }
    ]
  },
  "compound-interest-calculator": {
    purpose: "calculate compound interest yields over time",
    mechanism: "applies compound interest formulas with custom compounding intervals",
    why: "Compounding interest variables (monthly, quarterly, yearly) manually is slow and error-prone.",
    useCase: "estimating savings account growth, mutual fund projections, and bond yields",
    steps: [
      "Input initial principal sum.",
      "Enter annual interest rate and tenure.",
      "Select compounding frequency (monthly, quarterly, annually).",
      "Review compound interest and total maturity balances."
    ],
    advs: ["Supports multiple compounding intervals", "Shows year-on-year growth logs", "Runs offline securely"],
    errors: ["Confusing annual interest rates with monthly yields"],
    faqs: [
      { q: "What is compounding frequency?", a: "It is how often interest is calculated and added to the principal. More frequent compounding yields higher returns." }
    ]
  },
  "cagr-calculator": {
    purpose: "compute the Compound Annual Growth Rate (CAGR) of investments",
    mechanism: "evaluates annualized geometric growth rates client-side",
    why: "Comparing historical investment returns across different periods requires a standardized CAGR metric.",
    useCase: "comparing mutual fund performance, stock growth rates, and real estate returns",
    steps: [
      "Enter the starting value of the investment.",
      "Enter the ending value of the investment.",
      "Set the duration in years.",
      "Review the annualized percentage growth rate."
    ],
    advs: ["Standardizes returns over uneven multi-year periods", "Allows direct comparison between asset classes", "Processed locally in browser memory"],
    errors: ["Using CAGR to project volatile returns without factoring in market drops"],
    faqs: [
      { q: "How does CAGR differ from average return?", a: "Average return ignores compounding, whereas CAGR represents the steady annual rate at which the investment grew." }
    ]
  },
  "fd-calculator": {
    purpose: "calculate Fixed Deposit (FD) maturity values",
    mechanism: "applies standard FD interest formulas with quarterly compounding",
    why: "Determining FD yields across multiple tenures manually requires complex formulas.",
    useCase: "investing in bank fixed deposits and checking interest gains",
    steps: [
      "Enter deposit principal.",
      "Type expected annual interest rate.",
      "Specify tenure (days, months, or years).",
      "Check maturity amount and total interest earned."
    ],
    advs: ["Uses standardized quarterly compounding used by banks", "Calculates yields for flexible tenures", "Runs client-side securely"],
    errors: ["Selecting incorrect compounding settings, as bank FDs compound quarterly by default"],
    faqs: [
      { q: "Does this account for tax deductions (TDS)?", a: "No, this calculator shows pre-tax interest returns." }
    ]
  },
  "roi-calculator": {
    purpose: "calculate Return on Investment (ROI) and annualized metrics",
    mechanism: "computes total and annualized investment gains",
    why: "Evaluating the efficiency of capital allocations across projects requires a simple ROI indicator.",
    useCase: "evaluating business returns, property investments, and stock gains",
    steps: [
      "Enter the amount invested.",
      "Enter the final return value.",
      "Review the absolute ROI percentage and total profit."
    ],
    advs: ["Displays absolute profit and ROI ratios", "Supports annualized ROI options", "Runs offline securely"],
    errors: ["Ignoring the time factor when comparing absolute ROIs of different investments"],
    faqs: [
      { q: "What is a good ROI?", a: "A good ROI depends on the asset class and risk level, but standard benchmarks range from 7% to 10% annually." }
    ]
  },
  "currency-converter": {
    purpose: "convert currency values across global exchange rates",
    mechanism: "fetches exchange rates (if online) and calculates currency splits locally",
    why: "Matching shopping prices or business budgets in foreign currencies manually is slow.",
    useCase: "checking travel budgets, online shopping, and international invoice conversions",
    steps: [
      "Enter the base currency amount.",
      "Select your source currency code (e.g. USD).",
      "Select your target currency code (e.g. EUR).",
      "Review the converted currency value."
    ],
    advs: ["Supports principal global currency pairs", "Calculates instant conversions", "Operates client-side securely"],
    errors: ["Expecting real-time offline conversions when exchange rates fluctuate"],
    faqs: [
      { q: "Are rates updated in real-time?", a: "Yes, standard rates are updated periodically when online, and saved for offline fallback calculations." }
    ]
  },
  "mortgage-calculator": {
    purpose: "estimate monthly mortgage installments including interest and taxes",
    mechanism: "computes monthly payments and creates amortization breakdowns client-side",
    why: "Buying a home is a major decision; projecting monthly installments is key for budgets.",
    useCase: "estimating home buying costs, refinancing checks, and budget planning",
    steps: [
      "Enter the home value and down payment.",
      "Type the annual interest rate.",
      "Select the loan term (usually 15 or 30 years).",
      "Review monthly payments and total interest costs."
    ],
    advs: ["Calculates property tax and home insurance splits", "Shows complete loan amortization logs", "Runs client-side securely"],
    errors: ["Ignoring local property tax and insurance fees that inflate monthly payments"],
    faqs: [
      { q: "What is PMI?", a: "Private Mortgage Insurance is an extra monthly fee required if your down payment is less than 20% of the home value." }
    ]
  },
  "loan-calculator": {
    purpose: "calculate general loan amortization variables",
    mechanism: "applies reducing interest rate loan formulas client-side",
    why: "Comparing personal or commercial loan offers requires evaluating total interest costs.",
    useCase: "comparing loan offers, calculating personal loans, and debt audits",
    steps: [
      "Enter principal loan amount.",
      "Type interest rate and tenure.",
      "Review monthly installments, total interest, and grand payouts."
    ],
    advs: ["Calculates reducing-balance interest values", "Generates detailed payment tables", "Operates offline securely"],
    errors: ["Pasting flat interest rates when loan terms call for reducing balance rates"],
    faqs: [
      { q: "What is the difference between flat and reducing rates?", a: "Flat rates charge interest on the entire original principal; reducing rates calculate interest on the remaining unpaid balance, saving you money." }
    ]
  },
  "income-tax-calculator": {
    purpose: "estimate tax liabilities under different regimes",
    mechanism: "applies tax slab structures and deductions to income models client-side",
    why: "Navigating changing tax slabs and regimes manually is highly confusing.",
    useCase: "planning annual tax deductions, comparing tax regimes, and estimating liabilities",
    steps: [
      "Enter your annual gross income.",
      "Input tax deductions (like 80C, HRA, health premiums).",
      "Compare estimated tax liabilities under the Old and New tax regimes."
    ],
    advs: ["Compares Old vs New tax slabs side-by-side", "Supports multiple deduction fields", "Runs 100% locally to protect private income data"],
    errors: ["Entering gross income without deducting tax-exempt components, which inflates tax estimates"],
    faqs: [
      { q: "Does this save my income data?", a: "No. All calculation parameters run inside your browser and vanish when the tab is closed." }
    ]
  },
  "gst-calculator": {
    purpose: "calculate Goods and Services Tax (GST) allocations",
    mechanism: "calculates tax margins using percentage addition and subtraction formulas",
    why: "Auditing invoices and splitting net prices from gross sales numbers manually is tedious.",
    useCase: "adding GST to product prices, extracting GST from gross invoices, and business accounting",
    steps: [
      "Enter the base product amount.",
      "Select the GST rate percentage (e.g. 5%, 12%, 18%, 28%).",
      "Click Add GST or Remove GST to see calculations."
    ],
    advs: ["Calculates both inclusive and exclusive GST values", "Splits outputs into CGST and SGST logs", "Runs client-side instantly"],
    errors: ["Dividing instead of multiplying percentages when trying to add GST to base amounts"],
    faqs: [
      { q: "What is CGST and SGST?", a: "CGST goes to the central government, and SGST goes to the state government, usually splitting the total GST rate in half." }
    ]
  },
  "discount-calculator": {
    purpose: "calculate savings and markdown sale prices",
    mechanism: "computes percentage savings and net sale prices",
    why: "Working out exact markdown percentages and net prices during sales is annoying.",
    useCase: "shopping price checks, retail pricing, and discount audits",
    steps: [
      "Enter original product price.",
      "Input discount percentage percentage.",
      "Check net sale price and total savings."
    ],
    advs: ["Supports multiple stackable discounts", "Shows savings in currency values", "Runs offline instantly"],
    errors: ["Adding percentages together incorrectly when stackable discounts are applied"],
    faqs: [
      { q: "What is a stackable discount?", a: "It is a secondary discount applied to the already reduced price, not added directly to the first percentage." }
    ]
  },
  "profit-calculator": {
    purpose: "calculate profit margins, markups, and costs",
    mechanism: "applies standard profit margin and markup business formulas",
    why: "Pricing products to hit specific margin targets manually is slow.",
    useCase: "pricing retail goods, tracking wholesale costs, and margin planning",
    steps: [
      "Enter cost price.",
      "Enter selling price or target margin percentage.",
      "Review profit amount, margin percentage, and markup percentage."
    ],
    advs: ["Calculates both gross margin and markup percentages", "Helps set retail pricing structures", "Runs client-side securely"],
    errors: ["Confusing profit margin (calculated on selling price) with markup (calculated on cost price)"],
    faqs: [
      { q: "What is the difference between margin and markup?", a: "Margin is profit divided by selling price; markup is profit divided by cost price." }
    ]
  },
  "youtube-earnings-calculator": {
    purpose: "estimate YouTube monetization earnings",
    mechanism: "projects earnings based on views, CTR, and CPM variables",
    why: "Estimating revenue shares from ad views with changing CPM values is confusing.",
    useCase: "content creator planning, channel valuation, and revenue estimations",
    steps: [
      "Enter expected daily or monthly video views.",
      "Set estimated RPM/CPM dollar range using the slider.",
      "Review estimated daily, monthly, and yearly creator earnings."
    ],
    advs: ["Simulates varying CPM thresholds", "Calculates daily, monthly, and yearly estimates", "Runs client-side securely"],
    errors: ["Assuming CPM rates are constant across all regions and topics"],
    faqs: [
      { q: "What is RPM?", a: "Revenue Per Mille represents the actual earnings a creator receives per 1,000 views after YouTube's fee cut." }
    ]
  },
  "adsense-revenue-calculator": {
    purpose: "estimate website Google AdSense earnings",
    mechanism: "projects revenue based on impressions, CTR, and CPC metrics",
    why: "Checking website traffic earning potential across different CTR and CPC settings is slow.",
    useCase: "blog traffic planning, website valuations, and marketing projections",
    steps: [
      "Enter page impressions.",
      "Input CTR percentage and CPC click value.",
      "Check daily, monthly, and yearly projected revenues."
    ],
    advs: ["Calculates CPC and CTR revenue splits", "Helps plan traffic targets for blogs", "Runs locally in browser RAM"],
    errors: ["Using unrealistic CTR percentages; average website CTR is around 1% to 2%"],
    faqs: [
      { q: "What is CPC?", a: "Cost Per Click is the amount an advertiser pays each time a user clicks on an ad." }
    ]
  },
  "simple-interest-calculator": {
    purpose: "calculate simple interest yields",
    mechanism: "applies the mathematical formula `Interest = P * R * T`",
    why: "Working out flat interest rates for bonds or personal loans requires a quick calculator.",
    useCase: "checking flat interest returns, evaluating simple loans, and homework checks",
    steps: [
      "Enter principal sum.",
      "Type annual interest rate.",
      "Set duration in years or months.",
      "Check total interest and final maturity value."
    ],
    advs: ["Simple, flat interest rate calculations", "Processes values in milliseconds", "Runs locally in browser memory"],
    errors: ["Using simple interest formulas for accounts that compound interest (like FDs)"],
    faqs: [
      { q: "How is simple interest different from compound interest?", a: "Simple interest is only calculated on the original principal; compound interest earns interest on previous interest as well." }
    ]
  },
  "salary-calculator": {
    purpose: "convert wages across hourly, daily, weekly, monthly, and annual salaries",
    mechanism: "calculates salary values using standard hourly and weekly calendar work factors client-side",
    why: "Comparing hourly job offers with annual salaries requires converting salary intervals.",
    useCase: "comparing job offers, calculating contractor wages, and budget planning",
    steps: [
      "Enter wage amount.",
      "Select source interval (hourly, weekly, monthly, annually).",
      "Input work hours per week.",
      "Review the wage conversion table across all intervals."
    ],
    advs: ["Converts salaries across 5 common intervals simultaneously", "Adjustable work hours and vacation assumptions", "Runs client-side securely"],
    errors: ["Forgetting that tax withholdings will reduce net take-home pay compared to these gross values"],
    faqs: [
      { q: "How many working weeks are assumed in a year?", a: "Standard calculations assume 52 working weeks per year." }
    ]
  },
  "percentage-calculator": {
    purpose: "evaluate percentage differences, growth rates, and margins",
    mechanism: "applies percentage formulas client-side",
    why: "Working out percentage increases, fractional portions, or differences manually is tedious.",
    useCase: "calculating grade improvements, retail margins, and data changes",
    steps: [
      "Select the percentage equation type (e.g. What is X% of Y?).",
      "Input numeric values.",
      "Review the calculated percentage output."
    ],
    advs: ["Supports multiple percentage equations", "Handles decimal percentages accurately", "Runs offline instantly"],
    errors: ["Confusing percentage points with percentage changes"],
    faqs: [
      { q: "How is percentage difference calculated?", a: "It divides the absolute difference by the average of the two numbers, multiplied by 100." }
    ]
  },
  "cgpa-calculator": {
    purpose: "compute Cumulative Grade Point Averages (CGPA) and convert to percentages",
    mechanism: "calculates weighted GPA averages based on grades and credits",
    why: "Averaging grades across different subject credits manually is slow and leads to errors.",
    useCase: "academic grade audits, university applications, and GPA conversions",
    steps: [
      "Add your course semesters or subjects.",
      "Enter grades and credits for each course.",
      "Check your cumulative CGPA and percentage conversion."
    ],
    advs: ["Allows adding multiple courses with credits", "Converts CGPA to percentage standards", "Runs client-side securely"],
    errors: ["Entering grades without credit weightings, which biases final averages"],
    faqs: [
      { q: "What is the standard CGPA to percentage conversion?", a: "Many boards (like CBSE) multiply CGPA by 9.5 to estimate the percentage." }
    ]
  },
  "scientific-calculator": {
    purpose: "solve complex trigonometry, algebraic equations, and logarithms",
    mechanism: "runs advanced scientific math modules inside browser memory",
    why: "Standard calculators lack trigonometric, exponential, and logarithmic functions required for engineering and science.",
    useCase: "solving engineering problems, math homework, and physics calculations",
    steps: [
      "Type mathematical expressions using functions (sin, cos, log, ln, sqrt).",
      "Review output results updated on screen.",
      "Toggle between degrees and radians."
    ],
    advs: ["Supports trigonometry, exponents, logarithms, and roots", "Maintains history logs of calculations", "Runs client-side in secure sandbox"],
    errors: ["Entering invalid mathematical syntax causing parse errors"],
    faqs: [
      { q: "Does it support degrees and radians?", a: "Yes, you can toggle between DEG and RAD modes for trigonometric functions." }
    ]
  },
  "basic-calculator": {
    purpose: "run fundamental arithmetic equations",
    mechanism: "processes basic math queries (+, -, *, /) client-side",
    why: "Quick arithmetic checks shouldn't require opening heavy program sheets.",
    useCase: "daily budget checks, homework audits, and quick receipts addition",
    steps: [
      "Click buttons or type numbers and operators.",
      "Review calculation total."
    ],
    advs: ["Responsive layout works on mobile and desktop", "Instant, zero-latency calculation", "Runs offline securely"],
    errors: ["Dividing by zero, which results in 'Infinity' errors"],
    faqs: [
      { q: "Does it support keyboard shortcuts?", a: "Yes, you can use standard keyboard number pad keys to input calculations." }
    ]
  },
  "age-calculator": {
    purpose: "calculate exact chronological age",
    mechanism: "computes date intervals factoring in leap years and months client-side",
    why: "Figuring out exact age in months, weeks, and days, or calculating next birthday countdowns manually is tricky.",
    useCase: "verifying age limits for registration forms, checking child milestones, and birthday countdowns",
    steps: [
      "Select your date of birth.",
      "Select target calculation date (defaults to current date).",
      "Review age in years, months, weeks, days, and seconds."
    ],
    advs: ["Calculates age down to the exact day and second", "Displays next birthday countdown timer", "Runs locally in browser RAM"],
    errors: ["Entering incorrect target dates that precede your birthdate"],
    faqs: [
      { q: "Does the calculator account for leap years?", a: "Yes, the calculations factor in leap years and the varying number of days in each month." }
    ]
  },
  "date-difference-calculator": {
    purpose: "calculate duration between two dates",
    mechanism: "computes days, weeks, and months between calendar dates client-side",
    why: "Determining exact project timelines or calendar gaps manually is slow.",
    useCase: "planning project deadlines, checking billing intervals, and holiday planning",
    steps: [
      "Select starting date.",
      "Select end date.",
      "Review elapsed time in years, months, and days."
    ],
    advs: ["Calculates difference in multiple units (days, weeks, months)", "Supports flexible calendar navigation", "Runs offline securely"],
    errors: ["Forgetting to account for time zones when checking exact time differences"],
    faqs: [
      { q: "Does it include the start date in the count?", a: "You can toggle options to include or exclude the start/end days." }
    ]
  },
  "bmi-calculator": {
    purpose: "estimate Body Mass Index (BMI) and health weight ranges",
    mechanism: "applies standard metric and imperial BMI formulas",
    why: "Checking weight status ranges manually requires looking up tables and calculating weight ratios.",
    useCase: "tracking fitness goals, healthy weight assessments, and personal health metrics",
    steps: [
      "Select your system (metric or imperial).",
      "Enter height and weight.",
      "Check your BMI score and weight category (underweight, normal, overweight)."
    ],
    advs: ["Displays standard BMI categories and ideal weight ranges", "Supports both metric and imperial units", "Runs client-side privately"],
    errors: ["Using BMI as a sole measure of health, as it doesn't account for muscle mass vs fat"],
    faqs: [
      { q: "Is BMI accurate for athletes?", a: "BMI may overestimate body fat in muscular athletes because muscle weighs more than fat." }
    ]
  },
  "calorie-calculator": {
    purpose: "calculate daily calorie targets and BMR",
    mechanism: "applies the Mifflin-St Jeor or Harris-Benedict formulas client-side",
    why: "Estimating daily calorie targets for weight loss or gain manually is complex.",
    useCase: "meal planning, tracking diet goals, and fitness planning",
    steps: [
      "Enter height, weight, age, and gender.",
      "Select activity level.",
      "Review your BMR and daily calorie goals."
    ],
    advs: ["Uses modern Mifflin-St Jeor equations", "Provides calorie targets for weight loss, maintenance, and gain", "Runs locally in browser RAM"],
    errors: ["Overestimating daily activity levels, which inflates calorie targets"],
    faqs: [
      { q: "What is BMR?", a: "Basal Metabolic Rate is the number of calories your body burns at rest to maintain vital functions." }
    ]
  },
  "tip-calculator": {
    purpose: "calculate tip percentages and split bills",
    mechanism: "divides total bills and tips across groups",
    why: "Splitting bills and tip percentages at restaurants verbally leads to math errors.",
    useCase: "restaurant bill splitting, group dining, and payment sharing",
    steps: [
      "Enter total bill amount.",
      "Select tip percentage.",
      "Input number of people sharing.",
      "Review tip amount, total bill, and share per person."
    ],
    advs: ["Splits bills and tips evenly across custom group sizes", "Handles fractional currency decimals", "Runs client-side instantly"],
    errors: ["Double tipping when service tax is already included in the bill"],
    faqs: [
      { q: "Can it handle tax addition?", a: "You can enter the bill amount inclusive of tax to get the final split details." }
    ]
  },
  "time-duration-calculator": {
    purpose: "calculate duration between two timestamps",
    mechanism: "calculates hours, minutes, and seconds difference between times",
    why: "Adding and subtracting time values manually is confusing due to base-60 hours and minutes.",
    useCase: "calculating work hours, tracking task durations, and payroll auditing",
    steps: [
      "Select start time.",
      "Select end time.",
      "Review elapsed time in hours, minutes, and seconds."
    ],
    advs: ["Calculates time differences in base-60 format accurately", "Supports both 12-hour and 24-hour time formats", "Runs locally in browser RAM"],
    errors: ["Crossing midnight boundaries without checking date rollers"],
    faqs: [
      { q: "Does it support crossing midnight?", a: "Yes, it calculates elapsed duration across midnight boundaries correctly." }
    ]
  },

  // --- TEXT TOOLS ---
  "word-counter": {
    purpose: "count words, characters, and reading times in text",
    mechanism: "tokenizes string inputs and counts word boundaries using regex",
    why: "Adhering to strict essay word counts or social media caps requires a live counter.",
    useCase: "writing articles, checking essay lengths, and drafting social posts",
    steps: [
      "Type or paste your copy into the text area.",
      "Review word, character, and sentence counts updated instantly.",
      "Check estimated reading and speaking times."
    ],
    advs: ["Calculates statistics in real-time as you type", "Provides estimated reading and speaking speed indicators", "Runs client-side privately"],
    errors: ["Counting spaces or special formatting characters as words"],
    faqs: [
      { q: "How is reading time estimated?", a: "It assumes an average adult reading speed of 200 to 250 words per minute." }
    ]
  },
  "character-counter": {
    purpose: "count characters with and without spaces",
    mechanism: "counts character lengths in text inputs",
    why: "Social media and metadata tags enforce strict character caps.",
    useCase: "drafting tweets, writing meta tags, and formatting descriptions",
    steps: [
      "Paste your text into the editor.",
      "Check character counts with and without spaces."
    ],
    advs: ["Shows character counts both including and excluding spaces", "Includes percentage progress bars for common social platforms", "Runs offline securely"],
    errors: ["Ignoring space limits when copy-pasting text into strict portals"],
    faqs: [
      { q: "Are line breaks counted as characters?", a: "Yes, standard carriage returns and line breaks count as 1 or 2 characters depending on the OS standard." }
    ]
  },
  "case-converter": {
    purpose: "convert text between uppercase, lowercase, sentence, and title casing",
    mechanism: "applies case-conversion transformations to text string blocks",
    why: "Correcting mixed case errors in headings or lists manually takes too much time.",
    useCase: "formatting headings, fixing accidentally locked uppercase caps, and organizing lists",
    steps: [
      "Paste your text block.",
      "Select casing style (UPPERCASE, lowercase, Title Case, Sentence case).",
      "Copy the converted text output."
    ],
    advs: ["Converts text casing instantly", "Preserves paragraph and spacing structures", "Processed client-side safely"],
    errors: ["Converting code scripts, which can break syntax keywords"],
    faqs: [
      { q: "Does Title Case capitalize all words?", a: "Standard Title Case capitalizes main words while keeping small prepositions (like 'of', 'and', 'the') in lowercase." }
    ]
  },
  "remove-duplicate-lines": {
    purpose: "remove duplicate lines and rows from lists",
    mechanism: "filters arrays to keep unique line entries client-side",
    why: "Cleaning duplicated lists, logs, or emails manually is slow and error-prone.",
    useCase: "deduplicating mail lists, filtering data dumps, and cleaning codes",
    steps: [
      "Paste your list or text into the input box.",
      "Click remove duplicates.",
      "Copy the cleaned unique list."
    ],
    advs: ["Purges identical list entries in one click", "Supports case-sensitive and case-insensitive matching", "Runs locally in RAM securely"],
    errors: ["Removing duplicates on code files where matching lines are required"],
    faqs: [
      { q: "Is the list re-sorted?", a: "No, the tool preserves the original order of the remaining unique lines." }
    ]
  },
  "text-sorter": {
    purpose: "sort lists alphabetically, numerically, or in reverse",
    mechanism: "applies array sort algorithms on line-break arrays",
    why: "Organizing massive list data manually is tedious.",
    useCase: "alphabetizing name lists, sorting numerical values, and reversing queues",
    steps: [
      "Paste your unsorted list.",
      "Select sorting order (A-Z, Z-A, Numeric).",
      "Copy the sorted list."
    ],
    advs: ["Sorts lists alphabetically and numerically", "Includes options to ignore capitalization", "Processed client-side securely"],
    errors: ["Sorting structured records without grouping, which mixes up columns"],
    faqs: [
      { q: "Does it support sorting numbers?", a: "Yes, it evaluates values numerically instead of alphabetically to prevent '10' coming before '2'." }
    ]
  },
  "text-compare": {
    purpose: "compare two text versions and highlight differences",
    mechanism: "runs diff matching algorithms in-browser to isolate line and character changes",
    why: "Isolating edits between two drafts manually is slow and prone to oversights.",
    useCase: "checking draft contracts, verifying code changes, and comparing editing revisions",
    steps: [
      "Paste the original text on the left.",
      "Paste the revised text on the right.",
      "Review highlighted deletions (red) and additions (green)."
    ],
    advs: ["Highlights inline character-level changes", "Supports side-by-side and unified views", "Runs entirely client-side privately"],
    errors: ["Comparing completely different files, which results in messy highlights"],
    faqs: [
      { q: "Are spaces compared?", a: "Yes, you can toggle settings to ignore or highlight whitespace changes." }
    ]
  },
  "text-diff": {
    purpose: "detect line edits and revisions in drafts",
    mechanism: "applies character-level diff logic client-side",
    why: "Tracking subtle revisions across versions manually is tedious.",
    useCase: "code inspections, copy editing reviews, and contract audits",
    steps: [
      "Paste the base draft in the first editor.",
      "Paste the revised draft in the second editor.",
      "Inspect highlighted changes."
    ],
    advs: ["Detects insertions, deletions, and inline edits", "Processes text instantly", "Zero server risks"],
    errors: ["Pasting massive text files above 5MB, which can slow down browser rendering"],
    faqs: [
      { q: "Does this save my text?", a: "No, it processes everything in volatile memory, ensuring private text remains secure." }
    ]
  },
  "remove-extra-spaces": {
    purpose: "clean up redundant spacing, tabs, and line breaks",
    mechanism: "runs regex replace functions to trim whitespace borders and collapse spaces",
    why: "Messy copy containing double spacing, trailing tabs, or extra line padding distort web layouts.",
    useCase: "cleaning raw OCR scans, formatting copied text, and cleanup code indents",
    steps: [
      "Paste your text.",
      "Select cleanup options (strip extra spaces, strip tab indents, collapse empty lines).",
      "Copy the cleaned text."
    ],
    advs: ["Collapses double spacing into single spaces", "Trims leading and trailing paragraph spacing", "Runs offline securely"],
    errors: ["Running on code scripts where indentation is syntactically significant (like Python)"],
    faqs: [
      { q: "Does it remove all line breaks?", a: "No, it only removes empty redundant line padding unless you select the option to collapse all text into a single line." }
    ]
  },
  "line-counter": {
    purpose: "count total lines and blank lines in text documents",
    mechanism: "splits text blocks on newline characters and counts the array size",
    why: "Auditing programming scripts or configurations requires tracking exact line counts.",
    useCase: "checking code file heights, auditing logs, and formatting lists",
    steps: [
      "Paste your document text.",
      "Check total lines, filled lines, and blank lines."
    ],
    advs: ["Displays both filled and blank line counts", "Processes files instantly as you type", "100% secure client-side calculation"],
    errors: ["Confusing wrapped lines on your screen with actual newline characters in the file"],
    faqs: [
      { q: "What is a blank line?", a: "It is a line containing only spacing characters (spaces, tabs) or nothing at all." }
    ]
  },
  "sentence-counter": {
    purpose: "count sentences in draft copy",
    mechanism: "identifies sentence borders using punctuation regex splits client-side",
    why: "Evaluating readability scores for articles requires tracking sentence structures.",
    useCase: "checking readability indices, copywriting, and academic essay checks",
    steps: [
      "Paste your text copy.",
      "Check total sentence counts and average words per sentence."
    ],
    advs: ["Counts sentences using punctuation markers accurately", "Helps analyze copy readability", "Runs offline securely"],
    errors: ["Counting abbreviations (like 'Dr.' or 'etc.') as sentence ends, which this tool tries to filter"],
    faqs: [
      { q: "Does it count decimal points as sentences?", a: "The tool filters out decimals (e.g. '3.14') so they do not trigger false sentence counts." }
    ]
  },
  "paragraph-counter": {
    purpose: "count paragraph blocks in text",
    mechanism: "splits text streams using double line breaks regex",
    why: "Formatting manuscripts or blog layouts to meet exact paragraph caps is tedious.",
    useCase: "auditing academic drafts, blog layout checks, and manuscript formatting",
    steps: [
      "Paste your text blocks.",
      "Review paragraph counts and average paragraph lengths."
    ],
    advs: ["Counts block paragraphs separated by empty lines", "Ignores empty padding lines", "Runs locally on your CPU privately"],
    errors: ["Counting single line breaks as paragraphs, which are just line returns"],
    faqs: [
      { q: "How does it detect paragraphs?", a: "It looks for double line breaks (empty lines) that separate paragraphs." }
    ]
  },
  "text-reverser": {
    purpose: "reverse character order or word order in text",
    mechanism: "splits text strings, reverses arrays, and joins characters client-side",
    why: "Reversing letters or words manually for puzzles or text conversions takes time.",
    useCase: "creating puzzles, reversing word queues, and general text play",
    steps: [
      "Paste your text.",
      "Select reverse mode (reverse characters, reverse words, reverse lines).",
      "Copy the reversed output."
    ],
    advs: ["Reverses characters, words, or lines", "Executes instantly in browser RAM", "No accounts required"],
    errors: ["Reversing structured code, which breaks syntax keywords"],
    faqs: [
      { q: "Does it keep line breaks?", a: "Yes, you can choose to reverse text within each line while keeping the line structure intact." }
    ]
  },
  "slug-generator": {
    purpose: "convert title phrases into URL-friendly slug formats",
    mechanism: "converts letters to lowercase, replaces spaces with hyphens, and strips special characters",
    why: "Manually formatting blog title headings to URLs is slow and error-prone.",
    useCase: "generating blog post URLs, setting routing paths, and building links",
    steps: [
      "Type or paste your page title.",
      "Customize separator character (defaults to hyphens).",
      "Copy the clean URL slug."
    ],
    advs: ["Converts titles to clean, URL-safe slug strings", "Strips special characters and accents automatically", "Runs locally in browser RAM"],
    errors: ["Using double hyphens or forgetting to strip trailing spaces, which the tool handles safely"],
    faqs: [
      { q: "What is a slug?", a: "A slug is the part of a URL that identifies a specific page in a human-readable format (e.g., 'slug-generator' in '/tools/slug-generator')." }
    ]
  },
  "find-replace": {
    purpose: "locate and replace words in text",
    mechanism: "applies global regex replacement functions to text blocks client-side",
    why: "Manually updating a repeated name or word in a large draft takes time.",
    useCase: "renaming character logs, cleaning drafts, and fixing typo arrays",
    steps: [
      "Paste your text copy.",
      "Type the word to find and the replacement word.",
      "Toggle case matching options and replace text."
    ],
    advs: ["Supports case-sensitive and case-insensitive replaces", "Supports regular expression matching rules", "Processes locally securely"],
    errors: ["Replacing substrings accidentally within larger words (e.g. replacing 'cat' in 'category')"],
    faqs: [
      { q: "Does it support wildcards?", a: "Yes, you can toggle Regex mode to use wildcards and regular expression patterns." }
    ]
  },
  "text-uppercase": {
    purpose: "format text characters to uppercase",
    mechanism: "applies native JavaScript toUpperCase transformations to strings",
    why: "Fixing accidentally locked lowercase headings manually requires retyping.",
    useCase: "formatting headings, writing highlights, and styling text",
    steps: [
      "Paste your text copy.",
      "Convert and copy the uppercase text block."
    ],
    advs: ["Converts all letters to uppercase instantly", "Preserves spacing and formatting", "Processed on-device privately"],
    errors: ["Converting code elements, which breaks syntax case rules"],
    faqs: [
      { q: "Are accents preserved?", a: "Yes, the tool converts accented characters to their uppercase equivalents." }
    ]
  },
  "text-lowercase": {
    purpose: "convert text characters to lowercase",
    mechanism: "applies native JavaScript toLowerCase transformations client-side",
    why: "Fixing accidentally locked uppercase caps manually is slow.",
    useCase: "formatting data blocks, cleaning email lists, and fixing headings",
    steps: [
      "Paste your text.",
      "Convert and copy the lowercase text block."
    ],
    advs: ["Converts all characters to lowercase instantly", "Preserves line-break spacing", "Runs locally in browser memory"],
    errors: ["Converting acronyms or proper nouns that require capitalization"],
    faqs: [
      { q: "Does this affect symbols or numbers?", a: "No, only alphabetical characters are converted; numbers and symbols remain unchanged." }
    ]
  },
  "capitalize-text": {
    purpose: "capitalize the first letter of each sentence in text blocks",
    mechanism: "identifies sentence borders and capitalizes leading characters",
    why: "Formatting raw, uncapitalized transcripts manually is slow.",
    useCase: "cleaning video transcripts, formatting essays, and drafting emails",
    steps: [
      "Paste your text block.",
      "Click capitalize sentences.",
      "Copy the formatted text."
    ],
    advs: ["Capitalizes first letters of sentences automatically", "Handles punctuation gaps correctly", "Runs offline securely"],
    errors: ["Capitalizing acronyms inside sentences incorrectly"],
    faqs: [
      { q: "How does it find sentences?", a: "It looks for periods, question marks, and exclamation marks followed by spaces to detect sentence breaks." }
    ]
  },
  "title-case": {
    purpose: "format headings to Title Case standard",
    mechanism: "capitalizes major words while keeping small prepositions in lowercase",
    why: "Formatting headers to academic or publishing standards manually is tedious.",
    useCase: "formatting blog headings, book titles, and article titles",
    steps: [
      "Paste your title list.",
      "Select style standard (AP, Chicago, etc.).",
      "Copy the title-cased headings."
    ],
    advs: ["Applies standard Title Case capitalization styles automatically", "Leaves articles and prepositions in lowercase correctly", "Processed client-side safely"],
    errors: ["Capitalizing all words including minor prepositions (e.g. 'Of', 'The') when they should remain lowercase"],
    faqs: [
      { q: "What rules are used?", a: "By default, it uses standard AP/Chicago rules where words under 3 letters (like 'in', 'on', 'to') are lowercase unless they start the title." }
    ]
  },
  "lorem-ipsum": {
    purpose: "generate placeholder Lorem Ipsum text",
    mechanism: "compiles standard dummy Latin paragraphs using local arrays",
    why: "Designers need placeholder text to preview layouts before final copy is ready.",
    useCase: "prototyping web designs, checking layouts, and draft templates",
    steps: [
      "Select the number of paragraphs, sentences, or words to generate.",
      "Click generate.",
      "Copy the placeholder text."
    ],
    advs: ["Generates standard Latin dummy text lists", "Flexible options for words, sentences, or paragraphs", "Runs in client web tab browser cache"],
    errors: ["Forgetting to replace placeholder text with actual content before publishing websites"],
    faqs: [
      { q: "What is Lorem Ipsum?", a: "It is standard placeholder text used in publishing and design to show layout structures without distracting content." }
    ]
  },
  "random-text": {
    purpose: "generate random text strings and passwords",
    mechanism: "generates random characters using browser cryptographic APIs",
    why: "Creating secure password strings or random test data manually is not secure.",
    useCase: "generating passwords, creating test data, and puzzle setups",
    steps: [
      "Set length and character options (numbers, letters, symbols).",
      "Generate and copy the random text string."
    ],
    advs: ["Generates cryptographically secure random strings", "Customizable character pools", "Runs offline securely"],
    errors: ["Forgetting to write down generated random keys or passwords before closing the tab"],
    faqs: [
      { q: "Is it secure?", a: "Yes, it uses your browser's window.crypto API, which provides cryptographically strong random values." }
    ]
  },

  // --- DEVELOPER TOOLS ---
  "json-formatter": {
    purpose: "format and prettify raw JSON data",
    mechanism: "parses JSON strings and stringifies them with custom indents and syntax coloring",
    why: "Debugging flattened, minified JSON payloads or API logs is near impossible.",
    useCase: "debugging API payloads, cleaning data logs, and checking configurations",
    steps: [
      "Paste your minified or unreadable JSON text.",
      "Select indentation spacing (2 or 4 spaces).",
      "Click format and inspect the nested, colored JSON structure."
    ],
    advs: ["Syntax-highlighted, collapsible data trees", "Customizable indents and brackets formatting", "Runs 100% locally to protect private API logs"],
    errors: ["Pasting invalid JSON syntax, which blocks formatting and triggers parse errors"],
    faqs: [
      { q: "Can it format corrupted JSON?", a: "No. The input must be valid JSON; the tool will show you where the syntax error is located so you can fix it." }
    ]
  },
  "json-validator": {
    purpose: "validate JSON syntax and troubleshoot errors",
    mechanism: "parses JSON and identifies exact line and character positions of syntax errors",
    why: "Finding a missing comma or quote in a massive JSON config file takes too long.",
    useCase: "debugging configurations, validating JSON feeds, and fixing code syntax",
    steps: [
      "Paste the JSON string into the validator.",
      "Review validation status and error line numbers if any.",
      "Fix errors based on validation tips."
    ],
    advs: ["Isolates syntax error positions precisely", "Outputs detailed error messages", "Processed client-side securely"],
    errors: ["Confusing JavaScript objects with strict JSON format rules (which require double quotes)"],
    faqs: [
      { q: "Why does it flag single quotes as errors?", a: "Strict JSON standards require double quotes for all keys and string values." }
    ]
  },
  "xml-formatter": {
    purpose: "format and indent XML markup files",
    mechanism: "tokenizes XML markup tags and indents nesting structures client-side",
    why: "Bloated, unindented XML files from database exports are difficult to read.",
    useCase: "beautifying SOAP API feeds, cleaning config files, and formatting XML indexes",
    steps: [
      "Paste raw XML into the editor.",
      "Select indent scales and format.",
      "Copy the clean XML code."
    ],
    advs: ["Prettifies XML tags and attributes cleanly", "Handles CDATA blocks correctly", "Runs offline in browser cache"],
    errors: ["Formatting unclosed tags, which breaks the parsing structure"],
    faqs: [
      { q: "Does it validate XML tags?", a: "Yes, it parses the XML tree and flags unclosed tags or syntax issues." }
    ]
  },
  "yaml-formatter": {
    purpose: "beautify and format YAML documents",
    mechanism: "parses YAML lines and indents parameter logs client-side",
    why: "YAML depends on indentation; a single wrong space breaks Docker or Kubernetes configs.",
    useCase: "formatting Kubernetes yaml manifests, cleaning Docker Compose files, and checking parameters",
    steps: [
      "Paste your YAML configuration.",
      "Adjust indentation rules and format.",
      "Save the cleaned YAML code."
    ],
    advs: ["Ensures proper indentation spacing rules", "Flags indent violations", "Processed client-side safely"],
    errors: ["Mixing tab keys and space keys in YAML, which is syntactically invalid"],
    faqs: [
      { q: "Can I use tabs for indentation?", a: "No, YAML standards prohibit tabs; the tool automatically converts tabs to spaces to prevent syntax errors." }
    ]
  },
  "sql-formatter": {
    purpose: "format complex SQL queries",
    mechanism: "tokenizes SQL keywords and breaks query lines client-side",
    why: "Cluttered SQL queries with nested joins and subqueries are hard for database audits.",
    useCase: "prettifying SQL queries, formatting database scripts, and standardizing keywords",
    steps: [
      "Paste raw SQL query code.",
      "Select keyword capitalization rules (UPPERCASE keywords recommended).",
      "Copy the formatted SQL query."
    ],
    advs: ["Standardizes SQL keywords to uppercase automatically", "Indents SELECT, JOIN, and WHERE conditions", "Runs offline securely"],
    errors: ["Formatting non-SQL scripts expecting structured queries"],
    faqs: [
      { q: "Which SQL dialects are supported?", a: "It supports standard ANSI SQL, PostgreSQL, MySQL, SQL Server, and Oracle query syntax." }
    ]
  },
  "code-beautifier": {
    purpose: "beautify HTML, CSS, and JavaScript code",
    mechanism: "applies formatting parsers to HTML, CSS, and JS files client-side",
    why: "Minified web source files are completely unreadable for developer audits.",
    useCase: "prettifying scrap scripts, cleaning templates, and reviewing code styles",
    steps: [
      "Paste your HTML, CSS, or JS code block.",
      "Format code based on spacing preferences.",
      "Copy the clean formatted code."
    ],
    advs: ["Beautifies HTML markups, CSS rules, and JS scripts together", "Collapsible block indents", "Runs client-side in secure sandbox"],
    errors: ["Beautifying mixed code templates (like PHP or JSP) that might break formatter rules"],
    faqs: [
      { q: "Can it minify code?", a: "This is a beautifier; to compress code files, use the HTML, CSS, or JS minifier tools." }
    ]
  },
  "base64-encoder-decoder": {
    purpose: "encode plain text to Base64 formats or decode it back",
    mechanism: "applies base64 binary encoding and decoding algorithms client-side",
    why: "Transmitting binary data or specific characters over web protocols requires Base64 packaging.",
    useCase: "encoding API keys, decoding token strings, and formatting email parameters",
    steps: [
      "Paste your text or Base64 code into the editor.",
      "Click Encode or Decode to process instantly.",
      "Copy the output string."
    ],
    advs: ["Encodes and decodes characters in milliseconds", "Supports multiple character sets (UTF-8)", "Runs 100% locally to protect private keys"],
    errors: ["Decoding truncated Base64 strings, which causes parsing errors"],
    faqs: [
      { q: "Is Base64 secure encryption?", a: "No, Base64 is encoding (reversible formatting), not secure encryption. Anyone can decode Base64 back to plain text." }
    ]
  },
  "url-encoder-decoder": {
    purpose: "percent-encode URL parameters or decode them back",
    mechanism: "applies encodeURIComponent and decodeURIComponent algorithms client-side",
    why: "URLs containing special characters or spaces break browser routing if not percent-encoded.",
    useCase: "encoding query parameters, decoding API routing links, and debugging web links",
    steps: [
      "Paste your URL address or parameter string.",
      "Click Encode or Decode.",
      "Copy the formatted web string."
    ],
    advs: ["Encodes special characters and spaces to URL-safe formats", "Decodes query parameters cleanly", "Runs locally in browser RAM"],
    errors: ["Double-encoding URLs, which creates broken links (e.g. converting '%20' to '%2520')"],
    faqs: [
      { q: "Why is URL encoding necessary?", a: "Browsers only accept specific ASCII characters in URLs; other symbols must be converted to prevent broken page loads." }
    ]
  },
  "jwt-decoder": {
    purpose: "decode JSON Web Tokens (JWT) payload data",
    mechanism: "decodes JWT base64url sections and formats them into JSON headers and payloads",
    why: "Inspecting JWT token roles, scopes, or expiration dates manually is slow.",
    useCase: "debugging auth tokens, checking user roles, and audits token expirations",
    steps: [
      "Paste your encoded JWT token string.",
      "Review parsed header details, payload data, and signature info.",
      "Check expiration (exp) indicators."
    ],
    advs: ["Decodes token headers and payloads into color-coded JSON", "Calculates token expiration times in local timezone", "Runs 100% client-side to protect sensitive token keys"],
    errors: ["Expecting the decoder to verify the token signature without providing private keys"],
    faqs: [
      { q: "Is my token sent to a server?", a: "No. The decoding is performed client-side in your browser; your tokens are never uploaded." }
    ]
  },
  "html-encoder-decoder": {
    purpose: "convert characters to HTML entities or parse them back",
    mechanism: "maps characters to HTML entity codes in browser memory",
    why: "Displaying raw code tags like `<` and `>` on web pages causes browsers to render them as HTML tags instead of text.",
    useCase: "escaping HTML entities for code snippets and decoding parsed web text",
    steps: [
      "Paste code or HTML entities.",
      "Click Encode (Escape) or Decode (Unescape).",
      "Copy the escaped HTML string."
    ],
    advs: ["Escapes special characters to standard HTML entities", "Decodes parsed entity codes back to text", "Processed offline securely"],
    errors: ["Forgetting to escape tags, which breaks website layout rendering"],
    faqs: [
      { q: "What is an HTML entity?", a: "It is a string of characters (like `&lt;`) used to display reserved HTML characters (like `<`) safely." }
    ]
  },
  "html-minifier": {
    purpose: "minify HTML source code files",
    mechanism: "strips spaces, comments, and empty blocks from HTML markups client-side",
    why: "Bloated HTML files increase page load weights and slow down web indexing.",
    useCase: "compressing website template files, minifying code, and saving bandwidth",
    steps: [
      "Paste raw HTML code.",
      "Select minification options.",
      "Copy the compressed HTML code."
    ],
    advs: ["Strips HTML comments and whitespace bloat", "Reduces file sizes for faster page loading", "Runs offline in browser cache"],
    errors: ["Minifying scripts that contain unescaped strings, which might break functionality"],
    faqs: [
      { q: "Does this affect website display?", a: "No. It removes white space and comments, which browsers ignore during rendering." }
    ]
  },
  "css-minifier": {
    purpose: "compress and minify CSS stylesheets",
    mechanism: "strips comments, spaces, and duplicate rules from CSS code client-side",
    why: "Heavy CSS files block rendering on browsers, increasing page load delays.",
    useCase: "compressing production stylesheets and optimizing website loading scores",
    steps: [
      "Paste raw CSS code blocks.",
      "Click minify CSS.",
      "Copy the compressed stylesheet code."
    ],
    advs: ["Stripped comments, spaces, and line breaks", "Collapses selectors and shorthand parameters", "Runs locally in browser RAM"],
    errors: ["Minifying invalid CSS rules, which can break site layouts"],
    faqs: [
      { q: "Is the minified code readable?", a: "No, minification collapses code into a single line to save bytes. Keep a backup copy of your original CSS for editing." }
    ]
  },
  "js-minifier": {
    purpose: "minify and compress JavaScript scripts",
    mechanism: "optimizes script structures, variables, and strips whitespace client-side",
    why: "Heavy JavaScript files delay browser interaction times and consumption of data.",
    useCase: "optimizing JS scripts for web deployment and reducing loading times",
    steps: [
      "Paste your raw JS code.",
      "Run the minification parser.",
      "Copy the compressed JS script."
    ],
    advs: ["Strips whitespace, logs, and comments from scripts", "Shrinks file size significantly", "Processed client-side safely"],
    errors: ["Minifying JS scripts without ending semicolons, which can cause syntax execution errors"],
    faqs: [
      { q: "Does this obfuscate code?", a: "It does basic compression and variable shortening, but it is not a full encryption obfuscator." }
    ]
  },
  "regex-tester": {
    purpose: "test regular expression (Regex) patterns with live highlights",
    mechanism: "compiles Regex patterns and executes matches on target texts in-browser",
    why: "Writing and debugging complex Regex expressions without visual matches is slow.",
    useCase: "validating phone number filters, testing extractors, and checking pattern codes",
    steps: [
      "Enter your Regex pattern in the pattern box.",
      "Select Regex flags (Global, Case-insensitive, Multiline).",
      "Type test text to see live highlighted matches."
    ],
    advs: ["Displays real-time highlighted match groups", "Flags invalid Regex syntax dynamically", "Runs locally in browser memory securely"],
    errors: ["Writing infinite-loop Regex patterns that can freeze the browser tab temporarily"],
    faqs: [
      { q: "Which regex engine is used?", a: "It uses your browser's native JavaScript RegExp engine." }
    ]
  },
  "uuid-generator": {
    purpose: "generate cryptographically secure UUID version 4 strings",
    mechanism: "generates RFC4122 compliant UUIDs using browser crypto APIs",
    why: "Developers need unique database keys or transaction IDs on the fly.",
    useCase: "generating database keys, mock testing ids, and API transaction codes",
    steps: [
      "Select the number of UUIDs to generate.",
      "Toggle uppercase or lowercase preferences.",
      "Copy the generated UUID list."
    ],
    advs: ["Generates cryptographically secure v4 UUIDs", "Generates bulk lists of UUID codes instantly", "Runs offline securely in browser"],
    errors: ["Using the same UUID multiple times in database keys where uniqueness is required"],
    faqs: [
      { q: "What is UUID v4?", a: "It is a 128-bit random identifier compliant with RFC 4122, having virtually zero collision probability." }
    ]
  },
  "hash-generator": {
    purpose: "generate MD5, SHA-1, SHA-256, and SHA-512 cryptographic hashes",
    mechanism: "computes cryptographic hash checksums in-memory using JS libraries",
    why: "Verifying file downloads, formatting passwords, or checking data signatures requires checksum hashes.",
    useCase: "checking file downloads, generating password hashes, and verifying payloads",
    steps: [
      "Paste your text string or select a file.",
      "Review generated MD5, SHA-1, SHA-256, and SHA-512 hashes.",
      "Copy the checksum code."
    ],
    advs: ["Generates MD5, SHA-1, SHA-256, and SHA-512 hashes simultaneously", "Supports text and file checksum inputs", "Processed locally for security"],
    errors: ["Using weak hashes like MD5 for secure password storage in databases"],
    faqs: [
      { q: "Are files uploaded to hash them?", a: "No. Files are read locally in browser RAM using HTML5 File Reader; no data goes to any server." }
    ]
  },
  "color-picker-tool": {
    purpose: "select colors, gradients, and build palettes",
    mechanism: "provides color slider coordinates and exports CSS codes",
    why: "Designing user interfaces and building matching HEX palettes manually is slow.",
    useCase: "building HEX codes, adjusting RGB sliders, and design palettes",
    steps: [
      "Adjust color sliders or click the color palette board.",
      "Select color formats (HEX, RGB, HSL).",
      "Copy the generated color codes."
    ],
    advs: ["Interactive visual color canvas picker", "Converts coordinates to HEX, RGB, HSL, and CMYK", "Processed client-side safely"],
    errors: ["Picking colors on uncalibrated screens, causing colors to print differently"],
    faqs: [
      { q: "Does it export CSS codes?", a: "Yes, you can copy the values as standard CSS color declarations." }
    ]
  },
  "hex-to-rgb": {
    purpose: "convert HEX hexadecimal color codes into RGB triplet values",
    mechanism: "parses hex color strings and maps them to base-10 RGB coordinates",
    why: "CSS and graphics frameworks require RGB triplets, while designers often work in HEX.",
    useCase: "converting web design color tokens, stylesheet coding, and matching palettes",
    steps: [
      "Type or paste your HEX color code.",
      "Review the parsed RGB values and alpha levels.",
      "Copy the converted RGB color triplet."
    ],
    advs: ["Translates HEX color codes to RGB and RGBA formats", "Interactive color preview panel", "Runs locally in browser RAM"],
    errors: ["Pasting invalid HEX formats (like missing '#' or using wrong length strings)"],
    faqs: [
      { q: "Does it support alpha channels?", a: "Yes, 8-character HEX codes are converted to RGBA coordinates with transparency." }
    ]
  },
  "rgb-to-hex": {
    purpose: "convert RGB color coordinates into standard HEX hexadecimal strings",
    mechanism: "converts base-10 RGB coordinates into base-16 HEX codes",
    why: "Design files use HEX formats, making conversion from RGB coordinate values necessary.",
    useCase: "converting RGB values from graphic editors, CSS formatting, and palette updates",
    steps: [
      "Input red, green, and blue values (0-255).",
      "Adjust the alpha level if transparency is needed.",
      "Copy the generated HEX or AHEX string."
    ],
    advs: ["Converts RGB values to standard HEX and 8-character HEX structures", "Shows real-time color backdrop preview", "Runs offline securely"],
    errors: ["Entering color coordinates greater than 255, which is invalid"],
    faqs: [
      { q: "What happens to the alpha channel?", a: "It is converted into a 2-character hex suffix at the end of the HEX code." }
    ]
  },
  "timestamp-converter": {
    purpose: "convert human-readable calendar dates to epoch timestamps and vice versa",
    mechanism: "parses date inputs using JavaScript Date parameters client-side",
    why: "Debugging API database logs containing epoch timestamps requires translating them to calendar dates.",
    useCase: "debugging log files, checking API times, and database conversions",
    steps: [
      "Enter a unix timestamp or select a calendar date and time.",
      "Convert to see outputs in UTC, local time, and epoch formats.",
      "Copy the converted timestamp."
    ],
    advs: ["Translates timestamps to UTC and local calendar dates", "Supports seconds and milliseconds formats", "Runs locally in browser memory"],
    errors: ["Confusing seconds-based timestamps (Unix standard) with millisecond-based timestamps (JS standard)"],
    faqs: [
      { q: "What is Epoch time?", a: "Epoch time is the total number of seconds that have elapsed since January 1, 1970 (UTC), excluding leap seconds." }
    ]
  },
  "unix-time-converter": {
    purpose: "display the current Unix epoch time ticks",
    mechanism: "queries system clocks and calculates elapsed seconds in-browser",
    why: "Developers need the current Unix timestamp instantly for debugging and API requests.",
    useCase: "checking current epoch times, database logs verification, and timing checks",
    steps: [
      "Review the live updating Unix timestamp on the screen.",
      "Copy the timestamp in seconds or milliseconds."
    ],
    advs: ["Real-time updating unix epoch counter", "One-click copy buttons for seconds and milliseconds", "Runs offline securely"],
    errors: ["Assuming Unix time is timezone-dependent; it is always in UTC"],
    faqs: [
      { q: "Is Unix time timezone-independent?", a: "Yes. Unix time is defined in UTC, meaning it is identical worldwide at any given moment." }
    ]
  },
  "markdown-previewer": {
    purpose: "compose and render Markdown files dynamically",
    mechanism: "parses markdown strings into HTML layers client-side using marked libraries",
    why: "Writing README files or blog articles in Markdown without a live visual preview is slow.",
    useCase: "writing README docs, drafting blog formatting, and compiling documentation",
    steps: [
      "Type or paste your Markdown text on the left editor.",
      "Review the rendered HTML view on the right.",
      "Copy the HTML code or download the file."
    ],
    advs: ["Real-time side-by-side Markdown rendering", "Supports standard GitHub Flavored Markdown (GFM)", "Runs entirely client-side privately"],
    errors: ["Pasting unsupported HTML tags inside Markdown text blocks, which can break formatting"],
    faqs: [
      { q: "Does it support images?", a: "Yes, standard markdown image links are rendered in the preview if the image URLs are valid." }
    ]
  },
  "html-previewer": {
    purpose: "render HTML code snippets in a secure sandbox frame",
    mechanism: "binds HTML code to sandboxed iframe layouts client-side",
    why: "Testing HTML layout changes or custom widgets without launching a local server is slow.",
    useCase: "testing HTML snippets, inspecting layout styling, and design tests",
    steps: [
      "Paste your HTML, CSS, and JS code in the editor.",
      "Review the rendered page inside the secure sandbox iframe.",
      "Update code to see instant changes."
    ],
    advs: ["Sandboxed iframe prevents script leaks", "Live rendering updates as you type", "Processed locally safely"],
    errors: ["Running scripts that try to access the parent page, which is blocked by the iframe sandbox security rules"],
    faqs: [
      { q: "Is it safe to run script codes here?", a: "Yes. The preview iframe is fully sandboxed, restricting access to cookies, local storage, and the parent page." }
    ]
  },
  "web-compiler": {
    purpose: "compile and execute HTML, CSS, and JS code live",
    mechanism: "injects custom HTML, CSS stylesheets, and JS files into an iframe sandboxed workspace",
    why: "Setting up test environments for quick front-end projects takes too much time.",
    useCase: "prototyping web widgets, testing JS functions, and learning front-end development",
    steps: [
      "Write your code in the HTML, CSS, and JS editors.",
      "Click run or enable auto-run options.",
      "Review outputs in the sandbox frame."
    ],
    advs: ["Separate editors for HTML, CSS, and JS code blocks", "Interactive preview container with console logs", "Runs 100% locally in browser RAM"],
    errors: ["Writing infinite loops in JS code, which can freeze the browser tab workspace"],
    faqs: [
      { q: "Can I use external libraries?", a: "Yes, you can load external scripts or stylesheets (like Bootstrap, Tailwind) using CDN links in the HTML header." }
    ]
  },

  // --- CONVERSION TOOLS ---
  "length-converter": {
    purpose: "convert length and distance measurements",
    mechanism: "normalizes distance inputs to meters and applies target multipliers client-side",
    why: "Scaling measurements between metric units and imperial values manually is tedious.",
    useCase: "checking shipping box lengths, homework projects, and travel distance audits",
    steps: [
      "Enter the length value.",
      "Select source unit (meters, feet, inches, miles).",
      "Select target unit and check converted value."
    ],
    advs: ["Translates distances across multiple metric and imperial units", "Handles decimals and fractions accurately", "Runs offline in browser cache"],
    errors: ["Selecting incorrect unit prefixes (e.g. confusing millimeters with micrometers)"],
    faqs: [
      { q: "What units are supported?", a: "It supports standard units including km, meters, cm, mm, miles, yards, feet, and inches." }
    ]
  },
  "weight-converter": {
    purpose: "convert mass and weight measurements",
    mechanism: "normalizes mass inputs to grams and converts them to target units client-side",
    why: "Checking product weights or cooking measurements across metric and imperial scales is slow.",
    useCase: "checking shipping package weights, cooking recipe scales, and science projects",
    steps: [
      "Enter weight value.",
      "Select source unit (kg, pounds, ounces, grams).",
      "Convert and review the target mass value."
    ],
    advs: ["Converts mass values across metric and imperial systems", "Displays multiple conversion values together", "Runs locally securely"],
    errors: ["Confusing fluid ounces (volume) with dry ounces (weight/mass)"],
    faqs: [
      { q: "Does it support metric tons?", a: "Yes, it supports conversions for metric tons, kilograms, grams, milligrams, pounds, and ounces." }
    ]
  },
  "temperature-converter": {
    purpose: "convert temperature scales",
    mechanism: "applies temperature formulas (Celsius, Fahrenheit, Kelvin) client-side",
    why: "Converting temperatures for weather, science, or cooking requires specific offset math.",
    useCase: "checking travel weather, science calculations, and recipe oven settings",
    steps: [
      "Enter the temperature value.",
      "Select source scale (Celsius, Fahrenheit, Kelvin).",
      "Check the converted temperature value instantly."
    ],
    advs: ["Supports Celsius, Fahrenheit, and Kelvin scales", "Applies exact offsets and multipliers", "Runs offline in browser cache"],
    errors: ["Entering temperatures below absolute zero (-273.15°C or 0 Kelvin), which are physically impossible"],
    faqs: [
      { q: "What is absolute zero?", a: "It is the lowest possible temperature where all molecular motion stops, corresponding to 0 Kelvin or -273.15°C." }
    ]
  },
  "area-converter": {
    purpose: "convert area and surface measurements",
    mechanism: "normalizes area inputs to square meters and applies target multipliers",
    why: "Comparing land properties or apartment sizes across square feet, acres, and hectares is difficult.",
    useCase: "comparing real estate sizes, checking land plots, and design projects",
    steps: [
      "Enter the area value.",
      "Select source unit (sq ft, acres, hectares, sq meters).",
      "Save the converted area value."
    ],
    advs: ["Converts land and surface areas across metric and imperial systems", "Computes values instantly", "Processed on-device privately"],
    errors: ["Confusing linear dimensions with square surface areas (e.g. 10 feet square vs 10 square feet)"],
    faqs: [
      { q: "How many square feet are in an acre?", a: "There are exactly 43,560 square feet in one acre." }
    ]
  },
  "volume-converter": {
    purpose: "convert liquid and dry volume measurements",
    mechanism: "normalizes volume inputs to liters and applies target multipliers",
    why: "Scaling cooking liquids or container volumes across gallons, liters, and cups is complex.",
    useCase: "scaling kitchen recipes, checking liquid shipping volumes, and science projects",
    steps: [
      "Enter volume value.",
      "Select source unit (liters, gallons, cups, milliliters).",
      "Review converted volume value."
    ],
    advs: ["Converts volume across metric and imperial systems", "Handles liquid and dry unit conversions", "Runs locally securely"],
    errors: ["Confusing US liquid gallons with Imperial (UK) gallons, which have different volumes"],
    faqs: [
      { q: "Does it convert US vs UK gallons?", a: "Standard calculations use the US liquid system, but you can select specific UK indicators if needed." }
    ]
  },
  "speed-converter": {
    purpose: "convert speed and velocity measurements",
    mechanism: "normalizes speed inputs to meters-per-second and applies multipliers",
    why: "Comparing travel speeds or wind velocities across km/h, mph, and knots is tedious.",
    useCase: "checking road speed limits, wind speeds, and aviation knots",
    steps: [
      "Enter speed value.",
      "Select source unit (km/h, mph, knots, m/s).",
      "Review converted speed value."
    ],
    advs: ["Converts speeds across road, marine, and scientific units", "Applies standardized conversion constants", "Runs offline securely"],
    errors: ["Selecting wrong units when calculating vehicle travel times"],
    faqs: [
      { q: "What is a knot?", a: "A knot is a unit of speed equal to one nautical mile per hour, used in aviation and maritime navigation." }
    ]
  },
  "time-converter": {
    purpose: "convert time durations across different scales",
    mechanism: "normalizes time inputs to seconds and applies multipliers",
    why: "Converting years or weeks to hours or seconds manually requires long multiplication chains.",
    useCase: "planning project durations, calculation logs, and timing checks",
    steps: [
      "Enter time value.",
      "Select source unit (years, days, hours, minutes, seconds).",
      "Review converted time values."
    ],
    advs: ["Converts durations across all time units simultaneously", "Handles leap year assumptions correctly", "Runs client-side privately"],
    errors: ["Ignoring leap years when calculating large durations in years"],
    faqs: [
      { q: "How many seconds are in a day?", a: "There are exactly 86,400 seconds in a standard 24-hour day." }
    ]
  },
  "data-storage-converter": {
    purpose: "convert digital data storage units",
    mechanism: "applies base-2 (1024) or base-10 (1000) scale calculations client-side",
    why: "Hard drive manufacturers measure in base-10, while operating systems measure in base-2, creating size discrepancies.",
    useCase: "checking file sizes, server storage planning, and bandwidth estimation",
    steps: [
      "Enter data value.",
      "Select source unit (Bytes, KB, MB, GB, TB).",
      "Review the converted data storage list."
    ],
    advs: ["Supports both binary (1024) and decimal (1000) data scales", "Converts files size listings instantly", "Runs offline securely"],
    errors: ["Confusing bits (lowercase 'b') with Bytes (uppercase 'B'); 1 Byte = 8 bits"],
    faqs: [
      { q: "Why is a 1TB hard drive shown as 931GB in Windows?", a: "Drive makers define 1TB as 1,000,000,000,000 bytes. Windows calculates in binary base-1024, resulting in 931.3GB." }
    ]
  },
  "fuel-efficiency-converter": {
    purpose: "convert vehicle fuel consumption rates",
    mechanism: "applies reciprocal formulas to scale miles-per-gallon and liters-per-100km",
    why: "Comparing import vehicle specs requires converting MPG to liters per 100km.",
    useCase: "comparing vehicle fuel economies, car shopping, and trip budget logs",
    steps: [
      "Enter fuel efficiency value.",
      "Select source scale (MPG, L/100km).",
      "Review converted fuel efficiency rating."
    ],
    advs: ["Converts between distance-per-fuel and fuel-per-distance metrics", "Supports US and UK gallons", "Runs locally in browser RAM"],
    errors: ["Applying direct multiplication to reciprocal rates, which requires division math"],
    faqs: [
      { q: "Why is L/100km reciprocal to MPG?", a: "L/100km measures how much fuel is used to cover a set distance, while MPG measures how far you can travel on a set amount of fuel." }
    ]
  },
  "angle-converter": {
    purpose: "convert geometric angle measurements",
    mechanism: "normalizes angle inputs to radians and applies multipliers client-side",
    why: "Engineering calculations require transitioning angles between degrees, radians, and gradians.",
    useCase: "engineering calculations, math homework, and physics projects",
    steps: [
      "Enter angle value.",
      "Select source unit (degrees, radians, gradians).",
      "Review converted angle values."
    ],
    advs: ["Converts angles across degrees, radians, and gradians", "Maintains high decimal precision", "Runs offline in browser cache"],
    errors: ["Using degree mode for trigonometric formulas that expect radians"],
    faqs: [
      { q: "How many degrees are in a radian?", a: "One radian is approximately equal to 57.2958 degrees." }
    ]
  },
  "pressure-converter": {
    purpose: "convert physical pressure measurements",
    mechanism: "normalizes pressure inputs to Pascals and applies multipliers",
    why: "Checking tire pressure or barometer readings across PSI, bar, and Pascals requires complex constants.",
    useCase: "checking vehicle tire pressures, science experiments, and weather audits",
    steps: [
      "Enter pressure value.",
      "Select source unit (PSI, bar, Pascals, atmospheres).",
      "Review converted pressure values."
    ],
    advs: ["Converts pressure across engineering, weather, and metric units", "Displays standard atmospheric constants", "Processed on-device privately"],
    errors: ["Selecting wrong units, e.g. confusing millibar with bar"],
    faqs: [
      { q: "What is standard atmospheric pressure?", a: "Standard atmospheric pressure at sea level is exactly 1 atm, which corresponds to 14.696 PSI or 101,325 Pascals." }
    ]
  },
  "energy-converter": {
    purpose: "convert energy, work, and heat units",
    mechanism: "normalizes energy inputs to Joules and applies multipliers",
    why: "Comparing food nutrition calories with mechanical joules requires conversion factors.",
    useCase: "dietary calorie comparisons, physics assignments, and electricity billing checks",
    steps: [
      "Enter energy value.",
      "Select source unit (Joules, calories, kilowatt-hours, BTUs).",
      "Review converted energy values."
    ],
    advs: ["Converts energy across mechanical, electrical, and thermal units", "Supports food calories to Joules conversions", "Runs locally securely"],
    errors: ["Confusing electricity usage terms, like mistaking kW for kWh"],
    faqs: [
      { q: "How many Joules are in a food Calorie?", a: "One food Calorie (kilocalorie) is equal to approximately 4,184 Joules." }
    ]
  },
  "power-converter": {
    purpose: "convert power and rate of work measurements",
    mechanism: "normalizes power inputs to Watts and applies multipliers",
    why: "Comparing engine performance (horsepower) with electrical ratings (watts) requires standard scaling.",
    useCase: "comparing vehicle horsepowers, electrical appliance audits, and physics projects",
    steps: [
      "Enter power value.",
      "Select source unit (Watts, kilowatts, horsepower).",
      "Review converted power values."
    ],
    advs: ["Converts power across mechanical and electrical units", "Standardizes horsepower measurements", "Runs offline securely"],
    errors: ["Confusing total energy consumption (kWh) with active power output (kW)"],
    faqs: [
      { q: "How many Watts are in one horsepower?", a: "One mechanical horsepower is equal to approximately 745.7 Watts." }
    ]
  },
  "frequency-converter": {
    purpose: "convert frequency and wave cycles",
    mechanism: "normalizes frequency inputs to Hertz and applies multipliers",
    why: "Aviation or radio communication checks require scaling frequencies across kHz, MHz, and GHz.",
    useCase: "tuning radio channels, checking processor clock speeds, and audio tuning",
    steps: [
      "Enter frequency value.",
      "Select source unit (Hertz, kHz, MHz, GHz).",
      "Review converted frequency values."
    ],
    advs: ["Converts frequencies from basic audio to radio bandwidths", "Computes values instantly", "Processed client-side safely"],
    errors: ["Entering invalid periods instead of cycles-per-second values"],
    faqs: [
      { q: "What does Hertz measure?", a: "Hertz measures the number of cycles or repetitions of a wave per second." }
    ]
  },
  "number-base-converter": {
    purpose: "convert numerical bases (binary, octal, decimal, hexadecimal)",
    mechanism: "parses input bases and stringifies them to target bases client-side",
    why: "Software developers and computer scientists frequently need to convert numbers between hexadecimal, binary, and decimal formats.",
    useCase: "debugging memory addresses, coding hardware registers, and academic assignments",
    steps: [
      "Enter your number value.",
      "Select source base (binary, octal, decimal, hex).",
      "Review converted values across all four base systems."
    ],
    advs: ["Converts numbers across binary, octal, decimal, and hex simultaneously", "Supports large integer inputs", "Runs locally in browser RAM"],
    errors: ["Entering characters that are invalid in the selected base (e.g. typing '8' in binary)"],
    faqs: [
      { q: "What is base-16?", a: "Base-16 (hexadecimal) is a numbering system that uses 16 symbols: 0-9 and A-F to represent values from 10 to 15." }
    ]
  },

  // --- SEO TOOLS ---
  "meta-tag-generator": {
    purpose: "generate search engine compliant meta tags",
    mechanism: "collects input fields and outputs structured HTML `<meta>` tags",
    why: "Writing website meta tags manually leads to syntax errors and poor search indexing.",
    useCase: "launching website domains, writing search descriptions, and social previews",
    steps: [
      "Fill in website title, description, and keywords.",
      "Set indexing directives (allow follow, allow index).",
      "Copy the generated HTML meta tags and paste them in your `<head>` section."
    ],
    advs: ["Generates search engine compliant HTML meta tags", "Includes social media OpenGraph tags", "No registration required"],
    errors: ["Adding too many meta keywords, which search engines now ignore"],
    faqs: [
      { q: "Where do I paste these tags?", a: "Paste the generated HTML code inside the `<head>` section of your website pages." }
    ]
  },
  "meta-title-checker": {
    purpose: "verify meta title tags fit the Google snippet pixel length limits",
    mechanism: "calculates characters and visual pixel widths of text lines client-side",
    why: "Google truncates page titles in search results if they are too long, lowering CTR.",
    useCase: "auditing blog post titles, checking SEO headers, and article prep",
    steps: [
      "Paste your page title.",
      "Check character counts and visual pixel progress bars.",
      "Adjust text to fit within the green indicator boundary."
    ],
    advs: ["Measures title lengths in characters and Google search pixels", "Shows live preview of search snippets", "Runs locally in browser memory"],
    errors: ["Forgetting that capital letters consume more horizontal pixel space than lowercase ones"],
    faqs: [
      { q: "What is the recommended title length?", a: "Keep titles between 50 and 60 characters (or under 600 pixels) to prevent truncation." }
    ]
  },
  "meta-description-checker": {
    purpose: "verify meta descriptions fit Google's search snippet limits",
    mechanism: "measures description character lengths and pixel dimensions",
    why: "Google cuts off descriptions in search results if they exceed length limits, hiding key messages.",
    useCase: "writing meta description copy, auditing blogs, and marketing checks",
    steps: [
      "Paste your meta description text.",
      "Check character counts and pixel widths.",
      "Review the live Google search snippet preview."
    ],
    advs: ["Visualizes Google search result snippet limits", "Shows character and pixel width metrics", "Runs offline securely"],
    errors: ["Writing descriptions under 120 characters, which may not be descriptive enough"],
    faqs: [
      { q: "What is the ideal description length?", a: "Aim for 120 to 155 characters (or under 960 pixels) for optimal desktop and mobile visibility." }
    ]
  },
  "seo-keyword-density": {
    purpose: "analyze keyword frequency density percentages in text",
    mechanism: "tokenizes copy, removes common stop words, and counts keyword frequencies client-side",
    why: "Stuffing keywords in articles triggers Google search spam penalties.",
    useCase: "auditing blogs, optimizing SEO copy, and copywriting reviews",
    steps: [
      "Paste your article copy.",
      "Review keyword tables sorted by frequency and density percentage.",
      "Verify that key terms stay within target thresholds."
    ],
    advs: ["Analyzes keyword percentages to prevent stuffing", "Filters out standard filler stop-words automatically", "Processed client-side safely"],
    errors: ["Keeping keyword density above 3%, which search engines consider spammy"],
    faqs: [
      { q: "What is the target keyword density?", a: "Aim to keep main keywords between 1% and 2% density for natural reading and optimal SEO." }
    ]
  },
  "seo-slug-generator": {
    purpose: "generate clean SEO URLs from page titles",
    mechanism: "converts letters to lowercase, replaces spaces with hyphens, and strips special characters",
    why: "URLs with spaces, punctuation, or caps look messy and harm SEO rankings.",
    useCase: "naming blog files, setting web paths, and formatting links",
    steps: [
      "Paste your post or page title.",
      "Customize separator character options.",
      "Copy the clean URL slug."
    ],
    advs: ["Converts title text to clean, URL-safe slug formats", "Strips special characters and accents automatically", "Runs offline in browser cache"],
    errors: ["Including dates or numbers in slugs when creating timeless evergreen content"],
    faqs: [
      { q: "Should I include prepositions in URL slugs?", a: "It is best to strip short prepositions (e.g. 'a', 'the', 'of') to keep slugs short and focused." }
    ]
  },
  "robots-txt-generator": {
    purpose: "generate robots.txt crawler directives files",
    mechanism: "compiles website paths and crawler rules into standard robots.txt format",
    why: "Search engine crawlers waste crawl budgets indexing admin dashboards or internal folders.",
    useCase: "setting up new domains, block admin page indexing, and setting sitemap paths",
    steps: [
      "Select crawler rules (Allow/Disallow).",
      "Enter paths you wish to block from indexing.",
      "Add your XML sitemap URL and download the robots.txt file."
    ],
    advs: ["Generates search-engine compliant robots.txt files", "Allows custom disallow directives", "Runs locally in browser RAM"],
    errors: ["Accidentally blocking your entire site by disallowing the root path '/'"],
    faqs: [
      { q: "Where do I upload the robots.txt file?", a: "Upload the robots.txt file to the root directory of your website server (e.g., website.com/robots.txt)." }
    ]
  },
  "sitemap-xml-generator": {
    purpose: "build XML sitemaps to assist crawler indexing",
    mechanism: "compiles website URL lists and priority values into XML format client-side",
    why: "Search engines might miss deeper page paths if they aren't listed in an XML sitemap.",
    useCase: "submitting new sites, auditing index paths, and building sitemaps",
    steps: [
      "Enter your website URLs.",
      "Set change frequencies and priority levels.",
      "Download the sitemap.xml file."
    ],
    advs: ["Generates standard XML sitemap files for Google Search Console", "Supports custom priority and change frequencies", "Processed offline securely"],
    errors: ["Including blocked URLs or broken redirect links in your sitemap.xml"],
    faqs: [
      { q: "How many URLs can a sitemap.xml contain?", a: "A single sitemap.xml can contain up to 50,000 URLs or be 50MB in size." }
    ]
  },
  "open-graph-generator": {
    purpose: "generate OpenGraph HTML meta tags for social sharing",
    mechanism: "collects metadata and formats HTML OpenGraph property tags",
    why: "Shared links look like raw text links on Facebook or LinkedIn unless OG tags are set.",
    useCase: "optimizing social preview cards, landing pages development, and blog indexing",
    steps: [
      "Enter page title, description, and preview image URL.",
      "Select open graph card types (website, article).",
      "Copy the generated HTML og:property tags and paste in header."
    ],
    advs: ["Generates standard Facebook and LinkedIn compliant OpenGraph tags", "Includes instant preview display simulations", "Runs locally in browser memory"],
    errors: ["Using incorrect image URL paths that prevent social cards from displaying previews"],
    faqs: [
      { q: "Why are OG tags important?", a: "They tell social networks what image and title to display when someone shares your link, increasing clicks." }
    ]
  },
  "twitter-card-generator": {
    purpose: "generate Twitter Card HTML meta tags",
    mechanism: "collects card details and formats HTML twitter:property tags",
    why: "Shared website links look plain on Twitter/X without custom summary card images.",
    useCase: "optimizing Twitter share cards, social media marketing, and blog launches",
    steps: [
      "Enter title, description, and Twitter account username.",
      "Select card format (Summary or Summary Large Image).",
      "Download and copy the HTML tags."
    ],
    advs: ["Generates Twitter/X compliant twitter:card tags", "Supports Summary Large Image layout selections", "Runs offline securely"],
    errors: ["Setting Twitter Card images that exceed size limits (must be under 5MB)"],
    faqs: [
      { q: "How do I check if my Twitter Card works?", a: "Use official Twitter Card Validator or share the link on a test account to preview." }
    ]
  },
  "seo-word-count": {
    purpose: "measure keyword presence and word counts for SEO articles",
    mechanism: "tokenizes text and calculates word densities client-side",
    why: "Google prefers comprehensive, in-depth content that fits target word count benchmarks.",
    useCase: "auditing competitor lengths, blog planning, and copywriting checks",
    steps: [
      "Paste your competitor or draft article text.",
      "Check total word counts, average paragraph lengths, and keywords density.",
      "Optimize text structure."
    ],
    advs: ["Specifically tailored for SEO content audits", "Measures word counts and paragraph structures together", "Runs locally securely"],
    errors: ["Writing thin content that doesn't answer search queries, regardless of word counts"],
    faqs: [
      { q: "What is the best word count for SEO articles?", a: "There is no fixed limit, but high-ranking informational articles average 1,500 to 2,500 words depending on topic depth." }
    ]
  },
  "heading-structure-checker": {
    purpose: "analyze heading hierarchies of website code",
    mechanism: "parses HTML layouts and maps the nesting order of H1-H6 tags client-side",
    why: "Skipping heading levels (like jumping from H1 to H3) confuses search crawlers and screen readers.",
    useCase: "auditing page templates, checking blog structures, and accessibility audits",
    steps: [
      "Paste your page HTML code snippet.",
      "Review the visual nested hierarchy of H1-H6 heading tags.",
      "Identify skipped heading levels flagged in red."
    ],
    advs: ["Visualizes the heading tag nesting hierarchy", "Flags skipped levels (e.g. H2 to H4) immediately", "Runs client-side privately"],
    errors: ["Having multiple H1 tags on a single page, which is not recommended for SEO"],
    faqs: [
      { q: "Can a page have multiple H1 tags?", a: "It is best practice to have exactly one H1 tag per page representing the main title." }
    ]
  }
};

// Now we loop through the 8 database files and populate them
const categories = {
  image: ['image', 'editing'],
  pdf: ['pdf'],
  qr: ['qr'],
  calculators: ['calculators'],
  text: ['text'],
  dev: ['dev'],
  convert: ['convert'],
  seo: ['seo']
};

const detailsDir = path.join(__dirname, '../src/lib/tool-content/details');

for (const [catName, sections] of Object.entries(categories)) {
  const filePath = path.join(detailsDir, `${catName}Db.ts`);
  
  let content = `// Tool Details Database for ${catName} category\n`;
  content += `export interface ToolDetailEntry {\n`;
  content += `  whyNeed: string;\n`;
  content += `  howWorks: string;\n`;
  content += `  whenToUse: string;\n`;
  content += `  stepByStep: string[];\n`;
  content += `  advantages: string[];\n`;
  content += `  commonMistakes: string[];\n`;
  content += `  faqs: { question: string; answer: string }[];\n`;
  content += `}\n\n`;
  
  content += `export const ${catName}DetailsDb: Record<string, ToolDetailEntry> = {\n`;
  
  const catTools = Object.keys(toolDetailsMap).filter(id => {
    // Check if the tool's section ID matches one of the sections of this category
    const dumpItem = fs.existsSync(path.join(__dirname, 'tools_dump.json'))
      ? JSON.parse(fs.readFileSync(path.join(__dirname, 'tools_dump.json'), 'utf-8')).find(t => t.id === id)
      : null;
    return dumpItem && sections.includes(dumpItem.sectionId);
  });
  
  catTools.forEach((id, idx) => {
    const item = toolDetailsMap[id];
    const dumpItem = JSON.parse(fs.readFileSync(path.join(__dirname, 'tools_dump.json'), 'utf-8')).find(t => t.id === id);
    const name = dumpItem ? dumpItem.name : id;
    
    // Construct paragraphs dynamically based on unique inputs
    const whyNeed = item.why ? item.why : `Managing and processing ${name.toLowerCase()} operations manually is slow, frustrating, and prone to errors. The **${name}** provides an optimized local workspace to streamline your digital workflows instantly.`;
    const howWorks = `The browser-based application reads parameters in-memory. Specifically, the engine ${item.mechanism || `executes JavaScript operations client-side in the browser cache`} for high-speed operation, providing instant feedback without sending any data over the internet.`;
    const whenToUse = `Use the **${name}** when you need to ${item.purpose || `process ${name.toLowerCase()} parameters`} during ${item.useCase || `daily digital workflows, office tasks, and content creation`}.`;
    
    const stepByStep = item.steps && item.steps.length > 0 ? item.steps : [
      `Paste or upload your inputs into the designated workspace.`,
      `Select custom parameters or formatting options if required.`,
      `Click the primary action button to process variables in-memory.`,
      `Review and copy the resulting output values.`
    ];
    
    const advantages = item.advs && item.advs.length > 0 ? item.advs : [
      `Processes data 100% locally to protect private files`,
      `Fast execution with zero network round-trip delays`,
      `Responsive layout works on mobile and desktop screens`
    ];
    
    const commonMistakes = item.errors && item.errors.length > 0 ? item.errors : [
      `Entering corrupted inputs or incorrect formatting tags`,
      `Forgetting to copy or download final outputs before closing the page`
    ];
    
    const faqs = item.faqs && item.faqs.length > 0 ? item.faqs : [
      { question: `Does the ${name} save my data?`, answer: `No. All operations run client-side in your browser cache. Once the tab is closed, all traces of your session are instantly erased from memory.` },
      { question: `Can I use this tool offline?`, answer: `Yes. Once the page is loaded in your browser, the tool runs entirely client-side, allowing offline usage.` }
    ];
    
    content += `  "${id}": {\n`;
    content += `    whyNeed: ${JSON.stringify(whyNeed)},\n`;
    content += `    howWorks: ${JSON.stringify(howWorks)},\n`;
    content += `    whenToUse: ${JSON.stringify(whenToUse)},\n`;
    content += `    stepByStep: ${JSON.stringify(stepByStep)},\n`;
    content += `    advantages: ${JSON.stringify(advantages)},\n`;
    content += `    commonMistakes: ${JSON.stringify(commonMistakes)},\n`;
    content += `    faqs: ${JSON.stringify(faqs)}\n`;
    content += `  }${idx < catTools.length - 1 ? ',' : ''}\n`;
  });
  
  content += `};\n`;
  
  fs.writeFileSync(filePath, content, 'utf8');
}

console.log("Successfully populated all details DB files under src/lib/tool-content/details/");
