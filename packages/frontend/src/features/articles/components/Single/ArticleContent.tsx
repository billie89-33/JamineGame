import React from 'react';

interface ArticleContentProps {
  htmlContent: string;
}

export const ArticleContent = ({ htmlContent }: ArticleContentProps) => {
  return (
    <article 
      className="prose prose-lg prose-invert max-w-none text-[#a5b8a6]"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};
