import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BlogCard } from '@/components/blog/BlogCard';
import { BLOG_CATEGORIES, BLOG_POSTS } from '@/data/blogs';
import { normalizeDataPost } from '@/lib/blog';
import { constructMetadata } from '@/lib/seo/metadata';
import { ChevronRight, FolderOpen, ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return Object.keys(BLOG_CATEGORIES).map((key) => ({
    category: key,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const catData = BLOG_CATEGORIES[category];

  if (!catData) {
    return {
      title: 'Category Not Found',
    };
  }

  return constructMetadata({
    title: `${catData.name} Guides | Singulariti`,
    description: catData.description,
    path: `/blog/${catData.slug}`,
  });
}

export default async function BlogCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const catData = BLOG_CATEGORIES[category];

  if (!catData) {
    notFound();
  }

  const posts = BLOG_POSTS.filter((post) => post.categorySlug === category).map(normalizeDataPost);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-[13px] font-sans text-slate-500 dark:text-slate-400 mb-8 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-teal-700 dark:hover:text-teal-350 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <Link href="/blog" className="hover:text-teal-700 dark:hover:text-teal-350 transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-slate-900 dark:text-white font-semibold">{catData.name}</span>
          </nav>

          {/* Header */}
          <header className="max-w-4xl mb-12 space-y-4">
            <h1 className="font-display font-bold text-3xl md:text-5xl text-slate-950 dark:text-white leading-tight tracking-tight flex items-center gap-3">
              <FolderOpen className="w-8 h-8 text-teal-600 dark:text-teal-400" /> {catData.name} Guides
            </h1>
            <p className="font-sans text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              {catData.description}
            </p>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-sans bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800/80 px-4 py-2 rounded-xl inline-block">
              Recommended Content Focus: <strong>{catData.recommendedWordCount}</strong> (~{catData.recommendedLineCount})
            </div>
          </header>

          {/* Blog cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>

          {/* Empty state */}
          {posts.length === 0 && (
            <div className="text-center py-12 bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-2xl max-w-lg mx-auto">
              <p className="text-sm text-slate-600 dark:text-slate-400">No guides published in this category yet. Stay tuned!</p>
            </div>
          )}

          {/* Back button */}
          <div className="pt-12 border-t border-slate-200 dark:border-slate-800/80 mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-700 dark:text-slate-350 dark:hover:text-teal-300 transition-colors group text-xs font-sans font-semibold"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Blog Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
