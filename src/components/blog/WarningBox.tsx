"use client";

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface WarningBoxProps {
  heading: string;
  content: string;
  items?: string[];
}

const cleanListItem = (text: string) =>
  text.replace(/^\s*(?:[•\-*\u2022]\s*)+/, '').trim();

export function WarningBox({ heading, content, items }: WarningBoxProps) {
  return (
    <section className="p-5 border border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20 rounded-2xl space-y-3 shadow-sm">
      <h3 className="font-display font-bold text-xs md:text-sm text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
        <AlertTriangle className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" /> {heading}
      </h3>
      <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">{content}</p>
      {items && items.length > 0 && (
        <ul className="space-y-1.5 text-xs md:text-[13px] pl-0 list-none font-sans">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="font-semibold text-amber-600 dark:text-amber-400 mt-0.5">•</span>
              <span className="leading-relaxed text-slate-650 dark:text-slate-300">{cleanListItem(item)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
