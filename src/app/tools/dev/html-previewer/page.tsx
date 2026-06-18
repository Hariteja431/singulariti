import React from 'react';
import { HtmlPreviewerClient } from '@/components/tools/dev/HtmlPreviewerClient';

import { buildMetadata } from '@/lib/seo/metadata';
import { getUtilitySEO } from '@/lib/seo/utilityMetadata';

const seo = getUtilitySEO('html-previewer');

export const metadata = buildMetadata({
  title: seo?.title || 'Premium HTML Previewer | Singulariti',
  description: seo?.description || 'Render raw HTML code elements live in a safe frame with Monaco Editor.',
  canonical: `https://www.singulariti.in/tools/dev/html-previewer`,
});

export default function HtmlPreviewerPage() {
  return <HtmlPreviewerClient />;
}
