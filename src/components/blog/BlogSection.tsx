"use client";

import React from 'react';
import { ExampleBox } from './ExampleBox';
import { TipBox } from './TipBox';
import { WarningBox } from './WarningBox';
import { ListChecks, BookOpen, Layers } from 'lucide-react';

interface BlogSectionProps {
  section: {
    id: string;
    heading: string;
    content: string;
    type?: "paragraph" | "steps" | "bullets" | "example" | "tip" | "warning";
    items?: string[];
  };
}

const cleanStepText = (text: string) =>
  text.replace(/^\s*(?:\d+[\.\)\-]\s*)+/, '').trim();

const cleanListItem = (text: string) =>
  text.replace(/^\s*(?:[•\-*\u2022]\s*)+/, '').trim();

export function BlogSection({ section }: BlogSectionProps) {
  const { id, heading, content, type = "paragraph", items = [] } = section;

  if (type === "example") {
    return <ExampleBox heading={heading} content={content} items={items} />;
  }

  if (type === "tip") {
    return <TipBox heading={heading} content={content} items={items} />;
  }

  if (type === "warning") {
    return <WarningBox heading={heading} content={content} items={items} />;
  }

  return (
    <section id={id} className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800/40 first:border-0 first:pt-0">
      <h2 className="font-display font-bold text-xl text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
        {type === "steps" ? (
          <ListChecks className="w-5 h-5 text-primary" />
        ) : type === "bullets" ? (
          <Layers className="w-5 h-5 text-primary" />
        ) : (
          <BookOpen className="w-5 h-5 text-primary" />
        )}
        {heading}
      </h2>

      <p className="text-sm leading-relaxed text-slate-650 dark:text-slate-300">{content}</p>

      {type === "steps" && items.length > 0 && (
        <ol className="space-y-3 list-none pl-0 pt-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm">
              <span className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed text-slate-650 dark:text-slate-300 pt-0.5">{cleanStepText(item)}</span>
            </li>
          ))}
        </ol>
      )}

      {type === "bullets" && items.length > 0 && (
        <ul className="space-y-2 list-none pl-0 pt-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
              <span className="leading-relaxed text-slate-650 dark:text-slate-300">{cleanListItem(item)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
