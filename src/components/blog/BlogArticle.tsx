"use client";

import React from 'react';
import { BlogPost } from '@/lib/blog';
import { BlogSection } from './BlogSection';
import { 
  Cpu, 
  HelpCircle, 
  Users, 
  CheckCircle, 
  ListChecks, 
  Activity, 
  Box, 
  Code, 
  FileText, 
  Shield, 
  AlertTriangle, 
  Settings 
} from 'lucide-react';
import DOMPurify from 'dompurify';

interface BlogArticleProps {
  post: any;
}

const cleanStepText = (text: string) =>
  text.replace(/^\s*(?:\d+[\.\)\-]\s*)+/, '').trim();

const cleanListItem = (text: string) =>
  text.replace(/^\s*(?:[•\-*\u2022]\s*)+/, '').trim();

export function BlogArticle({ post }: BlogArticleProps) {
  // Try rawSections object first for manual detailed guides, fall back to sections array
  const rawSections = post.rawSections;
  const sectionsArray = Array.isArray(post.sections) ? post.sections : null;

  if (rawSections) {
    const s = rawSections;
    return (
      <article className="space-y-12 font-sans text-slate-700 dark:text-slate-300 blog-article-content">
        
        {/* Editorial Byline */}
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-4 mb-8">
          <address className="not-italic inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
            By Singulariti Editorial Team
          </address>
          <span className="opacity-50">|</span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            Fact-checked by Developer Experts
          </span>
          {post.date && (
            <>
              <span className="opacity-50">|</span>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
            </>
          )}
        </div>
        {/* 1. Introduction */}
        <section className="blog-content-body prose max-w-none text-slate-700 dark:text-slate-300 leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(s.introduction) }} />
        </section>

        {/* 2. What This Tool Does */}
        {s.whatThisToolDoes && (
          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
              <Cpu className="w-5 h-5 text-teal-600 dark:text-teal-400" /> What This Tool Does
            </h2>
            <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(s.whatThisToolDoes) }} />
          </section>
        )}

        {/* 3. Why This Tool Is Included */}
        {s.whyIncluded && (
          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Why This Tool Is Included
            </h2>
            <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(s.whyIncluded) }} />
          </section>
        )}

        {/* 5. Inputs & Outputs */}
        {(s.inputsRequired || s.outputProduced) && (
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {s.inputsRequired && s.inputsRequired.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-5 rounded-2xl space-y-3">
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Inputs Required</h3>
                <ul className="space-y-2 text-xs">
                  {s.inputsRequired.map((inp: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400 mt-1.5 flex-shrink-0" />
                      <span>{cleanListItem(inp)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {s.outputProduced && s.outputProduced.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-5 rounded-2xl space-y-3">
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Output Produced</h3>
                <ul className="space-y-2 text-xs">
                  {s.outputProduced.map((out: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400 mt-1.5 flex-shrink-0" />
                      <span>{cleanListItem(out)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* 6. How to Use */}
        {s.howToUse && s.howToUse.length > 0 && (
          <section className="space-y-3">
            <h2 className="font-display font-bold text-xl text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-teal-600 dark:text-teal-400" /> How to Use This Tool
            </h2>
            <ol className="space-y-2.5 list-none pl-0">
              {s.howToUse.map((step: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <span className="w-6 h-6 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed pt-0.5">{cleanStepText(step)}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* 8. Operation Works & Internal Processing */}
        {(s.operationWorks || s.internalProcessingFlow) && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {s.operationWorks && s.operationWorks.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">How the Operation Works</h3>
                <ul className="space-y-2 text-xs pl-0 list-none">
                  {s.operationWorks.map((work: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400 mt-1.5 flex-shrink-0" />
                      <span className="leading-relaxed">{cleanListItem(work)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {s.internalProcessingFlow && s.internalProcessingFlow.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Internal Processing Flow</h3>
                <ul className="space-y-2 text-xs pl-0 list-none font-mono">
                  {s.internalProcessingFlow.map((flow: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-650 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400 mt-1.5 flex-shrink-0" />
                      <span className="leading-relaxed">{cleanListItem(flow)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* 11. Working Example */}
        {s.workingExample && (
          <section className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden space-y-0">
            <div className="bg-slate-50 border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-4">
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Working Example</h3>
            </div>
            <div className="p-5 bg-white dark:bg-slate-950 space-y-4 text-xs font-mono">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block mb-1">Input Parameter</span>
                <pre className="bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-3 rounded-lg overflow-x-auto text-slate-900 dark:text-white whitespace-pre">{s.workingExample.input}</pre>
              </div>
              
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block mb-1">Execution Steps</span>
                <ul className="list-decimal pl-4 space-y-1 font-sans text-slate-700 dark:text-slate-300 text-xs">
                  {s.workingExample.operation.map((opStep: string, idx: number) => (
                    <li key={idx}>{cleanStepText(opStep)}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block mb-1">Output Result</span>
                <pre className="bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-3 rounded-lg overflow-x-auto text-slate-900 dark:text-white whitespace-pre">{s.workingExample.output}</pre>
              </div>
            </div>
          </section>
        )}

        {/* 12. Before & After */}
        {s.beforeAfter && (
          <section className="space-y-3">
            <h3 className="font-display font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Transformation (Before vs. After)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800 px-4 py-2 font-display font-bold text-slate-900 dark:text-white">Before</div>
                <pre className="p-3 overflow-x-auto text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950 whitespace-pre-wrap">{s.beforeAfter.before}</pre>
              </div>
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800 px-4 py-2 font-display font-bold text-slate-900 dark:text-white">After</div>
                <pre className="p-3 overflow-x-auto text-slate-900 dark:text-white bg-white dark:bg-slate-950 whitespace-pre-wrap">{s.beforeAfter.after}</pre>
              </div>
            </div>
          </section>
        )}

        {/* 13. Button Actions */}
        {s.buttonActions && s.buttonActions.length > 0 && (
          <section className="space-y-3">
            <h3 className="font-display font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Button Actions Explained</h3>
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-900">
                  <tr>
                    <th className="px-4 py-2 text-left font-display font-bold text-xs text-slate-900 dark:text-white w-1/4">Button Name</th>
                    <th className="px-4 py-2 text-left font-display font-bold text-xs text-slate-900 dark:text-white">Action Function</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs bg-white dark:bg-slate-950">
                  {s.buttonActions.map((btn: any, idx: number) => (
                    <tr key={idx}>
                      <td className="px-4 py-2.5 font-semibold text-teal-700 dark:text-teal-300">{btn.button}</td>
                      <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{btn.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 14. Major & Minor Use Cases */}
        {(s.majorUses || s.minorUses) && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {s.majorUses && s.majorUses.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-5 rounded-2xl space-y-3">
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Major Use Cases</h3>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {s.majorUses.map((use: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400 mt-1.5 flex-shrink-0" />
                      <span>{cleanListItem(use)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {s.minorUses && s.minorUses.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-5 rounded-2xl space-y-3">
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Minor Use Cases</h3>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {s.minorUses.map((use: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400 mt-1.5 flex-shrink-0" />
                      <span>{cleanListItem(use)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* 15. Common Mistakes */}
        {s.commonMistakes && s.commonMistakes.length > 0 && (
          <section className="p-5 border border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/10 rounded-2xl space-y-3">
            <h3 className="font-display font-bold text-sm text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Common User Mistakes
            </h3>
            <ul className="space-y-1.5 text-xs pl-0 list-none text-slate-700 dark:text-slate-300">
              {s.commonMistakes.map((mistake: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-semibold text-amber-550 dark:text-amber-450 mt-0.5">•</span>
                  <span className="leading-relaxed">{cleanListItem(mistake)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 16. What Happens If input is Invalid */}
        {s.invalidInputHandling && s.invalidInputHandling.length > 0 && (
          <section className="p-5 border border-red-200 bg-red-50/50 dark:border-red-900/40 dark:bg-red-950/10 rounded-2xl space-y-3">
            <h3 className="font-display font-bold text-sm text-red-650 dark:text-red-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> What Happens If the Input Is Invalid
            </h3>
            <ul className="space-y-1.5 text-xs pl-0 list-none text-slate-700 dark:text-slate-300">
              {s.invalidInputHandling.map((handler: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-semibold text-red-500 dark:text-red-400 mt-0.5">•</span>
                  <span className="leading-relaxed">{cleanListItem(handler)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 17. Under the Hood: Technical Details */}
        {(s.technicalExplanation || s.packagesUsed || s.codeSnippets) && (
          <section className="bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800/80 p-8 rounded-3xl space-y-8 shadow-sm">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <Settings className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Technology Behind the Tool
              </h3>
              <p className="text-sm font-sans text-slate-650 dark:text-slate-400 mt-1">Understanding how this utility processes data locally.</p>
            </div>

            {s.technicalExplanation && (
              <div className="space-y-3">
                <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" /> How It Actually Works
                </h4>
                <div 
                  className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(s.technicalExplanation) }}
                />
              </div>
            )}

            {s.packagesUsed && s.packagesUsed.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Box className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Packages & APIs Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {s.packagesUsed.map((pkg: string, idx: number) => (
                    <span key={idx} className="bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 border border-teal-100 dark:border-teal-900/40 px-3 py-1.5 rounded-lg text-xs font-semibold font-mono">
                      {pkg}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {s.codeSnippets && s.codeSnippets.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-display font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Code className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Core Logic Snippets
                </h4>
                <div className="space-y-4">
                  {s.codeSnippets.map((snippet: any, idx: number) => (
                    <div key={idx} className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                        <span className="text-xs font-display font-bold text-slate-900 dark:text-white">{snippet.title}</span>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{snippet.language}</span>
                      </div>
                      <pre className="p-4 overflow-x-auto text-[12px] font-mono text-slate-900 dark:text-slate-250 leading-relaxed">
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
        {s.limitations && s.limitations.length > 0 && (
          <section className="p-5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-2xl space-y-3">
            <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" /> Honest Limitations
            </h3>
            <ul className="space-y-1.5 text-xs pl-0 list-none text-slate-600 dark:text-slate-350">
              {s.limitations.map((lim: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-semibold text-slate-500 dark:text-slate-400 mt-0.5">•</span>
                  <span className="leading-relaxed">{cleanListItem(lim)}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 18. Privacy Note */}
        {s.privacyNote && (
          <section className="p-5 border border-teal-100 dark:border-teal-900/60 bg-teal-50/40 dark:bg-teal-950/20 rounded-2xl space-y-3">
            <h3 className="font-display font-bold text-sm text-teal-700 dark:text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> Privacy & Security Note
            </h3>
            <div 
              className="text-xs leading-relaxed font-semibold text-teal-700 dark:text-teal-300"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(s.privacyNote) }}
            />
          </section>
        )}

        {/* 19. Conclusion */}
        <section className="blog-content-body prose max-w-none text-slate-700 dark:text-slate-300 leading-relaxed pt-4 border-t border-slate-200 dark:border-slate-800/80">
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(s.conclusion) }} />
        </section>

      </article>
    );
  }

  // Fallback rendering for simple array of sections
  if (sectionsArray) {
    return (
      <article className="space-y-8 font-sans text-slate-700 dark:text-slate-300 blog-article-content">
        {/* Editorial Byline */}
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-4 mb-8">
          <address className="not-italic inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
            By Singulariti Editorial Team
          </address>
          <span className="opacity-50">|</span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            Fact-checked by Developer Experts
          </span>
          {post.date && (
            <>
              <span className="opacity-50">|</span>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
            </>
          )}
        </div>
        {sectionsArray.map((sec: any) => (
          <BlogSection key={sec.id} section={sec} />
        ))}
      </article>
    );
  }

  return null;
}
