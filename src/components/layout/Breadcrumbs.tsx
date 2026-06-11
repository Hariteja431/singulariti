import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  categoryName: string;
  categoryId: string;
  toolName: string;
}

export function Breadcrumbs({ categoryName, categoryId, toolName }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center text-sm font-sans text-slate mb-6 overflow-x-auto whitespace-nowrap" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="hover:text-primary transition-colors flex items-center">
            <Home className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        <li className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4 text-border" />
          <Link href="/tools" className="hover:text-primary transition-colors">
            Tools
          </Link>
        </li>
        <li className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4 text-border" />
          <Link href={`/tools/${categoryId}`} className="hover:text-primary transition-colors">
            {categoryName}
          </Link>
        </li>
        <li className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4 text-border" />
          <span className="text-ink font-medium" aria-current="page">
            {toolName}
          </span>
        </li>
      </ol>
    </nav>
  );
}
