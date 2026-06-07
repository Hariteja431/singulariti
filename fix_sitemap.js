const fs = require('fs');

let c = fs.readFileSync('src/app/sitemap.ts', 'utf8');

c = c.replace(/lastModified,\n\s*changeFrequency: '(weekly|monthly|yearly)',\n\s*priority: (0\.\d+|1),/g, (match, freq, prio) => {
  let dateVar = 'STATIC_DATE';
  if(prio === '0.9' || prio === '0.7' || match.includes('weekly')) {
    dateVar = 'TOOLS_DATE';
  }
  if(match.includes('terms') || match.includes('privacy') || match.includes('about') || match.includes('contact')) {
    dateVar = 'STATIC_DATE';
  }
  return `lastModified: ${dateVar},\n      changeFrequency: '${freq}',\n      priority: ${prio},`;
});

fs.writeFileSync('src/app/sitemap.ts', c);
