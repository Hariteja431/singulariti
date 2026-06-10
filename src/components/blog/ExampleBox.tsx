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
    <section id="example" className="border border-border rounded-2xl overflow-hidden space-y-0 shadow-sm bg-surface">
      <div className="bg-surface border-b border-border p-4 flex items-center gap-2">
        <Play className="w-4 h-4 text-primary fill-primary/10" />
        <h3 className="font-display font-bold text-sm text-ink uppercase tracking-wider">{heading}</h3>
      </div>
      <div className="p-6 bg-background/40 space-y-4">
        <p className="text-sm text-slate leading-relaxed">{content}</p>
        {items && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {items.map((item, idx) => {
              const parts = item.split(': ');
              if (parts.length >= 2) {
                const label = parts[0];
                const value = parts.slice(1).join(': ');
                return (
                  <div key={idx} className="border border-border bg-surface rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate block mb-1">
                        {label}
                      </span>
                      <span className="text-ink leading-relaxed font-semibold block whitespace-pre-line">
                        {value}
                      </span>
                    </div>
                  </div>
                );
              }
              return (
                <div key={idx} className="border border-border bg-surface rounded-xl p-4 text-ink">
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
