"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { articlesApi } from '@/features/articles/articles.api';
import { ArticleResponseDto, ArticleType } from '@shared/dto';
import { Plus, Edit2, Trash2, Search, FileText, Loader2, Gamepad2 } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export default function AdminArticlesPage() {
  const { toast } = useToast();
  const [articles, setArticles] = useState<ArticleResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<ArticleType | 'ALL'>('ALL');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const limit = 10;

  const fetchArticles = async (page: number, search?: string, type?: string) => {
    setIsLoading(true);
    try {
      const typeParam = type === 'ALL' ? undefined : (type as any);
      const response = await articlesApi.getArticles(page, limit, search, undefined, undefined, typeParam);
      setArticles(response.data || []);
      setTotalPages(response.meta?.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch articles", error);
      toast.error("ไม่สามารถโหลดบทความได้");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchArticles(currentPage, searchTerm, activeTab);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentPage, searchTerm, activeTab]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await articlesApi.deleteArticle(deleteTarget.id);
      toast.success(`ลบบทความ "${deleteTarget.title}" สำเร็จเรียบร้อยแล้ว`);
      setDeleteTarget(null);
      fetchArticles(currentPage, searchTerm, activeTab);
    } catch (error: any) {
      toast.error('เกิดข้อผิดพลาดในการลบบทความ: ' + (error as Error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  const tabs = [
    { id: 'ALL', label: 'ข่าวและบทความทั้งหมด' },
    { id: 'NEWS', label: 'ข่าวรายวัน' },
    { id: 'REVIEW', label: 'รีวิวเกม' },
    { id: 'GUIDE', label: 'เทคนิค/ไกด์' },
    { id: 'FEATURE', label: 'บทความพิเศษ' },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'NEWS': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'REVIEW': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'GUIDE': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'FEATURE': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#f7ebc6] flex items-center gap-3">
            <FileText size={32} className="text-lime-400" />
            จัดการข่าวและบทความ
          </h1>
          <p className="text-gray-400 mt-1">จัดการคอนเทนต์ ข่าวสาร รีวิว และบทความต่างๆ</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start">
          <Link 
            href="/admin/articles/create?type=NEWS" 
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500 hover:text-white font-bold transition-all whitespace-nowrap text-sm"
          >
            <Plus size={16} /> เขียนข่าวเกม
          </Link>
          <Link 
            href="/admin/articles/create?type=REVIEW" 
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-white font-bold transition-all whitespace-nowrap text-sm"
          >
            <Plus size={16} /> เขียนรีวิวเกม
          </Link>
          <Link 
            href="/admin/articles/create?type=GUIDE" 
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white font-bold transition-all whitespace-nowrap text-sm"
          >
            <Plus size={16} /> เขียนไกด์/เทคนิค
          </Link>
          <Link 
            href="/admin/articles/create?type=FEATURE" 
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500 hover:text-white font-bold transition-all whitespace-nowrap text-sm"
          >
            <Plus size={16} /> บทความพิเศษ
          </Link>
        </div>
      </div>

      <div className="bg-[#141c15] border border-[#202d21] rounded-2xl overflow-hidden shadow-xl flex flex-col">
        <div className="p-4 border-b border-[#202d21] flex flex-col md:flex-row items-center gap-4 bg-[#1a241b]">
          <div className="flex overflow-x-auto w-full md:w-auto hide-scrollbar gap-2 pb-2 md:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id 
                    ? 'bg-lime-400 text-[#1a241b]' 
                    : 'bg-[#2e3b2c] text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64 md:ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="ค้นหาหัวข้อ..." 
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
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#1a241b] text-[#f7ebc6] text-sm uppercase tracking-wider border-b border-[#2e3b2c]">
                <th className="px-6 py-4 font-bold">หัวข้อบทความ</th>
                <th className="px-6 py-4 font-bold">ประเภท</th>
                <th className="px-6 py-4 font-bold">เกมที่เกี่ยวข้อง</th>
                <th className="px-6 py-4 font-bold">วันที่อัปเดต</th>
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
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    <FileText size={48} className="mx-auto mb-3 opacity-20" />
                    ไม่พบบทความในหมวดหมู่นี้
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article.id} className="hover:bg-[#202d21] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {article.coverImage ? (
                          <img src={article.coverImage} alt={article.title} className="w-16 h-12 rounded object-cover border border-[#2e3b2c]" />
                        ) : (
                          <div className="w-16 h-12 rounded bg-[#2e3b2c] flex items-center justify-center text-gray-500">
                            <FileText size={20} />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-white text-base leading-tight group-hover:text-lime-400 transition-colors line-clamp-1 max-w-[300px]">
                            {article.title}
                          </p>
                          {article.isFeatured && (
                            <span className="inline-block mt-1 text-[10px] uppercase font-black tracking-wider bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[11px] px-2 py-1 rounded-md font-bold border ${getTypeColor(article.articleType)}`}>
                        {article.articleType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {article.game ? (
                         <div className="flex items-center gap-2">
                           <Gamepad2 size={14} className="text-lime-400" />
                           <span className="line-clamp-1 max-w-[150px]">{article.game.title}</span>
                         </div>
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(article.updatedAt).toLocaleDateString('th-TH')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/articles/edit/${article.id}`}
                          className="p-2 rounded-lg bg-[#2e3b2c] text-[#f7ebc6] hover:bg-lime-400 hover:text-[#1a241b] transition-all"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button 
                          onClick={() => setDeleteTarget({ id: article.id, title: article.title })}
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
            <h3 className="text-2xl font-black text-white mb-2">ยืนยันการลบ</h3>
            <p className="text-gray-400 mb-6">
              คุณแน่ใจหรือไม่ที่จะลบบทความ <span className="text-red-400 font-bold">"{deleteTarget.title}"</span> ?
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
