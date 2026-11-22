import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/', '/login', '/register', '/profile'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
