"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { registry } from '@/registry';

export function DynamicStructuredData() {
  const pathname = usePathname();
  
  // We only want to inject this for tool pages like /tools/...
  if (!pathname || !pathname.startsWith('/tools/')) return null;

  // Extract the slug: /tools/category/tool
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length < 3) return null; // Not a specific tool page

  const categoryId = parts[1];
  const toolId = parts[2];

  const category = registry.categories.find(c => c.id === categoryId);
  if (!category) return null;

  let tool = null;
  for (const collection of category.collections) {
    const found = collection.tools.find(t => t.id === toolId);
    if (found) {
      tool = found;
      break;
    }
  }

  if (!tool) return null;

  const breadcrumbs = [
    { name: "Tools", item: "/tools" },
    { name: category.name, item: `/tools/${category.id}` },
    { name: tool.name, item: `/tools/${category.id}/${tool.id}` }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((crumb, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": crumb.name,
              "item": `https://singulariti.in${crumb.item}`
            }))
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": tool.name,
            "description": tool.description,
            "applicationCategory": "UtilitiesApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />
    </>
  );
}
