"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


import dynamic from 'next/dynamic';

const ProtectPdfClient = dynamic(
  () => import('./ProtectPdfClient').then((m) => m.ProtectPdfClient),
  {
  ssr: false,
  loading: () => (
    <ToolLayoutPlaceholder
      utilityId="protect-pdf"
      title="Protect PDF"
      description="Encrypt and password protect PDF documents online. Fully local browser-side processing."
      categoryName="PDF Tools"
      categoryHref="/tools/pdf"
    />
  )
}
);

interface Props {
  article?: string;
}

export function ProtectPdfPageClient({ article }: Props) {
  return (
    <>
      <ProtectPdfClient article={article} />
      
    </>
  );
}
