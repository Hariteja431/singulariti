import fs from 'fs';
import path from 'path';
import { toolRegistry } from '../src/content/tools/toolRegistry';
import { buildToolContentProfile } from '../src/lib/tool-content/toolContentProfiles';
import { getStrategyContent } from '../src/lib/tool-content/toolContentStrategies';
import { compileToolArticle } from '../src/lib/tool-content/toolSectionGenerators';

const articlesDir = path.join(__dirname, '..', 'src', 'content', 'articles');

if (!fs.existsSync(articlesDir)) {
  fs.mkdirSync(articlesDir, { recursive: true });
}

console.log(`Starting profile-driven article generation for ${toolRegistry.length} tools...`);

let generatedCount = 0;

for (const tool of toolRegistry) {
  try {
    // 1. Build tool content profile
    const profile = buildToolContentProfile(tool);

    // 2. Select strategy
    const strategy = getStrategyContent(profile);

    // 3. Compile article markdown content
    const articleMarkdown = compileToolArticle(profile, strategy);

    // 4. Write to target file
    const targetPath = path.join(articlesDir, `${tool.id}.md`);
    fs.writeFileSync(targetPath, articleMarkdown, 'utf8');
    generatedCount++;
  } catch (err: any) {
    console.error(`Error generating article for ${tool.id}:`, err.message);
  }
}

console.log(`Successfully generated ${generatedCount} unique tool articles.`);
