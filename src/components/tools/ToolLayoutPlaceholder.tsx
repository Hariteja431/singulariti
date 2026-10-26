"use client";

import React from 'react';
import { ToolLayout } from './ToolLayout';

interface ToolLayoutPlaceholderProps {
  utilityId: string;
  title: string;
  description: string;
  categoryName: string;
  categoryHref: string;
}

export function ToolLayoutPlaceholder({
  utilityId,
  title,
  description,
  categoryName,
  categoryHref
}: ToolLayoutPlaceholderProps) {
  return (
    <ToolLayout
      utilityId={utilityId}
      title={title}
      description={description}
      categoryName={categoryName}
      categoryHref={categoryHref}
    >
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    </ToolLayout>
  );
}
