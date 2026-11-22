import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Sidebar } from '@/components/common';
import { getCachedArticleById } from '@/lib/public-queries';
import {
  ArticleHeader,
  ArticleHeroImage,
  ArticleContent,
  ArticleShare,
} from '@/features/articles/components/Single';
import { JsonLd } from '@/components/seo/JsonLd';
import { SITE_NAME, SITE_URL } from '@/lib/config';

function buildPlainExcerpt(excerpt?: string | null, content?: string | null): string {
  if (excerpt && excerpt.trim().length > 0) {
    return excerpt.trim().slice(0, 160);
  }
  if (!content) return '';
  return content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const decodedId = decodeURIComponent(resolvedParams.id);
  const article = await getCachedArticleById(decodedId);

  if (!article) {
    return {
      title: 'ไม่พบบทความ',
    };
  }

  const description = buildPlainExcerpt(article.excerpt, article.content);
  const image = article.heroImage || article.coverImage;
  const canonicalUrl = `${SITE_URL}/article/${decodedId}`;

  return {
    title: article.title,
    description,
    keywords: Array.isArray(article.tags) ? article.tags : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      siteName: SITE_NAME,
      title: article.title,
      description,
      url: canonicalUrl,
      publishedTime: article.publishedAt || undefined,
      modifiedTime: article.updatedAt || article.publishedAt || undefined,
      images: image ? [{ url: image, alt: article.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const decodedId = decodeURIComponent(resolvedParams.id);

  const article = await getCachedArticleById(decodedId);


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

  const description = buildPlainExcerpt(article.excerpt, article.content);
  const image = article.heroImage || article.coverImage;
  const canonicalUrl = `${SITE_URL}/article/${decodedId}`;
  const authorName = article.author?.username || article.author?.name || SITE_NAME;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description,
    image: image ? [image] : undefined,
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt || article.publishedAt || article.createdAt,
    inLanguage: 'th',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'หน้าแรก',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'ข่าวสาร',
        item: `${SITE_URL}/news`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <main className="w-full px-4 md:px-8 lg:px-12 py-12 z-10">
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
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
