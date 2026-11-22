import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/config';
import { serverFetchJson } from '@/lib/server-fetch';

interface SitemapItem {
  id: string;
  updatedAt?: string;
  publishedAt?: string;
}

interface CategoryItem {
  slug: string;
  updatedAt?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/news`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/games`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  const [articlesRes, gamesRes, categories] = await Promise.all([
    serverFetchJson<{ data?: SitemapItem[] }>('/articles?page=1&limit=100', { revalidate: 300 }),
    serverFetchJson<{ data?: SitemapItem[] }>('/games?page=1&limit=100', { revalidate: 300 }),
    serverFetchJson<CategoryItem[]>('/categories', { revalidate: 300 }),
  ]);

  const articleRoutes: MetadataRoute.Sitemap = (articlesRes?.data || []).map((article) => ({
    url: `${SITE_URL}/article/${encodeURIComponent(article.id)}`,
    lastModified: new Date(article.updatedAt || article.publishedAt || Date.now()),
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  const gameRoutes: MetadataRoute.Sitemap = (gamesRes?.data || []).map((game) => ({
    url: `${SITE_URL}/games/${encodeURIComponent(game.id)}`,
    lastModified: new Date(game.updatedAt || game.publishedAt || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = (categories || []).map((cat) => ({
    url: `${SITE_URL}/category/${encodeURIComponent(cat.slug)}`,
    lastModified: new Date(cat.updatedAt || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...articleRoutes, ...gameRoutes, ...categoryRoutes];
}
