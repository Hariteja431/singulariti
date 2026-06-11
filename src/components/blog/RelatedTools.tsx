"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Link2 } from 'lucide-react';
import { toolRegistry, sectionRegistry } from '@/content/tools/toolRegistry';

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
    <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 space-y-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="space-y-1">
        <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <Link2 className="w-5 h-5 text-teal-600 dark:text-teal-400" /> Related Tools & Resources
        </h3>
        <p className="text-[13px] font-sans text-slate-600 dark:text-slate-300">
          Run these calculations, conversions, or optimizations locally inside your browser with these secure utility tools:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tools.map((tool, idx) => {
          // Dynamically look up the tool in our registry to get its category badge
          const matchedTool = toolRegistry.find(
            t => t.utilityUrl === tool.url || t.name.toLowerCase() === tool.name.toLowerCase()
          );
          const matchedSection = matchedTool 
            ? sectionRegistry.find(s => s.id === matchedTool.sectionId) 
            : null;
          const categoryBadge = matchedSection
            ? matchedSection.name.replace(' Utilities', '').replace(' Tools', '')
            : "Utility";

          const descriptionText = tool.reason || tool.description || "Free online browser-based tool.";

          return (
            <div
              key={idx}
              className="bg-slate-50 border border-slate-200 hover:border-teal-300 hover:shadow-md rounded-xl p-5 flex flex-col justify-between group transition-all duration-200 shadow-sm dark:bg-slate-950 dark:border-slate-800 dark:hover:border-teal-700"
            >
              <div className="space-y-3">
                {/* Category Badge */}
                <div>
                  <span className="text-[9.5px] font-sans font-bold uppercase tracking-wider text-teal-700 bg-teal-50 dark:text-teal-400 dark:bg-teal-950/20 px-2 py-0.5 rounded-md">
                    {categoryBadge}
                  </span>
                </div>

                {/* Tool Name */}
                <h4 className="font-display font-bold text-sm md:text-base text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {tool.name}
                </h4>

                {/* Description */}
                <p className="font-sans text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                  {descriptionText}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-3 border-t border-slate-200 dark:border-slate-800">
                <Link
                  href={tool.url}
                  className="inline-flex w-full items-center justify-between text-xs font-sans font-bold text-teal-700 hover:text-teal-850 dark:text-teal-300 dark:hover:text-teal-200 group/btn"
                >
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
