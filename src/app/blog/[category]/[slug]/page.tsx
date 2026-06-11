import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo/metadata';
import { getPostBySlug, getUnifiedPosts } from '@/lib/blog';
import { BlogArticleDetails } from '@/components/blog/BlogArticleDetails';

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  const posts = getUnifiedPosts();
  // Filter for posts that are served under /blog/[category]/[slug]
  return posts
    .filter(p => p.categorySlug && !p.url.includes('/guides/') && !p.url.includes('/articles/'))
    .map((post) => ({
      category: post.categorySlug,
      slug: post.slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || post.categorySlug !== category) {
    return {
      title: 'Guide Not Found',
    };
  }

  return constructMetadata({
    title: post.metaTitle,
    description: post.metaDescription,
    path: `/blog/${post.categorySlug}/${post.slug}`,
    type: 'article',
    image: post.featuredImage || undefined,
    publishedTime: post.publishedAt || post.published,
    updatedAt: post.updatedAt,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { category, slug } = await params;
  const post = getPostBySlug(slug);

  if (!post || post.categorySlug !== category) {
    notFound();
  }

  return <BlogArticleDetails post={post} />;
}

