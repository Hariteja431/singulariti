const fs = require('fs');
const path = require('path');

const toolsDump = JSON.parse(fs.readFileSync(path.join(__dirname, 'tools_dump.json'), 'utf-8'));

const categories = {
  image: ['image', 'editing'],
  pdf: ['pdf'],
  qr: ['qr'],
  calculators: ['calculators'],
  text: ['text'],
  dev: ['dev'],
  convert: ['convert'],
  seo: ['seo']
};

const detailsDir = path.join(__dirname, '../src/lib/tool-content/details');
if (!fs.existsSync(detailsDir)) {
  fs.mkdirSync(detailsDir, { recursive: true });
}

// Generate a file for each category group
for (const [catName, sections] of Object.entries(categories)) {
  const catTools = toolsDump.filter(t => sections.includes(t.sectionId));
  
  let content = `// Tool Details Database for ${catName} category\n`;
  content += `export interface ToolDetailEntry {\n`;
  content += `  whyNeed: string;\n`;
  content += `  howWorks: string;\n`;
  content += `  whenToUse: string;\n`;
  content += `  stepByStep: string[];\n`;
  content += `  advantages: string[];\n`;
  content += `  commonMistakes: string[];\n`;
  content += `  faqs: { question: string; answer: string }[];\n`;
  content += `}\n\n`;
  
  content += `export const ${catName}DetailsDb: Record<string, ToolDetailEntry> = {\n`;
  
  catTools.forEach((t, idx) => {
    content += `  "${t.id}": {\n`;
    content += `    whyNeed: "",\n`;
    content += `    howWorks: "",\n`;
    content += `    whenToUse: "",\n`;
    content += `    stepByStep: [],\n`;
    content += `    advantages: [],\n`;
    content += `    commonMistakes: [],\n`;
    content += `    faqs: []\n`;
    content += `  }${idx < catTools.length - 1 ? ',' : ''}\n`;
  });
  
  content += `};\n`;
  
  fs.writeFileSync(path.join(detailsDir, `${catName}Db.ts`), content, 'utf8');
}

console.log("Successfully generated all boilerplate DB files under src/lib/tool-content/details/");
