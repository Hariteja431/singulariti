"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


import { RearrangePdfPagesClient } from './RearrangePdfPagesClient';




interface Props {
  article?: string;
}

export function RearrangePdfPagesPageClient({ article }: Props) {
  return (
    <>
      <RearrangePdfPagesClient article={article} />
      
    </>
  );
}
