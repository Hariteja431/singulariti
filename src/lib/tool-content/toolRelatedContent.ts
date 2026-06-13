import { toolRegistry, UtilityRegistryItem } from '@/content/tools/toolRegistry';

// Manual overrides for related tools to keep them highly relevant
const manualRelatedTools: Record<string, string[]> = {
  "text-compare": ["word-counter", "character-counter", "text-diff", "case-converter", "remove-duplicate-lines"],
  "paragraph-counter": ["word-counter", "character-counter", "line-counter", "sentence-counter", "case-converter"],
  "image-compressor": ["jpg-compressor", "png-compressor", "webp-compressor", "image-resizer", "crop-image"],
  "json-formatter": ["xml-formatter", "yaml-formatter", "sql-formatter", "code-beautifier", "jwt-decoder"],
  "rotate-pdf": ["merge-pdf", "split-pdf", "delete-pdf-pages", "rearrange-pdf-pages", "extract-pdf-pages"]
};

export type RelatedToolLink = {
  name: string;
  url: string;
};

export function getRelatedTools(toolId: string, category: string): RelatedToolLink[] {
  let targetIds = manualRelatedTools[toolId];

  // If no manual overrides, check the tool registry's relatedToolIds
  const currentTool = toolRegistry.find(t => t.id === toolId);
  if (!targetIds && currentTool && currentTool.relatedToolIds) {
    targetIds = currentTool.relatedToolIds;
  }

  // Fallback: get other tools in the same category (rotated by tool index to avoid identical lists)
  if (!targetIds || targetIds.length === 0) {
    const otherTools = toolRegistry.filter(t => t.id !== toolId && t.sectionId === category);
    const index = toolRegistry.findIndex(t => t.id === toolId);
    const offset = index !== -1 ? index % otherTools.length : 0;
    const rotated = [...otherTools.slice(offset), ...otherTools.slice(0, offset)];
    targetIds = rotated.slice(0, 4).map(t => t.id);
  }

  // Map target IDs to their active metadata names and URLs
  const links: RelatedToolLink[] = [];
  targetIds.forEach(id => {
    const registryItem = toolRegistry.find(t => t.id === id);
    if (registryItem) {
      links.push({
        name: registryItem.name,
        url: registryItem.utilityUrl
      });
    }
  });

  // If we still have fewer than 3 related tools, fill up from the same category
  if (links.length < 3) {
    toolRegistry
      .filter(t => t.id !== toolId && t.sectionId === category)
      .forEach(t => {
        if (links.length < 4 && !links.some(l => l.url === t.utilityUrl)) {
          links.push({
            name: t.name,
            url: t.utilityUrl
          });
        }
      });
  }

  return links.slice(0, 5); // Return at most 5 related tools
}
