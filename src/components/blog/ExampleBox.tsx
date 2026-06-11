"use client";

import React from 'react';
import { Play } from 'lucide-react';

interface ExampleBoxProps {
  heading: string;
  content: string;
  items?: string[];
}

export function ExampleBox({ heading, content, items }: ExampleBoxProps) {
  return (
    <section id="example" className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="bg-slate-50 border-b border-slate-200 dark:bg-slate-950 dark:border-slate-800 px-5 py-4 flex items-center gap-2">
        <Play className="w-4 h-4 text-teal-700 fill-teal-50 dark:text-teal-400 dark:fill-teal-950/40" />
        <h3 className="font-display font-bold text-xs md:text-sm text-slate-950 dark:text-white uppercase tracking-wider">
          {heading}
        </h3>
      </div>
      <div className="p-6 space-y-4">
        <p className="text-xs md:text-sm text-slate-650 dark:text-slate-300 leading-relaxed font-sans">
          {content}
        </p>
        
        {items && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[12px] font-mono">
            {items.map((item, idx) => {
              const parts = item.split(': ');
              if (parts.length >= 2) {
                const label = parts[0];
                const value = parts.slice(1).join(': ');
                return (
                  <div key={idx} className="border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/40 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block mb-1 font-sans">
                        {label}
                      </span>
                      <span className="text-slate-900 dark:text-white leading-relaxed font-semibold block whitespace-pre-line font-sans">
                        {value}
                      </span>
                    </div>
                  </div>
                );
              }
              return (
                <div key={idx} className="border border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-950/40 rounded-xl p-4 text-slate-700 dark:text-slate-300 font-sans">
                  {item}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
