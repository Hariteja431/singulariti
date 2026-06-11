"use client";

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, Shield, Play, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Breadcrumbs } from '@/components/blog/Breadcrumbs';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { FAQAccordion } from '@/components/blog/FAQAccordion';
import { RelatedTools } from '@/components/blog/RelatedTools';
import { FinalCTA } from '@/components/blog/FinalCTA';
import { KeyTakeaways } from '@/components/blog/KeyTakeaways';
import { BlogPost } from '@/lib/blog';

interface BlogArticleDetailsProps {
  post: BlogPost;
}

export function BlogArticleDetails({ post }: BlogArticleDetailsProps) {
  // Build breadcrumbs
  const breadcrumbsList: { name: string; url?: string }[] = [
    { name: "Blog", url: "/blog" }
  ];
  if (post.category && post.categorySlug) {
    // Check if it's a series slug or data category slug
    const cleanSlug = post.categorySlug.replace('-tools', '-utilities');
    breadcrumbsList.push({ name: post.category, url: `/blog/series/${cleanSlug}` });
  }
  breadcrumbsList.push({ name: post.title });

  // Schema Markup generation
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbsList.map((item, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": item.name,
      "item": item.url ? `https://singulariti.in${item.url}` : undefined
    })).filter(item => item.item)
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "image": post.image,
    "datePublished": post.published,
    "dateModified": post.updatedAt || post.published,
    "author": {
      "@type": "Organization",
      "name": "Singulariti"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Singulariti",
      "logo": {
        "@type": "ImageObject",
        "url": "https://singulariti.in/favicon.ico"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://singulariti.in${post.url}`
    }
  };

  const faqSchema = post.faqs && post.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  const tocSections = post.flatSections
    ? post.flatSections.map((s, idx) => ({ id: `section-${idx}`, heading: s.title }))
    : [];

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
      <main className="flex-1 w-full bg-white text-slate-900 dark:bg-slate-950 dark:text-white pt-20 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1280px]">
          
          {/* Breadcrumb Navigation */}
          <Breadcrumbs items={breadcrumbsList} />

          {/* Article Header */}
          <header className="max-w-4xl mb-8 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              {post.labels.map((label, idx) => (
                <span
                  key={idx}
                  className={`text-[11px] font-sans font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    idx === 0 
                      ? 'text-teal-700 bg-teal-50 dark:text-teal-300 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/30'
                      : 'text-slate-600 bg-slate-50 border border-slate-200 dark:text-slate-350 dark:bg-slate-900 dark:border-slate-800'
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>

            <h1 className="font-display font-extrabold text-3xl md:text-5xl text-slate-950 dark:text-white leading-tight tracking-tight">
              {post.title}
            </h1>

            <p className="text-slate-600 dark:text-slate-350 font-sans text-sm md:text-base leading-relaxed">
              {post.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-[12.5px] font-sans">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-1.5 font-sans">
                  <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  Published: <strong>{post.published}</strong>
                </span>
                {post.updatedAt && (
                  <span className="flex items-center gap-1.5 font-sans">
                    <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    Updated: <strong>{post.updatedAt}</strong>
                  </span>
                )}
                <span className="flex items-center gap-1.5 font-sans">
                  <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  Read time: <strong>{post.readTime}</strong>
                </span>
              </div>
              
              <div className="flex items-center gap-2 bg-teal-50 dark:bg-teal-950/20 border border-teal-100/60 dark:border-teal-900/40 px-3 py-1 rounded-lg">
                <Shield className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="font-semibold text-[11.5px] text-teal-600 dark:text-teal-400">Local Browser Processing</span>
              </div>
            </div>

            {/* Header CTA Buttons */}
            <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-200 dark:border-slate-800 font-sans font-semibold text-xs">
              {post.toolUrl && (
                <Link 
                  href={post.toolUrl}
                  className="inline-flex items-center justify-center px-5 py-3 bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-550 text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-white text-white" /> Use Utility
                </Link>
              )}
              {post.categorySlug && (
                <Link 
                  href={`/blog/series/${post.categorySlug.replace('-tools', '-utilities')}`}
                  className="inline-flex items-center justify-center px-5 py-3 bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-750 text-slate-700 rounded-xl transition-all duration-200 shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:hover:border-teal-500 dark:hover:text-teal-400 dark:text-slate-300"
                >
                  View Related Guides
                </Link>
              )}
            </div>
          </header>

          {/* Cover Image */}
          {post.image && (
            <div className="max-w-4xl mb-12 overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-900 aspect-[21/9]">
              <img 
                src={post.image} 
                alt={post.imageAlt || post.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Key Takeaways Section */}
          {post.keyTakeaways && post.keyTakeaways.length > 0 && (
            <div className="max-w-4xl mb-8">
              <KeyTakeaways takeaways={post.keyTakeaways} />
            </div>
          )}

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* Sidebar Table of Contents */}
            <aside className="lg:col-span-1">
              <TableOfContents sections={tocSections} />
            </aside>

            {/* Post Content Area */}
            <div className="lg:col-span-3 space-y-12 max-w-[860px] blog-article-content">
              
              {/* Tool Quick CTA Box */}
              {post.toolUrl && (
                <div className="p-6 bg-teal-50/60 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="font-sans font-bold text-sm text-slate-955 dark:text-white">Browser-side Processing: {post.title.replace('How to ', '').replace('How to Use the ', '')}</h4>
                    <p className="font-sans text-xs text-slate-600 dark:text-slate-300">Your documents remain locally on your device. Fast, safe, and private.</p>
                  </div>
                  <Link 
                    href={post.toolUrl}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-teal-700 hover:bg-teal-850 text-white font-sans font-bold text-xs rounded-xl transition-all shadow-sm gap-1.5 dark:bg-teal-600 dark:hover:bg-teal-500"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" /> Open Tool
                  </Link>
                </div>
              )}

              {/* Sections rendering */}
              <div className="space-y-10">
                {post.flatSections?.map((section, idx) => (
                  <section key={idx} className="space-y-4 scroll-mt-24">
                    <h2 id={`section-${idx}`} className="font-display font-extrabold text-2xl text-slate-950 dark:text-white border-l-4 border-teal-600 dark:border-teal-400 pl-3">
                      {section.title}
                    </h2>
                    <div 
                      className="prose prose-slate dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 font-sans text-sm md:text-base leading-relaxed [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mb-1 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol>li]:mb-1 [&>pre]:bg-slate-50 dark:[&>pre]:bg-slate-950 [&>pre]:border [&>pre]:border-slate-200 dark:[&>pre]:border-slate-800 [&>pre]:p-4 [&>pre]:rounded-xl [&>pre]:overflow-x-auto [&>pre]:text-[12.5px] [&>pre]:font-mono [&>pre]:text-slate-900 dark:[&>pre]:text-slate-200 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-slate-950 dark:[&>h3]:text-white [&>h3]:mt-6 [&>h3]:mb-3"
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  </section>
                ))}
              </div>

              {/* FAQ Section */}
              {post.faqs && post.faqs.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <h2 className="font-display font-extrabold text-2xl text-slate-950 dark:text-white">
                    Frequently Asked Questions
                  </h2>
                  <FAQAccordion faqs={post.faqs} />
                </div>
              )}

              {/* Related Tools */}
              {post.relatedItems && post.relatedItems.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <h2 className="font-display font-extrabold text-2xl text-slate-950 dark:text-white">
                    Related Tools & Guides
                  </h2>
                  <RelatedTools tools={post.relatedItems.map(t => ({ name: t.name, url: t.url, reason: t.reason }))} />
                </div>
              )}

              {/* Bottom Final CTA */}
              {post.toolUrl && (
                <FinalCTA toolName={post.title.replace('How to ', '').replace('How to Use the ', '').replace(' Tool', '')} toolUrl={post.toolUrl} />
              )}

              {/* Back Button */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-4 text-xs font-sans font-semibold">
                <Link 
                  href="/blog" 
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-200 transition-colors group"
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
