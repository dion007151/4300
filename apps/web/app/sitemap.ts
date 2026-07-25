import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://4300.vercel.app';

  const routes = [
    '',
    '/ai',
    '/ai/writing',
    '/resume/builder',
    '/resume/ats',
    '/documents',
    '/images',
    '/video',
    '/productivity',
    '/jobs',
    '/portfolio',
    '/templates',
    '/review',
    '/help',
    '/settings',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
