import React from 'react';
import Link from 'next/link';
import { gamesApi, Game } from '@/features/games/games.api';

type GamesPageProps = {
  searchParams: Promise<{ page?: string }>;
};

const getGenreLabel = (game: Game) => game.genres?.[0] || 'GAME';

export default async function GamesPage({ searchParams }: GamesPageProps) {
  const resolvedParams = await searchParams;
  const currentPage = resolvedParams.page ? parseInt(resolvedParams.page, 10) : 1;
  const limit = 12; // 12 items per page
  
  let games: Game[] = [];
  let totalPages = 1;
  let hasError = false;

  try {
    const response = await gamesApi.getGames(currentPage, limit);
    games = response.data || [];
    totalPages = response.totalPages || 1;
  } catch (error) {
    console.error('Failed to fetch games:', error);
    hasError = true;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-16 md:px-8 lg:px-12">
      <div className="flex flex-col items-center mb-12 text-center">
        <h1 className="text-5xl font-light text-[#f7ebc6] tracking-widest uppercase mb-4">
          All Games
        </h1>
        <div className="w-16 h-[1px] bg-[#B05B27]" />
      </div>

      {hasError ? (
        <div className="rounded-xl border border-[#B05B27] bg-[#1a241b] p-8 text-center text-[#f7ebc6]">
          Unable to load games right now. Please try again later.
        </div>
      ) : games.length === 0 ? (
        <div className="rounded-xl border border-[#B05B27] bg-[#1a241b] p-8 text-center text-[#f7ebc6]">
          No games found.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games.map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.slug}`}
                className="group bg-[#1a241b] rounded-xl overflow-hidden border border-[#2e3b2c] hover:border-[#B05B27] hover:scale-[1.02] transition-all shadow-lg flex flex-col"
              >
                <div className="h-48 bg-gradient-to-br from-[#2e3b2c] to-[#0b0f0c] w-full overflow-hidden shrink-0">
                  {game.coverImage ? (
                    <img
                      src={game.coverImage}
                      alt={game.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                      🎮
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <h3 className="text-lg font-bold text-[#f7ebc6] line-clamp-1">
                      {game.title}
                    </h3>
                    <span className="shrink-0 bg-[#e8d7a5] text-[#1a241b] text-[10px] font-black px-2 py-1 rounded-full">
                      {getGenreLabel(game)}
                    </span>
                  </div>
                  <p className="text-[#a0a8a1] text-sm line-clamp-2 mt-auto">
                    {game.description || 'No description available.'}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              {currentPage > 1 ? (
                <Link
                  href={`/games?page=${currentPage - 1}`}
                  className="px-4 py-2 border border-[#d4c38d] text-[#f7ebc6] rounded-lg hover:bg-[#B05B27] hover:border-[#B05B27] transition-colors"
                >
                  &lt; Previous
                </Link>
              ) : (
                <span className="px-4 py-2 border border-[#2e3b2c] text-[#a0a8a1] rounded-lg cursor-not-allowed">
                  &lt; Previous
                </span>
              )}

              <span className="px-4 py-2 text-[#f7ebc6]">
                Page {currentPage} of {totalPages}
              </span>

              {currentPage < totalPages ? (
                <Link
                  href={`/games?page=${currentPage + 1}`}
                  className="px-4 py-2 border border-[#d4c38d] text-[#f7ebc6] rounded-lg hover:bg-[#B05B27] hover:border-[#B05B27] transition-colors"
                >
                  Next &gt;
                </Link>
              ) : (
                <span className="px-4 py-2 border border-[#2e3b2c] text-[#a0a8a1] rounded-lg cursor-not-allowed">
                  Next &gt;
                </span>
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
}
