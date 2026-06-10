"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1.5 text-[13px] font-sans text-slate mb-8 overflow-x-auto whitespace-nowrap">
      <Link href="/" className="hover:text-primary transition-colors">
        Home
      </Link>
      <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
      <Link href="/blog" className="hover:text-primary transition-colors">
        Blog
      </Link>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
            {isLast || !item.url ? (
              <span className="text-ink font-semibold truncate max-w-[200px] sm:max-w-sm">
                {item.name}
              </span>
            ) : (
              <Link href={item.url} className="hover:text-primary transition-colors">
                {item.name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
