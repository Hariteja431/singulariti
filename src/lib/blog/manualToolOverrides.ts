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
  }
};

export function getManualOverride(id: string): ManualToolOverride | undefined {
  const cleanId = id.toLowerCase().replace(/-guide$/i, "").trim();
  return manualToolOverrides[cleanId];
}
