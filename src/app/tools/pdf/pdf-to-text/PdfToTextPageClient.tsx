"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


import dynamic from 'next/dynamic';

const PdfToTextClient = dynamic(
  () => import('./PdfToTextClient').then((m) => m.PdfToTextClient),
  {
  ssr: false,
  loading: () => (
    <ToolLayoutPlaceholder
      utilityId="pdf-to-text"
      title="PDF to Text"
      description="Extract and copy text from PDF documents online. Fully local browser-side processing."
      categoryName="PDF Tools"
      categoryHref="/tools/pdf"
    />
  )
}
);

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
