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
import { constructMetadata } from '@/lib/seo/metadata';
import { getPostBySlug } from '@/lib/blog';
import { toolRegistry, sectionRegistry, subSectionRegistry } from '@/content/tools/toolRegistry';
import { Calendar, ArrowLeft, ChevronRight, Shield, Play } from 'lucide-react';

interface PageProps {
  params: Promise<{ utilitySlug: string }>;
}

export async function generateStaticParams() {
  const { getAllPosts } = await import('@/lib/blog');
  const postSlugs = getAllPosts().map(p => ({ utilitySlug: p.slug }));
  
  return postSlugs;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { utilitySlug } = await params;
  const post = getPostBySlug(utilitySlug);
  
  if (!post) {
    return {
      title: 'Guide Not Found',
    };
  }

  return constructMetadata({
    title: post.metaTitle,
    description: post.metaDescription,
    path: `/blog/guides/${post.slug}`,
    type: 'article',
    image: post.featuredImage || undefined,
    publishedTime: post.publishedAt,
    updatedAt: post.updatedAt,
  });
}

export default async function UtilityGuidePage({ params }: PageProps) {
  const { utilitySlug } = await params;
  const post = getPostBySlug(utilitySlug);

  // Look up tool metadata in our registry (might be undefined for general guides)
  const tool = toolRegistry.find(t => t.guideSlug === utilitySlug);

  if (!post) {
    notFound();
  }

  const section = tool ? sectionRegistry.find(s => s.id === tool.sectionId) : undefined;
  const subSection = tool ? subSectionRegistry.find(ss => ss.id === tool.subSectionId) : undefined;

  // Schema Markup generation
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
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
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": tool ? tool.name : post.title,
        "item": `https://www.singulariti.in/blog/guides/${utilitySlug}`
      }
    ]
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.metaDescription,
    "image": post.featuredImage ? `https://www.singulariti.in${post.featuredImage}` : undefined,
    "datePublished": post.publishedAt,
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
      "@id": `https://www.singulariti.in/blog/guides/${post.slug}`
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
            {section && (
              <>
                <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                <Link href={`/blog/series/${section.slug}`} className="hover:text-teal-700 dark:hover:text-teal-350 transition-colors">{section.name}</Link>
              </>
            )}
            {section && subSection && (
              <>
                <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                <Link href={`/blog/series/${section.slug}/${subSection.slug}`} className="hover:text-teal-700 dark:hover:text-teal-350 transition-colors">{subSection.name}</Link>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-slate-900 dark:text-white font-semibold truncate max-w-[200px] sm:max-w-sm">{tool ? tool.name : post.title}</span>
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

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-350 text-[13px] font-sans">
              <div className="flex items-center gap-6">
                {post.updatedAt && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    Updated: <strong>{post.updatedAt}</strong>
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
              <TableOfContents htmlContent={JSON.stringify(post.sections)} />
            </aside>

            {/* Post Workspace */}
            <div className="lg:col-span-3 space-y-10 max-w-3xl">
              
              {/* Tool CTA Block - Only display if a tool is associated */}
              {tool && (
                <div className="p-6 bg-teal-50/40 border border-teal-100 dark:bg-teal-950/20 dark:border-teal-900/60 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="space-y-1.5 text-center md:text-left">
                    <h4 className="font-sans font-bold text-sm text-slate-950 dark:text-white font-semibold">Utility: {tool.name}</h4>
                    <p className="font-sans text-xs text-slate-600 dark:text-slate-350 max-w-md">{tool.shortDescription}</p>
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
              )}

              {/* Back Navigation buttons under title (requested) */}
              {section && (
                <div className="flex flex-wrap gap-3 text-xs font-sans font-semibold">
                  <Link 
                    href={`/blog/series/${section.slug}`}
                    className="px-4 py-2 bg-slate-50 border border-slate-200 hover:border-teal-300 hover:text-teal-700 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-teal-700 dark:text-slate-300 rounded-xl transition-all"
                  >
                    Back to {section.name}
                  </Link>
                  {subSection && (
                    <Link 
                      href={`/blog/series/${section.slug}/${subSection.slug}`}
                      className="px-4 py-2 bg-slate-50 border border-slate-200 hover:border-teal-300 hover:text-teal-700 dark:bg-slate-900 dark:border-slate-800 dark:hover:border-teal-700 dark:text-slate-300 rounded-xl transition-all"
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
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-700 dark:text-slate-350 dark:hover:text-teal-300 transition-colors group"
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
