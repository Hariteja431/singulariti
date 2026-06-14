export interface ManualToolOverride {
  id: string;
  toolName: string;
  userIntent: string;
  userProblem: string;
  transformation: string;
  keyBenefit: string;
  advantages: string[];
  limitations: string[];
  commonMistakes: string[];
  troubleshooting: string[];
  faqs: { question: string; answer: string }[];
  practicalUseCases: string[];
  operationWorks?: string[];
  internalProcessingFlow?: string[];
  keywordProfile?: {
    primaryKeyword: string;
    secondaryKeywords: string[];
    longTailKeywords: string[];
    semanticKeywords: string[];
  };
}

export const manualToolOverrides: Record<string, ManualToolOverride> = {
  "json-formatter": {
    id: "json-formatter",
    toolName: "JSON Formatter",
    userIntent: "Beautify, inspect, and validate minified JSON data payloads securely.",
    userProblem: "API responses and configuration payloads are frequently minified into a single long text block, making them impossible to read, audit, or debug.",
    transformation: "Parses the input string using JavaScript V8 compile routines and rebuilds the structure with uniform 2-space indentation.",
    keyBenefit: "Turns raw code blocks into a readable, collapsible nested hierarchy with real-time syntax error markers.",
    advantages: [
      "Collapsible parent/child nodes to inspect nested data fields",
      "Real-time syntax validation that highlights missing quotes, colons, or commas",
      "Local processing keeps authorization tokens and API data secure"
    ],
    limitations: [
      "Extremely large payloads (above 10MB) can cause browser tab lags",
      "Accepts only valid JSON format rules; comments are rejected by standard parsers"
    ],
    commonMistakes: [
      "Pasting JavaScript objects with single quotes or unquoted keys (which is not valid JSON)",
      "Including trailing commas at the end of lists or object blocks",
      "Forgetting to balance brackets"
    ],
    troubleshooting: [
      "Check line error indicators and ensure all string parameters are enclosed in double quotes.",
      "Remove comments from config blocks as standard JSON does not support them."
    ],
    practicalUseCases: [
      "Formatting webhook request payloads from messaging apps",
      "Auditing configuration settings before deploying application profiles",
      "Validating database exports before importing them into backend servers"
    ],
    faqs: [
      {
        question: "Why does the formatter fail on standard JavaScript objects?",
        answer: "JSON requires strict syntax rules: all object keys must be enclosed in double quotes, single quotes are not allowed for strings, and trailing commas are invalid."
      },
      {
        question: "Is it safe to format credentials and API keys?",
        answer: "Yes, because the formatting logic is executed client-side in your browser, your data is processed locally and is not sent to external servers."
      }
    ],
    keywordProfile: {
      primaryKeyword: "json formatter",
      secondaryKeywords: ["beautify json", "format json online", "json validator", "prettify json"],
      longTailKeywords: ["how to format minified json online", "json syntax validator in browser", "read api response json"],
      semanticKeywords: ["json stringify format", "parse json data", "valid javascript object notation"]
    }
  },
  "compress-pdf": {
    id: "compress-pdf",
    toolName: "PDF Compressor",
    userIntent: "Shrink PDF document file sizes locally without altering text layout or fonts.",
    userProblem: "Government portals, job systems, and email attachments have strict size limits, blocking resume submissions.",
    transformation: "Parses PDF object streams, downsamples embedded images, strips redundant metadata, and recompiles the binary file.",
    keyBenefit: "Reduces file weights significantly to bypass upload limits while maintaining layouts.",
    advantages: [
      "Ensures documents fit under strict upload caps",
      "Lossless font rendering keeps all text and headers perfectly sharp",
      "Processes documents locally, maintaining confidentiality"
    ],
    limitations: [
      "Documents that contain only vector text paths will not compress significantly",
      "Encrypted or password-locked documents must be unlocked first"
    ],
    commonMistakes: [
      "Compressing already optimized PDF files, which yields no size reduction",
      "Expecting low-resolution scanned pages to look perfectly sharp at extreme compression factors"
    ],
    troubleshooting: [
      "If the output size is unchanged, the document likely has minimal image content.",
      "Unlock protected files using our PDF decrypter before attempting compression."
    ],
    practicalUseCases: [
      "Shrinking portfolio PDF sizes for email attachments",
      "Preparing PDF reports to meet government portal upload limits",
      "Compressing scanned textbook chapters for school submissions"
    ],
    faqs: [
      {
        question: "Will the fonts or layout change after compression?",
        answer: "No. The text positioning, layout alignment, margins, and embedded font parameters are preserved. Only images and metadata are optimized."
      },
      {
        question: "Is there a limit on file size?",
        answer: "Files up to 100MB are supported. For extremely large files, processing may take several seconds depending on device memory."
      }
    ],
    keywordProfile: {
      primaryKeyword: "compress pdf",
      secondaryKeywords: ["shrink pdf file size", "pdf size reducer", "compress pdf free", "optimize pdf"],
      longTailKeywords: ["how to compress pdf locally in browser", "reduce pdf size for upload", "pdf compression online no upload"],
      semanticKeywords: ["pdf-lib compressor", "downsample pdf images", "optimize document binary"]
    }
  },
  "word-counter": {
    id: "word-counter",
    toolName: "Word Counter",
    userIntent: "Analyze text character, word, sentence, and line counts instantly.",
    userProblem: "Essays, publisher submissions, and metadata inputs have strict character or word caps that are tedious to track.",
    transformation: "Splits strings based on spacing delimiters, matches character indexes, and tallies line feeds.",
    keyBenefit: "Real-time updates on text metrics to ensure compliance with word boundaries.",
    advantages: [
      "Counts characters with and without spaces instantly",
      "Generates metadata such as reading times and line breaks",
      "Maintains drafts inside your active session without external logging"
    ],
    limitations: [
      "Language patterns without word-spacing (such as Chinese or Japanese) may require customized tokenizers",
      "Formatted text (like bold or tables) is counted as plain text strings"
    ],
    commonMistakes: [
      "Assuming spacing characters do not count toward total character limits",
      "Expecting line counts to match physical page counts of printed sheets"
    ],
    troubleshooting: [
      "Clear formatting if copy-pasting from complex documents to ensure characters are counted correctly.",
      "Check standard spacing rules if language limits differ."
    ],
    practicalUseCases: [
      "Tracking word count milestones for essays and thesis writing",
      "Validating character limits for meta descriptions or social posts",
      "Measuring text length constraints for ad copies"
    ],
    faqs: [
      {
        question: "Do emojis count as characters?",
        answer: "Yes. Emojis and special characters are evaluated using standard Unicode lengths, usually counting as 1 or 2 characters depending on the symbol."
      }
    ],
    keywordProfile: {
      primaryKeyword: "word counter",
      secondaryKeywords: ["character counter online", "count words text", "line counter", "word count checker"],
      longTailKeywords: ["how to count words in text document", "free character checker in browser", "measure text length online"],
      semanticKeywords: ["regex word splitting", "whitespace tokenizer", "unicode string length analysis"]
    }
  },
  "qr-code-generator": {
    id: "qr-code-generator",
    toolName: "QR Code Generator",
    userIntent: "Create custom QR code images for website links, Wi-Fi parameters, and text.",
    userProblem: "Many generator portals inject tracking codes, redirect links, or charge subscription fees for permanent QR codes.",
    transformation: "Runs Reed-Solomon error correction math to compile text input into a 2D matrix, rendering the grids onto an HTML5 canvas.",
    keyBenefit: "Creates static, permanent QR codes with customizable color schemes.",
    advantages: [
      "Direct encoding means generated codes work permanently without server redirects",
      "Adjustable error correction levels to keep codes readable even if partially damaged",
      "Customizable foreground and background color combinations"
    ],
    limitations: [
      "Encoding extremely long text creates a complex grid that can be difficult for older cameras to scan",
      "Low contrast color choices (such as light gray on white) will fail scanner checks"
    ],
    commonMistakes: [
      "Using insufficient color contrast, making the QR code unscannable",
      "Pasting incorrect web links or mistyping Wi-Fi passwords before exporting"
    ],
    troubleshooting: [
      "Test scan the code on your screen using a mobile device before printing.",
      "Increase the contrast ratio (such as dark blue on white) if scanner fails."
    ],
    practicalUseCases: [
      "Creating direct Wi-Fi access QR codes for guest networks",
      "Generating permanent URL QR codes for menus, flyer prints, and business cards",
      "Encoding contact cards for networking events"
    ],
    faqs: [
      {
        question: "Will my generated QR codes ever expire?",
        answer: "No. These are static QR codes that contain the direct data. Because there are no middleman redirect servers, they work permanently."
      }
    ]
  },
  "random-text": {
    id: "random-text",
    toolName: "Random Text Generator",
    userIntent: "Generate random placeholder sentences, paragraphs, or words for layout design.",
    userProblem: "Designers and developers need clean dummy text to test typography and page structures, but copying standard lorem ipsum manually is slow.",
    transformation: "Generates custom lengths of dummy text, mixing sentences and words client-side in browser memory.",
    keyBenefit: "Delivers clean, customizable mockup copy instantly with zero external dependencies.",
    advantages: [
      "Generates sentences, words, or paragraphs dynamically",
      "Copy results in one click",
      "Completely local formatting"
    ],
    limitations: [
      "Does not generate meaningful actual copy content",
      "Memory capped for huge word quantities"
    ],
    commonMistakes: [
      "Assuming the text is real readable translation",
      "Expecting formatted markdown outputs"
    ],
    troubleshooting: [
      "Adjust paragraph count sliders if layout needs more height.",
      "Click generate again for a new randomized set of words."
    ],
    practicalUseCases: [
      "Testing grid card heights in web page mockups",
      "Filling print template designs with mockup text",
      "Validating UI font sizing rules"
    ],
    faqs: [
      {
        question: "Is the generated text actual language?",
        answer: "No. It compiles randomized words from a dictionary to create realistic-looking paragraphs."
      }
    ]
  },
  "slug-generator": {
    id: "slug-generator",
    toolName: "Slug Generator",
    userIntent: "Convert raw titles and post names into clean, URL-friendly slug strings.",
    userProblem: "Special characters, uppercase letters, and spaces in titles create broken or unreadable URLs that hurt SEO indexing.",
    transformation: "Strips punctuation, converts characters to lowercase, replaces spaces with hyphens, and sanitizes character strings.",
    keyBenefit: "Generates clean, search-engine-friendly URLs instantly to improve indexing and link readability.",
    advantages: [
      "Strips all invalid URI coordinates and symbols",
      "Converts accents to standard ASCII characters",
      "Processes strings instantly in browser tab cache"
    ],
    limitations: [
      "Only processes text strings up to 5000 characters",
      "Does not perform automatic redirects for old links"
    ],
    commonMistakes: [
      "Including trailing hyphens or leading slashes manually",
      "Assuming it modifies actual database records"
    ],
    troubleshooting: [
      "Ensure input title is not empty.",
      "Check option boxes if you want to preserve or strip standard stop-words."
    ],
    practicalUseCases: [
      "Creating URL paths for blog guides and articles",
      "Formatting clean file names for server uploads",
      "Normalizing database string indexes"
    ],
    faqs: [
      {
        question: "What is an SEO slug?",
        answer: "It is the part of a URL that identifies a page in a human-readable and search-engine-friendly format."
      }
    ]
  },
  "jpg-compressor": {
    id: "jpg-compressor",
    toolName: "JPG Compressor",
    userIntent: "Reducing JPEG photograph weights is quick and easy with the JPG Compressor. Adjust quality to shrink files.",
    userProblem: "Many users experience operational friction because government sites and job boards reject document uploads if the jpeg file weight exceeds strict kilobyte caps.",
    transformation: "applies standard luminance scaling and block quantization parameters to rebuild compliant JPEG files",
    keyBenefit: "The tool executes transformations directly in browser RAM to optimize standard jpeg documents, scans, and receipts for official portals with peace of mind. High-resolution camera photos are too large to email, upload, or host efficiently. Running computations on your own device ensures that you conforms strictly to official portal upload rules, preserving legibility of scanned text characters securely. It bypasses traditional server-side bottlenecks and keeps your records safe from third-party monitoring.",
    advantages: ["Fast compression", "Adjustable quality settings", "Batch processing"],
    limitations: ["Lossy compression may reduce image quality"],
    commonMistakes: ["Using too low quality for important images"],
    troubleshooting: ["If the image looks blurry, increase the quality setting."],
    practicalUseCases: ["Website images", "Social media posts", "Email attachments"],
    operationWorks: [
      "Access the JPEG Compressor workspace in your active browser tab.",
      "Select the JPEG file you wish to optimize.",
      "Configure the target file size limits or quality constraints.",
      "Wait a few milliseconds for the in-memory compression script to execute.",
      "Save the compressed JPEG graphic to your device."
    ],
    internalProcessingFlow: [
      "Read user input parameter: Image Graphic File",
      "applies standard luminance scaling and block quantization parameters to rebuild compliant JPEG files",
      "Compile output formatting: Processed Image Graphic"
    ],
    faqs: [
      { question: "How much can I compress a JPG?", answer: "You can typically reduce file size by 50-80% with minimal quality loss." },
      { question: "Can I compress multiple JPGs at once?", answer: "Yes, upload multiple files to compress them in batch." }
    ]
  },
  "jpeg-compressor": {
    id: "jpeg-compressor",
    toolName: "JPEG Compressor",
    userIntent: "Reducing JPEG photograph weights is quick and easy with the JPG Compressor. Adjust quality to shrink files.",
    userProblem: "Many users experience operational friction because government sites and job boards reject document uploads if the jpeg file weight exceeds strict kilobyte caps.",
    transformation: "applies standard luminance scaling and block quantization parameters to rebuild compliant JPEG files",
    keyBenefit: "The tool executes transformations directly in browser RAM to optimize standard jpeg documents, scans, and receipts for official portals with peace of mind. High-resolution camera photos are too large to email, upload, or host efficiently. Running computations on your own device ensures that you conforms strictly to official portal upload rules, preserving legibility of scanned text characters securely. It bypasses traditional server-side bottlenecks and keeps your records safe from third-party monitoring.",
    advantages: ["Adjustable quantization scales", "Retains color fidelity", "Instant offline downloads"],
    limitations: ["Compression factors above 90% can introduce block artifacts"],
    commonMistakes: ["Re-compressing already compressed files multiple times"],
    troubleshooting: ["Increase compression quality if details appear fuzzy."],
    practicalUseCases: ["Optimizing phone snapshots", "Preparing web illustrations", "Saving phone memory"],
    operationWorks: [
      "Access the JPEG Compressor workspace in your active browser tab.",
      "Select the JPEG file you wish to optimize.",
      "Configure the target file size limits or quality constraints.",
      "Wait a few milliseconds for the in-memory compression script to execute.",
      "Save the compressed JPEG graphic to your device."
    ],
    internalProcessingFlow: [
      "Read user input parameter: Image Graphic File",
      "applies standard luminance scaling and block quantization parameters to rebuild compliant JPEG files",
      "Compile output formatting: Processed Image Graphic"
    ],
    faqs: [
      { question: "Does JPEG compression delete file details?", answer: "Yes, it uses optimized quantization to discard details that human eyes struggle to see." }
    ]
  },
  "image-compressor": {
    id: "image-compressor",
    toolName: "Image Compressor",
    userIntent: "A comprehensive image compression utility that handles multiple formats simultaneously.",
    userProblem: "The user struggles with large image files that slow down websites or exceed email limits.",
    transformation: "Uses intelligent format routing. Delegates JPG files to lossy quantization pipelines, PNG files to lossless palette-reduction algorithms, and WebPs to entropy block mapping.",
    keyBenefit: "Process multiple images of different formats in one batch with unified slider settings.",
    advantages: [
      "Process multiple images of different formats in one batch",
      "Unified slider settings to adjust quality indexes quickly",
      "Automatic detection of transparency masks to prevent graphic corruption"
    ],
    limitations: ["May reduce image quality at low quality settings"],
    commonMistakes: [
      "Applying the same low quality factor to logos and photographs in the same batch",
      "Expecting vector files like SVGs or PDFs to compile in standard image encoders"
    ],
    troubleshooting: ["If images look pixelated, try a higher quality setting."],
    practicalUseCases: ["Website optimization", "Email attachments", "Social media uploads"],
    faqs: [
      { question: "Can I compress different file formats at once?", answer: "Yes, the tool is format-agnostic. It routes JPEGs, PNGs, and WebPs through their respective browser encoders in the same queue." },
      { question: "Does it convert format types during compression?", answer: "No, files are compressed and exported in their original formats unless you explicitly opt to convert them." }
    ]
  },
  "png-compressor": {
    id: "png-compressor",
    toolName: "PNG Compressor",
    userIntent: "Compress PNG images to reduce file size while maintaining transparency.",
    userProblem: "Lossless PNG files are heavy, causing web page load delays and portal upload errors.",
    transformation: "applies lossless quantization and palette-reduction rules to shrink PNG weight client-side",
    keyBenefit: "reduces PNG size significantly while preserving alpha transparency channels and visual edges",
    advantages: ["Lossless compression ratios", "Retains alpha transparent layers", "Local on-device rendering"],
    limitations: ["Color-heavy photos in PNG format remain larger than JPEGs"],
    commonMistakes: ["Using PNG format for complex scenic photographs"],
    troubleshooting: ["Check output dimensions to verify layout scaling remains intact."],
    practicalUseCases: ["Optimizing web logos and icons", "Shrinking UI screenshot file sizes", "Preparing web illustrations"],
    faqs: [
      { question: "Is PNG compression lossless?", answer: "Yes, it preserves transparency and edge pixel details using lossless palette reductions." }
    ]
  },
  "bmi-calculator": {
    id: "bmi-calculator",
    toolName: "BMI Calculator",
    userIntent: "Calculate your Body Mass Index (BMI) using metric or imperial units.",
    userProblem: "Tracking metabolic metrics manually using math formulas is slow and prone to errors.",
    transformation: "computes body fat index parameters using standard height-to-weight ratios client-side",
    keyBenefit: "provides instant, accurate BMI calculations to help users assess body mass indices locally",
    advantages: ["Supports metric and imperial calculations", "Calculates body weight categories instantly", "Offline browser processing"],
    limitations: ["May overestimate body fat percentage in athletes with heavy muscle mass"],
    commonMistakes: ["Confusing pounds with kilograms in weight input fields"],
    troubleshooting: ["Ensure height is entered in centimeters or feet/inches according to selected mode."],
    practicalUseCases: ["Monitoring fitness progression", "Tracking personal health metrics", "Weight management goals"],
    faqs: [
      { question: "What is a healthy BMI range?", answer: "A BMI between 18.5 and 24.9 is considered healthy for most adults." }
    ]
  },
  "age-calculator": {
    id: "age-calculator",
    toolName: "Age Calculator",
    userIntent: "Calculate your exact age in years, months, and days instantly.",
    userProblem: "Manually counting dates and years for applications or milestone planning is slow and prone to errors.",
    transformation: "calculates calendar differences between two timestamps, accounting for leap years and month lengths",
    keyBenefit: "delivers exact age totals down to the day in your browser tab with complete privacy",
    advantages: ["Calculates exact age in years, months, and days", "Supports custom date-interval comparisons", "Processed locally for privacy"],
    limitations: ["Does not account for timezone coordinates in calculations"],
    commonMistakes: ["Entering the incorrect birthdate calendar year"],
    troubleshooting: ["Verify the date format matches the standard calendar picker."],
    practicalUseCases: ["Verifying age limits for job submissions", "Planning retirement milestones", "Tracking date intervals for records"],
    faqs: [
      { question: "Does the calculator account for leap years?", answer: "Yes. Leap years and standard monthly variances are automatically processed." }
    ]
  },
  "temperature-converter": {
    id: "temperature-converter",
    toolName: "Temperature Converter",
    userIntent: "Convert temperature values between Celsius, Fahrenheit, and Kelvin scales.",
    userProblem: "Remembering exact temperature scaling coefficients is difficult during cooking or scientific tasks.",
    transformation: "applies standard thermodynamic multiplier formulas client-side in real-time",
    keyBenefit: "provides precise, instant temperature scaling without remote server calls",
    advantages: ["Converts between Celsius, Fahrenheit, and Kelvin", "Real-time updates as you type", "Zero network latency"],
    limitations: ["Does not support historical scales like Rankine"],
    commonMistakes: ["Confusing negative temperature signs in inputs"],
    troubleshooting: ["Check input unit selections before reading output values."],
    practicalUseCases: ["Converting kitchen recipes", "Checking travel weather metrics", "Performing science calculations"],
    faqs: [
      { question: "What is absolute zero in Kelvin?", answer: "Absolute zero is 0 Kelvin, which corresponds to -273.15°C or -459.67°F." }
    ]
  },
  "qr-code-scanner": {
    id: "qr-code-scanner",
    toolName: "QR Code Scanner",
    userIntent: "Scan and decode QR codes instantly using your device camera or image uploads.",
    userProblem: "Many QR scanner apps track search locations, require bloatware installations, or lack sandbox security.",
    transformation: "extracts scannable matrix coordinates from image frames and translates them in-memory client-side",
    keyBenefit: "provides a lightweight, sandbox-secured QR reader with 100% data privacy",
    advantages: ["Supports camera scanning and file uploads", "No network tracking or redirect servers", "Decodes patterns in milliseconds"],
    limitations: ["Requires camera permissions for live webcam streaming"],
    commonMistakes: ["Scanning dark QR code frames printed on dark backgrounds"],
    troubleshooting: ["Ensure the camera has sufficient lighting and focus if scans fail."],
    practicalUseCases: ["Reading restaurant menus on mobile", "Accessing guest Wi-Fi networks", "Checking encoded contact card links"],
    faqs: [
      { question: "Can I scan a QR code from a file?", answer: "Yes. You can upload a screenshot or image file to decode the QR code without a camera." }
    ]
  }
};

export function getManualOverride(id: string): ManualToolOverride | undefined {
  const cleanId = id.toLowerCase().replace(/-guide$/i, "").trim();
  return manualToolOverrides[cleanId];
}
