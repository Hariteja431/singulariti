"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


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
