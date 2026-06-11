"use client";

import React from 'react';
import { Info } from 'lucide-react';

interface TipBoxProps {
  heading: string;
  content: string;
  items?: string[];
}

const cleanListItem = (text: string) =>
  text.replace(/^\s*(?:[•\-*\u2022]\s*)+/, '').trim();

export function TipBox({ heading, content, items }: TipBoxProps) {
  return (
    <section className="p-5 border border-teal-100 bg-teal-50/60 dark:border-teal-900/50 dark:bg-teal-950/20 rounded-2xl space-y-3 shadow-sm">
      <h3 className="font-display font-bold text-xs md:text-sm text-teal-800 dark:text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
        <Info className="w-4.5 h-4.5 text-teal-700 dark:text-teal-400" /> {heading}
      </h3>
      <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">{content}</p>
      {items && items.length > 0 && (
         <ul className="space-y-1.5 text-xs md:text-[13px] pl-0 list-none font-sans">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="font-semibold text-teal-700 dark:text-teal-300 mt-0.5">•</span>
              <span className="leading-relaxed text-slate-650 dark:text-slate-300">{cleanListItem(item)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
