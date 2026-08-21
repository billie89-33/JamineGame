import React from 'react';
import { notFound } from 'next/navigation';
import { Sidebar } from '@/components/common';
import { getArticleById } from '@/features/articles/data/mockArticles';
import { 
  ArticleHeader, 
  ArticleHeroImage, 
  ArticleContent, 
  ArticleShare 
} from '@/features/articles/components/Single';

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const decodedId = decodeURIComponent(resolvedParams.id);
  
  console.log("Requested ID:", decodedId);
  
  const article = getArticleById(decodedId);
  console.log("Found Article:", article ? article.title : "Not Found");

  if (!article) {
    notFound();
  }

  return (
    <main className="w-full px-4 md:px-8 lg:px-12 py-12 z-10">
      <ArticleHeader article={article} />
      <ArticleHeroImage imageUrl={article.coverImage} altText={article.title} />

      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
        <div className="w-full lg:w-[70%] xl:w-[75%] flex flex-col">
          <ArticleContent htmlContent={article.content} />
          <ArticleShare tags={article.tags} />
        </div>
        
        <div className="w-full lg:w-[30%] xl:w-[25%] sticky top-28">
          <Sidebar />
        </div>
      </div>
    </main>
  );
}
