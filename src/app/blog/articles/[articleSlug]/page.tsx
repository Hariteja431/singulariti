import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo/metadata';
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { BlogArticleDetails } from '@/components/blog/BlogArticleDetails';

interface PageProps {
  params: Promise<{ articleSlug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  // Return post slugs for general articles (non-tool guides)
  return posts.filter(p => !p.toolUrl).map((post) => ({
    articleSlug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { articleSlug } = await params;
  const post = getPostBySlug(articleSlug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return constructMetadata({
    title: post.metaTitle,
    description: post.metaDescription,
    path: `/blog/articles/${post.slug}`,
    type: 'article',
    image: post.featuredImage || undefined,
    publishedTime: post.publishedAt || post.published,
    updatedAt: post.updatedAt,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { articleSlug } = await params;
  const post = getPostBySlug(articleSlug);

  if (!post) {
    notFound();
  }

  return <BlogArticleDetails post={post} />;
}

