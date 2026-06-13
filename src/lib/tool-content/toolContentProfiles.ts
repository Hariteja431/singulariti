import { UtilityRegistryItem } from '@/content/tools/toolRegistry';

export type ToolContentProfile = {
  toolName: string;
  slug: string;
  category: string;
  subcategory?: string;
  url: string;

  operationType:
    | "text-compare"
    | "text-analysis"
    | "text-cleanup"
    | "text-generation"
    | "pdf-management"
    | "pdf-conversion"
    | "image-compression"
    | "image-conversion"
    | "image-editing"
    | "developer-formatting"
    | "developer-encoding"
    | "developer-decoding"
    | "seo-analysis"
    | "seo-generation"
    | "qr-generation"
    | "qr-scanning"
    | "calculator"
    | "unit-conversion"
    | "office-conversion"
    | "productivity"
    | "utility";

  inputType: string;
  outputType: string;

  userProblem: string;
  toolPurpose: string;
  actualProcess: string;
  keyBenefit: string;

  audience: string[];
  useCases: string[];
  advantages: string[];
  commonMistakes: string[];
  outputChecks: string[];
  limitations: string[];
  relatedTools: string[];

  safetyNoteType:
    | "browser-file"
    | "possible-server"
    | "developer-sensitive"
    | "text-review"
    | "calculator-estimate"
    | "general";

  articleDepth: "small" | "medium" | "detailed";
};

