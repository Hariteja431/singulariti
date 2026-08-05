"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


import dynamic from 'next/dynamic';

const JpgToPdfClient = dynamic(
  () => import('./JpgToPdfClient').then((m) => m.JpgToPdfClient),
  {
  ssr: false,
  loading: () => (
    <ToolLayoutPlaceholder
      utilityId="jpg-to-pdf"
      title="JPG to PDF"
      description="Convert JPG images to PDF documents online. Fully local browser-side processing."
      categoryName="PDF Tools"
      categoryHref="/tools/pdf"
    />
  )
}
);

interface Props {
  article?: string;
}

export function JpgToPdfPageClient({ article }: Props) {
  return (
    <>
      <JpgToPdfClient article={article} />
      
    </>
  );
}
