"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


import { WatermarkPdfClient } from './WatermarkPdfClient';




interface Props {
  article?: string;
}

export function WatermarkPdfPageClient({ article }: Props) {
  return (
    <>
      <WatermarkPdfClient article={article} />
      
    </>
  );
}
