"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


import { SplitPdfClient } from './SplitPdfClient';




interface Props {
  article?: string;
}

export function SplitPdfPageClient({ article }: Props) {
  return (
    <>
      <SplitPdfClient article={article} />
      
    </>
  );
}
