"use client";

import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, Layers, Sparkles } from 'lucide-react';
import { BlogHero } from './BlogHero';
import { BlogCard } from './BlogCard';
import { FeaturedBlogCard } from './FeaturedBlogCard';
import { WhoCanUseSingulariti } from './WhoCanUseSingulariti';
import { BlogPost, getSectionIdFromCategorySlug } from '@/lib/blog';

interface BlogListingClientProps {
  posts: BlogPost[];
  featuredPosts: BlogPost[];
}

export function BlogListingClient({ posts, featuredPosts }: BlogListingClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'latest' | 'title'>('latest');
  const [visibleCount, setVisibleCount] = useState(9);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisibleCount(9);
  }, [selectedCategory, searchQuery, sortBy]);

  // Clean category options matching requested list
  const categoryFilters = useMemo(() => {
    return [
      { name: "All Categories", slug: "all" },
      { name: "PDF Tools", slug: "pdf-utilities" },
      { name: "Image Tools", slug: "image-utilities" },
      { name: "Image Editing", slug: "image-editing-utilities" },
      { name: "QR Tools", slug: "qr-utilities" },
      { name: "Calculator Tools", slug: "calculator-utilities" },
      { name: "Developer Tools", slug: "developer-utilities" },
      { name: "Text Tools", slug: "text-utilities" },
      { name: "SEO Tools", slug: "seo-utilities" },
      { name: "Unit Converters", slug: "unit-conversion-utilities" },
      { name: "Office Converters", slug: "office-converters" },
      { name: "Productivity Tools", slug: "productivity-tools" }
    ];
  }, []);

  // Client-side filtering & sorting
  const filteredAndSortedPosts = useMemo(() => {
    let list = posts;

    // Filter by category
    if (selectedCategory !== 'all') {
      const selectedId = getSectionIdFromCategorySlug(selectedCategory);
      list = list.filter(p => {
        const postId = getSectionIdFromCategorySlug(p.categorySlug || p.category);
        return postId === selectedId;
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.excerpt.toLowerCase().includes(q) ||
        p.labels.some(l => l.toLowerCase().includes(q))
      );
    }

    // Sort posts
    if (sortBy === 'title') {
      return [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // sort by date desc
      return [...list].sort((a, b) => {
        const dateA = a.updatedAt || a.published || '';
        const dateB = b.updatedAt || b.published || '';
        return dateB.localeCompare(dateA);
      });
    }
  }, [posts, selectedCategory, searchQuery, sortBy]);

  // Slicing logic for visible posts list
  const paginatedPosts = useMemo(() => {
    return filteredAndSortedPosts.slice(0, visibleCount);
  }, [filteredAndSortedPosts, visibleCount]);

  // Determine if featured section should be shown
  // Hide featured section if filtering by category or searching to keep results focused
  const showFeatured = selectedCategory === 'all' && !searchQuery.trim();

  return (
    <div className="w-full">
      {/* 1. Hero Section */}
      <BlogHero />

      {/* 2. Who Can Use Singulariti? Section */}
      {showFeatured && <WhoCanUseSingulariti />}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1280px] mt-16 space-y-16">
        
        {/* 2. Featured Section */}
        {showFeatured && featuredPosts.length > 0 && (
          <section className="space-y-6">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="font-display font-extrabold text-2xl text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Featured Guides
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm font-sans mt-1">
                Hand-picked tutorials and comprehensive references covering essential operations.
              </p>
            </div>

            <div className="space-y-8">
              {/* Desktop: First post large, next 2 compact in a grid */}
              <div className="block">
                <FeaturedBlogCard 
                  title={featuredPosts[0].title}
                  description={featuredPosts[0].description}
                  categories={featuredPosts[0].labels}
                  published={featuredPosts[0].published}
                  readTime={featuredPosts[0].readTime}
                  url={featuredPosts[0].url}
                  image={featuredPosts[0].image}
                  imageAlt={featuredPosts[0].imageAlt}
                />
              </div>

              {featuredPosts.length > 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {featuredPosts.slice(1, 3).map((post, idx) => (
                    <FeaturedBlogCard 
                      key={idx} 
                      title={post.title}
                      description={post.description}
                      categories={post.labels}
                      published={post.published}
                      readTime={post.readTime}
                      url={post.url}
                      image={post.image}
                      imageAlt={post.imageAlt}
                      isCompact={true} 
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Start of listings tag for scroll anchor */}
        <div id="listings-start" className="scroll-mt-24" />

        {/* 3. Interactive Filter & Directory Bar */}
        <section className="space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-extrabold text-2xl text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Guides Directory
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm font-sans mt-1">
                Browse, search, and filter the complete collection of local browser utility tutorials.
              </p>
            </div>

            {/* Tags / Operation Filters & Sort */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-sans self-end md:self-auto">
              {/* Sort By selection */}
              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="border border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white py-2.5 px-3 rounded-lg focus:outline-none focus:border-teal-500 font-semibold cursor-pointer"
                >
                  <option value="latest">Sort: Latest</option>
                  <option value="title">Sort: A-Z Title</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search and Category Pills Bar */}
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              </span>
              <input
                type="text"
                placeholder="Search across all guides, topics, and tools..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                className="w-full font-sans text-xs border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl pl-10 pr-4 py-3.5 focus:border-teal-500 focus:outline-none transition-all duration-150 shadow-inner dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
              />
            </div>

            {/* Category Pills Slider */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin">
              {categoryFilters.map((cat) => {
                const isActive = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold font-sans transition-all duration-150 border whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'border-teal-600 bg-teal-600 text-white dark:border-teal-500 dark:bg-teal-500 dark:text-slate-950 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:text-teal-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-teal-700 dark:hover:text-teal-300'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Main Listing Grid */}
        <section className="space-y-8">
          {paginatedPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900 max-w-lg mx-auto">
              <h3 className="text-slate-900 dark:text-white font-semibold text-base">No guides found</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm font-sans mt-2">Try checking spelling or resetting filters!</p>
            </div>
          )}

          {/* Read More Control */}
          {visibleCount < filteredAndSortedPosts.length && (
            <div className="flex items-center justify-center pt-6 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setVisibleCount(prev => prev + 9)}
                className="px-6 py-3 border border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:text-teal-750 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-teal-700 dark:hover:text-teal-300 rounded-xl font-sans font-semibold text-xs transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
              >
                Read more
              </button>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
