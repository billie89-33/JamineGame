import React from 'react';
import { ArticleCard } from '@/features/articles/components/ArticleCard';
import { GameResponseDto } from '@shared/dto';
import { serverFetchJson } from '@/lib/server-fetch';

export const FeaturedGames = async () => {
  const data = await serverFetchJson<{ data?: GameResponseDto[] }>('/games?page=1&limit=3');
  const games: GameResponseDto[] = data?.data || [];

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
            type="game"
          />
        ))}
      </div>
    </section>
  );
};
