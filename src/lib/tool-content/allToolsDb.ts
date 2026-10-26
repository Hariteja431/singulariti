import { calculatorsDetailsDb } from './details/calculatorsDb';
import { convertDetailsDb } from './details/convertDb';
import { devDetailsDb } from './details/devDb';
import { imageDetailsDb } from './details/imageDb';
import { pdfDetailsDb } from './details/pdfDb';
import { qrDetailsDb } from './details/qrDb';
import { seoDetailsDb } from './details/seoDb';
import { textDetailsDb } from './details/textDb';
import { randomDb } from './details/randomDb';
import { mediaDb } from './details/mediaDb';

export interface FullToolDetail {
  whyNeed: string;
  howWorks: string;
  whenToUse: string;
  stepByStep: string[];
  advantages: string[];
  commonMistakes: string[];
  faqs: { q: string; a: string }[];
}

const rawDb: Record<string, any> = {
  ...calculatorsDetailsDb,
  ...convertDetailsDb,
  ...devDetailsDb,
  ...imageDetailsDb,
  ...pdfDetailsDb,
  ...qrDetailsDb,
  ...seoDetailsDb,
  ...textDetailsDb,
  ...randomDb,
  ...mediaDb,
};

function cleanMarkdown(str: string): string {
  if (!str) return '';
  return str
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();
}

function cleanHowWorks(str: string): string {
  let clean = cleanMarkdown(str);
  clean = clean.replace(/^The browser-based application reads parameters in-memory\.\s*/i, '');
  clean = clean.replace(/^Specifically,\s*/i, '');
  if (clean.length > 0) {
    clean = clean[0].toUpperCase() + clean.slice(1);
  }
  return clean;
}

export function getToolDetails(toolId: string, toolName?: string, toolDescription?: string): FullToolDetail {
  const entry = rawDb[toolId];

  const name = toolName || toolId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const desc = toolDescription || `Process and optimize digital assets directly in your web browser.`;

  if (entry) {
    const stepByStep = entry.stepByStep && entry.stepByStep.length > 0 
      ? entry.stepByStep 
      : [
          `Open the ${name} in your browser.`,
          `Enter your data or upload your file into the workspace.`,
          `Configure the desired options and processing parameters.`,
          `Review the generated results and copy or download the output.`
        ];

    const advantages = entry.advantages && entry.advantages.length > 0
      ? entry.advantages
      : [
          `100% private and secure — all processing runs client-side in browser RAM`,
          `Instant results without waiting for server uploads or file transfers`,
          `Free to use on desktop, tablet, and mobile with zero software installation required`
        ];

    const commonMistakes = entry.commonMistakes && entry.commonMistakes.length > 0
      ? entry.commonMistakes
      : [
          `Closing the browser tab before saving or downloading your final output.`,
          `Uploading corrupted files or entering invalid formats.`
        ];

    const faqs = entry.faqs && entry.faqs.length > 0
      ? entry.faqs
      : [
          {
            q: `Are my files or data uploaded to any server when using the ${name}?`,
            a: `No. Singulariti processes everything locally on your machine using client-side JavaScript, Web Workers, and modern browser APIs. Your files, text, and inputs never leave your device.`
          },
          {
            q: `Is the ${name} free to use?`,
            a: `Yes, this tool is 100% free with no registration, no subscription fees, and no daily usage limits.`
          },
          {
            q: `Does the ${name} work on mobile devices?`,
            a: `Yes, our tools are fully responsive and optimized to run seamlessly across desktop computers, tablets, and smartphones.`
          }
        ];

    return {
      whyNeed: cleanMarkdown(entry.whyNeed || `Handling ${name.toLowerCase()} manually or through insecure cloud converters can expose sensitive data and slow down your workflow. The ${name} provides a fast, frictionless, and secure solution directly in your browser.`),
      howWorks: cleanHowWorks(entry.howWorks || `This utility executes entirely inside your browser environment using local computational resources. By eliminating cloud roundtrips, it ensures instant execution, total data privacy, and reliable performance.`),
      whenToUse: cleanMarkdown(entry.whenToUse || `Use the ${name} whenever you need to ${desc.toLowerCase().replace(/\.$/, '')} quickly without installing third-party desktop software.`),
      stepByStep,
      advantages,
      commonMistakes,
      faqs
    };
  }

  // Fallback for tools not explicitly in DB
  return {
    whyNeed: `Handling digital tasks quickly and securely is essential for modern workflows. The ${name} is engineered to ${desc.toLowerCase().replace(/\.$/, '')} with maximum efficiency, zero setup, and absolute privacy.`,
    howWorks: `All calculations and operations are processed natively within your browser using client-side web technologies. Your files and data remain strictly on your local device and are never sent across the internet to external servers.`,
    whenToUse: `Use the ${name} whenever you need a fast, private, and dependable browser utility for ${name.toLowerCase()} tasks on any device.`,
    stepByStep: [
      `Access the ${name} tool interface.`,
      `Provide your input or upload the target file into the tool workspace.`,
      `Select your preferences or adjust settings to match your specific requirements.`,
      `Download, export, or copy the final result instantly.`
    ],
    advantages: [
      `Complete privacy: Files and inputs are processed locally in your device's memory`,
      `Lightning-fast speed: No server upload latency or waiting queues`,
      `Universal access: Works on any modern web browser across Windows, Mac, Linux, iOS, and Android`
    ],
    commonMistakes: [
      `Navigating away from the page before downloading or copying your finished work.`,
      `Entering incompatible input data types or malformed files.`
    ],
    faqs: [
      {
        q: `Is the ${name} completely free to use?`,
        a: `Yes, the ${name} is 100% free with no hidden fees, credit card requirements, or limitations.`
      },
      {
        q: `How does Singulariti guarantee the privacy of my data?`,
        a: `Singulariti operates on a strict zero-upload architecture. All file manipulation and computations happen in your browser's local memory (RAM). When you close the tab, all memory is immediately freed.`
      },
      {
        q: `Do I need to install any software or browser extensions?`,
        a: `No installation is required. Everything runs natively within any standard modern web browser.`
      }
    ]
  };
}
