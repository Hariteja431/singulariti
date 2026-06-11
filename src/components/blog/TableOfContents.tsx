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
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

  // Parse headings
  useEffect(() => {
    if (sections && sections.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
      // Find headings from rendered DOM
      const container = document.querySelector('.blog-article-content');
      if (!container) return;

      const hElements = container.querySelectorAll('h2, h3');
      const items: HeaderItem[] = [];

      hElements.forEach((el, idx) => {
        const id = el.id || `heading-${idx}`;
        if (!el.id) el.id = id;
        items.push({
          id,
          text: el.textContent || '',
          isSub: el.tagName.toLowerCase() === 'h3'
        });
      });

      setHeadings(items);
    }
  }, [htmlContent, sections]);

  // Observer to track which section is currently visible in viewport
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          // Pick the first visible item
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-100px 0px -60% 0px',
        threshold: 0
      }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 90; // Adjust scroll margin offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveId(id);
      setIsMobileOpen(false); // Close accordion on mobile after clicking
    }
  };

  return (
    <>
      {/* Mobile Layout (Visible on screens < lg) */}
      <div className="lg:hidden w-full bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-6 dark:border-slate-800 dark:bg-slate-900">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-expanded={isMobileOpen}
          className="w-full flex items-center justify-between text-slate-900 dark:text-white font-sans font-bold text-xs uppercase tracking-wider focus:outline-none"
        >
          <span className="flex items-center gap-2">
            <AlignLeft className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>On This Page</span>
          </span>
          {isMobileOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          )}
        </button>

        {isMobileOpen && (
          <ul className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3 text-[13px] font-sans text-slate-600 dark:text-slate-300 animate-in fade-in slide-in-from-top-2 duration-150">
            {headings.map((h) => {
              const isActive = activeId === h.id;
              return (
                <li key={h.id} style={{ paddingLeft: h.isSub ? '12px' : '0' }}>
                  <a
                    href={`#${h.id}`}
                    onClick={(e) => handleLinkClick(e, h.id)}
                    className={`block py-1 hover:text-teal-700 dark:hover:text-teal-300 transition-colors leading-tight ${
                      isActive 
                        ? 'text-teal-700 dark:text-teal-300 font-semibold' 
                        : h.isSub 
                          ? 'text-slate-500 dark:text-slate-450 font-normal text-[12px]' 
                          : 'text-slate-800 dark:text-slate-200 font-medium'
                    }`}
                  >
                    {h.text}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Desktop Layout (Sticky Sidebar, Visible on screens >= lg) */}
      <nav className="hidden lg:block space-y-4 sticky top-24 p-5 bg-white border border-slate-200 rounded-2xl max-h-[75vh] overflow-y-auto shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 className="font-display font-bold text-xs text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <AlignLeft className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Table of Contents
        </h3>
        <ul className="space-y-3 text-[13px] font-sans">
          {headings.map((h) => {
            const isActive = activeId === h.id;
            return (
              <li key={h.id} style={{ paddingLeft: h.isSub ? '12px' : '0' }}>
                <a
                  href={`#${h.id}`}
                  onClick={(e) => handleLinkClick(e, h.id)}
                  className={`hover:text-teal-700 dark:hover:text-teal-300 transition-all block leading-tight py-0.5 border-l-2 pl-3 -ml-3 transition-colors duration-150 ${
                    isActive
                      ? 'border-teal-600 text-teal-700 dark:border-teal-300 dark:text-teal-300 font-semibold'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  } ${h.isSub ? 'text-[12px]' : ''}`}
                >
                  {h.text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
