import React from 'react';
import { ProtectPdfClient } from './ProtectPdfClient';

export const metadata = {
  title: 'Protect PDF Online Free — Encrypt and Lock PDF | Singulariti',
  description: 'Secure your PDF documents with a password entirely in your browser. No uploads, fast and private.',
  alternates: {
    canonical: 'https://singulariti.app/tools/pdf/protect-pdf',
  }
};

export default function ProtectPdfPage() {
  return <ProtectPdfClient />;
}
