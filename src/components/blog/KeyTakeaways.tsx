import React from 'react';
import { Check } from 'lucide-react';

interface KeyTakeawaysProps {
  takeaways: string[];
}

export function KeyTakeaways({ takeaways }: KeyTakeawaysProps) {
  if (!takeaways || takeaways.length === 0) return null;

  return (
    <div className="rounded-2xl border border-teal-100 bg-teal-50/60 p-6 dark:border-teal-900 dark:bg-teal-950/30 my-8">
      <h3 className="font-display font-extrabold text-base md:text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        Key Takeaways
      </h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-0 list-none">
        {takeaways.map((takeaway, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <Check className="w-4 h-4 text-teal-700 dark:text-teal-300 mt-1 shrink-0 font-bold" />
            <span>{takeaway}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
