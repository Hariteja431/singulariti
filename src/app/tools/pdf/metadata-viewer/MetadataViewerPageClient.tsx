"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


import { MetadataViewerClient } from './MetadataViewerClient';




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
