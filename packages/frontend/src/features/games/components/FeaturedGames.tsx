import React from 'react';
import Link from 'next/link';
import { FeaturedGame, gamesApi } from '../games.api';

const getGenreLabel = (game: FeaturedGame) => game.genres?.[0] || 'GAME';

export const FeaturedGames = async () => {
  let games: FeaturedGame[] = [];

  try {
    const response = await gamesApi.getFeaturedGames(3, 2);
    games = response.data || [];
  } catch (error) {
    console.error('Failed to fetch featured games:', error);
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
          <Link
            key={game.id}
            href={`/games/${game.slug}`}
            className="group bg-[#1a241b] rounded-xl overflow-hidden border border-[#2e3b2c] hover:border-[#B05B27] hover:scale-[1.02] transition-all shadow-lg"
          >
            <div className="h-48 bg-gradient-to-br from-[#2e3b2c] to-[#0b0f0c] w-full overflow-hidden">
              {game.coverImage ? (
                <img
                  src={game.coverImage}
                  alt={game.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl">
                  Game
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex justify-between items-start gap-3 mb-2">
                <h3 className="text-lg font-bold text-[#f7ebc6] line-clamp-1">
                  {game.title}
                </h3>
                <span className="shrink-0 bg-[#e8d7a5] text-[#1a241b] text-[10px] font-black px-2 py-1 rounded-full">
                  {getGenreLabel(game)}
                </span>
              </div>
              <p className="text-[#a0a8a1] text-sm line-clamp-2">
                {game.description || 'No description available.'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
