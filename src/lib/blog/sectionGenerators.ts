import { ToolContentProfile } from './toolProfiles';
import { StrategyContent } from './contentStrategies';

// Helper for deterministic selections
function getSlugHash(slug: string): number {
  let hash = 5381;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 33) ^ slug.charCodeAt(i);
  }
  return Math.abs(hash);
}

export function generateIntro(profile: ToolContentProfile, strategy: StrategyContent): string {
  const hash = getSlugHash(profile.slug);

  const openers = [
    `For absolute data privacy, the <strong>${profile.toolName}</strong> runs directly in your browser tab without any external network dependency.`,
    `To keep your sensitive data secure, this utility performs all operations in client-side memory.`,
    `Security is built directly into the <strong>${profile.toolName}</strong>'s architecture.`,
    `You can use this tool confidently knowing that no data leaves your computer.`,
    `By executing scripts in your local session, this utility processes your data without remote server calls.`,
    `Singulariti operates with a client-first design, running all functions in your active window.`,
    `To protect your confidential files, all operations are processed locally on your CPU device.`,
    `This browser-native utility ensures your information is formatted securely on your machine.`
  ];

  const transitions = [
    `Since processing is performed locally on your device, your private records, credentials, or file payloads are never sent to third-party servers.`,
    `The <strong>${profile.toolName}</strong> requires no files to be uploaded or saved to remote databases, ensuring your information remains private.`,
    `It converts or formats your data without remote server calls, tracker cookies, or remote logs.`,
    `The tool operates in-memory to process raw inputs locally and securely inside your active tab.`,
    `Your files and parameters never leave your computer, keeping them completely safe from network leaks.`,
    `This local processing model complies with standard corporate data security policies.`,
    `All data remains inside your browser's volatile cache, which is purged immediately upon exit.`,
    `You get fast, secure execution without the risk of third-party logging or data breaches.`
  ];

  const disclaimer = `${openers[hash % openers.length]} ${transitions[(hash + 4) % transitions.length]}`;

  return `
    ${strategy.intro}
    <p>${disclaimer}</p>
  `;
}

export function generateWhatItDoes(profile: ToolContentProfile, strategy: StrategyContent): string {
  const hash = getSlugHash(profile.slug);
  const name = profile.toolName;
  const input = profile.inputType.toLowerCase();
  const output = profile.outputType.toLowerCase();
  const desc = profile.shortDescription.replace(/\.$/, "").toLowerCase();

  const openers = [
    `The primary function of the <strong>${name}</strong> is to help users ${desc}.`,
    `Designed as a client-side utility, the <strong>${name}</strong> allows you to ${desc} directly in browser memory.`,
    `When you need to ${desc}, the <strong>${name}</strong> offers an interactive, browser-native workspace.`,
    `The <strong>${name}</strong> serves as an offline-first tool built to ${desc} securely.`,
    `Using the <strong>${name}</strong> makes it simple to ${desc} without remote software installations.`,
    `The <strong>${name}</strong> provides a streamlined web-based workflow to ${desc} in one click.`,
    `If your goal is to ${desc}, the <strong>${name}</strong> delivers an instant local solution.`,
    `Managing tasks where you must ${desc} is simplified with this dedicated web client.`
  ];

  const transitions = [
    `It accepts <strong>${profile.inputType}</strong> and generates the corresponding <strong>${profile.outputType}</strong>.`,
    `The uploader parses your <strong>${input}</strong> and outputs the finalized <strong>${output}</strong>.`,
    `You can upload your raw <strong>${input}</strong> to instantly compile the <strong>${output}</strong>.`,
    `It evaluates the <strong>${input}</strong> parameters locally to render the processed <strong>${output}</strong>.`,
    `The compiler reads the <strong>${input}</strong> format and translates it into a standard <strong>${output}</strong>.`,
    `By processing your <strong>${input}</strong>, the tool generates a validated <strong>${output}</strong>.`,
    `It maps the <strong>${input}</strong> structure and writes the resulting <strong>${output}</strong> stream.`,
    `The local execution logic processes the <strong>${input}</strong>, returning a clean <strong>${output}</strong>.`
  ];

  const p2_openers = [
    `By running processing scripts in your browser session, the utility translates your inputs into the desired format without requiring any local software setup.`,
    `Using modern web APIs, the operation is executed in-memory to deliver results instantly without remote server latency.`,
    `This tool eliminates the need for expensive third-party platforms by completing the transformation entirely on your own device.`,
    `Because it operates within your browser tab, the transformation is completed quickly and safely.`,
    `Everything runs in your local window session, meaning no files are uploaded to third-party databases.`,
    `This local tool eliminates these constraints by performing all calculations and formatting in volatile RAM.`,
    `The application relies on native browser APIs to format and compile your resources offline.`,
    `You can use this utility confidently knowing that your private information never leaves your tab.`
  ];

  const p2_transitions = [
    `This offline-ready tool handles your files in-memory, ensuring complete data privacy.`,
    `With zero signup requirements, the tool evaluates your parameters instantly.`,
    `It bypasses cloud queues to render results in seconds using your local device CPU.`,
    `This responsive interface ensures stable performance on both mobile and desktop screens.`,
    `It complies with strict corporate data policies by executing strictly in browser memory.`,
    `Closing or reloading the active tab will instantly purge all inputs and outputs.`,
    `All variables are stored in volatile RAM and are cleared immediately upon exit.`,
    `No subscription fees, watermarks, or account registrations are required.`
  ];

  const p1 = `${openers[hash % openers.length]} ${transitions[(hash + 1) % transitions.length]}`;
  const p2 = `${p2_openers[(hash + 2) % p2_openers.length]} ${p2_transitions[(hash + 3) % p2_transitions.length]}`;

  return `<p>${p1}</p><p>${p2}</p>`;
}

