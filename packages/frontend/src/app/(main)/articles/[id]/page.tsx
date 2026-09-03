import React from 'react';
import { notFound } from 'next/navigation';
import { articlesApi } from '@/features/articles/articles.api';

export default async function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  let article;
  
  try {
    article = await articlesApi.getArticleById(resolvedParams.id);
  } catch (error) {
    notFound();
  }

  if (!article) notFound();

  // Helper to extract YouTube ID
  const getYoutubeId = (url: string) => {
    if (!url) return null;
    if (url.includes('youtube.com')) {
      return new URLSearchParams(new URL(url).search).get('v');
    }
    if (url.includes('youtu.be')) {
      return url.split('/').pop();
    }
    return null;
  };

  const ytId = article.videoUrl ? getYoutubeId(article.videoUrl) : null;
  const isDirectVideo = article.videoUrl && !ytId;

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 md:px-8 lg:px-12 min-h-screen font-sans">
      
      {/* Category Tag */}
      {article.category && (
        <div className="mb-4">
          <span className="bg-lime-400 text-[#1a241b] px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
            {article.category.icon ? `${article.category.icon} ` : ''}{article.category.name}
          </span>
        </div>
      )}

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-black text-[#f7ebc6] mb-6 leading-tight">
        {article.title}
      </h1>

      {/* Excerpt */}
      <p className="text-xl text-[#a0a8a1] mb-8 font-medium">
        {article.excerpt}
      </p>

      {/* Cover Image Banner */}
      {article.coverImage && (
        <div className="w-full mb-8 rounded-2xl overflow-hidden border border-[#2e3b2c] shadow-lg">
          <img src={article.coverImage} alt={article.title} className="w-full h-auto object-cover max-h-[500px]" />
        </div>
      )}

      {/* Video Player */}
      {article.videoUrl && (
        <div className="w-full mb-12 rounded-2xl overflow-hidden border border-[#2e3b2c] shadow-2xl bg-black">
          {ytId ? (
            <div className="w-full aspect-video">
              <iframe 
                width="100%" 
                height="100%" 
                src={`https://www.youtube.com/embed/${ytId}`}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="w-full aspect-video">
              <video src={article.videoUrl} controls className="w-full h-full object-contain"></video>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div 
        className="prose prose-invert prose-lg max-w-none prose-headings:text-[#f7ebc6] prose-a:text-lime-400 prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="mt-16 pt-8 border-t border-[#202d21]">
          <h3 className="text-[#f7ebc6] font-bold mb-4">Tags:</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag: string) => (
              <span key={tag} className="bg-[#1a241b] border border-[#202d21] text-[#a0a8a1] px-3 py-1 rounded-lg text-sm font-medium">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

    </main>
  );
}
