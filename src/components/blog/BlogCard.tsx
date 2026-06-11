"use client";

import React from 'react';
import Link from 'next/link';
import { Clock, Calendar, ArrowRight, FileText } from 'lucide-react';
import { normalizePost } from '@/lib/blog';

interface BlogCardProps {
  post: any;
}

export function BlogCard({ post }: BlogCardProps) {
  const normalized = normalizePost(post);
  const linkHref = normalized.url;

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-teal-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 flex flex-col h-full relative">
      
      {/* 1. Card Thumbnail/Icon */}
      <div className="aspect-[16/9] overflow-hidden bg-slate-100 border-b border-slate-200 dark:bg-slate-800 dark:border-slate-800 h-44 md:h-48 w-full relative">
        <Link href={linkHref} className="block w-full h-full">
          {normalized.image ? (
            <img
              src={normalized.image}
              alt={normalized.imageAlt || normalized.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 flex-col gap-2">
              <FileText className="w-8 h-8 text-teal-600/70" />
              <span className="font-display font-semibold text-[10px] tracking-wider text-slate-500 uppercase">
                Singulariti
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* 2. Card Content */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div className="space-y-2.5">
          {/* Date and Read Time at Top */}
          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 font-sans">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {normalized.updatedAt || normalized.published}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {normalized.readTime}
            </span>
          </div>

          {/* Title Below Date */}
          <h3 className="line-clamp-2 text-lg font-semibold text-slate-900 hover:text-teal-700 dark:text-white dark:hover:text-teal-300 transition-colors leading-snug">
            <Link href={linkHref} className="hover:text-teal-700 dark:hover:text-teal-300 transition-colors focus:outline-none">
              {/* Overlay link to make the card clickable */}
              <span className="absolute inset-0 z-10" aria-hidden="true" />
              {normalized.title}
            </Link>
          </h3>

          {/* Excerpt Below Title */}
          <p className="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {normalized.excerpt}
          </p>
        </div>

        {/* Read More Link */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between z-20 relative">
          <Link
            href={linkHref}
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-800 dark:text-teal-300 dark:hover:text-teal-200 group/btn"
          >
            Read More
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