export function generateWhyUsersNeedIt(profile: ToolContentProfile, strategy: StrategyContent): string {
  const hash = getSlugHash(profile.slug);
  const input = profile.inputType.toLowerCase();
  const benefit = profile.keyBenefit.replace(/\.$/, "").toLowerCase();

  const openers = [
    `By handling the <strong>${input}</strong> parameters locally, the tool ${benefit}.`,
    `Processing this data client-side ensures that you ${benefit}.`,
    `The main advantage of this local-first approach is that it ${benefit} directly inside your browser window.`,
    `Using this local utility ${benefit} while maintaining fast execution.`,
    `Running computations on your own device ensures that you ${benefit} securely.`,
    `Handling files in-memory allows the uploader to ${benefit} without delays.`,
    `Bypassing traditional cloud queues ensures that you ${benefit} instantly.`,
    `Operating strictly inside your active browser tab helps you ${benefit}.`
  ];

  const transitions = [
    `This eliminates upload queues, saves internet bandwidth, and protects your private information from external logging.`,
    `It bypasses traditional server-side bottlenecks and keeps your records safe from third-party monitoring.`,
    `You don't have to share your files or parameters with external databases, keeping your credentials secure.`,
    `Bypassing cloud-based conversions ensures complete confidentiality for your sensitive work.`,
    `It protects your confidential records from being stored on remote servers or logs.`,
    `This keeps your variables in RAM, preventing data scraping or corporate leaks.`,
    `You get immediate results without compromising your privacy or data ownership.`,
    `This guarantees a clean, tracker-free workspace for all your digital assets.`
  ];

  const p2 = `${openers[hash % openers.length]} ${transitions[(hash + 5) % transitions.length]}`;

  return `<p>${strategy.problemSection}</p><p>${p2}</p>`;
}

export function generateHowItWorks(profile: ToolContentProfile, strategy: StrategyContent): string {
  const hash = getSlugHash(profile.slug);
  const action = profile.actualTransformation.replace(/\.$/, "").toLowerCase();

  const openers = [
    `Specifically, the client-side compiler loads your variables into memory. The execution logic then ${action}.`,
    `Under the hood, the browser engine executes optimized scripting routines where it ${action}.`,
    `The application runs browser-native scripts to process the input stream. In practice, the code ${action}.`,
    `By utilizing local CPU resources, the script parses your inputs and ${action}.`,
    `The client-first design operates entirely offline once loaded, allowing the script to ${action}.`,
    `The compiler evaluates the target structure parameters and ${action} in-memory.`,
    `Modern scripting engines run in your volatile cache to ensure that it ${action}.`,
    `The local workspace maps the parameters and ${action} without external dependencies.`
  ];

  const transitions = [
    `This ensures the output is rendered directly in your active tab.`,
    `The compiled output is pushed straight into your local buffer.`,
    `These calculations or formatting steps run entirely within the client sandbox.`,
    `The resulting data structure is finalized without external API calls.`,
    `This design guarantees zero network round-trip delays for speed.`,
    `All processed data is formatted to match industry specifications.`,
    `You can verify the security by checking your developer network console.`,
    `This keeps files off remote servers for reliable data privacy.`
  ];

  const p2 = `${openers[hash % openers.length]} ${transitions[(hash + 6) % transitions.length]}`;

  return `<p>${strategy.explanation}</p><p>${p2}</p>`;
}

