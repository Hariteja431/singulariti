const fs = require('fs');
const path = require('path');

const detailsDir = path.join(__dirname, '../src/lib/tool-content/details');

// Define the missing entries directly
const imagePatch = {
  "gif-maker": {
    whyNeed: "Creating quick animated memes, banner advertisements, or product demos from a sequence of images shouldn't require downloading heavy offline video editing tools. The **GIF Maker** solves this by providing a clean, online workspace.",
    howWorks: "The tool imports your uploaded image frames, processes pixel dimensions, and compiles them client-side into a single animated GIF file using custom frame delay settings.",
    whenToUse: "Use this to create animated banner advertisements, reaction memes, or step-by-step visual guides.",
    stepByStep: [
      "Upload your separate image frames in the correct sequence.",
      "Adjust the frame delay (in milliseconds) and loop count parameters.",
      "Click generate to assemble the animated GIF in your browser.",
      "Download the completed GIF file to your device."
    ],
    advantages: [
      "Converts separate images into standard animated GIF files",
      "Customizable frame rate timing and looping options",
      "Executes 100% locally on your computer CPU"
    ],
    commonMistakes: [
      "Uploading files that are too heavy, which can cause memory lags during assembly",
      "Using varying image sizes that cause the GIF boundaries to shift awkwardly"
    ],
    faqs: [
      { q: "Can I adjust the speed of the animation?", a: "Yes, you can set custom millisecond delays between frames to speed up or slow down the loop." },
      { q: "Do my images get uploaded to a server?", a: "No. The entire compilation runs in your browser cache; your images are safe." }
    ]
  },
  "heic-to-jpg": {
    whyNeed: "Apple's default HEIC photo format is highly compressed but is not widely supported on Windows systems, older Android devices, or standard web browsers, making photo sharing a challenge.",
    howWorks: "The converter decodes the HEIC container locally and re-saves the raw pixel grid into the standard JPG format in your browser memory.",
    whenToUse: "Use this to convert iPhone HEIC photographs into universally compatible JPG images.",
    stepByStep: [
      "Select and upload your Apple HEIC photo.",
      "Click convert to initiate client-side rendering.",
      "Download the resulting JPG image file."
    ],
    advantages: [
      "Restores universal file compatibility across all operating systems",
      "Preserves original photograph resolution and metadata",
      "Processes files locally in browser RAM securely"
    ],
    commonMistakes: [
      "Expecting the conversion to fix blurry or corrupt original HEIC photos",
      "Assuming the file size will shrink, as JPG is generally less optimized than HEIC"
    ],
    faqs: [
      { q: "Is HEIC supported by Windows?", a: "Older Windows versions cannot open HEIC files without plugins. Converting to JPG ensures they open on any device." }
    ]
  }
};

