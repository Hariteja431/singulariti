import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { FAQSection } from '@/components/blog/FAQSection';
import { RelatedTools } from '@/components/blog/RelatedTools';
import { BlogArticle } from '@/components/blog/BlogArticle';
import { BlogCard } from '@/components/blog/BlogCard';
import { constructMetadata } from '@/lib/seo/metadata';
import { getPostBySlug, normalizeDataPost } from '@/lib/blog';
import { toolRegistry, sectionRegistry, subSectionRegistry } from '@/content/tools/toolRegistry';
import { BLOG_CATEGORIES, BLOG_POSTS } from '@/data/blogs';
import { Calendar, ArrowLeft, ChevronRight, Shield, Play, FolderOpen } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { getAllPosts } = await import('@/lib/blog');
  const posts = getAllPosts().map(p => ({ slug: p.slug }));
  const categories = Object.keys(BLOG_CATEGORIES).map(c => ({ slug: c }));
  return [...posts, ...categories];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const catData = BLOG_CATEGORIES[slug];
  
  if (catData) {
    return constructMetadata({
      title: `${catData.name} Guides | Singulariti`,
      description: catData.description,
      path: `/blog/${catData.slug}`,
    });
  }

  const post = getPostBySlug(slug);
  if (post) {
    return constructMetadata({
      title: post.metaTitle || post.seoTitle || post.title,
      description: post.metaDescription,
      path: `https://www.singulariti.in/blog/${post.slug}`,
      type: 'article',
      image: post.featuredImage || undefined,
      publishedTime: post.publishedAt || post.published,
      updatedAt: post.updatedAt,
    });
  }

  return {
    title: 'Not Found',
  };
}

