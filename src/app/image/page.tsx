import React from 'react';
import { Header } from '@/components/layout/Header';
import { PremiumHeroIcon } from '@/components/ui/PremiumHeroIcon';
import { Footer } from '@/components/layout/Footer';
import { ImageIcon } from 'lucide-react';
import { buildMetadata } from '@/lib/seo/metadata';
import { getPageSEO } from '@/lib/seo/pageMetadata';
import { ImageToolsCollections } from '@/components/tools/ImageToolsCollections';

const seo = getPageSEO('category-image')!;
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

export default function ImageCategoryPage() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full flex flex-col items-center pt-16 pb-12">
        
        {/* Category Hero */}
        <section className="container mx-auto px-4 max-w-5xl mb-12 text-center">
          <PremiumHeroIcon icon={<ImageIcon />} />
          <h1 className="font-display font-bold text-4xl md:text-5xl text-ink mb-6">
            Image Tools
          </h1>
          <p className="font-sans text-lg text-slate max-w-3xl mx-auto leading-relaxed">
            Compress, convert, inspect, and prepare image files with simple Singulariti tools. Use quick image utilities for file size reduction, format conversion, metadata checks, color extraction, and Base64 workflows.
          </p>
        </section>

        {/* Collections */}
        <ImageToolsCollections />

      </main>
      <Footer />
    </>
  );
}