// Explicit custom property profiles for high-traffic or complex tools
const toolOverrides: Record<string, Partial<ToolContentProfile>> = {
  "text-compare": {
    operationType: "text-compare",
    inputType: "Two versions of plain text (Original and Modified)",
    outputType: "Highlighted side-by-side text diff visualization",
    userProblem: "identifying additions, deletions, or subtle modifications between two draft versions manually is slow and prone to oversights",
    toolPurpose: "compare two distinct text blocks and visually highlight line-by-line or word-by-word differences",
    actualProcess: "applies a diff algorithm in your browser to tokenize lines, match matching segments, and highlight modifications in red (deletions) and green (additions)",
    keyBenefit: "spot edits instantly to speed up code reviews, document checks, or copy edits",
    audience: ["software engineers", "writers", "legal clerks", "editors"],
    useCases: ["reviewing code updates", "comparing draft agreements", "tracking revisions in content copy"],
    advantages: ["side-by-side and unified views", "character-level inline highlights", "runs 100% locally in browser memory"],
    commonMistakes: ["ignoring whitespace changes that distort diffs", "comparing completely unrelated files"],
    outputChecks: ["review flagged modifications manually", "check indentation and line endings"],
    limitations: ["may lag on files exceeding 10MB due to memory constraints", "does not merge changes automatically"],
    safetyNoteType: "text-review",
    articleDepth: "detailed"
  },
  "paragraph-counter": {
    operationType: "text-analysis",
    inputType: "Plain text string or document copy",
    outputType: "Exact paragraph count and text structure breakdown",
    userProblem: "determining the number of structural text blocks or paragraph divisions in copy is tedious and inaccurate when done manually",
    toolPurpose: "parse text and count the number of distinct paragraph blocks separated by double line breaks",
    actualProcess: "splits the text stream using newline regular expressions, filters out empty whitespace fragments, and calculates the total paragraph count",
    keyBenefit: "ensures essays, articles, and book chapters meet exact structural standards",
    audience: ["bloggers", "students", "academic writers", "content strategists"],
    useCases: ["checking academic paper formatting", "verifying blog layout readability", "auditing manuscript drafts"],
    advantages: ["counts block paragraphs instantly", "ignores empty line padding", "provides average words-per-paragraph metrics"],
    commonMistakes: ["counting single line breaks as paragraphs", "forgetting that tabs may shift paragraph counts"],
    outputChecks: ["verify paragraph break structure", "audit lines and words per paragraph"],
    limitations: ["cannot identify context shifts", "cannot distinguish between sub-headings and body paragraphs"],
    safetyNoteType: "text-review",
    articleDepth: "medium"
  },
  "rotate-pdf": {
    operationType: "pdf-management",
    inputType: "PDF Document file (.pdf)",
    outputType: "Rotated PDF Document containing reoriented sheets",
    userProblem: "scanned documents often end up sideways or upside down, making them impossible to read or present professionally",
    toolPurpose: "rotate individual pages or the entire PDF document by 90, 180, or 270 degrees",
    actualProcess: "reads the PDF byte stream, alters the rotation catalog flag for selected page directories, and re-compiles the file buffer in the browser",
    keyBenefit: "reorients document layout angles cleanly without losing original metadata or page quality",
    audience: ["office workers", "students", "accountants", "legal assistants"],
    useCases: ["correcting upside-down document scans", "turning landscape pages to portrait", "preparing client invoice packages"],
    advantages: ["maintains high file vector quality", "rotates selected page ranges", "saves output directly on client side"],
    commonMistakes: ["rotating the wrong pages", "forgetting to save the rotation angle before download"],
    outputChecks: ["visually inspect page orientation before downloading", "check file size after save"],
    limitations: ["requires password unlocking for encrypted files", "cannot rotate text inside complex images"],
    safetyNoteType: "browser-file",
    articleDepth: "detailed"
  },
  "image-compressor": {
    operationType: "image-compression",
    inputType: "Large image files (PNG, JPEG, WebP, SVG)",
    outputType: "Optimized and compressed image file",
    userProblem: "heavy image sizes consume excessive bandwidth, slow down web page loads, and trigger upload limit errors on portals",
    toolPurpose: "reduce the byte size of images while maintaining visual quality and resolution parameters",
    actualProcess: "renders the raw image onto an offline Canvas and re-encodes the pixel matrix using controlled quality scales to output smaller blobs",
    keyBenefit: "shrinks file size significantly to boost web performance, SEO rankings, and loading times",
    audience: ["web designers", "e-commerce developers", "content creators", "photographers"],
    useCases: ["compressing website assets", "reducing photo weights for email", "fitting graphics into strict upload portal limits"],
    advantages: ["custom compression slider", "live before-and-after size comparison", "100% on-device CPU execution"],
    commonMistakes: ["compressing an already compressed file", "reducing quality to 0% and causing pixelation"],
    outputChecks: ["check output file size in KB/MB", "verify visual clarity of fine details"],
    limitations: ["cannot reconstruct lost pixel data", "extreme compression levels will degrade quality"],
    safetyNoteType: "browser-file",
    articleDepth: "detailed"
  },
  "json-formatter": {
    operationType: "developer-formatting",
    inputType: "Minified, raw, or unreadable JSON text",
    outputType: "Syntax-highlighted, formatted, and indented JSON data structure",
    userProblem: "debugging raw API payloads or database logs is near impossible when the text is flattened into a single unreadable line",
    toolPurpose: "format raw JSON strings with uniform spacing, tab indents, and clean line breaks",
    actualProcess: "parses the raw text string into a JavaScript object hierarchy, then stringifies it with controlled spacing intervals and syntax coloring rules",
    keyBenefit: "transforms minified JSON streams into highly readable structures for immediate debugging",
    audience: ["software developers", "QA engineers", "system administrators", "data analysts"],
    useCases: ["prettifying raw API JSON responses", "debugging database logs", "cleaning configuration files"],
    advantages: ["collapsible nested nodes", "custom indentation scales (2 or 4 spaces)", "runs locally in browser tab memory"],
    commonMistakes: ["pasting invalid JSON syntax", "replacing values accidentally"],
    outputChecks: ["ensure JSON structure is valid", "check syntax error positions if parsed fails"],
    limitations: ["requires valid JSON structures", "may freeze on massive files over 20MB"],
    safetyNoteType: "developer-sensitive",
    articleDepth: "detailed"
  }
};

// Map file formats to user problems and benefits for conversion tools
export const formatDetails: Record<string, { desc: string, purpose: string, strengths: string[], weaknesses: string[] }> = {
  pdf: {
    desc: "Portable Document Format",
    purpose: "secure, standardized document presentation and printing layouts",
    strengths: ["preserves formatting across all platforms", "supports secure encryption", "embeds fonts"],
    weaknesses: ["extremely difficult to edit without dedicated software", "larger file size"]
  },
  jpg: {
    desc: "JPEG Compressed Image",
    purpose: "highly compressed, standard photographic sharing",
    strengths: ["small byte footprint", "universal browser compatibility", "rich color ranges"],
    weaknesses: ["lossy compression loses original detail", "does not support transparent layers"]
  },
  png: {
    desc: "Portable Network Graphic",
    purpose: "lossless transparency and high-contrast web assets",
    strengths: ["supports alpha transparency channels", "lossless visual preservation", "sharp text lines"],
    weaknesses: ["massive file sizes for high-res photos", "lacks CMYK color space"]
  },
  webp: {
    desc: "Google WebP Format",
    purpose: "highly optimized modern web image compression",
    strengths: ["combines lossless and lossy characteristics", "30% smaller than JPG", "supports transparent channels"],
    weaknesses: ["incompatible with some legacy browsers and image software", "lossy WebP cannot be recovered"]
  },
  svg: {
    desc: "Scalable Vector Graphic",
    purpose: "resolution-independent, code-based digital graphics",
    strengths: ["scales infinitely without pixelation", "editable markup structure", "tiny file sizes for vectors"],
    weaknesses: ["unsuitable for complex photographic graphics", "requires rendering engines"]
  }
};

