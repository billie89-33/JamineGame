import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCachedGameById } from '@/lib/public-queries';
import { SystemRequirementsCard } from '@/features/games/components/SystemRequirementsCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { SITE_NAME, SITE_URL } from '@/lib/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const decodedId = decodeURIComponent(resolvedParams.id);
  const game = await getCachedGameById(decodedId);

  if (!game) {
    return {
      title: 'ไม่พบข้อมูลเกม',
    };
  }

  const description = (game.description || '').trim().slice(0, 160);
  const canonicalUrl = `${SITE_URL}/games/${decodedId}`;

  return {
    title: game.title,
    description,
    keywords: Array.isArray(game.tags) ? game.tags : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: game.title,
      description,
      url: canonicalUrl,
      images: game.coverImage ? [{ url: game.coverImage, alt: game.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: game.title,
      description,
      images: game.coverImage ? [game.coverImage] : undefined,
    },
  };
}

export default async function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const decodedId = decodeURIComponent(resolvedParams.id);
  
  const game = await getCachedGameById(decodedId);
  
  if (!game) {
    notFound();
  }

  const canonicalUrl = `${SITE_URL}/games/${decodedId}`;
  const gameJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.title,
    description: game.description || undefined,
    image: game.coverImage || undefined,
    url: canonicalUrl,
    inLanguage: 'th',
    gamePlatform: Array.isArray(game.platforms) && game.platforms.length > 0 ? game.platforms : undefined,
    author: game.developer ? { '@type': 'Organization', name: game.developer } : undefined,
    publisher: game.publisher ? { '@type': 'Organization', name: game.publisher } : undefined,
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
        name: 'เกมทั้งหมด',
        item: `${SITE_URL}/games`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: game.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <main className="w-full px-4 md:px-8 lg:px-12 py-12">
      <JsonLd data={gameJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <div className="max-w-4xl mx-auto bg-[#1a241b] p-8 rounded-2xl border border-[#2e3b2c]">
        <h1 className="text-4xl font-black text-[#f7ebc6] mb-4">{game.title}</h1>
        {game.coverImage && (
          <img 
            src={game.coverImage} 
            alt={game.title} 
            className="w-full aspect-video object-cover rounded-xl mb-8"
          />
        )}
        <div 
          className="text-[#a4b5a6] prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: game.content || game.description || '' }}
        />
        
        {/* System Requirements Section */}
        <SystemRequirementsCard raw={game.systemRequirements} />
      </div>
    </main>
  );
}
