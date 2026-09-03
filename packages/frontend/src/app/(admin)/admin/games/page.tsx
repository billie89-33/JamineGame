/* eslint-disable */
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { gamesApi } from '@/features/games/games.api';
import { Plus, Edit2, Trash2, Search, Gamepad2 } from 'lucide-react';

export default function AdminGamesPage() {
  const [games, setGames] = useState<import('@/features/games/games.api').Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchGames = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await gamesApi.getGames(page, limit);
      setGames(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch games", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames(currentPage);
  }, [currentPage]);

    const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await gamesApi.deleteGame(id);
        alert('Game deleted successfully');
        fetchGames(currentPage);
      } catch (error) {
        alert('Failed to delete game');
        console.error(error);
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#f7ebc6] p-6 rounded-2xl border border-[#d4c38d] shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-[#1a241b] uppercase tracking-wider flex items-center gap-3">
            <Gamepad2 size={32} />
            Games
          </h1>
          <p className="text-[#1a241b]/70 font-medium mt-1">Manage game database</p>
        </div>
        <Link 
          href="/admin/games/create"
          className="flex items-center gap-2 bg-[#1a241b] text-[#f7ebc6] px-6 py-3 rounded-xl font-bold hover:bg-[#2e3b2c] transition-colors"
        >
          <Plus size={20} />
          ADD GAME
        </Link>
      </div>

      <div className="bg-[#f7ebc6] rounded-2xl border border-[#d4c38d] p-6 overflow-hidden">
        <div className="flex items-center gap-3 bg-[#e8d7a5] px-4 py-3 rounded-xl mb-6 border border-[#d4c38d]">
          <Search size={20} className="text-[#1a241b]/50" />
          <input 
            type="text" 
            placeholder="Search games..." 
            className="bg-transparent border-none outline-none text-[#1a241b] font-medium w-full placeholder:text-[#1a241b]/50"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-10 font-bold text-[#1a241b]">LOADING GAMES...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[#d4c38d] text-[#1a241b] text-sm uppercase tracking-wider">
                  <th className="pb-4 font-black">Title</th>
                  <th className="pb-4 font-black">Developer</th>
                  <th className="pb-4 font-black">Release Date</th>
                  <th className="pb-4 font-black">Platforms</th>
                  <th className="pb-4 font-black text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {games.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center font-medium text-[#1a241b]/60">
                      No games found. Add some games!
                    </td>
                  </tr>
                ) : (
                  games.map((game) => (
                    <tr key={game.id} className="border-b border-[#d4c38d] last:border-0 hover:bg-[#e8d7a5]/50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          {game.coverImage && (
                            <img src={game.coverImage} alt={game.title} className="w-10 h-10 rounded-md object-cover bg-[#d4c38d]" />
                          )}
                          <p className="font-bold text-[#1a241b]">{game.title}</p>
                        </div>
                      </td>
                      <td className="py-4 font-medium text-[#1a241b]">{game.developer || '-'}</td>
                      <td className="py-4 text-[#1a241b]/80 text-sm">
                        {game.releaseDate ? new Date(game.releaseDate).toLocaleDateString('th-TH') : '-'}
                      </td>
                      <td className="py-4">
                        <div className="flex gap-1 flex-wrap">
                          {game.platforms?.slice(0, 3).map((p: string, i: number) => (
                            <span key={i} className="bg-[#1a241b] text-[#f7ebc6] px-2 py-1 rounded-md text-xs font-bold whitespace-nowrap">
                              {p}
                            </span>
                          ))}
                          {(game.platforms?.length || 0) > 3 && (
                            <span className="bg-[#d4c38d] text-[#1a241b] px-2 py-1 rounded-md text-xs font-bold">
                              +{(game.platforms?.length || 0) - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="flex justify-end gap-2">
                          <Link 
                            href={`/admin/games/edit/${game.slug}`}
                            className="p-2 rounded-lg bg-[#e8d7a5] text-[#1a241b] hover:bg-[#d4c38d] transition-colors" 
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(game.id, game.title)}
                            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors" 
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 px-2">
            <span className="text-sm font-medium text-[#1a241b]/70">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-[#e8d7a5] text-[#1a241b] font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d4c38d]"
              >
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-[#e8d7a5] text-[#1a241b] font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d4c38d]"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
