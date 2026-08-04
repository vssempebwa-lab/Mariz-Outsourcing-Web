import type { MetadataRoute } from 'next';

const staffAccessPath =
  process.env.NEXT_PUBLIC_STAFF_ACCESS_PATH || '/ops-slate-7f3c';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [staffAccessPath, `${staffAccessPath}/`, '/api/staff/'],
    },
  };
}
