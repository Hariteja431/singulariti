const fs = require('fs');
const path = require('path');

const dir = 'src/components/tools/calculators/tools';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Step 1: Find the interface and append "article?: string;"
  const interfaceRegex = /(interface\s+[A-Za-z0-9_]+Props\s*\{[\s\S]*?)(\})/m;
  if (interfaceRegex.test(content)) {
    content = content.replace(interfaceRegex, (match, p1, p2) => {
      if (!p1.includes('article?:')) {
        return p1 + '  article?: string;\n' + p2;
      }
      return match;
    });
  }

  // Step 2: Find the component export and add "article" to the destructuring.
  const exportRegex = /(export\s+function\s+[A-Za-z0-9_]+\s*\(\s*\{)([^}]+)(\}\s*:\s*[A-Za-z0-9_]+Props\s*\))/m;
  if (exportRegex.test(content)) {
    content = content.replace(exportRegex, (match, p1, p2, p3) => {
      if (!p2.includes('article')) {
        return p1 + p2.trim() + ', article ' + p3;
      }
      return match;
    });
  }

  // Step 3: Pass "article={article}" by looking for "onClearError={onClearError}"
  const targetProp = 'onClearError={onClearError}';
  if (content.includes(targetProp) && !content.includes('article={article}')) {
    content = content.replace(targetProp, targetProp + '\n      article={article}');
  }

  fs.writeFileSync(filePath, content);
}

console.log('Successfully updated all calculator views (Safe Method).');
