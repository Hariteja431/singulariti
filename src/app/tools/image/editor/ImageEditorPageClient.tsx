"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


import React from 'react';

import { ImageEditorClient } from '@/components/tools/image-editor/ImageEditorClient';

import { ToolContentBlock } from '@/components/seo/ToolContentBlock';

export function ImageEditorPageClient() {
  return (
    <>
      <ImageEditorClient />
      <ToolContentBlock utilityId="image-compressor" />
    </>
  );
}
