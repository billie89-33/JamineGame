import React from 'react';
import Link from 'next/link';
import { API_URL } from '@/lib/config';
import { Article } from '../../articles.api';

export const EditorsPick = async () => {
  let article: Article | null = null;
  
  try {
    const res = await fetch(`${API_URL}/articles?page=1&limit=1&type=FEATURE`, { 
      cache: 'no-store'
    });
    
    if (res.ok) {
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        article = data.data[0];
      }
    }
  } catch (error: any) {
    if (error?.digest === 'DYNAMIC_SERVER_USAGE') throw error;
    console.error('Failed to fetch FEATURE article:', error);
  }

  // Fallback UI if no FEATURE article is found
  if (!article) {
    return (
      <div className="bg-[#f7ebc6] border border-[#d4c38d] p-8 mb-12 shadow-sm rounded-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-black text-[#1a241b] mb-3 uppercase inline-flex items-center gap-2">
            ✨ Welcome to Gameverse
          </h2>
          <p className="text-[#4a574b] font-medium leading-relaxed text-lg max-w-2xl">
            ศูนย์รวมรีวิวเกม ข่าวสารอีสปอร์ต และคอมมูนิตี้สำหรับเกมเมอร์ทุกแนว อัปเดตสดใหม่ทุกวัน! 
            รอติดตามบทความพิเศษ (Editor's Pick) จากทีมงานของเราได้ที่นี่เร็วๆ นี้
          </p>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10 text-[150px]">
          🎮
        </div>
      </div>
    );
  }

  const categoryName = typeof article.category === 'object' && article.category !== null && 'name' in article.category 
    ? (article.category as { name: string }).name 
    : 'พิเศษ';

  return (
    <div className="mb-12 w-full">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">✨</span>
        <h2 className="text-2xl font-black text-[#f7ebc6] uppercase tracking-widest drop-shadow-[0_0_8px_rgba(247,235,198,0.2)]">
          Editor's Pick
        </h2>
        <div className="flex-1 h-px bg-gradient-to-r from-[#B05B27]/50 to-transparent ml-4"></div>
      </div>

      <div className="bg-[#141c15] border border-[#202d21] rounded-2xl overflow-hidden shadow-2xl group transition-all duration-300 hover:border-[#B05B27]/50">
        <Link href={`/article/${article.id}`} className="block relative w-full aspect-video md:aspect-[21/9] overflow-hidden bg-[#1a241b]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f0c] via-[#0b0f0c]/40 to-transparent z-10 transition-opacity group-hover:opacity-80"></div>
          <img 
            src={article.heroImage || article.coverImage || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1200'} 
            alt={article.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute top-4 left-4 z-20">
            <span className="bg-[#B05B27] text-[#f7ebc6] text-xs font-black px-3 py-1 shadow-md uppercase tracking-wider">
              {categoryName}
            </span>
          </div>
        </Link>
        
        <div className="p-6 md:p-8 relative">
          <Link href={`/article/${article.id}`}>
            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight mb-4 group-hover:text-lime-400 transition-colors">
              {article.title}
            </h3>
          </Link>
          <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6 line-clamp-3">
            {article.excerpt}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-sm text-gray-500 font-medium">
              {new Date(article.publishedAt || new Date()).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <Link 
              href={`/article/${article.id}`} 
              className="px-6 py-3 bg-[#2e3b2c] hover:bg-[#B05B27] text-[#f7ebc6] rounded-xl font-bold transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2 w-full sm:w-auto text-center"
            >
              อ่านบทความเต็ม &raquo;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
