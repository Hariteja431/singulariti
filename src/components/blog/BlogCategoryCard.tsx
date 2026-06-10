"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Folder } from 'lucide-react';
import { BlogCategory } from '@/data/blogs';

interface BlogCategoryCardProps {
  category: BlogCategory;
  count: number;
}

export function BlogCategoryCard({ category, count }: BlogCategoryCardProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl flex flex-col justify-between overflow-hidden hover:border-primary/60 transition-colors shadow-sm group">
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-base text-ink group-hover:text-primary transition-colors flex items-center gap-2">
              <Folder className="w-4 h-4 text-primary" /> {category.name}
            </h3>
            <span className="text-[10px] font-mono text-slate bg-border/40 px-2.5 py-1 rounded-full font-semibold">
              {count} guides
            </span>
          </div>
          <p className="text-xs text-slate leading-relaxed">
            {category.description}
          </p>
        </div>
        <div className="pt-2">
          <Link
            href={`/blog/${category.slug}`}
            className="inline-flex w-full items-center justify-center py-2.5 bg-background border border-border hover:border-primary/60 hover:bg-primary/5 rounded-xl font-sans font-semibold text-xs text-ink hover:text-primary transition-all gap-1"
          >
            Browse Guides <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
