import { UtilityRegistryItem } from '@/content/tools/toolRegistry';
import { getManualOverride } from './manualToolOverrides';
import { getConversionIntent, formatProfiles, FormatProfile } from './formatMatrix';
import { getCompressionProfile } from './compressionMatrix';

export type ToolOperationType =
  | "pdf-conversion"
  | "image-conversion"
  | "image-compression"
  | "pdf-management"
  | "pdf-extraction"
  | "image-editing"
  | "developer-formatting"
  | "developer-encoding"
  | "developer-decoding"
  | "developer-generation"
  | "seo-analysis"
  | "seo-generation"
  | "text-analysis"
  | "text-cleanup"
  | "text-generation"
  | "qr-generation"
  | "qr-scanning"
  | "calculator"
  | "unit-conversion"
  | "productivity"
  | "utility";

export interface ToolContentProfile {
  toolName: string;
  slug: string;
  url: string;
  category: string;
  subcategory?: string;
  shortDescription: string;

  operationType: ToolOperationType;

  sourceFormat?: string;
  targetFormat?: string;

  inputType: string;
  outputType: string;

  inputDescription: string;
  outputDescription: string;

  userIntent: string;
  userProblem: string;
  actualTransformation: string;
  keyBenefit: string;

  primaryAudience: string[];
  practicalUseCases: string[];
  advantages: string[];
  limitations: string[];
  commonMistakes: string[];
  troubleshooting: string[];
  relatedToolSlugs: string[];

  privacyNoteType:
    | "browser-file"
    | "possible-server"
    | "developer-sensitive"
    | "calculator-estimate"
    | "text-review"
    | "general";

  keywordProfile: {
    primaryKeyword: string;
    secondaryKeywords: string[];
    longTailKeywords: string[];
    semanticKeywords: string[];
  };

  articleDepth: "small" | "medium" | "detailed";
  imageIntent: string;
  operationWorks?: string[];
  internalProcessingFlow?: string[];
}

const VALID_FORMATS = new Set([
  "pdf", "jpg", "jpeg", "png", "webp", "svg", "word", "docx", "txt", "base64", "image", "color", "black-and-white", "text",
  "hex", "rgb", "html", "markdown", "binary", "decimal", "octal"
]);

function isFormatConversionId(id: string): boolean {
  if (!id.includes("-to-")) return false;
  const parts = id.split("-to-");
  return parts.length === 2 && VALID_FORMATS.has(parts[0].toLowerCase()) && VALID_FORMATS.has(parts[1].toLowerCase());
}

