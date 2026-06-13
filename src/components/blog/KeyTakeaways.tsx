import React from 'react';
import { Lightbulb } from 'lucide-react';

interface KeyTakeawaysProps {
  items: string[];
}

export default function KeyTakeaways({ items }: KeyTakeawaysProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-teal-100 bg-teal-50/60 p-6 dark:border-teal-900 dark:bg-teal-950/30 space-y-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-teal-700 dark:text-teal-300 flex-shrink-0" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Key Takeaways
        </h3>
      </div>
      <ul className="space-y-2.5">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
            <span className="text-teal-700 dark:text-teal-300 mt-1 flex-shrink-0">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
