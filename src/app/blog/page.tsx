import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { blogSeriesList, toolRegistry } from '@/content/tools/toolRegistry';
import { getAllPosts } from '@/lib/blog';
import { buildMetadata } from '@/lib/seo/metadata';
import { getPageSEO } from '@/lib/seo/pageMetadata';
import { BlogSearchAutocomplete } from '@/components/blog/BlogSearchAutocomplete';
import WhoCanUseSingulariti from '@/components/blog/WhoCanUseSingulariti';
import BlogListingClient from '@/components/blog/BlogListingClient';
import { BookOpen, Layers, ArrowRight } from 'lucide-react';

const seo = getPageSEO('blog')!;
export const metadata = buildMetadata({
  title: "Blog | Singulariti Tool Guides",
  description: "Read simple Singulariti guides for PDF tools, image tools, developer utilities, SEO tools, calculators, converters, and everyday digital tasks.",
  canonical: `https://singulariti.in/blog`,
  robots: seo.robots,
  openGraph: {
    title: "Blog | Singulariti Tool Guides",
    description: "Read simple Singulariti guides for PDF tools, image tools, developer utilities, SEO tools, calculators, converters, and everyday digital tasks.",
    url: "https://singulariti.in/blog",
    type: "website",
    image: seo.openGraph.image,
  },
  twitter: {
    title: "Blog | Singulariti Tool Guides",
    description: "Read simple Singulariti guides for PDF tools, image tools, developer utilities, SEO tools, calculators, converters, and everyday digital tasks.",
    image: seo.twitter.image,
  },
});

export default async function BlogHomePage() {
  const posts = getAllPosts();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white pt-24 pb-16">
        <div className="w-full space-y-16">
          
          {/* 1. Blog hero & 2. Short blog introduction */}
          <section className="w-full bg-gradient-to-b from-white via-slate-50 to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white py-12">
            <div className="max-w-4xl mx-auto text-center px-4 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/60 text-teal-700 dark:text-teal-300 text-[13px] font-sans font-medium">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Singulariti Educational Library</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-950 dark:text-white leading-tight">
                Blog
              </h1>
              
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
                Singulariti blog helps users understand tools, file workflows, formatting, conversion, compression, SEO, text utilities, calculators, and productivity tools.
              </p>
            </div>
          </section>

          {/* 3. Search Bar Container */}
          <section className="max-w-3xl mx-auto px-4">
            <div className="bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800/80 p-6 md:p-8 rounded-3xl space-y-4 shadow-sm">
              <h3 className="font-display font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Search Utility Guides
              </h3>
              <BlogSearchAutocomplete />
            </div>
          </section>

          {/* 4. “Who Can Use Singulariti?” compact section */}
          <WhoCanUseSingulariti />

          {/* 5, 6, 7. Featured Post, Category Filters, and Latest Blog Cards Grid */}
          <section className="max-w-6xl mx-auto px-4">
            <BlogListingClient posts={posts} />
          </section>

          {/* 8. Blog Series / Categories */}
          <section className="max-w-6xl mx-auto px-4 space-y-10 pt-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-4">
              <div>
                <h2 className="font-display font-bold text-2xl text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
                  <Layers className="w-6 h-6 text-teal-600 dark:text-teal-400" /> Guide Series
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm font-sans mt-1">
                  Discover sub-sections and individual tools grouped by utility classes.
                </p>
              </div>
              <Link 
                href="/blog/series"
                className="inline-flex items-center gap-1 font-semibold text-xs text-teal-700 hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-200 transition-colors"
              >
                View All Series <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogSeriesList.map((series, idx) => {
                const count = toolRegistry.filter(t => t.sectionId === series.sectionId).length;
                const gradients = [
                  'from-blue-500/10 to-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200/40 dark:border-indigo-900/40',
                  'from-emerald-500/10 to-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-200/40 dark:border-teal-900/40',
                  'from-rose-500/10 to-orange-500/10 text-rose-700 dark:text-rose-300 border-rose-200/40 dark:border-rose-900/40',
                  'from-amber-500/10 to-yellow-500/10 text-amber-700 dark:text-amber-300 border-amber-200/40 dark:border-amber-900/40',
                  'from-violet-500/10 to-fuchsia-500/10 text-violet-700 dark:text-violet-300 border-violet-200/40 dark:border-violet-900/40',
                  'from-cyan-500/10 to-sky-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-200/40 dark:border-cyan-900/40'
                ];
                const gradient = gradients[idx % gradients.length];
                
                return (
                  <div 
                    key={series.id} 
                    className="bg-white border border-slate-200 dark:border-slate-800 dark:bg-slate-900 rounded-2xl flex flex-col justify-between overflow-hidden hover:border-teal-400 dark:hover:border-teal-700 transition-colors shadow-sm"
                  >
                    <div className={`h-12 bg-gradient-to-r ${gradient} border-b border-slate-100 dark:border-slate-800/40 flex items-center px-5`} />
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h3 className="font-display font-bold text-base text-slate-990 dark:text-white">
                            {series.name}
                          </h3>
                          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-850 px-2.5 py-1 rounded-full font-semibold">
                            {count} utilities
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                          {series.description}
                        </p>
                      </div>
                      <div className="pt-2">
                        <Link 
                          href={`/blog/series/${series.slug}`}
                          className="inline-flex w-full items-center justify-center py-2.5 bg-slate-50 hover:bg-teal-50 hover:text-teal-700 dark:bg-slate-950 dark:hover:bg-teal-950/20 dark:hover:text-teal-300 border border-slate-200 dark:border-slate-800 rounded-xl font-sans font-semibold text-xs text-slate-700 dark:text-slate-300 transition-all"
                        >
                          View Guide Series
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 9. Final CTA */}
          <section className="max-w-6xl mx-auto px-4 pt-12">
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-teal-50/40 via-white to-slate-50 p-8 dark:border-slate-800 dark:from-teal-950/20 dark:via-slate-900 dark:to-slate-950 text-center space-y-5 shadow-sm">
              <h3 className="text-slate-950 dark:text-white font-display font-bold text-2xl">
                Ready to Boost Your Digital Productivity?
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
                Explore our full suite of 180+ browser-side utility tools. Shrink PDFs, optimize photos, format code payloads, calculate loan parameters, and manage files instantly.
              </p>
              <div className="pt-2">
                <Link 
                  href="/tools"
                  className="inline-flex items-center rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 gap-2 shadow-md"
                >
                  Browse All 180+ Tools <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
