import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getAllPosts } from '@/lib/blog';
import { BlogListingClient } from '@/components/blog/BlogListingClient';
import { buildMetadata } from '@/lib/seo/metadata';
import { getPageSEO } from '@/lib/seo/pageMetadata';

const seo = getPageSEO('blog')!;
export const metadata = buildMetadata({
  title: seo.title,
  description: seo.description,
  canonical: `https://singulariti.in${seo.path}`,
  robots: seo.robots,
  openGraph: {
    title: seo.openGraph.title,
    description: seo.openGraph.description,
    url: seo.openGraph.url,
    type: seo.openGraph.type,
    image: seo.openGraph.image,
  },
  twitter: {
    title: seo.twitter.title,
    description: seo.twitter.description,
    image: seo.twitter.image,
  },
});

export default async function BlogHomePage() {
  const posts = getAllPosts();
  
  // Resolve featured posts (first 3 posts marked as featured, or from registry)
  const featuredPosts = posts.filter(p => p.featured).slice(0, 3);

  // If not enough featured posts, fill up with some popular ones
  if (featuredPosts.length < 3) {
    const remaining = posts.filter(p => !featuredPosts.includes(p));
    featuredPosts.push(...remaining.slice(0, 3 - featuredPosts.length));
  }

  // Filter out featured posts from the main list so they don't appear twice
  const mainPostsList = posts.filter(p => !featuredPosts.includes(p));

  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-white text-slate-900 dark:bg-slate-950 dark:text-white pt-20 pb-16">
        <BlogListingClient 
          posts={mainPostsList} 
          featuredPosts={featuredPosts} 
        />
        
        {/* Bottom CTA Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1280px] mt-16">
          <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-teal-50/20 via-white to-teal-50/10 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm dark:border-slate-800 dark:from-teal-950/10 dark:via-slate-900/50 dark:to-teal-950/5">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <h3 className="font-display font-bold text-lg text-slate-950 dark:text-white">Need a tool for your task?</h3>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                Browse all Singulariti tools and complete everyday digital tasks faster with zero server uploads and maximum performance.
              </p>
            </div>
            <a 
              href="/tools"
              className="inline-flex items-center justify-center px-6 py-3 bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white font-sans font-semibold text-xs rounded-xl transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0"
            >
              View All Tools
            </a>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
