import { cache } from 'react';
import { serverFetchJson } from './server-fetch';
import type { Article } from '@/features/articles/types';
import type { GameResponseDto } from '@shared/dto';
import type { Category } from '@/features/categories/categories.api';

/**
 * Deduplicate per-request backend fetches shared between generateMetadata() and Page components,
 * backed by Next.js ISR data cache and a 5s timeout.
 */
export const getCachedArticleById = cache(async (id: string): Promise<Article | null> => {
  return serverFetchJson<Article>(`/articles/${encodeURIComponent(id)}`, {
    revalidate: 300,
  });
});

export const getCachedGameById = cache(async (id: string): Promise<GameResponseDto | null> => {
  return serverFetchJson<GameResponseDto>(`/games/${encodeURIComponent(id)}`, {
    revalidate: 300,
  });
});

export const getCachedCategoryBySlug = cache(async (slug: string): Promise<Category | null> => {
  return serverFetchJson<Category>(`/categories/slug/${encodeURIComponent(slug)}`, {
    revalidate: 300,
  });
});
