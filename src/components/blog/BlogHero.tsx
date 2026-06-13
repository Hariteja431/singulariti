import React from 'react';
import { BookOpen } from 'lucide-react';

export default function BlogHero() {
  return (
    <section className="w-full py-16 bg-gradient-to-b from-white via-slate-50 to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white">
      <div className="max-w-4xl mx-auto text-center px-4 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/60 text-teal-700 dark:text-teal-300 text-[13px] font-sans font-medium">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Singulariti Educational Library</span>
        </div>
        
        <h1 className="font-display font-bold text-4xl md:text-6xl text-slate-950 dark:text-white leading-tight tracking-tight">
          Blog
        </h1>
        
        <p className="font-sans text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
          Singulariti blog helps users understand tools, file workflows, formatting, conversion, compression, SEO, text utilities, calculators, and productivity tools.
        </p>
      </div>
    </section>
  );
}
