"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


import dynamic from 'next/dynamic';

const PdfToJpgClient = dynamic(
  () => import('./PdfToJpgClient').then((m) => m.PdfToJpgClient),
  {
  ssr: false,
  loading: () => (
    <ToolLayoutPlaceholder
      utilityId="pdf-to-jpg"
      title="PDF to JPG"
      description="Convert PDF pages to JPG images online. Fully local browser-side processing."
      categoryName="PDF Tools"
      categoryHref="/tools/pdf"
    />
  )
}
);

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
