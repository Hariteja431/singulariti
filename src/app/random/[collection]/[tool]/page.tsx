import { buildMetadata } from '@/lib/seo/metadata';
import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RandomEngine } from '@/components/tool/RandomEngine';
import { getToolByPath, getCategoryById } from '@/registry';
import { SeoSchema } from '@/components/tools/shared/SeoSchema';
import { getUtilitySEO } from '@/lib/seo/utilityMetadata';
import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default async function ToolPage(props: { params: Promise<{ collection: string; tool: string }> }) {
  const params = await props.params;
  const category = getCategoryById('random');
  if (!category) return notFound();

  const collection = category.collections.find(c => c.id === params.collection);
  if (!collection) return notFound();

  const tool = collection.tools.find(t => t.id === params.tool);
  if (!tool) return notFound();

  const seo = getUtilitySEO(tool.id);

  let articleContent = '';
  try {
    const articlePath = path.join(process.cwd(), 'src', 'content', 'articles', `${tool.id}.md`);
    if (fs.existsSync(articlePath)) {
      articleContent = fs.readFileSync(articlePath, 'utf8');
    }
  } catch (e) {}

  return (
    <>
      <Header />
      <main className="flex-1 w-full flex flex-col items-center pt-16 pb-12">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 max-w-7xl mb-8">
          <nav className="flex text-[13px] font-sans text-slate">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/random" className="hover:text-ink">Random</Link>
            <span className="mx-2">/</span>
            <span className="text-ink font-medium">{tool.name}</span>
          </nav>
        </div>

        {/* Tool Header */}
        <section className="container mx-auto px-4 max-w-3xl text-center mb-8">
          <h1 className="font-display font-bold text-4xl text-ink mb-4">
            {tool.name}
          </h1>
          <p className="font-sans text-lg text-slate">
            {tool.description}
          </p>
        </section>

        {/* Engine UI */}
        <section className="container mx-auto px-4">
          <RandomEngine tool={tool} />
        </section>

        {/* SEO / Content Section */}
        {articleContent ? (
          <section className="container mx-auto px-4 max-w-3xl mt-16 text-slate font-sans">
            <article className="prose prose-slate dark:prose-invert max-w-none text-slate prose-headings:text-ink prose-strong:text-ink">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {articleContent}
              </ReactMarkdown>
            </article>
          </section>
        ) : (
          <section className="container mx-auto px-4 max-w-3xl mt-16 text-slate font-sans">
            <article className="prose prose-slate dark:prose-invert max-w-none text-slate prose-headings:text-ink prose-strong:text-ink">
              <h2 className="text-2xl font-bold font-display text-ink mb-4">About {tool.name}</h2>
              <p className="mb-6">
                Welcome to this online {tool.name}. The utility is designed to be fast, secure, and run entirely within the web browser. This means that data is processed client-side, ensuring outcomes are genuinely random and private.
              </p>
            </article>
          </section>
        )}

        {/* Schema Markup */}
        {seo && (
          <SeoSchema
            name={seo.name}
            description={seo.description}
            section={seo.section}
            canonical={seo.canonical}
            collectionName={collection.name}
            collectionUrl={`https://singulariti.in/random/${collection.id}`}
          />
        )}
      </main>
      <Footer />
    </>
  );
}

export async function generateStaticParams() {
  const category = getCategoryById('random');
  if (!category) return [];

  const paths: { collection: string; tool: string }[] = [];

  category.collections.forEach(collection => {
    collection.tools.forEach(tool => {
      paths.push({
        collection: collection.id,
        tool: tool.id
      });
    });
  });

  return paths;
}

export async function generateMetadata(props: { params: Promise<{ collection: string; tool: string }> }) {
  const params = await props.params;
  const seo = getUtilitySEO(params.tool);

  if (!seo) return {};

  return buildMetadata({
    title: seo.title,
    description: seo.description,
    canonical: seo.canonical,
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
}
