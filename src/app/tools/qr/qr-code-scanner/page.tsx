import React from 'react';
import { QrCodeScannerClient } from './QrCodeScannerClient';

export const metadata = {
  title: 'QR Code Scanner Online Free — Scan QR | Singulariti',
  description: 'Scan QR codes using your device camera, uploaded images, or PDF documents locally in your browser. Totally secure and private.',
};

export default function QrCodeScannerPage() {
  return <QrCodeScannerClient />;
}
