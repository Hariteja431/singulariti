"use client";

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
