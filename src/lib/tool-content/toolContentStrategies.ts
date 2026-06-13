import { ToolContentProfile, formatDetails } from './toolContentProfiles';
import { calculatorsDetailsDb } from './details/calculatorsDb';
import { convertDetailsDb } from './details/convertDb';
import { devDetailsDb } from './details/devDb';
import { imageDetailsDb } from './details/imageDb';
import { pdfDetailsDb } from './details/pdfDb';
import { qrDetailsDb } from './details/qrDb';
import { seoDetailsDb } from './details/seoDb';
import { textDetailsDb } from './details/textDb';

const allDetailsDb: Record<string, {
  whyNeed: string;
  howWorks: string;
  whenToUse: string;
  stepByStep: string[];
  advantages: string[];
  commonMistakes: string[];
  faqs: { q: string; a: string }[];
}> = {
  ...calculatorsDetailsDb,
  ...convertDetailsDb,
  ...devDetailsDb,
  ...imageDetailsDb,
  ...pdfDetailsDb,
  ...qrDetailsDb,
  ...seoDetailsDb,
  ...textDetailsDb
};

function cleanPageHowWorks(str: string): string {
  if (!str) return '';
  let clean = str.trim();
  clean = clean.replace(/^The browser-based application reads parameters in-memory\.\s*/i, '');
  clean = clean.replace(/^Specifically,\s*/i, '');
  if (clean.length > 0) {
    clean = clean[0].toUpperCase() + clean.slice(1);
  }
  return clean;
}

export type StrategyContent = {
  whyNeed: string;
  howWorks: string;
  whenToUse: string;
  stepByStep: string[];
  example: string;
  advantages: string[];
  mistakes: string[];
  privacy: string;
  faqs: { question: string; answer: string }[];
};

// Privacy rules mappings based on safetyNoteType
const privacyNoteMap: Record<ToolContentProfile["safetyNoteType"], string> = {
  "text-review": "Review sensitive text before pasting it into any online tool. If the tool runs in the browser, processing can happen locally, but users should still avoid sharing private passwords, tokens, personal IDs, or confidential content.",
  "developer-sensitive": "Avoid pasting secrets, API keys, private tokens, or credentials into formatting, decoding, or testing tools unless you fully understand how the page processes the data.",
  "browser-file": "Check the final file before downloading or sharing it. For sensitive files, make sure you understand whether the tool works in the browser or requires server-side processing.",
  "possible-server": "For highly confidential files or datasets, verify the processing method before proceeding. Although we prioritize secure browser-based execution, some tools may support optional remote features.",
  "calculator-estimate": "Calculator results depend on the values entered. Treat results as estimates and double-check important financial, academic, or professional decisions.",
  "general": "Verify input parameters and outputs before relying on them. This tool processes data client-side in the browser, but users should exercise normal precautions with sensitive data."
};

export function generateTextCompareContent(profile: ToolContentProfile): StrategyContent {
  const name = profile.toolName;
  return {
    whyNeed: `Comparing document versions, editing drafts, or reviewing code changes manually is error-prone. The **${name}** visually isolates differences in seconds. Instead of searching line-by-line, the interface highlights added paragraphs and deleted words side-by-side, helping you audit revisions and maintain consistency across documents.`,
    howWorks: `Under the hood, the browser engine tokenizes both text blocks, executes a character difference matching routine, and renders color-coded HTML highlighting deletions in red and additions in green. This entire logic executes locally in volatile RAM.`,
    whenToUse: `Use this tool when reviewing contract modifications, checking text edits in draft publications, verifying code updates, or comparing notes and essays.`,
    stepByStep: [
      `Paste your original text version into the left input container.`,
      `Paste the updated or revised version into the right input container.`,
      `Toggle the layout options between Side-by-Side and Unified views.`,
      `Inspect the highlighted red (deleted) and green (added) text segments.`
    ],
    example: `Comparing original sentence "Create standard templates" to modified version "Create custom layouts" highlights "standard templates" as removed and "custom layouts" as added.`,
    advantages: [
      "Highlights inline character-level differences visually",
      "Offers split-screen side-by-side and unified scroll views",
      "Runs fully locally on your device CPU for data security"
    ],
    mistakes: [
      "Comparing completely different documents expecting clean matching lines",
      "Overlooking spacing differences (like tabs vs spaces) that distort diff blocks"
    ],
    privacy: privacyNoteMap[profile.safetyNoteType],
    faqs: [
      {
        question: "Does the comparison check character-by-character details?",
        answer: "Yes, it highlights line differences first, then performs character-level matches to show exact word edits."
      },
      {
        question: "Is there a limit to the length of text I can compare?",
        answer: "There are no server limits, but very large text blocks (above 5MB) may lag the browser canvas. Consider breaking massive files into sections."
      }
    ]
  };
}

