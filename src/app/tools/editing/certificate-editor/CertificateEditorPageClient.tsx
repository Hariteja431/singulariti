"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ToolLayout } from '@/components/tools/ToolLayout';

const CertificateEditorClient = dynamic(
  () => import('./CertificateEditorClient').then((m) => m.CertificateEditorClient),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    )
  }
);

interface Props {
  article?: string;
}

export function CertificateEditorPageClient({ article }: Props) {
  const [error, setError] = useState<string | null>(null);

  return (
    <ToolLayout
      article={article}
      howToUse={[
        "Choose to start from a pre-made design template, or upload any PDF/Image certificate from your local path.",
        "Add headings, recipient names, custom paragraphs, or dates to the certificate template.",
        "Double click any text on the canvas to customize and edit its words.",
        "Modify visual details like fonts, sizes, colors, and line styles using the properties panel.",
        "Overlay transparent brand logos or paint signature brushstrokes directly onto the layout.",
        "Open the Signature Pad modal to sketch and insert smooth vector-like digital signatures.",
        "Export the final print-ready design as a vector PDF document or high-quality PNG graphics."
      ]}
      faqs={[
        {
          "question": "Can I edit certificates in my own local folder path?",
          "answer": "Yes. Select 'Upload Existing Certificate' on the landing screen, and upload your file (Image or PDF) from any directory on your computer."
        },
        {
          "question": "Are my files, signatures, or logos secure?",
          "answer": "Yes, absolutely. This utility runs entirely locally in your browser sandbox. None of your certificates, text, signatures, or logo images are sent to any external server."
        },
        {
          "question": "What formats can I export?",
          "answer": "You can export the customized certificate as a print-ready vector PDF document (A4 scale) or a high-resolution PNG image."
        }
      ]}
      title="Certificate Editor"
      description="Create, edit, and design professional certificates directly in your browser. Choose elegant pre-made layouts or upload custom backgrounds. Processed 100% locally."
      categoryName="Image Editing Tools"
      categoryHref="/editing"
      error={error}
      onClearError={() => setError(null)}
    >
      <CertificateEditorClient article={article} externalError={error} setExternalError={setError} />
    </ToolLayout>
  );
}