// Dynamically compile properties for tools using category heuristics
export function buildToolContentProfile(tool: UtilityRegistryItem): ToolContentProfile {
  const baseProfile = toolOverrides[tool.id] || {};

  // Extract category and names
  const toolName = tool.name;
  const slug = tool.guideSlug;
  const url = tool.utilityUrl;
  const category = tool.sectionId;
  const subcategory = tool.subSectionId;

  // Heuristic-based operation types if not overridden
  let operationType: ToolContentProfile["operationType"] = "utility";
  if (baseProfile.operationType) {
    operationType = baseProfile.operationType;
  } else {
    if (category === "text") {
      if (tool.id.includes("compare") || tool.id.includes("diff")) operationType = "text-compare";
      else if (tool.id.includes("counter")) operationType = "text-analysis";
      else if (tool.id.includes("clean") || tool.id.includes("space") || tool.id.includes("duplicate")) operationType = "text-cleanup";
      else if (tool.id.includes("lorem") || tool.id.includes("random")) operationType = "text-generation";
      else operationType = "text-cleanup";
    } else if (category === "pdf") {
      if (tool.id.includes("to")) operationType = "pdf-conversion";
      else operationType = "pdf-management";
    } else if (category === "image" || category === "editing") {
      if (tool.id.includes("compress")) operationType = "image-compression";
      else if (tool.id.includes("to")) operationType = "image-conversion";
      else operationType = "image-editing";
    } else if (category === "dev") {
      if (tool.id.includes("format") || tool.id.includes("beautify")) operationType = "developer-formatting";
      else if (tool.id.includes("encode")) operationType = "developer-encoding";
      else if (tool.id.includes("decode") || tool.id.includes("validator")) operationType = "developer-decoding";
      else operationType = "developer-formatting";
    } else if (category === "seo") {
      if (tool.id.includes("check") || tool.id.includes("audit") || tool.id.includes("density") || tool.id.includes("heading")) operationType = "seo-analysis";
      else operationType = "seo-generation";
    } else if (category === "qr") {
      if (tool.id.includes("scanner")) operationType = "qr-scanning";
      else operationType = "qr-generation";
    } else if (category === "calculators") {
      operationType = "calculator";
    } else if (category === "convert") {
      operationType = "unit-conversion";
    }
  }

  // Safety Note Type mapping
  let safetyNoteType: ToolContentProfile["safetyNoteType"] = "general";
  if (baseProfile.safetyNoteType) {
    safetyNoteType = baseProfile.safetyNoteType;
  } else {
    if (category === "text") safetyNoteType = "text-review";
    else if (category === "dev") safetyNoteType = "developer-sensitive";
    else if (category === "calculators") safetyNoteType = "calculator-estimate";
    else if (category === "pdf" || category === "image" || category === "editing") safetyNoteType = "browser-file";
  }

  // Article Depth
  let articleDepth: ToolContentProfile["articleDepth"] = "medium";
  if (baseProfile.articleDepth) {
    articleDepth = baseProfile.articleDepth;
  } else {
    // Determine priority
    const importantTools = [
      "merge-pdf", "split-pdf", "compress-pdf", "sign-pdf", "qr-code-generator", "qr-code-scanner",
      "emi-calculator", "sip-calculator", "word-counter", "json-formatter", "robots-txt-generator",
      "sitemap-xml-generator", "color-picker-tool"
    ];
    const simpleTools = [
      "line-counter", "sentence-counter", "text-uppercase", "text-lowercase", "rgb-to-hex", "hex-to-rgb",
      "unix-time-converter", "timestamp-converter", "uuid-generator", "area-converter", "speed-converter"
    ];

    if (importantTools.includes(tool.id)) articleDepth = "detailed";
    else if (simpleTools.includes(tool.id)) articleDepth = "small";
  }

  // Input & Output types
  const inputType = baseProfile.inputType || (tool.inputType && tool.inputType.length > 0 ? tool.inputType[0] : "Raw Input Data");
  const outputType = baseProfile.outputType || (tool.outputType && tool.outputType.length > 0 ? tool.outputType[0] : "Processed Output");

  // Fallback metadata building if details are missing
  let userProblem = baseProfile.userProblem || "";
  let toolPurpose = baseProfile.toolPurpose || "";
  let actualProcess = baseProfile.actualProcess || "";
  let keyBenefit = baseProfile.keyBenefit || "";
  let audience = baseProfile.audience || [];
  let useCases = baseProfile.useCases || [];
  let advantages = baseProfile.advantages || [];
  let commonMistakes = baseProfile.commonMistakes || [];
  let outputChecks = baseProfile.outputChecks || [];
  let limitations = baseProfile.limitations || [];
  let relatedTools = baseProfile.relatedTools || [];

  // Categorized template fallbacks to guarantee tool-specific values based on actual metadata
  if (!userProblem) {
    if (operationType === "unit-conversion") {
      userProblem = `converting metric values or scaling units for ${toolName.toLowerCase()} manually requires memorizing complex formulas and scaling constants`;
      toolPurpose = `convert values of ${toolName.toLowerCase()} across standard and legacy units of measurement`;
      actualProcess = `takes the numeric unit values, translates them into a base index using international multipliers, and converts them to the selected unit format`;
      keyBenefit = `provides immediate and mathematically exact scaling results to avoid manual calculation errors`;
      audience = ["students", "engineers", "cooks", "science researchers"];
      useCases = ["checking homework answers", "verifying industrial parameters", "matching metric units to local scales"];
      advantages = ["instant calculated outputs", "converts multiple units together", "handles fractional decimal values"];
      commonMistakes = ["selecting incorrect unit tags", "forgetting standard decimal rounding parameters"];
      outputChecks = ["verify unit types select", "inspect visual decimals"];
      limitations = ["limited to standard math conversion units", "requires positive values for physical measures"];
    } else if (operationType === "calculator") {
      userProblem = `evaluating standard equations or compounding variables for ${toolName.toLowerCase()} manually is slow and highly prone to calculation errors`;
      toolPurpose = `calculate output results for ${toolName.toLowerCase()} based on standard formulas and variables`;
      actualProcess = `reads numeric input fields and applies mathematical models locally in the browser tab to render final values`;
      keyBenefit = `delivers fast and reliable numeric estimations to back your financial, health, or academic decisions`;
      audience = ["financial planners", "students", "daily users", "professionals"];
      useCases = ["planning monthly budgets", "tracking fitness targets", "solving homework problems"];
      advantages = ["error-free calculations", "visual data summaries", "resets values instantly"];
      commonMistakes = ["entering alphabet symbols in numeric inputs", "misinterpreting compounding terms"];
      outputChecks = ["check decimal values", "verify input numbers"];
      limitations = ["results represent mathematical estimations", "does not account for dynamic external fees"];
    } else if (operationType === "pdf-conversion" || operationType === "image-conversion") {
      const parts = tool.id.split("-to-");
      const from = parts[0] || "source";
      const to = (parts[1] || "target").replace("-guide", "");
      userProblem = `sharing files in the ${from.toUpperCase()} format is clunky when recipients require the ${to.toUpperCase()} standard for viewing or editing`;
      toolPurpose = `convert files from the ${from.toUpperCase()} layout into the ${to.toUpperCase()} structure`;
      actualProcess = `parses the input ${from.toUpperCase()} structure, maps it to the target document rules, and serializes the new ${to.toUpperCase()} bytes`;
      keyBenefit = `allows you to transition between standard document formats locally and securely in seconds`;
      audience = ["office assistants", "designers", "freelancers", "students"];
      useCases = ["conforming to portal upload file types", "reformatting layout pages", "packaging scanned files"];
      advantages = ["zero visual rendering losses", "creates exact target file extensions", "works 100% locally in browser memory"];
      commonMistakes = ["converting low-res source files expecting high clarity", "forgetting file format capabilities"];
      outputChecks = ["check converted extension", "inspect file size and contents"];
      limitations = ["cannot convert encrypted files", "some file-specific interactive layers may flat out"];
    } else if (category === "qr") {
      userProblem = `sharing URLs, phone numbers, or Wi-Fi passwords manually introduces spelling mistakes and takes too much time`;
      toolPurpose = `create or read scannable QR codes representing plain text, links, or contact structures`;
      actualProcess = `compiles text inputs into a grid pattern using Reed-Solomon error correction and exports an SVG graphic`;
      keyBenefit = `enables instant physical-to-digital interactions using any smartphone camera`;
      audience = ["event coordinators", "marketers", "retail shop managers", "webmasters"];
      useCases = ["sharing contact links on prints", "enabling customer Wi-Fi scans", "collecting mobile invoice payments"];
      advantages = ["generates high-definition vector graphics", "fully custom block sizing options", "runs in client web tab browser cache"];
      commonMistakes = ["creating overly dense codes with too much text", "printing with low colors contrast"];
      outputChecks = ["test scan the generated code on screen", "double check redirect links"];
      limitations = ["requires physical scanning device", "QR code scan reliability drops on blurred prints"];
    } else if (category === "seo") {
      userProblem = `auditing metadata tags, checking lengths, or building config indexing rules for web pages manually is tedious and easy to misconfigure`;
      toolPurpose = `generate or check search engine optimization (SEO) configurations for website domains`;
      actualProcess = `evaluates text parameters against search crawler length rules and outputs crawl schemas or checklists`;
      keyBenefit = `boosts search visibility by ensuring your website tags adhere to standard indexing guidelines`;
      audience = ["SEO consultants", "copywriters", "bloggers", "front-end devs"];
      useCases = ["verifying meta tag lengths", "generating site configurations", "checking page formatting patterns"];
      advantages = ["aligns with Google standards", "outputs clean copy-paste files", "works offline instantly"];
      commonMistakes = ["exceeding maximum character limits", "pasting duplicate title text"];
      outputChecks = ["validate meta title length under 60 characters", "check sitemap XML links"];
      limitations = ["evaluates syntax formatting, not content quality", "does not index pages automatically"];
    } else {
      // General fallbacks based on registry item
      userProblem = `processing ${toolName.toLowerCase()} parameters manually or with complex desktop programs creates delays and introduces errors`;
      toolPurpose = `provide a local browser dashboard to ${tool.shortDescription.replace(/\.$/, "").toLowerCase()}`;
      actualProcess = `reads and formats your inputs in-memory using JavaScript and browser styling modules`;
      keyBenefit = `gives you clean, reliable results instantly without installing bloating software suites`;
      audience = ["office workers", "web developers", "students", "designers"];
      useCases = ["formatting files", "cleaning input streams", "analyzing metadata layouts"];
      advantages = ["zero setup or accounts required", "responsive UI for mobile and desktops", "runs completely client-side"];
      commonMistakes = ["pasting corrupted or incorrect data structures", "forgetting to backup source files"];
      outputChecks = ["check output files extension", "verify data parameters represent correct values"];
      limitations = ["constrained by browser tab memory bounds", "does not save history after tab closure"];
    }
  }

  // Set default lists if empty
  if (audience.length === 0) audience = ["office workers", "students", "developers"];
  if (useCases.length === 0) useCases = [`formatting ${toolName.toLowerCase()} settings`, `optimizing local ${category} workflows`];
  if (advantages.length === 0) advantages = ["runs client-side on your device CPU", "signup-free browser access", "responsive interface layouts"];
  if (commonMistakes.length === 0) commonMistakes = [`uploading corrupted inputs`, `forgetting to save processed results`];
  if (outputChecks.length === 0) outputChecks = [`verify final file contents`, `ensure target values look correct`];
  if (limitations.length === 0) limitations = ["constrained by browser tab sandbox bounds", "does not cache session history"];

  return {
    toolName,
    slug,
    category,
    subcategory,
    url,
    operationType,
    inputType,
    outputType,
    userProblem,
    toolPurpose,
    actualProcess,
    keyBenefit,
    audience,
    useCases,
    advantages,
    commonMistakes,
    outputChecks,
    limitations,
    relatedTools,
    safetyNoteType,
    articleDepth
  };
}
