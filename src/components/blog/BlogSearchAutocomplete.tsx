'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toolRegistry } from '@/content/tools/toolRegistry';
import { getAllPosts } from '@/lib/blog';

export function BlogSearchAutocomplete() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/blog/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(e.target.value.trim().length > 0);
  };

  // Get matching tools (for dynamic guides)
  const matchingTools = toolRegistry
    .filter(tool => 
      tool.name.toLowerCase().includes(query.toLowerCase()) || 
      tool.shortDescription.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 3);

  // Get matching manual blog posts
  const allPosts = getAllPosts();
  const matchingPosts = allPosts
    .filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) || 
      (post.description && post.description.toLowerCase().includes(query.toLowerCase())) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(query.toLowerCase()))
    )
    .slice(0, 3);

  const hasResults = matchingTools.length > 0 || matchingPosts.length > 0;

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <form onSubmit={handleSubmit} className="relative flex gap-3">
        <div className="relative flex-1 flex items-center border border-slate-200 bg-white text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white rounded-xl px-3.5 py-1">
          <span className="flex items-center pointer-events-none mr-2">
            <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </span>
          <input
            suppressHydrationWarning
            type="text"
            name="q"
            value={query}
            onChange={handleInputChange}
            onFocus={() => { if (query.trim()) setIsOpen(true); }}
            placeholder="Search JSON, PDF, word counter, or calculation formulas..."
            required
            autoComplete="off"
            className="w-full font-sans text-sm py-2 bg-transparent text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500 focus:outline-none"
          />
        </div>
        <button
          suppressHydrationWarning
          type="submit"
          className="bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-700 dark:hover:bg-teal-600 font-sans font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-sm flex-shrink-0"
        >
          Search
        </button>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 border border-slate-200 bg-white shadow-lg dark:border-slate-800 dark:bg-slate-900 rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          {hasResults ? (
            <div className="max-h-[300px] overflow-y-auto p-2">
              
              {matchingPosts.length > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Manual Guides
                  </div>
                  {matchingPosts.map(post => (
                    <Link
                      key={post.slug}
                      href={post.url}
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2.5 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-950/20 transition-colors"
                    >
                      <div className="font-display font-bold text-[13px] text-slate-900 dark:text-white mb-0.5">
                        {post.title}
                      </div>
                      <div className="font-sans text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1">
                        {post.excerpt}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {matchingTools.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Utility Guides
                  </div>
                  {matchingTools.map(tool => (
                    <Link
                      key={tool.id}
                      href={`/blog/guides/${tool.guideSlug}`}
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2.5 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-950/20 transition-colors"
                    >
                      <div className="font-display font-bold text-[13px] text-slate-900 dark:text-white mb-0.5 flex justify-between">
                        <span>{tool.name} Guide</span>
                        <ArrowRight className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div className="font-sans text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1">
                        {tool.shortDescription}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/60">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full px-3 py-2 text-center text-[12px] font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-200 transition-colors"
                >
                  View all results for "{query}"
                </button>
              </div>

            </div>
          ) : (
            <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-xs font-sans">
              No matching guides found for "{query}".
            </div>
          )}
        </div>
      )}
    </div>
  );
}
