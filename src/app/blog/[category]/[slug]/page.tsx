import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/blog/Breadcrumbs';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { BlogSection } from '@/components/blog/BlogSection';
import { RelatedTools } from '@/components/blog/RelatedTools';
import { FAQAccordion } from '@/components/blog/FAQAccordion';
import { FinalCTA } from '@/components/blog/FinalCTA';
import { SchemaJsonLd } from '@/components/blog/SchemaJsonLd';
import { BLOG_POSTS, BLOG_CATEGORIES } from '@/data/blogs';
import { constructMetadata } from '@/lib/seo/metadata';
import { Clock, Shield, Play, ArrowLeft, ArrowRight } from 'lucide-react';

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    category: post.categorySlug,
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug && p.categorySlug === category);

  if (!post) {
    return {
      title: 'Guide Not Found',
    };
  }

  return constructMetadata({
    title: post.seoTitle,
    description: post.metaDescription,
    path: `/blog/${post.categorySlug}/${post.slug}`,
    type: 'article',
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { category, slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug && p.categorySlug === category);

  if (!post) {
    notFound();
  }

  const catData = BLOG_CATEGORIES[category];

  // Previous and Next post navigation links
  const categoryPosts = BLOG_POSTS.filter((p) => p.categorySlug === category);
  const currentIndex = categoryPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? categoryPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < categoryPosts.length - 1 ? categoryPosts[currentIndex + 1] : null;

  return (
    <>
      <SchemaJsonLd post={post} />
      <Header />
      
      <main className="flex-1 w-full bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          
          {/* Breadcrumb Navigation */}
          <Breadcrumbs
            items={[
              { name: catData?.name || post.category, url: `/blog/${post.categorySlug}` },
              { name: post.toolName }
            ]}
          />

          {/* Article Header */}
          <header className="max-w-4xl mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                {post.category}
              </span>
              <span className="text-[11px] font-sans text-slate flex items-center gap-1 bg-border/40 px-2.5 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5 text-primary" /> {post.readTime}
              </span>
            </div>

            <h1 className="font-display font-bold text-3xl md:text-5xl text-ink leading-tight tracking-tight mb-6">
              {post.title}
            </h1>

            <p className="text-slate text-base md:text-lg font-sans leading-relaxed mb-6">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/60 text-slate text-[13px] font-sans">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="font-medium text-[12px] text-primary">Local Browser-Side Processing (Privacy Guaranteed)</span>
              </div>
              <span className="text-xs text-slate-400 bg-surface/50 border border-border px-3 py-1 rounded-lg">
                Focus target: {post.wordCountTarget} ({post.lineCountTarget})
              </span>
            </div>
          </header>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
            
            {/* Sidebar Table of Contents */}
            <aside className="hidden lg:block lg:col-span-1">
              <TableOfContents sections={post.sections} />
            </aside>

            {/* Post Workspace */}
            <div className="lg:col-span-2 space-y-10 max-w-3xl blog-article-content">
              
              {/* Tool CTA Block */}
              <div className="p-6 bg-primary/[0.03] border border-primary/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1.5 text-center sm:text-left">
                  <h4 className="font-sans font-bold text-sm text-ink">Utility Tool: {post.toolName}</h4>
                  <p className="font-sans text-xs text-slate max-w-md">No uploads to servers. Fast browser-side processing.</p>
                </div>
                <div className="flex gap-2.5 w-full sm:w-auto">
                  <Link 
                    href={post.toolUrl}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center px-5 py-3 bg-primary hover:bg-primary/95 text-white font-sans font-bold text-xs rounded-xl transition-all shadow-sm gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" /> Open Tool
                  </Link>
                </div>
              </div>

              {/* Dynamic Blog Sections */}
              <div className="space-y-8">
                {post.sections.map((section) => (
                  <BlogSection key={section.id} section={section} />
                ))}
              </div>

              {/* FAQ Section Accordion */}
              <FAQAccordion faqs={post.faqs} />

              {/* Related Tools Navigation Links */}
              <RelatedTools tools={post.relatedTools} />

              {/* Final Bottom Call-to-Action */}
              <FinalCTA toolName={post.toolName} toolUrl={post.toolUrl} />

              {/* Navigation Pagination */}
              <div className="pt-6 border-t border-border/40 flex justify-between items-center text-xs font-sans font-semibold text-slate">
                {prevPost ? (
                  <Link href={`/blog/${category}/${prevPost.slug}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Previous
                  </Link>
                ) : (
                  <span className="opacity-30">No previous guides</span>
                )}
                
                {nextPost ? (
                  <Link href={`/blog/${category}/${nextPost.slug}`} className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    Next <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <span className="opacity-30">No next guides</span>
                )}
              </div>

            </div>

            {/* Right Sidebar Widget (Direct Tool Launch Card) */}
            <aside className="hidden lg:block lg:col-span-1">
              <div className="sticky top-24 bg-[#12131a] border border-[#27272a] rounded-xl p-5 text-center space-y-4">
                <h3 className="font-semibold text-sm text-ink uppercase tracking-wider">Use {post.toolName}</h3>
                <p className="text-xs text-slate">Process your data securely in your browser session.</p>
                <Link href={post.toolUrl} className="block w-full text-center bg-[#6366f1] hover:bg-[#5a5cd8] text-white font-medium py-3 rounded-lg transition text-xs font-semibold">
                  Launch Tool
                </Link>
              </div>
            </aside>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