export function buildToolContentProfile(tool: UtilityRegistryItem): ToolContentProfile {
  const name = tool.name;
  const slug = tool.guideSlug;
  const url = tool.utilityUrl;

  // Infer operation type
  let opType: ToolOperationType = "utility";
  const sectionId = tool.sectionId.toLowerCase();
  const subSectionId = tool.subSectionId.toLowerCase();

  if (sectionId === "pdf") {
    if (subSectionId.includes("conversion") || isFormatConversionId(tool.id)) {
      opType = "pdf-conversion";
    } else if (subSectionId.includes("management") || tool.id.includes("pages")) {
      opType = "pdf-management";
    } else if (subSectionId.includes("text") || tool.id.includes("text")) {
      opType = "pdf-extraction";
    } else {
      opType = "pdf-management";
    }
  } else if (sectionId === "image" || sectionId === "editing") {
    if (subSectionId.includes("compression") || tool.id.includes("compress")) {
      opType = "image-compression";
    } else if (subSectionId.includes("conversion") || isFormatConversionId(tool.id)) {
      opType = "image-conversion";
    } else if (sectionId === "editing" || subSectionId.includes("edit")) {
      opType = "image-editing";
    }
  } else if (sectionId === "qr") {
    if (tool.id.includes("scanner")) {
      opType = "qr-scanning";
    } else {
      opType = "qr-generation";
    }
  } else if (sectionId === "calculators") {
    opType = "calculator";
  } else if (sectionId === "convert") {
    opType = "unit-conversion";
  } else if (sectionId === "text") {
    if (tool.id.includes("counter") || tool.id.includes("compare")) {
      opType = "text-analysis";
    } else if (tool.id.includes("generator") || tool.id.includes("lorem")) {
      opType = "text-generation";
    } else {
      opType = "text-cleanup";
    }
  } else if (sectionId === "dev") {
    if (subSectionId.includes("formatter") || tool.id.includes("formatter") || tool.id.includes("beautifier")) {
      opType = "developer-formatting";
    } else if (tool.id.includes("generator") || tool.id.includes("uuid")) {
      opType = "developer-generation";
    } else if (tool.id.includes("encode") || tool.id.includes("encrypt")) {
      opType = "developer-encoding";
    } else {
      opType = "developer-decoding";
    }
  } else if (sectionId === "seo") {
    if (tool.id.includes("generator")) {
      opType = "seo-generation";
    } else {
      opType = "seo-analysis";
    }
  }

  // Parse conversion directions (e.g. "pdf-to-jpg")
  let sourceFormat: string | undefined;
  let targetFormat: string | undefined;
  if (isFormatConversionId(tool.id)) {
    const parts = tool.id.split("-to-");
    if (parts.length === 2) {
      sourceFormat = parts[0];
      targetFormat = parts[1];
    }
  }

  // Inputs and Outputs (cleaned up dynamically based on category to correct registry schema inconsistencies)
  let inputsStr = tool.inputType.length > 0 ? tool.inputType.join(", ") : "Input variables";
  let outputsStr = tool.outputType.length > 0 ? tool.outputType.join(", ") : "Output results";

  const catL = tool.sectionId.toLowerCase();
  const idL = tool.id.toLowerCase();

  // Overwrite defaults only if registered inputs/outputs are generic placeholders
  const isGenericInput = tool.inputType.length === 0 || tool.inputType.every(t => 
    ["Numeric Parameters", "Rates / Tenures", "Input variables", "Input Text / Domain", "Source Format File / Value", "User Inputs", "Large File / Document", "Configuration Settings", "Parameters"].includes(t)
  );
  const isGenericOutput = tool.outputType.length === 0 || tool.outputType.every(t => 
    ["Calculated Metrics", "Schedules", "Output results", "Validation Rules Report", "Target Format File / Value", "Processed Results", "Compressed File / Document", "Generated Output String / Key"].includes(t)
  );

  if (catL.includes("pdf")) {
    if (isGenericInput) inputsStr = "PDF Document File";
    if (isGenericOutput) outputsStr = "Modified PDF Document";
  } else if (catL.includes("image")) {
    if (isGenericInput) inputsStr = "Image Graphic File";
    if (isGenericOutput) outputsStr = "Processed Image Graphic";
  } else if (catL.includes("calculator")) {
    if (isGenericInput) inputsStr = "Numeric Parameters";
    if (isGenericOutput) outputsStr = "Calculated Results";
  } else if (idL.includes("formatter") || idL.includes("beautifier") || idL.includes("json") || idL.includes("xml")) {
    if (isGenericInput) inputsStr = "Raw Markup or Code Text";
    if (isGenericOutput) outputsStr = "Formatted Code Structure";
  }

  const hash = getSlugHash(slug);
  const nameL = name.toLowerCase();
  
  const defaultIntents = [
    `perform local ${nameL} actions quickly and securely`,
    `execute standard ${nameL} tasks directly on your CPU device`,
    `manage and process your ${nameL} parameters offline with ease`,
    `convert, parse, or format ${nameL} variables without server lag`,
    `run browser-native ${nameL} transformations in real-time`,
    `utilize a client-side sandbox to handle ${nameL} actions safely`,
    `generate and check ${nameL} resources locally inside your active tab`,
    `streamline daily workflow configurations using our offline-first ${nameL}`
  ];
  let userIntent = defaultIntents[hash % defaultIntents.length];

  const defaultProblems = [
    `manually processing ${nameL} properties requires expensive software installations or exposes sensitive details to remote storage`,
    `handling ${nameL} parameters manually is slow and risks leaking private credentials to third-party databases`,
    `standard tools for ${nameL} are slow, filled with ads, or force you to upload files to cloud servers`,
    `configuring or converting ${nameL} blocks requires complex command-line scripts or online registration`,
    `typical methods for managing ${nameL} result in network lag and raise corporate privacy concerns`,
    `running audits or checks on ${nameL} leads to browser crashes or formatting errors on legacy platforms`,
    `developers and office workers struggle to process ${nameL} safely without server-side monitoring`,
    `sharing data logs or documents with online ${nameL} services violates local security policies`
  ];
  let userProblem = defaultProblems[(hash + 1) % defaultProblems.length];

  const defaultTransformations = [
    `applies optimized client-side script routines to validate and build the finished output`,
    `evaluates character strings and parses inputs in-memory to generate clean formatted results`,
    `draws coordinates or recalculates variables locally to construct the final output layout`,
    `processes the raw data streams client-side to render target results in milliseconds`,
    `executes browser-native compiler methods in volatile cache to translate parameters`,
    `runs localized formatting scripts on your CPU to compile compliant outputs`,
    `checks character bounds or metadata tags offline to render the processed result`,
    `manipulates buffer layers or text elements to rebuild standard compliant outputs`
  ];
  let actualTransformation = defaultTransformations[(hash + 2) % defaultTransformations.length];

  const defaultBenefits = [
    `saves the resulting output to your device instantly while keeping all processing offline`,
    `ensures your parameters remain inside your active tab and are never shared with cloud logs`,
    `delivers instant execution with zero internet requirements or software setups`,
    `protects your confidential inputs from third-party monitoring during formatting`,
    `bypasses remote server bottlenecks and clears all memory buffers immediately on closing the tab`,
    `guarantees a secure, tracker-free workspace to organize your digital assets`,
    `complies with strict corporate privacy rules by running entirely on client hardware`,
    `eliminates data leaks and provides a smooth, responsive desktop and mobile experience`
  ];
  let keyBenefit = defaultBenefits[(hash + 3) % defaultBenefits.length];

  if (opType === "qr-generation") {
    const qrType = nameL.replace("qr code generator", "").replace("qr generator", "").trim() || "data";
    const intents = [
      `generate custom QR codes for sharing ${qrType} details`,
      `create scannable QR matrix patterns containing your ${qrType} parameters`,
      `build permanent, static QR graphics for ${qrType} credentials`,
      `compile downloadable QR code images to share ${qrType} configurations`
    ];
    userIntent = intents[hash % intents.length];

    const problems = [
      `sharing ${qrType} credentials or parameters requires a simple, permanent scannable image without tracking links`,
      `typical online generators inject redirect links or display intrusive ads when scanning ${qrType} details`,
      `users want a safe, tracker-free way to distribute ${qrType} setup codes to mobile clients`,
      `distributing raw ${qrType} configurations manually is slow and leads to character typos`
    ];
    userProblem = problems[(hash + 1) % problems.length];

    const transformations = [
      `encodes the ${qrType} variables into a standard 2D matrix grid and renders it onto a downloadable canvas`,
      `calculates Reed-Solomon error correction for the ${qrType} data and draws the black-and-white grid blocks`,
      `processes the ${qrType} input string into binary format to construct the graphic matrix locally`,
      `maps the ${qrType} coordinates onto an HTML5 canvas to compile a high-contrast static barcode`
    ];
    actualTransformation = transformations[(hash + 2) % transformations.length];

    const benefits = [
      `creates static, permanent QR codes for ${qrType} immediately in your browser tab, ensuring total privacy`,
      `ensures your guest network or ${qrType} variables are encoded directly into the pattern with zero redirects`,
      `delivers scannable barcode files instantly without sharing passwords or links on remote servers`,
      `bypasses middleman servers, meaning the compiled ${qrType} code works indefinitely`
    ];
    keyBenefit = benefits[(hash + 3) % benefits.length];
  } else if (opType === "qr-scanning") {
    userIntent = `scan and decode QR code matrices instantly using your camera or image files`;
    userProblem = `decoding QR code graphics typically requires installing unsecure third-party mobile apps with tracking scripts`;
    actualTransformation = `accesses the camera stream or loaded image frames to scan and extract encoded string parameters`;
    keyBenefit = `decodes standard QR codes locally in your browser memory, keeping scanned URLs and data fully private`;
  } else if (opType === "unit-conversion") {
    const unitType = nameL.replace("converter", "").trim();
    const intents = [
      `convert and scale ${unitType} measurements between metric and imperial units`,
      `calculate and translate standard ${unitType} values across different scales`,
      `convert numeric ${unitType} parameters using high-precision scaling factors`,
      `scale and compute alternative ${unitType} measurement units in real-time`
    ];
    userIntent = intents[hash % intents.length];

    const problems = [
      `manually translating ${unitType} units requires remembering complex scaling formulas`,
      `checking ${unitType} scales across different regional systems is tedious and prone to calculation errors`,
      `traditional websites for ${unitType} reload page contents or display invasive ads for simple queries`,
      `memorizing exact multiplier coefficients for ${unitType} transformations is difficult during quick tasks`
    ];
    userProblem = problems[(hash + 1) % problems.length];

    const transformations = [
      `applies exact mathematical ratios to convert ${unitType} values instantly`,
      `multiplies the input numeric quantity by standard constants in-memory`,
      `runs precise algebraic formulas client-side to calculate matching ${unitType} metrics`,
      `executes local browser arithmetic to scale the input parameters into the target unit`
    ];
    actualTransformation = transformations[(hash + 2) % transformations.length];

    const benefits = [
      `gives you accurate ${unitType} conversion results as you type, with zero lag`,
      `renders precise unit calculations offline without requiring external network calls`,
      `delivers instant mathematical outputs on your screen to simplify your calculations`,
      `assures stable mathematical performance with complete data security in your browser`
    ];
    keyBenefit = benefits[(hash + 3) % benefits.length];
  } else if (opType === "image-editing") {
    const editAction = nameL.replace("image", "").trim();
    const intents = [
      `perform ${editAction} modifications on your image files`,
      `apply localized ${editAction} filters and changes to your graphics`,
      `edit photos and screenshots by applying client-side ${editAction} rendering`,
      `enhance or adjust your design assets with custom ${editAction} operations`
    ];
    userIntent = intents[hash % intents.length];

    const problems = [
      `applying quick enhancements like ${editAction} to photos usually requires heavy design suites or slow uploads`,
      `sharing high-resolution photos with web tools to run ${editAction} actions risks leaking metadata and files`,
      `manual adjustments for ${editAction} are tedious and slow when using generic photo editors`,
      `editors charge subscriptions or add watermarks when exporting ${editAction} files online`
    ];
    userProblem = problems[(hash + 1) % problems.length];

    const transformations = [
      `manipulates image canvas layers to apply the local ${editAction} operations directly in RAM`,
      `processes pixel array coordinates client-side to render the visual ${editAction} adjustments`,
      `executes canvas rendering context drawing operations to apply ${editAction} transformations in real-time`,
      `runs localized pixel shaders and matrix operations to adjust image data for the ${editAction} output`
    ];
    actualTransformation = transformations[(hash + 2) % transformations.length];

    const benefits = [
      `renders the finished ${editAction} image output instantly on your screen without design logs`,
      `exports the processed ${editAction} graphics directly in your browser with zero network transfers`,
      `keeps your personal snapshots private by running all visual edits on your own hardware`,
      `yields high-resolution optimized outputs without compressing details or adding watermarks`
    ];
    keyBenefit = benefits[(hash + 3) % benefits.length];
  } else if (nameL.includes("voice recorder") || nameL.includes("audio recorder")) {
    userIntent = `capture and record microphone audio or system sound inputs`;
    userProblem = `capturing voice or microphone feeds online often requires insecure browser extensions or remote upload buffers`;
    actualTransformation = `captures real-time audio device input streams and encodes the sound frequencies into compressed WebM or MP3 files`;
    keyBenefit = `records clear microphone sound locally in your browser memory, keeping audio recordings private`;
  } else if (nameL.includes("screen recorder")) {
    userIntent = `record and capture your browser tab, window, or desktop screen`;
    userProblem = `recording screen activity usually requires installing bloated desktop software that logs system interactions`;
    actualTransformation = `captures display media stream tracks and compiles the video frames into playable WebM files`;
    keyBenefit = `saves your high-definition screen video recordings directly to your download folder securely`;
  } else if (nameL.includes("compress")) {
    const target = nameL.replace("compressor", "").replace("compress", "").trim() || "files";
    userIntent = `reduce the file size and compress your ${target} files`;
    userProblem = `large ${target} files exceed upload limits on official portals and consume too much storage`;
    actualTransformation = `optimizes the internal structure and runs compression algorithms on the ${target} data`;
    keyBenefit = `lowers the file size of your ${target} document or image while maintaining readable quality`;
  } else if (isFormatConversionId(tool.id)) {
    const fromF = (sourceFormat || "source").toUpperCase();
    const toF = (targetFormat || "target").toUpperCase();
    userIntent = `convert and reformat files from ${fromF} to ${toF} format`;
    
    const isRaster = (f: string) => ["JPG", "JPEG", "PNG", "WEBP"].includes(f);
    const isVector = (f: string) => ["SVG"].includes(f);
    const isPdf = (f: string) => ["PDF"].includes(f);
    
    if (isRaster(fromF) && isRaster(toF)) {
      const problems = [
        `web portals and layouts require specific raster formats (like ${toF}) for compatibility or transparency`,
        `sharing high-resolution ${fromF} graphics causes page loading latency, requiring standard ${toF} formats`,
        `editing or uploading photos is blocked when target portals reject standard ${fromF} file extensions`,
        `design suites need format translations to parse layers without losing transparent backing properties`
      ];
      userProblem = problems[hash % problems.length];

      const transformations = [
        `decodes the ${fromF} pixel stream and writes a compressed ${toF} file structure client-side`,
        `renders the source ${fromF} graphics onto a temporary canvas and exports the pixel data in ${toF} format`,
        `reads the image binary array in RAM and translates headers to generate a standard ${toF} file`,
        `maps the raw raster pixels inside an in-memory canvas context to compile the output ${toF} format`
      ];
      actualTransformation = transformations[(hash + 1) % transformations.length];

      const benefits = [
        `converts your ${fromF} graphics to ${toF} in seconds without uploading files to remote databases`,
        `delivers a compliant ${toF} graphic asset instantly, preserving visual layouts and dimensions`,
        `bypasses cloud queues to write the target ${toF} output locally inside your browser memory`,
        `ensures complete confidentiality for your photographs while generating compatible ${toF} extensions`
      ];
      keyBenefit = benefits[(hash + 2) % benefits.length];
    } else if (isRaster(fromF) && isVector(toF)) {
      const problems = [
        `scaling raster photos like ${fromF} causes pixelation, requiring a scalable vector graphic format like ${toF}`,
        `responsive web elements need vector outlines that remain perfectly sharp at any resolution, unlike raster ${fromF} files`,
        `design templates reject static ${fromF} pixel grids when building scalable responsive logos or layouts`,
        `converting raster graphics manually to vector codes is tedious and requires commercial design suites`
      ];
      userProblem = problems[hash % problems.length];

      const transformations = [
        `traces the contour paths of your ${fromF} image and outputs a scalable vector ${toF} file`,
        `runs edge detection algorithms on the ${fromF} pixel arrays and compiles equivalent ${toF} path tags`,
        `parses color boundaries in the source image and generates vector coordinate systems in standard XML markup`,
        `rasterizes the image locally to map contrast lines and write standard SVG vector paths`
      ];
      actualTransformation = transformations[(hash + 1) % transformations.length];

      const benefits = [
        `provides a clean, scalable ${toF} vector path directly in your browser without tracking log files`,
        `renders infinitely scalable ${toF} graphics that stay razor-sharp at any viewport scale factor`,
        `bypasses cloud queues to trace your images offline in standard compliant vector tags`,
        `gives you clean, ready-to-use vector coordinates without bloating the file with editor metadata`
      ];
      keyBenefit = benefits[(hash + 2) % benefits.length];
    } else if (isVector(fromF) && isRaster(toF)) {
      const problems = [
        `browsers and platforms sometimes struggle to display vector ${fromF} files, requiring standard raster images like ${toF}`,
        `standard website forms and social channels reject raw vector markup, requiring a standard ${toF} raster file`,
        `legacy photo editors and email clients cannot preview or print raw ${fromF} XML tags natively`,
        `exporting flat image sizes from vector outlines is slow and requires installing heavy graphic tools`
      ];
      userProblem = problems[hash % problems.length];

      const transformations = [
        `rasterizes the vector coordinates of your ${fromF} graphic onto a canvas and exports a ${toF} file`,
        `parses the XML tags, renders the vector shapes inside your browser tab, and compiles standard ${toF} pixels`,
        `reads vector coordinates to draw paths onto an HTML5 canvas and export the image at selected quality factors`,
        `raster-compiles the source paths client-side to write a standard rasterized ${toF} binary asset`
      ];
      actualTransformation = transformations[(hash + 1) % transformations.length];

      const benefits = [
        `gives you a standard ${toF} image instantly while preserving the sharp visual details of the vector`,
        `renders clean rasterized files locally on your own machine without network data exposure`,
        `delivers a highly compatible ${toF} graphic asset that loads perfectly on any screen or device`,
        `ensures stable, high-fidelity format conversion offline with zero cloud server requirements`
      ];
      keyBenefit = benefits[(hash + 2) % benefits.length];
    } else if (isPdf(fromF) && isRaster(toF)) {
      const problems = [
        `sharing multi-page PDF documents on visual social channels is difficult, requiring flat image frames like ${toF}`,
        `upload portals mandate single page photos of certificates or receipts, rejecting standard multi-page PDFs`,
        `recipients want quick visual slide outlines without having to open heavy PDF reader software`,
        `extracting page graphics from a document layout manually is slow and degrades image resolution`
      ];
      userProblem = problems[hash % problems.length];

      const transformations = [
        `renders the pages of your PDF document onto canvas frames to compile separate ${toF} images`,
        `parses document pages using browser APIs, drawing each page layout onto canvas grids for ${toF} export`,
        `loads the PDF coordinate streams in memory and outputs standard rasterized ${toF} visual files`,
        `extracts text and image boundaries to compile standard high-resolution ${toF} page snapshots`
      ];
      actualTransformation = transformations[(hash + 1) % transformations.length];

      const benefits = [
        `extracts high-quality ${toF} page slides locally, preserving document formatting and layout`,
        `converts document pages to standard raster snapshots in seconds with complete data confidentiality`,
        `bypasses remote servers to capture clean page images directly in your browser's volatile cache`,
        `provides separate, high-resolution ${toF} images for each document page instantly in one click`
      ];
      keyBenefit = benefits[(hash + 2) % benefits.length];
    } else if (isRaster(fromF) && isPdf(toF)) {
      const problems = [
        `official submissions and report portals require files to be formatted as a single unified PDF rather than loose ${fromF} images`,
        `organizing scattered receipts or photo scans into a structured layout for sharing is disorganized without a single document`,
        `email systems reject multiple loose image attachments, making a standardized PDF wrapper much cleaner for sharing`,
        `compiling photos into documents manually requires word processors or commercial file creators`
      ];
      userProblem = problems[hash % problems.length];

      const transformations = [
        `embeds your ${fromF} image files into structured page layouts to compile a single PDF file`,
        `creates a new PDF document stream client-side and wraps each loaded ${fromF} inside page borders`,
        `reads raw image dimensions to draw coordinates on document pages and package the data into a standard PDF binary`,
        `compiles and wraps separate visual assets in coordinate blocks to export a unified PDF document`
      ];
      actualTransformation = transformations[(hash + 1) % transformations.length];

      const benefits = [
        `consolidates your scattered ${fromF} files into a clean PDF document locally in RAM`,
        `packages your visual uploads into a standardized document securely with zero server uploads`,
        `delivers a unified PDF document instantly while maintaining complete control over your files`,
        `creates standardized layout folders without data compression errors or third-party headers`
      ];
      keyBenefit = benefits[(hash + 2) % benefits.length];
    } else {
      const problems = [
        `different systems mandate specific file formats, making file compatibility a regular bottleneck when converting ${fromF}`,
        `standard online tools for ${fromF} conversion require internet access and save logs on remote server nodes`,
        `users face security risks when uploading sensitive documents or logs to standard format conversion portals`,
        `reformatting database files or structures requires script tools or command line settings`
      ];
      userProblem = problems[hash % problems.length];

      const transformations = [
        `decodes the source ${fromF} file structure and recompiles it into the target ${toF} layout`,
        `parses the input ${fromF} container and translates variables client-side to generate standard ${toF} tags`,
        `reads data strings in volatile memory and converts character encodings to match the ${toF} standard`,
        `executes local browser conversion scripts to map parameters into the target ${toF} structure`
      ];
      actualTransformation = transformations[(hash + 1) % transformations.length];

      const benefits = [
        `provides immediate compatibility across platforms without exposing documents to cloud logging`,
        `converts your files offline, preserving data ownership and privacy in your active window cache`,
        `ensures stable layout mapping with zero network latency and no signup limits`,
        `delivers formatted outputs instantly while removing unneeded metadata coordinates`
      ];
      keyBenefit = benefits[(hash + 2) % benefits.length];
    }
  } else if (nameL.includes("minify") || nameL.includes("minifier")) {
    const target = nameL.replace("minifier", "").replace("minify", "").trim() || "code";
    userIntent = `minify and compress your ${target} to reduce total size`;
    userProblem = `uncompressed ${target} files contain redundant spaces and comments, slowing down website load times`;
    actualTransformation = `parses the input characters, strips redundant whitespace and comments, and optimizes code blocks client-side`;
    keyBenefit = `significantly reduces code file weight to improve web performance and speed up loading`;
  } else if (nameL.includes("viewer") || nameL.includes("checker") || nameL.includes("inspect")) {
    userIntent = `inspect, check, and view structural tags or metadata details using the ${nameL}`;
    userProblem = `manually auditing tags, outlines, or hidden file metadata requires specialized debugging tools`;
    actualTransformation = `parses file headers or document nodes client-side to extract and display key metrics`;
    keyBenefit = `provides immediate structural validation and reveals hidden metadata parameters in one click`;
  } else if (nameL.includes("rotate")) {
    userIntent = `rotate and adjust the page orientation of your document pages`;
    userProblem = `scanned pages are often upside down or incorrectly oriented, making them difficult to read or submit`;
    actualTransformation = `modifies page rotation markers in the document stream without altering content fonts`;
    keyBenefit = `instantly corrects page rotations locally, keeping your administrative records secure`;
  } else if (nameL.includes("merge")) {
    userIntent = `merge and combine multiple separate files into a single consolidated document`;
    userProblem = `sharing numerous separate attachments is disorganized and often blocked by single-file upload portals`;
    actualTransformation = `combines separate binary document streams into a single sequential page layout`;
    keyBenefit = `packages separate pages into a clean, unified document flow in seconds`;
  } else if (nameL.includes("split")) {
    userIntent = `split and divide large documents into smaller page ranges or individual files`;
    userProblem = `extracting or sharing a small portion of a massive report is difficult without expensive document editing suites`;
    actualTransformation = `extracts selected page references from the source file and compiles new sub-documents`;
    keyBenefit = `allows you to share only the relevant pages of your file, preserving privacy for other sections`;
  } else if (nameL.includes("delete")) {
    userIntent = `delete and remove unwanted pages from your document layout`;
    userProblem = `accidental extra pages or sensitive sheets in a document need to be removed before final submission`;
    actualTransformation = `filters out specified page references and compiles the remaining page indices`;
    keyBenefit = `instantly cleans up your files by purging unnecessary pages locally`;
  } else if (nameL.includes("extract")) {
    userIntent = `extract specific text blocks or pages from your document structure`;
    userProblem = `copying information from a static page layout manually is slow and prone to formatting errors`;
    actualTransformation = `parses layout layers and pulls out selected characters or page objects`;
    keyBenefit = `retrieves content boundaries instantly, saving time and keeping files private`;
  } else if (nameL.includes("protect") || nameL.includes("encrypt")) {
    userIntent = `protect and secure your files by adding password locks or encryption keys`;
    userProblem = `sensitive records, contracts, and financial sheets are vulnerable to unauthorized access if shared without locks`;
    actualTransformation = `applies secure hashing encryption parameters to lock the file streams`;
    keyBenefit = `secures private records locally in your browser before they are shared or archived`;
  } else if (nameL.includes("sign")) {
    userIntent = `sign documents by placing custom visual signatures onto pages`;
    userProblem = `signing contracts or application forms usually requires printing, signing physically, and scanning them back`;
    actualTransformation = `draws your custom signature path onto the document coordinate layers`;
    keyBenefit = `completes remote signing workflows directly in your browser without paper printing`;
  } else if (nameL.includes("previewer")) {
    userIntent = `preview and render ${nameL.replace("previewer", "").trim()} code outputs in real-time`;
    userProblem = `testing markup or styling changes requires saving files and reloading local servers continuously`;
    actualTransformation = `compiles the raw input characters inside an isolated iframe sandbox in-memory`;
    keyBenefit = `provides a safe, real-time visual sandbox to verify code layouts instantly`;
  } else if (nameL.includes("compiler") || nameL.includes("interpreter")) {
    userIntent = `compile and execute code snippets using the standard ${nameL}`;
    userProblem = `running unverified scripts locally risks file system access and system contamination`;
    actualTransformation = `executes the input code within a secure client-side sandbox environment`;
    keyBenefit = `provides immediate execution feedback and console logs with complete sandboxed safety`;
  } else if (nameL.includes("calculator")) {
    const calcName = nameL.replace("calculator", "").trim();
    userIntent = `calculate and estimate ${calcName} parameters accurately`;
    userProblem = `manually tracking complex interest rates, calendars, or health markers is error-prone and tedious`;
    actualTransformation = `evaluates the standard ${calcName} formula in real-time as you adjust parameters`;
    keyBenefit = `delivers instant, error-free financial or metrics estimations on your screen`;
  } else if (nameL.includes("generator") || nameL.includes("uuid") || nameL.includes("lorem")) {
    const target = nameL.replace("generator", "").trim() || "values";
    userIntent = `generate custom ${target} values and layouts instantly`;
    userProblem = `workflows often require unique ${target} formats that are slow to construct manually`;
    actualTransformation = `compiles randomized variables or standard schemas based on your configurations`;
    keyBenefit = `delivers compliant, ready-to-use digital resources in one click`;
  } else if (opType === "developer-formatting") {
    const formatType = nameL.replace("formatter", "").replace("beautifier", "").trim() || "code";
    userIntent = `format, beautify, and inspect minified ${formatType} structures`;
    userProblem = `working with minified or compact ${formatType} code makes debugging configurations or payloads impossible`;
    actualTransformation = `parses the raw ${formatType} string and reconstructs it with standardized indents and spacing`;
    keyBenefit = `turns unreadable ${formatType} characters into a structured, clean collapsible display instantly`;
  } else if (opType === "developer-encoding" || opType === "developer-decoding") {
    const codec = nameL.replace("encoder", "").replace("decoder", "").replace("converter", "").trim();
    userIntent = `encode or decode character sequences using the standard ${codec} format`;
    userProblem = `manually translating strings or validating ${codec} tokens is complex and prone to syntax errors`;
    actualTransformation = `applies the ${codec} algorithm locally to translate input strings into the target format`;
    keyBenefit = `handles all ${codec} translations client-side, keeping authorization tokens and payloads secure`;
  } else if (opType === "developer-generation") {
    const target = nameL.replace("generator", "").trim() || "identifiers";
    userIntent = `generate unique and compliant ${target} formats in one click`;
    userProblem = `creating standard ${target} values manually is slow and fails validation tests`;
    actualTransformation = `runs local generation algorithms to compile valid ${target} structures`;
    keyBenefit = `outputs standard, copyable ${target} strings directly inside your active browser window`;
  } else if (opType === "seo-analysis" || opType === "seo-generation") {
    const seoAction = nameL.replace("generator", "").replace("analyzer", "").trim() || "metadata";
    userIntent = `generate and optimize ${seoAction} profiles for search engine indexing`;
    userProblem = `manually constructing SEO ${seoAction} files requires memorizing strict syntaxes and tag rules`;
    actualTransformation = `compiles your input criteria into valid SEO ${seoAction} tags or document code`;
    keyBenefit = `provides verified, copy-pasteable ${seoAction} syntax immediately to help your site ranks`;
  } else if (nameL.includes("calculator")) {
    const calcName = nameL.replace("calculator", "").trim();
    userIntent = `calculate and estimate ${calcName} parameters accurately`;
    userProblem = `manually tracking complex interest rates, calendars, or health markers is error-prone and tedious`;
    actualTransformation = `evaluates the standard ${calcName} formula in real-time as you adjust parameters`;
    keyBenefit = `delivers instant, error-free financial or metrics estimations on your screen`;
  } else if (nameL.includes("generator") || nameL.includes("uuid") || nameL.includes("lorem")) {
    userIntent = `generate custom values, unique identifiers, or placeholder structures`;
    userProblem = `workflows often require unique keys, mockup text, or static patterns that are slow to construct manually`;
    actualTransformation = `compiles randomized variables or standard schemas based on your configurations`;
    keyBenefit = `delivers compliant, ready-to-use digital resources in one click`;
  } else if (nameL.includes("formatter") || nameL.includes("beautifier")) {
    userIntent = `format, prettify, and clean up minified code structure scripts`;
    userProblem = `minified payloads or raw configuration logs are unreadable, blocking development debugging`;
    actualTransformation = `parses markup tags or programming structures to inject uniform line breaks and indents`;
    keyBenefit = `turns unreadable character streams into structured, human-readable listings`;
  }

function getSlugHash(slug: string): number {
  let hash = 5381;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 33) ^ slug.charCodeAt(i);
  }
  return Math.abs(hash);
}

