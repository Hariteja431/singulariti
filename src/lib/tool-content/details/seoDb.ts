// Tool Details Database for seo category
export interface ToolDetailEntry {
  whyNeed: string;
  howWorks: string;
  whenToUse: string;
  stepByStep: string[];
  advantages: string[];
  commonMistakes: string[];
  faqs: { q: string; a: string }[];
}

export const seoDetailsDb: Record<string, ToolDetailEntry> = {
  "meta-tag-generator": {
    whyNeed: "Writing website meta tags manually leads to syntax errors and poor search indexing.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine collects input fields and outputs structured HTML `<meta>` tags for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Meta Tag Generator** when you need to generate search engine compliant meta tags during launching website domains, writing search descriptions, and social previews.",
    stepByStep: ["Fill in website title, description, and keywords.","Set indexing directives (allow follow, allow index).","Copy the generated HTML meta tags and paste them in your `<head>` section."],
    advantages: ["Generates search engine compliant HTML meta tags","Includes social media OpenGraph tags","No registration required"],
    commonMistakes: ["Adding too many meta keywords, which search engines now ignore"],
    faqs: [{"q":"Where do I paste these tags?","a":"Paste the generated HTML code inside the `<head>` section of your website pages."}]
  },
  "meta-title-checker": {
    whyNeed: "Google truncates page titles in search results if they are too long, lowering CTR.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine calculates characters and visual pixel widths of text lines client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Meta Title Length Checker** when you need to verify meta title tags fit the Google snippet pixel length limits during auditing blog post titles, checking SEO headers, and article prep.",
    stepByStep: ["Paste your page title.","Check character counts and visual pixel progress bars.","Adjust text to fit within the green indicator boundary."],
    advantages: ["Measures title lengths in characters and Google search pixels","Shows live preview of search snippets","Runs locally in browser memory"],
    commonMistakes: ["Forgetting that capital letters consume more horizontal pixel space than lowercase ones"],
    faqs: [{"q":"What is the recommended title length?","a":"Keep titles between 50 and 60 characters (or under 600 pixels) to prevent truncation."}]
  },
  "meta-description-checker": {
    whyNeed: "Google cuts off descriptions in search results if they exceed length limits, hiding key messages.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine measures description character lengths and pixel dimensions for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Meta Description Length Checker** when you need to verify meta descriptions fit Google's search snippet limits during writing meta description copy, auditing blogs, and marketing checks.",
    stepByStep: ["Paste your meta description text.","Check character counts and pixel widths.","Review the live Google search snippet preview."],
    advantages: ["Visualizes Google search result snippet limits","Shows character and pixel width metrics","Runs offline securely"],
    commonMistakes: ["Writing descriptions under 120 characters, which may not be descriptive enough"],
    faqs: [{"q":"What is the ideal description length?","a":"Aim for 120 to 155 characters (or under 960 pixels) for optimal desktop and mobile visibility."}]
  },
  "seo-keyword-density": {
    whyNeed: "Stuffing keywords in articles triggers Google search spam penalties.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine tokenizes copy, removes common stop words, and counts keyword frequencies client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Keyword Density Checker** when you need to analyze keyword frequency density percentages in text during auditing blogs, optimizing SEO copy, and copywriting reviews.",
    stepByStep: ["Paste your article copy.","Review keyword tables sorted by frequency and density percentage.","Verify that key terms stay within target thresholds."],
    advantages: ["Analyzes keyword percentages to prevent stuffing","Filters out standard filler stop-words automatically","Processed client-side safely"],
    commonMistakes: ["Keeping keyword density above 3%, which search engines consider spammy"],
    faqs: [{"q":"What is the target keyword density?","a":"Aim to keep main keywords between 1% and 2% density for natural reading and optimal SEO."}]
  },
  "seo-slug-generator": {
    whyNeed: "URLs with spaces, punctuation, or caps look messy and harm SEO rankings.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine converts letters to lowercase, replaces spaces with hyphens, and strips special characters for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Slug Generator** when you need to generate clean SEO URLs from page titles during naming blog files, setting web paths, and formatting links.",
    stepByStep: ["Paste your post or page title.","Customize separator character options.","Copy the clean URL slug."],
    advantages: ["Converts title text to clean, URL-safe slug formats","Strips special characters and accents automatically","Runs offline in browser cache"],
    commonMistakes: ["Including dates or numbers in slugs when creating timeless evergreen content"],
    faqs: [{"q":"Should I include prepositions in URL slugs?","a":"It is best to strip short prepositions (e.g. 'a', 'the', 'of') to keep slugs short and focused."}]
  },
  "robots-txt-generator": {
    whyNeed: "Search engine crawlers waste crawl budgets indexing admin dashboards or internal folders.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine compiles website paths and crawler rules into standard robots.txt format for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Robots.txt Generator** when you need to generate robots.txt crawler directives files during setting up new domains, block admin page indexing, and setting sitemap paths.",
    stepByStep: ["Select crawler rules (Allow/Disallow).","Enter paths you wish to block from indexing.","Add your XML sitemap URL and download the robots.txt file."],
    advantages: ["Generates search-engine compliant robots.txt files","Allows custom disallow directives","Runs locally in browser RAM"],
    commonMistakes: ["Accidentally blocking your entire site by disallowing the root path '/'"],
    faqs: [{"q":"Where do I upload the robots.txt file?","a":"Upload the robots.txt file to the root directory of your website server (e.g., website.com/robots.txt)."}]
  },
  "sitemap-xml-generator": {
    whyNeed: "Search engines might miss deeper page paths if they aren't listed in an XML sitemap.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine compiles website URL lists and priority values into XML format client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Sitemap XML Generator** when you need to build XML sitemaps to assist crawler indexing during submitting new sites, auditing index paths, and building sitemaps.",
    stepByStep: ["Enter your website URLs.","Set change frequencies and priority levels.","Download the sitemap.xml file."],
    advantages: ["Generates standard XML sitemap files for Google Search Console","Supports custom priority and change frequencies","Processed offline securely"],
    commonMistakes: ["Including blocked URLs or broken redirect links in your sitemap.xml"],
    faqs: [{"q":"How many URLs can a sitemap.xml contain?","a":"A single sitemap.xml can contain up to 50,000 URLs or be 50MB in size."}]
  },
  "open-graph-generator": {
    whyNeed: "Shared links look like raw text links on Facebook or LinkedIn unless OG tags are set.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine collects metadata and formats HTML OpenGraph property tags for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Open Graph Tag Generator** when you need to generate OpenGraph HTML meta tags for social sharing during optimizing social preview cards, landing pages development, and blog indexing.",
    stepByStep: ["Enter page title, description, and preview image URL.","Select open graph card types (website, article).","Copy the generated HTML og:property tags and paste in header."],
    advantages: ["Generates standard Facebook and LinkedIn compliant OpenGraph tags","Includes instant preview display simulations","Runs locally in browser memory"],
    commonMistakes: ["Using incorrect image URL paths that prevent social cards from displaying previews"],
    faqs: [{"q":"Why are OG tags important?","a":"They tell social networks what image and title to display when someone shares your link, increasing clicks."}]
  },
  "twitter-card-generator": {
    whyNeed: "Shared website links look plain on Twitter/X without custom summary card images.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine collects card details and formats HTML twitter:property tags for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Twitter Card Generator** when you need to generate Twitter Card HTML meta tags during optimizing Twitter share cards, social media marketing, and blog launches.",
    stepByStep: ["Enter title, description, and Twitter account username.","Select card format (Summary or Summary Large Image).","Download and copy the HTML tags."],
    advantages: ["Generates Twitter/X compliant twitter:card tags","Supports Summary Large Image layout selections","Runs offline securely"],
    commonMistakes: ["Setting Twitter Card images that exceed size limits (must be under 5MB)"],
    faqs: [{"q":"How do I check if my Twitter Card works?","a":"Use official Twitter Card Validator or share the link on a test account to preview."}]
  },
  "seo-word-count": {
    whyNeed: "Google prefers comprehensive, in-depth content that fits target word count benchmarks.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine tokenizes text and calculates word densities client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Word Count for SEO** when you need to measure keyword presence and word counts for SEO articles during auditing competitor lengths, blog planning, and copywriting checks.",
    stepByStep: ["Paste your competitor or draft article text.","Check total word counts, average paragraph lengths, and keywords density.","Optimize text structure."],
    advantages: ["Specifically tailored for SEO content audits","Measures word counts and paragraph structures together","Runs locally securely"],
    commonMistakes: ["Writing thin content that doesn't answer search queries, regardless of word counts"],
    faqs: [{"q":"What is the best word count for SEO articles?","a":"There is no fixed limit, but high-ranking informational articles average 1,500 to 2,500 words depending on topic depth."}]
  },
  "heading-structure-checker": {
    whyNeed: "Skipping heading levels (like jumping from H1 to H3) confuses search crawlers and screen readers.",
    howWorks: "The browser-based application reads parameters in-memory. Specifically, the engine parses HTML layouts and maps the nesting order of H1-H6 tags client-side for high-speed operation, providing instant feedback without sending any data over the internet.",
    whenToUse: "Use the **Heading Structure Checker** when you need to analyze heading hierarchies of website code during auditing page templates, checking blog structures, and accessibility audits.",
    stepByStep: ["Paste your page HTML code snippet.","Review the visual nested hierarchy of H1-H6 heading tags.","Identify skipped heading levels flagged in red."],
    advantages: ["Visualizes the heading tag nesting hierarchy","Flags skipped levels (e.g. H2 to H4) immediately","Runs client-side privately"],
    commonMistakes: ["Having multiple H1 tags on a single page, which is not recommended for SEO"],
    faqs: [{"q":"Can a page have multiple H1 tags?","a":"It is best practice to have exactly one H1 tag per page representing the main title."}]
  }
};
