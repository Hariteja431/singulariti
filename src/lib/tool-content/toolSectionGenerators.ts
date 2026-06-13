import { ToolContentProfile } from './toolContentProfiles';
import { StrategyContent } from './toolContentStrategies';
import { getRelatedTools } from './toolRelatedContent';

export function compileToolArticle(profile: ToolContentProfile, strategy: StrategyContent): string {
  const depth = profile.articleDepth;
  const name = profile.toolName;
  const category = profile.category;

  // 1. Fetch related tools links
  const relatedLinks = getRelatedTools(profile.slug.replace("-guide", ""), category);
  const relatedToolsSection = `Here are some other related utility tools you can explore to streamline your workflows:

${relatedLinks.map(l => `- [${l.name}](${l.url})`).join('\n')}`;

  // 2. Prepare FAQ section
  const faqLimit = depth === "detailed" ? 5 : (depth === "medium" ? 4 : 3);
  const selectedFaqs = strategy.faqs.slice(0, faqLimit);
  const faqSection = selectedFaqs.map(faq => `### ${faq.question}\n\n${faq.answer}`).join('\n\n');

  // Build sections based on depth tier
  let md = "";

  if (depth === "small") {
    // Simple page (depth = small, 6 sections, 450-700 words)
    md += `## Why You Need a ${name}\n\n${strategy.whyNeed}\n\n`;
    md += `## How ${name} Works\n\n${strategy.howWorks}\n\n`;
    md += `## Step-by-Step Usage\n\n${strategy.stepByStep.map((s, i) => `${i + 1}. **${s.split(':')[0]}**: ${s.split(':').slice(1).join(':').trim() || s}`).join('\n')}\n\n`;
    md += `## Privacy and Safe Usage\n\n${strategy.privacy}\n\n`;
    md += `## Related Tools\n\n${relatedToolsSection}\n\n`;
    md += `## FAQs\n\n${faqSection}\n`;
  } else if (depth === "medium") {
    // Medium page (depth = medium, 8 sections, 700-1,000 words)
    md += `## Why You Need a ${name}\n\n${strategy.whyNeed}\n\n`;
    md += `## How ${name} Works\n\n${strategy.howWorks}\n\n`;
    md += `## When to Use This Tool\n\n${strategy.whenToUse}\n\n`;
    md += `## Step-by-Step Usage\n\n${strategy.stepByStep.map((s, i) => `${i + 1}. **${s.split(':')[0]}**: ${s.split(':').slice(1).join(':').trim() || s}`).join('\n')}\n\n`;
    md += `## Advantages\n\n${strategy.advantages.map(a => `- **${a.split(' ')[0]}**: ${a}`).join('\n')}\n\n`;
    md += `## Privacy and Safe Usage\n\n${strategy.privacy}\n\n`;
    md += `## Related Tools\n\n${relatedToolsSection}\n\n`;
    md += `## FAQs\n\n${faqSection}\n`;
  } else {
    // Detailed page (depth = detailed, 10 sections, 1,000-1,400 words)
    md += `## Why You Need a ${name}\n\n${strategy.whyNeed}\n\n`;
    md += `## How ${name} Works\n\n${strategy.howWorks}\n\n`;
    md += `## When to Use This Tool\n\n${strategy.whenToUse}\n\n`;
    md += `## Step-by-Step Usage\n\n${strategy.stepByStep.map((s, i) => `${i + 1}. **${s.split(':')[0]}**: ${s.split(':').slice(1).join(':').trim() || s}`).join('\n')}\n\n`;
    md += `## Practical Example\n\n${strategy.example}\n\n`;
    md += `## Advantages\n\n${strategy.advantages.map(a => `- **${a.split(' ')[0]}**: ${a}`).join('\n')}\n\n`;
    md += `## Common Mistakes to Avoid\n\n${strategy.mistakes.map(m => `- ${m}`).join('\n')}\n\n`;
    md += `## Privacy and Safe Usage\n\n${strategy.privacy}\n\n`;
    md += `## Related Tools\n\n${relatedToolsSection}\n\n`;
    md += `## FAQs\n\n${faqSection}\n`;
  }

  return md;
}
