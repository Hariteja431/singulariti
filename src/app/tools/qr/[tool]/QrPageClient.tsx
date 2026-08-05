"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { QRType } from '@/lib/qr/qrHelpers';

const QrCodeGeneratorClient = dynamic(() => import('../qr-code-generator/QrCodeGeneratorClient').then(mod => mod.QrCodeGeneratorClient), {
  ssr: false,
  loading: () => (
    <div className="h-64 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
    </div>
  )
});

interface Props {
  initialType: QRType;
  isStandalone: boolean;
  toolId: string;
  toolName: string;
  toolDescription: string;
  toolSeoTitle?: string;
  toolSeoDescription?: string;
  article?: string;
}

export function QrPageClient({
  initialType,
  isStandalone,
  toolId,
  toolName,
  toolDescription,
  toolSeoTitle,
  toolSeoDescription,
  article
}: Props) {
  const [error, setError] = useState<string | null>(null);

  return (
    <ToolLayout
      utilityId={toolId}
      title={toolName}
      description={toolDescription}
      categoryName="QR Code Tools"
      categoryHref="/tools/qr"
      error={error}
      onClearError={() => setError(null)}
      article={article}
    >
      <QrCodeGeneratorClient 
        initialType={initialType} 
        isStandalone={isStandalone}
        toolName={toolName}
        toolDescription={toolDescription}
        toolSeoTitle={toolSeoTitle}
        toolSeoDescription={toolSeoDescription}
        externalError={error}
        setExternalError={setError}
      />
    </ToolLayout>
  );
}
