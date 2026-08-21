import React from 'react';

interface ArticleShareProps {
  tags: string[];
}

export const ArticleShare = ({ tags }: ArticleShareProps) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-t border-b border-[#2e3b2c] py-6 mt-12 gap-6">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="font-bold text-[#f7ebc6] mr-2">TAGS:</span>
        {tags.map(tag => (
          <span key={tag} className="bg-[#1a241b] border border-[#2e3b2c] text-[#a5b8a6] text-xs font-bold px-3 py-1.5 hover:bg-[#B05B27] hover:text-[#f7ebc6] hover:border-[#B05B27] cursor-pointer transition-colors">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex gap-4 items-center">
        <span className="font-bold text-[#f7ebc6]">SHARE:</span>
        {['FACEBOOK', 'TWITTER', 'LINKEDIN'].map(social => (
          <button key={social} className="text-xs font-bold text-[#a5b8a6] hover:text-[#d4c38d] transition-colors">{social}</button>
        ))}
      </div>
    </div>
  );
};
