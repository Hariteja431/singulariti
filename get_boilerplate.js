const fs = require('fs');

let content = fs.readFileSync('src/lib/seo/utilityMetadata.ts', 'utf8');

const regex = /"utilityId":\s*"([^"]+)"[\s\S]*?"title":\s*"([^"]+)"[\s\S]*?"description":\s*"(Use this local utility tool to perform [^"]+ tasks in the browser without registration\.)"/g;

let matches = [...content.matchAll(regex)];
console.log(JSON.stringify(matches.map(m => ({ id: m[1], title: m[2], desc: m[3] })), null, 2));
