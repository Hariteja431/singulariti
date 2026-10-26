"use client";

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
