import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { registry } from '@/registry';
import { ImageIcon, ShieldAlert } from 'lucide-react';
import { buildMetadata } from '@/lib/seo/metadata';
import { getPageSEO } from '@/lib/seo/pageMetadata';
import ImageToolsCollections from '@/components/tools/ImageToolsCollections';

const seo = getPageSEO('category-image')!;
export const metadata = buildMetadata({
  title: "Image Tools | Singulariti",
  description: seo.description,
  canonical: `https://singulariti.in${seo.path}`,
  robots: seo.robots,
  openGraph: {
    title: "Image Tools | Singulariti",
    description: seo.openGraph.description,
    url: seo.openGraph.url,
    type: seo.openGraph.type,
    image: seo.openGraph.image,
  },
  twitter: {
    title: "Image Tools | Singulariti",
    description: seo.twitter.description,
    image: seo.twitter.image,
  },
});

export default function ImageCategoryPage() {
  const category = registry.categories.find(c => c.id === 'image');

  if (!category) return null;

  // Cast type to fit ImageToolsCollections structure
  const collections = category.collections.map(col => ({
    id: col.id,
    name: col.name,
    description: col.description,
    path: col.path,
    tools: col.tools.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
      path: t.path
    }))
  }));

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white pt-24 pb-16">
        
        {/* Category Hero */}
        <section className="container mx-auto px-4 max-w-5xl mb-12 text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/40 flex items-center justify-center text-teal-600 dark:text-teal-400 mx-auto">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-950 dark:text-white">
            Image Tools
          </h1>
          <p className="text-base md:text-lg text-slate-650 dark:text-slate-350 max-w-2xl mx-auto leading-relaxed">
            {category.description}
          </p>

          {/* Privacy & Processing Notice */}
          <div className="max-w-2xl mx-auto rounded-2xl border border-amber-200 bg-amber-50/40 p-5 dark:border-amber-900/40 dark:bg-amber-950/10 text-left space-y-2 mt-6">
            <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Privacy & Processing Notice
            </h4>
            <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed font-medium">
              Many Singulariti image tools are designed to work directly in your browser when supported. Some advanced operations may require different processing depending on how the tool is built. Always check the result before downloading, and avoid uploading highly sensitive files unless you understand how the tool processes them.
            </p>
          </div>
        </section>

        {/* Collections */}
        <section className="container mx-auto px-4 max-w-6xl">
          <ImageToolsCollections collections={collections} />
        </section>

      </main>
      <Footer />
    </>
  );
}
