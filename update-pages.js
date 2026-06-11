const fs = require('fs');
const path = require('path');

const pageFiles = [
  'src/app/tools/text/[tool]/page.tsx',
  'src/app/tools/pdf/[tool]/page.tsx',
  'src/app/tools/convert/[tool]/page.tsx',
  'src/app/image/[tool]/page.tsx',
  'src/app/image/animation/[tool]/page.tsx',
  'src/app/tools/qr/[tool]/page.tsx',
  'src/app/tools/seo/[tool]/page.tsx'
];

for (const file of pageFiles) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  if (!content.includes('import fs')) {
    content = content.replace(/(import .*;\n)/, '$1import fs from \'fs\';\nimport path from \'path\';\n');
  }

  const containerMatch = content.match(/<([A-Z][a-zA-Z]+Container)\s+/);
  if (!containerMatch) continue;

  if (!content.includes('articlePath = path.join')) {
    const injectLogic = `
  let article = '';
  try {
    const articlePath = path.join(process.cwd(), 'src', 'content', 'articles', \`\${tool.id}.md\`);
    if (fs.existsSync(articlePath)) {
      article = fs.readFileSync(articlePath, 'utf8');
    }
  } catch (e) {
    // Ignore if not found
  }
`;
    
    content = content.replace(/if \(\!tool\) return notFound\(\);/, 'if (!tool) return notFound();\n' + injectLogic);
    content = content.replace(/toolDescription=\{tool\.description\}/, 'toolDescription={tool.description}\n      article={article || undefined}');
    
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
  }
}
