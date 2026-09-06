import React from 'react';
import DOMPurify from 'isomorphic-dompurify';

interface ArticleContentProps {
  htmlContent: string;
}

export const ArticleContent = ({ htmlContent }: ArticleContentProps) => {
  const cleanHtml = DOMPurify.sanitize(htmlContent || '');

  return (
    <article 
      className="prose prose-lg prose-invert max-w-none text-[#a5b8a6]"
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
};
