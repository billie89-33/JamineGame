import React from 'react';
import { HeroArticle, ArticleGrid } from '@/features/articles/components';
import { Sidebar } from '@/components/common';

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12 md:px-8 lg:px-12 z-10 w-full">
      {/* 1. Hero Images (Full Width, spanning across both columns) */}
      <HeroArticle />

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
        {/* Main Content Area */}
        <div className="flex-1 w-full flex flex-col">
          
          {/* 2. Admin Editable Website Intro Text */}
          <div className="bg-[#f7ebc6] border border-[#d4c38d] p-6 mb-8 shadow-sm">
            <h2 className="text-xl font-black text-[#1a241b] mb-2 uppercase border-b-2 border-[#1a241b] pb-2 inline-block">
              Welcome to Gameverse
            </h2>
            <p className="text-[#4a574b] font-medium leading-relaxed mt-2">
              [ส่วนนี้สำหรับให้ Admin เข้ามาเปลี่ยนข้อความแนะนำเว็บไซต์] <br/>
              ศูนย์รวมรีวิวเกม ข่าวสารอีสปอร์ต และคอมมูนิตี้สำหรับเกมเมอร์ทุกแนว อัปเดตสดใหม่ทุกวัน!
            </p>
          </div>

          <ArticleGrid />
        </div>
        
        {/* Sidebar */}
        <div className="w-full lg:w-[320px] shrink-0 sticky top-28">
          <Sidebar />
        </div>
      </div>
    </main>
  );
}
