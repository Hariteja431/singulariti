const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'src'));

let replacedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Fix shadowing:
  // catch (e) { const err = e as Error;  --> if err was actually e, it produced catch (e) { const e = e as Error;
  // We want catch (_err) { const $1 = _err as Error;
  
  content = content.replace(/catch\s*\(\s*([a-zA-Z0-9_]+)\s*\)\s*\{\s*const\s+\1\s*=\s*\1\s*as\s*Error;/g, 'catch (_$1) { const $1 = _$1 as Error;');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    replacedCount++;
  }
});

console.log(`Successfully fixed shadowing in ${replacedCount} files.`);
