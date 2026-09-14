import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categoriesApi } from '@/features/categories/categories.api';
import { articlesApi } from '@/features/articles/articles.api';
import { gamesApi } from '@/features/games/games.api';
import { ArticleCard } from '@/features/articles/components/ArticleCard';
import { Sidebar } from '@/components/common/Sidebar';

const getCategoryName = (category: unknown): string => {
  if (!category) return 'ทั่วไป';
  if (typeof category === 'object' && category !== null && 'name' in category) {
    return (category as { name: string }).name || 'ทั่วไป';
  }
  return String(category);
};

export default async function CategoryHubPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.slug);

  let category = null;
  let featuredGames = [];
  let featuredArticles = [];
  let spotlightArticle = null;
  let gridArticles = [];

  try {
    // 1. Fetch data in parallel
    const [categoryRes, gamesRes, articlesRes] = await Promise.all([
      categoriesApi.getCategoryBySlug(slug).catch(() => null),
      gamesApi.getGames(1, 6, undefined, slug, true).catch(() => ({ data: [] })),
      articlesApi.getArticles(1, 7, undefined, slug, undefined, undefined, true).catch(() => ({ data: [] })),
    ]);

    category = categoryRes;
    
    // If games are empty, fallback to non-featured latest games
    if (gamesRes?.data?.length === 0) {
      const fallbackGames = await gamesApi.getGames(1, 6, undefined, slug).catch(() => ({ data: [] }));
      featuredGames = fallbackGames?.data || [];
    } else {
      featuredGames = gamesRes?.data || [];
    }

    // If articles are empty, fallback to non-featured latest articles
    let articles = articlesRes?.data || [];
    if (articles.length === 0) {
      const fallbackArticles = await articlesApi.getArticles(1, 7, undefined, slug).catch(() => ({ data: [] }));
      articles = fallbackArticles?.data || [];
    }

    featuredArticles = articles;
    spotlightArticle = featuredArticles.length > 0 ? featuredArticles[0] : null;
    gridArticles = featuredArticles.slice(1, 7);

  } catch (error: any) {
    // Handle Next.js build-time fetch errors safely
    if (error?.digest === 'DYNAMIC_SERVER_USAGE') throw error;
    console.error('Failed to fetch category hub data:', error);
  }

  if (!category) {
    notFound();
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-6 max-w-[1200px] mx-auto px-4 md:px-0">
      {/* Left Column - Main Content (70%) */}
      <div className="w-full lg:w-[70%]">
        
        {/* Hub Header */}
        <div className="mb-10 pb-6 border-b-2 border-[#2e3b2c]">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🎮</span>
            <h1 className="text-4xl font-black text-[#f7ebc6] uppercase tracking-wider">
              {category.name}
            </h1>
          </div>
          {category.description && (
            <p className="text-[#a4b5a6] text-lg mt-3 font-medium">
              {category.description}
            </p>
          )}
        </div>

        {/* Section 1: Featured Games */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-[#f7ebc6] border-l-4 border-[#B05B27] pl-3">
              🔥 แนะนำเกมหมวด {category.name}
            </h2>
          </div>
          
          {featuredGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {featuredGames.map((game: any) => (
                <ArticleCard 
                  key={game.id}
                  id={game.id}
                  title={game.title}
                  excerpt={game.description || ''}
                  imageUrl={game.coverImage || ''}
                  category={category}
                  date={game.publishedAt?.toString() || ''}
                />
              ))}
            </div>
          ) : (
            <p className="text-[#a4b5a6] italic mb-6">ยังไม่มีเกมในหมวดหมู่นี้...</p>
          )}
          
          <div className="flex justify-end">
             <Link 
               href={`/games?category=${slug}`}
               className="text-[#f7ebc6] font-bold hover:text-[#B05B27] transition-colors border-b-2 border-transparent hover:border-[#B05B27]"
             >
               ดูเกม {category.name} ทั้งหมด ➔
             </Link>
          </div>
        </section>

        {/* Section 2: Spotlight Article */}
        {spotlightArticle && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-[#f7ebc6] border-l-4 border-[#B05B27] pl-3">
                🌟 ข่าวไฮไลท์
              </h2>
            </div>
            
            <Link href={`/article/${spotlightArticle.id}`} className="group relative block w-full h-[300px] md:h-[400px] overflow-hidden border border-[#2e3b2c] shadow-sm bg-[#1a241b] rounded-sm mb-6">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f0c] via-[#0b0f0c]/40 to-transparent z-10 transition-opacity group-hover:opacity-90"></div>
              <img 
                src={spotlightArticle.heroImage || spotlightArticle.coverImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200'} 
                alt={spotlightArticle.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
              />
              <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col items-start">
                <span className="bg-[#B05B27] text-[#f7ebc6] text-xs font-black px-3 py-1 shadow-md uppercase mb-3 tracking-wider">
                  {getCategoryName(category)}
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-[#f7ebc6] leading-tight line-clamp-2 drop-shadow-lg group-hover:text-white transition-colors">
                  {spotlightArticle.title}
                </h3>
                <p className="text-[#a4b5a6] mt-3 line-clamp-2 max-w-3xl">
                  {spotlightArticle.excerpt}
                </p>
                <div className="mt-4 text-[#f7ebc6] font-bold text-sm bg-lime-400/20 px-4 py-1.5 rounded-full backdrop-blur-sm group-hover:bg-lime-400 group-hover:text-[#0b0f0c] transition-colors">
                  อ่านต่อ ➔
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Section 3: Grid Articles */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-[#f7ebc6] border-l-4 border-[#B05B27] pl-3">
              📰 ข่าวสารน่าสนใจ
            </h2>
          </div>
          
          {gridArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {gridArticles.map((article: any) => (
                <ArticleCard 
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  excerpt={article.excerpt || ''}
                  imageUrl={article.coverImage || ''}
                  category={category}
                  date={article.publishedAt?.toString() || ''}
                  viewCount={article.viewCount}
                />
              ))}
            </div>
          ) : (
            <p className="text-[#a4b5a6] italic mb-6">ยังไม่มีข่าวในหมวดหมู่นี้...</p>
          )}

          <div className="flex justify-end">
             <Link 
               href={`/news?category=${slug}`}
               className="text-[#f7ebc6] font-bold hover:text-[#B05B27] transition-colors border-b-2 border-transparent hover:border-[#B05B27]"
             >
               อ่านข่าว {category.name} ทั้งหมด ➔
             </Link>
          </div>
        </section>

      </div>

      {/* Right Column - Sidebar (30%) */}
      <div className="w-full lg:w-[30%]">
        <Sidebar />
      </div>
    </div>
  );
}
