export interface TextContent {
  howToUse: string[];
  faqs: { question: string; answer: string; }[];
}

const contentMap: Record<string, TextContent> = {
  'word-counter': {
    howToUse: [
      "Type or paste your text into the input box.",
      "The stats update automatically as you type.",
      "Review the breakdown of Words, Characters, Lines, Sentences, and Paragraphs.",
      "Click Copy Result to save the summary details."
    ],
    faqs: [
      { question: "Is my text uploaded to a server?", answer: "No. The word counting logic executes entirely in your browser. Your data is private and secure." },
      { question: "How does it define a word?", answer: "It splits words by any whitespace sequence. Words separated by spaces, tabs, or newlines are counted separately." }
    ]
  },
  'character-counter': {
    howToUse: [
      "Paste your text into the editor.",
      "The tool calculates the total character count instantly.",
      "It displays two metrics: Characters including spaces, and Characters excluding spaces.",
      "Ideal for checking Twitter limits or SMS constraints."
    ],
    faqs: [
      { question: "Does a line break count as a character?", answer: "Yes, newline characters (\\n) are counted as single characters in the 'with spaces' metric." },
      { question: "Is it completely local?", answer: "Yes, absolutely zero data leaves your browser." }
    ]
  },
  'text-uppercase': {
    howToUse: [
      "Paste your lowercase or mixed-case text.",
      "The tool immediately transforms every letter to UPPERCASE.",
      "Copy the resulting loud text."
    ],
    faqs: [
      { question: "Does this affect numbers or symbols?", answer: "No, numbers, punctuation, and special symbols remain completely unchanged during case conversion." }
    ]
  },
  'text-lowercase': {
    howToUse: [
      "Paste your UPPERCASE or mixed-case text.",
      "The tool immediately transforms every letter to lowercase.",
      "Copy the resulting quiet text."
    ],
    faqs: [
      { question: "Does it support international characters?", answer: "Yes, it uses standard JavaScript locale-agnostic lowercase conversion which supports most Unicode characters." }
    ]
  },
  'capitalize-text': {
    howToUse: [
      "Paste your text into the input field.",
      "The tool will automatically capitalize the very first letter of every sentence.",
      "Copy the grammatically corrected text."
    ],
    faqs: [
      { question: "How does it know where a sentence begins?", answer: "The tool looks for standard sentence-ending punctuation (periods, exclamation marks, question marks) followed by a space." },
      { question: "Will it lowercase the rest of the sentence?", answer: "No, it only targets the first letter, leaving acronyms or proper nouns later in the sentence intact." }
    ]
  },
  'title-case': {
    howToUse: [
      "Paste your article or book title.",
      "The tool capitalizes the first letter of Every Single Word.",
      "Copy the formatted headline."
    ],
    faqs: [
      { question: "Does it ignore small words like 'and' or 'the'?", answer: "Currently, this specific tool applies a strict Capitalize Every Word format. For strict APA style title casing, manual review of conjunctions is required." }
    ]
  },
  'case-converter': {
    howToUse: [
      "Paste your text snippet.",
      "The tool simultaneously generates UPPERCASE, lowercase, and Title Case variations.",
      "Scroll down to find the exact format you need and copy it."
    ],
    faqs: [
      { question: "Why show all cases at once?", answer: "It allows developers and writers to quickly view and grab the exact string format they need without toggling buttons." }
    ]
  },
  'remove-duplicate-lines': {
    howToUse: [
      "Paste a list of items (one per line) into the editor.",
      "The tool scans the entire list and removes any exact duplicate rows.",
      "Only the first instance of each unique line is preserved.",
      "Copy the cleansed, unique list."
    ],
    faqs: [
      { question: "Is it case-sensitive?", answer: "Yes, 'Apple' and 'apple' are treated as two distinct lines and neither will be removed." },
      { question: "Does it preserve order?", answer: "Yes, the tool preserves the original vertical order of the first occurrences." }
    ]
  },
  'text-sorter': {
    howToUse: [
      "Paste an unsorted list of items (one per line).",
      "The tool instantly sorts the lines in standard alphabetical order (A-Z).",
      "Copy the newly organized list."
    ],
    faqs: [
      { question: "How does it handle numbers?", answer: "It uses standard string locale comparison, meaning '10' will appear before '2' (lexicographical sorting). Use a spreadsheet for numerical sorting." }
    ]
  },
  'remove-extra-spaces': {
    howToUse: [
      "Paste text that has messy spacing, double spaces, or irregular tabs.",
      "The tool collapses all consecutive spaces and tabs into a single space.",
      "It also collapses multiple blank lines into standard double line breaks.",
      "Copy the clean, normalized text."
    ],
    faqs: [
      { question: "Will it remove all my line breaks?", answer: "No, it safely preserves paragraph breaks but ensures you don't have massive empty gaps." }
    ]
  },
  'text-reverser': {
    howToUse: [
      "Type or paste your text.",
      "The tool flips the entire string backward instantly.",
      "Copy the reversed text."
    ],
    faqs: [
      { question: "Does it reverse words or characters?", answer: "It reverses every individual character. For example, 'Hello' becomes 'olleH'." }
    ]
  },
  'slug-generator': {
    howToUse: [
      "Type your blog post title or product name.",
      "The tool converts it into a lowercased, hyphen-separated slug.",
      "Copy the result for use in your website's URL structure."
    ],
    faqs: [
      { question: "What happens to special characters like @ or %?", answer: "All non-alphanumeric characters are completely stripped out to ensure the resulting URL is clean and safe." }
    ]
  },
  'find-replace': {
    howToUse: [
      "Paste your source text into the main editor.",
      "Enter the exact text you want to find in the 'Find Text' box.",
      "Enter the replacement text in the 'Replace With' box.",
      "Click 'Replace All' to execute a global replacement."
    ],
    faqs: [
      { question: "Is this replacement case-sensitive?", answer: "Yes, the tool looks for the exact string casing you provide in the Find box." },
      { question: "Can I use Regular Expressions?", answer: "Currently, this performs a literal string replacement. Regex support is planned for future updates." }
    ]
  },
  'text-compare': {
    howToUse: [
      "Enter the original text in the first input box.",
      "Enter the modified text in the second input box.",
      "Select a comparison mode: Line, Word, or Character from the dropdown.",
      "Click 'Compare Texts' to view the differences with color coding."
    ],
    faqs: [
      { question: "How does Text Compare highlight differences?", answer: "In line mode, it aligns lines horizontally. In word mode, it highlights individual additions (+green) and deletions (-red) inline. In character mode, it shows the exact position of replaced letters." },
      { question: "What does the Similarity Percentage mean?", answer: "It is a mathematical ratio of unchanged characters vs the total length of the longest document." }
    ]
  },
  'text-diff': {
    howToUse: [
      "Enter the original text in the left input box.",
      "Enter the updated text in the right input box.",
      "Click 'Generate Diff'.",
      "View the output, where deleted lines have a minus (-) prefix, and added lines have a plus (+) prefix."
    ],
    faqs: [
      { question: "Is this the same format as Git diff?", answer: "It is a simplified line-by-line diff format inspired by Git and standard patch files." },
      { question: "Is there a size limit?", answer: "Extremely large files (e.g. 100,000 lines) may cause browser lag during calculation." }
    ]
  },
  'lorem-ipsum': {
    howToUse: [
      "Select the number of paragraphs you need using the number input.",
      "Click 'Generate Placeholder'.",
      "Copy the formatted dummy text for your design mockup."
    ],
    faqs: [
      { question: "What is Lorem Ipsum?", answer: "Lorem Ipsum is standard placeholder dummy text used in graphic, print, and web design to demonstrate visual layout without relying on meaningful content." }
    ]
  },
  'random-text': {
    howToUse: [
      "Select your preferred character length.",
      "Click 'Generate String'.",
      "Copy the generated secure random string for use as a test payload or password."
    ],
    faqs: [
      { question: "Is this cryptographically secure?", answer: "It uses standard Math.random() for generation. While great for testing and general use, it should not be used to generate critical cryptographic keys." }
    ]
  }
};

export function getTextContent(toolId: string): TextContent {
  const data = contentMap[toolId];
  if (data) return data;
  return {
    howToUse: [
      "Paste your text into the input field.",
      "Observe the auto-generated output update instantly.",
      "Click Copy Result to copy the output to your clipboard."
    ],
    faqs: [
      { question: "Is this tool free?", answer: "Yes, all Singulariti tools are 100% free with no usage limits." },
      { question: "Does this save any data?", answer: "No, all actions happen inside your local browser. No data is stored or transmitted." }
    ]
  };
}
