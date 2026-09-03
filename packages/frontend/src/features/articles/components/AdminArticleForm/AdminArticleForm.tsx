"use client";

import React, { useState, useEffect } from 'react';
import { TipTapEditor } from './TipTapEditor';
import { articlesApi } from '../../articles.api';
import { categoriesApi, Category } from '../../../categories/categories.api';
import { CreateArticleDto } from '@shared/dto';
import { useRouter } from 'next/navigation';

export function AdminArticleForm({ 
  initialData, 
  articleId 
}: { 
  initialData?: Partial<import('../../articles.api').Article>, 
  articleId?: string 
} = {}) {
  const router = useRouter();
  const [formData, setFormData] = useState<Omit<CreateArticleDto, 'tags'>>({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    categoryId: initialData?.categoryId || '',
    coverImage: initialData?.coverImage || '',
  });
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    categoriesApi.getCategories()
      .then(setCategories)
      .catch(console.error);
  }, []);

  const handleMediaUpload = async (file: File) => {
    const res = await articlesApi.uploadMedia(file);
    return res.url;
  };

  const processTags = (tagsString: string) => {
    if (!tagsString) return [];
    return tagsString
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let finalCoverImage = formData.coverImage;
      if (coverFile) {
        finalCoverImage = await handleMediaUpload(coverFile);
      }

      const payload = {
        ...formData,
        ...(finalCoverImage ? { coverImage: finalCoverImage } : {}),
        tags: processTags(tagsInput),
      };

      if (articleId) {
        await articlesApi.updateArticle(articleId, payload);
        alert('อัปเดตบทความสำเร็จ!');
      } else {
        await articlesApi.createArticle(payload);
        alert('สร้างบทความสำเร็จ!');
      }

      router.push('/admin/articles'); // กลับไปหน้าจัดการ
    } catch (error) {
      alert('เกิดข้อผิดพลาด: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-4xl mx-auto bg-[#f7ebc6] p-8 rounded-3xl border border-[#d4c38d] shadow-[0_15px_40px_-10px_rgba(250,214,97,0.3)]">
      {/* Cover Image Upload */}
      <div className="flex flex-col gap-2">
        <label className="text-[#1a241b] font-black text-lg">รูปภาพปก (COVER IMAGE)</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
          className="text-sm text-[#1a241b] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#1a241b] file:text-[#f7ebc6] hover:file:bg-[#2e3b2c] cursor-pointer"
        />
        {(coverFile || formData.coverImage) && (
          <div className="w-full h-64 mt-2 rounded-xl border border-[#d4c38d] overflow-hidden bg-[#e8d7a5]">
            {coverFile ? (
              <img src={URL.createObjectURL(coverFile)} alt="Cover preview" className="w-full h-full object-cover" />
            ) : formData.coverImage ? (
              <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
            ) : null}
          </div>
        )}
      </div>

      {/* Title */}
      <div className="flex flex-col gap-2">
        <label className="text-[#1a241b] font-black text-lg">หัวข้อบทความ (TITLE)</label>
        <input 
          type="text" 
          placeholder="หัวข้อบทความ (Title)" 
          required
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="w-full p-4 rounded-xl bg-[#e8d7a5] border border-[#d4c38d] text-2xl font-bold text-[#1a241b] placeholder:text-[#8a7f5f] outline-none focus:border-[#1a241b] transition-colors"
        />
      </div>

      {/* Category & Excerpt */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col gap-2 w-full md:w-1/3">
          <label className="text-[#1a241b] font-black text-lg">หมวดหมู่ (CATEGORY)</label>
          <select 
            value={formData.categoryId || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
            className="w-full p-4 rounded-xl bg-[#e8d7a5] border border-[#d4c38d] text-[#1a241b] font-bold outline-none focus:border-[#1a241b] transition-colors appearance-none"
          >
            <option value="" disabled>เลือกหมวดหมู่</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon ? `${cat.icon} ` : ''}{cat.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex flex-col gap-2 w-full md:w-2/3">
          <label className="text-[#1a241b] font-black text-lg">คำโปรย (EXCERPT)</label>
          <input 
            type="text" 
            placeholder="คำโปรยย่อหน้าสั้นๆ (Excerpt)"
            required
            value={formData.excerpt}
            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
            className="w-full p-4 rounded-xl bg-[#e8d7a5] border border-[#d4c38d] text-[#1a241b] placeholder:text-[#8a7f5f] outline-none focus:border-[#1a241b] transition-colors"
          />
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-2">
        <label className="text-[#1a241b] font-black text-lg">แท็ก (TAGS)</label>
        <input 
          type="text" 
          placeholder="ใส่แท็กคั่นด้วยคอมม่า (เช่น esport, review, dota2)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="w-full p-4 rounded-xl bg-[#e8d7a5] border border-[#d4c38d] text-[#1a241b] placeholder:text-[#8a7f5f] outline-none focus:border-[#1a241b] transition-colors"
        />
      </div>

      {/* Content Editor */}
      <div className="flex flex-col gap-2">
        <label className="text-[#1a241b] font-black text-lg">เนื้อหา (CONTENT)</label>
        <TipTapEditor 
          content={formData.content} 
          onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
          onImageUpload={handleMediaUpload}
        />
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-[#1a241b] text-[#f7ebc6] font-black text-xl py-6 rounded-2xl hover:bg-[#2e3b2c] transition-colors disabled:opacity-50 mt-8"
      >
        {isLoading ? (articleId ? 'กำลังบันทึกการแก้ไข...' : 'กำลังสร้างบทความ...') : (articleId ? 'บันทึกการแก้ไขบทความ' : 'สร้างบทความใหม่')}
      </button>
    </form>
  );
}
