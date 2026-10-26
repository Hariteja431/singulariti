"use client";


import { QrCodeScannerClient } from './QrCodeScannerClient';

interface Props {
  article?: string;
}

export function QrCodeScannerPageClient({ article }: Props) {
  return <QrCodeScannerClient article={article} />;
}
