import type { MetadataRoute } from 'next';

import { staffAccessPath, employeeLoginPath, staffBasePath } from '@/lib/portal-routes';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [staffAccessPath, employeeLoginPath, staffBasePath, `${staffBasePath}/`, '/api/staff/'],
    },
  };
}
