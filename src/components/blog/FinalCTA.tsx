"use client";

import React from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';

interface FinalCTAProps {
  toolName: string;
  toolUrl: string;
}

export function FinalCTA({ toolName, toolUrl }: FinalCTAProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-teal-50/40 via-white to-slate-50 p-8 dark:border-slate-800 dark:from-teal-950/20 dark:via-slate-900 dark:to-slate-950 text-center space-y-4 max-w-3xl mx-auto shadow-sm">
      <h3 className="font-display font-bold text-lg md:text-2xl text-slate-950 dark:text-white leading-tight">
        Ready to try {toolName}?
      </h3>
      <p className="text-[13px] md:text-sm font-sans text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
        Complete your tasks in seconds. Zero software installations, no registration prompts, and absolute privacy with local browser-side processing.
      </p>
      <div className="pt-2">
        <Link
          href={toolUrl}
          className="inline-flex items-center justify-center px-6 py-3 bg-teal-700 hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-550 text-white font-sans font-bold text-xs md:text-sm rounded-xl transition-all duration-200 shadow-sm hover:shadow-md gap-1.5"
        >
          <Play className="w-3.5 h-3.5 fill-white text-white" /> Use {toolName} Free
        </Link>
      </div>
    </div>
  );
}
