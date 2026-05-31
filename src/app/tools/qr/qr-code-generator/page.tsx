import React from 'react';
import { QrCodeGeneratorClient } from './QrCodeGeneratorClient';

export const metadata = {
  title: 'QR Code Generator Online Free — Create QR Codes | Singulariti',
  description: 'Generate custom styled QR codes for text, URLs, Wi-Fi, UPI payments, emails, and more. Upload center logos and export to PNG, SVG, or PDF.',
};

export default function QrCodeGeneratorPage() {
  return <QrCodeGeneratorClient />;
}
