export interface QualityIssue {
  type: string;
  targetSlug: string;
  similarityScore: number;
  message: string;
}

export interface ToolArticleData {
  slug: string;
  title: string;
  content: string;
  paragraphs: string[];
  faqs: { question: string; answer: string }[];
  relatedTools: string[];
}

function normalizeText(text: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function calculateJaccard(a: string, b: string): number {
  const normA = normalizeText(a);
  const normB = normalizeText(b);
  if (!normA || !normB) return 0;

  const wordsA = new Set(normA.split(" "));
  const wordsB = new Set(normB.split(" "));

  const intersection = new Set([...wordsA].filter(x => wordsB.has(x)));
  const union = new Set([...wordsA, ...wordsB]);

  return union.size === 0 ? 0 : intersection.size / union.size;
}

export function runToolQualityAudit(articles: ToolArticleData[]): { slug: string; title: string; issues: QualityIssue[] }[] {
  const report: { slug: string; title: string; issues: QualityIssue[] }[] = [];

  for (let i = 0; i < articles.length; i++) {
    const artA = articles[i];
    const issues: QualityIssue[] = [];

    for (let j = 0; j < articles.length; j++) {
      if (i === j) continue;
      const artB = articles[j];

      // 1. Check if the entire content is > 85% similar after basic normalization
      const overallSim = calculateJaccard(artA.content, artB.content);
      if (overallSim > 0.85) {
        issues.push({
          type: "keyword-swapped-template",
          targetSlug: artB.slug,
          similarityScore: overallSim,
          message: `Overall article content is too similar (${(overallSim * 100).toFixed(1)}%) suggesting keyword-swapped templates.`
        });
      }

      // 2. Check for identical non-header paragraphs
      let identicalParagraphs = 0;
      artA.paragraphs.forEach(pA => {
        if (pA.length < 50) return; // skip headers or short blocks
        const hasMatch = artB.paragraphs.some(pB => {
          return pB.length > 50 && calculateJaccard(pA, pB) > 0.80;
        });
        if (hasMatch) identicalParagraphs++;
      });

      if (identicalParagraphs > 2) {
        issues.push({
          type: "duplicate-paragraphs",
          targetSlug: artB.slug,
          similarityScore: identicalParagraphs / artA.paragraphs.length,
          message: `Found ${identicalParagraphs} highly similar/duplicate paragraphs.`
        });
      }

      // 3. Check for identical FAQ entries
      let faqMatches = 0;
      artA.faqs.forEach(fA => {
        const hasMatch = artB.faqs.some(fB => {
          const qSim = calculateJaccard(fA.question, fB.question);
          const aSim = calculateJaccard(fA.answer, fB.answer);
          return qSim > 0.70 && aSim > 0.70;
        });
        if (hasMatch) faqMatches++;
      });

      if (faqMatches > 2 && artA.faqs.length > 0) {
        issues.push({
          type: "faq-similarity",
          targetSlug: artB.slug,
          similarityScore: faqMatches / artA.faqs.length,
          message: `Found ${faqMatches} identical or highly similar FAQs.`
        });
      }

      // 4. Check for identical related tools lists
      if (artA.relatedTools.length > 0 && artB.relatedTools.length > 0) {
        const matches = artA.relatedTools.filter(t => artB.relatedTools.includes(t));
        if (matches.length === artA.relatedTools.length && artA.relatedTools.length >= 3) {
          issues.push({
            type: "identical-related-tools",
            targetSlug: artB.slug,
            similarityScore: 1.0,
            message: "List of related tools is identical."
          });
        }
      }
    }

    if (issues.length > 0) {
      report.push({
        slug: artA.slug,
        title: artA.title,
        issues
      });
    }
  }

  return report;
}
