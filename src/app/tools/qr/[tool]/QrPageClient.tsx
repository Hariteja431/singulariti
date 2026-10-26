"use client";

import React from 'react';
import { QRType } from '@/lib/qr/qrHelpers';

import { QrCodeGeneratorClient } from '../qr-code-generator/QrCodeGeneratorClient';

export function QrPageClient({
  initialType,
  isStandalone,
  toolId,
  toolName,
  toolDescription,
  toolSeoTitle,
  toolSeoDescription,
  article
}: {
  initialType: QRType;
  isStandalone: boolean;
  toolId: string;
  toolName: string;
  toolDescription: string;
  toolSeoTitle?: string;
  toolSeoDescription?: string;
  article?: string;
}) {
  return (
    <>
      <QrCodeGeneratorClient 
        initialType={initialType} 
        isStandalone={isStandalone}
        toolName={toolName}
        toolDescription={toolDescription}
        toolSeoTitle={toolSeoTitle}
        toolSeoDescription={toolSeoDescription}
      />
      
    </>
  );
}
