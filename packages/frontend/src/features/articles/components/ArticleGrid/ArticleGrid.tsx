import React from 'react';
import { ArticleCard } from '../ArticleCard';
import { getRecentArticles } from '../../data/mockArticles';

export const ArticleGrid = async () => {
  let allArticles = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${apiUrl}/articles?page=1&limit=11`, { 
      next: { revalidate: 60 },
    });
    
    if (res.ok) {
      const data = await res.json();
      allArticles = data.data || [];
    }
  } catch (error) {
    console.error('Failed to fetch articles from API:', error);
  }

  // Fallback if empty or failed
  let recentArticles = [];
  if (!allArticles || allArticles.length === 0) {
    // Skip 5 from mock
    recentArticles = getRecentArticles(6, 5); 
  } else {
    // Skip first 5 from DB, take next 6
    recentArticles = allArticles.slice(5, 11);
  }

  return (
    <fieldset className="border-4 border-[#B05B27] rounded-xl p-6 sm:p-8 mb-12 relative hover:border-[#f7ebc6] transition-colors duration-300 w-full">
      <legend className="text-xl lg:text-2xl font-bold text-[#f7ebc6] px-4 ml-4 tracking-wide uppercase drop-shadow-[0_0_8px_rgba(247,235,198,0.2)]">
        Latest Articles
      </legend>
      <div className="flex justify-end mb-6">
        <a href="#" className="text-[#a5b8a6] hover:text-[#f7ebc6] transition-colors text-sm font-semibold">VIEW ALL &raquo;</a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {recentArticles.map((article: Record<string, unknown>) => (
          <ArticleCard 
            key={article.id as string}
            id={article.id as string}
            title={article.title as string}
            excerpt={article.excerpt as string}
            imageUrl={article.coverImage as string}
            category={article.category as string}
            date={article.publishedAt as string}
          />
        ))}
      </div>
    </fieldset>
  );
};
