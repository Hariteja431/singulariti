"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


import dynamic from 'next/dynamic';
import React from 'react';

const ImageEditorClient = dynamic(() => import('@/components/tools/image-editor/ImageEditorClient').then(mod => mod.ImageEditorClient), {
  ssr: false,
  loading: () => (
    <ToolLayoutPlaceholder
      utilityId="editor"
      title="Image Editor"
      description="Edit, crop, resize, and apply filters to images online. Fully local browser-side processing."
      categoryName="Image Tools"
      categoryHref="/image"
    />
  )
});

import { ToolContentBlock } from '@/components/seo/ToolContentBlock';

export function ImageEditorPageClient() {
  return (
    <>
      <ImageEditorClient />
      <ToolContentBlock utilityId="image-compressor" />
    </>
  );
}
