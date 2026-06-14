import { getFallbackPost } from '../src/lib/blog';
import { toolRegistry } from '../src/content/tools/toolRegistry';

const toolA = toolRegistry.find(t => t.guideSlug === 'add-watermark-to-image-guide');
const toolB = toolRegistry.find(t => t.guideSlug === 'pdf-to-text-guide');

if (toolA && toolB) {
  const postA = getFallbackPost(toolA);
  const postB = getFallbackPost(toolB);
  
  console.log("=== ARTICLE A (add-watermark-to-image-guide) INTRO ===");
  console.log(postA.sections.introduction);
  console.log("=== ARTICLE B (pdf-to-text-guide) INTRO ===");
  console.log(postB.sections.introduction);
} else {
  console.log("Tools not found in registry.");
}
