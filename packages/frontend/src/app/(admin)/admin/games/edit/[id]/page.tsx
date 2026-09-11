import React from 'react';
import { AdminGameForm } from '@/features/games/components/AdminGameForm/AdminGameForm';
import { Gamepad2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { gamesApi } from '@/features/games/games.api';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'แก้ไขข้อมูลเกม - Jamine Admin',
};

export default async function EditGamePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  let game = null;

  try {
    game = await gamesApi.getGameById(resolvedParams.id);
  } catch (error) {
    console.error(error);
    notFound();
  }

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <Link 
          href="/admin/games" 
          className="p-3 bg-[#1a241b] text-gray-400 rounded-xl hover:text-lime-400 hover:bg-[#202d21] transition-all self-start"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-[#f7ebc6] flex items-center gap-3">
            <Gamepad2 size={32} className="text-lime-400" />
            แก้ไขข้อมูลเกม
          </h1>
          <p className="text-gray-400 mt-1">อัปเดตรายละเอียดของเกม: {game.title}</p>
        </div>
      </div>
      
      <AdminGameForm initialData={game} gameId={game.id} />
    </div>
  );
}
