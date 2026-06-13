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
      <h3 className="text-slate-950 dark:text-white font-display font-bold text-xl">
        Ready to use {toolName}?
      </h3>
      <p className="text-slate-600 dark:text-slate-300 text-sm max-w-xl mx-auto">
        Complete your digital tasks in seconds. Zero installations, no accounts, and absolute security with local browser processing.
      </p>
      <div className="pt-2">
        <Link
          href={toolUrl}
          className="inline-flex items-center rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 dark:bg-teal-600 dark:hover:bg-teal-500 gap-2"
        >
          <Play className="w-4 h-4 fill-white" /> Start Using {toolName} Free
        </Link>
      </div>
    </div>
  );
}
