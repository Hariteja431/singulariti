"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


import { DeletePdfPagesClient } from './DeletePdfPagesClient';




interface Props {
  article?: string;
}

export function DeletePdfPagesPageClient({ article }: Props) {
  return (
    <>
      <DeletePdfPagesClient article={article} />
      
    </>
  );
}