const devPatch = {
  "cron-generator": {
    whyNeed: "Configuring task schedulers like Linux crontab requires writing complex 5-field CRON expressions that are highly prone to syntax mistakes.",
    howWorks: "The tool maps visual timing selections (like hours, days, and intervals) into compliant CRON syntax and decodes CRON strings into readable English sentences.",
    whenToUse: "Use this when setting up automatic server backups, database cleaning scripts, or scheduled API calls.",
    stepByStep: [
      "Select timing intervals (minutes, hours, days, months).",
      "Review the generated CRON syntax (e.g. `*/15 * * * *`).",
      "Check the plain English explanation of the schedule.",
      "Copy the CRON expression to your server configuration."
    ],
    advantages: [
      "Generates standard 5-field CRON expressions automatically",
      "Decodes CRON strings into human-readable descriptions",
      "Runs locally offline with zero latency"
    ],
    commonMistakes: [
      "Setting overlapping cron intervals that clash on servers",
      "Using non-standard cron formats that specific schedulers reject"
    ],
    faqs: [
      { q: "What is the crontab format standard?", a: "The standard format has 5 fields representing: Minute, Hour, Day of Month, Month, and Day of Week." }
    ]
  },
  "password-generator": {
    whyNeed: "Using simple, predictable passwords or repeating credentials across websites is a major security risk that leads to easy account compromises.",
    howWorks: "The generator utilizes cryptographically secure browser random APIs to compile password strings matching your character settings.",
    whenToUse: "Use this to create strong credentials for new logins, database keys, or server root access.",
    stepByStep: [
      "Set your desired password length (recommended 12+ characters).",
      "Select character groups (uppercase, lowercase, numbers, symbols).",
      "Generate and copy the secure random password."
    ],
    advantages: [
      "Generates cryptographically secure passwords on-device",
      "Customizable character composition constraints",
      "Zero server interaction, ensuring your passwords are never logged"
    ],
    commonMistakes: [
      "Creating short passwords under 8 characters that are vulnerable to brute-force attacks",
      "Forgetting to save the generated password before closing the browser tab"
    ],
    faqs: [
      { q: "How does the tool ensure randomness?", a: "It uses the Web Crypto API's random number generator, which is designed for cryptographic purposes." }
    ]
  },
  "bcrypt-generator": {
    whyNeed: "Developers must hash user passwords before storing them in databases to prevent credentials leakage in case of database hacks.",
    howWorks: "The tool runs the Blowfish Bcrypt hashing algorithm locally with custom salt rounds, and includes a verification dashboard to test passwords.",
    whenToUse: "Use this to generate secure user password hashes for databases or verify login credentials during testing.",
    stepByStep: [
      "Type the password string to hash.",
      "Adjust the cost factor salt rounds (default 10).",
      "Click generate to calculate the secure hash or verify existing hashes."
    ],
    advantages: [
      "Generates standard Blowfish Bcrypt hashes securely",
      "Includes a direct verification tool to test passwords against hashes",
      "Operates 100% offline in browser memory"
    ],
    commonMistakes: [
      "Setting cost factors too low, making hashes easier to brute-force",
      "Confusing Bcrypt hashing (one-way) with decryption (two-way)"
    ],
    faqs: [
      { q: "Can a Bcrypt hash be decrypted?", a: "No. Bcrypt is a one-way cryptographic hash function. It cannot be decrypted back to plain text; it can only be verified by matching." }
    ]
  },
  "css-gradient-generator": {
    whyNeed: "Writing CSS code declarations with multiple color stops, angles, and types manually is tedious and difficult to visualize.",
    howWorks: "The tool provides interactive slider stops to build gradients and outputs clean, cross-browser CSS background-image declarations.",
    whenToUse: "Use this to design buttons, background headers, and custom borders for modern web interfaces.",
    stepByStep: [
      "Add and drag color stop nodes on the visual gradient bar.",
      "Select gradient type (linear, radial, conic) and customize the angle.",
      "Copy the generated CSS background-image code."
    ],
    advantages: [
      "Interactive visual color stop controls",
      "Generates cross-browser compatible CSS code declarations",
      "Runs locally in browser RAM instantly"
    ],
    commonMistakes: [
      "Overcomplicating layouts by adding too many conflicting color stops",
      "Forgetting to set fallback solid colors for legacy browser compatibility"
    ],
    faqs: [
      { q: "Does it support alpha transparency?", a: "Yes, you can configure the opacity of each color node using RGBA stops." }
    ]
  },
  "css-box-shadow": {
    whyNeed: "Determining horizontal offsets, blur spreads, and opacity levels for CSS box-shadows visually is much faster than guessing code numbers.",
    howWorks: "The generator renders box shadows in real-time as you adjust sliders, outputting clean, copy-paste CSS code.",
    whenToUse: "Use this to add depth, elevation, and 3D shadows to cards, buttons, and panels in web designs.",
    stepByStep: [
      "Adjust sliders for horizontal offset, vertical offset, blur, and spread.",
      "Configure shadow colors and toggle inset styles.",
      "Copy the completed CSS box-shadow declaration."
    ],
    advantages: [
      "Real-time visual preview of shadow depth and styling",
      "Outputs clean, standardized CSS box-shadow code blocks",
      "Processed locally with zero network delays"
    ],
    commonMistakes: [
      "Creating harsh, high-opacity shadows that look unpolished",
      "Setting spread values too high, creating blurry, messy layouts"
    ],
    faqs: [
      { q: "What is an inset shadow?", a: "An inset shadow is drawn inside the boundaries of the element rather than outside, creating a recessed or pressed look." }
    ]
  },
  "color-contrast-checker": {
    whyNeed: "Websites must meet Web Content Accessibility Guidelines (WCAG) to ensure text readability for users with visual impairments.",
    howWorks: "The tool calculates relative luminance of foreground and background colors and evaluates contrast ratios against WCAG AA and AAA rules.",
    whenToUse: "Use this to audit website colors, check accessibility compliance, and design readable UI templates.",
    stepByStep: [
      "Input or pick your text (foreground) color.",
      "Input or pick your background color.",
      "Check pass/fail status for AA and AAA accessibility standards."
    ],
    advantages: [
      "Verifies compliance with WCAG AA and AAA standards",
      "Calculates exact contrast ratio scores (e.g., 4.5:1)",
      "Runs locally in browser memory securely"
    ],
    commonMistakes: [
      "Ignoring contrast checks for small text, which requires higher contrast ratios than large text",
      "Assuming high contrast on screen translates identically to printed designs"
    ],
    faqs: [
      { q: "What is the minimum ratio for WCAG AA?", a: "Normal text requires a contrast ratio of at least 4.5:1, while large text (18pt+) requires at least 3:1." }
    ]
  },
  "svg-optimizer": {
    whyNeed: "Design tools export SVG vector files with redundant metadata, comments, and bloated structures that increase web loading weight.",
    howWorks: "The optimizer parses SVG XML tags, strips editor elements, simplifies path coordinates, and minifies markup code client-side.",
    whenToUse: "Use this to optimize website vector logos, clean exported Figma icons, and minify SVGs for inline coding.",
    stepByStep: [
      "Select your SVG vector file or paste raw SVG XML markup.",
      "Select optimization parameters like stripping comments.",
      "Download the minified SVG file or copy the clean code."
    ],
    advantages: [
      "Strips Figma, Sketch, and Adobe metadata tags cleanly",
      "Optimizes coordinate decimals to shrink SVG size",
      "Runs entirely on your machine CPU for secure vector assets"
    ],
    commonMistakes: [
      "Setting path decimal precision too low, causing vector shapes to distort",
      "Optimizing already minified SVGs expecting further size drops"
    ],
    faqs: [
      { q: "Will my vector lines remain sharp?", a: "Yes, SVGs scale mathematically. Optimization only minifies code representation without degrading rendering quality." }
    ]
  },
  "pdf-image-extractor": {
    whyNeed: "Saving specific photographs or illustrations embedded inside a PDF page-by-page manually is slow and degrades image resolution.",
    howWorks: "The extractor parses PDF binary directories to isolate embedded image streams and downloads them client-side in their original formats.",
    whenToUse: "Use this to extract illustrations from digital ebooks, grab product photos from catalogs, or save scanned document sheets.",
    stepByStep: [
      "Upload your PDF document.",
      "Wait for the local extraction script to parse the file.",
      "Download extracted images individually or as a unified ZIP package."
    ],
    advantages: [
      "Extracts original embedded images from PDF sheets directly",
      "Downloads images grouped in a single ZIP archive",
      "Runs 100% client-side privately"
    ],
    commonMistakes: [
      "Attempting to extract text elements as images; the tool only targets embedded raster images",
      "Extracting images from highly compressed PDFs where the source images are low resolution"
    ],
    faqs: [
      { q: "Can I extract images from scanned PDFs?", a: "If the PDF consists of scanned pages, each full page is treated as an image and can be extracted." }
    ]
  }
};