export function generateTextAnalysisContent(profile: ToolContentProfile): StrategyContent {
  const name = profile.toolName;
  const id = profile.slug.replace("-guide", "").toLowerCase();

  let subcategory = "text metrics";
  let whyParagraph = `Checking document limits, character lengths, or paragraph structures requires a reliable tracking helper. The **${name}** processes raw copy in real-time, helping writers, students, and SEO content editors fit strict publishing standards.`;
  let processDesc = `The browser reads the text area stream, runs character matches, and tallies divisions based on regex line-break splits.`;
  let steps = [
    `Paste or type your draft content into the text area.`,
    `Check the statistics panel for counts in real-time.`,
    `Adjust configuration filters like including or excluding white spaces.`
  ];
  let faqs = [
    {
      question: "Are spacing characters included in the totals?",
      answer: "The metrics display totals both including spaces and excluding spaces, so you can adapt to different publishing layouts."
    }
  ];

  if (id.includes("word") || id.includes("character") || id.includes("line") || id.includes("sentence") || id.includes("paragraph")) {
    subcategory = "text counting";
    whyParagraph = `Writing for publishers, academic portals, or search engines requires meeting strict character or word caps. The **${name}** counts characters, lines, sentences, or paragraph blocks in real-time. This eliminates manual audits and helps you structure essays, captions, or descriptions.`;
    processDesc = `The engine tokenizes the characters, splits words on spaces, detects sentences using punctuation marks, and tallies paragraphs based on double line breaks.`;
    steps = [
      `Paste your document paragraphs into the input box.`,
      `Review counts showing character details, lines, and paragraph breaks.`,
      `Copy the audited text directly to your destination portal.`
    ];
  } else if (id.includes("density")) {
    subcategory = "keyword density";
    whyParagraph = `Avoiding keyword stuffing is crucial for modern SEO indexing rules. The **${name}** calculates the frequency percentage of words in your copy, highlighting optimization targets.`;
    processDesc = `The script tokenizes the copy, strips common filler words (stop words), counts unique keyword frequencies, and maps them to percentage ratios.`;
    steps = [
      `Paste your draft article text into the editor.`,
      `Review the keyword frequency table sorted by percentages.`,
      `Adjust keyword counts to keep densities between 1% and 2%.`
    ];
  }

  return {
    whyNeed: whyParagraph,
    howWorks: `The tool parses the text input client-side. Specifically, it ${processDesc} without network delays, outputting instant metrics in the browser tab.`,
    whenToUse: `Use this tool when drafting SEO descriptions, writing social media posts, structuring academic papers, or auditing keyword frequencies.`,
    stepByStep: steps,
    example: `Input text "Formatting copy matters." outputs a count of 3 words, 24 characters, 1 sentence, and 1 paragraph layout.`,
    advantages: [
      "Calculates text statistics in real-time as you type",
      "Strips out visual noise to verify character values",
      "Works offline without account setups or subscriptions"
    ],
    mistakes: [
      "Assuming smart punctuation (like em dashes) counts identically to standard hyphens",
      "Forgetting to exclude HTML tag markup before running character counts"
    ],
    privacy: privacyNoteMap[profile.safetyNoteType],
    faqs: [
      ...faqs,
      {
        question: "How does the tool define word boundaries?",
        answer: "A word is defined as any alphanumeric character sequence divided by standard spaces, tab margins, or line breaks."
      }
    ]
  };
}

export function generateTextCleanupContent(profile: ToolContentProfile): StrategyContent {
  const name = profile.toolName;
  const id = profile.slug.replace("-guide", "").toLowerCase();

  let whyNeed = `Messy copy containing duplicate lines, trailing spaces, or mixed casing makes text editing tedious. The **${name}** cleans up data lists instantly, stripping redundant spacing or identical rows locally on your CPU.`;
  let processDesc = `The utility reads the text stream, splits lines into an array, runs JavaScript array filters to remove matches, and joins the formatted string.`;
  let steps = [
    `Paste your raw list or text block into the input editor.`,
    `Choose cleaning options (like lowercase conversion, space stripping, or duplicate line removal).`,
    `Click the clean action button.`,
    `Copy the cleaned text output.`
  ];

  if (id.includes("duplicate")) {
    whyNeed = `Cleaning duplicate items, email lists, or data logs manually is slow. The **${name}** identifies and purges identical lines, compiling unique text sets in one click.`;
    processDesc = `The browser script splits your text by line boundaries, filters out duplicate array entries, and formats a unique line layout.`;
  } else if (id.includes("space")) {
    whyNeed = `Redundant spaces, double spacing, or trailing tab margins distort layouts and formatting codes. The **${name}** trims and cleans word spacing instantly.`;
    processDesc = `The script executes regex replace functions to trim leading/trailing borders and collapse multiple spaces into single characters.`;
  } else if (id.includes("case") || id.includes("uppercase") || id.includes("lowercase") || id.includes("title")) {
    whyNeed = `Manually fixing incorrect letter capitalization in article titles or list entries is tedious. The **${name}** converts text casing instantly to uppercase, lowercase, or Title Case.`;
    processDesc = `The tool maps the character string and applies native JavaScript casing transformations, adjusting letters depending on selected rules.`;
  }

  return {
    whyNeed,
    howWorks: `The tool operates entirely on your device. It ${processDesc} in-memory, updating your layout without loading external networks.`,
    whenToUse: `Use this when removing duplicate entries from data dumps, stripping extra spaces from spreadsheet exports, formatting title headings, or sorting list records.`,
    stepByStep: steps,
    example: `Pasting a raw list "Apple\nApple\nOrange" and running duplicate removal yields a cleaned list: "Apple\nOrange".`,
    advantages: [
      "Strips whitespace and purges identical rows instantly",
      "Maintains list line-break structures",
      "Executes locally in RAM with zero data leakage risks"
    ],
    mistakes: [
      "Running duplicate removal on structured code scripts where matching lines are required",
      "Forgetting that case variations (like 'apple' vs 'Apple') will not count as identical unless ignored"
    ],
    privacy: privacyNoteMap[profile.safetyNoteType],
    faqs: [
      {
        question: "Does it support case-insensitive duplicate line matching?",
        answer: "By default, it checks case-sensitive duplicates, but some filters let you toggle settings to match regardless of capitalization."
      }
    ]
  };
}

