import React from 'react';
import { MetadataViewerClient } from './MetadataViewerClient';

export const metadata = {
  title: 'PDF Metadata Viewer Online Free | Singulariti',
  description: 'View hidden document properties, author, keywords, creator, dates, and total pages in a PDF file securely without uploading it anywhere.',
};

export default function MetadataViewerPage() {
  return <MetadataViewerClient />;
}
