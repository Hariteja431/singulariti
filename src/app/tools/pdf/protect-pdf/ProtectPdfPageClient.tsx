"use client";

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
