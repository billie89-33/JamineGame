import React from 'react';
import Link from 'next/link';
import { articlesApi, Article } from '@/features/articles/articles.api';
import { ArticleCard } from '@/features/articles/components/ArticleCard';
import { GameCategoryList } from '@/features/games/components/GameCategoryList';
import { API_URL } from '@/lib/config';

type GamesPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function GamesPage({ searchParams }: GamesPageProps) {
  const resolvedParams = await searchParams;
  const currentPage = resolvedParams.page ? parseInt(resolvedParams.page, 10) : 1;
  const limit = 12; // 12 items per page
  
  let articles: Article[] = [];
  let totalPages = 1;
  let hasError = false;

  try {
    // We will just fetch articles for now, later we can filter by Category if needed
    const response = await fetch(`${API_URL}/articles?page=${currentPage}&limit=${limit}&type=GAME`, { cache: 'no-store' });
    if (response.ok) {
      const data = await response.json();
      articles = data.data || [];
      totalPages = data.totalPages || 1;
    } else {
      hasError = true;
    }
  } catch (error: any) {
    if (error?.digest === 'DYNAMIC_SERVER_USAGE') throw error;
    console.error('Failed to fetch articles:', error);
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

      <GameCategoryList />

      {hasError ? (
        <div className="rounded-xl border border-[#B05B27] bg-[#1a241b] p-8 text-center text-[#f7ebc6]">
          Unable to load content right now. Please try again later.
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-xl border border-[#B05B27] bg-[#1a241b] p-8 text-center text-[#f7ebc6]">
          No content found.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
