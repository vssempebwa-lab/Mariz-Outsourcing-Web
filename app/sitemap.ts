import type { MetadataRoute } from 'next';

import { BLOG_POSTS, SERVICES } from '@/lib/data';
import { SITE_URL } from '@/lib/seo';

type SitemapEntry = MetadataRoute.Sitemap[number];
type ChangeFrequency = NonNullable<SitemapEntry['changeFrequency']>;

const CORE_ROUTES: Array<{ path: string; priority: number }> = [
  { path: '/about', priority: 0.8 },
  { path: '/services', priority: 0.9 },
  { path: '/programs', priority: 0.7 },
  { path: '/projects', priority: 0.7 },
  { path: '/clients', priority: 0.6 },
  { path: '/blog', priority: 0.7 },
  { path: '/contact', priority: 0.8 },
  { path: '/privacy', priority: 0.3 },
  { path: '/terms', priority: 0.3 },
];

function entry(
  path: string,
  lastModified: Date,
  changeFrequency: ChangeFrequency,
  priority: number,
): SitemapEntry {
  return {
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const isTimeSensitive = (path: string) => path === '/blog';

  return [
    entry('/', now, 'weekly', 1),
    ...CORE_ROUTES.map((route) =>
      entry(route.path, now, isTimeSensitive(route.path) ? 'weekly' : 'monthly', route.priority),
    ),
    ...SERVICES.map((service) =>
      entry(`/services/${service.slug}`, now, 'monthly', 0.9),
    ),
    ...BLOG_POSTS.map((post) =>
      entry(`/blog/${post.slug}`, new Date(post.date), 'yearly', 0.6),
    ),
  ];
}
