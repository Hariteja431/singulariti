"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


import dynamic from 'next/dynamic';

const PageCounterClient = dynamic(
  () => import('./PageCounterClient').then((m) => m.PageCounterClient),
  {
  ssr: false,
  loading: () => (
    <ToolLayoutPlaceholder
      utilityId="page-counter"
      title="PDF Page Counter"
      description="Count pages in PDF files and calculate total combined page count online. Fully local browser-side processing."
      categoryName="PDF Tools"
      categoryHref="/tools/pdf"
    />
  )
}
);

interface Props {
  article?: string;
}

export function PageCounterPageClient({ article }: Props) {
  return (
    <>
      <PageCounterClient article={article} />
      
    </>
  );
}
