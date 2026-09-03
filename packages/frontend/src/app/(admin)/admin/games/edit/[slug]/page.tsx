/* eslint-disable */
"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AdminGameForm } from '@/features/games/components/AdminGameForm/AdminGameForm';
import { gamesApi } from '@/features/games/games.api';

export default function EditGamePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [initialData, setInitialData] = useState<import('@/features/games/games.api').Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGame = async () => {
    try {
      const data = await gamesApi.getGameById(slug);
      setInitialData(data);
    } catch (error) {
      console.error('Failed to load game:', error);
      alert('Failed to load game data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchGame();
    }
  }, [slug]);

    if (isLoading) {
    return <div className="text-center py-20 text-[#f7ebc6] font-bold">LOADING GAME DATA...</div>;
  }

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-[#f7ebc6] mb-8 tracking-wider">EDIT GAME</h1>
        {initialData && (
          <AdminGameForm 
            initialData={initialData} 
            gameId={initialData.id} 
          />
        )}
      </div>
    </div>
  );
}