export function generatePdfManagementContent(profile: ToolContentProfile): StrategyContent {
  const name = profile.toolName;
  const id = profile.slug.replace("-guide", "").toLowerCase();

  let whyNeed = `Organizing documents—such as merging scans, splitting chapters, or rotating skewed pages—is a daily administrative chore. The **${name}** manages PDF page layouts offline, eliminating the need for expensive desktop editing suites.`;
  let processDesc = `The PDF engine reads the binary file buffers in browser memory, adjusts catalog tags for page indices, and writes a fresh document stream.`;
  let steps = [
    `Upload your PDF document file (.pdf) to the browser uploader.`,
    `Specify page selection parameters (pages to rotate, split ranges, or new page ordering).`,
    `Trigger the client-side processing script.`,
    `Save the modified PDF document back to your device.`
  ];

  if (id.includes("merge")) {
    whyNeed = `Assembling folders of invoice receipts, reports, or portfolio pages into one file is slow without compilation tools. The **${name}** combines multiple PDF files into a single structured document.`;
    processDesc = `The browser script loads each uploaded PDF buffer, copies page elements sequentially into a new pdf document layout, and compiles the unified file.`;
    steps = [
      `Select and upload multiple PDF document files.`,
      `Drag and drop the files to set your desired order.`,
      `Click the merge action button.`,
      `Download the combined PDF document.`
    ];
  } else if (id.includes("split")) {
    whyNeed = `Extracting single chapters or sending partial pages from a heavy report is difficult. The **${name}** splits a PDF into separate files by specifying custom page ranges.`;
    processDesc = `The engine reads the page directories of the source PDF, copies selected page indexes, and writes them into separate, light PDF buffers.`;
    steps = [
      `Upload the PDF document you wish to divide.`,
      `Input target page ranges (e.g., '1-3, 5') in the range box.`,
      `Click the split action button.`,
      `Download the resulting split files.`
    ];
  } else if (id.includes("protect")) {
    whyNeed = `Protecting financial, personal, and legal records is a critical security task. The **${name}** encrypts and locks PDF files with custom passwords.`;
    processDesc = `The tool loads the PDF buffer, applies RC4 or AES encryption parameters using a password seed, and exports a locked document.`;
    steps = [
      `Upload your sensitive PDF document.`,
      `Type a secure password in the input field.`,
      `Confirm permissions (like blocking printing or copying).`,
      `Save the locked and encrypted PDF document.`
    ];
  }

  return {
    whyNeed,
    howWorks: `The tool executes entirely client-side. Specifically, it ${processDesc} locally on your machine, ensuring your documents never leave your CPU.`,
    whenToUse: `Use this when re-ordering portfolio pages, splitting corporate contracts, securing tax statements, or correct sideways scanned forms.`,
    stepByStep: steps,
    example: `Uploading a sideways scanned PDF form, rotating the pages 90 degrees clockwise, and saving the reoriented document instantly.`,
    advantages: [
      "Preserves original hyperlink and bookmark dictionaries",
      "Visual page previews simplify orientation and sorting",
      "Processes documents on-device with zero server transfers"
    ],
    mistakes: [
      "Trying to process encrypted files without unlocking them first",
      "Overwriting your only original backup file with the edited output"
    ],
    privacy: privacyNoteMap[profile.safetyNoteType],
    faqs: [
      {
        question: "Can I unlock password-protected PDFs using this tool?",
        answer: "No, you must decrypt or enter the active password of a locked PDF before you can merge, split, or rotate its pages."
      }
    ]
  };
}

export function generatePdfConversionContent(profile: ToolContentProfile): StrategyContent {
  const name = profile.toolName;
  const parts = profile.slug.split("-to-");
  const fromFmt = parts[0]?.toUpperCase() || "PDF";
  const toFmt = (parts[1] || "JPG").replace("-guide", "").toUpperCase();

  return {
    whyNeed: `Web portals and email services often enforce strict file formats. The **${name}** bridges this gap by converting ${fromFmt} files into ${toFmt} format. Share pages as images on social platforms or pack separate JPEG scanner photos into a single, printable document.`,
    howWorks: `The converter maps variables locally. For image-to-document, it draws graphics onto PDF coordinate canvases. For document-to-image, it rasterizes PDF vectors via browser rendering (pdf.js) into raster pixel blobs.`,
    whenToUse: `Use this when converting digital JPEG receipts to a unified PDF, or saving PDF contract pages as JPG files for presentation slides.`,
    stepByStep: [
      `Upload your source **${fromFmt}** files into the converter.`,
      `Select layout preferences (like page orientation or image quality).`,
      `Press the convert action button to process the files locally.`,
      `Save your exported **${toFmt}** files.`
    ],
    example: `Converting a 3-page ${fromFmt} document into 3 separate ${toFmt} images in seconds for web upload.`,
    advantages: [
      `Tailored conversion parameters for ${fromFmt} to ${toFmt}`,
      "Preserves original aspect ratios and margins",
      "Executes in browser memory, keeping document contents secure"
    ],
    mistakes: [
      "Converting low-resolution images hoping for searchable PDF vector text",
      "Forgetting that converting documents to JPG turns interactive links into flat pixels"
    ],
    privacy: privacyNoteMap[profile.safetyNoteType],
    faqs: [
      {
        question: `Do hyperlinks survive the ${fromFmt} to ${toFmt} conversion?`,
        answer: `Converting PDF to JPG rasterizes pages, meaning hyperlinks and forms are turned into flat pixels and will no longer be clickable.`
      }
    ]
  };
}

