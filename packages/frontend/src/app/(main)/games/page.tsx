import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { GameResponseDto } from '@shared/dto';
import { ArticleCard } from '@/features/articles/components/ArticleCard';
import { GameCategoryList } from '@/features/games/components/GameCategoryList';
import { serverFetchJson } from '@/lib/server-fetch';
import { SITE_URL } from '@/lib/config';

export const metadata: Metadata = {
  title: 'สารานุกรมเกมทั้งหมด',
  description: 'รวมรายชื่อเกม ข้อมูลเกม สเปกความต้องการระบบ และหมวดหมู่เกมยอดนิยม',
  alternates: {
    canonical: `${SITE_URL}/games`,
  },
};

type GamesPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function GamesPage({ searchParams }: GamesPageProps) {
  const resolvedParams = await searchParams;
  const currentPage = resolvedParams.page ? parseInt(resolvedParams.page, 10) : 1;
  const limit = 12; // 12 items per page

  const data = await serverFetchJson<{ data?: GameResponseDto[]; meta?: { totalPages?: number } }>(
    `/games?page=${currentPage}&limit=${limit}`,
  );
  const hasError = data === null;
  const games: GameResponseDto[] = data?.data || [];
  const totalPages = data?.meta?.totalPages || 1;

  return (
    <main className="max-w-7xl mx-auto px-4 py-16 md:px-8 lg:px-12">
      <div className="flex flex-col items-center mb-12 text-center">
        <h1 className="text-5xl font-light text-[#f7ebc6] tracking-widest uppercase mb-4">
          All Games
        </h1>
        <div className="w-16 h-[1px] bg-[#B05B27]" />
      </div>

      <GameCategoryList />

      {hasError ? (
        <div className="rounded-xl border border-[#B05B27] bg-[#1a241b] p-8 text-center text-[#f7ebc6]">
          Unable to load content right now. Please try again later.
        </div>
      ) : games.length === 0 ? (
        <div className="rounded-xl border border-[#B05B27] bg-[#1a241b] p-8 text-center text-[#f7ebc6]">
          No content found.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
