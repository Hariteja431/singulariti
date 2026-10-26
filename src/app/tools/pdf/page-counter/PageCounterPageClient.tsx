"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


import { PageCounterClient } from './PageCounterClient';




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
