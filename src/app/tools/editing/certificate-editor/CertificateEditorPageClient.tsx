"use client";


import { CertificateEditorClient } from './CertificateEditorClient';

interface Props {
  article?: string;
}

export function CertificateEditorPageClient({ article }: Props) {
  return (
    <>
      <CertificateEditorClient article={article} />
    </>
  );
}