export function generateImageCompressionContent(profile: ToolContentProfile): StrategyContent {
  const name = profile.toolName;
  return {
    whyNeed: `Large images cause slow web page loads and consume mobile data. The **${name}** shrinks image byte weight while keeping visual clarity, stripping metadata and optimizing compression channels locally on your CPU.`,
    howWorks: `The compressor loads the image onto an HTML5 Canvas, inspects pixel data, and exports a compressed file using quality parameters in the browser.`,
    whenToUse: `Use this when optimizing photos for blog posts, reducing product image size for online portals, or shrinking attachments for emails.`,
    stepByStep: [
      `Upload your heavy image file into the uploader interface.`,
      `Adjust the quality slider (recommended quality: 80% to 85%).`,
      `Check the target size indicator to verify bytes saved.`,
      `Download the compressed image file instantly.`
    ],
    example: `Compressing a 4MB JPEG camera photo at 80% quality, yielding a 600KB file with no visible loss in sharpness.`,
    advantages: [
      "Significantly reduces image file weight in KB/MB",
      "Strips hidden camera EXIF metadata details",
      "Runs on-device with zero network data transfer risks"
    ],
    mistakes: [
      "Compressing files repeatedly, causing compound pixel distortion",
      "Setting compression level to 0% and causing extreme pixel blur"
    ],
    privacy: privacyNoteMap[profile.safetyNoteType],
    faqs: [
      {
        question: "Will the physical dimensions (width and height) change?",
        answer: "No. The tool only reduces the byte size of the image by optimizing pixel compression; the width and height remain identical."
      }
    ]
  };
}

export function generateImageConversionContent(profile: ToolContentProfile): StrategyContent {
  const name = profile.toolName;
  const parts = profile.slug.split("-to-");
  const fromFmt = parts[0]?.toUpperCase() || "PNG";
  const toFmt = (parts[1] || "JPG").replace("-guide", "").toUpperCase();

  return {
    whyNeed: `Different digital layouts require specific image formats for proper display. The **${name}** converts ${fromFmt} graphics into ${toFmt} formats. Transition formats without downloading heavy desktop raster software.`,
    howWorks: `The converter draws the source ${fromFmt} image onto an in-memory Canvas element and re-saves the graphic block using the ${toFmt} encoder format.`,
    whenToUse: `Use this when converting vector SVGs to raster PNGs, transparent PNG logos to flat JPGs, or HEIC camera shots to universal JPEGs.`,
    stepByStep: [
      `Select the **${fromFmt}** image file you need to convert.`,
      `Adjust formatting parameters like transparency background or quality levels.`,
      `Click the convert action button to process pixels.`,
      `Save the resulting **${toFmt}** graphic file.`
    ],
    example: `Converting a transparent ${fromFmt} icon into a flat ${toFmt} graphic with white background padding.`,
    advantages: [
      `Specific format conversion mapping for ${fromFmt} to ${toFmt}`,
      "Supports transparent backdrop configurations",
      "Converts files offline inside browser volatile memory"
    ],
    mistakes: [
      `Forgetting that converting transparent ${fromFmt} to ${toFmt} will replace transparency with a solid background color`,
      "Ignoring quality sliders on compressed target formats"
    ],
    privacy: privacyNoteMap[profile.safetyNoteType],
    faqs: [
      {
        question: `Does converting images reduce their original clarity?`,
        answer: `Converting to lossless formats like PNG preserves pixel data. Converting to JPG or WebP is lossy but customizable to protect quality.`
      }
    ]
  };
}

export function generateImageEditingContent(profile: ToolContentProfile): StrategyContent {
  const name = profile.toolName;
  return {
    whyNeed: `Resizing, cropping, rotating, or styling photos shouldn't require complex image editing suites. The **${name}** provides a clean, online workspace to adjust your graphics instantly in your browser sandbox.`,
    howWorks: `The editor loads the image file, binds it to Canvas workspace controls, and applies visual filter matrices or cropping vectors in real-time.`,
    whenToUse: `Use this to crop profile photos, scale web banner dimensions, rotate inverted images, or watermark product shots locally.`,
    stepByStep: [
      `Upload your photo (JPEG, PNG, WebP) into the editor dashboard.`,
      `Adjust handles to crop, scale width/height, or toggle filter values.`,
      `Inspect the live layout preview for visual clarity.`,
      `Save the edited image file to your device.`
    ],
    example: `Uploading a photo, dragging crop boundaries to fit a 1:1 aspect ratio, and exporting the centered crop for a profile avatar.`,
    advantages: [
      "Custom aspect ratio presets (1:1, 16:9, etc.) for quick crops",
      "Locks scaling proportions to prevent visual stretching",
      "Saves outputs without watermarks or registration walls"
    ],
    mistakes: [
      "Stretching images by adjusting width and height without locking proportions",
      "Cropping out essential details that cannot be recovered after export"
    ],
    privacy: privacyNoteMap[profile.safetyNoteType],
    faqs: [
      {
        question: "Can I revert my changes in the editor?",
        answer: "Yes, you can reset crop handles or values back to the original source image anytime before downloading."
      }
    ]
  };
}

