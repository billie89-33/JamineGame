"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { gamesApi } from '@/features/games/games.api';
import { GameResponseDto } from '@shared/dto';
import { Plus, Edit2, Trash2, Search, Gamepad2, Loader2 } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export default function AdminGamesPage() {
  const { toast } = useToast();
  const [games, setGames] = useState<GameResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const limit = 10;

  const fetchGames = async (page: number, search?: string) => {
    setIsLoading(true);
    try {
      const response = await gamesApi.getGames(page, limit, search);
      setGames(response.data || []);
      setTotalPages(response.meta?.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch games", error);
      toast.error("ไม่สามารถโหลดรายการเกมได้");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchGames(currentPage, searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentPage, searchTerm]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await gamesApi.deleteGame(deleteTarget.id);
      toast.success(`ลบเกม "${deleteTarget.title}" สำเร็จเรียบร้อยแล้ว`);
      setDeleteTarget(null);
      fetchGames(currentPage, searchTerm);
    } catch (error: any) {
      toast.error('เกิดข้อผิดพลาดในการลบเกม: ' + (error as Error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#f7ebc6] flex items-center gap-3">
            <Gamepad2 size={32} className="text-lime-400" />
            จัดการข้อมูลเกม
          </h1>
          <p className="text-gray-400 mt-1">เพิ่ม แก้ไข และลบข้อมูลแคตตาล็อกเกม</p>
        </div>
        <Link 
          href="/admin/games/create" 
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-lime-400 text-[#1a241b] hover:bg-lime-500 font-bold transition-all whitespace-nowrap self-start shadow-[0_0_20px_rgba(163,230,53,0.3)]"
        >
          <Plus size={20} />
          เพิ่มเกมใหม่
        </Link>
      </div>

      <div className="bg-[#141c15] border border-[#202d21] rounded-2xl overflow-hidden shadow-xl flex flex-col">
        <div className="p-4 border-b border-[#202d21] flex items-center bg-[#1a241b]">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อเกม..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-[#141c15] border border-[#2e3b2c] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-lime-400 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1a241b] text-[#f7ebc6] text-sm uppercase tracking-wider border-b border-[#2e3b2c]">
                <th className="px-6 py-4 font-bold">ชื่อเกม</th>
                <th className="px-6 py-4 font-bold hidden md:table-cell">หมวดหมู่</th>
                <th className="px-6 py-4 font-bold hidden lg:table-cell">ค่ายเกม</th>
                <th className="px-6 py-4 font-bold hidden xl:table-cell">วันที่</th>
                <th className="px-6 py-4 font-bold text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2e3b2c]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    <Loader2 size={32} className="mx-auto animate-spin mb-2 text-lime-400" />
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : games.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    <Gamepad2 size={48} className="mx-auto mb-3 opacity-20" />
                    ไม่พบข้อมูลเกมในระบบ
                  </td>
                </tr>
              ) : (
                games.map((game) => (
                  <tr key={game.id} className="hover:bg-[#202d21] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {game.coverImage ? (
                          <img src={game.coverImage} alt={game.title} className="w-16 h-12 rounded object-cover border border-[#2e3b2c]" />
                        ) : (
                          <div className="w-16 h-12 rounded bg-[#2e3b2c] flex items-center justify-center text-gray-500">
                            <Gamepad2 size={20} />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-white text-base leading-tight group-hover:text-lime-400 transition-colors">{game.title}</p>
                          {game.isFeatured && (
                            <span className="inline-block mt-1 text-[10px] uppercase font-black tracking-wider bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 hidden md:table-cell">
                      {game.category?.name || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-400 hidden lg:table-cell">
                      {game.developer || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm hidden xl:table-cell">
                      {new Date(game.publishedAt).toLocaleDateString('th-TH')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/games/edit/${game.id}`}
                          className="p-2 rounded-lg bg-[#2e3b2c] text-[#f7ebc6] hover:bg-lime-400 hover:text-[#1a241b] transition-all"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button 
                          onClick={() => setDeleteTarget({ id: game.id, title: game.title })}
                          className="p-2 rounded-lg bg-[#2e3b2c] text-red-400 hover:bg-red-500 hover:text-white transition-all"
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

        {!isLoading && totalPages > 1 && (
          <div className="p-4 border-t border-[#202d21] flex justify-center bg-[#1a241b]">
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded bg-[#2e3b2c] text-[#f7ebc6] disabled:opacity-50 hover:bg-[#3a4a37]"
              >
                &lt;
              </button>
              <span className="px-4 py-1.5 rounded bg-[#141c15] text-white border border-[#2e3b2c]">
                {currentPage} / {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded bg-[#2e3b2c] text-[#f7ebc6] disabled:opacity-50 hover:bg-[#3a4a37]"
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a241b] border border-[#2e3b2c] rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />
            <h3 className="text-2xl font-black text-white mb-2">ยืนยันการลบเกม</h3>
            <p className="text-gray-400 mb-6">
              คุณแน่ใจหรือไม่ที่จะลบเกม <span className="text-red-400 font-bold">"{deleteTarget.title}"</span> ?
              <br/>การกระทำนี้ไม่สามารถกู้คืนได้
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setDeleteTarget(null)}
                className="px-5 py-2.5 rounded-xl font-bold bg-[#2e3b2c] text-white hover:bg-[#3a4a37] transition-colors"
                disabled={isDeleting}
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center gap-2"
                disabled={isDeleting}
              >
                {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                ลบทิ้งถาวร
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
