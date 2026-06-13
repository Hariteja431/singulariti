export const RUNTIME_BLOG_QUALITY_MODE: "off" | "warn" | "strict" = "off";

export interface QualityIssue {
  type: string;
  targetSlug: string;
  similarityScore: number;
  message: string;
}

export interface BlogArticleData {
  slug: string;
  title: string;
  intro: string;
  summary: string;
  faqs: { question: string; answer: string }[];
  content: string;
}

export function normalizeTextForSimilarity(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, " ") // Strip HTML tags
    .replace(/[^a-z0-9\s]/g, "") // Strip punctuation
    .replace(/\s+/g, " ") // Compress whitespace
    .trim();
}

export function calculateJaccardSimilarity(a: string, b: string): number {
  const normA = normalizeTextForSimilarity(a);
  const normB = normalizeTextForSimilarity(b);
  if (!normA || !normB) return 0;

  const wordsA = new Set(normA.split(" "));
  const wordsB = new Set(normB.split(" "));

  const intersection = new Set([...wordsA].filter(x => wordsB.has(x)));
  const union = new Set([...wordsA, ...wordsB]);

  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

export function detectKeywordSwapTemplate(contentA: string, contentB: string, keywords: string[] = []): boolean {
  if (!contentA || !contentB) return false;

  let normA = normalizeTextForSimilarity(contentA);
  let normB = normalizeTextForSimilarity(contentB);

  // Strip standard format/tool name tokens to check if the structural template is identical
  const stripKeywords = [
    "pdf", "jpg", "jpeg", "png", "webp", "svg", "word", "docx", "converter", "compressor", 
    "formatter", "beautifier", "calculator", "generator", "scanner", "text", "lorem", "ipsum",
    ...keywords.map(k => k.toLowerCase())
  ];

  const regex = new RegExp(`\\b(${stripKeywords.join("|")})\\b`, "g");
  normA = normA.replace(regex, "");
  normB = normB.replace(regex, "");

  const similarity = calculateJaccardSimilarity(normA, normB);
  // If template text is > 85% similar after removing core details, it's a template swap!
  return similarity > 0.85;
}

export function validateArticleUniqueness(
  article: BlogArticleData,
  allArticles: BlogArticleData[]
): QualityIssue[] {
  const issues: QualityIssue[] = [];

  for (const other of allArticles) {
    if (other.slug === article.slug) continue;

    // 1. Check Intro Jaccard similarity (limit 60%)
    const introSim = calculateJaccardSimilarity(article.intro, other.intro);
    if (introSim > 0.60) {
      issues.push({
        type: "intro-similarity",
        targetSlug: other.slug,
        similarityScore: introSim,
        message: `Intro similarity (${(introSim * 100).toFixed(1)}%) is above the 60% limit compared to "${other.title}"`
      });
    }

    // 2. Check Summary/Conclusion Jaccard similarity (limit 60%)
    const summarySim = calculateJaccardSimilarity(article.summary, other.summary);
    if (summarySim > 0.60) {
      issues.push({
        type: "summary-similarity",
        targetSlug: other.slug,
        similarityScore: summarySim,
        message: `Summary similarity (${(summarySim * 100).toFixed(1)}%) is above the 60% limit compared to "${other.title}"`
      });
    }

    // 3. Check FAQ similarity (limit 50%)
    let faqMatchCount = 0;
    const totalFaqs = Math.max(article.faqs.length, other.faqs.length);
    
    article.faqs.forEach(f => {
      const match = other.faqs.some(of => {
        const qSim = calculateJaccardSimilarity(f.question, of.question);
        const aSim = calculateJaccardSimilarity(f.answer, of.answer);
        return qSim > 0.60 && aSim > 0.50;
      });
      if (match) faqMatchCount++;
    });

    const faqSim = totalFaqs > 0 ? faqMatchCount / totalFaqs : 0;
    if (faqSim > 0.50) {
      issues.push({
        type: "faq-similarity",
        targetSlug: other.slug,
        similarityScore: faqSim,
        message: `FAQ similarity (${(faqSim * 100).toFixed(1)}%) is above the 50% limit compared to "${other.title}"`
      });
    }

    // 4. Check for keyword-swapped templates
    const isKeywordSwap = detectKeywordSwapTemplate(article.content, other.content);
    if (isKeywordSwap) {
      issues.push({
        type: "keyword-swapped-template",
        targetSlug: other.slug,
        similarityScore: 0.90,
        message: `Keyword-swapped template layout detected compared to "${other.title}"`
      });
    }
  }

  return issues;
}

export function validateAllGeneratedArticles(posts: any[]): { sourceSlug: string; sourceTitle: string; issues: QualityIssue[] }[] {
  const allIssues: { sourceSlug: string; sourceTitle: string; issues: QualityIssue[] }[] = [];
  
  const allForQuality = posts.map(p => {
    const sectionsText = p.sections && Array.isArray(p.sections)
      ? p.sections.map((s: any) => s.content || "").join(" ")
      : "";
    
    return {
      slug: p.slug,
      title: p.title,
      intro: p.sections?.introduction || p.sections?.find((s: any) => s.id === "intro")?.content || "",
      summary: p.sections?.conclusion || p.sections?.find((s: any) => s.id === "conclusion")?.content || "",
      faqs: p.faqs || [],
      content: p.title + " " + p.excerpt + " " + sectionsText
    };
  });

  allForQuality.forEach(p => {
    const issues = validateArticleUniqueness(p, allForQuality);
    if (issues.length > 0) {
      allIssues.push({
        sourceSlug: p.slug,
        sourceTitle: p.title,
        issues
      });
    }
  });

  return allIssues;
}
