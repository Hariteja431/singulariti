import React from 'react';
import { PageCounterClient } from './PageCounterClient';

export const metadata = {
  title: 'PDF Page Counter Online Free — Count Pages | Singulariti',
  description: 'Upload one or multiple PDF documents to count pages and calculate combined total pages locally inside your browser.',
};

export default function PageCounterPage() {
  return <PageCounterClient />;
}
