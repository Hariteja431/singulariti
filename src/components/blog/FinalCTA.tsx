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
    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center space-y-4 max-w-3xl mx-auto shadow-sm">
      <h3 className="font-display font-bold text-xl text-ink">
        Ready to use {toolName}?
      </h3>
      <p className="text-sm text-slate max-w-xl mx-auto">
        Complete your digital tasks in seconds. Zero installations, no accounts, and absolute security with local browser processing.
      </p>
      <div className="pt-2">
        <Link
          href={toolUrl}
          className="inline-flex items-center justify-center px-6 py-3.5 bg-primary hover:bg-primary/95 text-white font-sans font-bold text-sm rounded-xl transition-all shadow-sm gap-2"
        >
          <Play className="w-4 h-4 fill-white" /> Start Using {toolName} Free
        </Link>
      </div>
    </div>
  );
}
