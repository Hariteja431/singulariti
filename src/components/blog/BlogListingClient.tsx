"use client";

import React, { useState, useMemo } from 'react';
import { NormalizedBlogPost } from '@/data/audienceArticles';
import FeaturedBlogCard from './FeaturedBlogCard';
import CategoryFilter from './CategoryFilter';
import { BlogCard } from './BlogCard';
import { Grid } from 'lucide-react';

interface BlogListingClientProps {
  posts: NormalizedBlogPost[];
}

export default function BlogListingClient({ posts }: BlogListingClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [visibleCount, setVisibleCount] = useState<number>(9);

  // Extract unique categories (excluding general unless explicitly categorized)
  const categories = useMemo(() => {
    const list = posts.map(p => p.category);
    return Array.from(new Set(list)).filter(Boolean);
  }, [posts]);

  // The very first post marked featured, or the first detailed post, is our featured post
  const featuredPost = useMemo(() => {
    return posts.find(p => p.contentLevel === 'detailed') || posts[0];
  }, [posts]);

  // Filter posts based on active category, and exclude the currently featured post
  const filteredPosts = useMemo(() => {
    let list = posts.filter(p => p.id !== featuredPost?.id);
    if (selectedCategory !== "All") {
      list = list.filter(p => p.category === selectedCategory);
    }
    return list;
  }, [posts, selectedCategory, featuredPost]);

  const displayedPosts = useMemo(() => {
    return filteredPosts.slice(0, visibleCount);
  }, [filteredPosts, visibleCount]);

  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setVisibleCount(9); // Reset count on category change
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 9);
  };

  return (
    <div className="space-y-12">
      {/* 5. Featured Article Section */}
      {featuredPost && selectedCategory === "All" && (
        <section className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <span className="font-display font-bold text-xs uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Featured Guide
            </span>
          </div>
          <FeaturedBlogCard post={featuredPost} />
        </section>
      )}

      {/* 6. Category Filters */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Grid className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Filter by Category
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'guide' : 'guides'}
          </span>
        </div>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />
      </section>

      {/* 7. Latest Blog Cards Grid */}
      <section className="space-y-10">
        {displayedPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              No articles found in this category.
            </p>
          </div>
        )}

        {/* Load More Button */}
        {filteredPosts.length > visibleCount && (
          <div className="flex justify-center pt-4">
            <button
              onClick={handleLoadMore}
              className="px-6 py-3 text-sm font-semibold rounded-full bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white transition-colors duration-200 shadow-sm"
            >
              Load More Guides
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
