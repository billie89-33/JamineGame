import React from 'react';
import { HeroArticle, ArticleGrid } from '@/features/articles/components';
import { Sidebar } from '@/components/common';

export default function Home() {
  return (
    <main className="w-full px-4 md:px-8 lg:px-12 py-12 z-10">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
        {/* Main Content Area */}
        <div className="w-full lg:w-[70%] xl:w-[75%] flex flex-col">
          <HeroArticle />
          <ArticleGrid />
        </div>
        
        {/* Sidebar */}
        <div className="w-full lg:w-[30%] xl:w-[25%] sticky top-28">
          <Sidebar />
        </div>
      </div>
    </main>
  );
}
