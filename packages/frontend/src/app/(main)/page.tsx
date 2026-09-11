import React from 'react';
import { HeroArticle, ArticleGrid, EditorsPick } from '@/features/articles/components';
import { FeaturedGames } from '@/features/games/components';
import { Sidebar } from '@/components/common';

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12 md:px-8 lg:px-12 z-10 w-full">
      {/* 1. Hero Images (Featured Articles) */}
      <HeroArticle />

      {/* 2. Latest News */}
      <ArticleGrid 
        title="📰 LATEST NEWS" 
        type="NEWS" 
        limit={4} 
        href="/news" 
      />

      {/* 3. Editor's Pick (Featured Article) */}
      <EditorsPick />

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
        {/* Main Content Area (Left 70%) */}
        <div className="flex-1 w-full flex flex-col">
          
          {/* 4. Featured Games */}
          <FeaturedGames />

          {/* 5. Latest Reviews & Guides */}
          <ArticleGrid 
            title="🎯 รีวิวและไกด์ล่าสุด" 
            type="REVIEW,GUIDE" 
            limit={6} 
            href="/articles" 
          />
        </div>
        
        {/* Sidebar (Right 30%) */}
        <div className="w-full lg:w-[320px] shrink-0 sticky top-28">
          <Sidebar />
        </div>
      </div>
    </main>
  );
}
