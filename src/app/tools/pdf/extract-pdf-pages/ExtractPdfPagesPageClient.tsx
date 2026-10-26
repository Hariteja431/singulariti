"use client";

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