export function generateDeveloperFormattingContent(profile: ToolContentProfile): StrategyContent {
  const name = profile.toolName;
  return {
    whyNeed: `Prettifying minified API responses or cluttered database logs manually is impossible. The **${name}** indents and formats raw code structures instantly. Avoid sharing sensitive API logs, JSON payloads, or SQL statements with external formatters that might log your data.`,
    howWorks: `The tool parses the input string, tokenizes code statements, builds a nested syntax tree, and prints an indented block with visual coloring.`,
    whenToUse: `Use this to prettify minified JSON payloads, clean up complex nested SQL queries, format XML configs, or beautify CSS files.`,
    stepByStep: [
      `Paste your raw or minified code text into the editor input.`,
      `Set formatting preferences like indentation spacing (2 or 4 spaces).`,
      `Click the format action button to compile code blocks.`,
      `Copy the syntax-beautified code to your clipboard.`
    ],
    example: `Pasting minified string '{"user":"alex"}' output: \n{\n  "user": "alex"\n}`,
    advantages: [
      "Includes collapsible node lines for easy inspection",
      "Provides visual syntax highlighting for key commands",
      "Works entirely in your active browser window session"
    ],
    mistakes: [
      "Pasting invalid syntax structures and expecting formatting to succeed",
      "Accidentally deleting closing tags during manual copy-pastes"
    ],
    privacy: privacyNoteMap[profile.safetyNoteType],
    faqs: [
      {
        question: "What happens if there is a parsing error?",
        answer: "The formatter will highlight the approximate position of the syntax error (like a missing comma) instead of formatting the invalid code."
      }
    ]
  };
}

export function generateDeveloperEncodingContent(profile: ToolContentProfile): StrategyContent {
  const name = profile.toolName;
  return {
    whyNeed: `Percent-encoding URL parameters or translating base64 data blocks is a frequent developer task. The **${name}** provides a secure local sandbox to convert text. Sending keys or tokens to online portals is a security risk; this tool processes everything client-side.`,
    howWorks: `The encoder translates characters into standard percent-mappings or binary base64 ASCII strings directly inside browser memory.`,
    whenToUse: `Use this when percent-encoding URL queries containing spaces, or converting small graphic icons to inline CSS base64 URIs.`,
    stepByStep: [
      `Paste the text string or load binary bytes in the input container.`,
      `Select your target encoding type (like Base64 or URL).`,
      `Click the encode button to run the local script.`,
      `Copy the encoded output string.`
    ],
    example: `Encoding URL string "hello world!" output percent-encoded "hello%20world%21" to ensure safe browser routing.`,
    advantages: [
      "Converts character mappings instantly on your device",
      "Supports binary files and plain text inputs",
      "Operates offline with zero data leakage risks"
    ],
    mistakes: [
      "Encoding the same text multiple times, causing double translation errors",
      "Ignoring base64 format paddings that distort output strings"
    ],
    privacy: privacyNoteMap[profile.safetyNoteType],
    faqs: [
      {
        question: "Is encoding the same as encryption?",
        answer: "No. Encoding is a reversible layout format used to transmit data safely. Encryption requires security keys to protect information."
      }
    ]
  };
}

export function generateDeveloperDecodingContent(profile: ToolContentProfile): StrategyContent {
  const name = profile.toolName;
  return {
    whyNeed: `Decoding base64 strings, inspecting JWT scopes, or translating percent-encoded URLs is a key developer workflow. The **${name}** decodes data structures instantly. Avoid sharing proprietary keys, token parameters, or payloads with external servers.`,
    howWorks: `The decoder parses character indexes, maps byte configurations, and outputs readable text or nested JSON objects.`,
    whenToUse: `Use this when decoding URL query strings, checking payload contents in JWT tokens, or extracting files from base64 blocks.`,
    stepByStep: [
      `Paste the encoded payload string into the input panel.`,
      `Select the decoding parameters (like UTF-8 text or raw JSON).`,
      `Press the decode action button.`,
      `Copy the decoded outputs.`
    ],
    example: `Decoding base64 string "U2luZ3VsYXJpdGk=" output: "Singulariti" in milliseconds.`,
    advantages: [
      "Decodes complex formats safely in browser memory",
      "Formats token scopes into structured collapsible blocks",
      "Includes a copy button to capture outputs easily"
    ],
    mistakes: [
      "Pasting truncated or missing character strings that break decoder rules",
      "Trying to decode encrypted hashes that require security keys"
    ],
    privacy: privacyNoteMap[profile.safetyNoteType],
    faqs: [
      {
        question: "Can I verify JWT signatures using the decoder?",
        answer: "The decoder displays the token headers and payloads, but signature verification requires a private key."
      }
    ]
  };
}

