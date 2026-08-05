"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


import dynamic from 'next/dynamic';

const CompressPdfClient = dynamic(
  () => import('./CompressPdfClient').then((m) => m.CompressPdfClient),
  {
  ssr: false,
  loading: () => (
    <ToolLayoutPlaceholder
      utilityId="compress-pdf"
      title="Compress PDF"
      description="Compress and shrink PDF file size online. Fully local browser-side processing."
      categoryName="PDF Tools"
      categoryHref="/tools/pdf"
    />
  )
}
);

import { ToolContentBlock } from '@/components/seo/ToolContentBlock';

export function CompressPdfPageClient() {
  return (
    <>
      <CompressPdfClient />
      <ToolContentBlock utilityId="compress-pdf" />
    </>
  );
}
