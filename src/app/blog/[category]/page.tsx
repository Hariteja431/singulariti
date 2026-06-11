import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BlogCard } from '@/components/blog/BlogCard';
import { Breadcrumbs } from '@/components/blog/Breadcrumbs';
import { BLOG_CATEGORIES, BLOG_POSTS } from '@/data/blogs';
import { constructMetadata } from '@/lib/seo/metadata';
import { FolderOpen, ArrowLeft } from 'lucide-react';

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

  const posts = BLOG_POSTS.filter((post) => post.categorySlug === category);

  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-white text-slate-900 dark:bg-slate-950 dark:text-white pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1280px]">
          
          {/* Breadcrumbs */}
          <Breadcrumbs items={[{ name: catData.name }]} />

          {/* Header */}
          <header className="relative bg-gradient-to-br from-teal-500/5 to-white dark:to-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl space-y-4 shadow-sm overflow-hidden mb-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none translate-x-20 -translate-y-20" />
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-teal-700 dark:text-teal-400 bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/30 text-[11px] font-sans font-semibold">
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Guide Category Directory</span>
            </div>
            
            <h1 className="font-display font-extrabold text-3xl md:text-5xl text-slate-950 dark:text-white tracking-tight">
              {catData.name}
            </h1>
            <p className="font-sans text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
              {catData.description}
            </p>
            <div className="text-[11px] font-sans text-slate-600 dark:text-slate-300 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg inline-block font-semibold dark:bg-slate-900 dark:border-slate-800">
              Focus Length: <strong>{catData.recommendedWordCount}</strong>
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
            <div className="text-center py-16 bg-slate-50 border border-slate-200 border-dashed rounded-2xl max-w-lg mx-auto p-8 dark:bg-slate-900 dark:border-slate-800">
              <p className="text-sm text-slate-600 dark:text-slate-300 font-sans">No guides published in this category yet. Stay tuned!</p>
            </div>
          )}

          {/* Back button */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-700 dark:text-slate-400 dark:hover:text-teal-300 transition-colors group text-sm font-sans font-semibold"
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
