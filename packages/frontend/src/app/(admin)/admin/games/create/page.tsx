import React from 'react';
import { AdminGameForm } from '@/features/games/components/AdminGameForm/AdminGameForm';

export default function CreateGamePage() {
  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-[#f7ebc6] mb-8 tracking-wider">ADD NEW GAME</h1>
        <AdminGameForm />
      </div>
    </div>
  );
}
