import React from 'react';
import Link from 'next/link';
import { Article } from '../../articles.api';
import { ArticleCard } from '../ArticleCard';
import { serverFetchJson } from '@/lib/server-fetch';

interface ArticleGridProps {
  title?: string;
  type?: string;
  limit?: number;
  href?: string;
}

export const ArticleGrid = async ({ 
  title = "Latest Articles", 
  type = "NEWS", 
  limit = 6, 
  href = "/news" 
}: ArticleGridProps) => {
  const data = await serverFetchJson<{ data?: Article[] }>(
    `/articles?page=1&limit=${limit}&type=${type}`,
  );
  const recentArticles = data?.data || [];

  return (
    <fieldset className="border-4 border-[#B05B27] rounded-xl p-6 sm:p-8 mb-12 relative hover:border-[#f7ebc6] transition-colors duration-300 w-full">
      <legend className="text-xl lg:text-2xl font-bold text-[#f7ebc6] px-4 ml-4 tracking-wide uppercase drop-shadow-[0_0_8px_rgba(247,235,198,0.2)]">
        {title}
      </legend>
      <div className="flex justify-end mb-6">
        <Link href={href} className="text-[#a5b8a6] hover:text-[#f7ebc6] transition-colors text-sm font-semibold">VIEW ALL &raquo;</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {recentArticles.map((article: Article) => (
          <ArticleCard 
            key={article.id}
            id={article.id}
            title={article.title}
            excerpt={article.excerpt || ''}
            imageUrl={article.coverImage || ''}
            category={article.category}
            date={article.publishedAt || ''}
          />
        ))}
      </div>
    </fieldset>
  );
};
