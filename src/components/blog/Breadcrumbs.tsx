"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-1.5 text-[12.5px] font-sans text-slate-500 dark:text-slate-400 mb-8 overflow-x-auto whitespace-nowrap py-1 scrollbar-none">
      <Link 
        href="/" 
        className="hover:text-teal-700 dark:hover:text-teal-350 transition-colors flex items-center gap-1 font-medium text-slate-500 dark:text-slate-400"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>
      
      <ChevronRight className="w-3 h-3 flex-shrink-0 text-slate-300 dark:text-slate-700" />
      
      <Link 
        href="/blog" 
        className="hover:text-teal-700 dark:hover:text-teal-350 transition-colors font-medium text-slate-500 dark:text-slate-400"
      >
        Blog
      </Link>
      
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        
        // Remove trailing "Utilities" or "Tools" in breadcrumb display if applicable for clean look
        const displayName = item.name.replace(' Utilities', '').replace(' Tools', '');

        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 flex-shrink-0 text-slate-300 dark:text-slate-700" />
            {isLast || !item.url ? (
              <span className="text-slate-900 dark:text-slate-100 font-semibold truncate max-w-[200px] sm:max-w-sm">
                {displayName}
              </span>
            ) : (
              <Link 
                href={item.url} 
                className="hover:text-teal-700 dark:hover:text-teal-350 transition-colors font-medium text-slate-500 dark:text-slate-400"
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
