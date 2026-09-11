import React from 'react';
import Link from 'next/link';
import { articlesApi, Article } from '@/features/articles/articles.api';
import { ArticleCard } from '@/features/articles/components/ArticleCard';
import { GameResponseDto } from '@shared/dto';
import { API_URL } from '@/lib/config';

export const FeaturedGames = async () => {
  let games: GameResponseDto[] = [];

  try {
    const res = await fetch(`${API_URL}/games?page=1&limit=3`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      games = data.data || [];
    }
  } catch (error: any) {
    if (error?.digest === 'DYNAMIC_SERVER_USAGE') throw error;
    console.error('Failed to fetch games for featured section:', error);
  }

  if (games.length === 0) {
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
        {games.map((game) => (
          <ArticleCard 
            key={game.id}
            id={game.id}
            title={game.title}
            excerpt={game.description || ''}
            imageUrl={game.coverImage || ''}
            category={game.category}
            date={game.publishedAt?.toString() || ''}
          />
        ))}
      </div>
    </section>
  );
};
