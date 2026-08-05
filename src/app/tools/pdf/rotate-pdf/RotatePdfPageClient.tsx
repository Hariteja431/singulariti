"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


import dynamic from 'next/dynamic';

const RotatePdfClient = dynamic(
  () => import('./RotatePdfClient').then((m) => m.RotatePdfClient),
  {
  ssr: false,
  loading: () => (
    <ToolLayoutPlaceholder
      utilityId="rotate-pdf"
      title="Rotate PDF"
      description="Rotate and align PDF pages online. Fully local browser-side processing."
      categoryName="PDF Tools"
      categoryHref="/tools/pdf"
    />
  )
}
);

interface Props {
  article?: string;
}

export function RotatePdfPageClient({ article }: Props) {
  return (
    <>
      <RotatePdfClient article={article} />
      
    </>
  );
}
