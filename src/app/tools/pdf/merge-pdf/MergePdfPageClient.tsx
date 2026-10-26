"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


import { MergePdfClient } from './MergePdfClient';

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
