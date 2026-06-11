"use client";

import React from 'react';
import { BlogPost } from '@/lib/blog';
import { 
  Shield,
  ListChecks,
  Activity,
  FileText,
  CheckCircle,
  Check,
  Settings,
  Box,
  Code
} from 'lucide-react';
import { WarningBox } from './WarningBox';

interface BlogArticleProps {
  post: BlogPost;
}

const cleanStepText = (text: string) =>
  text.replace(/^\s*(?:\d+[\.\)\-]\s*)+/, '').trim();

const cleanListItem = (text: string) =>
  text.replace(/^\s*(?:[•\-*\u2022]\s*)+/, '').trim();

export function BlogArticle({ post }: BlogArticleProps) {
  const { sections } = post;
  if (!sections) return null;

  return (
    <article className="space-y-12 font-sans text-slate-700 dark:text-slate-300 blog-article-content max-w-[860px] mx-auto text-sm md:text-base leading-relaxed">
      
      {/* 1. Introduction */}
      <section className="prose prose-slate max-w-none text-slate-700 dark:text-slate-300 space-y-4">
        <div 
          dangerouslySetInnerHTML={{ __html: sections.introduction }} 
          className="blog-intro-content [&>h2]:border-l-4 [&>h2]:border-teal-700 [&>h2]:pl-3 [&>h2]:font-display [&>h2]:font-bold [&>h2]:text-lg [&>h2]:md:text-xl [&>h2]:text-slate-950 dark:[&>h2]:text-white [&>h2]:mt-8 [&>h2]:mb-4 [&>p]:mb-4 [&>p]:leading-relaxed [&>p]:text-slate-700 dark:[&>p]:text-slate-300 [&>ul]:list-none [&>ul]:pl-0 [&>ul>li]:relative [&>ul>li]:pl-6 [&>ul>li]:mb-2 [&>ul>li]:before:content-['✓'] [&>ul>li]:before:absolute [&>ul>li]:before:left-0 [&>ul>li]:before:text-teal-700 dark:[&>ul>li]:before:text-teal-300 [&>ul>li]:before:font-bold [&>table]:min-w-full [&>table]:divide-y [&>table]:divide-slate-200 dark:[&>table]:divide-slate-800 [&>table]:border [&>table]:border-slate-200 dark:[&>table]:border-slate-800 [&>table]:rounded-xl [&>table]:overflow-hidden [&>table]:my-6 [&>table_thead]:bg-slate-50 dark:[&>table_thead]:bg-slate-900 [&>table_th]:px-4 [&>table_th]:py-2.5 [&>table_th]:text-left [&>table_th]:font-display [&>table_th]:font-bold [&>table_th]:text-xs [&>table_th]:text-slate-950 dark:[&>table_th]:text-white [&>table_td]:px-4 [&>table_td]:py-3 [&>table_td]:border-t [&>table_td]:border-slate-200 dark:[&>table_td]:border-slate-800 [&>table_td]:text-[13px]"
        />
      </section>

      {/* 2. What This Tool Does */}
      {sections.whatThisToolDoes && (
        <section className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h2 className="font-display font-bold text-lg md:text-xl text-slate-950 dark:text-white tracking-tight flex items-center gap-2 border-l-4 border-teal-700 pl-3">
            What This Tool Does
          </h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{sections.whatThisToolDoes}</p>
        </section>
      )}

      {/* 3. Why This Tool Is Included */}
      {sections.whyIncluded && (
        <section className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h2 className="font-display font-bold text-lg md:text-xl text-slate-950 dark:text-white tracking-tight flex items-center gap-2 border-l-4 border-teal-700 pl-3">
            Why This Tool Is Included
          </h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{sections.whyIncluded}</p>
        </section>
      )}

      {/* 4. Who Can Use This Tool */}
      {sections.whoCanUse && sections.whoCanUse.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h2 className="font-display font-bold text-lg md:text-xl text-slate-950 dark:text-white tracking-tight flex items-center gap-2 border-l-4 border-teal-700 pl-3">
            Who Can Use This Tool
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-0 list-none">
            {sections.whoCanUse.map((user, idx) => (
              <li key={idx} className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-3 rounded-xl hover:border-teal-350 dark:hover:border-teal-500 hover:bg-white dark:hover:bg-slate-950 hover:shadow-sm transition-all duration-200">
                <CheckCircle className="w-4.5 h-4.5 text-teal-700 dark:text-teal-400 flex-shrink-0" />
                <span className="text-slate-800 dark:text-slate-200 text-[13px] font-semibold">{cleanListItem(user)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 5. Inputs & Outputs */}
      {(sections.inputsRequired || sections.outputProduced) && (
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          {sections.inputsRequired && sections.inputsRequired.length > 0 && (
            <div className="bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-5 rounded-xl space-y-3 shadow-sm">
              <h3 className="font-display font-bold text-xs text-teal-700 dark:text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                <ListChecks className="w-4 h-4" /> Inputs Required
              </h3>
              <ul className="space-y-2 text-[13px] pl-0 list-none">
                {sections.inputsRequired.map((inp, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-teal-700 dark:text-teal-300 mt-0.5 flex-shrink-0" />
                    <span>{cleanListItem(inp)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {sections.outputProduced && sections.outputProduced.length > 0 && (
            <div className="bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-5 rounded-xl space-y-3 shadow-sm">
              <h3 className="font-display font-bold text-xs text-teal-700 dark:text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4" /> Output Produced
              </h3>
              <ul className="space-y-2 text-[13px] pl-0 list-none">
                {sections.outputProduced.map((out, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-teal-700 dark:text-teal-300 mt-0.5 flex-shrink-0" />
                    <span>{cleanListItem(out)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* 6. How to Use */}
      {sections.howToUse && sections.howToUse.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h2 className="font-display font-bold text-lg md:text-xl text-slate-950 dark:text-white tracking-tight flex items-center gap-2 border-l-4 border-teal-700 pl-3">
            How to Use This Tool
          </h2>
          <ol className="space-y-3 list-none pl-0">
            {sections.howToUse.map((step, idx) => (
              <li key={idx} className="bg-slate-50/50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 hover:border-teal-350 dark:hover:border-teal-500 hover:bg-white dark:hover:bg-slate-950 hover:shadow-sm p-4 rounded-xl flex items-start gap-4 transition-all duration-200">
                <span className="w-6 h-6 rounded-full bg-teal-50 border border-teal-200 text-teal-700 dark:bg-teal-950/40 dark:border-teal-900 dark:text-teal-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 shadow-sm">
                  {idx + 1}
                </span>
                <span className="text-[13px] md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pt-0.5">{cleanStepText(step)}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* 8. Operation Works & Internal Processing */}
      {(sections.operationWorks || sections.internalProcessingFlow) && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          {sections.operationWorks && sections.operationWorks.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-display font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">How the Operation Works</h3>
              <ul className="space-y-2 text-[13px] pl-0 list-none">
                {sections.operationWorks.map((work, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                    <span className="text-teal-700 dark:text-teal-400 mt-0.5">•</span>
                    <span className="leading-relaxed">{cleanListItem(work)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {sections.internalProcessingFlow && sections.internalProcessingFlow.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-display font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Internal Processing Flow</h3>
              <ul className="space-y-2 text-[13px] pl-0 list-none">
                {sections.internalProcessingFlow.map((flow, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-teal-700 dark:text-teal-400 mt-0.5">•</span>
                    <span className="leading-relaxed font-mono text-slate-600 dark:text-slate-350 text-[12px]">{cleanListItem(flow)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* 11. Working Example */}
      {sections.workingExample && (
        <section className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm bg-white dark:bg-slate-900 pt-6">
          <div className="bg-slate-50 border-b border-slate-200 dark:bg-slate-950 dark:border-slate-800 px-5 py-4">
            <h3 className="font-display font-bold text-xs text-slate-950 dark:text-white uppercase tracking-wider">Working Example</h3>
          </div>
          <div className="p-6 bg-white dark:bg-slate-900 space-y-4 text-xs font-mono">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5 font-sans">Input Parameter</span>
              <pre className="bg-slate-50 border border-slate-200 text-slate-800 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 p-4 rounded-xl overflow-x-auto whitespace-pre">{sections.workingExample.input}</pre>
            </div>
            
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5 font-sans">Execution Steps</span>
              <ul className="list-decimal pl-4 space-y-1.5 font-sans text-slate-700 dark:text-slate-300 text-xs">
                {sections.workingExample.operation.map((opStep, idx) => (
                  <li key={idx}>{cleanStepText(opStep)}</li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5 font-sans">Output Result</span>
              <pre className="bg-slate-50 border border-slate-200 text-slate-800 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-200 p-4 rounded-xl overflow-x-auto whitespace-pre">{sections.workingExample.output}</pre>
            </div>
          </div>
        </section>
      )}

      {/* 12. Before & After */}
      {sections.beforeAfter && (
        <section className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h3 className="font-display font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Transformation (Before vs. After)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
              <div className="bg-slate-50 border-b border-slate-200 text-slate-950 dark:bg-slate-950 dark:border-slate-800 dark:text-white px-4 py-2.5 font-display font-bold">Before</div>
              <pre className="p-4 overflow-x-auto text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 whitespace-pre-wrap">{sections.beforeAfter.before}</pre>
            </div>
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
              <div className="bg-slate-50 border-b border-slate-200 text-teal-700 dark:bg-slate-950 dark:border-slate-800 dark:text-teal-350 px-4 py-2.5 font-display font-bold">After</div>
              <pre className="p-4 overflow-x-auto text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 whitespace-pre-wrap">{sections.beforeAfter.after}</pre>
            </div>
          </div>
        </section>
      )}

      {/* 13. Button Actions */}
      {sections.buttonActions && sections.buttonActions.length > 0 && (
        <section className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h3 className="font-display font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Button Actions Explained</h3>
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-950">
                <tr>
                  <th className="px-5 py-3 text-left font-display font-bold text-xs text-slate-950 dark:text-white w-1/4">Button Name</th>
                  <th className="px-5 py-3 text-left font-display font-bold text-xs text-slate-950 dark:text-white">Action Function</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[13px] bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300">
                {sections.buttonActions.map((btn, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-3 font-semibold text-teal-700 dark:text-teal-350">{btn.button}</td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{btn.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 14. Major & Minor Use Cases */}
      {(sections.majorUses || sections.minorUses) && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          {sections.majorUses && sections.majorUses.length > 0 && (
            <div className="bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-5 rounded-xl space-y-3 shadow-sm">
              <h3 className="font-display font-bold text-xs text-slate-950 dark:text-white uppercase tracking-wider">Major Use Cases</h3>
              <ul className="space-y-2 text-[13px] pl-0 list-none">
                {sections.majorUses.map((use, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                    <span className="text-teal-700 dark:text-teal-400 mt-0.5">•</span>
                    <span>{cleanListItem(use)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {sections.minorUses && sections.minorUses.length > 0 && (
            <div className="bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-5 rounded-xl space-y-3 shadow-sm">
              <h3 className="font-display font-bold text-xs text-slate-950 dark:text-white uppercase tracking-wider">Minor Use Cases</h3>
              <ul className="space-y-2 text-[13px] pl-0 list-none">
                {sections.minorUses.map((use, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                    <span className="text-teal-700 dark:text-teal-400 mt-0.5">•</span>
                    <span>{cleanListItem(use)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* 15. Common Mistakes */}
      {sections.commonMistakes && sections.commonMistakes.length > 0 && (
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
          <WarningBox 
            heading="Common User Mistakes" 
            content="To ensure the operations perform correctly on your files, avoid these common implementation errors:" 
            items={sections.commonMistakes} 
          />
        </div>
      )}

      {/* 16. What Happens If input is Invalid */}
      {sections.invalidInputHandling && sections.invalidInputHandling.length > 0 && (
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
          <WarningBox 
            heading="Invalid Input Handling" 
            content="If code parsing failures or file validations trigger errors, the browser handles them as follows:" 
            items={sections.invalidInputHandling} 
          />
        </div>
      )}

      {/* 17. Under the Hood: Technical Details */}
      {(sections.technicalExplanation || sections.packagesUsed || sections.codeSnippets) && (
        <section className="bg-slate-50/50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-6 md:p-8 rounded-2xl space-y-6 shadow-sm pt-6 border-t">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h3 className="font-display font-bold text-base md:text-lg text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
              <Settings className="w-5 h-5 text-teal-700 dark:text-teal-400" /> Technology Behind the Tool
            </h3>
            <p className="text-[12.5px] font-sans text-slate-500 dark:text-slate-400 mt-1">Understanding how this utility processes data locally.</p>
          </div>

          {sections.technicalExplanation && (
            <div className="space-y-2">
              <h4 className="font-display font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-700 dark:text-teal-400" /> How It Actually Works
              </h4>
              <p className="text-[13px] md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-950 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                {sections.technicalExplanation}
              </p>
            </div>
          )}

          {sections.packagesUsed && sections.packagesUsed.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-display font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Box className="w-4 h-4 text-teal-700 dark:text-teal-400" /> Packages & APIs Used
              </h4>
              <div className="flex flex-wrap gap-2">
                {sections.packagesUsed.map((pkg, idx) => (
                  <span key={idx} className="bg-teal-50 text-teal-700 border border-teal-100 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-900 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono">
                    {pkg}
                  </span>
                ))}
              </div>
            </div>
          )}

          {sections.codeSnippets && sections.codeSnippets.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-display font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Code className="w-4 h-4 text-teal-700 dark:text-teal-400" /> Core Logic Snippets
              </h4>
              <div className="space-y-4">
                {sections.codeSnippets.map((snippet, idx) => (
                  <div key={idx} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                      <span className="text-[11px] font-display font-bold text-slate-950 dark:text-white">{snippet.title}</span>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{snippet.language}</span>
                    </div>
                    <pre className="p-4 overflow-x-auto text-[11.5px] font-mono text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
                      <code>{snippet.code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 18. Limitations */}
      {sections.limitations && sections.limitations.length > 0 && (
        <section className="p-5 border border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/30 rounded-xl space-y-3 shadow-sm">
          <h3 className="font-display font-bold text-xs md:text-sm text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-slate-500" /> Honest Limitations
          </h3>
          <ul className="space-y-1.5 text-xs md:text-[13px] pl-0 list-none">
            {sections.limitations.map((lim, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-650 dark:text-slate-300">
                <span className="font-semibold text-slate-400 mt-0.5">•</span>
                <span className="leading-relaxed">{cleanListItem(lim)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 18. Privacy Note */}
      {sections.privacyNote && (
        <section className="p-5 border border-teal-200/50 bg-teal-50/20 dark:border-teal-900 dark:bg-teal-950/20 rounded-xl space-y-2 shadow-sm">
          <h3 className="font-display font-bold text-xs md:text-sm text-teal-800 dark:text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-teal-700 dark:text-teal-400" /> Privacy & Security Note
          </h3>
          <p className="text-xs md:text-sm leading-relaxed font-semibold text-teal-700 dark:text-teal-300">{sections.privacyNote}</p>
        </section>
      )}

      {/* 19. Conclusion */}
      <section className="blog-content-body pt-6 border-t border-slate-200 dark:border-slate-800">
        <div 
          dangerouslySetInnerHTML={{ __html: sections.conclusion }} 
          className="blog-conclusion-content [&>p]:mb-4 [&>p]:leading-relaxed [&>p]:text-slate-700 dark:[&>p]:text-slate-300 [&>h2]:border-l-4 [&>h2]:border-teal-700 [&>h2]:pl-3 [&>h2]:font-display [&>h2]:font-bold [&>h2]:text-lg [&>h2]:md:text-xl [&>h2]:text-slate-950 dark:[&>h2]:text-white [&>h2]:mt-8 [&>h2]:mb-4"
        />
      </section>

    </article>
  );
}