export function generateSeoAnalysisContent(profile: ToolContentProfile): StrategyContent {
  const name = profile.toolName;
  return {
    whyNeed: `Auditing meta tags, keywords, and heading structures is critical for search rankings. The **${name}** checks optimization parameters instantly. Keep page tags aligned with Google's Webmaster Guidelines to prevent search truncation.`,
    howWorks: `The checker parses your text strings or layout code, calculates keyword counts, processes heading hierarchies, and outputs scoring checklists.`,
    whenToUse: `Use this when auditing title tags, checking content headings, verifying density percentages, or measuring description lengths.`,
    stepByStep: [
      `Input your page URL or paste your meta text into the auditor.`,
      `Click the audit evaluation button.`,
      `Check the SEO scoring checklist and optimization tips.`,
      `Fix title or tag lengths based on recommendations.`
    ],
    example: `Auditing description tag showing 190 characters: flags warning that Google truncates text over 160 characters, suggesting a shorter draft.`,
    advantages: [
      "Performs SEO length and heading checks locally",
      "Provides structural checklists and recommendations",
      "Allows page validation before deployment"
    ],
    mistakes: [
      "Over-optimizing content by stuffing keywords to reach high density",
      "Skipping heading levels (like H2 to H4) which breaks crawl logic"
    ],
    privacy: privacyNoteMap[profile.safetyNoteType],
    faqs: [
      {
        question: "What is the optimal meta title length?",
        answer: "Keep title tags between 50 and 60 characters to ensure they display fully in Google search listings."
      }
    ]
  };
}

export function generateSeoGenerationContent(profile: ToolContentProfile): StrategyContent {
  const name = profile.toolName;
  return {
    whyNeed: `Creating robots.txt files, XML sitemaps, or structured meta tags is key for crawler indexation. The **${name}** generates search tags and rules instantly. Avoid complex syntax configurations and build compliant schemas locally.`,
    howWorks: `The generator reads parameter selections, builds sitemap or XML syntax structures, and formats them into standard text documents.`,
    whenToUse: `Use this when launching new domains, creating sitemap lists, setting crawler block folders, or writing OpenGraph tags.`,
    stepByStep: [
      `Fill in website parameters (like URLs, paths, or crawl permissions).`,
      `Set priorities and change frequencies in sitemap options.`,
      `Click the generate action button.`,
      `Download the completed configuration file.`
    ],
    example: `Generating a Robots.txt file with disallowed folders and site URLs to prevent indexing of internal dashboard pages.`,
    advantages: [
      "Generates search-engine compliant XML and text files",
      "Provides structured metadata fields for quick editing",
      "No account signup required to build sitemap files"
    ],
    mistakes: [
      "Disallowing essential site assets in Robots.txt configuration",
      "Forgetting to include sitemap links in Google Search Console"
    ],
    privacy: privacyNoteMap[profile.safetyNoteType],
    faqs: [
      {
        question: "Why is an XML sitemap important?",
        answer: "It lists all your pages, allowing search bots to crawl and index your site structures more efficiently."
      }
    ]
  };
}

export function generateQrGenerationContent(profile: ToolContentProfile): StrategyContent {
  const name = profile.toolName;
  return {
    whyNeed: `Sharing URLs, contact details, or payment links manually is slow and leads to errors. The **${name}** compiles scannable barcodes in seconds. Generate vector QR codes for brochures, business cards, and menus locally in your browser sandbox without registration limits.`,
    howWorks: `The tool parses text inputs, applies Reed-Solomon error correction algorithms, and renders the code as an SVG or PNG graphic on your screen.`,
    whenToUse: `Use this when creating Wi-Fi login codes, link QR codes for business flyers, or UPI payment codes for retail counters.`,
    stepByStep: [
      `Input the website URL, text message, or Wi-Fi credentials.`,
      `Adjust styling choices (like size boundaries or background colors).`,
      `Click the generate action button.`,
      `Download the QR code image (SVG or PNG) to your device.`
    ],
    example: `Creating a Wi-Fi QR code with SSID "OfficeNet" and password "123456" so guests can scan to join the network.`,
    advantages: [
      "Exports high-quality vector graphics (SVG)",
      "Supports error correction blocks for print reliability",
      "Generates static codes that never expire"
    ],
    mistakes: [
      "Generating low-contrast codes (light blocks on light background)",
      "Packing too much text, making code blocks dense and hard to scan"
    ],
    privacy: privacyNoteMap[profile.safetyNoteType],
    faqs: [
      {
        question: "Do these generated QR codes expire?",
        answer: "No. These are static QR codes that contain your data directly, meaning they will function permanently without expiration."
      }
    ]
  };
}

