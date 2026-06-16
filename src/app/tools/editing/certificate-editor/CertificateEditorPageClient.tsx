"use client";

import dynamic from 'next/dynamic';

const CertificateEditorClient = dynamic(
  () => import('./CertificateEditorClient').then((m) => m.CertificateEditorClient),
  { ssr: false }
);

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
