"use client";

import React, { useEffect, useState } from 'react';
import { AlignLeft, ChevronDown, ChevronUp } from 'lucide-react';

interface HeaderItem {
  id: string;
  text: string;
  isSub: boolean;
}

interface TableOfContentsProps {
  htmlContent?: string;
  sections?: { id: string; heading: string }[];
}

export function TableOfContents({ htmlContent, sections }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<HeaderItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isMobileCollapsed, setIsMobileCollapsed] = useState<boolean>(true);

  useEffect(() => {
    if (sections && sections.length > 0) {
      setHeadings(
        sections.map((sec) => ({
          id: sec.id,
          text: sec.heading,
          isSub: false
        }))
      );
      return;
    }

    if (htmlContent) {
      const container = document.querySelector('.blog-article-content');
      if (!container) return;

      const hElements = container.querySelectorAll('h2, h3');
      const items: HeaderItem[] = [];

      hElements.forEach((el, idx) => {
        const id = el.id || `heading-${idx}`;
        el.id = id;
        items.push({
          id,
          text: el.textContent || '',
          isSub: el.tagName.toLowerCase() === 'h3'
        });
      });

      setHeadings(items);
    }
  }, [htmlContent, sections]);

  // ScrollSpy to highlight active heading
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          setActiveId(visibleEntry.target.id);
        }
      },
      { rootMargin: '0px 0px -60% 0px', threshold: 0.1 }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sticky top-24 max-h-[80vh] overflow-y-auto shadow-sm">
      {/* Mobile Collapsible Header */}
      <div 
        onClick={() => setIsMobileCollapsed(!isMobileCollapsed)}
        className="flex items-center justify-between lg:pointer-events-none cursor-pointer border-b border-slate-100 dark:border-slate-800/80 pb-3"
      >
        <h3 className="text-slate-900 dark:text-white font-display font-bold text-sm uppercase tracking-wider flex items-center gap-2">
          <AlignLeft className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Table of Contents
        </h3>
        <span className="lg:hidden text-slate-500 dark:text-slate-400">
          {isMobileCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </span>
      </div>

      {/* Collapsible Content Wrapper */}
      <ul className={`space-y-2.5 text-[13px] font-sans mt-3 transition-all duration-300 ${isMobileCollapsed ? 'hidden lg:block' : 'block'}`}>
        {headings.map((h) => {
          const isActive = h.id === activeId;
          return (
            <li key={h.id} style={{ paddingLeft: h.isSub ? '12px' : '0' }}>
              <a
                href={`#${h.id}`}
                onClick={() => setIsMobileCollapsed(true)} // Auto-collapse on click on mobile
                className={`transition-colors block leading-tight py-0.5 ${
                  isActive
                    ? 'text-teal-700 dark:text-teal-300 font-semibold'
                    : 'text-slate-600 hover:text-teal-700 dark:text-slate-300 dark:hover:text-teal-300'
                } ${h.isSub ? 'text-[12px] font-normal' : 'text-sm'}`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
