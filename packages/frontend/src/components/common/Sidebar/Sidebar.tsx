import React from 'react';
import Link from 'next/link';
import { API_URL } from '@/lib/config';
import { Article } from '@/features/articles/articles.api';

export const Sidebar = async () => {
  let trendingArticles: Article[] = [];
  
  try {
    const res = await fetch(`${API_URL}/articles?page=1&limit=5&sort=views`, { 
      next: { revalidate: 60 } // Revalidate every minute for trending
    });
    
    if (res.ok) {
      const data = await res.json();
      trendingArticles = data.data || [];
    }
  } catch (error: any) {
    if (error?.digest === 'DYNAMIC_SERVER_USAGE') throw error;
    console.error('Failed to fetch trending articles:', error);
  }

  // Fallback data if none
  if (trendingArticles.length === 0) {
    // Generate some fake fallback so UI doesn't look empty
    trendingArticles = [
      { id: '1', title: 'The competitive scene is heating up', publishedAt: new Date().toISOString() } as Article,
      { id: '2', title: 'Top 10 RPGs to play this weekend', publishedAt: new Date().toISOString() } as Article,
    ];
  }

  return (
    <aside className="w-full flex flex-col gap-8">
      {/* Trending Section */}
      <div className="bg-[#f7ebc6] border border-[#d4c38d] p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 border-b-2 border-[#1a241b] pb-2">
          <span className="text-xl">🔥</span>
          <h3 className="text-xl font-black text-[#1a241b] uppercase">
            Trending
          </h3>
        </div>
        <div className="flex flex-col gap-4">
          {trendingArticles.map((item, index) => (
            <Link href={`/article/${item.id}`} key={item.id} className="flex gap-4 group cursor-pointer items-start">
              <div className="w-8 flex-shrink-0 text-[#B05B27] font-black text-2xl pt-1">
                {index + 1}
              </div>
              <div className="w-20 h-20 bg-gray-300 overflow-hidden shrink-0 border border-[#d4c38d]">
                <img 
                  src={item.coverImage || `https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=200`} 
                  alt="Trending thumbnail"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-[#1a241b] group-hover:text-[#B05B27] line-clamp-2 leading-tight mb-1 transition-colors">
                  {item.title}
                </h4>
                <span className="text-xs text-[#5d6b5e] font-medium">
                  {new Date(item.publishedAt || new Date()).toLocaleDateString('th-TH')}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Categories / Tags */}
      <div className="bg-[#f7ebc6] border border-[#d4c38d] p-6 shadow-sm">
        <h3 className="text-xl font-black text-[#1a241b] mb-4 uppercase border-b-2 border-[#1a241b] pb-2">
          Topics
        </h3>
        <div className="flex flex-wrap gap-2">
          {['ESPORTS', 'RPG', 'SHOOTER', 'HARDWARE', 'REVIEWS', 'INDIE'].map((tag) => (
            <span key={tag} className="text-xs font-bold bg-[#1a241b] text-[#f7ebc6] px-3 py-1.5 hover:bg-[#2e3b2c] cursor-pointer transition-colors">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
};
