import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categoriesApi } from '@/features/categories/categories.api';
import { articlesApi } from '@/features/articles/articles.api';
import { gamesApi } from '@/features/games/games.api';
import { ArticleCard } from '@/features/articles/components/ArticleCard';
import { Sidebar } from '@/components/common/Sidebar';
import { Gamepad2, Info } from 'lucide-react';
import { GameResponseDto, ArticleResponseDto } from '@shared/dto';

const getCategoryName = (category: unknown): string => {
  if (!category) return 'ทั่วไป';
  if (typeof category === 'object' && category !== null && 'name' in category) {
    return (category as { name: string }).name || 'ทั่วไป';
  }
  return String(category);
};

const FullGameDetail = ({ game, badgeText }: { game: GameResponseDto, badgeText: string }) => {
  if (!game) return null;

  return (
    <section className="mb-12 border border-[#2e3b2c] bg-[#1a241b] rounded-2xl overflow-hidden shadow-lg group relative">
      {/* Badge */}
      <div className="absolute top-4 left-4 z-20">
        <span className="bg-[#B05B27] text-[#f7ebc6] text-xs font-black px-4 py-1.5 shadow-xl uppercase tracking-wider rounded-md border border-[#f7ebc6]/30">
          🌟 {badgeText}
        </span>
      </div>

      {/* Media: Video or Image */}
      <div className="w-full aspect-video bg-[#0b0f0c] relative border-b border-[#2e3b2c]">
        {game.videoUrl ? (
          <iframe 
            src={game.videoUrl.replace('watch?v=', 'embed/')} 
            className="w-full h-full"
            allowFullScreen
          />
        ) : (
          <img src={game.coverImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={game.title} />
        )}
        {!game.videoUrl && (
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a241b] via-transparent to-transparent opacity-80" />
        )}
      </div>
      
      {/* Details */}
      <div className="p-6 md:p-8">
        <h2 className="text-3xl md:text-4xl font-black text-[#f7ebc6] mb-3 leading-tight">{game.title}</h2>
        <div className="flex flex-wrap gap-4 text-sm text-[#a4b5a6] mb-6 border-b border-[#2e3b2c]/50 pb-4">
          {game.developer && <span className="flex items-center gap-1"><Info size={16}/> ค่ายเกม: <strong className="text-lime-400">{game.developer}</strong></span>}
          {game.publishedAt && <span>📅 อัปเดต: {new Date(game.publishedAt).toLocaleDateString('th-TH')}</span>}
          {game.rating && <span>⭐ คะแนน: <strong className="text-amber-400">{game.rating}/10</strong></span>}
        </div>
        
        {/* Content (Truncated) */}
        <div className="relative mb-8">
          <div 
            className="text-[#a4b5a6] max-h-[200px] overflow-hidden text-sm md:text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: game.content || game.description || 'ไม่มีรายละเอียด...' }}
          />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#1a241b] to-transparent pointer-events-none"></div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-wrap items-center gap-4">
          <Link 
            href={`/article/${game.id}`}
            className="px-8 py-3.5 bg-lime-400 text-[#1a241b] font-black rounded-xl hover:bg-lime-500 transition-colors shadow-[0_0_20px_rgba(163,230,53,0.3)] hover:scale-105 transform duration-300 flex items-center gap-2"
          >
            <Gamepad2 size={20} />
            ดาวน์โหลด / ดูข้อมูลฉบับเต็ม
          </Link>
        </div>
      </div>
    </section>
  );
};

