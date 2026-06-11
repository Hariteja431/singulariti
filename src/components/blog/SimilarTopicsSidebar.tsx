import React from 'react';
import Link from 'next/link';
import { blogSeriesList, toolRegistry } from '@/content/tools/toolRegistry';
import { BookOpen } from 'lucide-react';

interface SimilarTopicsSidebarProps {
  currentSeriesId?: string;
}

export function SimilarTopicsSidebar({ currentSeriesId }: SimilarTopicsSidebarProps) {
  return (
    <div className="border border-slate-200 bg-white p-6 rounded-2xl space-y-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="font-display font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-3">
        <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
        Similar Topics
      </h3>
      
      {/* Desktop Vertical List / Mobile Horizontal Scroll */}
      <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none whitespace-nowrap lg:whitespace-normal">
        {blogSeriesList.map((series) => {
          const count = toolRegistry.filter(t => t.sectionId === series.sectionId).length;
          const isActive = currentSeriesId === series.sectionId;
          
          return (
            <Link
              key={series.id}
              href={`/blog/series/${series.slug}`}
              className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border text-xs font-sans font-semibold transition-all flex-shrink-0 lg:flex-shrink-1 ${
                isActive
                  ? 'bg-teal-600 text-white border-teal-600 dark:bg-teal-700 dark:border-teal-700 shadow-sm'
                  : 'bg-white hover:bg-teal-50/50 hover:border-teal-300 dark:hover:bg-slate-850 dark:hover:border-teal-850 border-slate-200 dark:border-slate-800 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-300'
              }`}
            >
              <span>{series.name}</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md ${
                isActive ? 'bg-teal-700 dark:bg-teal-850 text-white' : 'bg-slate-100 dark:bg-slate-850 text-slate-500 dark:text-slate-400'
              }`}>
                {count}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
