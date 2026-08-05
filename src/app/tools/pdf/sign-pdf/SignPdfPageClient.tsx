"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


import dynamic from 'next/dynamic';

const SignPdfClient = dynamic(
  () => import('./SignPdfClient').then((m) => m.SignPdfClient),
  {
  ssr: false,
  loading: () => (
    <ToolLayoutPlaceholder
      utilityId="sign-pdf"
      title="Sign PDF"
      description="Draw or insert signatures and sign PDF files online. Fully local browser-side processing."
      categoryName="PDF Tools"
      categoryHref="/tools/pdf"
    />
  )
}
);

interface Props {
  article?: string;
}

export function SignPdfPageClient({ article }: Props) {
  return (
    <>
      <SignPdfClient article={article} />
      
    </>
  );
}
