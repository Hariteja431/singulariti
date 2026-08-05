"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


import dynamic from 'next/dynamic';

const SplitPdfClient = dynamic(
  () => import('./SplitPdfClient').then((m) => m.SplitPdfClient),
  {
  ssr: false,
  loading: () => (
    <ToolLayoutPlaceholder
      utilityId="split-pdf"
      title="Split PDF"
      description="Split PDF files into individual page files online. Fully local browser-side processing."
      categoryName="PDF Tools"
      categoryHref="/tools/pdf"
    />
  )
}
);

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
