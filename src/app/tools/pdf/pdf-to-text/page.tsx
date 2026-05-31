import React from 'react';
import { PdfToTextClient } from './PdfToTextClient';

export const metadata = {
  title: 'PDF to Text Converter Online Free | Singulariti',
  description: 'Extract readable text content from any PDF file locally in your browser. Copy text directly or download as a .txt file.',
};

export default function PdfToTextPage() {
  return <PdfToTextClient />;
}
