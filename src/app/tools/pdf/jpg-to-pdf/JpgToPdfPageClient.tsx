"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


import { JpgToPdfClient } from './JpgToPdfClient';




interface Props {
  article?: string;
}

export function JpgToPdfPageClient({ article }: Props) {
  return (
    <>
      <JpgToPdfClient article={article} />
      
    </>
  );
}
