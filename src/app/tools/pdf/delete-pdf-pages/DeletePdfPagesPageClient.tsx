"use client";

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
