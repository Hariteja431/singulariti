"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


import dynamic from 'next/dynamic';

const WatermarkPdfClient = dynamic(
  () => import('./WatermarkPdfClient').then((m) => m.WatermarkPdfClient),
  {
  ssr: false,
  loading: () => (
    <ToolLayoutPlaceholder
      utilityId="watermark-pdf"
      title="Watermark PDF"
      description="Add text or image watermark overlays to PDF files online. Fully local browser-side processing."
      categoryName="PDF Tools"
      categoryHref="/tools/pdf"
    />
  )
}
);

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