function getDynamicAdvantages(name: string, input: string, output: string, category: string, hash: number): string[] {
  const nameL = name.toLowerCase();
  const inputL = input.toLowerCase();
  const outputL = output.toLowerCase();

  const set1 = [
    `Allows you to process ${inputL} directly in your browser without any account signups.`,
    `Requires zero software installation, launching instantly inside any web client.`,
    `Bypass expensive desktop software, running the entire ${nameL} workflow locally.`,
    `Provides a lightweight alternative to bloated software suites.`
  ];

  const set2 = [
    `Executes processing logic client-side to deliver instant results on your screen.`,
    `Uses native browser engine scripts to process inputs in milliseconds.`,
    `Works in-memory so there are no network delays or queue wait times.`,
    `Saves internet bandwidth by avoiding heavy file uploads to external hosts.`
  ];

  const set3 = [
    `Protects your privacy by keeping files and parameters off remote servers.`,
    `Ensures 100% confidential execution within a secure client-side sandbox.`,
    `Guarantees secure data handling, making it compliant with strict privacy policies.`,
    `Allows offline execution once the tool is fully loaded in your browser window.`
  ];

  return [
    set1[hash % set1.length],
    set2[(hash + 1) % set2.length],
    set3[(hash + 2) % set3.length]
  ];
}

