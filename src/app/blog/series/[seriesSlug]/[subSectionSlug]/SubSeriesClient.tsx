"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  blogSeriesList,
  blogSubSeriesList
} from '@/content/tools/toolRegistry';
import { getUnifiedPosts } from '@/lib/blog';
import { SimilarTopicsSidebar } from '@/components/blog/SimilarTopicsSidebar';
import { BlogCard } from '@/components/blog/BlogCard';
import { Breadcrumbs } from '@/components/blog/Breadcrumbs';
import { 
  ArrowLeft, 
  ChevronRight, 
  Layers
} from 'lucide-react';

interface SubSeriesContentProps {
  seriesSlug: string;
  subSectionSlug: string;
}

export function SubSeriesContent({ seriesSlug, subSectionSlug }: SubSeriesContentProps) {

  // Find series info
  const series = blogSeriesList.find(s => s.slug === seriesSlug);
  if (!series) {
    notFound();
  }

  // Find sub-series info
  const subSection = blogSubSeriesList.find(
    ss => ss.slug === subSectionSlug && ss.seriesId === series.sectionId
  );
  if (!subSection) {
    notFound();
  }

  // Filter guides belonging strictly to this sub-section from unified posts
  const guides = useMemo(() => {
    return getUnifiedPosts().filter(p => p.subSeriesId === subSection.id);
  }, [subSection.id]);

  // Slicing logic for visible guides list
  const [visibleCount, setVisibleCount] = useState(12);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisibleCount(12);
  }, [seriesSlug, subSectionSlug]);

  const paginatedGuides = useMemo(() => {
    return guides.slice(0, visibleCount);
  }, [guides, visibleCount]);

  // Get other subsections of the same section for the sidebar layout
  const siblingSubsections = blogSubSeriesList.filter(
    ss => ss.seriesId === series.sectionId && ss.id !== subSection.id
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1280px] space-y-12">
      
      {/* Breadcrumbs */}
      <Breadcrumbs 
        items={[
          { name: series.name, url: `/blog/series/${seriesSlug}` },
          { name: subSection.name }
        ]} 
      />

      {/* Header Title */}
      <header className="relative bg-gradient-to-br from-teal-500/5 to-white dark:to-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl space-y-4 shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none translate-x-20 -translate-y-20" />
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-teal-700 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/30 text-[11px] font-sans font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>Sub-Series Guide List</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl md:text-5xl text-slate-950 dark:text-white tracking-tight">
          {subSection.name}
        </h1>
        <p className="font-sans text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
          {subSection.description}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          <SimilarTopicsSidebar currentSeriesId={series.sectionId} />
          
          {/* Sibling Subsections Widget */}
          {siblingSubsections.length > 0 && (
            <div className="bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-5 rounded-2xl space-y-3.5 shadow-sm">
              <h3 className="font-display font-bold text-xs text-slate-950 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" /> Other {series.name.replace(' Utilities', '')} Groups
              </h3>
              <ul className="space-y-2.5 text-xs font-sans">
                {siblingSubsections.map(sib => (
                  <li key={sib.id}>
                    <Link 
                      href={`/blog/series/${seriesSlug}/${sib.slug}`}
                      className="text-slate-600 hover:text-teal-700 dark:text-slate-400 dark:hover:text-teal-300 font-semibold transition-colors flex items-center gap-1 hover:underline truncate"
                    >
                      <ChevronRight className="w-3 h-3 text-slate-400/40 dark:text-slate-500/40" />
                      <span>{sib.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex justify-between items-center text-xs font-sans text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="font-semibold text-slate-600 dark:text-slate-300">Guide List</span>
          </div>

          {paginatedGuides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {paginatedGuides.map((guide) => (
                <BlogCard key={guide.id} post={guide} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-50 border border-slate-200 border-dashed rounded-xl p-8 dark:bg-slate-900 dark:border-slate-850">
              <p className="font-sans text-slate-600 dark:text-slate-300 text-sm">No utility guides found under this sub-section.</p>
            </div>
          )}

          {/* Read More Control */}
          {visibleCount < guides.length && (
            <div className="flex items-center justify-center pt-6">
              <button
                onClick={() => setVisibleCount(prev => prev + 12)}
                className="px-6 py-3 bg-white border border-slate-200 hover:border-teal-300 hover:text-teal-700 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-teal-700 dark:hover:text-teal-300 text-slate-700 dark:text-slate-300 rounded-xl font-sans font-semibold text-xs transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
              >
                Read more
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Navigation Back */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
        <Link 
          href={`/blog/series/${seriesSlug}`} 
          className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-slate-600 hover:text-teal-700 dark:text-slate-400 dark:hover:text-teal-300 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to {series.name} Series
        </Link>
      </div>

    </div>
  );
}
