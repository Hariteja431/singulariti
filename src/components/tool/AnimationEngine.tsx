"use client";

import React from 'react';
import { ToolRegistryItem } from '../../registry/types';
import { GifMakerContainer } from '../tools/animation/GifMakerContainer';

interface AnimationEngineProps {
  tool: ToolRegistryItem;
}

export function AnimationEngine({ tool }: AnimationEngineProps) {
  if (tool.id === 'gif-maker') {
    return <GifMakerContainer tool={tool} />;
  }

  return (
    <div className="w-full max-w-5xl mx-auto my-12 text-center p-12 bg-surface border border-border rounded-xl">
      <h2 className="text-xl font-bold font-display text-ink mb-2">Tool Not Implemented</h2>
      <p className="text-slate font-sans">The animation tool "{tool.name}" is currently under construction.</p>
    </div>
  );
}
