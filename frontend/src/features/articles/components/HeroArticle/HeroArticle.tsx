import React from 'react';
import Link from 'next/link';
import { getRecentArticles } from '../../data/mockArticles';

export const HeroArticle = () => {
  const featuredArticle = getRecentArticles(1)[0];

  return (
    <section className="mb-16">
      <div className="group relative w-full bg-[#B05B27]/90 border border-[#d4c38d] p-6 lg:p-12 transition-all duration-700 hover:shadow-[0_20px_60px_-15px_rgba(176,91,39,0.5)] flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
        {/* Cover Image */}
        <div className="w-full lg:w-[62%] aspect-[4/3] md:aspect-video overflow-hidden relative shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a241b]/20 to-[#0b0f0c]/60 mix-blend-overlay z-10"></div>
          <img 
            src={featuredArticle.coverImage} 
            alt={featuredArticle.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
          />
          <div className="absolute bottom-6 left-6 z-20 flex gap-3">
            <span className="bg-[#1a241b]/60 backdrop-blur-md border border-[#f7ebc6] text-[#f7ebc6] text-sm font-black px-4 py-1.5 shadow-md">FEATURED</span>
            <span className="bg-[#1a241b]/60 backdrop-blur-md border border-[#f7ebc6] text-[#f7ebc6] text-sm font-bold px-4 py-1.5 shadow-md uppercase">{featuredArticle.category}</span>
          </div>
        </div>

        {/* Content */}
        <div className="w-full lg:w-[38%] flex flex-col justify-center py-4 lg:py-0">
          <h1 className="text-4xl lg:text-6xl font-black text-[#f7ebc6] mb-6 leading-tight group-hover:text-white transition-colors duration-500 drop-shadow-md">
            {featuredArticle.title}
          </h1>
          <p className="text-[#f7ebc6]/90 text-lg font-medium mb-8 leading-relaxed">
            {featuredArticle.excerpt}
          </p>
          <Link href={`/article/${featuredArticle.id}`} className="self-start px-10 py-4 bg-[#f7ebc6] font-bold text-lg text-[#B05B27] hover:bg-white hover:shadow-[0_0_20px_rgba(247,235,198,0.4)] transition-all duration-300">
            READ REVIEW
          </Link>
        </div>
      </div>
    </section>
  );
};
