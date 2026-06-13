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
    if (subSectionId.includes("conversion") || tool.id.includes("to")) {
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
    } else if (subSectionId.includes("conversion") || tool.id.includes("to")) {
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
  }

  // Parse conversion directions (e.g. "pdf-to-jpg")
  let sourceFormat: string | undefined;
  let targetFormat: string | undefined;
  if (tool.id.includes("-to-")) {
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

  if (catL.includes("pdf")) {
    inputsStr = "PDF Document File";
    outputsStr = "Modified PDF Document";
  } else if (catL.includes("image")) {
    inputsStr = "Image Graphic File";
    outputsStr = "Processed Image Graphic";
  } else if (catL.includes("calculator")) {
    inputsStr = "Numeric Parameters";
    outputsStr = "Calculated Results";
  } else if (idL.includes("formatter") || idL.includes("beautifier") || idL.includes("json") || idL.includes("xml")) {
    inputsStr = "Raw Markup or Code Text";
    outputsStr = "Formatted Code Structure";
  }

  // Dynamic intent/problem generator based on tool name to avoid robotic templates
  const nameL = name.toLowerCase();
  let userIntent = `perform ${nameL} actions quickly and securely`;
  let userProblem = `manually handling ${nameL} requires complex local installations or risky cloud uploads`;
  let actualTransformation = `processes the input parameters client-side to output the formatted results`;
  let keyBenefit = `executes the operations entirely in your browser tab, ensuring privacy with zero server uploads`;

  if (nameL.includes("compress")) {
    userIntent = `compress and shrink the file size of your ${nameL.replace("compressor", "").replace("compress", "").trim() || "files"}`;
    userProblem = `large documents and images exceed email attachment sizes and slow down web page load speeds`;
    actualTransformation = `optimizes raw byte streams and downsamples resolutions locally in memory`;
    keyBenefit = `significantly reduces disk usage while preserving visual rendering quality`;
  } else if (nameL.includes("convert") || nameL.includes("to")) {
    const formats = nameL.split(" to ");
    const fromF = formats[0] || "source";
    const toF = formats[1] || "target";
    userIntent = `convert and reformat files from ${fromF} to ${toF}`;
    userProblem = `different systems mandate specific file formats, making file compatibility a regular bottleneck`;
    actualTransformation = `decodes the source file structure and recompiles it into the target format layout`;
    keyBenefit = `provides immediate compatibility across platforms without exposing documents to cloud logging`;
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
  const hash = getSlugHash(slug);
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
