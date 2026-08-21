import React from 'react';
import Link from 'next/link';

interface ArticleCardProps {
  id: number | string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  date: string;
}

export const ArticleCard = ({ id, title, excerpt, imageUrl, category, date }: ArticleCardProps) => {
  return (
    <Link href={`/article/${id}`} className="group relative rounded-2xl bg-[#f7ebc6] border border-[#d4c38d] p-4 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_rgba(250,214,97,0.25)] flex flex-col h-full block">
      {/* Thumbnail */}
      <div className="w-full aspect-[4/3] rounded-xl bg-[#e8d7a5] mb-4 overflow-hidden relative shadow-inner">
        <div className="absolute inset-0 bg-[#1a241b]/10 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity"></div>
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale-[20%] group-hover:grayscale-0" 
        />
        <div className="absolute top-3 right-3 bg-[#f7ebc6]/90 backdrop-blur-md text-[#1a241b] text-xs font-black px-2.5 py-1 rounded-md z-20 shadow-sm uppercase">
          {category}
        </div>
      </div>

      <h3 className="text-lg font-black text-[#1a241b] mb-2 group-hover:text-[#2e3b2c] transition-colors line-clamp-2">
        {title}
      </h3>
      <p className="text-sm text-[#4a574b] font-medium mb-4 line-clamp-3 flex-1">
        {excerpt}
      </p>
      
      <div className="flex justify-between items-center text-sm text-[#5d6b5e] font-bold pt-4 border-t border-[#d4c38d]/50 mt-auto">
        <span className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-[#1a241b] inline-block"></span> 
          Admin
        </span>
        <span className="text-[#2e3b2c]">{date}</span>
      </div>
    </Link>
  );
};
