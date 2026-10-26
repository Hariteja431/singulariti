"use client";

import { CompressPdfClient } from './CompressPdfClient';




import { ToolContentBlock } from '@/components/seo/ToolContentBlock';

export function CompressPdfPageClient() {
  return (
    <>
      <CompressPdfClient />
      <ToolContentBlock utilityId="compress-pdf" />
    </>
  );
}