export default async function CategoryHubPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.slug);

  let category = null;
  let allFeaturedGames = [];
  let featuredArticles = [];
  let spotlightArticle = null;
  let gridArticles = [];

  try {
    // 1. Fetch data in parallel
    // We fetch a bit more games (e.g. 8) to make sure we have enough for 2 big + 6 grid
    const [categoryRes, gamesRes, articlesRes] = await Promise.all([
      categoriesApi.getCategoryBySlug(slug).catch(() => null),
      gamesApi.getGames(1, 8, undefined, slug, true).catch(() => ({ data: [] })),
      articlesApi.getArticles(1, 7, undefined, slug, undefined, undefined, true).catch(() => ({ data: [] })),
    ]);

    category = categoryRes;
    
    // If games are empty, fallback to non-featured latest games
    if (gamesRes?.data?.length === 0) {
      const fallbackGames = await gamesApi.getGames(1, 8, undefined, slug).catch(() => ({ data: [] }));
      allFeaturedGames = fallbackGames?.data || [];
    } else {
      allFeaturedGames = gamesRes?.data || [];
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
    if (error?.digest === 'DYNAMIC_SERVER_USAGE') throw error;
    console.error('Failed to fetch category hub data:', error);
  }

  if (!category) {
    notFound();
  }

  // --- Data Structure / Destructuring ---
  // แยก 2 เกมแรกไปโชว์แบบเต็ม และที่เหลือลง Grid
  const [heroGame1, heroGame2, ...gridGames] = allFeaturedGames;

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

        {/* =========================================
            Section 1: Featured Games Grid 
        ========================================= */}
        {gridGames.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-[#f7ebc6] border-l-4 border-[#B05B27] pl-3">
                🔥 เกมน่าสนใจ (ยอดนิยม)
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {gridGames.slice(0, 3).map((game: GameResponseDto) => (
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
            <div className="flex justify-end">
               <Link 
                 href={`/games?category=${slug}`}
                 className="text-[#f7ebc6] font-bold hover:text-[#B05B27] transition-colors border-b-2 border-transparent hover:border-[#B05B27]"
               >
                 ดูเกม {category.name} ทั้งหมด ➔
               </Link>
            </div>
          </section>
        )}

        {/* =========================================
            Section 2: Full Game Detail #1
        ========================================= */}
        {heroGame1 && (
          <FullGameDetail game={heroGame1} badgeText="เกมแนะนำอันดับ 1" />
        )}

        {/* =========================================
            Section 3: Articles (Spotlight + Grid)
        ========================================= */}
        <div className="w-full h-1 bg-[#2e3b2c] rounded-full mb-12"></div> {/* Divider */}
        
        {spotlightArticle && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-[#f7ebc6] border-l-4 border-[#B05B27] pl-3">
                🌟 ข่าวและบทความไฮไลท์
              </h2>
            </div>
            
            <Link href={`/article/${spotlightArticle.id}`} className="group relative block w-full h-[300px] md:h-[400px] overflow-hidden border border-[#2e3b2c] shadow-sm bg-[#1a241b] rounded-2xl mb-8">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f0c] via-[#0b0f0c]/40 to-transparent z-10 transition-opacity group-hover:opacity-90"></div>
              <img 
                src={spotlightArticle.heroImage || spotlightArticle.coverImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200'} 
                alt={spotlightArticle.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
              />
              <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col items-start">
                <span className="bg-[#B05B27] text-[#f7ebc6] text-xs font-black px-3 py-1 shadow-md uppercase mb-3 tracking-wider rounded">
                  {getCategoryName(category)}
                </span>
                <h3 className="text-2xl md:text-3xl font-black text-[#f7ebc6] leading-tight line-clamp-2 drop-shadow-lg group-hover:text-white transition-colors">
                  {spotlightArticle.title}
                </h3>
                <p className="text-[#a4b5a6] mt-3 line-clamp-2 max-w-3xl">
                  {spotlightArticle.excerpt}
                </p>
                <div className="mt-4 text-[#f7ebc6] font-bold text-sm bg-lime-400/20 px-4 py-1.5 rounded-full backdrop-blur-sm group-hover:bg-lime-400 group-hover:text-[#0b0f0c] transition-colors border border-lime-400/30">
                  อ่านต่อ ➔
                </div>
              </div>
            </Link>

            {gridArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {gridArticles.map((article: ArticleResponseDto) => (
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
            )}
            
            <div className="flex justify-end mt-4">
               <Link 
                 href={`/news?category=${slug}`}
                 className="text-[#f7ebc6] font-bold hover:text-[#B05B27] transition-colors border-b-2 border-transparent hover:border-[#B05B27]"
               >
                 อ่านข่าว {category.name} ทั้งหมด ➔
               </Link>
            </div>
          </section>
        )}

        {/* =========================================
            Section 4: Full Game Detail #2
        ========================================= */}
        {heroGame2 && (
          <>
            <div className="w-full h-1 bg-[#2e3b2c] rounded-full mb-12"></div> {/* Divider */}
            <FullGameDetail game={heroGame2} badgeText="เกมแนะนำอันดับ 2" />
          </>
        )}

      </div>

      {/* Right Column - Sidebar (30%) */}
      <div className="w-full lg:w-[30%]">
        <Sidebar />
      </div>
    </div>
  );
}
