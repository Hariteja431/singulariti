const fs = require('fs');
const path = require('path');

const registryPath = path.join(__dirname, '..', 'src', 'content', 'tools', 'toolRegistry.ts');
const fileContent = fs.readFileSync(registryPath, 'utf8');
const registryMatch = fileContent.match(/export const toolRegistry: UtilityRegistryItem\[\] = (\[[\s\S]*?\]);/);
if (!registryMatch) {
  console.error("Could not find toolRegistry in file.");
  process.exit(1);
}

let registryText = registryMatch[1]
  .replace(/\/\/.*$/gm, '')
  .replace(/\/\*[\s\S]*?\*\//g, '');

const toolRegistry = eval(registryText);
console.log("Total tools:", toolRegistry.length);

const categories = {};
toolRegistry.forEach(t => {
  categories[t.sectionId] = (categories[t.sectionId] || 0) + 1;
});
console.log("Categories breakdown:", categories);
