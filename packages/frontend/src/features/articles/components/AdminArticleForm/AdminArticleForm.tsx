"use client";

import React, { useState } from 'react';
import { TipTapEditor } from './TipTapEditor';
import { articlesApi } from '../../articles.api';
import { CreateArticleDto } from '@shared/dto';
import { useRouter } from 'next/navigation';

export function AdminArticleForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<Omit<CreateArticleDto, 'tags'>>({
    title: '',
    excerpt: '',
    content: '',
    category: 'REVIEWS',
    coverImage: '',
  });
  const [tagsInput, setTagsInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const handleImageUpload = async (file: File) => {
    const res = await articlesApi.uploadImage(file);
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
        finalCoverImage = await handleImageUpload(coverFile);
      }

      await articlesApi.createArticle({
        ...formData,
        coverImage: finalCoverImage,
        tags: processTags(tagsInput),
      } as CreateArticleDto);

      alert('สร้างบทความสำเร็จ!');
      router.push('/dashboard/articles'); // หรือพากลับไปหน้าจัดการ
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
        <label className="text-[#1a241b] font-black text-lg">COVER IMAGE</label>
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
        <label className="text-[#1a241b] font-black text-lg">ARTICLE TITLE</label>
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
          <label className="text-[#1a241b] font-black text-lg">CATEGORY</label>
          <select 
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full p-4 rounded-xl bg-[#e8d7a5] border border-[#d4c38d] text-[#1a241b] font-bold outline-none focus:border-[#1a241b] transition-colors appearance-none"
          >
            <option value="REVIEWS">REVIEWS</option>
            <option value="ESPORTS">ESPORTS</option>
            <option value="HARDWARE">HARDWARE</option>
            <option value="INDIE">INDIE</option>
          </select>
        </div>
        
        <div className="flex flex-col gap-2 w-full md:w-2/3">
          <label className="text-[#1a241b] font-black text-lg">EXCERPT</label>
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
        <label className="text-[#1a241b] font-black text-lg">TAGS</label>
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
        <label className="text-[#1a241b] font-black text-lg">CONTENT</label>
        <TipTapEditor 
          content={formData.content} 
          onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
          onImageUpload={handleImageUpload}
        />
      </div>

      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full py-4 mt-6 bg-[#1a241b] text-[#f7ebc6] font-black text-xl rounded-xl hover:bg-[#2e3b2c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'PUBLISHING...' : 'PUBLISH ARTICLE'}
      </button>
    </form>
  );
}
