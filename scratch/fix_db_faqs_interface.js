const fs = require('fs');
const path = require('path');

const detailsDir = path.join(__dirname, '../src/lib/tool-content/details');
const files = [
  'calculatorsDb.ts',
  'convertDb.ts',
  'devDb.ts',
  'imageDb.ts',
  'pdfDb.ts',
  'qrDb.ts',
  'seoDb.ts',
  'textDb.ts'
];

for (const file of files) {
  const filePath = path.join(detailsDir, file);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${file}`);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  // Replace:
  // faqs: { question: string; answer: string }[];
  // with:
  // faqs: { q: string; a: string }[];
  const target = 'faqs: { question: string; answer: string }[];';
  const replacement = 'faqs: { q: string; a: string }[];';
  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated interface in ${file}`);
  } else {
    console.log(`No target found in ${file}`);
  }
}
