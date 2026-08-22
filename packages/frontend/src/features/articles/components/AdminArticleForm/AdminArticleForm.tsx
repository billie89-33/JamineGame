"use client";

import React, { useState } from 'react';
import { TipTapEditor } from './TipTapEditor';
import { articlesApi } from '../../articles.api';
import { CreateArticleDto } from '@shared/dto';
import { useRouter } from 'next/navigation';

export function AdminArticleForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateArticleDto>({
    title: '',
    excerpt: '',
    content: '',
    category: 'REVIEWS',
    tags: [],
    coverImage: '',
  });
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const handleImageUpload = async (file: File) => {
    const res = await articlesApi.uploadImage(file);
    return res.url;
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
      });

      alert('สร้างบทความสำเร็จ!');
      router.push('/dashboard/articles'); // หรือพากลับไปหน้าจัดการ
    } catch (error) {
      alert('เกิดข้อผิดพลาด: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Cover Image Upload */}
      <div className="flex flex-col gap-2">
        <label className="text-[#f7ebc6] font-bold">Cover Image</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
          className="text-sm text-[#f7ebc6] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#1a241b] file:text-lime-400 hover:file:bg-[#202d21]"
        />
        {(coverFile || formData.coverImage) && (
          <div className="w-full h-48 mt-2 rounded-xl border border-[#202d21] overflow-hidden bg-[#121813]">
            {coverFile ? (
              <img src={URL.createObjectURL(coverFile)} alt="Cover preview" className="w-full h-full object-cover" />
            ) : formData.coverImage ? (
              <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
            ) : null}
          </div>
        )}
      </div>

      {/* Title */}
      <input 
        type="text" 
        placeholder="หัวข้อบทความ (Title)" 
        required
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        className="w-full p-4 rounded-xl bg-[#121813] border border-[#202d21] text-2xl text-[#f7ebc6] placeholder:text-gray-600 outline-none focus:border-lime-400"
      />

      {/* Category & Excerpt */}
      <div className="flex flex-col md:flex-row gap-6">
        <select 
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          className="p-4 rounded-xl bg-[#121813] border border-[#202d21] text-[#f7ebc6] outline-none focus:border-lime-400"
        >
          <option value="REVIEWS">REVIEWS</option>
          <option value="ESPORTS">ESPORTS</option>
          <option value="HARDWARE">HARDWARE</option>
          <option value="INDIE">INDIE</option>
        </select>
        
        <input 
          type="text" 
          placeholder="คำโปรยย่อหน้าสั้นๆ (Excerpt)"
          required
          value={formData.excerpt}
          onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
          className="flex-1 p-4 rounded-xl bg-[#121813] border border-[#202d21] text-[#f7ebc6] outline-none focus:border-lime-400"
        />
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-2 p-4 rounded-xl bg-[#121813] border border-[#202d21]">
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map(tag => (
            <span key={tag} className="px-3 py-1 bg-[#1a241b] text-lime-400 rounded-full text-sm flex items-center gap-2">
              #{tag}
              <button type="button" onClick={() => removeTag(tag)} className="text-gray-400 hover:text-red-400">&times;</button>
            </span>
          ))}
        </div>
        <input 
          type="text" 
          placeholder="พิมพ์ Tag แล้วกด Enter..."
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagAdd}
          className="bg-transparent border-none outline-none text-[#f7ebc6] w-full"
        />
      </div>

      {/* Content Editor */}
      <div className="flex flex-col gap-2">
        <label className="text-[#f7ebc6] font-bold">เนื้อหาบทความ</label>
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
        className="w-full py-4 mt-4 bg-lime-400 text-[#0b0f0c] font-bold text-xl rounded-xl hover:bg-lime-500 transition-colors disabled:opacity-50"
      >
        {isLoading ? 'กำลังบันทึก...' : 'PUBLISH ARTICLE'}
      </button>
    </form>
  );
}
