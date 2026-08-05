"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


import dynamic from 'next/dynamic';

const RearrangePdfPagesClient = dynamic(
  () => import('./RearrangePdfPagesClient').then((m) => m.RearrangePdfPagesClient),
  {
  ssr: false,
  loading: () => (
    <ToolLayoutPlaceholder
      utilityId="rearrange-pdf-pages"
      title="Rearrange PDF Pages"
      description="Reorder and organize page sequence in PDF files online. Fully local browser-side processing."
      categoryName="PDF Tools"
      categoryHref="/tools/pdf"
    />
  )
}
);

interface Props {
  article?: string;
}

export function RearrangePdfPagesPageClient({ article }: Props) {
  return (
    <>
      <RearrangePdfPagesClient article={article} />
      
    </>
  );
}
