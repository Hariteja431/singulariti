const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '../src/content/tools/toolRegistry.ts'), 'utf-8');
const toolStart = content.indexOf('export const toolRegistry');
const toolEnd = content.indexOf('];', toolStart);
const toolText = content.substring(content.indexOf('[', toolStart), toolEnd + 1);
const tools = eval(toolText);

const ids = tools.map(t => ({ id: t.id, name: t.name, sectionId: t.sectionId }));
fs.writeFileSync(path.join(__dirname, 'tools_dump.json'), JSON.stringify(ids, null, 2));
console.log(`Dumped ${ids.length} tools to tools_dump.json`);
