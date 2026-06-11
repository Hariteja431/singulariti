const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const allFiles = walk(path.join(__dirname, '..', 'src', 'app', 'tools'))
  .concat(walk(path.join(__dirname, '..', 'src', 'components', 'tools')));

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Fix missing imports in page.tsx that use fs/path
  if (file.includes('page.tsx')) {
    if (content.includes('fs.') && !content.includes("import fs from")) {
      content = "import fs from 'fs';\n" + content;
      changed = true;
    }
    if (content.includes('path.') && !content.includes("import path from")) {
      content = "import path from 'path';\n" + content;
      changed = true;
    }
  }

  // Fix missing article in ContainerProps
  if (file.includes('Container.tsx')) {
    const interfaceRegex = /(interface\s+[A-Za-z0-9_]+ContainerProps\s*\{[\s\S]*?)(\})/m;
    if (interfaceRegex.test(content)) {
      content = content.replace(interfaceRegex, (match, p1, p2) => {
        if (!p1.includes('article?:')) {
          changed = true;
          return p1 + '  article?: string;\n' + p2;
        }
        return match;
      });
    }

    const exportRegex = /(export\s+function\s+[A-Za-z0-9_]+Container\s*\(\s*\{)([^}]+)(\}\s*:\s*[A-Za-z0-9_]+ContainerProps\s*\))/m;
    if (exportRegex.test(content)) {
      content = content.replace(exportRegex, (match, p1, p2, p3) => {
        if (!p2.includes('article')) {
          changed = true;
          return p1 + p2.trim() + ', article ' + p3;
        }
        return match;
      });
    }

    // Add article prop to ToolLayout if not present
    if (content.includes('<ToolLayout') && !content.includes('article={article || content.article}')) {
      content = content.replace(/(<ToolLayout[^>]*)(>)/, (match, p1, p2) => {
        changed = true;
        return p1 + '\n      article={article || content.article}' + p2;
      });
    }
  }

  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Fixed ${file}`);
  }
}
