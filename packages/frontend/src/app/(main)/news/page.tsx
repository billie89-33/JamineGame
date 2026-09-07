import React from 'react';
import Link from 'next/link';
import { ArticleCard } from '@/features/articles/components/ArticleCard';
import { articlesApi } from '@/features/articles/articles.api';
import { Article } from '@/features/articles/types';

type NewsPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const { category } = await searchParams;
  let articles: Article[] = [];
  let hasError = false;

  try {
    const response = await articlesApi.getArticles(1, 12, undefined, category);
    articles = response.data || [];
  } catch (error) {
    console.error('Failed to fetch news articles:', error);
    hasError = true;
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-16 md:px-8">
      <div className="flex flex-col items-center mb-12 text-center">
        <h1 className="text-5xl font-light text-[#f7ebc6] tracking-widest uppercase mb-4">
          Gaming News
        </h1>
        <div className="w-16 h-[1px] bg-[#B05B27]" />
        {category && (
          <div className="mt-6 flex items-center gap-3 text-sm font-bold text-[#f7ebc6]">
            <span className="rounded-full bg-[#B05B27] px-3 py-1">
              Category: {category}
            </span>
            <Link href="/news" className="text-[#a0a8a1] hover:text-[#f7ebc6] transition-colors">
              Clear filter
            </Link>
          </div>
        )}
      </div>

      {hasError ? (
        <div className="rounded-xl border border-[#B05B27] bg-[#1a241b] p-8 text-center text-[#f7ebc6]">
          Unable to load news right now. Please try again later.
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-xl border border-[#B05B27] bg-[#1a241b] p-8 text-center text-[#f7ebc6]">
          No articles found{category ? ` in ${category}` : ''}.
        </div>
      ) : (
        <fieldset className="border-4 border-[#B05B27] rounded-xl p-6 sm:p-8 relative hover:border-[#f7ebc6] transition-colors duration-300">
          <legend className="text-xl font-medium text-[#f7ebc6] px-4 ml-4 tracking-wide uppercase">
            Latest Updates
          </legend>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
            {articles.map((article) => (
              <ArticleCard
                key={article.id}
                id={article.id}
                title={article.title}
                excerpt={article.excerpt}
                imageUrl={article.coverImage}
                category={article.category}
                date={article.publishedAt}
              />
            ))}
          </div>
        </fieldset>
      )}
    </main>
  );
}
