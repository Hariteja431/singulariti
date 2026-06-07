export interface DevContent {
  howToUse: string[];
  faqs: { question: string; answer: string; }[];
}

const contentMap: Record<string, DevContent> = {
  'json-formatter': {
    howToUse: [
      "Paste your minified or unformatted JSON string into the editor.",
      "The tool instantly parses and formats the JSON.",
      "Use the 'Format JSON' button if auto-format is disabled.",
      "Copy the beautified JSON or download it as a file."
    ],
    faqs: [
      { question: "Does this fix syntax errors?", answer: "No, it requires valid JSON. If there's a syntax error, the tool will alert you to the exact line causing the issue." },
      { question: "Is my JSON data kept private?", answer: "Absolutely. The formatting happens entirely in your browser using local parsing, so no data is sent to external servers." }
    ]
  },
  'json-validator': {
    howToUse: [
      "Paste your JSON payload into the input area.",
      "The validator automatically scans the string for syntax errors.",
      "If invalid, a detailed error message will highlight where the JSON breaks.",
      "If valid, it will confirm the payload is structurally sound."
    ],
    faqs: [
      { question: "Does it validate against a schema?", answer: "Currently, it validates standard JSON syntax (structural validity), ensuring keys are quoted and commas are correct." },
      { question: "Can I validate massive JSON files?", answer: "Yes, it can handle very large JSON strings up to the memory limit of your browser tab." }
    ]
  },
  'base64-encoder-decoder': {
    howToUse: [
      "Paste your plain text or Base64 string into the input area.",
      "Toggle between the 'Encode' and 'Decode' modes.",
      "The tool processes the string instantly.",
      "Click 'Copy Result' to grab the converted output."
    ],
    faqs: [
      { question: "Can it decode Base64 images?", answer: "This tool is designed for Base64 string/text decoding. Decoding a raw image string will result in gibberish text." },
      { question: "Is this secure for API keys?", answer: "Yes, because the encode/decode process is handled locally via JavaScript's btoa/atob functions without network requests." }
    ]
  },
  'url-encoder-decoder': {
    howToUse: [
      "Paste your URL or URI component into the input box.",
      "Select 'Encode' to safely convert special characters to % format.",
      "Select 'Decode' to convert % strings back to readable characters.",
      "Copy the safe string for your application."
    ],
    faqs: [
      { question: "What is URL encoding used for?", answer: "URL encoding converts characters like spaces, question marks, and ampersands into a format that can be safely transmitted over the Internet." },
      { question: "Does it encode the entire URL or just components?", answer: "It encodes the entire string provided. If you only want to encode a query parameter, paste only that parameter." }
    ]
  },
  'jwt-decoder': {
    howToUse: [
      "Paste your JSON Web Token (JWT) into the token field.",
      "The tool automatically decodes the Header and Payload sections.",
      "Review the decoded claims, expiration dates, and algorithms.",
      "The Signature remains untouched for security."
    ],
    faqs: [
      { question: "Can I verify the signature here?", answer: "No, signature verification requires your secret key. This tool only decodes the Base64-encoded Header and Payload for debugging." },
      { question: "Will my token be stolen?", answer: "No, all decoding happens completely client-side. We do not store or track your authentication tokens." }
    ]
  },
  'html-encoder-decoder': {
    howToUse: [
      "Paste your raw HTML or encoded entities into the editor.",
      "Click 'Encode' to convert brackets and symbols into HTML entities (e.g., &lt;).",
      "Click 'Decode' to revert HTML entities back to raw tags.",
      "Copy the result for safe database storage or rendering."
    ],
    faqs: [
      { question: "Why should I encode HTML?", answer: "Encoding prevents Cross-Site Scripting (XSS) attacks by treating malicious scripts as plain text rather than executable code." },
      { question: "Which characters are converted?", answer: "It targets characters with special meaning in HTML, specifically &, <, >, \", and '." }
    ]
  },
  'html-minifier': {
    howToUse: [
      "Paste your formatted HTML code into the editor.",
      "The tool instantly strips unnecessary whitespace, comments, and line breaks.",
      "Review the minified output.",
      "Copy the compressed code to optimize your website."
    ],
    faqs: [
      { question: "Does this alter my HTML logic?", answer: "No, it safely removes aesthetic spaces and developer comments without affecting the DOM structure or rendering." },
      { question: "Will it minify inline JS and CSS?", answer: "It focuses strictly on HTML nodes. For deep script minification, use dedicated JS/CSS tools." }
    ]
  },
  'css-minifier': {
    howToUse: [
      "Paste your CSS stylesheet into the input box.",
      "The tool removes spaces, newlines, and comments.",
      "Copy the minified CSS string.",
      "Use it in your production build to reduce file sizes."
    ],
    faqs: [
      { question: "How much space does this save?", answer: "Depending on how heavily commented and spaced your CSS is, minification typically reduces file size by 20% to 40%." },
      { question: "Is the process reversible?", answer: "Yes, you can run the minified CSS through a Code Beautifier to restore its readability." }
    ]
  },
  'js-minifier': {
    howToUse: [
      "Paste your raw JavaScript code into the editor.",
      "The tool automatically compresses the script by removing whitespace.",
      "Copy the minified code for deployment.",
      "Check the output for potential strict-mode syntax issues."
    ],
    faqs: [
      { question: "Does this mangle variable names?", answer: "This tool performs basic whitespace and comment stripping. It does not perform advanced AST mangling (like UglifyJS)." },
      { question: "Is this safe for production?", answer: "Yes, basic whitespace minification is highly stable and will not break valid JavaScript syntax." }
    ]
  },
  'hex-to-rgb': {
    howToUse: [
      "Enter a valid Hex color code (e.g., #FF5733 or FF5733).",
      "The tool parses the red, green, and blue values.",
      "View the exact RGB and CSS rgb() string output.",
      "Check the visual color swatch preview."
    ],
    faqs: [
      { question: "Does it support 3-digit hex codes?", answer: "Yes, 3-digit shorthand codes (like #FFF) are automatically expanded to their 6-digit equivalents (#FFFFFF)." },
      { question: "What if I enter an invalid hex?", answer: "The tool will alert you that the format is invalid and wait for a proper hex string." }
    ]
  },
  'rgb-to-hex': {
    howToUse: [
      "Enter the Red, Green, and Blue integer values (0-255).",
      "The tool converts them into a Base-16 hexadecimal string.",
      "Copy the resulting #HEX code for your CSS.",
      "Check the visual swatch to confirm the color."
    ],
    faqs: [
      { question: "What happens if I enter a number above 255?", answer: "RGB values are strictly bounded between 0 and 255. Values outside this range will throw an error." },
      { question: "Does it support alpha channels (RGBA)?", answer: "Currently, this specific tool is designed for standard solid RGB to 6-digit Hex conversion." }
    ]
  },
  'timestamp-converter': {
    howToUse: [
      "Enter a Unix timestamp (seconds or milliseconds).",
      "The tool automatically decodes it into a human-readable UTC and Local date.",
      "Alternatively, input a human-readable date to generate a timestamp.",
      "Copy the exact format you need."
    ],
    faqs: [
      { question: "Does it support milliseconds?", answer: "Yes, the tool is smart enough to detect whether your timestamp is in seconds (10 digits) or milliseconds (13 digits)." },
      { question: "Is the local time based on my computer?", answer: "Yes, the local date output relies on your browser's current timezone setting." }
    ]
  },
  'xml-formatter': {
    howToUse: [
      "Paste your raw or minified XML string into the editor.",
      "The tool parses the nodes and adds proper indentation.",
      "Review the nicely nested XML tree.",
      "Copy or download the formatted result."
    ],
    faqs: [
      { question: "What if my XML is malformed?", answer: "If the XML lacks closing tags or has syntax errors, the formatter will return an error stating that the XML could not be parsed." },
      { question: "Does it support SOAP payloads?", answer: "Yes, it formats all valid XML-based strings, including SOAP, SVG, and RSS feeds." }
    ]
  },
  'yaml-formatter': {
    howToUse: [
      "Paste your unstructured or messy YAML file.",
      "The tool re-indents and standardizes the spacing.",
      "Review the structured output to ensure key hierarchies are intact.",
      "Copy the clean YAML for your config files."
    ],
    faqs: [
      { question: "Why is YAML formatting so strict?", answer: "YAML relies entirely on whitespace indentation for its structure. This formatter ensures exactly 2 spaces per level to prevent parsing errors." },
      { question: "Can it convert JSON to YAML?", answer: "While this formatter handles native YAML, valid JSON is technically a subset of YAML, so it may parse and format JSON into YAML structure." }
    ]
  },
  'sql-formatter': {
    howToUse: [
      "Paste your long, inline SQL query into the input.",
      "The formatter identifies keywords (SELECT, FROM, WHERE) and indents them.",
      "Review the readable, multi-line query.",
      "Copy the beautified SQL for documentation or debugging."
    ],
    faqs: [
      { question: "Which SQL dialects are supported?", answer: "It supports standard ANSI SQL formatting which works perfectly for MySQL, PostgreSQL, SQL Server, and SQLite." },
      { question: "Will it change my table names?", answer: "No, it only capitalizes SQL keywords and adjusts line breaks. Your table names and data strings are preserved exactly." }
    ]
  },
  'code-beautifier': {
    howToUse: [
      "Paste your unformatted code snippet.",
      "Select the language (JavaScript, HTML, CSS).",
      "Click 'Format Code' to apply syntax-aware indentation.",
      "Copy the readable code to your IDE."
    ],
    faqs: [
      { question: "What engine powers the formatting?", answer: "The tool utilizes the industry-standard js-beautify library, running entirely in your browser." },
      { question: "Does it fix syntax errors?", answer: "No, code beautifiers require syntactically valid code to accurately determine where to place indents and line breaks." }
    ]
  },
  'markdown-previewer': {
    howToUse: [
      "Type your markdown syntax (## Headings, **bold**, *italics*) in the left editor.",
      "Watch the live HTML preview render instantly on the right.",
      "Use it to draft README files or blog posts.",
      "Copy the raw markdown when finished."
    ],
    faqs: [
      { question: "Does it support GitHub Flavored Markdown (GFM)?", answer: "Yes, it supports standard markdown along with tables, strikethroughs, and task lists." },
      { question: "Can I export the rendered HTML?", answer: "Currently, this tool is built for visual previewing, but you can inspect the DOM to extract the raw HTML." }
    ]
  }
};

export function getDevContent(toolId: string): DevContent {
  const data = contentMap[toolId];
  if (data) return data;
  return {
    howToUse: [
      "Input your code or data into the editor.",
      "Select your desired configuration options.",
      "The output will generate automatically.",
      "Copy the result for your development workflow."
    ],
    faqs: [
      { question: "Is this safe for sensitive data?", answer: "Yes, all developer tools run completely offline in your browser window." }
    ]
  };
}
