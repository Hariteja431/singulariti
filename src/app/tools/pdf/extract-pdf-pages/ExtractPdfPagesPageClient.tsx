"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


import dynamic from 'next/dynamic';

const ExtractPdfPagesClient = dynamic(
  () => import('./ExtractPdfPagesClient').then((m) => m.ExtractPdfPagesClient),
  {
  ssr: false,
  loading: () => (
    <ToolLayoutPlaceholder
      utilityId="extract-pdf-pages"
      title="Extract PDF Pages"
      description="Extract and save specific pages from PDF files online. Fully local browser-side processing."
      categoryName="PDF Tools"
      categoryHref="/tools/pdf"
    />
  )
}
);

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
