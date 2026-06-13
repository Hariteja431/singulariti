import fs from 'fs';
import path from 'path';
import { runToolQualityAudit, ToolArticleData } from '../src/lib/tool-content/toolContentQuality';

const articlesDir = path.join(__dirname, '..', 'src', 'content', 'articles');

if (!fs.existsSync(articlesDir)) {
  console.log("No articles directory found.");
  process.exit(0);
}

const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.md'));

const articlesData: ToolArticleData[] = [];

for (const file of files) {
  const filePath = path.join(articlesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Parse paragraphs
  const rawParagraphs = content.split('\n\n');
  const paragraphs = rawParagraphs.filter(p => {
    const trimmed = p.trim();
    return trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('-') && !/^\d+\./.test(trimmed);
  });
  
  // Parse FAQs
  const faqs: { question: string; answer: string }[] = [];
  const faqLines = content.split('\n');
  let currentFaq: { question: string; answer: string } | null = null;
  for (const line of faqLines) {
    if (line.startsWith('### ')) {
      if (currentFaq) faqs.push(currentFaq);
      currentFaq = { question: line.replace('### ', '').trim(), answer: '' };
    } else if (currentFaq) {
      if (line.trim()) {
        currentFaq.answer += (currentFaq.answer ? '\n' : '') + line.trim();
      }
    }
  }
  if (currentFaq) faqs.push(currentFaq);
  
  // Parse related tools
  const relatedTools: string[] = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    relatedTools.push(match[2]);
  }
  
  articlesData.push({
    slug: file.replace('.md', ''),
    title: file.replace('.md', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    content,
    paragraphs,
    faqs,
    relatedTools
  });
}

console.log(`Auditing ${articlesData.length} tool articles...`);
const warnings = runToolQualityAudit(articlesData);

const reportsDir = path.join(__dirname, '..', 'reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}
const reportPath = path.join(reportsDir, 'tool-quality-report.json');
fs.writeFileSync(reportPath, JSON.stringify(warnings, null, 2), 'utf8');

console.log(`\nTool Quality audit completed successfully!`);
console.log(`Total warning pairs: ${warnings.length}`);
console.log(`Detailed report written to: ${reportPath}`);

if (warnings.length > 0) {
  console.log("\n--- Top Warnings ---");
  warnings.slice(0, 20).forEach((w, idx) => {
    console.log(`\n[${idx + 1}] Article: ${w.slug}`);
    w.issues.forEach(iss => {
      console.log(`    - Type: ${iss.type} | Target: ${iss.targetSlug}`);
      console.log(`      Message: ${iss.message}`);
    });
  });
} else {
  console.log("\nExcellent! Zero repeated content warnings found.");
}