export function generateCalculatorContent(profile: ToolContentProfile): StrategyContent {
  const name = profile.toolName;
  const id = profile.slug.replace("-guide", "").toLowerCase();

  let whyNeed = `Evaluating calculations manually is slow and prone to errors. The **${name}** computes equations instantly. Avoid slow desktop worksheets or ad-bloated sites and run calculations securely on your device CPU.`;
  let processDesc = `processes your numbers and applies standard mathematical formulas locally in-memory, updating results instantly.`;
  let steps = [
    `Input the required parameters into the form fields.`,
    `Adjust variables like calculations terms or unit markers.`,
    `Click the compute button or review live outputs.`,
    `Inspect detailed schedules or result breakdowns.`
  ];
  let faqs = [
    {
      question: "Are these calculation results guaranteed?",
      answer: "Calculations follow standard mathematical formulas. However, treat results as estimates and verify them before making critical decisions."
    }
  ];

  if (id.includes("bmi") || id.includes("calorie")) {
    whyNeed = `Tracking BMR indexes, biological metrics, or fitness targets manually is difficult. The **${name}** calculates your fitness numbers locally in the browser sandbox.`;
    processDesc = `reads your biological values (height, weight, age) and applies Mifflin-St Jeor or standard BMI formulas in RAM.`;
    steps = [
      `Enter your height, weight, and age in the designated boxes.`,
      `Select your daily activity multiplier level.`,
      `Check your BMR, target calories, or BMI range indicators.`,
      `Adapt your nutrition or fitness habits based on results.`
    ];
  } else if (id.includes("cagr") || id.includes("fd") || id.includes("roi") || id.includes("mortgage") || id.includes("loan") || id.includes("sip") || id.includes("interest") || id.includes("salary")) {
    whyNeed = `Estimating interest yields, monthly EMIs, tax deductions, or compounding growth rates manually is slow. The **${name}** computes financial formulas instantly.`;
    processDesc = `reads principal amounts, interest rates, and tenures, applying standard compound or amortization formulas locally.`;
    steps = [
      `Input the financial principal sum, tax value, or investment amount.`,
      `Enter the annual interest rate or tax slab percentage.`,
      `Set the duration in years or months.`,
      `Review monthly EMIs, total interest payouts, or net salaries.`
    ];
  }

  return {
    whyNeed,
    howWorks: `The tool operates entirely client-side. Specifically, the calculator ${processDesc}`,
    whenToUse: `Use this to compare loan EMIs, compute interest allocations, track body mass indexes, or convert chronological age profiles.`,
    stepByStep: steps,
    example: `Inputting values calculates variables and yields a detailed amortized or numeric breakdown list instantly.`,
    advantages: [
      "Uses standardized formulas for exact results",
      "Displays detailed breakdown tables and charts",
      "Runs locally in browser RAM with no tracking cookies"
    ],
    mistakes: [
      "Entering wrong interest rates or mistaking yearly variables for monthly ones",
      "Pasting non-numeric values in form fields"
    ],
    privacy: privacyNoteMap[profile.safetyNoteType],
    faqs: [
      ...faqs
    ]
  };
}

export function generateUnitConversionContent(profile: ToolContentProfile): StrategyContent {
  const name = profile.toolName;
  const id = profile.slug.replace("-guide", "").toLowerCase();

  let whyNeed = `Converting measurement parameters is essential for engineering, cooking, and academic work. The **${name}** calculates scaling factors instantly. Avoid referencing legacy tables and scale units accurately without page reloads.`;
  let processDesc = `reads your inputs, normalizes them using base SI constants, and applies target multipliers to yield precise results.`;
  let steps = [
    `Enter the numeric value you wish to convert in the input.`,
    `Select the source unit from the options drop-down.`,
    `Select your target unit from the output drop-down.`,
    `Check the converted value showing instant calculations.`
  ];

  if (id.includes("length")) {
    whyNeed = `Converting metric meters to imperial feet or miles is standard in design and logistics. The **${name}** computes distance metrics instantly.`;
    processDesc = `normalizes length inputs to base meters and translates them into inches, feet, yards, or kilometers.`;
  } else if (id.includes("weight")) {
    whyNeed = `Tracking weight units across kilograms, pounds, or ounces is a key requirement in shipping and health. The **${name}** scales mass units instantly.`;
    processDesc = `normalizes mass inputs to base grams and converts them to pounds, ounces, or metric tons.`;
  } else if (id.includes("data")) {
    whyNeed = `System administrators frequently convert database file sizes between megabytes and gigabytes. The **${name}** calculates data storage units using binary scale factors.`;
    processDesc = `applies base-1024 calculations to translate file sizes across bytes, KB, MB, GB, and TB.`;
  }

  return {
    whyNeed,
    howWorks: `The converter operates locally. Specifically, the engine ${processDesc}`,
    whenToUse: `Use this when converting speeds, data storage blocks, temperature scales, weights, or areas for assignments or designs.`,
    stepByStep: steps,
    example: `Converting a value of 100 in the source unit calculates and prints the target unit equivalent instantly.`,
    advantages: [
      "Uses standardized conversion constants",
      "Displays multiple converted units together",
      "Operates entirely offline once the page loads"
    ],
    mistakes: [
      "Confusing binary storage factors (1024 bytes) with decimal factors (1000 bytes)",
      "Selecting incorrect units, like dry ounces instead of fluid ounces"
    ],
    privacy: privacyNoteMap[profile.safetyNoteType],
    faqs: [
      {
        question: "How precise are the conversion scales?",
        answer: "The tool utilizes international standard constants and prints outputs to customizable decimal scales to avoid rounding errors."
      }
    ]
  };
}

