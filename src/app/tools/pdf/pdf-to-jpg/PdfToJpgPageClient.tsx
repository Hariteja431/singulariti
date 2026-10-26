"use client";

import { PdfToJpgClient } from './PdfToJpgClient';




interface Props {
  article?: string;
}

export function PdfToJpgPageClient({ article }: Props) {
  return (
    <>
      <PdfToJpgClient article={article} />
      
    </>
  );
}
