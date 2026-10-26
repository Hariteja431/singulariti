"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


import { RotatePdfClient } from './RotatePdfClient';




interface Props {
  article?: string;
}

export function RotatePdfPageClient({ article }: Props) {
  return (
    <>
      <RotatePdfClient article={article} />
      
    </>
  );
}
