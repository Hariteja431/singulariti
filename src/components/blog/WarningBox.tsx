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
    <section className="p-5 border border-amber-500/20 bg-amber-500/[0.03] rounded-2xl space-y-3">
      <h3 className="font-display font-bold text-sm text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
        <AlertTriangle className="w-4 h-4" /> {heading}
      </h3>
      <p className="text-sm text-slate leading-relaxed">{content}</p>
      {items && items.length > 0 && (
        <ul className="space-y-1.5 text-xs pl-0 list-none">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="font-semibold text-amber-500 dark:text-amber-400 mt-0.5">•</span>
              <span className="leading-relaxed text-slate">{cleanListItem(item)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
