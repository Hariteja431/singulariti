"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


import { PdfToTextClient } from './PdfToTextClient';




interface Props {
  article?: string;
}

export function PdfToTextPageClient({ article }: Props) {
  return (
    <>
      <PdfToTextClient article={article} />
      
    </>
  );
}
