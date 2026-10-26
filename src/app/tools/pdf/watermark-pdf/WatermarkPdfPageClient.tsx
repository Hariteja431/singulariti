"use client";

import { WatermarkPdfClient } from './WatermarkPdfClient';




interface Props {
  article?: string;
}

export function WatermarkPdfPageClient({ article }: Props) {
  return (
    <>
      <WatermarkPdfClient article={article} />
      
    </>
  );
}
