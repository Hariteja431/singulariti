"use client";
import { ToolLayoutPlaceholder } from '@/components/tools/ToolLayoutPlaceholder';


import dynamic from 'next/dynamic';

const QrCodeScannerClient = dynamic(
  () => import('./QrCodeScannerClient').then((m) => m.QrCodeScannerClient),
  {
  ssr: false,
  loading: () => (
    <ToolLayoutPlaceholder
      utilityId="qr-code-scanner"
      title="QR Code Scanner"
      description="Scan and decode QR codes from files or webcam stream online. Fully local browser-side processing."
      categoryName="QR Code Tools"
      categoryHref="/tools/qr"
    />
  )
}
);

interface Props {
  article?: string;
}

export function QrCodeScannerPageClient({ article }: Props) {
  return <QrCodeScannerClient article={article} />;
}
