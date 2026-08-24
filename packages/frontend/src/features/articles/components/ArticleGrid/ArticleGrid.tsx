import React from 'react';
import { ArticleCard } from '../ArticleCard';
import { getRecentArticles } from '../../data/mockArticles';

export const ArticleGrid = () => {
  // Skip the 5 articles already shown in the Hero banner
  const recentArticles = getRecentArticles(6, 5); 

  return (
    <fieldset className="border-4 border-[#B05B27] rounded-xl p-6 sm:p-8 mb-12 relative hover:border-[#f7ebc6] transition-colors duration-300 w-full">
      <legend className="text-xl lg:text-2xl font-bold text-[#f7ebc6] px-4 ml-4 tracking-wide uppercase drop-shadow-[0_0_8px_rgba(247,235,198,0.2)]">
        Latest Articles
      </legend>
      <div className="flex justify-end mb-6">
        <a href="#" className="text-[#a5b8a6] hover:text-[#f7ebc6] transition-colors text-sm font-semibold">VIEW ALL &raquo;</a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {recentArticles.map((article) => (
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
  );
};
