"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


import dynamic from 'next/dynamic';

const DeletePdfPagesClient = dynamic(
  () => import('./DeletePdfPagesClient').then((m) => m.DeletePdfPagesClient),
  {
  ssr: false,
  loading: () => (
    <ToolLayoutPlaceholder
      utilityId="delete-pdf-pages"
      title="Delete PDF Pages"
      description="Remove and delete pages from PDF files online. Fully local browser-side processing."
      categoryName="PDF Tools"
      categoryHref="/tools/pdf"
    />
  )
}
);

interface Props {
  article?: string;
}

export function DeletePdfPagesPageClient({ article }: Props) {
  return (
    <>
      <DeletePdfPagesClient article={article} />
      
    </>
  );
}
