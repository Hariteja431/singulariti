export interface SeoContent {
  howToUse: string[];
  faqs: { question: string; answer: string; }[];
}

const contentMap: Record<string, SeoContent> = {
  'meta-title-checker': {
    howToUse: [
      "Enter your proposed page title into the text box.",
      "The tool calculates the exact character length.",
      "Review the evaluation message to see if it fits Google's recommended pixel/character limits.",
      "Adjust your title until the evaluation turns green."
    ],
    faqs: [
      { question: "What is the optimal length for a Meta Title?", answer: "The optimal length is generally between 50 and 60 characters. Titles longer than 60 characters risk being truncated (cut off with ellipses) in Google search results." },
      { question: "Why is the Meta Title important?", answer: "The meta title is one of the strongest on-page ranking factors and heavily influences your Click-Through Rate (CTR) from the search engine results page." }
    ]
  },
  'meta-description-checker': {
    howToUse: [
      "Paste your drafted meta description into the input field.",
      "Check the character count displayed below the box.",
      "Ensure the length falls within the recommended 150-160 character range.",
      "Rewrite to include your primary keyword naturally."
    ],
    faqs: [
      { question: "Does a meta description affect SEO rankings?", answer: "Not directly. Google has stated that meta descriptions do not factor into their ranking algorithm. However, a compelling description drastically improves your CTR, which is a positive signal." },
      { question: "What happens if it's too long?", answer: "Search engines will cut it off with an ellipsis (...), which can result in an incomplete thought and lower click rates." }
    ]
  },
  'seo-slug-generator': {
    howToUse: [
      "Type or paste your article's title into the input box.",
      "The tool instantly converts it into a lowercased, hyphen-separated string.",
      "Special characters and extra spaces are stripped automatically.",
      "Copy the clean URL slug for your CMS."
    ],
    faqs: [
      { question: "Why should URLs use hyphens instead of underscores?", answer: "Google explicitly recommends using hyphens (-) rather than underscores (_) to separate words in URLs, as their crawlers treat hyphens as word separators." },
      { question: "Should I include stop words in my slug?", answer: "Generally, no. It's best practice to remove words like 'a', 'the', and 'and' to keep the slug short and keyword-rich." }
    ]
  },
  'seo-keyword-density': {
    howToUse: [
      "Paste your full article text into the main editor.",
      "Enter your target focus keyword or keyphrase in the 'Target Keyword' field.",
      "The tool calculates the total word count and exactly how many times the keyword appears.",
      "Review the calculated Density Percentage."
    ],
    faqs: [
      { question: "What is an ideal keyword density?", answer: "Most SEO professionals recommend a density between 1% and 2%. Going significantly higher than 3% risks triggering keyword stuffing penalties." },
      { question: "Does it match exact phrases?", answer: "Yes, the tool utilizes word-boundary regex to match your exact phrase, ensuring partial word matches (e.g., 'car' in 'carpet') aren't falsely counted." }
    ]
  },
  'seo-word-count': {
    howToUse: [
      "Paste your entire blog post or webpage content into the editor.",
      "The tool analyzes total words, characters, sentences, and paragraphs.",
      "Review the SEO evaluation message regarding your content depth.",
      "Check the estimated reading and speaking times."
    ],
    faqs: [
      { question: "How many words should a good SEO article have?", answer: "While there is no magic number, studies show that long-form content (1,000 to 2,000+ words) tends to rank better for informational queries because it covers topics comprehensively." },
      { question: "How is reading time calculated?", answer: "Reading time is estimated based on an average adult reading speed of 200 words per minute." }
    ]
  },
  'heading-structure-checker': {
    howToUse: [
      "Paste the raw HTML of your webpage into the input box.",
      "The tool parses the document and extracts all H1 through H6 tags.",
      "Review the hierarchical map to visualize your heading tree.",
      "Check the 'SEO Issues Found' section for skipped levels or missing H1s."
    ],
    faqs: [
      { question: "Can I have more than one H1?", answer: "HTML5 technically allows multiple H1s (one per section), but standard SEO best practices still strongly recommend a single, descriptive H1 per page to define the main topic." },
      { question: "Why is skipping heading levels bad?", answer: "Skipping from an H2 directly to an H4 breaks the logical document outline, which makes it harder for search engines and screen readers to understand the page structure." }
    ]
  },
  'meta-tag-generator': {
    howToUse: [
      "Fill out the Title, Description, Author, and Keywords fields.",
      "Add your Page URL and Image URL to ensure Open Graph and Twitter cards work.",
      "Click 'Generate Meta Tags'.",
      "Copy the generated HTML block and paste it inside your website's <head> section."
    ],
    faqs: [
      { question: "Are meta keywords still relevant?", answer: "No, Google officially deprecated the use of the meta keywords tag for web ranking in 2009. However, some smaller internal search engines may still utilize it." },
      { question: "What does canonical mean?", answer: "The canonical link tag tells search engines which version of a URL is the 'master' copy, preventing duplicate content issues." }
    ]
  },
  'robots-txt-generator': {
    howToUse: [
      "Specify your User Agent (use '*' for all search engines).",
      "Set an optional crawl delay to slow down aggressive bots.",
      "Paste your XML sitemap URL.",
      "List the directory paths you want to block (Disallow) from search engines.",
      "Click 'Generate' and save the output as robots.txt in your root folder."
    ],
    faqs: [
      { question: "Will Disallow hide my page from the internet?", answer: "No, it only asks polite search engine bots not to crawl the page. Anyone with the link can still visit it. Do not use robots.txt to hide sensitive data." },
      { question: "Where should this file be placed?", answer: "It must be placed at the top-level directory of your domain (e.g., https://example.com/robots.txt)." }
    ]
  },
  'sitemap-xml-generator': {
    howToUse: [
      "Enter your website's base URL (e.g., https://example.com).",
      "Select the desired change frequency and default priority.",
      "Paste a list of relative paths (one per line).",
      "Click 'Generate' to output a valid XML sitemap.",
      "Save the file as sitemap.xml and submit it to Google Search Console."
    ],
    faqs: [
      { question: "What is the purpose of an XML sitemap?", answer: "An XML sitemap acts as a roadmap for search engines, helping them discover, crawl, and index all the important pages on your site efficiently." },
      { question: "Does priority affect ranking?", answer: "No. The <priority> tag only hints to search engines how important a page is relative to *other pages on your own site*, not compared to external competitor sites." }
    ]
  },
  'open-graph-generator': {
    howToUse: [
      "Enter your Page Title, Description, and Site Name.",
      "Provide an absolute URL for your featured image.",
      "Select the object type (usually 'website' or 'article').",
      "Copy the generated meta tags and place them in your <head>."
    ],
    faqs: [
      { question: "What are Open Graph tags?", answer: "Open Graph (OG) tags are specific meta tags developed by Facebook that control how URLs are displayed when shared on social media platforms like Facebook, LinkedIn, and Discord." },
      { question: "What size should my OG Image be?", answer: "For the best display across platforms, use an image that is 1200 x 630 pixels." }
    ]
  },
  'twitter-card-generator': {
    howToUse: [
      "Fill in your Twitter handle (@username).",
      "Enter the Title and Description of the content being shared.",
      "Add a direct link to your featured image.",
      "Copy the generated Twitter meta tags to your <head>."
    ],
    faqs: [
      { question: "What is the difference between summary and summary_large_image?", answer: "A 'summary' card shows a small square thumbnail next to the text. A 'summary_large_image' card displays a prominent, full-width image above the text, resulting in much higher engagement." },
      { question: "Do I need Twitter Cards if I have Open Graph?", answer: "Twitter will fall back to Open Graph tags if Twitter-specific tags are missing, but explicitly defining Twitter cards ensures your content formats exactly as intended on X." }
    ]
  }
};

export function getSeoContent(toolId: string): SeoContent {
  const data = contentMap[toolId];
  if (data) return data;
  return {
    howToUse: [
      "Input your webpage data or parameters into the form.",
      "Adjust the specific settings required for the tag.",
      "Click Generate or wait for the automatic calculation.",
      "Copy the output for your website configuration."
    ],
    faqs: [
      { question: "Are these configurations up to date?", answer: "Yes, these tools follow modern search engine guidelines from Google and Bing." }
    ]
  };
}
