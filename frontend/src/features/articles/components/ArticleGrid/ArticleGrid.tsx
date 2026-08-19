import React from 'react';
import { ArticleCard } from '../ArticleCard';

// Dummy data for now
const dummyArticles = Array.from({ length: 8 }).map((_, i) => ({
  id: i,
  title: "The Future of Gaming Consoles: What to Expect in 2027",
  excerpt: "A deep dive into the leaked specs and rumors surrounding the next generation of hardware and what it means for developers.",
  imageUrl: `https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800&sig=${i}`,
  category: "News",
  date: "Oct 28, 2026"
}));

export const ArticleGrid = () => {
  return (
    <section>
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-[#f7ebc6] border-b-2 border-[#f7ebc6]/30 pb-2 inline-block drop-shadow-[0_0_8px_rgba(247,235,198,0.2)]">
          Latest Articles
        </h2>
        <a href="#" className="text-[#a5b8a6] hover:text-[#f7ebc6] transition-colors text-base font-semibold">View All &raquo;</a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
        {dummyArticles.map((article) => (
          <ArticleCard 
            key={article.id}
            id={article.id}
            title={article.title}
            excerpt={article.excerpt}
            imageUrl={article.imageUrl}
            category={article.category}
            date={article.date}
          />
        ))}
      </div>
    </section>
  );
};
