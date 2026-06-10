import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BlogCard } from '@/components/blog/BlogCard';
import { BLOG_CATEGORIES, BLOG_POSTS } from '@/data/blogs';
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

  const posts = BLOG_POSTS.filter((post) => post.categorySlug === category);

  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-[13px] font-sans text-slate mb-8 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <Link href="/blog" className="hover:text-primary transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-ink font-semibold">{catData.name}</span>
          </nav>

          {/* Header */}
          <header className="max-w-4xl mb-12 space-y-4">
            <h1 className="font-display font-bold text-3xl md:text-5xl text-ink leading-tight tracking-tight flex items-center gap-3">
              <FolderOpen className="w-8 h-8 text-primary" /> {catData.name} Guides
            </h1>
            <p className="font-sans text-base md:text-lg text-slate leading-relaxed max-w-2xl">
              {catData.description}
            </p>
            <div className="text-xs text-slate font-sans bg-surface/50 border border-border px-4 py-2 rounded-xl inline-block">
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
            <div className="text-center py-12 bg-surface border border-border rounded-2xl max-w-lg mx-auto">
              <p className="text-sm text-slate">No guides published in this category yet. Stay tuned!</p>
            </div>
          )}

          {/* Back button */}
          <div className="pt-12 border-t border-border/40 mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-slate hover:text-primary transition-colors group text-xs font-sans font-semibold"
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
