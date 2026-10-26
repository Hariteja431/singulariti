"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


import { ExtractPdfPagesClient } from './ExtractPdfPagesClient';




interface Props {
  article?: string;
}

export function ExtractPdfPagesPageClient({ article }: Props) {
  return (
    <>
      <ExtractPdfPagesClient article={article} />
      
    </>
  );
}
