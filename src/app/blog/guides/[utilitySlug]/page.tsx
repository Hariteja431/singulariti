import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo/metadata';
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { BlogArticleDetails } from '@/components/blog/BlogArticleDetails';

interface PageProps {
  params: Promise<{ utilitySlug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(p => ({ utilitySlug: p.slug }));
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
    publishedTime: post.publishedAt || post.published,
    updatedAt: post.updatedAt,
  });
}

export default async function UtilityGuidePage({ params }: PageProps) {
  const { utilitySlug } = await params;
  const post = getPostBySlug(utilitySlug);

  if (!post) {
    notFound();
  }

  return <BlogArticleDetails post={post} />;
}

