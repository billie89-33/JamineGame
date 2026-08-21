import React from 'react';
import { Article } from '../../types';

interface ArticleHeaderProps {
  article: Article;
}

export const ArticleHeader = ({ article }: ArticleHeaderProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8 flex flex-col items-center text-center">
      <div className="flex gap-2 mb-6">
        <span className="bg-[#B05B27] text-[#f7ebc6] text-xs font-black px-3 py-1.5 shadow-sm tracking-wider">FEATURED</span>
        <span className="bg-[#1a241b] border border-[#d4c38d] text-[#f7ebc6] text-xs font-bold px-3 py-1.5 shadow-sm tracking-wider">
          {article.category}
        </span>
      </div>
      
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#f7ebc6] mb-8 leading-tight drop-shadow-md">
        {article.title}
      </h1>
      
      <div className="flex flex-wrap items-center justify-center gap-4 text-[#a5b8a6] font-medium text-sm mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden border-2 border-[#d4c38d]">
            <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
          </div>
          <span className="text-[#d4c38d] font-bold">{article.author.name}</span>
        </div>
        <span className="opacity-50">•</span>
        <span>{article.publishedAt}</span>
        <span className="opacity-50">•</span>
        <span>{article.readTime}</span>
        <span className="opacity-50">•</span>
        <span>💬 {article.commentsCount} Comments</span>
      </div>
    </div>
  );
};
