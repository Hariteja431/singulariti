"use client";

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
