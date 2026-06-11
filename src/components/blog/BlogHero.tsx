"use client";

import React from 'react';
import { BlogSearchAutocomplete } from './BlogSearchAutocomplete';

export function BlogHero() {
  return (
    <section className="relative w-full py-16 md:py-20 bg-gradient-to-b from-white via-slate-50 to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-white border-b border-slate-150 dark:border-slate-800 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1280px] relative z-10">
        <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
          {/* Heading */}
          <h1 className="font-display font-extrabold text-4xl md:text-6xl text-slate-950 dark:text-white leading-tight tracking-tight">
            Blog
          </h1>
          <p className="font-sans text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Singulariti blog helps users understand tools, file workflows, formatting, conversion, compression, SEO, text utilities, calculators, and productivity tools.
          </p>

          {/* Search bar wrapper */}
          <div className="w-full max-w-2xl border border-slate-200 bg-white text-slate-900 shadow-sm rounded-2xl p-2.5 focus-within:border-teal-300 transition-all duration-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white">
            <BlogSearchAutocomplete />
          </div>
        </div>
      </div>
    </section>
  );
}
