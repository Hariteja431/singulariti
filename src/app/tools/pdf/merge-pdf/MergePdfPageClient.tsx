"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


import dynamic from 'next/dynamic';

const MergePdfClient = dynamic(
  () => import('./MergePdfClient').then((m) => m.MergePdfClient),
  {
  ssr: false,
  loading: () => (
    <ToolLayoutPlaceholder
      utilityId="merge-pdf"
      title="Merge PDF"
      description="Merge and combine multiple PDF files into one online. Fully local browser-side processing."
      categoryName="PDF Tools"
      categoryHref="/tools/pdf"
    />
  )
}
);

interface Props {
  article?: string;
}

export function MergePdfPageClient({ article }: Props) {
  return (
    <>
      <MergePdfClient article={article} />
      
    </>
  );
}
