const fs = require('fs');
const path = 'src/components/tools/dev/DevToolContainer.tsx';
let c = fs.readFileSync(path, 'utf8');

// 1. Add article to interface
c = c.replace(
  /(interface DevToolContainerProps \{[\r\n]+\s+toolId: string;[\r\n]+\s+toolName: string;[\r\n]+\s+toolDescription: string;[\r\n]+)(\})/,
  function(m, p1, p2) {
    if (!p1.includes('article')) {
      return p1 + '  article?: string;\r\n' + p2;
    }
    return m;
  }
);

// 2. Add article to destructuring
c = c.replace(
  'export function DevToolContainer({ toolId, toolName, toolDescription }',
  'export function DevToolContainer({ toolId, toolName, toolDescription, article }'
);

// 3. Add categoryName, categoryPath, and article prop to ToolLayout
// The ToolLayout call currently looks like:
//   <ToolLayout
//     utilityId={toolId}
//     title={toolName}
//     description={toolDescription}
//     howToUse={content.howToUse}
//     faqs={content.faqs}
//   >
c = c.replace(
  '      description={toolDescription}\r\n      howToUse={content.howToUse}',
  '      description={toolDescription}\r\n      categoryName="Developer Tools"\r\n      categoryPath="/tools/dev"\r\n      howToUse={content.howToUse}'
);

c = c.replace(
  '      faqs={content.faqs}\r\n    >',
  '      faqs={content.faqs}\r\n      article={article}\r\n    >'
);

fs.writeFileSync(path, c);

// Verify
const verify = fs.readFileSync(path, 'utf8');
console.log('categoryName found:', verify.includes('categoryName="Developer Tools"'));
console.log('article prop interface found:', verify.includes('article?: string'));
console.log('article JSX found:', verify.includes('article={article}'));
