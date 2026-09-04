import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { gamesApi } from '@/features/games/games.api';

export default async function GameDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let game;
  
  try {
    // ดึงข้อมูลเกมจริงๆ จาก Backend ตาม slug
    game = await gamesApi.getGameById(resolvedParams.slug);
  } catch (error) {
    notFound(); // ถ้าไม่เจอเกม ให้แสดงหน้า 404
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-12 md:px-8 lg:px-12 min-h-[60vh]">
      {/* ส่วนหัวของเกม (Hero Section) */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {game.coverImage ? (
          <img 
            src={game.coverImage} 
            alt={game.title} 
            className="w-full md:w-1/3 aspect-[3/4] object-cover rounded-2xl shadow-xl border border-[#d4c38d]"
          />
        ) : (
          <div className="w-full md:w-1/3 aspect-[3/4] bg-[#1a241b] rounded-2xl flex items-center justify-center border border-[#d4c38d]">
            <span className="text-6xl">🎮</span>
          </div>
        )}
        
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-5xl font-black text-[#1a241b] mb-4 uppercase">{game.title}</h1>
          <p className="text-[#1a241b]/80 text-lg mb-6 leading-relaxed">
            {game.description || 'ไม่มีคำอธิบายสำหรับเกมนี้'}
          </p>
          
          <div className="grid grid-cols-2 gap-4 bg-[#f7ebc6] p-6 rounded-xl border border-[#d4c38d]">
            <div>
              <p className="text-sm font-bold text-[#1a241b]/50 uppercase">ผู้พัฒนา</p>
              <p className="font-bold text-[#1a241b]">{game.developer || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-[#1a241b]/50 uppercase">ผู้จัดจำหน่าย</p>
              <p className="font-bold text-[#1a241b]">{game.publisher || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-[#1a241b]/50 uppercase">วันวางจำหน่าย</p>
              <p className="font-bold text-[#1a241b]">
                {game.releaseDate ? new Date(game.releaseDate).toLocaleDateString('th-TH') : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm font-bold text-[#1a241b]/50 uppercase">คะแนน</p>
              <p className="font-bold text-[#1a241b]">{game.rating ? `${game.rating}/10` : '-'}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {game.platforms?.map((p: string, i: number) => (
              <span key={i} className="bg-[#1a241b] text-[#f7ebc6] px-3 py-1 rounded-lg text-sm font-bold">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* บทความที่เกี่ยวข้องกับเกมนี้ */}
      <h2 className="text-3xl font-black text-[#1a241b] mb-6 uppercase border-b-2 border-[#d4c38d] pb-2">
        ข่าวและบทความ ({game.title})
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {game.articles && game.articles.length > 0 ? (
          game.articles.map((article: any) => (
            <Link href={`/article/${article.id}`} key={article.id}>
              <div className="bg-[#f7ebc6] rounded-xl overflow-hidden shadow-lg border border-[#d4c38d] hover:scale-105 transition-transform cursor-pointer h-full flex flex-col">
                {article.coverImage ? (
                  <img src={article.coverImage} alt={article.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-[#1a241b] flex items-center justify-center">
                    <span className="text-4xl">📰</span>
                  </div>
                )}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-xl text-[#1a241b] mb-2 line-clamp-2">{article.title}</h3>
                  <p className="text-[#1a241b]/70 text-sm line-clamp-3">{article.excerpt}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full py-10 text-center text-[#1a241b]/60 font-medium bg-[#e8d7a5] rounded-xl border border-[#d4c38d]">
            ยังไม่มีบทความสำหรับเกมนี้
          </div>
        )}
      </div>
    </main>
  );
}
