"use client";

import React, { useState } from 'react';
import { QRType } from '@/lib/qr/qrHelpers';
import { ToolLayout } from '@/components/tools/ToolLayout';
import { QrCodeGeneratorClient } from '../qr-code-generator/QrCodeGeneratorClient';

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
