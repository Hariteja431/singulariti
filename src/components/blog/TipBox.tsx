"use client";

import React from 'react';
import { Info } from 'lucide-react';
import DOMPurify from 'dompurify';

interface TipBoxProps {
  heading: string;
  content: string;
  items?: string[];
}

const cleanListItem = (text: string) =>
  text.replace(/^\s*(?:[•\-*\u2022]\s*)+/, '').trim();

export function TipBox({ heading, content, items }: TipBoxProps) {
  return (
    <section className="p-5 border border-indigo-500/20 bg-indigo-500/[0.03] rounded-2xl space-y-3">
      <h3 className="font-display font-bold text-sm text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
        <Info className="w-4 h-4" /> {heading}
      </h3>
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} className="text-sm text-slate leading-relaxed" />
      {items && items.length > 0 && (
        <ul className="space-y-1.5 text-xs pl-0 list-none">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="font-semibold text-indigo-500 dark:text-indigo-400 mt-0.5">•</span>
              <span className="leading-relaxed text-slate">{cleanListItem(item)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
