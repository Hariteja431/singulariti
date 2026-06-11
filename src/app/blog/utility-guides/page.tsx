import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { sectionRegistry, subSectionRegistry, toolRegistry } from '@/content/tools/toolRegistry';
import { FolderKanban, ArrowLeft, ArrowRight } from 'lucide-react';
import { buildMetadata } from '@/lib/seo/metadata';
import { getPageSEO } from '@/lib/seo/pageMetadata';

const seo = getPageSEO('blog-utility-guides')!;
export const metadata = buildMetadata({
  title: seo.title,
  description: seo.description,
  canonical: `https://singulariti.in${seo.path}`,
  robots: seo.robots,
  openGraph: {
    title: seo.openGraph.title,
    description: seo.openGraph.description,
    url: seo.openGraph.url,
    type: seo.openGraph.type,
    image: seo.openGraph.image,
  },
  twitter: {
    title: seo.twitter.title,
    description: seo.twitter.description,
    image: seo.twitter.image,
  },
});

export default function UtilityGuidesDirectoryLanding() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-white text-slate-900 dark:bg-slate-950 dark:text-white pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl space-y-12">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-sans text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-teal-700 dark:hover:text-teal-300 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-teal-700 dark:hover:text-teal-300 transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-semibold">Utility Directory</span>
          </div>

          {/* Title & Introduction */}
          <header className="max-w-4xl border-b border-slate-200 dark:border-slate-800 pb-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 dark:bg-teal-950/40 dark:border-teal-900 dark:text-teal-300 text-[12px] font-sans font-semibold">
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Full Archive Index</span>
            </div>
            <h1 className="font-display font-bold text-3xl md:text-5xl text-slate-950 dark:text-white tracking-tight">
              Utility Guides Index
            </h1>
            <p className="font-sans text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              This directory lists guides for each utility available on the website. Each guide explains what the utility does, how the operation works, what input is required, what output is produced, and where the utility can be opened. Use the category hierarchy below to discover grouped tools.
            </p>
          </header>

          {/* Main Directory List */}
          <section className="space-y-10 max-w-5xl">
            {sectionRegistry.map((section) => {
              const subs = subSectionRegistry.filter(ss => ss.sectionId === section.id);
              return (
                <div 
                  key={section.id} 
                  className="bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-6 md:p-8 rounded-3xl space-y-6 shadow-xs hover:border-teal-300 dark:hover:border-teal-900 transition-all"
                >
                  {/* Category Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div className="space-y-1">
                      <h2 className="font-display font-bold text-xl text-slate-950 dark:text-white">
                        {section.name}
                      </h2>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 font-sans max-w-xl">{section.description}</p>
                    </div>
                    <Link 
                      href={`/blog/series/${section.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 dark:text-teal-400 hover:underline flex-shrink-0"
                    >
                      Explore Section <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Sub-sections links grid */}
                  {subs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {subs.map((sub) => {
                        const count = toolRegistry.filter(t => t.subSectionId === sub.id).length;
                        return (
                          <Link 
                            key={sub.id}
                            href={`/blog/series/${section.slug}/${sub.slug}`}
                            className="bg-slate-50 border border-slate-200 hover:border-teal-300 dark:bg-slate-950 dark:border-slate-800 dark:hover:border-teal-700 p-4 rounded-xl flex items-center justify-between group transition-all"
                          >
                            <div className="space-y-1">
                              <span className="font-sans font-bold text-xs text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors block">
                                {sub.name}
                              </span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{sub.description}</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300 bg-slate-200/50 dark:bg-slate-800 px-2 py-0.5 rounded-md flex-shrink-0 group-hover:bg-teal-100 group-hover:text-teal-800 dark:group-hover:bg-teal-950 dark:group-hover:text-teal-300 transition-all ml-4">
                              {count} tools
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 dark:text-slate-400">No subcategories defined for this section.</p>
                  )}
                </div>
              );
            })}
          </section>

          {/* Navigation Back */}
          <div className="pt-4">
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-slate-600 hover:text-teal-700 dark:text-slate-400 dark:hover:text-teal-300 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Blog Home
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
