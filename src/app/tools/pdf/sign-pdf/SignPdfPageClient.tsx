"use client";

import { SignPdfClient } from './SignPdfClient';




interface Props {
  article?: string;
}

export function SignPdfPageClient({ article }: Props) {
  return (
    <>
      <SignPdfClient article={article} />
      
    </>
  );
}
