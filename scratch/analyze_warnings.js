const fs = require('fs');
const path = require('path');

const report = JSON.parse(fs.readFileSync(path.join(__dirname, '../reports/blog-quality-report.json'), 'utf-8'));

console.log(`Total Warning Pairs: ${report.length}`);

const counts = {};
report.forEach(pair => {
  counts[pair.articleA] = (counts[pair.articleA] || 0) + 1;
  counts[pair.articleB] = (counts[pair.articleB] || 0) + 1;
});

const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
console.log("\nTop 30 tools with most warnings:");
sorted.slice(0, 30).forEach(([slug, count]) => {
  console.log(`- ${slug}: ${count} warnings`);
});
