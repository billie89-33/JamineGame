/* eslint-disable */
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { articlesApi } from '@/features/articles/articles.api';
import { ArticleResponseDto } from '@shared/dto';
import { Plus, Edit2, Trash2, Search, AlertTriangle, X, Loader2 } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export default function AdminArticlesPage() {
  const { toast } = useToast();
  const [articles, setArticles] = useState<ArticleResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const limit = 10;

  const fetchArticles = async (page: number, search?: string) => {
    setIsLoading(true);
    try {
      const response = await articlesApi.getArticles(page, limit, search);
      setArticles(response.data || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch articles", error);
      toast.error("ไม่สามารถโหลดรายการบทความได้");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchArticles(currentPage, searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentPage, searchTerm]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await articlesApi.deleteArticle(deleteTarget.id);
      toast.success(`ลบบทความ "${deleteTarget.title}" สำเร็จเรียบร้อยแล้ว`);
      setDeleteTarget(null);
      fetchArticles(currentPage, searchTerm);
    } catch (error) {
      toast.error('เกิดข้อผิดพลาดในการลบบทความ: ' + (error as Error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#f7ebc6] p-6 rounded-2xl border border-[#d4c38d] shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-[#1a241b] tracking-wider">จัดการบทความ</h1>
          <p className="text-[#1a241b]/70 font-medium mt-1">จัดการเนื้อหาทั้งหมดของคุณ</p>
        </div>
        <Link 
          href="/admin/articles/create"
          className="flex items-center gap-2 bg-[#1a241b] text-[#f7ebc6] px-6 py-3 rounded-xl font-bold hover:bg-[#2e3b2c] transition-colors shadow-md"
        >
          <Plus size={20} />
          เขียนบทความใหม่
        </Link>
      </div>

      <div className="bg-[#f7ebc6] rounded-2xl border border-[#d4c38d] p-6 overflow-hidden">
        <div className="flex items-center gap-3 bg-[#e8d7a5] px-4 py-3 rounded-xl mb-6 border border-[#d4c38d]">
          <Search size={20} className="text-[#1a241b]/50" />
          <input 
            type="text" 
            placeholder="ค้นหาบทความ..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-transparent border-none outline-none text-[#1a241b] font-medium w-full placeholder:text-[#1a241b]/50"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12 font-bold text-[#1a241b] flex items-center justify-center gap-3">
            <Loader2 className="animate-spin" size={24} />
            <span>กำลังโหลดข้อมูลบทความ...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[#d4c38d] text-[#1a241b] text-sm tracking-wider">
                  <th className="pb-4 font-black">หัวข้อ</th>
                  <th className="pb-4 font-black">หมวดหมู่</th>
                  <th className="pb-4 font-black">ผู้เขียน</th>
                  <th className="pb-4 font-black">วันที่</th>
                  <th className="pb-4 font-black text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {articles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center font-medium text-[#1a241b]/60">
                      {searchTerm ? 'ไม่พบบทความที่ตรงกับคำค้นหา' : 'ยังไม่มีบทความ เริ่มเขียนกันเลย!'}
                    </td>
                  </tr>
                ) : (
                  articles.map((article) => (
                    <tr key={article.id} className="border-b border-[#d4c38d] last:border-0 hover:bg-[#e8d7a5]/50 transition-colors">
                      <td className="py-4">
                        <p className="font-bold text-[#1a241b]">{article.title}</p>
                      </td>
                      <td className="py-4">
                        <span className="bg-[#1a241b] text-[#f7ebc6] px-3 py-1 rounded-full text-xs font-bold">
                          {article.category?.name || 'ไม่มีหมวดหมู่'}
                        </span>
                      </td>
                      <td className="py-4 font-medium text-[#1a241b]">{article.author?.username || 'ไม่ระบุ'}</td>
                      <td className="py-4 text-[#1a241b]/80 text-sm">
                        {new Date(article.createdAt).toLocaleDateString('th-TH')}
                      </td>
                      <td className="py-4">
                        <div className="flex justify-end gap-2">
                          <Link 
                            href={`/admin/articles/edit/${article.id}`}
                            className="p-2 rounded-lg bg-[#e8d7a5] text-[#1a241b] hover:bg-[#d4c38d] transition-colors" 
                            title="แก้ไข"
                          >
                            <Edit2 size={16} />
                          </Link>
                          <button 
                            onClick={() => setDeleteTarget({ id: article.id, title: article.title })}
                            className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors cursor-pointer" 
                            title="ลบ"
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
              หน้า {currentPage} จาก {totalPages}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-[#e8d7a5] text-[#1a241b] font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d4c38d] transition-colors cursor-pointer"
              >
                ก่อนหน้า
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-[#e8d7a5] text-[#1a241b] font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d4c38d] transition-colors cursor-pointer"
              >
                ถัดไป
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#f7ebc6] border border-[#d4c38d] shadow-2xl rounded-3xl p-6 md:p-8 max-w-md w-full relative">
            <button 
              onClick={() => !isDeleting && setDeleteTarget(null)}
              className="absolute top-6 right-6 text-[#1a241b]/60 hover:text-[#1a241b] p-1 rounded-lg"
              disabled={isDeleting}
            >
              <X size={20} />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertTriangle size={28} />
            </div>

            <h3 className="text-2xl font-black text-[#1a241b] mb-2">ยืนยันการลบบทความ</h3>
            <p className="text-[#5d6b5e] font-medium mb-6">
              คุณแน่ใจหรือไม่ว่าต้องการลบบทความ <span className="font-bold text-[#1a241b]">"{deleteTarget.title}"</span>? การกระทำนี้ไม่สามารถย้อนกลับได้
            </p>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl font-bold bg-[#e8d7a5] hover:bg-[#d4c38d] text-[#1a241b] transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isDeleting && <Loader2 size={16} className="animate-spin" />}
                {isDeleting ? 'กำลังลบ...' : 'ยืนยันการลบ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
