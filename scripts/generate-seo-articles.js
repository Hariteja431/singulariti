const { execSync } = require('child_process');
const path = require('path');

try {
  console.log("Running profile-driven SEO article generator via tsx...");
  execSync(`npx tsx "${path.join(__dirname, 'generate-seo-articles.ts')}"`, { stdio: 'inherit' });
} catch (e) {
  console.error("SEO article generation failed.");
  process.exit(1);
}
