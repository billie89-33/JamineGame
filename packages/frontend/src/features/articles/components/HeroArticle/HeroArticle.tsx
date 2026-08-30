import React from 'react';
import Link from 'next/link';
import { getRecentArticles } from '../../data/mockArticles';

export const HeroArticle = async () => {
  let articles = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const res = await fetch(`${apiUrl}/articles?page=1&limit=5`, { 
      next: { revalidate: 60 },
    });
    
    if (res.ok) {
      const data = await res.json();
      articles = data.data || [];
    }
  } catch (error) {
    console.error('Failed to fetch articles from API:', error);
  }

  // Fallback to mock data if API fails or DB is empty
  if (!articles || articles.length === 0) {
    articles = getRecentArticles(5);
  }

  const mainArticle = articles[0];
  const subArticles = articles.slice(1, 5);

  return (
    <section className="mb-12 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[400px] lg:h-[480px]">
        {/* Big Image (Left) */}
        {mainArticle && (
          <Link href={`/article/${mainArticle.id}`} className="group relative w-full h-full overflow-hidden border border-[#d4c38d] shadow-sm bg-[#1a241b]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f0c]/90 via-[#0b0f0c]/30 to-transparent z-10 transition-opacity group-hover:opacity-80"></div>
            <img 
              src={mainArticle.coverImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200'} 
              alt={mainArticle.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
            />
            <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col items-start">
              <span className="bg-[#B05B27] text-[#f7ebc6] text-xs font-black px-3 py-1 shadow-md uppercase mb-3 tracking-wider">
                {mainArticle.category}
              </span>
              <h2 className="text-2xl lg:text-3xl xl:text-4xl font-black text-[#f7ebc6] leading-tight line-clamp-2 drop-shadow-lg group-hover:text-white transition-colors">
                {mainArticle.title}
              </h2>
            </div>
          </Link>
        )}

        {/* 4 Small Images (Right) 2x2 */}
        <div className="hidden lg:grid grid-cols-2 grid-rows-2 gap-4 h-full">
          {subArticles.map((article: Record<string, unknown>) => (
            <Link key={article.id as string} href={`/article/${article.id as string}`} className="group relative w-full h-full overflow-hidden border border-[#d4c38d] shadow-sm bg-[#1a241b]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f0c]/90 via-[#0b0f0c]/20 to-transparent z-10 transition-opacity group-hover:opacity-80"></div>
              <img 
                src={(article.coverImage as string) || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600'} 
                alt={article.title as string} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-col items-start">
                <span className="bg-[#1a241b]/80 backdrop-blur-sm text-[#f7ebc6] text-[10px] font-bold px-2 py-0.5 shadow-md uppercase mb-2">
                  {article.category}
                </span>
                <h3 className="text-sm xl:text-base font-bold text-[#f7ebc6] leading-tight line-clamp-2 drop-shadow-md group-hover:text-[#B05B27] transition-colors">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
