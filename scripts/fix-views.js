const fs = require('fs');
const path = require('path');
const dir = 'src/components/tools/calculators/tools';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  const compName = file.replace('.tsx', '');
  const propsName = compName + 'Props';
  
  // Strip out existing interface definitions. We assume it looks like:
  // interface XXXProps { ... }
  content = content.replace(new RegExp('interface\\s+' + propsName + '\\s*\\{[\\s\\S]*?\\}', 'g'), '');
  
  // Strip out the broken export function signatures:
  // export function XXX({ ... } : XXXProps) {
  // We'll just find "export function XXX" up to the first actual line of code.
  content = content.replace(new RegExp('export\\s+function\\s+' + compName + '[\\s\\S]*?\\{\\s*(const|let|return|use)', 'g'), 'export function ' + compName + '({ toolId, title, description, article }: ' + propsName + ') {\n  $1');

  // Insert the clean interface at the top (after the last import)
  const interfaceStr = `interface ${propsName} {\n  toolId: string;\n  title: string;\n  description: string;\n  article?: string;\n}\n\n`;
  content = content.replace(/(import .*;\n)+/, '$&\n' + interfaceStr);
  
  // Clean up any remaining broken fragments from the previous bad replace.
  content = content.replace(/\s*\}\s*:\s*[A-Za-z0-9_]+Props\)\s*\{/g, '');
  content = content.replace(/, article [A-Za-z0-9_]+Props\)\s*\{/g, '');

  fs.writeFileSync(filePath, content);
}
console.log('Fixed exactly');
