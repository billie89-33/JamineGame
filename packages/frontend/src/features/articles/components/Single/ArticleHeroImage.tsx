import React from 'react';

interface ArticleHeroImageProps {
  imageUrl: string;
  altText: string;
}

export const ArticleHeroImage = ({ imageUrl, altText }: ArticleHeroImageProps) => {
  return (
    <div className="w-full mb-12 lg:mb-16 relative aspect-video md:aspect-[21/9] bg-[#1a241b] p-2 border border-[#d4c38d] shadow-lg max-w-7xl mx-auto">
      <div className="w-full h-full overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f0c]/60 to-transparent mix-blend-overlay z-10"></div>
        <img 
          src={imageUrl} 
          alt={altText} 
          className="w-full h-full object-cover" 
        />
      </div>
    </div>
  );
};
