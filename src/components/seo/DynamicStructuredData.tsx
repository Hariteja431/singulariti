import React from 'react';
import { registry } from '@/registry';

export function DynamicStructuredData({ pathname }: { pathname?: string }) {
  if (!pathname) return null;

  const parts = pathname.split('/').filter(Boolean);
  if (parts.length < 3) return null;

  let categoryId = '';
  let toolId = '';

  if (parts[0] === 'tools') {
    categoryId = parts[1];
    toolId = parts[2];
  } else if (parts[0] === 'image') {
    categoryId = 'image';
    toolId = parts[2];
  } else if (parts[0] === 'editing') {
    categoryId = 'editing';
    toolId = parts[2];
  } else {
    return null;
  }

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
    { name: category.name, item: category.path || `/tools/${category.id}` },
    { name: tool.name, item: tool.path || `/tools/${category.id}/${tool.id}` }
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
