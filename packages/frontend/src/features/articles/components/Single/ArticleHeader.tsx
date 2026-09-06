import React from 'react';
import { Article } from '../../types';

interface ArticleHeaderProps {
  article: Article;
}

export const ArticleHeader = ({ article }: ArticleHeaderProps) => {
  const categoryName = typeof article.category === 'object' && article.category !== null && 'name' in article.category
    ? (article.category as { name: string }).name || 'ทั่วไป'
    : (article.category || 'ทั่วไป');

  const authorName = article.author?.username || article.author?.name || 'ผู้ดูแลระบบ';
  const authorAvatar = article.author?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100';

  const formattedDate = article.publishedAt
    ? (!isNaN(Date.parse(article.publishedAt)) 
        ? new Date(article.publishedAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
        : article.publishedAt)
    : '';

  const readTimeText = typeof article.readTime === 'number'
    ? `${article.readTime} นาที`
    : (article.readTime || '3 นาที');

  const commentsCount = article.commentsCount ?? 0;

  return (
    <div className="w-full max-w-4xl mx-auto mb-8 flex flex-col items-center text-center">
      <div className="flex gap-2 mb-6">
        <span className="bg-[#B05B27] text-[#f7ebc6] text-xs font-black px-3 py-1.5 shadow-sm tracking-wider">FEATURED</span>
        <span className="bg-[#1a241b] border border-[#d4c38d] text-[#f7ebc6] text-xs font-bold px-3 py-1.5 shadow-sm tracking-wider">
          {categoryName}
        </span>
      </div>
      
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#f7ebc6] mb-8 leading-tight drop-shadow-md">
        {article.title}
      </h1>
      
      <div className="flex flex-wrap items-center justify-center gap-4 text-[#a5b8a6] font-medium text-sm mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden border-2 border-[#d4c38d]">
            <img src={authorAvatar} alt={authorName} className="w-full h-full object-cover" />
          </div>
          <span className="text-[#d4c38d] font-bold">{authorName}</span>
        </div>
        {formattedDate && (
          <>
            <span className="opacity-50">•</span>
            <span>{formattedDate}</span>
          </>
        )}
        <span className="opacity-50">•</span>
        <span>⏱️ {readTimeText}</span>
        <span className="opacity-50">•</span>
        <span>💬 {commentsCount} Comments</span>
      </div>
    </div>
  );
};
