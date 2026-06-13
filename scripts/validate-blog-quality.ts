import fs from 'fs';
import path from 'path';
import { runQualityCheckOnly } from '../src/lib/blog';

// Check quality mode: "off" | "warn" | "strict"
const mode = process.env.BLOG_QUALITY_MODE ?? "warn";

console.log(`Running Blog Quality validation in "${mode}" mode...`);

if (mode === "off") {
  console.log("Validation is disabled (BLOG_QUALITY_MODE=off).");
  process.exit(0);
}

const rawResults = runQualityCheckOnly();

// Group issues by unique article pair (A vs B, sorted alphabetically to avoid A vs B and B vs A duplicate reporting)
interface PairWarning {
  articleA: string;
  articleB: string;
  introSimilarity: number;
  summarySimilarity: number;
  faqSimilarity: number;
  keywordSwapped: boolean;
  messages: string[];
}

const pairWarnings = new Map<string, PairWarning>();

rawResults.forEach(item => {
  const { sourceSlug, sourceTitle, issues } = item;
  
  issues.forEach((issue: any) => {
    const slugA = sourceSlug;
    const slugB = issue.targetSlug;
    const sortedSlugs = [slugA, slugB].sort();
    const pairKey = sortedSlugs.join(" vs ");
    
    let pair = pairWarnings.get(pairKey);
    if (!pair) {
      pair = {
        articleA: sortedSlugs[0],
        articleB: sortedSlugs[1],
        introSimilarity: 0,
        summarySimilarity: 0,
        faqSimilarity: 0,
        keywordSwapped: false,
        messages: []
      };
      pairWarnings.set(pairKey, pair);
    }
    
    // Track messages
    if (!pair.messages.includes(issue.message)) {
      pair.messages.push(issue.message);
    }
    
    // Assign values based on issue type
    if (issue.type === "intro-similarity") {
      pair.introSimilarity = Math.max(pair.introSimilarity, issue.similarityScore);
    } else if (issue.type === "summary-similarity") {
      pair.summarySimilarity = Math.max(pair.summarySimilarity, issue.similarityScore);
    } else if (issue.type === "faq-similarity") {
      pair.faqSimilarity = Math.max(pair.faqSimilarity, issue.similarityScore);
    } else if (issue.type === "keyword-swapped-template") {
      pair.keywordSwapped = true;
    }
  });
});

// Convert map to array and sort by severity (max similarity score first)
const sortedPairs = Array.from(pairWarnings.values()).sort((a, b) => {
  const maxA = Math.max(a.introSimilarity, a.summarySimilarity, a.faqSimilarity, a.keywordSwapped ? 0.9 : 0);
  const maxB = Math.max(b.introSimilarity, b.summarySimilarity, b.faqSimilarity, b.keywordSwapped ? 0.9 : 0);
  return maxB - maxA;
});

const totalWarningsCount = sortedPairs.length;

// Save full report to reports/blog-quality-report.json
const reportsDir = path.join(process.cwd(), 'reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}
const reportPath = path.join(reportsDir, 'blog-quality-report.json');
fs.writeFileSync(reportPath, JSON.stringify(sortedPairs, null, 2), 'utf-8');

console.log(`\nSuccessfully validated all generated blog articles.`);
console.log(`Total duplicate/similarity warning pairs detected: ${totalWarningsCount}`);
console.log(`Full detailed quality report written to: ${reportPath}`);

// Display top 50 warnings in the console
const limit = 50;
const displayedPairs = sortedPairs.slice(0, limit);

if (displayedPairs.length > 0) {
  console.log(`\n--- TOP ${displayedPairs.length} SIMILARITY WARNINGS ---`);
  displayedPairs.forEach((pair, idx) => {
    const maxScore = Math.max(pair.introSimilarity, pair.summarySimilarity, pair.faqSimilarity);
    
    let fixCategory = "General Content Strategy Distinctness";
    if (pair.articleA.includes("qr") || pair.articleB.includes("qr")) {
      fixCategory = "Specific QR code content strategy properties";
    } else if (pair.articleA.includes("compress") || pair.articleB.includes("compress")) {
      fixCategory = "Format Compression Matrix parameters";
    } else if (pair.articleA.includes("to") || pair.articleB.includes("to")) {
      fixCategory = "Directional conversion matrix differences";
    } else if (pair.articleA.includes("calculator") || pair.articleB.includes("calculator")) {
      fixCategory = "Unique math equation and calculation description";
    }

    console.log(`\n[${idx + 1}] Pair: ${pair.articleA} vs ${pair.articleB}`);
    console.log(`    - Intro Similarity: ${pair.introSimilarity > 0 ? (pair.introSimilarity * 100).toFixed(1) + "%" : "Safe (<60%)"}`);
    console.log(`    - Summary Similarity: ${pair.summarySimilarity > 0 ? (pair.summarySimilarity * 100).toFixed(1) + "%" : "Safe (<60%)"}`);
    console.log(`    - FAQ Similarity: ${pair.faqSimilarity > 0 ? (pair.faqSimilarity * 100).toFixed(1) + "%" : "Safe (<50%)"}`);
    console.log(`    - Keyword-Swapped Template: ${pair.keywordSwapped ? "YES (Warning)" : "No"}`);
    console.log(`    - Suggested Fix: ${fixCategory}`);
  });
} else {
  console.log("\nNo similarity warnings detected! Content quality is excellent.");
}

// Exit logic
if (mode === "strict" && sortedPairs.some(p => Math.max(p.introSimilarity, p.summarySimilarity) > 0.90 || p.keywordSwapped)) {
  console.error("\nError: Strict blog quality validation failed due to high similarity/template swaps (>90%).");
  process.exit(1);
} else {
  process.exit(0);
}
