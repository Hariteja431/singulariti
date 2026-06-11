import React from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, FileText } from 'lucide-react';

export type FeaturedBlogCardProps = {
  title: string;
  description: string;
  categories: string[];
  author?: string;
  published: string;
  readTime?: string;
  url: string;
  image?: string;
  imageAlt?: string;
  isCompact?: boolean;
};

export function FeaturedBlogCard({
  title,
  description,
  categories,
  author,
  published,
  readTime,
  url,
  image,
  imageAlt,
  isCompact = false,
}: FeaturedBlogCardProps) {
  if (isCompact) {
    return (
      <div className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-[#020617] p-6 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/60 hover:shadow-2xl flex flex-col justify-between h-full">
        {/* Content */}
        <div className="flex flex-col justify-between flex-grow z-20 relative">
          <div>
            {/* Category labels row */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 items-center">
              {categories.map((category, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-medium uppercase tracking-[0.22em] text-teal-300"
                >
                  {category}
                </span>
              ))}
            </div>

            {/* Title */}
            <h3 className="mt-4 max-w-xl text-xl font-bold leading-snug tracking-tight text-white md:text-2xl line-clamp-2">
              <Link href={url} className="hover:text-teal-300 transition-colors focus:outline-none">
                {/* Entire card clickable overlay */}
                <span className="absolute inset-0 z-10" aria-hidden="true" />
                {title}
              </Link>
            </h3>

            {/* Description */}
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-400 line-clamp-2">
              {description}
            </p>
          </div>

          <div>
            {/* Meta row: author / published / readTime */}
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              {author && (
                <>
                  <span>{author}</span>
                  <span className="text-slate-600">•</span>
                </>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-teal-500/80" />
                {published}
              </span>
              {readTime && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-teal-500/80" />
                    {readTime}
                  </span>
                </>
              )}
            </div>

            {/* Read more link with ArrowRight icon */}
            <div className="mt-6">
              <Link
                href={url}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-teal-300 z-20 relative"
              >
                Read more
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Image Area - stacked below content for compact mode */}
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-700 bg-slate-100 shadow-2xl z-20 relative aspect-[16/9] w-full flex-shrink-0">
          <Link href={url} className="block w-full h-full">
            {image ? (
              <img
                src={image}
                alt={imageAlt || title}
                className="aspect-[16/9] h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex aspect-[16/9] h-full w-full items-center justify-center bg-slate-100 text-slate-900 flex-col gap-2">
                <div className="p-2.5 rounded-full bg-slate-200/80 text-teal-700 shadow-inner">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="font-display font-semibold text-[10px] tracking-widest text-slate-500 uppercase">
                  Singulariti
                </span>
              </div>
            )}
          </Link>
        </div>
      </div>
    );
  }

  // Full Large Card Layout
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-[#020617] p-6 text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-teal-500/60 hover:shadow-2xl md:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        {/* Left Column Content */}
        <div className="flex flex-col justify-between h-full z-20 relative">
          <div>
            {/* Category labels row */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 items-center">
              {categories.map((category, idx) => (
                <span
                  key={idx}
                  className="text-xs font-medium uppercase tracking-[0.22em] text-teal-300"
                >
                  {category}
                </span>
              ))}
            </div>

            {/* H2 Title */}
            <h2 className="mt-8 max-w-xl text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl lg:text-5xl line-clamp-2">
              <Link href={url} className="hover:text-teal-300 transition-colors focus:outline-none">
                {/* Entire card clickable overlay */}
                <span className="absolute inset-0 z-10" aria-hidden="true" />
                {title}
              </Link>
            </h2>

            {/* Description */}
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-400 md:text-lg line-clamp-2">
              {description}
            </p>
          </div>

          <div>
            {/* Meta row: author / published / readTime */}
            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-400">
              {author && (
                <>
                  <span>{author}</span>
                  <span className="text-slate-600">•</span>
                </>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-teal-500/80" />
                {published}
              </span>
              {readTime && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-teal-500/80" />
                    {readTime}
                  </span>
                </>
              )}
            </div>

            {/* Read more link with ArrowRight icon */}
            <div className="mt-10">
              <Link
                href={url}
                className="inline-flex items-center gap-2 text-base font-semibold text-white transition-colors hover:text-teal-300 z-20 relative"
              >
                Read more
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column Image Area */}
        <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-100 shadow-2xl z-20 relative aspect-[16/9] lg:max-h-72 w-full">
          <Link href={url} className="block w-full h-full">
            {image ? (
              <img
                src={image}
                alt={imageAlt || title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex aspect-[16/9] h-full w-full items-center justify-center bg-slate-100 text-slate-900 flex-col gap-3">
                <div className="p-4 rounded-full bg-slate-200/80 text-teal-700 shadow-inner">
                  <FileText className="w-8 h-8" />
                </div>
                <span className="font-display font-semibold text-sm tracking-widest text-slate-500 uppercase">
                  Singulariti
                </span>
              </div>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}
