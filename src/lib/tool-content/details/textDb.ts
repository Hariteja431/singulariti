// Tool Details Database for text category
export interface ToolDetailEntry {
  whyNeed: string;
  howWorks: string;
  whenToUse: string;
  stepByStep: string[];
  advantages: string[];
  commonMistakes: string[];
  faqs: { q: string; a: string }[];
}

export const textDetailsDb: Record<string, ToolDetailEntry> = {
  "word-counter": {
    whyNeed: "Adhering to strict essay word counts or social media caps requires a live counter.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine tokenizes string inputs and counts word boundaries using regex for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Word Counter** when you need to count words, characters, and reading times in text during writing articles, checking essay lengths, and drafting social posts.",
    stepByStep: ["Type or paste your copy into the text area.","Review word, character, and sentence counts updated instantly.","Check estimated reading and speaking times."],
    advantages: ["Calculates statistics in real-time as you type","Provides estimated reading and speaking speed indicators","Runs client-side privately"],
    commonMistakes: ["Counting spaces or special formatting characters as words"],
    faqs: [{"q":"How is reading time estimated?","a":"It assumes an average adult reading speed of 200 to 250 words per minute."}]
  },
  "character-counter": {
    whyNeed: "Social media and metadata tags enforce strict character caps.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine counts character lengths in text inputs for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Character Counter** when you need to count characters with and without spaces during drafting tweets, writing meta tags, and formatting descriptions.",
    stepByStep: ["Paste your text into the editor.","Check character counts with and without spaces."],
    advantages: ["Shows character counts both including and excluding spaces","Includes percentage progress bars for common social platforms","Runs offline securely"],
    commonMistakes: ["Ignoring space limits when copy-pasting text into strict portals"],
    faqs: [{"q":"Are line breaks counted as characters?","a":"Yes, standard carriage returns and line breaks count as 1 or 2 characters depending on the OS standard."}]
  },
  "case-converter": {
    whyNeed: "Correcting mixed case errors in headings or lists manually takes too much time.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine applies case-conversion transformations to text string blocks for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Case Converter** when you need to convert text between uppercase, lowercase, sentence, and title casing during formatting headings, fixing accidentally locked uppercase caps, and organizing lists.",
    stepByStep: ["Paste your text block.","Select casing style (UPPERCASE, lowercase, Title Case, Sentence case).","Copy the converted text output."],
    advantages: ["Converts text casing instantly","Preserves paragraph and spacing structures","Processed client-side safely"],
    commonMistakes: ["Converting code scripts, which can break syntax keywords"],
    faqs: [{"q":"Does Title Case capitalize all words?","a":"Standard Title Case capitalizes main words while keeping small prepositions (like 'of', 'and', 'the') in lowercase."}]
  },
  "remove-duplicate-lines": {
    whyNeed: "Cleaning duplicated lists, logs, or emails manually is slow and error-prone.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine filters arrays to keep unique line entries client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Remove Duplicate Lines** when you need to remove duplicate lines and rows from lists during deduplicating mail lists, filtering data dumps, and cleaning codes.",
    stepByStep: ["Paste your list or text into the input box.","Click remove duplicates.","Copy the cleaned unique list."],
    advantages: ["Purges identical list entries in one click","Supports case-sensitive and case-insensitive matching","Runs locally in RAM securely"],
    commonMistakes: ["Removing duplicates on code files where matching lines are required"],
    faqs: [{"q":"Is the list re-sorted?","a":"No, the tool preserves the original order of the remaining unique lines."}]
  },
  "text-sorter": {
    whyNeed: "Organizing massive list data manually is tedious.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine applies array sort algorithms on line-break arrays for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Text Sorter** when you need to sort lists alphabetically, numerically, or in reverse during alphabetizing name lists, sorting numerical values, and reversing queues.",
    stepByStep: ["Paste your unsorted list.","Select sorting order (A-Z, Z-A, Numeric).","Copy the sorted list."],
    advantages: ["Sorts lists alphabetically and numerically","Includes options to ignore capitalization","Processed client-side securely"],
    commonMistakes: ["Sorting structured records without grouping, which mixes up columns"],
    faqs: [{"q":"Does it support sorting numbers?","a":"Yes, it evaluates values numerically instead of alphabetically to prevent '10' coming before '2'."}]
  },
  "text-compare": {
    whyNeed: "Isolating edits between two drafts manually is slow and prone to oversights.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine runs diff matching algorithms in-browser to isolate line and character changes for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Text Compare** when you need to compare two text versions and highlight differences during checking draft contracts, verifying code changes, and comparing editing revisions.",
    stepByStep: ["Paste the original text on the left.","Paste the revised text on the right.","Review highlighted deletions (red) and additions (green)."],
    advantages: ["Highlights inline character-level changes","Supports side-by-side and unified views","Runs entirely client-side privately"],
    commonMistakes: ["Comparing completely different files, which results in messy highlights"],
    faqs: [{"q":"Are spaces compared?","a":"Yes, you can toggle settings to ignore or highlight whitespace changes."}]
  },
  "text-diff": {
    whyNeed: "Tracking subtle revisions across versions manually is tedious.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine applies character-level diff logic client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Text Diff Checker** when you need to detect line edits and revisions in drafts during code inspections, copy editing reviews, and contract audits.",
    stepByStep: ["Paste the base draft in the first editor.","Paste the revised draft in the second editor.","Inspect highlighted changes."],
    advantages: ["Detects insertions, deletions, and inline edits","Processes text instantly","Zero server risks"],
    commonMistakes: ["Pasting massive text files above 5MB, which can slow down browser rendering"],
    faqs: [{"q":"Does this save my text?","a":"No, it processes everything in volatile memory, ensuring private text remains secure."}]
  },
  "remove-extra-spaces": {
    whyNeed: "Messy copy containing double spacing, trailing tabs, or extra line padding distort web layouts.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine runs regex replace functions to trim whitespace borders and collapse spaces for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Remove Extra Spaces** when you need to clean up redundant spacing, tabs, and line breaks during cleaning raw OCR scans, formatting copied text, and cleanup code indents.",
    stepByStep: ["Paste your text.","Select cleanup options (strip extra spaces, strip tab indents, collapse empty lines).","Copy the cleaned text."],
    advantages: ["Collapses double spacing into single spaces","Trims leading and trailing paragraph spacing","Runs offline securely"],
    commonMistakes: ["Running on code scripts where indentation is syntactically significant (like Python)"],
    faqs: [{"q":"Does it remove all line breaks?","a":"No, it only removes empty redundant line padding unless you select the option to collapse all text into a single line."}]
  },
  "line-counter": {
    whyNeed: "Auditing programming scripts or configurations requires tracking exact line counts.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine splits text blocks on newline characters and counts the array size for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Line Counter** when you need to count total lines and blank lines in text documents during checking code file heights, auditing logs, and formatting lists.",
    stepByStep: ["Paste your document text.","Check total lines, filled lines, and blank lines."],
    advantages: ["Displays both filled and blank line counts","Processes files instantly as you type","100% secure client-side calculation"],
    commonMistakes: ["Confusing wrapped lines on your screen with actual newline characters in the file"],
    faqs: [{"q":"What is a blank line?","a":"It is a line containing only spacing characters (spaces, tabs) or nothing at all."}]
  },
  "sentence-counter": {
    whyNeed: "Evaluating readability scores for articles requires tracking sentence structures.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine identifies sentence borders using punctuation regex splits client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Sentence Counter** when you need to count sentences in draft copy during checking readability indices, copywriting, and academic essay checks.",
    stepByStep: ["Paste your text copy.","Check total sentence counts and average words per sentence."],
    advantages: ["Counts sentences using punctuation markers accurately","Helps analyze copy readability","Runs offline securely"],
    commonMistakes: ["Counting abbreviations (like 'Dr.' or 'etc.') as sentence ends, which this tool tries to filter"],
    faqs: [{"q":"Does it count decimal points as sentences?","a":"The tool filters out decimals (e.g. '3.14') so they do not trigger false sentence counts."}]
  },
  "paragraph-counter": {
    whyNeed: "Formatting manuscripts or blog layouts to meet exact paragraph caps is tedious.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine splits text streams using double line breaks regex for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Paragraph Counter** when you need to count paragraph blocks in text during auditing academic drafts, blog layout checks, and manuscript formatting.",
    stepByStep: ["Paste your text blocks.","Review paragraph counts and average paragraph lengths."],
    advantages: ["Counts block paragraphs separated by empty lines","Ignores empty padding lines","Runs locally on your CPU privately"],
    commonMistakes: ["Counting single line breaks as paragraphs, which are just line returns"],
    faqs: [{"q":"How does it detect paragraphs?","a":"It looks for double line breaks (empty lines) that separate paragraphs."}]
  },
  "text-reverser": {
    whyNeed: "Reversing letters or words manually for puzzles or text conversions takes time.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine splits text strings, reverses arrays, and joins characters client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Text Reverser** when you need to reverse character order or word order in text during creating puzzles, reversing word queues, and general text play.",
    stepByStep: ["Paste your text.","Select reverse mode (reverse characters, reverse words, reverse lines).","Copy the reversed output."],
    advantages: ["Reverses characters, words, or lines","Executes instantly in browser RAM","No accounts required"],
    commonMistakes: ["Reversing structured code, which breaks syntax keywords"],
    faqs: [{"q":"Does it keep line breaks?","a":"Yes, you can choose to reverse text within each line while keeping the line structure intact."}]
  },
  "slug-generator": {
    whyNeed: "Manually formatting blog title headings to URLs is slow and error-prone.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine converts letters to lowercase, replaces spaces with hyphens, and strips special characters for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Slug Generator** when you need to convert title phrases into URL-friendly slug formats during generating blog post URLs, setting routing paths, and building links.",
    stepByStep: ["Type or paste your page title.","Customize separator character (defaults to hyphens).","Copy the clean URL slug."],
    advantages: ["Converts titles to clean, URL-safe slug strings","Strips special characters and accents automatically","Runs locally in browser RAM"],
    commonMistakes: ["Using double hyphens or forgetting to strip trailing spaces, which the tool handles safely"],
    faqs: [{"q":"What is a slug?","a":"A slug is the part of a URL that identifies a specific page in a human-readable format (e.g., 'slug-generator' in '/tools/slug-generator')."}]
  },
  "find-replace": {
    whyNeed: "Manually updating a repeated name or word in a large draft takes time.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine applies global regex replacement functions to text blocks client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Find and Replace Text** when you need to locate and replace words in text during renaming character logs, cleaning drafts, and fixing typo arrays.",
    stepByStep: ["Paste your text copy.","Type the word to find and the replacement word.","Toggle case matching options and replace text."],
    advantages: ["Supports case-sensitive and case-insensitive replaces","Supports regular expression matching rules","Processes locally securely"],
    commonMistakes: ["Replacing substrings accidentally within larger words (e.g. replacing 'cat' in 'category')"],
    faqs: [{"q":"Does it support wildcards?","a":"Yes, you can toggle Regex mode to use wildcards and regular expression patterns."}]
  },
  "text-uppercase": {
    whyNeed: "Fixing accidentally locked lowercase headings manually requires retyping.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine applies native JavaScript toUpperCase transformations to strings for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Text to Uppercase** when you need to format text characters to uppercase during formatting headings, writing highlights, and styling text.",
    stepByStep: ["Paste your text copy.","Convert and copy the uppercase text block."],
    advantages: ["Converts all letters to uppercase instantly","Preserves spacing and formatting","Processed on-device privately"],
    commonMistakes: ["Converting code elements, which breaks syntax case rules"],
    faqs: [{"q":"Are accents preserved?","a":"Yes, the tool converts accented characters to their uppercase equivalents."}]
  },
  "text-lowercase": {
    whyNeed: "Fixing accidentally locked uppercase caps manually is slow.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine applies native JavaScript toLowerCase transformations client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Text to Lowercase** when you need to convert text characters to lowercase during formatting data blocks, cleaning email lists, and fixing headings.",
    stepByStep: ["Paste your text.","Convert and copy the lowercase text block."],
    advantages: ["Converts all characters to lowercase instantly","Preserves line-break spacing","Runs locally in browser memory"],
    commonMistakes: ["Converting acronyms or proper nouns that require capitalization"],
    faqs: [{"q":"Does this affect symbols or numbers?","a":"No, only alphabetical characters are converted; numbers and symbols remain unchanged."}]
  },
  "capitalize-text": {
    whyNeed: "Formatting raw, uncapitalized transcripts manually is slow.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine identifies sentence borders and capitalizes leading characters for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Capitalize Text** when you need to capitalize the first letter of each sentence in text blocks during cleaning video transcripts, formatting essays, and drafting emails.",
    stepByStep: ["Paste your text block.","Click capitalize sentences.","Copy the formatted text."],
    advantages: ["Capitalizes first letters of sentences automatically","Handles punctuation gaps correctly","Runs offline securely"],
    commonMistakes: ["Capitalizing acronyms inside sentences incorrectly"],
    faqs: [{"q":"How does it find sentences?","a":"It looks for periods, question marks, and exclamation marks followed by spaces to detect sentence breaks."}]
  },
  "title-case": {
    whyNeed: "Formatting headers to academic or publishing standards manually is tedious.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine capitalizes major words while keeping small prepositions in lowercase for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Title Case Converter** when you need to format headings to Title Case standard during formatting blog headings, book titles, and article titles.",
    stepByStep: ["Paste your title list.","Select style standard (AP, Chicago, etc.).","Copy the title-cased headings."],
    advantages: ["Applies standard Title Case capitalization styles automatically","Leaves articles and prepositions in lowercase correctly","Processed client-side safely"],
    commonMistakes: ["Capitalizing all words including minor prepositions (e.g. 'Of', 'The') when they should remain lowercase"],
    faqs: [{"q":"What rules are used?","a":"By default, it uses standard AP/Chicago rules where words under 3 letters (like 'in', 'on', 'to') are lowercase unless they start the title."}]
  },
  "lorem-ipsum": {
    whyNeed: "Designers need placeholder text to preview layouts before final copy is ready.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine compiles standard dummy Latin paragraphs using local arrays for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Lorem Ipsum Generator** when you need to generate placeholder Lorem Ipsum text during prototyping web designs, checking layouts, and draft templates.",
    stepByStep: ["Select the number of paragraphs, sentences, or words to generate.","Click generate.","Copy the placeholder text."],
    advantages: ["Generates standard Latin dummy text lists","Flexible options for words, sentences, or paragraphs","Runs in client web tab browser cache"],
    commonMistakes: ["Forgetting to replace placeholder text with actual content before publishing websites"],
    faqs: [{"q":"What is Lorem Ipsum?","a":"It is standard placeholder text used in publishing and design to show layout structures without distracting content."}]
  },
  "random-text": {
    whyNeed: "Creating secure password strings or random test data manually is not secure.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine generates random characters using browser cryptographic APIs for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Random Text Generator** when you need to generate random text strings and passwords during generating passwords, creating test data, and puzzle setups.",
    stepByStep: ["Set length and character options (numbers, letters, symbols).","Generate and copy the random text string."],
    advantages: ["Generates cryptographically secure random strings","Customizable character pools","Runs offline securely"],
    commonMistakes: ["Forgetting to write down generated random keys or passwords before closing the tab"],
    faqs: [{"q":"Is it secure?","a":"Yes, it uses your browser's window.crypto API, which provides cryptographically strong random values."}]
  }
};
