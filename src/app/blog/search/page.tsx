import React, { Suspense } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SearchResultsContent } from './SearchResultsClient';
import { constructMetadata } from '@/lib/seo/metadata';

export const metadata = constructMetadata({
  title: 'Search Utility Guides | Singulariti',
  description: 'Search utility guides by name, section, operation type and usage topic.',
  path: '/blog/search',
  robots: 'noindex',
});

export default function SearchResultsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl space-y-8 mb-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-sans text-slate">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-ink font-semibold">Search Results</span>
          </div>

          {/* Heading Results Banner */}
          <header className="border-b border-border pb-6 space-y-2">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-ink tracking-tight">
              Search Utility Guides
            </h1>
            <p className="font-sans text-xs text-slate">
              Search utility guides by name, category, or operations.
            </p>
          </header>
        </div>

        <Suspense fallback={
          <div className="container mx-auto px-4 max-w-7xl text-center py-20 font-sans text-slate">
            Loading search results...
          </div>
        }>
          <SearchResultsContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
