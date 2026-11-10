import type { MetadataRoute } from 'next';

import { staffAccessPath, employeeLoginPath, staffBasePath } from '@/lib/portal-routes';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          staffAccessPath,
          employeeLoginPath,
          staffBasePath,
          `${staffBasePath}/`,
          '/api/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
