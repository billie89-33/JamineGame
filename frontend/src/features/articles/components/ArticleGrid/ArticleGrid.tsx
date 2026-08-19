import React from 'react';
import { ArticleCard } from '../ArticleCard';
import { getRecentArticles } from '../../data/mockArticles';

export const ArticleGrid = () => {
  const recentArticles = getRecentArticles(8); // get up to 8 articles (we only have 4 right now but it scales)

  return (
    <section>
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-[#f7ebc6] border-b-2 border-[#f7ebc6]/30 pb-2 inline-block drop-shadow-[0_0_8px_rgba(247,235,198,0.2)]">
          Latest Articles
        </h2>
        <a href="#" className="text-[#a5b8a6] hover:text-[#f7ebc6] transition-colors text-base font-semibold">View All &raquo;</a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
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
    </section>
  );
};
