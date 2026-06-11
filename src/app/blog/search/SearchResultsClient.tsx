"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { toolRegistry, sectionRegistry, subSectionRegistry, UtilityRegistryItem } from '@/content/tools/toolRegistry';
import { getAllPosts } from '@/lib/blog';
import { Play, ArrowLeft, ArrowRight, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search term
  const query = searchParams?.get('q') || '';
  const pageParam = parseInt(searchParams?.get('page') || '1', 10);
  const opParam = searchParams?.get('op') || '';

  // Filter States
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [selectedSubSection, setSelectedSubSection] = useState<string>('');
  const [selectedOpType, setSelectedOpType] = useState<string>(opParam);

  // Sync operation type filter if the URL parameter changes
  useEffect(() => {
    if (opParam) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedOpType(opParam);
    }
  }, [opParam]);

  // Reset page parameter on query or filter changes
  useEffect(() => {
    // Reset page logic when filters are manipulated by user
  }, [query, selectedSection, selectedSubSection, selectedOpType]);

  // Perform search and filter calculations
  const matchesQuery = (tool: UtilityRegistryItem) => {
    if (!query) return true;
    const term = query.toLowerCase();
    const sec = sectionRegistry.find(s => s.id === tool.sectionId);
    const sub = subSectionRegistry.find(ss => ss.id === tool.subSectionId);
    const matchesSection = sec ? sec.name.toLowerCase().includes(term) : false;
    const matchesSubSection = sub ? sub.name.toLowerCase().includes(term) : false;
    
    return (
      tool.name.toLowerCase().includes(term) ||
      tool.shortDescription.toLowerCase().includes(term) ||
      matchesSection ||
      matchesSubSection
    );
  };

  const matchesFilters = (tool: UtilityRegistryItem) => {
    if (selectedSection && tool.sectionId !== selectedSection) return false;
    if (selectedSubSection && tool.subSectionId !== selectedSubSection) return false;
    if (selectedOpType && tool.operationType !== selectedOpType) return false;
    return true;
  };

  const filteredResults = toolRegistry.filter(tool => matchesQuery(tool) && matchesFilters(tool));

  // Search Blog Posts
  const allPosts = getAllPosts();
  const blogResults = allPosts.filter(post => {
    if (!query) return false; // Show posts only if there's a search query? Or show all if empty? Let's show matching if query.
    if (!query && !selectedSection && !selectedSubSection && !selectedOpType) return true;
    
    const term = query.toLowerCase();
    const titleMatch = post.title ? post.title.toLowerCase().includes(term) : false;
    const descMatch = post.metaDescription ? post.metaDescription.toLowerCase().includes(term) : false;
    return titleMatch || descMatch;
  });

  // Pagination Parameters
  const pageSize = 12;
  const totalPages = Math.ceil(filteredResults.length / pageSize);
  const currentPage = Math.max(1, Math.min(pageParam, totalPages || 1));
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedResults = filteredResults.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      const filters = new URLSearchParams();
      if (query) filters.set('q', query);
      if (selectedOpType) filters.set('op', selectedOpType);
      filters.set('page', page.toString());
      router.push(`/blog/search?${filters.toString()}`);
    }
  };

  // Extract unique operation types from results to populate search filter option list
  const availableOpTypes = Array.from(new Set(toolRegistry.map(t => t.operationType)));

  return (
    <div className="container mx-auto px-4 md:px-6 max-w-7xl space-y-8">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-sans text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-teal-700 dark:hover:text-teal-300 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-teal-700 dark:hover:text-teal-300 transition-colors">Blog</Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-semibold">Search Results</span>
      </div>

      {/* Heading Results Banner */}
      <header className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-2">
        <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
          Search results for &ldquo;<span className="text-teal-700 dark:text-teal-400">{query || selectedOpType || 'all tools'}</span>&rdquo;
        </h1>
        <p className="font-sans text-xs text-slate-600 dark:text-slate-300">
          Found {filteredResults.length} matching utility tools. Use the filter settings below to narrow down your results.
        </p>
      </header>

      {/* Search Inputs & Filters Panel */}
      <section className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-6 shadow-xs dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-display font-bold text-slate-950 dark:text-white uppercase tracking-wider">
          <SlidersHorizontal className="w-4 h-4 text-teal-700 dark:text-teal-400" /> Filter Options
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
          
          {/* Main Section Filter */}
          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-slate-300 font-semibold block">Main Section</label>
            <select
              value={selectedSection}
              onChange={(e) => {
                setSelectedSection(e.target.value);
                setSelectedSubSection(''); // reset subsection on section change
              }}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:focus:border-teal-600"
            >
              <option value="">All Sections</option>
              {sectionRegistry.map(sec => (
                <option key={sec.id} value={sec.id}>{sec.name}</option>
              ))}
            </select>
          </div>

          {/* Sub-section Filter */}
          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-slate-300 font-semibold block">Sub-Section</label>
            <select
              value={selectedSubSection}
              onChange={(e) => setSelectedSubSection(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:focus:border-teal-600 disabled:opacity-50"
              disabled={!selectedSection}
            >
              <option value="">All Sub-Sections</option>
              {subSectionRegistry
                .filter(ss => ss.sectionId === selectedSection)
                .map(ss => (
                  <option key={ss.id} value={ss.id}>{ss.name}</option>
                ))}
            </select>
          </div>

          {/* Operation Type Filter */}
          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-slate-300 font-semibold block">Operation Type</label>
            <select
              value={selectedOpType}
              onChange={(e) => setSelectedOpType(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none dark:bg-slate-950 dark:border-slate-800 dark:text-white dark:focus:border-teal-600"
            >
              <option value="">All Operations</option>
              {availableOpTypes.map(op => (
                <option key={op} value={op}>
                  {op.charAt(0).toUpperCase() + op.slice(1)}
                </option>
              ))}
            </select>
          </div>

        </div>
      </section>

      {/* Results Listings Grid */}
      <section className="space-y-12 max-w-5xl">
        
        {/* Blog Guides Results */}
        {blogResults.length > 0 && (
          <div className="space-y-6">
            <h2 className="font-display font-bold text-xl text-slate-950 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
              Related Articles & Guides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogResults.map((post) => (
                <Link 
                  key={post.slug}
                  href={post.url}
                  className="bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 p-5 rounded-2xl hover:border-teal-350 dark:hover:border-teal-700 transition-all flex flex-col gap-2 group"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 px-2 py-0.5 rounded">
                      Guide
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{post.publishedAt}</span>
                  </div>
                  <h3 className="font-display font-bold text-base text-slate-950 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                    {post.metaDescription}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Tool Results */}
        <div className="space-y-6">
          <h2 className="font-display font-bold text-xl text-slate-950 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
            Utility Tools
          </h2>
        {paginatedResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedResults.map((tool) => {
              const sec = sectionRegistry.find(s => s.id === tool.sectionId);
              const sub = subSectionRegistry.find(ss => ss.id === tool.subSectionId);
              return (
                <div 
                  key={tool.id}
                  className="bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-2xl p-5 hover:border-teal-300 dark:hover:border-teal-900 transition-all flex flex-col justify-between shadow-xs"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1.5 items-center mb-1">
                      <span className="text-[9px] font-mono text-slate-600 dark:text-slate-300 bg-slate-200/50 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {sec?.name || 'Utility'}
                      </span>
                      <span className="text-[9px] font-mono text-slate-600 dark:text-slate-300 bg-slate-200/50 dark:bg-slate-800 px-2 py-0.5 rounded">
                        {sub?.name || 'General'}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-base text-slate-950 dark:text-white leading-snug">
                      {tool.name}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {tool.shortDescription}
                    </p>

                    {/* Input Output Metrics */}
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-200/40 dark:bg-slate-950 dark:border-slate-800/40 p-3 rounded-xl text-[9px] font-sans">
                      <div>
                        <strong className="text-slate-950 dark:text-white block uppercase tracking-wider mb-0.5">Inputs</strong>
                        <span className="text-slate-600 dark:text-slate-300 block truncate">{tool.inputType.join(', ')}</span>
                      </div>
                      <div>
                        <strong className="text-slate-950 dark:text-white block uppercase tracking-wider mb-0.5">Outputs</strong>
                        <span className="text-slate-600 dark:text-slate-300 block truncate">{tool.outputType.join(', ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-6 mt-4 border-t border-slate-200 dark:border-slate-800/40 text-xs font-semibold">
                    <Link 
                      href={tool.utilityUrl}
                      className="flex-1 text-center py-2.5 bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white rounded-xl transition-colors inline-flex items-center justify-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-white" /> Use Tool
                    </Link>
                    <Link 
                      href={`/blog/guides/${tool.guideSlug}`}
                      className="flex-1 text-center py-2.5 bg-white border border-slate-200 hover:border-teal-300 hover:text-teal-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-teal-700 dark:hover:text-teal-300 rounded-xl transition-all inline-flex items-center justify-center gap-1"
                    >
                      Read Guide <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-dashed rounded-2xl">
            <p className="font-sans text-slate-600 dark:text-slate-300 text-sm">No utility tools matched your search parameters.</p>
          </div>
        )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-8 font-sans text-xs">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border border-slate-200 dark:border-slate-800 hover:border-teal-700 dark:hover:border-teal-500 rounded-xl text-slate-600 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-300 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-400 transition-all"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 rounded-xl font-bold transition-all border ${
                  currentPage === page
                    ? 'bg-teal-700 text-white border-teal-700 shadow-xs dark:bg-teal-600 dark:border-teal-500'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400 hover:text-teal-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:text-teal-300'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border border-slate-200 dark:border-slate-800 hover:border-teal-700 dark:hover:border-teal-500 rounded-xl text-slate-600 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-300 disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-400 transition-all"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
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
  );
}

export { SearchResultsContent };