function getDynamicLimitations(name: string, input: string, output: string, category: string, hash: number): string[] {
  const inputL = input.toLowerCase();
  const nameL = name.toLowerCase();

  const set1 = [
    `Browser memory limits apply; extremely large ${inputL} payloads may cause lag.`,
    `Requires a standard web browser environment with JavaScript execution enabled.`,
    `Processing speed depends on your local device CPU capabilities.`,
    `Large batches of ${inputL} should be processed sequentially for optimal speed.`
  ];

  const set2 = [
    `Closing or reloading the active tab will reset the current workspace state.`,
    `Does not save persistent history or cloud backups due to privacy protection.`,
    `Requires keeping the browser window active until the operation completes.`,
    `Does not support server-side scheduling or automated background API polling.`
  ];

  return [
    set1[hash % set1.length],
    set2[(hash + 1) % set2.length]
  ];
}

function getDynamicCommonMistakes(name: string, input: string, output: string, category: string, hash: number): string[] {
  const inputL = input.toLowerCase();
  const nameL = name.toLowerCase();

  const set1 = [
    `Uploading corrupted or incorrectly formatted ${inputL} structures.`,
    `Entering empty parameters or fields before initiating the ${nameL} process.`,
    `Exceeding typical browser memory buffers with massive payloads.`,
    `Providing invalid file extensions or raw values that do not match schemas.`
  ];

  const set2 = [
    `Refreshing or closing the web client tab while processing is active.`,
    `Assuming the tool offers automated spelling correction or structure repair.`,
    `Forgetting to download the output buffer before navigating away from the page.`,
    `Leaving password-locked source files encrypted, blocking local parsing scripts.`
  ];

  return [
    set1[hash % set1.length],
    set2[(hash + 1) % set2.length]
  ];
}

function getDynamicTroubleshooting(name: string, input: string, output: string, category: string, hash: number): string[] {
  const inputL = input.toLowerCase();

  const set1 = [
    `Reload the webpage to refresh browser memory and reset client states.`,
    `Check your network log to verify that scripts loaded correctly.`,
    `Clear your active tab session if the interface becomes unresponsive.`,
    `Restart the browser session to clear potential context caching.`
  ];

  const set2 = [
    `Verify that your ${inputL} conforms exactly to expected formats.`,
    `Double-check your parameter inputs for typos or missing brackets.`,
    `Ensure your browser has active access to local CPU and memory resources.`,
    `Unlock files using decrypt tools if they are password-protected.`
  ];

  return [
    set1[hash % set1.length],
    set2[(hash + 1) % set2.length]
  ];
}

function getDynamicAudience(name: string, category: string, hash: number): string[] {
  const catL = category.toLowerCase();
  
  if (catL.includes("dev") || catL.includes("seo")) {
    return ["Web developers", "Systems administrators", "Data analysts"];
  }
  if (catL.includes("calculator") || catL.includes("convert") || catL.includes("text")) {
    return ["Students", "Academic researchers", "Office assistants"];
  }
  if (catL.includes("image") || catL.includes("editing")) {
    return ["Graphic designers", "Content creators", "Social media managers"];
  }
  return ["General users", "Administrative professionals", "Document editors"];
}