function insertEntries(fileName, patchMap) {
  const filePath = path.join(detailsDir, fileName);
  let content = fs.readFileSync(filePath, 'utf8');

  // Find the last closing };
  const lastIndex = content.lastIndexOf('};');
  if (lastIndex === -1) {
    console.error(`Could not find closing }; in ${fileName}`);
    return;
  }

  let suffix = '';
  for (const [id, data] of Object.entries(patchMap)) {
    suffix += `,\n  "${id}": {\n`;
    suffix += `    whyNeed: ${JSON.stringify(data.whyNeed)},\n`;
    suffix += `    howWorks: ${JSON.stringify(data.howWorks)},\n`;
    suffix += `    whenToUse: ${JSON.stringify(data.whenToUse)},\n`;
    suffix += `    stepByStep: ${JSON.stringify(data.stepByStep)},\n`;
    suffix += `    advantages: ${JSON.stringify(data.advantages)},\n`;
    suffix += `    commonMistakes: ${JSON.stringify(data.commonMistakes)},\n`;
    suffix += `    faqs: ${JSON.stringify(data.faqs)}\n`;
    suffix += `  }`;
  }

  content = content.substring(0, lastIndex) + suffix + '\n};';
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Successfully appended entries to ${fileName}`);
}

insertEntries('imageDb.ts', imagePatch);
insertEntries('devDb.ts', devPatch);
