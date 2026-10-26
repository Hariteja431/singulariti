"use client";

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
