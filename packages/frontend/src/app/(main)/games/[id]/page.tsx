import React from 'react';
import { notFound } from 'next/navigation';
import { gamesApi } from '@/features/games/games.api';

export default async function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const decodedId = decodeURIComponent(resolvedParams.id);
  
  const game = await gamesApi.getGameById(decodedId).catch(() => null);
  
  if (!game) {
    notFound();
  }

  return (
    <main className="w-full px-4 md:px-8 lg:px-12 py-12">
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
        {/* Additional Game info (System requirements, etc.) can be added here */}
      </div>
    </main>
  );
}
