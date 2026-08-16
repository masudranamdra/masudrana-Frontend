import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://masuddev01.vercel.app';
  const currentDate = new Date().toISOString();

  const routes = [
    { url: '', changeFrequency: 'weekly' as const, priority: 1.0 },
    { url: '/about', changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: '/projects', changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: '/experience', changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: '/skills', changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: '/blogs', changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: '/articles', changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: '/activities', changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: '/gallery/images', changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: '/gallery/videos', changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: '/testimonials', changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: '/documents', changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: '/contact', changeFrequency: 'yearly' as const, priority: 0.9 },
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
