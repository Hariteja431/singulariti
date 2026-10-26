"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';



import { QrCodeScannerClient } from './QrCodeScannerClient';

interface Props {
  article?: string;
}

export function QrCodeScannerPageClient({ article }: Props) {
  return <QrCodeScannerClient article={article} />;
}
