"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


import dynamic from 'next/dynamic';

const MetadataViewerClient = dynamic(
  () => import('./MetadataViewerClient').then((m) => m.MetadataViewerClient),
  {
  ssr: false,
  loading: () => (
    <ToolLayoutPlaceholder
      utilityId="metadata-viewer"
      title="PDF Metadata Viewer"
      description="View and inspect PDF document metadata properties online. Fully local browser-side processing."
      categoryName="PDF Tools"
      categoryHref="/tools/pdf"
    />
  )
}
);

interface Props {
  article?: string;
}

export function MetadataViewerPageClient({ article }: Props) {
  return (
    <>
      <MetadataViewerClient article={article} />
      
    </>
  );
}
