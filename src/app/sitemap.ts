import { MetadataRoute } from 'next';
import { getCategories } from '@/registry';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://singulariti.app';
  const lastModified = new Date();

  const categories = getCategories();
  
  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // Dynamic Category, Collection, and Tool routes
  categories.forEach((category) => {
    // Category root (e.g., /editing)
    routes.push({
      url: `${baseUrl}/${category.id}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    });

    category.collections.forEach((collection) => {
      // Collection root (e.g., /editing/tools)
      routes.push({
        url: `${baseUrl}/${category.id}/${collection.id}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.8,
      });

      // Individual tools (e.g., /editing/tools/crop-image)
      collection.tools.forEach((tool) => {
        routes.push({
          url: `${baseUrl}/${category.id}/${collection.id}/${tool.id}`,
          lastModified,
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      });
    });
  });

  return routes;
}
