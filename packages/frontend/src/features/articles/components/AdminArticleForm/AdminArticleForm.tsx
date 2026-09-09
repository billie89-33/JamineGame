"use client";

import React, { useState, useEffect } from 'react';
import { TipTapEditor } from './TipTapEditor';
import { articlesApi } from '../../articles.api';
import { categoriesApi, Category } from '../../../categories/categories.api';
import { CreateArticleDto } from '@shared/dto';
import { useRouter } from 'next/navigation';
import { X, Video, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export function AdminArticleForm({ 
  initialData, 
  articleId 
}: { 
  initialData?: Partial<import('../../articles.api').Article>, 
  articleId?: string 
} = {}) {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Omit<CreateArticleDto, 'tags'>>({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    categoryId: initialData?.categoryId || '',
    coverImage: initialData?.coverImage || '',
    heroImage: initialData?.heroImage || '',
    videoUrl: initialData?.videoUrl || '',
    isFeatured: initialData?.isFeatured || false,
    articleType: initialData?.articleType || ('NEWS' as any),
  });
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
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

  const handleRemoveCover = () => {
    setCoverFile(null);
    setFormData(prev => ({ ...prev, coverImage: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.warning('กรุณากรอกหัวข้อบทความให้เรียบร้อย');
      return;
    }

    if (!formData.categoryId) {
      toast.warning('กรุณาเลือกหมวดหมู่ให้เรียบร้อย');
      return;
    }

    const processedTags = processTags(tagsInput);
    if (processedTags.length === 0) {
      toast.warning('กรุณาใส่แท็กอย่างน้อย 1 แท็ก (เช่น news, update)');
      return;
    }

    if (!formData.content || formData.content === '<p></p>') {
      toast.warning('กรุณาเขียนเนื้อหาบทความ');
      return;
    }

    try {
      setIsLoading(true);
      let finalCoverImage = formData.coverImage;
      let finalHeroImage = formData.heroImage;
      
      if (coverFile) {
        finalCoverImage = await handleMediaUpload(coverFile);
      }
      if (heroFile) {
        finalHeroImage = await handleMediaUpload(heroFile);
      }

      if (false) {
        finalCoverImage = await handleMediaUpload(coverFile);
      }

      const payload: Partial<CreateArticleDto> = {
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content,
        tags: processedTags,
        isFeatured: formData.isFeatured,
        articleType: formData.articleType,
      };

      if (formData.categoryId) {
        payload.categoryId = formData.categoryId;
      }

      if (finalCoverImage) {
        payload.coverImage = finalCoverImage;
      }
      if (finalHeroImage) {
        payload.heroImage = finalHeroImage;
      }
      if (false) {
        payload.coverImage = finalCoverImage;
      }

      if (formData.videoUrl) {
        payload.videoUrl = formData.videoUrl;
      }

      if (articleId) {
        await articlesApi.updateArticle(articleId, payload);
        toast.success('อัปเดตบทความเรียบร้อยแล้ว!');
        router.push('/admin/articles');
        router.refresh();
      } else {
        await articlesApi.createArticle(payload as CreateArticleDto);
        toast.success('สร้างบทความใหม่เรียบร้อยแล้ว!');
        router.push('/admin/articles');
        router.refresh();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-4xl mx-auto bg-[#f7ebc6] p-8 rounded-3xl border border-[#d4c38d] shadow-[0_15px_40px_-10px_rgba(250,214,97,0.3)]">
      {/* Article Type Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-[#1a241b] font-black text-lg">ประเภท (TYPE) *</label>
        <div className="flex gap-4">
          <label className={`flex items-center gap-2 cursor-pointer p-4 rounded-xl border-2 transition-all ${formData.articleType === 'NEWS' ? 'border-[#1a241b] bg-[#1a241b] text-[#f7ebc6]' : 'border-[#d4c38d] bg-[#e8d7a5] text-[#1a241b] hover:border-[#1a241b]'}`}>
            <input type="radio" name="articleType" className="hidden" value="NEWS" checked={formData.articleType === 'NEWS'} onChange={(e) => setFormData(prev => ({ ...prev, articleType: 'NEWS' as any }))} />
            <span className="font-bold">📰 ข่าวทั่วไป (News)</span>
          </label>
          <label className={`flex items-center gap-2 cursor-pointer p-4 rounded-xl border-2 transition-all ${formData.articleType === 'GAME' ? 'border-[#1a241b] bg-[#1a241b] text-[#f7ebc6]' : 'border-[#d4c38d] bg-[#e8d7a5] text-[#1a241b] hover:border-[#1a241b]'}`}>
            <input type="radio" name="articleType" className="hidden" value="GAME" checked={formData.articleType === 'GAME'} onChange={(e) => setFormData(prev => ({ ...prev, articleType: 'GAME' as any }))} />
            <span className="font-bold">🎮 ข้อมูลเกม (Game Database)</span>
          </label>
        </div>
      </div>

      {/* Cover Image Upload */}
      <div className="flex flex-col gap-2">
        <label className="text-[#1a241b] font-black text-lg flex items-center gap-2">
          <ImageIcon size={20} />
          รูปภาพปก (COVER IMAGE)
        </label>
        <div className="flex items-center gap-4">
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            className="text-sm text-[#1a241b] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#1a241b] file:text-[#f7ebc6] hover:file:bg-[#2e3b2c] cursor-pointer"
          />
          {(coverFile || formData.coverImage) && (
            <button
              type="button"
              onClick={handleRemoveCover}
              className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 hover:bg-red-200 px-3 py-2 rounded-lg transition-colors"
            >
              <X size={14} />
              ลบรูปปก
            </button>
          )}
        </div>
        {(coverFile || formData.coverImage) && (
          <div className="w-full h-64 mt-2 rounded-xl border border-[#d4c38d] overflow-hidden bg-[#e8d7a5] relative">
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
        <label className="text-[#1a241b] font-black text-lg">หัวข้อบทความ (TITLE) *</label>
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
          <label className="text-[#1a241b] font-black text-lg">หมวดหมู่ (CATEGORY) *</label>
          <select 
            required
            value={formData.categoryId || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
            className="w-full p-4 rounded-xl bg-[#e8d7a5] border border-[#d4c38d] text-[#1a241b] font-bold outline-none focus:border-[#1a241b] transition-colors appearance-none"
          >
            <option value="" disabled>-- เลือกหมวดหมู่ --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon ? `${cat.icon} ` : ''}{cat.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex flex-col gap-2 w-full md:w-2/3">
          <label className="text-[#1a241b] font-black text-lg">คำโปรย (EXCERPT) *</label>
          <input 
            type="text" 
            placeholder="คำโปรยย่อหน้าสั้นๆ สำหรับแสดงในการ์ดบทความ" 
            required
            value={formData.excerpt}
            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
            className="w-full p-4 rounded-xl bg-[#e8d7a5] border border-[#d4c38d] text-[#1a241b] placeholder:text-[#8a7f5f] outline-none focus:border-[#1a241b] transition-colors font-medium"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4 rounded-xl border border-[#B05B27] bg-[#f7ebc6] shadow-sm">
        <label className="flex items-center gap-3 text-[#1a241b] font-black text-lg cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isFeatured || false}
            onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))}
            className="h-6 w-6 accent-[#B05B27]"
          />
          🔥 นำไปแสดงหน้าแรก (Featured Hero Banner)
        </label>
        
        {formData.isFeatured && (
          <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-[#d4c38d]">
            <label className="text-[#1a241b] font-bold text-sm flex items-center gap-2">
              <ImageIcon size={16} />
              ภาพแบนเนอร์หน้าแรก (Hero Image)
            </label>
            <p className="text-xs text-[#5d6b5e] mb-2">
              ภาพแนวนอน (สัดส่วน 16:9) เพื่อความสวยงามสูงสุด หากไม่ใส่ระบบจะใช้ภาพปกแทน
            </p>
            <div className="flex items-center gap-4">
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setHeroFile(e.target.files?.[0] || null)}
                className="text-sm text-[#1a241b] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#B05B27] file:text-[#f7ebc6] hover:file:bg-[#8a451d] cursor-pointer"
              />
              {(heroFile || formData.heroImage) && (
                <button
                  type="button"
                  onClick={() => { setHeroFile(null); setFormData(prev => ({ ...prev, heroImage: '' })) }}
                  className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 hover:bg-red-200 px-3 py-2 rounded-lg transition-colors"
                >
                  <X size={14} /> ลบรูปแบนเนอร์
                </button>
              )}
            </div>
            {(heroFile || formData.heroImage) && (
              <div className="w-full aspect-video mt-2 rounded-xl border border-[#d4c38d] overflow-hidden bg-[#e8d7a5] relative">
                {heroFile ? (
                  <img src={URL.createObjectURL(heroFile)} alt="Hero preview" className="w-full h-full object-cover" />
                ) : formData.heroImage ? (
                  <img src={formData.heroImage} alt="Hero" className="w-full h-full object-cover" />
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Video URL (Optional) & Tags */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <label className="text-[#1a241b] font-black text-lg flex items-center gap-2">
            <Video size={20} />
            ลิงก์วิดีโอ (YOUTUBE / VIDEO URL)
          </label>
          <input 
            type="url" 
            placeholder="เช่น https://www.youtube.com/watch?v=... (ไม่บังคับ)" 
            value={formData.videoUrl || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
            className="w-full p-4 rounded-xl bg-[#e8d7a5] border border-[#d4c38d] text-[#1a241b] placeholder:text-[#8a7f5f] outline-none focus:border-[#1a241b] transition-colors font-medium"
          />
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/2">
          <label className="text-[#1a241b] font-black text-lg">แท็ก (TAGS) *</label>
          <input 
            type="text" 
            placeholder="ใส่แท็กคั่นด้วยคอมม่า เช่น news, review, rpg (จำเป็น)" 
            required
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="w-full p-4 rounded-xl bg-[#e8d7a5] border border-[#d4c38d] text-[#1a241b] placeholder:text-[#8a7f5f] outline-none focus:border-[#1a241b] transition-colors font-medium"
          />
        </div>
      </div>

      {/* Content Editor */}
      <div className="flex flex-col gap-2">
        <label className="text-[#1a241b] font-black text-lg flex items-center gap-2">
          <Sparkles size={20} />
          เนื้อหาบทความ (CONTENT) *
        </label>
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
        className="w-full bg-[#1a241b] text-[#f7ebc6] font-black text-xl py-6 rounded-2xl hover:bg-[#2e3b2c] transition-colors disabled:opacity-50 mt-8 shadow-lg cursor-pointer flex items-center justify-center gap-2"
      >
        {isLoading && <Loader2 size={24} className="animate-spin text-lime-400" />}
        {isLoading ? (articleId ? 'กำลังบันทึกการแก้ไข...' : 'กำลังสร้างบทความ...') : (articleId ? 'บันทึกการแก้ไขบทความ' : 'สร้างบทความใหม่')}
      </button>
    </form>
  );
}
