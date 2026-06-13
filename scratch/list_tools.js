const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '../src/content/tools/toolRegistry.ts'), 'utf-8');

// Parse sections
const sectionStart = content.indexOf('export const sectionRegistry');
const sectionEnd = content.indexOf('];', sectionStart);
const sectionText = content.substring(content.indexOf('[', sectionStart), sectionEnd + 1);
const sections = eval(sectionText);

// Parse subsections
const subSectionStart = content.indexOf('export const subSectionRegistry');
const subSectionEnd = content.indexOf('];', subSectionStart);
const subSectionText = content.substring(content.indexOf('[', subSectionStart), subSectionEnd + 1);
const subSections = eval(subSectionText);

// Parse tools
const toolStart = content.indexOf('export const toolRegistry');
const toolEnd = content.indexOf('];', toolStart);
const toolText = content.substring(content.indexOf('[', toolStart), toolEnd + 1);
const tools = eval(toolText);

console.log(`SUMMARY:`);
console.log(`Total Categories: ${sections.length}`);
console.log(`Total Subcategories: ${subSections.length}`);
console.log(`Total Tools: ${tools.length}`);

// Count tools per category
const counts = {};
tools.forEach(t => {
  counts[t.sectionId] = (counts[t.sectionId] || 0) + 1;
});
console.log(`Tools per Category:`, counts);
