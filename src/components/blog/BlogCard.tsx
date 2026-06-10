"use client";

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Play } from 'lucide-react';
import { BlogPost } from '@/data/blogs';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const linkHref = `/blog/${post.categorySlug}/${post.slug}`;

  return (
    <article className="group bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/60 transition-all duration-300 flex flex-col h-full shadow-sm hover:shadow-md">
      <div className="p-6 flex flex-col flex-1">
        {/* Category Pill */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            {post.category}
          </span>
          <span className="text-[11px] font-sans text-slate flex items-center gap-1">
            <Clock className="w-3 h-3 text-primary" /> {post.readTime}
          </span>
        </div>

        {/* Title */}
        <Link href={linkHref} className="block group-hover:text-primary transition-colors mb-3">
          <h3 className="font-display font-bold text-xl text-ink leading-snug group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </Link>

        {/* Meta Description */}
        <p className="text-[13px] font-sans text-slate leading-relaxed mb-6 flex-1 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Action buttons */}
        <div className="flex gap-2 pt-4 border-t border-border/60 text-[11px] font-sans font-semibold">
          <Link
            href={post.toolUrl}
            className="flex-1 text-center py-2 bg-primary hover:bg-primary/95 text-white rounded-lg transition-colors inline-flex items-center justify-center gap-1"
          >
            <Play className="w-2.5 h-2.5 fill-white" /> Open Tool
          </Link>
          <Link
            href={linkHref}
            className="flex-1 text-center py-2 bg-background border border-border hover:border-primary hover:text-primary rounded-lg transition-all inline-flex items-center justify-center gap-0.5"
          >
            Read Guide <ArrowRight className="w-2.5 h-2.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
