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

  // Replace `catch (err: any) {` with `catch (e) { const err = e as Error;`
  content = content.replace(/catch\s*\(\s*err\s*:\s*any\s*\)\s*\{/g, 'catch (e) { const err = e as Error;');
  // Also handle cases where it's named something else like `catch (error: any) {`
  content = content.replace(/catch\s*\(\s*([a-zA-Z0-9_]+)\s*:\s*any\s*\)\s*\{/g, 'catch (e) { const $1 = e as Error;');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    replacedCount++;
  }
});

console.log(`Successfully patched 'any' types in ${replacedCount} files.`);
