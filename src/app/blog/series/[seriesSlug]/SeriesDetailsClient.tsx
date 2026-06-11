"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  blogSeriesList,
  blogSubSeriesList,
  toolRegistry
} from '@/content/tools/toolRegistry';
import { getPostBySlug, getUnifiedPosts } from '@/lib/blog';
import { SimilarTopicsSidebar } from '@/components/blog/SimilarTopicsSidebar';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogCategoryCard } from '@/components/blog/BlogCategoryCard';
import { Breadcrumbs } from '@/components/blog/Breadcrumbs';
import { 
  ArrowLeft, 
  Layers, 
  BookOpen, 
  ChevronRight,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  ArrowUpDown
} from 'lucide-react';

interface SeriesDetailsContentProps {
  seriesSlug: string;
}

// Map sectionSlug to guide slug inside blog.ts
function getPostGuideSlug(sectionSlug: string): string {
  const slug = sectionSlug.toLowerCase();
  if (slug === 'developer-utilities') return 'developer-tools-guide';
  if (slug === 'calculator-utilities') return 'calculator-tools-guide';
  if (slug === 'image-editing-utilities') return 'image-tools-guide';
  if (slug === 'unit-conversion-utilities') return 'productivity-tools-guide';
  return slug.replace('-utilities', '-tools-guide');
}

