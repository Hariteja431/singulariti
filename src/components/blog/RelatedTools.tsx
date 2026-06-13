"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Link2 } from 'lucide-react';

interface RelatedToolItem {
  name: string;
  url: string;
  reason?: string;
  description?: string;
}

interface RelatedToolsProps {
  tools: RelatedToolItem[];
}

export function RelatedTools({ tools }: RelatedToolsProps) {
  if (!tools || tools.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-4">
      <h3 className="text-slate-900 dark:text-white font-display font-bold text-lg flex items-center gap-2">
        <Link2 className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Related Tools & Resources
      </h3>
      <p className="text-slate-600 dark:text-slate-300 text-sm">
        Run these calculations or operations locally in the browser with these free utility tools:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {tools.map((tool, idx) => (
          <Link
            key={idx}
            href={tool.url}
            className="flex items-start justify-between p-4 bg-slate-50 border border-slate-200 hover:border-teal-300 dark:bg-slate-950 dark:border-slate-800 dark:hover:border-teal-700 rounded-xl group transition-all duration-200"
          >
            <div className="space-y-1 pr-4">
              <span className="font-semibold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-300 transition-colors block text-sm">
                {tool.name}
              </span>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                {tool.reason || tool.description}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-1 transition-all flex-shrink-0 mt-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}
