import React from 'react';
import { notFound } from 'next/navigation';
import { gamesApi } from '@/features/games/games.api';
import { Monitor } from 'lucide-react';

export default async function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const decodedId = decodeURIComponent(resolvedParams.id);
  
  const game = await gamesApi.getGameById(decodedId).catch(() => null);
  
  if (!game) {
    notFound();
  }

  // Check if system requirements actually has useful content
  // Not just the default "**แนะนำ (Recommended):**\n" or empty spaces
  const hasSystemRequirements = game.systemRequirements && 
    game.systemRequirements.trim().length > 0 &&
    game.systemRequirements.trim() !== '**แนะนำ (Recommended):**';

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
        
        {/* System Requirements Section */}
        {hasSystemRequirements && (
          <div className="mt-12">
            <hr className="border-[#2e3b2c] mb-8" />
            <h3 className="text-2xl font-bold text-[#f7ebc6] mb-6 flex items-center gap-3">
              <Monitor className="w-6 h-6 text-lime-400" />
              ความต้องการระบบ (System Requirements)
            </h3>
            <div className="bg-[#141c15] p-6 rounded-xl border border-[#2e3b2c] text-[#a4b5a6] whitespace-pre-wrap leading-relaxed">
              {game.systemRequirements}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
