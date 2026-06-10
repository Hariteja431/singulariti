"use client";

import dynamic from 'next/dynamic';

const CompressPdfClient = dynamic(
  () => import('./CompressPdfClient').then((m) => m.CompressPdfClient),
  { ssr: false }
);

import { ToolContentBlock } from '@/components/seo/ToolContentBlock';

export function CompressPdfPageClient() {
  return (
    <>
      <CompressPdfClient />
      <ToolContentBlock utilityId="compress-pdf" />
    </>
  );
}
