"use client";

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