export function generateHowToUse(profile: ToolContentProfile, strategy: StrategyContent): string {
  const listItems = strategy.steps.map(step => `<li>${step}</li>`).join('\n');
  return `
    <p>To perform the operation, follow these simple steps:</p>
    <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
      ${listItems}
    </ol>
  `;
}

export function generatePracticalExample(profile: ToolContentProfile, strategy: StrategyContent): string {
  const exampleInput = profile.inputType.includes("File") ? "sample_file.ext" : "raw_input_data";
  const exampleOutput = profile.outputType.includes("File") ? "optimized_file.ext" : "formatted_output_data";

  return `
    <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 font-sans text-xs">
      <div className="font-semibold text-slate-950 dark:text-white uppercase tracking-wider text-[10px]">Practical Execution Trace:</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <span className="font-bold text-slate-500">Input parameter:</span>
          <pre className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-100 dark:border-slate-800 overflow-x-auto text-[11px]">${exampleInput}</pre>
        </div>
        <div className="space-y-1">
          <span className="font-bold text-slate-500">Result produced:</span>
          <pre className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-100 dark:border-slate-800 overflow-x-auto text-[11px]">${exampleOutput}</pre>
        </div>
      </div>
      <div className="text-[11px] text-slate-500 leading-relaxed">
        <strong>Operation:</strong> The browser reads the user input, applies the internal parser, validates syntax rules, and outputs the result in seconds.
      </div>
    </div>
  `;
}

export function generateBestUseCases(profile: ToolContentProfile, strategy: StrategyContent): string {
  const listItems = strategy.useCases.map(use => `<li><strong>${use.split(':')[0]}:</strong>${use.split(':').slice(1).join(':')}</li>`).join('\n');
  return `
    <p>The ${profile.toolName} is especially useful for the following workflows:</p>
    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
      ${listItems}
    </ul>
  `;
}

export function generateAdvantages(profile: ToolContentProfile, strategy: StrategyContent): string {
  const listItems = strategy.advantages.map(adv => `<li>${adv}</li>`).join('\n');
  return `
    <p>The main advantages of using this local utility include:</p>
    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
      ${listItems}
    </ul>
  `;
}

export function generateOutputChecks(profile: ToolContentProfile, strategy: StrategyContent): string {
  const checks = [
    "Verify the output size fits within your destination platform bounds.",
    "Double-check spelling and character layout formatting before publishing.",
    "Test that files render correctly in standard viewers or destination applications."
  ];
  if (profile.sourceFormat && profile.targetFormat) {
    checks.push(`Ensure transparency layers and color scales were mapped correctly during conversion.`);
  }

  const listItems = checks.map(c => `<li>${c}</li>`).join('\n');
  return `
    <p>Before using your output result, review these quality checkpoints:</p>
    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
      ${listItems}
    </ul>
  `;
}

export function generateCommonMistakes(profile: ToolContentProfile, strategy: StrategyContent): string {
  const listItems = strategy.mistakes.map(m => `<li>${m}</li>`).join('\n');
  return `
    <p>Avoid these common mistakes to keep your processing smooth:</p>
    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
      ${listItems}
    </ul>
  `;
}

export function generateTroubleshooting(profile: ToolContentProfile, strategy: StrategyContent): string {
  const listItems = strategy.troubleshooting.map(t => `<li>${t}</li>`).join('\n');
  return `
    <p>If you encounter issues during operation, try these steps:</p>
    <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
      ${listItems}
    </ul>
  `;
}

export function generatePrivacyNote(profile: ToolContentProfile, strategy: StrategyContent): string {
  let text = `For tools that run fully in the browser, your <strong>${profile.inputType.toLowerCase()}</strong> is processed locally without being uploaded to a server.`;
  if (profile.privacyNoteType === "developer-sensitive") {
    text = `<strong>Developer Security Alert:</strong> Paste keys, tokens, and config values into the <strong>${profile.toolName}</strong> with caution. Although this runs client-side, do not expose production passwords or API secrets in public browser tabs.`;
  } else if (profile.privacyNoteType === "calculator-estimate") {
    text = `<strong>Disclaimer:</strong> All calculations performed by the <strong>${profile.toolName}</strong> are estimates based on standard mathematical models. Verify these outputs before making financial or professional decisions.`;
  } else if (profile.privacyNoteType === "text-review") {
    text = `<strong>Usage Note:</strong> The parsed outputs generated by this tool are displayed client-side. Make sure to double-check characters or formatting layout before publishing.`;
  } else if (profile.privacyNoteType === "browser-file") {
    text = `<strong>Document Privacy:</strong> Your uploaded <strong>${profile.inputType.toLowerCase()}</strong> is handled entirely within your browser's active tab. No files are transmitted to external databases or stored on remote clouds.`;
  }
  return `<p>${text} Always practice secure data management when working with digital resources online.</p>`;
}

