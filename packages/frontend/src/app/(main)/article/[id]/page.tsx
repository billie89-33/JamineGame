import React from 'react';
import { notFound } from 'next/navigation';
import { Sidebar } from '@/components/common';
import { articlesApi } from '@/features/articles/articles.api';
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
  
  const article = await articlesApi.getArticleById(decodedId).catch(() => null);
  console.log("Found Article:", article ? article.title : "Not Found");


  // Helper to extract YouTube ID
  const getYoutubeId = (url: string) => {
    if (!url) return null;
    if (url.includes('youtube.com')) {
      try {
        return new URLSearchParams(new URL(url).search).get('v');
      } catch(e) { return null; }
    }
    if (url.includes('youtu.be')) return url.split('/').pop();
    return null;
  };
  const ytId = article?.videoUrl ? getYoutubeId(article.videoUrl) : null;

  if (!article) {
    notFound();
  }

  return (
    <main className="w-full px-4 md:px-8 lg:px-12 py-12 z-10">
      <ArticleHeader article={article} />
      
      {article.coverImage && (
        <ArticleHeroImage imageUrl={article.coverImage} altText={article.title} />
      )}

      {article.videoUrl && (
        <div className="w-full max-w-7xl mx-auto mb-12 lg:mb-16 rounded-2xl overflow-hidden border border-[#2e3b2c] shadow-2xl bg-black">
          {ytId ? (
            <div className="w-full aspect-video">
              <iframe 
                width="100%" height="100%" src={`https://www.youtube.com/embed/${ytId}`}
                frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="w-full aspect-video">
              <video src={article.videoUrl} controls className="w-full h-full object-contain"></video>
            </div>
          )}
        </div>
      )}


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
