import React from 'react';
import Link from 'next/link';
import { articlesApi, Article } from '@/features/articles/articles.api';
import { ArticleCard } from '@/features/articles/components/ArticleCard';
import { API_URL } from '@/lib/config';

export const FeaturedGames = async () => {
  let articles: Article[] = [];

  try {
    // We will fetch recent articles for this section
    const res = await fetch(`${API_URL}/articles?page=1&limit=3&type=GAME`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      articles = data.data || [];
    }
  } catch (error: any) {
    if (error?.digest === 'DYNAMIC_SERVER_USAGE') throw error;
    console.error('Failed to fetch articles for featured section:', error);
  }

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-[#f7ebc6] border-l-4 border-[#B05B27] pl-3">
          Featured Games
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard 
            key={article.id}
            id={article.id}
            title={article.title}
            excerpt={article.excerpt || ''}
            imageUrl={article.coverImage || article.heroImage || ''}
            category={article.category}
            date={article.publishedAt || ''}
          />
        ))}
      </div>
    </section>
  );
};