export function generateRelatedTools(profile: ToolContentProfile, allTools: ToolContentProfile[]): { name: string; url: string; reason: string }[] {
  // Prioritize relatedToolSlugs if present
  let matches: ToolContentProfile[] = [];
  if (profile.relatedToolSlugs && profile.relatedToolSlugs.length > 0) {
    matches = allTools.filter(t => profile.relatedToolSlugs.includes(t.slug));
  }

  // Fill up with same category tools if less than 4 matches
  if (matches.length < 4) {
    const categoryMatches = allTools.filter(t => 
      t.slug !== profile.slug && 
      t.category === profile.category &&
      !matches.some(m => m.slug === t.slug)
    );
    matches = [...matches, ...categoryMatches].slice(0, 4);
  } else {
    matches = matches.slice(0, 4);
  }

  return matches.map(t => {
    // Generate context-aware reasons
    const sId = profile.slug.replace("-guide", "").toLowerCase();
    const tId = t.slug.replace("-guide", "").toLowerCase();

    let reason = `Integrate ${t.toolName} with your ${profile.toolName} operations for optimal browser workflows.`;

    if (sId.includes("upi") && tId.includes("calculator")) {
      reason = `Calculate financial margins or repayment rates alongside your UPI checkout operations.`;
    } else if (sId.includes("text") && tId.includes("counter")) {
      reason = `Count word and character limits before encoding clean strings into scannable patterns.`;
    } else if (sId.includes("qr") && tId.includes("scanner")) {
      reason = `Scan and verify the visual layout of your generated patterns to guarantee scanning reliability.`;
    } else if (tId.includes("generator") && tId.includes("qr")) {
      reason = `Generate alternative scannable layouts for URLs, contact details, or credentials.`;
    } else if (sId.includes("compress") && tId.includes("compress")) {
      reason = `Minimize page weights by optimizing different visual and document formats locally.`;
    } else if (sId.includes("to") && tId.includes("to")) {
      reason = `Process reverse or alternative file conversions client-side without sharing files.`;
    }

    return {
      name: t.toolName,
      url: `/blog/guides/${t.slug}`,
      reason
    };
  });
}

export function generateFaqs(profile: ToolContentProfile, strategy: StrategyContent): { question: string; answer: string }[] {
  return strategy.faqs;
}

export function generateSummary(profile: ToolContentProfile, strategy: StrategyContent): string {
  const hash = getSlugHash(profile.slug);
  const intent = profile.userIntent.toLowerCase().replace(/\.$/, "");

  const openers = [
    `Using the <strong>${profile.toolName}</strong> is an efficient way to ${intent} safely on your local device.`,
    `The <strong>${profile.toolName}</strong> offers a private, secure method to ${intent} in seconds.`,
    `Simplify your digital tasks and ${intent} with this client-side utility.`,
    `Keep your workflows clean and ${intent} securely inside your browser tab.`,
    `We created the <strong>${profile.toolName}</strong> to help you ${intent} without complications.`,
    `Optimize your daily configuration workflows and ${intent} locally.`,
    `Access this free browser workspace to ${intent} without data limits.`,
    `The <strong>${profile.toolName}</strong> provides a lightweight interface to ${intent} on the go.`
  ];

  const transitions = [
    `Explore our complete suite of utilities to handle similar data operations without cloud dependencies.`,
    `Check out our other browser-side utilities to optimize your daily workflow.`,
    `Our offline-first tools help you manage files and text without sharing your data.`,
    `We provide these online tools for free, with zero signups or tracking.`,
    `It runs on mobile and desktop, giving you a private, ad-free alternative.`,
    `This keeps your variables in RAM, ensuring your files are never saved.`,
    `Enjoy instant execution, absolute privacy, and cross-platform compatibility.`,
    `All scripts are cached in your tab, allowing offline data parsing at any time.`
  ];

  const footer = `${openers[hash % openers.length]} ${transitions[(hash + 7) % transitions.length]}`;

  return `
    ${strategy.summary}
    <p>${footer}</p>
  `;
}