export default async function BlogPostUnifiedPage({ params }: PageProps) {
  const { slug } = await params;
  
  // 1. Check if it is a category page
  const catData = BLOG_CATEGORIES[slug];
  if (catData) {
    const posts = BLOG_POSTS.filter((post) => post.categorySlug === slug).map(normalizeDataPost);
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
              <p className="font-sans text-base md:text-lg text-slate-600 dark:text-slate-350 leading-relaxed max-w-2xl">
                {catData.description}
              </p>
              <div className="text-xs text-slate-650 dark:text-slate-400 font-sans bg-slate-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800/80 px-4 py-2 rounded-xl inline-block">
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
                className="inline-flex items-center gap-2 text-slate-650 hover:text-teal-700 dark:text-slate-350 dark:hover:text-teal-300 transition-colors group text-xs font-sans font-semibold"
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

  // 2. Check if it is a post page
  const post = getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const postCatData = post.categorySlug ? BLOG_CATEGORIES[post.categorySlug] : undefined;

  // Look up tool metadata in our registry (might be undefined for general guides/articles)
  const tool = toolRegistry.find(t => t.guideSlug === slug) || toolRegistry.find(t => t.id === slug);
  const section = tool ? sectionRegistry.find(s => s.id === tool.sectionId) : undefined;
  const subSection = tool ? subSectionRegistry.find(ss => ss.id === tool.subSectionId) : undefined;

  // Schema Markup generation
  const breadcrumbElements = [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.singulariti.in"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://www.singulariti.in/blog"
    }
  ];

  if (section) {
    breadcrumbElements.push({
      "@type": "ListItem",
      "position": 3,
      "name": section.name,
      "item": `https://www.singulariti.in/blog/series/${section.slug}`
    });
    if (subSection) {
      breadcrumbElements.push({
        "@type": "ListItem",
        "position": 4,
        "name": subSection.name,
        "item": `https://www.singulariti.in/blog/series/${section.slug}/${subSection.slug}`
      });
    }
  } else if (post.categorySlug) {
    breadcrumbElements.push({
      "@type": "ListItem",
      "position": 3,
      "name": postCatData?.name || post.category,
      "item": `https://www.singulariti.in/blog/${post.categorySlug}`
    });
  }

  breadcrumbElements.push({
    "@type": "ListItem",
    "position": breadcrumbElements.length + 1,
    "name": tool ? tool.name : (post.toolName || post.title),
    "item": `https://www.singulariti.in/blog/${post.slug}`
  });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbElements
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.metaDescription,
    "image": post.featuredImage ? `https://www.singulariti.in${post.featuredImage}` : undefined,
    "datePublished": post.publishedAt || post.published,
    "dateModified": post.updatedAt,
    "author": {
      "@type": "Organization",
      "name": "Singulariti"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Singulariti",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.singulariti.in/favicon.ico"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.singulariti.in/blog/${post.slug}`
    }
  };

  const faqSchema = post.faqs && post.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faqs.map((faq: any) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  return (
    <>
      {/* Inject schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <Header />
      <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-1.5 text-[13px] font-sans text-slate-500 dark:text-slate-400 mb-8 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-teal-700 dark:hover:text-teal-350 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <Link href="/blog" className="hover:text-teal-700 dark:hover:text-teal-350 transition-colors">Blog</Link>
            {section ? (
              <>
                <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                <Link href={`/blog/series/${section.slug}`} className="hover:text-teal-700 dark:hover:text-teal-350 transition-colors">{section.name}</Link>
                {subSection && (
                  <>
                    <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                    <Link href={`/blog/series/${section.slug}/${subSection.slug}`} className="hover:text-teal-700 dark:hover:text-teal-350 transition-colors">{subSection.name}</Link>
                  </>
                )}
              </>
            ) : post.categorySlug ? (
              <>
                <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                <Link href={`/blog/${post.categorySlug}`} className="hover:text-teal-700 dark:hover:text-teal-350 transition-colors">{post.category}</Link>
              </>
            ) : null}
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-slate-900 dark:text-white font-semibold truncate max-w-[200px] sm:max-w-sm">{tool ? tool.name : (post.toolName || post.title)}</span>
          </nav>

          {/* Article Header */}
          <header className="max-w-4xl mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1 rounded-full">
                {section ? section.name : post.category}
              </span>
              {subSection && (
                <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-full">
                  {subSection.name}
                </span>
              )}
            </div>

            <h1 className="font-display font-bold text-3xl md:text-5xl text-slate-950 dark:text-white leading-tight tracking-tight mb-6">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-slate-655 dark:text-slate-350 text-base md:text-lg font-sans leading-relaxed mb-6">
                {post.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-350 text-[13px] font-sans">
              <div className="flex items-center gap-6">
                {post.updatedAt && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    Updated: <strong>{post.updatedAt}</strong>
                  </span>
                )}
                {post.readTime && (
                  <span className="bg-slate-50 dark:bg-slate-900 px-2.5 py-1 rounded-md text-xs">
                    {post.readTime}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="font-medium text-[12px] text-teal-700 dark:text-teal-300">Local Browser-Side Processing</span>
              </div>
            </div>
          </header>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
            
            {/* Sidebar Table of Contents */}
            <aside className="hidden lg:block lg:col-span-1">
              <TableOfContents 
                htmlContent={post.rawSections ? undefined : JSON.stringify(post.sections)} 
                sections={post.rawSections ? post.sections : undefined} 
              />
            </aside>

            {/* Post Workspace */}
            <div className="lg:col-span-3 space-y-10 max-w-3xl">
              
              {/* Tool CTA Block - Only display if a tool is associated */}
              {tool ? (
                <div className="p-6 bg-teal-50/40 border border-teal-100 dark:bg-teal-950/20 dark:border-teal-900/60 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="space-y-1.5 text-center md:text-left">
                    <h4 className="font-sans font-bold text-sm text-slate-950 dark:text-white font-semibold">Utility: {tool.name}</h4>
                    <p className="font-sans text-xs text-slate-650 dark:text-slate-350 max-w-md">{tool.shortDescription}</p>
                  </div>
                  <div className="flex gap-2.5 w-full md:w-auto">
                    <Link 
                      href={tool.utilityUrl}
                      className="flex-1 md:flex-initial inline-flex items-center justify-center px-5 py-3 bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-sans font-bold text-xs rounded-xl transition-all shadow-sm gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" /> Use Utility
                    </Link>
                    {section && (
                      <Link 
                        href={`/blog/series/${section.slug}`}
                        className="flex-1 md:flex-initial inline-flex items-center justify-center px-5 py-3 bg-white border border-slate-200 hover:border-teal-300 hover:text-teal-700 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-teal-750 dark:text-slate-300 font-sans font-semibold text-xs rounded-xl transition-all"
                      >
                        Back to {section.name} Guides
                      </Link>
                    )}
                  </div>
                </div>
              ) : post.toolUrl ? (
                <div className="p-6 bg-teal-50/40 border border-teal-100 dark:bg-teal-950/20 dark:border-teal-900/60 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1.5 text-center sm:text-left">
                    <h4 className="font-sans font-bold text-sm text-slate-950 dark:text-white font-semibold">Utility Tool: {post.toolName}</h4>
                    <p className="font-sans text-xs text-slate-650 dark:text-slate-350 max-w-md">No uploads to servers. Fast browser-side processing.</p>
                  </div>
                  <div className="flex gap-2.5 w-full sm:w-auto">
                    <Link 
                      href={post.toolUrl}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center px-5 py-3 bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-sans font-bold text-xs rounded-xl transition-all shadow-sm gap-1.5"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" /> Open Tool
                    </Link>
                  </div>
                </div>
              ) : null}

              {/* Back Navigation buttons under title */}
              {section && (
                <div className="flex flex-wrap gap-3 text-xs font-sans font-semibold">
                  <Link 
                    href={`/blog/series/${section.slug}`}
                    className="px-4 py-2 bg-slate-50 border border-slate-200 hover:border-teal-300 hover:text-teal-700 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-teal-750 dark:text-slate-300 rounded-xl transition-all"
                  >
                    Back to {section.name}
                  </Link>
                  {subSection && (
                    <Link 
                      href={`/blog/series/${section.slug}/${subSection.slug}`}
                      className="px-4 py-2 bg-slate-50 border border-slate-200 hover:border-teal-300 hover:text-teal-700 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-teal-750 dark:text-slate-300 rounded-xl transition-all"
                    >
                      Back to {subSection.name}
                    </Link>
                  )}
                </div>
              )}

              {/* Structured Article Content */}
              <BlogArticle post={post} />

              {/* FAQ Section Accordion */}
              <FAQSection faqs={post.faqs} />

              {/* Related Tools Navigation Links */}
              <RelatedTools tools={post.relatedTools} />

              {/* Back to Blog Button */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap gap-4 text-xs font-sans font-semibold">
                <Link 
                  href="/blog" 
                  className="inline-flex items-center gap-2 text-slate-650 hover:text-teal-750 dark:text-slate-350 dark:hover:text-teal-300 transition-colors group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Blog Home
                </Link>
              </div>

            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
