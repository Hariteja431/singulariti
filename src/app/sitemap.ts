import { MetadataRoute } from 'next';
import { registry } from '@/registry';
import { blogSeriesList, blogSubSeriesList, blogGuidesList } from '@/content/tools/toolRegistry';
import { getAllPosts } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.singulariti.in';

  // Use current date for sitemap generation
  const lastModified = new Date();

  const categories = registry.categories;

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
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/series`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/utility-guides`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/typing-speed-test`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pomodoro-timer`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/editing/online-whiteboard`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/image/editor`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/feedback`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/editorial-policy`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic Category, Collection, and Tool routes
  categories.forEach((category) => {
    // Category root (e.g., /image)
    if (category.path) {
      routes.push({
        url: `${baseUrl}${category.path}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    }

    category.collections.forEach((collection) => {
      // Collection root (e.g., /image/compression)
      // Only include collection routes for image and editing categories, as other categories do not have collection landing pages.
      if (collection.path && (category.id === 'image' || category.id === 'editing')) {
        routes.push({
          url: `${baseUrl}${collection.path}`,
          lastModified,
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }

      // Individual tools (e.g., /tools/calculators/sip-calculator)
      collection.tools.forEach((tool) => {
        if (tool.path) {
          routes.push({
            url: `${baseUrl}${tool.path}`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        }
      });
    });
  });

  // Blog Series (e.g., /blog/series/pdf-utilities)
  blogSeriesList.forEach((series) => {
    routes.push({
      url: `${baseUrl}/blog/series/${series.slug}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    // Blog Sub-Series (e.g., /blog/series/pdf-utilities/management-utilities)
    const subSections = blogSubSeriesList.filter(ss => ss.seriesId === series.id);
    subSections.forEach((sub) => {
      routes.push({
        url: `${baseUrl}/blog/series/${series.slug}/${sub.slug}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  });

  // Blog Posts (Guides & Articles)
  const posts = getAllPosts();
  posts.forEach((post) => {
    routes.push({
      url: `${baseUrl}${post.url}`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  });

  // Deduplicate routes based on URL
  const uniqueRoutes = Array.from(new Map(routes.map(r => [r.url, r])).values());

  return uniqueRoutes;
}