export function generateProductivityContent(profile: ToolContentProfile): StrategyContent {
  const name = profile.toolName;
  return {
    whyNeed: `Completing daily tasks—like compiling random numbers, formatting parameters, or tracking timelines—requires straightforward utilities. The **${name}** handles minor chores instantly. Save time and increase efficiency by running local operations inside your browser window.`,
    howWorks: `The utility loads input files or text selections, applies sorting arrays or randomizing APIs, and updates the layout context in the active window.`,
    whenToUse: `Use this when managing files, organizing schedules, setting tasks, or generating lists.`,
    stepByStep: [
      `Access the **${name}** interface in your browser tab.`,
      `Provide your input parameters by typing or uploading a file.`,
      `Wait a few milliseconds for the in-memory script to run.`,
      `Verify the resulting outputs displayed in the preview panel.`,
      `Copy the finalized results to your clipboard.`
    ],
    example: `Using a list generator to build 10 sorted tasks with custom spacing settings instantly.`,
    advantages: [
      "Straightforward layout designed for quick results",
      "Operates locally with zero account requirements",
      "Adapts smoothly to mobile and desktop screens"
    ],
    mistakes: [
      "Pasting incompatible data formats into inputs",
      "Accidentally closing the tab before downloading results"
    ],
    privacy: privacyNoteMap[profile.safetyNoteType],
    faqs: [
      {
        question: "Does the tool support offline usage?",
        answer: "Yes, once loaded in your browser cache, the tool functions fully offline without internet connectivity."
      }
    ]
  };
}

export function generateUtilityContent(profile: ToolContentProfile): StrategyContent {
  const name = profile.toolName;
  return {
    whyNeed: `Running minor digital tasks—like inspecting page tags, epoch conversions, or parsing files—should be straightforward. The **${name}** is a browser-based utility designed to handle these tasks instantly. Get rapid answers without bloatware or cloud transfers.`,
    howWorks: `The tool executes JS evaluation functions locally on your CPU and updates results in real-time as you adjust settings.`,
    whenToUse: `Use this when testing formats, reviewing configurations, or analyzing text files.`,
    stepByStep: [
      `Launch the **${name}** workspace from the web tab.`,
      `Paste target data coordinates into the input area.`,
      `Review layout variables and optimization settings.`,
      `Click the action button to run the browser processor.`,
      `Export the completed output files securely.`
    ],
    example: `Running the inspection script on a local document layout to parse configuration statistics in seconds.`,
    advantages: [
      "Bypasses remote server queues entirely",
      "Clean, ad-free workspace for professionals",
      "Loads instantly even on slower networks"
    ],
    mistakes: [
      "Failing to check output details for missing parameters",
      "Comparing unrelated formats expecting clean updates"
    ],
    privacy: privacyNoteMap[profile.safetyNoteType],
    faqs: [
      {
        question: "Is there a limit on how many times I can use the tool?",
        answer: "No. The tool runs locally in your browser, so you can perform unlimited operations without restriction."
      }
    ]
  };
}

export function getStrategyContent(profile: ToolContentProfile): StrategyContent {
  const toolId = profile.slug.replace(/-guide$/, '');
  const entry = allDetailsDb[toolId];

  if (entry) {
    return {
      whyNeed: entry.whyNeed,
      howWorks: cleanPageHowWorks(entry.howWorks),
      whenToUse: entry.whenToUse,
      stepByStep: entry.stepByStep,
      example: `For example, using the ${profile.toolName} to process ${profile.inputType.toLowerCase()} to generate ${profile.outputType.toLowerCase()} client-side.`,
      advantages: entry.advantages,
      mistakes: entry.commonMistakes,
      privacy: privacyNoteMap[profile.safetyNoteType],
      faqs: entry.faqs.map(f => ({ question: f.q, answer: f.a }))
    };
  }

  let strategy: StrategyContent;

  switch (profile.operationType) {
    case "text-compare":
      strategy = generateTextCompareContent(profile);
      break;
    case "text-analysis":
      strategy = generateTextAnalysisContent(profile);
      break;
    case "text-cleanup":
      strategy = generateTextCleanupContent(profile);
      break;
    case "text-generation":
      strategy = generateProductivityContent(profile);
      break;
    case "pdf-management":
      strategy = generatePdfManagementContent(profile);
      break;
    case "pdf-conversion":
      strategy = generatePdfConversionContent(profile);
      break;
    case "image-compression":
      strategy = generateImageCompressionContent(profile);
      break;
    case "image-conversion":
      strategy = generateImageConversionContent(profile);
      break;
    case "image-editing":
      strategy = generateImageEditingContent(profile);
      break;
    case "developer-formatting":
      strategy = generateDeveloperFormattingContent(profile);
      break;
    case "developer-encoding":
      strategy = generateDeveloperEncodingContent(profile);
      break;
    case "developer-decoding":
      strategy = generateDeveloperDecodingContent(profile);
      break;
    case "seo-analysis":
      strategy = generateSeoAnalysisContent(profile);
      break;
    case "seo-generation":
      strategy = generateSeoGenerationContent(profile);
      break;
    case "qr-generation":
      strategy = generateQrGenerationContent(profile);
      break;
    case "qr-scanning":
      strategy = generateProductivityContent(profile);
      break;
    case "calculator":
      strategy = generateCalculatorContent(profile);
      break;
    case "unit-conversion":
      strategy = generateUnitConversionContent(profile);
      break;
    case "productivity":
      strategy = generateProductivityContent(profile);
      break;
    default:
      strategy = generateUtilityContent(profile);
      break;
  }

  // Double check that we merge FAQs cleanly
  return strategy;
}
