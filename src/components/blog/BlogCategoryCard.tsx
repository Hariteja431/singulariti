"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  FileText, 
  Image, 
  Edit3, 
  QrCode, 
  Calculator, 
  Code2, 
  Type, 
  Search as SeoIcon, 
  ArrowLeftRight, 
  Briefcase, 
  Folder 
} from 'lucide-react';

interface BlogCategoryCardProps {
  category: {
    id?: string;
    name: string;
    slug: string;
    description: string;
  };
  count?: number;
}

// Maps category slugs/IDs to custom Lucide icons for premium presentation
function getCategoryIcon(slug: string) {
  const s = slug.toLowerCase();
  if (s.includes('pdf')) return FileText;
  if (s.includes('image-editing') || s.includes('editing')) return Edit3;
  if (s.includes('image')) return Image;
  if (s.includes('qr')) return QrCode;
  if (s.includes('calculat')) return Calculator;
  if (s.includes('dev') || s.includes('code') || s.includes('developer')) return Code2;
  if (s.includes('text')) return Type;
  if (s.includes('seo')) return SeoIcon;
  if (s.includes('convert') || s.includes('unit')) return ArrowLeftRight;
  if (s.includes('productivity') || s.includes('office')) return Briefcase;
  return Folder;
}

export function BlogCategoryCard({ category, count }: BlogCategoryCardProps) {
  const icon = getCategoryIcon(category.slug || category.id || "");
  const cleanName = category.name.replace(' Utilities', '').replace(' Tools', '');

  return (
    <div className="bg-white border border-slate-200 dark:bg-slate-900 dark:border-slate-800 rounded-2xl flex flex-col justify-between overflow-hidden hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-md transition-all duration-200 group p-5 shadow-sm">
      <div className="flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          
          {/* Header row: Icon & Count */}
          <div className="flex justify-between items-start gap-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/20 border border-teal-100 dark:border-teal-900/30 flex items-center justify-center text-teal-700 dark:text-teal-400 transition-colors group-hover:bg-teal-600 dark:group-hover:bg-teal-700 group-hover:text-white group-hover:border-teal-600 dark:group-hover:border-teal-700 duration-200">
              {React.createElement(icon, { className: "w-5 h-5" })}
            </div>
            {typeof count === 'number' && (
              <span className="text-[10px] font-sans font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-full">
                {count} {count === 1 ? 'guide' : 'guides'}
              </span>
            )}
          </div>

          {/* Category Title */}
          <h3 className="font-display font-bold text-base md:text-lg text-slate-950 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            {cleanName}
          </h3>

          {/* Description */}
          <p className="text-[12.5px] font-sans text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
            {category.description}
          </p>

        </div>

        {/* Link CTA */}
        <div className="pt-2">
          {/* We link to series overview page */}
          <Link
            href={`/blog/series/${category.slug}`}
            className="inline-flex w-full items-center justify-center py-2.5 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-teal-500 hover:text-teal-700 text-slate-700 rounded-xl font-sans font-semibold text-xs transition-all gap-1 group/btn dark:text-slate-300 dark:hover:text-teal-400"
          >
            Browse Guides <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
