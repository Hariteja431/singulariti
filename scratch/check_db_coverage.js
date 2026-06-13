const fs = require('fs');
const path = require('path');

const detailsDir = path.join(__dirname, '../src/lib/tool-content/details');
const registryPath = path.join(__dirname, '../src/content/tools/toolRegistry.ts');

// Load toolRegistry
const registryContent = fs.readFileSync(registryPath, 'utf8');
const registryMatch = registryContent.match(/export const toolRegistry: UtilityRegistryItem\[\] = (\[[\s\S]*?\]);/);
let toolRegistry = [];
if (registryMatch) {
  let text = registryMatch[1]
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');
  toolRegistry = eval(text);
} else {
  console.error("Could not parse toolRegistry");
  process.exit(1);
}

console.log("Total tools in registry:", toolRegistry.length);

// Load each DB
const dbs = {
  calculators: 'calculatorsDb.ts',
  convert: 'convertDb.ts',
  dev: 'devDb.ts',
  image: 'imageDb.ts',
  pdf: 'pdfDb.ts',
  qr: 'qrDb.ts',
  seo: 'seoDb.ts',
  text: 'textDb.ts'
};

const allDbKeys = new Set();
for (const [cat, file] of Object.entries(dbs)) {
  const filePath = path.join(detailsDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`DB file missing: ${file}`);
    continue;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  // Match keys e.g. "image-compressor": {
  const matches = content.matchAll(/^\s*"([^"]+)":\s*\{/gm);
  let count = 0;
  for (const match of matches) {
    allDbKeys.add(match[1]);
    count++;
  }
  console.log(`DB ${file} has ${count} entries.`);
}

console.log("Total entries in DBs:", allDbKeys.size);

const missing = [];
for (const tool of toolRegistry) {
  if (!allDbKeys.has(tool.id)) {
    missing.push(tool);
  }
}

console.log(`Missing tools (${missing.length}):`);
for (const tool of missing) {
  console.log(`- ${tool.id} (Category: ${tool.sectionId})`);
}
