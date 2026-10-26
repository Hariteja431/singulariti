"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


import { ProtectPdfClient } from './ProtectPdfClient';




interface Props {
  article?: string;
}

export function ProtectPdfPageClient({ article }: Props) {
  return (
    <>
      <ProtectPdfClient article={article} />
      
    </>
  );
}