export function SeriesDetailsContent({ seriesSlug }: SeriesDetailsContentProps) {

  // Find series info
  const series = blogSeriesList.find(s => s.slug === seriesSlug);
  if (!series) {
    notFound();
  }

  // Load enriched content from blog.ts category guides
  const guideSlug = getPostGuideSlug(seriesSlug);
  const postGuide = getPostBySlug(guideSlug);

  // Retrieve sub-sections inside this section
  const subSections = blogSubSeriesList.filter(ss => ss.seriesId === series.sectionId);

  // Retrieve all guides belonging strictly to this series from unified posts
  const allGuides = useMemo(() => {
    return getUnifiedPosts().filter(p => p.seriesId === series.sectionId);
  }, [series.sectionId]);
  const totalCount = allGuides.length;

  // Search, tag, and sort filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOp, setSelectedOp] = useState('all');
  const [sortBy, setSortBy] = useState<'latest' | 'title'>('latest');
  const [activeTab, setActiveTab] = useState<'recent' | 'featured'>('recent');

  // Dynamically resolve operation types represented in this series
  const opsInSeries = useMemo(() => {
    const ops = allGuides.map(g => {
      const tool = toolRegistry.find(t => t.id === g.utilityId);
      return tool?.operationType;
    }).filter(Boolean) as string[];
    return Array.from(new Set(ops));
  }, [allGuides]);

  // Client-side filtering & sorting
  const filteredAndSortedGuides = useMemo(() => {
    let list = activeTab === 'featured' 
      ? allGuides.filter(g => g.featured) 
      : allGuides;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(g => 
        g.title.toLowerCase().includes(q) || 
        g.metaDescription.toLowerCase().includes(q)
      );
    }

    if (selectedOp !== 'all') {
      list = list.filter(g => {
        const tool = toolRegistry.find(t => t.id === g.utilityId);
        return tool?.operationType === selectedOp;
      });
    }

    if (sortBy === 'title') {
      return [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else {
      return [...list].sort((a, b) => {
        const dateA = a.updatedAt || '';
        const dateB = b.updatedAt || '';
        return dateB.localeCompare(dateA);
      });
    }
  }, [allGuides, activeTab, searchQuery, selectedOp, sortBy]);

  // Slicing logic for visible guides list
  const [visibleCount, setVisibleCount] = useState(12);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisibleCount(12);
  }, [searchQuery, selectedOp, sortBy, activeTab]);

  const paginatedGuides = useMemo(() => {
    return filteredAndSortedGuides.slice(0, visibleCount);
  }, [filteredAndSortedGuides, visibleCount]);

  // Get 3 related categories (excluding the current one)
  const relatedCategories = blogSeriesList.filter(s => s.id !== series.id).slice(0, 3);

  // Dynamic tags / related operations
  const cleanTags = opsInSeries.map(op => op.charAt(0).toUpperCase() + op.slice(1) + 's');

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1280px] space-y-12">
      
      {/* 1. Breadcrumbs */}
      <Breadcrumbs items={[{ name: series.name }]} />

      {/* 2. Category Hero Card */}
      <section className="relative rounded-2xl border border-slate-200 bg-gradient-to-br from-teal-50/20 via-white to-slate-50 p-8 space-y-6 shadow-sm overflow-hidden dark:border-slate-800 dark:from-teal-950/10 dark:via-slate-900 dark:to-slate-950">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none translate-x-20 -translate-y-20" />
        
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-teal-700 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/30 text-[11px] font-sans font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Guide Series Overview</span>
          </span>
          <span className="text-[11px] font-sans font-bold text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-full dark:text-slate-300 dark:bg-slate-900 dark:border-slate-800">
            {totalCount} {totalCount === 1 ? 'guide' : 'guides'}
          </span>
        </div>
        
        <div className="max-w-4xl space-y-3">
          <h1 className="font-display font-extrabold text-3xl md:text-5xl text-slate-950 dark:text-white tracking-tight">
            {series.name}
          </h1>
          <p className="font-sans text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {series.heroDescription || series.description}
          </p>
        </div>

        {cleanTags.length > 0 && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-2 items-center text-xs font-sans text-slate-600 dark:text-slate-300">
            <span className="font-bold uppercase tracking-wider text-[10px] text-slate-400 dark:text-slate-500">Related Operations:</span>
            {cleanTags.map(tag => (
              <span key={tag} className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px] font-medium text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300">
                {tag}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* 3. Sticky / Top Filter Bar */}
      <section className="border border-slate-200 bg-white p-4 rounded-xl shadow-xs space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4 dark:border-slate-800 dark:bg-slate-900">
        {/* Search inside this category */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </span>
          <input
            type="text"
            placeholder={`Search within ${series.name.replace(' Utilities', '')}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full font-sans text-xs text-slate-900 placeholder:text-slate-450 bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 focus:border-teal-500 focus:outline-none transition-all duration-150 dark:text-white dark:bg-slate-900 dark:border-slate-800 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Tags / Operation Filters & Sort */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-sans">
          
          {/* Operation type filter */}
          {opsInSeries.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <select
                value={selectedOp}
                onChange={(e) => setSelectedOp(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 py-2 px-2.5 rounded-lg focus:outline-none focus:border-teal-500 font-medium cursor-pointer dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200"
              >
                <option value="all">All Operations</option>
                {opsInSeries.map(op => (
                  <option key={op} value={op}>
                    {op.charAt(0).toUpperCase() + op.slice(1)}s
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Sort By selection */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-200 text-slate-800 py-2 px-2.5 rounded-lg focus:outline-none focus:border-teal-500 font-medium cursor-pointer dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200"
            >
              <option value="latest">Sort: Latest</option>
              <option value="title">Sort: A-Z Title</option>
            </select>
          </div>

        </div>
      </section>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <SimilarTopicsSidebar currentSeriesId={series.sectionId} />
        </aside>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-12">
          
          {postGuide && postGuide.sections.whatThisToolDoes && (
            <section className="bg-teal-50/60 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/50 p-6 rounded-2xl space-y-3 shadow-sm">
              <h3 className="font-display font-bold text-xs text-teal-700 dark:text-teal-300 uppercase tracking-wider">Functional Context & Purpose</h3>
              <p className="text-[13px] md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{postGuide.sections.whatThisToolDoes}</p>
            </section>
          )}

          {/* Sub-Section Cards */}
          {subSections.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-display font-extrabold text-lg text-slate-950 dark:text-white tracking-tight flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
                <Layers className="w-4 h-4 text-teal-650 dark:text-teal-400" /> Sub-sections inside {series.name}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subSections.map((sub) => {
                  return (
                    <div 
                      key={sub.id} 
                      className="bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-teal-350 dark:hover:border-teal-500 hover:shadow-md transition-all duration-250 group"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <h3 className="font-display font-bold text-base text-slate-950 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            {sub.name}
                          </h3>
                          <span className="text-[10px] font-sans font-bold text-slate-600 bg-slate-50 dark:text-slate-300 dark:bg-slate-950 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-800">
                            {sub.utilityCount} utilities
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                          {sub.description}
                        </p>
                      </div>
                      <div className="pt-5">
                        <Link 
                          href={`/blog/series/${seriesSlug}/${sub.slug}`}
                          className="inline-flex w-full items-center justify-center py-2 bg-white border border-slate-200 hover:border-teal-500 hover:bg-slate-50 hover:text-teal-700 text-slate-700 rounded-lg font-sans font-semibold text-xs transition-all gap-1 group/btn dark:bg-slate-900 dark:border-slate-800 dark:hover:border-teal-500 dark:hover:text-teal-450 dark:hover:bg-slate-950 dark:text-slate-300"
                        >
                          View Sub-Section <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Complete Guides List with Tabs */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-4">
              <h2 className="font-display font-extrabold text-lg text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-650 dark:text-teal-400" /> Guide Articles
              </h2>
              
              <div className="flex gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-sans">
                <button
                  onClick={() => {
                    setActiveTab('recent');
                  }}
                  className={`px-4 py-1.5 rounded-lg font-bold transition-all duration-150 ${
                    activeTab === 'recent'
                      ? 'bg-teal-700 text-white shadow-sm dark:bg-teal-600'
                      : 'text-slate-600 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-400'
                  }`}
                >
                  Recent Guides
                </button>
                <button
                  onClick={() => {
                    setActiveTab('featured');
                  }}
                  className={`px-4 py-1.5 rounded-lg font-bold transition-all duration-150 ${
                    activeTab === 'featured'
                      ? 'bg-teal-700 text-white shadow-sm dark:bg-teal-600'
                      : 'text-slate-600 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-400'
                  }`}
                >
                  Featured Guides
                </button>
              </div>
            </div>

            {paginatedGuides.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {paginatedGuides.map((guide) => (
                  <BlogCard key={guide.id} post={guide} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white border border-slate-200 border-dashed rounded-xl p-8 dark:bg-slate-900 dark:border-slate-800">
                <p className="font-sans text-slate-500 dark:text-slate-400 text-xs md:text-sm">No guides matching your filters.</p>
              </div>
            )}

            {/* Read More Control */}
            {visibleCount < filteredAndSortedGuides.length && (
              <div className="flex items-center justify-center pt-6">
                <button
                  onClick={() => setVisibleCount(prev => prev + 12)}
                  className="px-6 py-3 bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-755 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-teal-700 dark:hover:text-teal-300 dark:text-slate-300 rounded-xl font-sans font-semibold text-xs transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                >
                  Read more
                </button>
              </div>
            )}
          </section>

          {/* 5. Related Categories Section */}
          {relatedCategories.length > 0 && (
            <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h2 className="font-display font-extrabold text-lg text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-650 dark:text-teal-400" /> Explore Related Categories
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {relatedCategories.map(cat => {
                  const count = toolRegistry.filter(t => t.sectionId === cat.sectionId).length;
                  return (
                    <BlogCategoryCard key={cat.id} category={cat} count={count} />
                  );
                })}
              </div>
            </section>
          )}

          {/* 6. SEO Content Block at Bottom */}
          <section className="border border-slate-200 rounded-2xl p-6 md:p-8 space-y-6 shadow-sm pt-6 border-t font-sans text-[13px] md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 dark:border-slate-800">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-display font-bold text-base text-slate-950 dark:text-white">
                Understanding {series.name}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-bold text-slate-950 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-teal-600 dark:text-teal-400" /> What this category contains
                </h4>
                <p>
                  This series features secure, offline-first calculation, formatting, and analysis tools. Whether you need to process large documents, clean structured code, or compute financial formulas, the utilities listed here execute instantly in-memory.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-slate-950 dark:text-white flex items-center gap-1.5">
                  <Lock className="w-4.5 h-4.5 text-teal-600 dark:text-teal-400" /> Safe Usage Note (Privacy First)
                </h4>
                <p>
                  At Singulariti, your data security is our highest priority. All utilities in this category run fully client-side using JavaScript, WebAssembly, and local workers. No files, code blocks, or parameters are uploaded to external databases.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <h4 className="font-bold text-slate-950 dark:text-white mb-2">Common Tasks & Workflows</h4>
              <p>
                Common operations include compressing files before email distribution, cleaning minified API payloads, generating secure WiFi scan-points, and tracking chronological date lists. Start using any tool by clicking the &quot;Use Tool&quot; button on the guide cards above.
              </p>
            </div>
          </section>

        </div>

      </div>

      {/* Bottom Back Actions */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-slate-600 hover:text-teal-700 dark:text-slate-350 dark:hover:text-teal-200 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blog Home
        </Link>
      </div>

    </div>
  );
}