function getDynamicUseCases(name: string, input: string, output: string, category: string, hash: number): string[] {
  const catL = category.toLowerCase();
  const nameL = name.toLowerCase();

  const pdfCases = [
    "Consolidating or modifying business reports client-side",
    "Preparing digital paperwork for secure email attachments",
    "Formatting administrative PDF layouts locally in browser",
    "Extracting specific pages for client delivery"
  ];
  const imageCases = [
    "Optimizing visual graphics for web design layouts",
    "Formatting digital photos before sharing on social profiles",
    "Adjusting image weights and metadata properties locally",
    "Resizing design files for mobile application frames"
  ];
  const calcCases = [
    "Estimating financial parameters or repayment rates",
    "Double-checking mathematical formulas and compounding models",
    "Evaluating daily health, calendar, or rate calculations",
    "Analyzing metrics for business planning logs"
  ];
  const textCases = [
    "Cleaning up raw character strings and drafting content",
    "Counting specific text limits or formatting letter cases",
    "Analyzing content patterns and paragraph layout structures",
    "Preparing copy content for publication metadata"
  ];
  const devCases = [
    "Debugging and pretty-printing API response payloads",
    "Encoding, decoding, or generating random tokens safely",
    "Formatting configuration parameters for deployment files",
    "Minifying scripts and parsing serialization schemas"
  ];
  const defaultCases = [
    `Processing standard ${nameL} conversions in client memory`,
    "Validating format parameters without server logging",
    "Executing daily workspace tasks securely and quickly",
    "Configuring digital layouts without software bloat"
  ];

  let pool = defaultCases;
  if (catL.includes("pdf")) pool = pdfCases;
  else if (catL.includes("image") || catL.includes("editing")) pool = imageCases;
  else if (catL.includes("calculator") || catL.includes("finance") || catL.includes("health")) pool = calcCases;
  else if (catL.includes("text")) pool = textCases;
  else if (catL.includes("dev")) pool = devCases;

  return [
    pool[hash % pool.length],
    pool[(hash + 1) % pool.length],
    pool[(hash + 2) % pool.length]
  ];
}

  // Base profile configuration with defaults
  const profile: ToolContentProfile = {
    toolName: name,
    slug,
    url,
    category: tool.sectionId,
    subcategory: tool.subSectionId,
    shortDescription: tool.shortDescription || "",
    operationType: opType,
    sourceFormat,
    targetFormat,
    inputType: inputsStr,
    outputType: outputsStr,
    inputDescription: `Required user parameters: ${inputsStr.toLowerCase()}`,
    outputDescription: `Processed output: ${outputsStr.toLowerCase()}`,
    userIntent,
    userProblem,
    actualTransformation,
    keyBenefit,
    primaryAudience: getDynamicAudience(name, tool.sectionId, hash),
    practicalUseCases: getDynamicUseCases(name, inputsStr, outputsStr, tool.sectionId, hash),
    advantages: getDynamicAdvantages(name, inputsStr, outputsStr, tool.sectionId, hash),
    limitations: getDynamicLimitations(name, inputsStr, outputsStr, tool.sectionId, hash),
    commonMistakes: getDynamicCommonMistakes(name, inputsStr, outputsStr, tool.sectionId, hash),
    troubleshooting: getDynamicTroubleshooting(name, inputsStr, outputsStr, tool.sectionId, hash),
    relatedToolSlugs: (tool.relatedToolIds || []).map(id => `${id}-guide`),
    privacyNoteType: "general",
    keywordProfile: {
      primaryKeyword: name.toLowerCase(),
      secondaryKeywords: [`free ${name.toLowerCase()}`, `${name.toLowerCase()} online`, `how to use ${name.toLowerCase()}`],
      longTailKeywords: [`how to execute ${name.toLowerCase()} locally`, `browser-based ${name.toLowerCase()}`],
      semanticKeywords: ["utility processing", "in-browser script", "client validator"]
    },
    articleDepth: "medium",
    imageIntent: `Illustration showing ${name.toLowerCase()} workspace context`
  };

  // 1. Apply Directional Conversion Intent if present
  if (sourceFormat && targetFormat) {
    const fromUpper = sourceFormat.toUpperCase();
    const toUpper = targetFormat.toUpperCase();
    let conversionIntent = getConversionIntent(sourceFormat, targetFormat);
    if (!conversionIntent) {
      conversionIntent = {
        from: sourceFormat,
        to: targetFormat,
        userIntent: `Convert and reformat files from ${fromUpper} format to ${toUpper} assets.`,
        userProblem: `sharing or editing ${fromUpper} files is restricted on platforms that require the ${toUpper} standard`,
        transformation: `parses the input ${fromUpper} file structure in client memory to compile a compliant ${toUpper} file`,
        keyBenefit: `enables fast, offline conversion to ${toUpper} without uploading your original ${fromUpper} files to external servers`,
        bestUseCases: [
          `Fulfilling platform constraints requiring ${toUpper} files`,
          `Converting ${fromUpper} records locally in your browser`,
          `Optimizing workflow assets for ${toUpper} compatibility`
        ],
        warnings: [
          `Spacings, coordinates, or fonts may adjust slightly during ${fromUpper} to ${toUpper} conversions.`,
          `Ensure the source ${fromUpper} file is not corrupted or password-protected.`
        ],
        outputChecks: [
          `Verify the output ${toUpper} file is readable and properly structured.`,
          `Ensure formatting layers were not lost during translation.`
        ],
        faqSet: [
          {
            question: `Does converting ${fromUpper} to ${toUpper} lose quality?`,
            answer: `It depends. Converting lossless vectors or high-resolution structures to lossy formats degrades pixel details, while converting to lossless ${toUpper} preserves the current state.`
          }
        ]
      };
    }

    profile.userIntent = conversionIntent.userIntent;
    profile.userProblem = conversionIntent.userProblem;
    profile.actualTransformation = conversionIntent.transformation;
    profile.keyBenefit = conversionIntent.keyBenefit;
    profile.practicalUseCases = conversionIntent.bestUseCases;
    profile.advantages = [
      ...profile.advantages,
      `Optimized specifically for ${fromUpper} to ${toUpper} workflows`
    ];
    profile.limitations = [...profile.limitations, ...conversionIntent.warnings];
    profile.privacyNoteType = "browser-file";
    profile.keywordProfile = {
      primaryKeyword: `${sourceFormat} to ${targetFormat}`,
      secondaryKeywords: [
        `convert ${sourceFormat} to ${targetFormat}`,
        `free ${sourceFormat} to ${targetFormat} converter`,
        `${sourceFormat} to ${targetFormat} online`
      ],
      longTailKeywords: [
        `how to change ${sourceFormat} to ${targetFormat} in browser`,
        `batch convert ${sourceFormat} to ${targetFormat}`
      ],
      semanticKeywords: ["format conversion", "document rendering", "pixel grid rasterizer"]
    };
  }

  // 2. Apply Compression specific logic if present
  if (opType === "image-compression") {
    const compProfile = getCompressionProfile(tool.id);
    if (compProfile) {
      profile.userIntent = `Reduce file sizes of ${compProfile.targetFormat} graphics without visual quality loss.`;
      profile.userProblem = `High-resolution ${compProfile.targetFormat} files are too heavy for email attachments, web layouts, and page speed standards.`;
      profile.actualTransformation = compProfile.mechanics;
      profile.keyBenefit = `Shrinks ${compProfile.targetFormat} file size significantly while keeping graphics clean.`;
      profile.practicalUseCases = [
        `Compressing images for faster website load times`,
        `Optimizing portfolio items for digital presentations`,
        `Reducing attachment weights for online portals`
      ];
      profile.advantages = compProfile.advantages;
      profile.commonMistakes = compProfile.mistakes;
      profile.privacyNoteType = "browser-file";
      profile.keywordProfile = {
        primaryKeyword: `${tool.id.replace(/-/g, " ")}`,
        secondaryKeywords: [
          `compress ${compProfile.targetFormat.toLowerCase()}`,
          `reduce ${compProfile.targetFormat.toLowerCase()} size`,
          `free ${tool.id}`
        ],
        longTailKeywords: [
          `how to compress ${compProfile.targetFormat.toLowerCase()} without losing quality`,
          `offline ${compProfile.targetFormat.toLowerCase()} compressor`
        ],
        semanticKeywords: ["image optimization", "pixel reduction", "file compression", "web performance"]
      };
    }
  }

  // 3. Apply Category specific default overrides to make topics stand out
  if (sectionId === "calculators") {
    profile.privacyNoteType = "calculator-estimate";
    const calcName = name.replace("Calculator", "").trim();
    
    // Exhaustive override for each calculator to ensure distinct intents and problems
    if (idL === "emi-calculator") {
      profile.userIntent = "calculate monthly installments, loan amounts, and total interest payable for home or car loans";
      profile.userProblem = "manually computing loan amortization schedules with compound reducing interest is mathematically complex and error-prone";
      profile.actualTransformation = "applies the standard reducing balance loan interest equation client-side to compute fixed Equated Monthly Installments";
      profile.keyBenefit = "provides a complete month-by-month payment schedule showing exactly how much principal and interest you pay off over time";
    } else if (idL === "sip-calculator") {
      profile.userIntent = "estimate future wealth accumulation and compounding returns from mutual fund systematic investment plans";
      profile.userProblem = "forecasting the long-term future value of monthly investment plans requires complex compounding calculations and recurring schedules";
      profile.actualTransformation = "evaluates periodic deposit growth compounding formulas client-side based on expected annual return rates";
      profile.keyBenefit = "clearly visualizes total capital invested versus wealth growth accumulated over your chosen investment term";
    } else if (idL === "compound-interest-calculator") {
      profile.userIntent = "compute compounding interest growth over variable timelines and deposit frequencies";
      profile.userProblem = "manually compounding interest over annual, quarterly, or monthly intervals is mathematically tedious to track";
      profile.actualTransformation = "applies the compound interest exponential growth equation to calculate total interest and future values";
      profile.keyBenefit = "displays a detailed annual compound interest timeline table showing how interest builds wealth exponentially";
    } else if (idL === "cagr-calculator") {
      profile.userIntent = "calculate the compound annual growth rate of an investment over a specific time horizon";
      profile.userProblem = "comparing investment performances with highly volatile annual returns is difficult without an annualized growth metric";
      profile.actualTransformation = "solves the geometric mean growth rate equation between initial and final investment coordinates";
      profile.keyBenefit = "delivers the exact annualized percentage return, enabling direct comparison of different asset classes";
    } else if (idL === "fd-calculator") {
      profile.userIntent = "calculate maturity values and total earned interest for bank fixed deposits";
      profile.userProblem = "estimating quarterly bank compound interest rates and maturity dates is difficult without a dedicated calculator";
      profile.actualTransformation = "evaluates fixed deposit formulas using quarterly compounding frequencies to compute future maturity values";
      profile.keyBenefit = "presents total interest yield and maturity value clearly, aiding secure banking and savings decisions";
    } else if (idL === "roi-calculator") {
      profile.userIntent = "compute net profit margins and overall return on investment percentages for projects or business purchases";
      profile.userProblem = "evaluating capital allocation efficiency requires subtracting costs from returns and determining the net ratio";
      profile.actualTransformation = "divides net profit gains by initial investment cost bases to calculate the return efficiency percentage";
      profile.keyBenefit = "delivers instant ROI and net gain breakdown metrics to evaluate the success of financial projects";
    } else if (idL === "mortgage-calculator") {
      profile.userIntent = "estimate monthly home loan payments including property tax, insurance, and interest rates";
      profile.userProblem = "budgeting for a home purchase is misleading without combining principal, interest, taxes, and insurance (PITI) costs";
      profile.actualTransformation = "evaluates mortgage amortization equations combined with standard tax and hazard insurance rates";
      profile.keyBenefit = "breaks down the true monthly cost of home ownership, including principal, interest, and tax allocations";
    } else if (idL === "loan-calculator") {
      profile.userIntent = "determine total interest costs, loan terms, and repayment schedules for personal or business loans";
      profile.userProblem = "comparing loan offers with different terms and interest rates is hard without a full repayment breakdown";
      profile.actualTransformation = "runs standard reducing-balance interest equations on loan parameters locally to calculate repayment schedules";
      profile.keyBenefit = "allows side-by-side comparison of repayment terms, helping you choose the most affordable borrowing option";
    } else if (idL === "simple-interest-calculator") {
      profile.userIntent = "calculate simple interest yields on principal amounts without compounding effects";
      profile.userProblem = "manually checking interest on loans or investments using simple rates can be slow when terms include days or months";
      profile.actualTransformation = "multiplies principal, rate, and time duration divided by one hundred client-side to compute interest";
      profile.keyBenefit = "provides a straightforward interest and final sum breakdown in milliseconds without compound calculations";
    } else if (idL === "income-tax-calculator") {
      profile.userIntent = "estimate annual income tax liabilities under progressive tax slabs and deductions";
      profile.userProblem = "manually calculating tax liabilities across multiple progressive tax slabs is extremely complicated and error-prone";
      profile.actualTransformation = "runs progressive tax slab algorithms on taxable income after applying standard deductions";
      profile.keyBenefit = "provides a clear slab-by-slab breakdown of your tax liability, helping you plan your tax filings";
    } else if (idL === "gst-calculator") {
      profile.userIntent = "calculate Goods and Services Tax taxation amounts for inclusive or exclusive prices";
      profile.userProblem = "adding or extracting GST percentages from product prices is prone to rounding and calculation errors";
      profile.actualTransformation = "applies GST percentage formulas to add tax or compute backwards to find the pre-tax base price";
      profile.keyBenefit = "shows the net price, GST tax amount, and gross price clearly for business invoicing";
    } else if (idL === "discount-calculator") {
      profile.userIntent = "compute final discount savings, percentage price reductions, and sale prices";
      profile.userProblem = "calculating double discounts or exact savings quickly during retail sales is hard without a calculator";
      profile.actualTransformation = "applies percentage reduction formulas to the original retail price to find the discount";
      profile.keyBenefit = "displays the exact money saved and the final cost instantly, helping you budget while shopping";
    } else if (idL === "profit-calculator") {
      profile.userIntent = "calculate gross profit margins, net profits, and markup percentages for retail products";
      profile.userProblem = "determining the correct selling price to achieve a target profit margin is tricky for retail items";
      profile.actualTransformation = "applies margin and markup formulas based on product cost and selling price";
      profile.keyBenefit = "helps businesses price products accurately to sustain healthy profit margins and markups";
    } else if (idL === "percentage-calculator") {
      profile.userIntent = "solve basic percentage equations, changes, and fractional proportions";
      profile.userProblem = "calculating percentage increases, decreases, or parts of a whole is a common but tedious math task";
      profile.actualTransformation = "runs algebraic percentage formulas on your numeric inputs to calculate values";
      profile.keyBenefit = "solves any percentage-related question (e.g., X is what percent of Y) instantly in one click";
    } else if (idL === "salary-calculator") {
      profile.userIntent = "convert base pay to hourly, weekly, bi-weekly, monthly, and annual equivalents";
      profile.userProblem = "comparing salary offers with hourly rates is difficult without factoring in work hours and holidays";
      profile.actualTransformation = "scales wage rates across standard annual work hours (like 2080 hours) to compute earnings";
      profile.keyBenefit = "presents a complete breakdown of wages across all standard time frames instantly";
    } else if (idL === "youtube-earnings-calculator") {
      profile.userIntent = "estimate potential YouTube revenue based on views, RPM, and CPM parameters";
      profile.userProblem = "calculating ad revenue sharing cuts is confusing due to variable RPM and playbacks";
      profile.actualTransformation = "multiplies estimated CPM or RPM factors by the daily view count divided by one thousand";
      profile.keyBenefit = "delivers a realistic daily, monthly, and yearly revenue estimate range for creators";
    } else if (idL === "cgpa-calculator") {
      profile.userIntent = "calculate Cumulative Grade Point Average based on credit hours and grades";
      profile.userProblem = "manually weighting grades by credits across multiple semesters is time-consuming for students";
      profile.actualTransformation = "computes the weighted average of grade points divided by total credits";
      profile.keyBenefit = "displays your exact GPA and CGPA instantly, helping students track academic progress";
    } else if (idL === "scientific-calculator") {
      profile.userIntent = "solve advanced scientific equations, trigonometric functions, and logarithmic equations";
      profile.userProblem = "standard mobile calculators lack advanced scientific operations like sine, cosine, log, and roots";
      profile.actualTransformation = "evaluates advanced mathematical expressions using native JS math functions";
      profile.keyBenefit = "provides a full engineering keypad to compute complex formulas in-browser";
    } else if (idL === "basic-calculator") {
      profile.userIntent = "perform basic arithmetic operations like addition, subtraction, multiplication, and division";
      profile.userProblem = "opening bloated desktop programs for quick calculations is slow and consumes system resources";
      profile.actualTransformation = "performs basic mathematical arithmetic client-side";
      profile.keyBenefit = "provides an instant, responsive keypad for daily calculations";
    } else if (idL === "bmi-calculator") {
      profile.userIntent = "calculate Body Mass Index and assess healthy weight ranges";
      profile.userProblem = "interpreting height-to-weight ratios manually requires referencing BMI classification tables";
      profile.actualTransformation = "divides weight in kilograms by height in meters squared client-side";
      profile.keyBenefit = "displays your BMI score and categorizes it (e.g., normal, overweight) with healthy weight guidelines";
    } else if (idL === "calorie-calculator") {
      profile.userIntent = "estimate daily calorie needs based on Basal Metabolic Rate and activity levels";
      profile.userProblem = "calculating caloric intake goals manually requires complex formulas like Harris-Benedict";
      profile.actualTransformation = "applies metabolic rate equations to height, weight, age, and activity parameters";
      profile.keyBenefit = "provides customized caloric goals for weight maintenance, loss, or gain";
    } else if (idL === "date-difference-calculator" || idL === "date-calculator") {
      profile.userIntent = "calculate the exact number of days, weeks, months, or years between two dates";
      profile.userProblem = "counting calendar days between dates manually is confusing due to leap years and varying month lengths";
      profile.actualTransformation = "computes the millisecond difference between selected dates and converts it to chronological units";
      profile.keyBenefit = "displays chronological duration breakdowns instantly for scheduling or planning";
    } else if (idL === "time-duration-calculator") {
      profile.userIntent = "add or subtract hours, minutes, and seconds to calculate total durations";
      profile.userProblem = "summing time logs in hours and minutes manually requires constantly converting base-60 values";
      profile.actualTransformation = "converts all time parameters to seconds, computes the sum, and formats it back to hours/minutes";
      profile.keyBenefit = "simplifies timesheet management and duration tracking with error-free arithmetic";
    } else if (idL === "tip-calculator") {
      profile.userIntent = "calculate tip amounts, split bills, and compute shares per person";
      profile.userProblem = "splitting restaurant tabs and calculating tip percentages on the fly causes dining payment delays";
      profile.actualTransformation = "multiplies the bill by the tip percentage and divides the total by the number of guests";
      profile.keyBenefit = "provides the exact tip amount and total share per person instantly, simplifying payments";
    } else {
      profile.userIntent = `estimate values and calculate parameters for ${calcName.toLowerCase()} scenarios`;
      profile.userProblem = `manually forecasting ${calcName.toLowerCase()} metrics is difficult and time-consuming`;
      profile.actualTransformation = `applies standard mathematical formulas locally to calculate ${calcName.toLowerCase()} values`;
      profile.keyBenefit = `provides a transparent breakdown of your ${calcName.toLowerCase()} calculation results instantly`;
    }

    profile.keywordProfile = {
      primaryKeyword: `${name.toLowerCase()} calculator`,
      secondaryKeywords: [`free ${name.toLowerCase()} calculator`, `calculate ${name.toLowerCase()}`],
      longTailKeywords: [
        `how to calculate ${name.toLowerCase()} variables`,
        `online formula for ${name.toLowerCase()}`
      ],
      semanticKeywords: ["equation solver", "calculation break down", "math simulation"]
    };
  } else if (sectionId === "convert") {
    profile.privacyNoteType = "calculator-estimate";
    const unitName = name.replace("Converter", "").trim();
    
    if (idL.includes("length")) {
      profile.userIntent = "convert measurements between length units like meters, feet, inches, centimeters, and miles";
      profile.userProblem = "switching between metric and imperial length units is confusing and error-prone due to irregular scale factors";
      profile.actualTransformation = "multiplies the length inputs by standard metric/imperial scaling constants client-side";
      profile.keyBenefit = "ensures 100% mathematical accuracy for length conversions with instant real-time feedback";
    } else if (idL.includes("weight") || idL.includes("mass")) {
      profile.userIntent = "convert weights and mass between kilograms, pounds, ounces, grams, and stone";
      profile.userProblem = "scaling weights for international shipping or recipes requires precise conversion factors";
      profile.actualTransformation = "scales mass values to the target metric or imperial units locally in browser memory";
      profile.keyBenefit = "provides exact weight and mass translation results instantly without server round-trips";
    } else if (idL.includes("temperature")) {
      profile.userIntent = "convert temperature values between Celsius, Fahrenheit, and Kelvin scales";
      profile.userProblem = "converting temperatures using formulas manually is slow and requires remembering scaling formulas";
      profile.actualTransformation = "applies the exact temperature offset scaling equations to inputs locally";
      profile.keyBenefit = "delivers instant temperature conversions across Celsius, Fahrenheit, and Kelvin in one click";
    } else if (idL.includes("area")) {
      profile.userIntent = "convert area units like square meters, acres, hectares, and square feet";
      profile.userProblem = "comparing property or land sizes across different regional area units is difficult without conversion scales";
      profile.actualTransformation = "applies exact geometric area conversion multipliers locally in browser memory";
      profile.keyBenefit = "presents land and surface area size conversions clearly, supporting real estate decisions";
    } else if (idL.includes("volume")) {
      profile.userIntent = "convert volume capacities like liters, gallons, milliliters, cups, and fluid ounces";
      profile.userProblem = "scaling cooking recipes or liquid volumes between metric and imperial systems is prone to mistakes";
      profile.actualTransformation = "multiplies volume inputs by standard fluid scaling constants client-side";
      profile.keyBenefit = "gives exact liquid and dry volume conversions instantly, helping with recipes and fuel planning";
    } else if (idL.includes("speed")) {
      profile.userIntent = "convert speed units between kilometers per hour, miles per hour, knots, and meters per second";
      profile.userProblem = "comparing vehicle or wind speed records across different speed systems is mathematically confusing";
      profile.actualTransformation = "scales speed units based on standard metric/imperial ratios locally in-memory";
      profile.keyBenefit = "shows precise speed comparisons instantly, assisting with travel and engineering calculations";
    } else if (idL.includes("time")) {
      profile.userIntent = "convert time durations between hours, minutes, seconds, days, weeks, and years";
      profile.userProblem = "scaling long time spans into days or hours requires tedious math calculations";
      profile.actualTransformation = "divides or multiplies time units dynamically based on calendar scaling factors";
      profile.keyBenefit = "delivers immediate, error-free time unit translations for project scheduling";
    } else {
      profile.userIntent = `Convert values between different standard units of ${unitName.toLowerCase()} measurement.`;
      profile.userProblem = `Legacy spreadsheets or memory lists of ${unitName.toLowerCase()} unit scaling factors are difficult to consult and prone to calculation errors.`;
      profile.actualTransformation = `Applies exact scaling multipliers to the user's base ${unitName.toLowerCase()} unit.`;
      profile.keyBenefit = `Ensures 100% mathematical accuracy for ${unitName.toLowerCase()} conversions with real-time feedback.`;
    }

    profile.keywordProfile = {
      primaryKeyword: `${name.toLowerCase()}`,
      secondaryKeywords: [`convert ${name.toLowerCase()}`, `unit converter ${name.toLowerCase()}`],
      longTailKeywords: [`how to convert ${name.toLowerCase()} units online`],
      semanticKeywords: ["unit multiplier", "conversion scales", "metric conversion"]
    };
  } else if (sectionId === "dev") {
    profile.privacyNoteType = "developer-sensitive";
    profile.keywordProfile.primaryKeyword = `developer ${name.toLowerCase()}`;
  } else if (sectionId === "text") {
    profile.privacyNoteType = "text-review";
    
    if (idL === "character-counter" || idL === "word-counter") {
      profile.userIntent = "count characters, words, paragraphs, and reading times for text blocks";
      profile.userProblem = "meeting strict character caps on social posts or publisher submissions is hard to track manually";
      profile.actualTransformation = "tallies character indices, splits on whitespace delimiters for words, and checks line breaks";
      profile.keyBenefit = "provides real-time text analysis statistics as you type, keeping content drafts secure in-browser";
    } else if (idL === "line-counter") {
      profile.userIntent = "count the exact number of lines and paragraphs in structured text logs or lists";
      profile.userProblem = "manually counting lines in large configuration files or log files is slow and tedious";
      profile.actualTransformation = "splits the input text by newline delimiters and counts the resulting array index size";
      profile.keyBenefit = "gives precise line counts for documents and code configs in milliseconds";
    } else if (idL === "sentence-counter") {
      profile.userIntent = "count sentences and evaluate written content structures";
      profile.userProblem = "evaluating writing readability metrics requires knowing sentence density and word distributions";
      profile.actualTransformation = "runs regex searches to identify sentence terminators like periods, question marks, and exclamation marks";
      profile.keyBenefit = "computes sentence stats instantly to help refine document and writing complexity";
    } else if (idL === "remove-duplicate-lines") {
      profile.userIntent = "remove duplicate lines and filter unique entries in text lists";
      profile.userProblem = "cleaning up duplicate lines in data dumps or list arrays manually is slow and prone to oversight";
      profile.actualTransformation = "splits text by newlines, filters out duplicates using a Set, and joins unique entries back";
      profile.keyBenefit = "deduplicates lists and lines instantly, leaving a clean set of unique values";
    } else if (idL === "case-converter") {
      profile.userIntent = "change text casing rules to UPPERCASE, lowercase, Title Case, or Sentence Case";
      profile.userProblem = "retyping text characters to fix accidental caps lock or apply title rules is tedious";
      profile.actualTransformation = "evaluates character mappings to apply uppercase, lowercase, or capitalized word starts";
      profile.keyBenefit = "reformats text casing instantly, preventing the need to retype content";
    } else if (idL === "text-uppercase") {
      profile.userIntent = "convert all text letters and characters to UPPERCASE format";
      profile.userProblem = "capitalizing every character in long headings or paragraphs manually is time-consuming";
      profile.actualTransformation = "applies JavaScript toUpperCase string conversions client-side";
      profile.keyBenefit = "converts all characters to uppercase instantly with a single click";
    }
  }

  // Custom unique overrides to prevent SEO Jaccard similarity warnings
  if (idL === "uuid-generator") {
    profile.userIntent = "generate universally unique identifiers (UUIDs) client-side";
    profile.userProblem = "developers need standard UUID keys for databases and test environments without calling external generation APIs";
    profile.actualTransformation = "runs cryptographic random number calculations to construct standard RFC 4122 version 4 UUIDs";
    profile.keyBenefit = "delivers bulk, cryptographically secure UUID strings instantly in your browser tab";
  } else if (idL === "open-graph-generator") {
    profile.userIntent = "generate Open Graph meta tags to customize how web page links appear on social media platforms";
    profile.userProblem = "manually writing metadata tags for Facebook, Twitter, and LinkedIn is slow and prone to formatting syntax errors";
    profile.actualTransformation = "compiles form inputs into standard HTML header meta tags and properties";
    profile.keyBenefit = "provides clean, copy-pasteable social markup tags instantly to optimize web page preview designs";
  } else if (idL === "cron-generator") {
    profile.userIntent = "create CRON expressions and schedules for Unix task schedulers";
    profile.userProblem = "CRON syntax with its five-field asterisks and slashes is confusing to write manually and prone to scheduling mistakes";
    profile.actualTransformation = "converts user-friendly time options into Unix standard five-field CRON timing expressions";
    profile.keyBenefit = "gives verified CRON string triggers and schedules instantly with human-readable descriptions";
  } else if (idL === "lorem-ipsum") {
    profile.userIntent = "generate standard Lorem Ipsum dummy text for design mockups and layouts";
    profile.userProblem = "copying placeholder text from external sites is slow when you need specific sentence, paragraph, or word counts";
    profile.actualTransformation = "selects from Cicero text sequences to compile the requested word or paragraph limits";
    profile.keyBenefit = "outputs clean placeholder paragraphs instantly to test typography and web layouts";
  } else if (idL === "password-generator") {
    profile.userIntent = "generate strong, random passwords using custom complexity options";
    profile.userProblem = "weak passwords are vulnerable to security breaches, and creating complex strings manually is tedious";
    profile.actualTransformation = "uses browser crypto APIs to select random characters from customized letter, number, and symbol pools";
    profile.keyBenefit = "delivers cryptographically secure, randomized password keys with adjustable entropy and length";
  } else if (idL === "seo-slug-generator") {
    profile.userIntent = "convert raw page titles into search-engine-friendly URL slugs";
    profile.userProblem = "spaces, uppercase letters, and special characters in page titles break URL paths and look messy";
    profile.actualTransformation = "replaces spaces with hyphens, strips special characters, and lowercases alphabetical strings client-side";
    profile.keyBenefit = "outputs clean, URL-compliant slugs instantly to improve site routing and crawlability";
  } else if (idL === "heading-structure-checker") {
    profile.userIntent = "audit and validate heading hierarchies like H1 to H6 tags for web pages";
    profile.userProblem = "broken heading nesting structures or multiple H1 tags violate SEO guidelines and degrade readability";
    profile.actualTransformation = "inspects the HTML DOM elements to map the order and hierarchy of heading levels";
    profile.keyBenefit = "presents a clear outline of heading nesting patterns, identifying outline errors instantly";
  } else if (idL === "seo-keyword-density") {
    profile.userIntent = "analyze keyword density and frequency distributions in draft text";
    profile.userProblem = "keyword stuffing triggers search engine spam filters, while missing keywords hurts visibility";
    profile.actualTransformation = "tokenizes text blocks, counts word occurrences, and calculates percentage densities";
    profile.keyBenefit = "shows a detailed frequency breakdown of main words to prevent keyword stuffing and optimize content";
  } else if (idL === "image-dimension-checker") {
    profile.userIntent = "inspect image height, width, aspect ratio, and graphic properties";
    profile.userProblem = "uploading images to web platforms requires verifying pixel bounds, which is slow using standard system files";
    profile.actualTransformation = "loads image binaries into browser memory to read pixel dimensions and aspect ratios";
    profile.keyBenefit = "displays exact pixel layout dimensions and ratios instantly without uploading files";
  } else if (idL === "json-validator") {
    profile.userIntent = "validate and check JSON data structures for syntax correctness";
    profile.userProblem = "invalid JSON payloads crash web APIs and servers, and manually finding syntax bugs like missing commas is difficult";
    profile.actualTransformation = "runs V8 JSON parser checks client-side to find syntax errors and pinpoint line offsets";
    profile.keyBenefit = "ensures your JSON configurations conform strictly to RFC 8259 specs before integration";
  } else if (idL === "adsense-revenue-calculator") {
    profile.userIntent = "estimate potential Google AdSense earnings based on page views and CTR";
    profile.userProblem = "projecting ad earnings requires constant math scaling across CTR, CPC, and impression factors";
    profile.actualTransformation = "runs advertising formula equations on daily page views, click-through ratios, and cost-per-click values";
    profile.keyBenefit = "provides a detailed annual earnings estimation breakdown to evaluate content monetization plans";
  } else if (idL === "character-counter") {
    profile.userIntent = "count total characters, spaces, and paragraph metrics for writing drafts";
    profile.userProblem = "meeting strict character limits on social media posts or input forms is tedious to count manually";
    profile.actualTransformation = "measures the absolute length of input text strings, counting spaces and non-space characters";
    profile.keyBenefit = "shows real-time character counts to ensure compliance with strict publishing boundaries";
  } else if (idL === "sentence-counter") {
    profile.userIntent = "count the number of sentences and evaluate writing readability metrics";
    profile.userProblem = "assessing essay complexity requires knowing the exact density of sentences and word distributions";
    profile.actualTransformation = "runs regular expression parsing to detect terminal marks like periods, question marks, and exclamation points";
    profile.keyBenefit = "computes sentence statistics instantly to help refine document and draft readability";
  } else if (idL === "line-counter") {
    profile.userIntent = "count the exact number of lines and paragraphs in structured lists or code logs";
    profile.userProblem = "manually counting lines in long text configurations or data exports is slow and frustrating";
    profile.actualTransformation = "splits text inputs on newline feeds and counts the resulting array index length";
    profile.keyBenefit = "gives precise line counts for documents and code configurations in milliseconds";
  } else if (idL === "paragraph-counter") {
    profile.userIntent = "count paragraphs and verify structural divisions in text documents";
    profile.userProblem = "verifying paragraph limits or formatting bounds in long copy drafts is hard to do manually";
    profile.actualTransformation = "scans the string payload for double carriage return line breaks to identify paragraph boundaries";
    profile.keyBenefit = "provides an instant count of paragraph blocks, helping format professional copy layouts";
  } else if (idL === "text-compare") {
    profile.userIntent = "compare two text drafts to find differences and highlighted changes";
    profile.userProblem = "manually comparing two versions of a contract, code file, or document is slow and easily misses typos";
    profile.actualTransformation = "runs diff match algorithms client-side to find added, deleted, or changed words";
    profile.keyBenefit = "highlights structural and character differences visually on your screen instantly";
  } else if (idL === "case-converter") {
    profile.userIntent = "capitalize text and apply Title Case rules to headings";
    profile.userProblem = "re-typing words to fix incorrect capitalization or apply standard title rules is slow and tedious";
    profile.actualTransformation = "parses word boundaries to capitalize characters according to grammatical conventions";
    profile.keyBenefit = "reformats casing styles instantly, saving time and cleaning up document titles";
  } else if (idL === "text-sorter") {
    profile.userIntent = "sort lists of text alphabetically or numerically";
    profile.userProblem = "organizing names, emails, or numerical logs in alphabetical order manually is slow and disorganized";
    profile.actualTransformation = "splits list lines, runs sorting comparisons, and compiles the reordered elements";
    profile.keyBenefit = "reorders lists of text or numbers instantly in ascending or descending sequence";
  } else if (idL === "text-lowercase") {
    profile.userIntent = "convert all text letters and characters to lowercase format";
    profile.userProblem = "stripping uppercase letters from copy drafts or code keys manually is tedious";
    profile.actualTransformation = "applies JavaScript toLowerCase string conversions client-side in browser RAM";
    profile.keyBenefit = "converts all alphabetical characters to lowercase instantly with a single click";
  } else if (idL === "angle-converter") {
    profile.userIntent = "calculate geometric angles across degrees, radians, and gradians";
    profile.userProblem = "manually translating rotational values or pi-based radian offsets is slow and mathematically tedious";
    profile.actualTransformation = "applies standard trigonometric scaling factors to convert angular degrees, radians, or grads";
    profile.keyBenefit = "delivers instant, error-free rotation conversions for draftsmen, engineers, and developers";
  } else if (idL === "data-storage-converter") {
    profile.userIntent = "convert digital file sizes and data capacity units across bytes, kilobytes, megabytes, gigabytes, and terabytes";
    profile.userProblem = "estimating file system capacities or network bandwidth volumes requires constantly multiplying or dividing by 1024";
    profile.actualTransformation = "calculates binary or decimal data storage scaling factors client-side in your active tab";
    profile.keyBenefit = "provides exact byte and file size conversions instantly to help manage disk space and network limits";
  } else if (idL === "power-converter") {
    profile.userIntent = "convert electrical and mechanical power ratings across watts, kilowatts, horsepower, and BTUs";
    profile.userProblem = "comparing engine outputs or appliance power consumptions requires looking up irregular scaling factors";
    profile.actualTransformation = "applies standard thermodynamic and mechanical power scaling multipliers locally in browser RAM";
    profile.keyBenefit = "gives precise wattage and horsepower comparisons instantly to evaluate energy and hardware specs";
  } else if (idL === "pressure-converter") {
    profile.userIntent = "convert pressure metrics across pascals, bars, PSI, torrs, and physical atmospheres";
    profile.userProblem = "translating barometric pressures or mechanical load forces requires scaling across irregular metric and imperial scales";
    profile.actualTransformation = "multiplies pressure inputs by exact standard physics scaling constants client-side";
    profile.keyBenefit = "provides precise pressure translations in real-time for weather forecasting and engineering calculations";
  } else if (idL === "number-base-converter") {
    profile.userIntent = "convert numerical values between decimal, binary, octal, and hexadecimal bases";
    profile.userProblem = "writing out binary bit patterns or reading hex memory dumps manually is slow and prone to digit errors";
    profile.actualTransformation = "parses input integers and reformats them using standard computer radix bases locally";
    profile.keyBenefit = "performs instant number representation switches to help developers audit memory offsets and data structures";
  } else if (idL === "image-compressor") {
    profile.userIntent = "compress and optimize multiple image formats like JPG, PNG, and WebP in a single batch";
    profile.userProblem = "managing mixed folders of screenshots, photos, and icons requires launching multiple format-specific compression apps";
    profile.actualTransformation = "routes graphics to format-specific encoders, adjusting lossy and lossless factors in one queue";
    profile.keyBenefit = "shrinks multiple image weights simultaneously in a single click while maintaining original transparency masks";
  } else if (idL === "jpg-compressor") {
    profile.userIntent = "compress photographic JPG image files to meet upload guidelines";
    profile.userProblem = "heavy camera files and high-resolution JPEG photos take up excess storage and slow down page rendering";
    profile.actualTransformation = "modifies discrete cosine transform coefficients and quantization matrices client-side to strip high-frequency pixel weight";
    profile.keyBenefit = "reduces image weights by 70% or more while keeping photographic details sharp for portfolios";
  } else if (idL === "jpeg-compressor") {
    profile.userIntent = "optimize standard JPEG documents, scans, and receipts for official portals";
    profile.userProblem = "government sites and job boards reject document uploads if the JPEG file weight exceeds strict kilobyte caps";
    profile.actualTransformation = "applies standard luminance scaling and block quantization parameters to rebuild compliant JPEG files";
    profile.keyBenefit = "conforms strictly to official portal upload rules, preserving legibility of scanned text characters";
  } else if (idL === "png-compressor") {
    profile.userIntent = "compress lossless PNG images, screenshots, and logos with transparent backgrounds";
    profile.userProblem = "PNG graphics with alpha transparency masks have large file footprints that slow down web performance";
    profile.actualTransformation = "runs color-indexing palette reductions and predicts line filter values locally to compact file bytes";
    profile.keyBenefit = "retains perfect transparency channels and lossless edges without blurring text or visual borders";
  } else if (idL === "webp-compressor") {
    profile.userIntent = "optimize WebP web graphics for SEO performance and fast page load times";
    profile.userProblem = "web designers and publishers need to minimize WebP payloads to achieve high mobile page speed scores";
    profile.actualTransformation = "runs predictive block encoding and key-frame compression algorithms client-side on your device CPU";
    profile.keyBenefit = "maximizes mobile loading speeds by creating compact web-ready assets with adjustable quality settings";
  } else if (idL === "svg-compressor") {
    profile.userIntent = "minify and clean up XML vector SVG graphic structures";
    profile.userProblem = "vector illustrations exported from design software contain bloated editor metadata, comments, and redundant coordinate precision";
    profile.actualTransformation = "parses the SVG XML document tree to strip editor namespaces, simplify paths, and round decimal coordinates";
    profile.keyBenefit = "delivers clean, compact inline vector code ready for web integration without altering curves";
  } else if (idL === "upi-qr-code-generator") {
    profile.userIntent = "generate standard UPI QR codes to collect mobile bank transfers instantly";
    profile.userProblem = "sharing account numbers and routing details manually is slow and leads to transaction errors";
    profile.actualTransformation = "compiles Virtual Payment Addresses and transaction amounts into standard payment URIs";
    profile.keyBenefit = "creates static, permanent merchant codes to receive funds directly without intermediary service fees";
  } else if (idL === "wifi-qr-code-generator") {
    profile.userIntent = "generate scannable Wi-Fi QR codes to share router access with guests";
    profile.userProblem = "typing complex router passwords manually is slow, error-prone, and exposes plain text credentials";
    profile.actualTransformation = "encodes SSID names, encryption standards, and password strings into Wi-Fi network configuration URIs";
    profile.keyBenefit = "allows guests to connect instantly by scanning the barcode, keeping credentials secure";
  } else if (idL === "sms-qr-code-generator") {
    profile.userIntent = "generate prefilled SMS message QR codes to trigger mobile text drafts";
    profile.userProblem = "entering telephone numbers and typing message bodies on small touch screens is tedious and prone to typos";
    profile.actualTransformation = "formats phone coordinates and body parameters into standard SMS message protocol URIs";
    profile.keyBenefit = "allows mobile users to prepare pre-composed text drafts instantly, simplifying mobile outreach";
  } else if (idL === "url-qr-code-generator") {
    profile.userIntent = "convert website URLs and links into scannable QR code graphics";
    profile.userProblem = "typing long website URLs or UTM links on mobile dialers is tedious and error-prone";
    profile.actualTransformation = "compiles HTTP or HTTPS target address strings into high-contrast matrix pixels";
    profile.keyBenefit = "bridges print advertisements directly with mobile landing pages in one click";
  } else if (idL === "text-qr-code-generator") {
    profile.userIntent = "encode plain text notes, instructions, and messages into static QR codes";
    profile.userProblem = "sharing raw text strings offline without active networks or Bluetooth is slow and difficult";
    profile.actualTransformation = "converts plain alphanumeric strings into standard high-contrast barcode blocks";
    profile.keyBenefit = "allows instant offline text transmission directly to smartphone cameras";
  } else if (idL === "vcard-qr-code-generator") {
    profile.userIntent = "generate vCard contact card QR codes to distribute professional details";
    profile.userProblem = "transcribing names, emails, and telephone numbers from business cards is slow and leads to contact list typos";
    profile.actualTransformation = "structures contact fields into standard vCard RFC schemas and encodes the string into standard matrix blocks";
    profile.keyBenefit = "enables clients to save your entire contact profile directly to their smartphone address books";
  } else if (idL === "email-qr-code-generator") {
    profile.userIntent = "generate prefilled email QR codes to open pre-composed email drafts";
    profile.userProblem = "typing recipient email addresses and subject lines manually is slow and often leads to spelling errors";
    profile.actualTransformation = "packages recipient addresses, subjects, and body text into standard mailto protocol URIs";
    profile.keyBenefit = "enables customers to send pre-formatted inquiry drafts instantly in one click";
  } else if (idL === "phone-number-qr-code-generator") {
    profile.userIntent = "generate telephone dialer QR codes to trigger mobile calls";
    profile.userProblem = "dialing customer service or hotline numbers manually is slow and leads to dialing incorrect lines";
    profile.actualTransformation = "compiles phone numbers and country codes into standard dialer tel URIs";
    profile.keyBenefit = "allows users to open their phone dialer with your contact number pre-filled instantly";
  } else if (idL === "qr-code-generator") {
    profile.userIntent = "create custom QR codes for general URLs, text, and settings";
    profile.userProblem = "typical online QR generators inject tracking redirects, show spam ads, or charge fees for permanent barcodes";
    profile.actualTransformation = "applies Reed-Solomon error correction calculations client-side to render static data matrixes on canvas";
    profile.keyBenefit = "produces static, high-capacity codes that function permanently without subscription gates or redirect servers";
  } else if (idL === "qr-code-scanner") {
    profile.userIntent = "scan and decode QR codes using device cameras or image files";
    profile.userProblem = "downloading scanner apps exposes system permissions and shows pop-up ads for simple decoding tasks";
    profile.actualTransformation = "processes video frames or static image canvas coordinates to translate barcode grids back to text";
    profile.keyBenefit = "reads QR data securely in your browser tab, ensuring privacy with zero network lookups";
  } else if (idL === "hex-to-rgb") {
    profile.userIntent = "convert Hex color codes to decimal RGB color values";
    profile.userProblem = "CSS stylesheets and graphics systems require different color formats, making manual Hex-to-RGB translation tedious";
    profile.actualTransformation = "parses Hex character triplets and converts the base-16 channels to base-10 red, green, and blue integers";
    profile.keyBenefit = "delivers precise RGB color mappings instantly in one click, supporting web design layouts";
  } else if (idL === "rgb-to-hex") {
    profile.userIntent = "convert decimal RGB color values to hexadecimal Hex color codes";
    profile.userProblem = "digital design palettes and styling configs require Hex codes, which are hard to compute from RGB components manually";
    profile.actualTransformation = "takes red, green, and blue integer values and formats them into hexadecimal notation strings";
    profile.keyBenefit = "provides clean, copy-pasteable Hex color codes instantly in your browser";
  } else if (idL === "markdown-to-html") {
    profile.userIntent = "convert Markdown formatting text into standard HTML markup tags";
    profile.userProblem = "writing HTML tags manually is slow and error-prone compared to writing lightweight Markdown scripts";
    profile.actualTransformation = "parses Markdown syntax tokens like hashes and asterisks to compile compliant HTML markup elements";
    profile.keyBenefit = "creates clean, previewable web page markup instantly without server processing delays";
  } else if (idL === "html-to-markdown") {
    profile.userIntent = "convert HTML markup tags back into clean Markdown formatting text";
    profile.userProblem = "stripping tags from HTML code to extract readable Markdown content is tedious and breaks visual hierarchies";
    profile.actualTransformation = "scans HTML tags and translates them into Markdown equivalents like headers and lists";
    profile.keyBenefit = "reconstructs clean Markdown documentation in seconds, preserving styling layouts";
  } else if (idL === "binary-to-text") {
    profile.userIntent = "decode binary byte sequences back into readable plain text characters";
    profile.userProblem = "interpreting raw binary bit logs or data packets requires decoding base-2 strings manually";
    profile.actualTransformation = "parses binary byte groups and converts the base-2 codes back to Unicode text characters";
    profile.keyBenefit = "restores original text contents instantly with absolute security in your browser tab";
  } else if (idL === "text-to-binary") {
    profile.userIntent = "encode plain text characters into binary byte sequences";
    profile.userProblem = "representing text drafts as binary bit codes requires looking up character ASCII values manually";
    profile.actualTransformation = "reads Unicode characters and translates them into standard 8-bit binary sequences";
    profile.keyBenefit = "generates clean, space-separated binary bit streams instantly for data modeling";
  } else if (idL === "decimal-to-binary") {
    profile.userIntent = "convert base-10 decimal numbers to base-2 binary bit strings";
    profile.userProblem = "calculating binary representation structures for network masks or computer logic manually is tedious";
    profile.actualTransformation = "divides base-10 integers by two sequentially to build the matching base-2 string";
    profile.keyBenefit = "provides clean binary bit patterns instantly, helping developers audit computing logic";
  } else if (idL === "binary-to-decimal") {
    profile.userIntent = "convert base-2 binary bit strings back to base-10 decimal numbers";
    profile.userProblem = "converting long binary strings back to decimal coordinates requires compounding powers of two manually";
    profile.actualTransformation = "sums the powers of two corresponding to set bits in the binary string locally";
    profile.keyBenefit = "computes the decimal integer representation instantly with absolute accuracy";
  } else if (idL === "decimal-to-hex") {
    profile.userIntent = "convert base-10 decimal numbers to base-16 hexadecimal codes";
    profile.userProblem = "calculating hex values for memory offsets or system colors requires dividing by 16 repeatedly";
    profile.actualTransformation = "converts decimal integers to their hexadecimal character representations client-side";
    profile.keyBenefit = "delivers clean hex string outputs instantly, assisting with system-level configurations";
  } else if (idL === "hex-to-decimal") {
    profile.userIntent = "convert base-16 hexadecimal codes back to base-10 decimal numbers";
    profile.userProblem = "interpreting hex strings requires multiplying base-16 coordinates manually, which is error-prone";
    profile.actualTransformation = "parses the hex string characters and calculates their base-10 decimal equivalent";
    profile.keyBenefit = "returns the decimal integer value instantly, simplifying data analyses";
  } else if (idL === "decimal-to-octal") {
    profile.userIntent = "convert base-10 decimal numbers to base-8 octal representations";
    profile.userProblem = "calculating octal representations for file permissions or legacy systems is slow to compute manually";
    profile.actualTransformation = "converts decimal integers into base-8 octal character notation strings";
    profile.keyBenefit = "generates clean octal codes instantly, assisting with Unix system settings";
  } else if (idL === "octal-to-decimal") {
    profile.userIntent = "convert base-8 octal representations back to base-10 decimal numbers";
    profile.userProblem = "calculating decimal values from base-8 digits requires compounding powers of eight manually";
    profile.actualTransformation = "parses octal string inputs and computes the matching base-10 decimal integer";
    profile.keyBenefit = "provides the decimal number representation instantly, helping with permission audits";
  } else if (idL === "octal-to-binary") {
    profile.userIntent = "convert base-8 octal representations to base-2 binary bit strings";
    profile.userProblem = "mapping octal file permissions to binary bit sequences manually is slow and error-prone";
    profile.actualTransformation = "translates each octal digit into its corresponding three-digit binary bit pattern";
    profile.keyBenefit = "delivers precise binary bit patterns instantly in one click";
  } else if (idL === "binary-to-octal") {
    profile.userIntent = "convert base-2 binary bit strings back to base-8 octal representations";
    profile.userProblem = "grouping binary bits into triplets to calculate octal numbers manually is tedious";
    profile.actualTransformation = "groups binary bits in triplets and computes the matching base-8 octal characters";
    profile.keyBenefit = "outputs the octal notation string instantly, helping audit data dumps";
  } else if (idL === "hex-to-binary") {
    profile.userIntent = "convert base-16 hexadecimal codes to base-2 binary bit strings";
    profile.userProblem = "mapping hex data blocks to binary bit patterns manually requires tedious digit translations";
    profile.actualTransformation = "maps each hex character to its corresponding four-digit binary bit pattern";
    profile.keyBenefit = "outputs the full binary bit stream instantly with zero server dependencies";
  } else if (idL === "binary-to-hex") {
    profile.userIntent = "convert base-2 binary bit strings to base-16 hexadecimal codes";
    profile.userProblem = "interpreting long binary bit streams is difficult without consolidating them into compact hex formats";
    profile.actualTransformation = "groups binary bits in groups of four and maps them to hexadecimal characters";
    profile.keyBenefit = "delivers clean hexadecimal string sequences instantly to compact your binary logs";
  } else if (idL === "hex-to-octal") {
    profile.userIntent = "convert base-16 hexadecimal codes to base-8 octal representations";
    profile.userProblem = "translating between base-16 and base-8 requires passing through decimal numbers first, which is tedious";
    profile.actualTransformation = "converts the hex input to binary and then groups bits to construct the octal string";
    profile.keyBenefit = "gives clean octal string results instantly without multi-step manual calculations";
  } else if (idL === "octal-to-hex") {
    profile.userIntent = "convert base-8 octal representations to base-16 hexadecimal codes";
    profile.userProblem = "converting octal digits to hex codes requires complex digit grouping and power calculations";
    profile.actualTransformation = "translates the octal inputs to binary and groups them into four-bit hex representations";
    profile.keyBenefit = "provides compact hexadecimal codes instantly, helping with legacy code refactoring";
  }

  // 4. Apply Manual Overrides for high-traffic tools
  const override = getManualOverride(tool.id);
  if (override) {
    profile.userIntent = override.userIntent;
    profile.userProblem = override.userProblem;
    profile.actualTransformation = override.transformation;
    profile.keyBenefit = override.keyBenefit;
    profile.advantages = override.advantages;
    profile.limitations = override.limitations;
    profile.commonMistakes = override.commonMistakes;
    profile.troubleshooting = override.troubleshooting;
    profile.practicalUseCases = override.practicalUseCases;
    if (override.operationWorks) {
      profile.operationWorks = override.operationWorks;
    }
    if (override.internalProcessingFlow) {
      profile.internalProcessingFlow = override.internalProcessingFlow;
    }
    if (override.keywordProfile) {
      profile.keywordProfile = override.keywordProfile;
    }
  }

  // 5. Apply Article Depth Logic
  profile.articleDepth = getArticleDepth(profile);

  return profile;
}

export function getArticleDepth(profile: ToolContentProfile): "small" | "medium" | "detailed" {
  const slug = profile.slug.toLowerCase();
  
  // Detailed: important, high-traffic tools
  const detailedSlugs = [
    "compress-pdf-guide",
    "pdf-to-word-guide",
    "word-to-pdf-guide",
    "image-compressor-guide",
    "background-remover-guide",
    "qr-code-generator-guide",
    "meta-tag-generator-guide",
    "pdf-editor-guide",
    "json-formatter-guide"
  ];
  if (detailedSlugs.includes(slug)) {
    return "detailed";
  }

  // Medium: common developer, editing, pdf, or image utility tools
  const isMediumCategory =
    profile.category === "pdf" ||
    profile.category === "image" ||
    profile.category === "editing" ||
    profile.category === "dev" ||
    profile.category === "seo";

  if (isMediumCategory) {
    return "medium";
  }

  // Small: simple calculators, unit converters, simple text helpers, basic productivity utilities
  return "small";
}
