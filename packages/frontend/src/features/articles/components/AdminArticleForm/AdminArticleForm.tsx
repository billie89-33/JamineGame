"use client";

import React, { useState, useEffect } from 'react';
import { TipTapEditor } from './TipTapEditor';
import { articlesApi } from '../../articles.api';
import { categoriesApi, Category } from '../../../categories/categories.api';
import { gamesApi } from '../../../games/games.api';
import { CreateArticleDto, ArticleType, GameResponseDto } from '@shared/dto';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, Video, Image as ImageIcon, Sparkles, Loader2, Gamepad2 } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export function AdminArticleForm({ 
  initialData, 
  articleId 
}: { 
  initialData?: Partial<import('../../articles.api').Article> & { gameId?: string }, 
  articleId?: string 
} = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTypeParam = searchParams.get('type') as ArticleType | null;
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Omit<CreateArticleDto, 'tags'>>({
    title: initialData?.title || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    categoryId: initialData?.categoryId || '',
    gameId: initialData?.gameId || '',
    coverImage: initialData?.coverImage || '',
    heroImage: initialData?.heroImage || '',
    videoUrl: initialData?.videoUrl || '',
    isFeatured: initialData?.isFeatured || false,
    articleType: initialData?.articleType || defaultTypeParam || ArticleType.NEWS,
  });
  
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [games, setGames] = useState<GameResponseDto[]>([]);

  useEffect(() => {
    categoriesApi.getCategories().then(setCategories).catch(console.error);
    gamesApi.getGames(1, 100).then(res => setGames(res.data)).catch(console.error);
  }, []);

  const handleMediaUpload = async (file: File) => {
    const res = await articlesApi.uploadMedia(file);
    return res.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('กรุณากรอกหัวข้อและเนื้อหา');
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

      const payload: Partial<CreateArticleDto> = {
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content,
        categoryId: formData.categoryId || undefined,
        gameId: formData.gameId || undefined,
        coverImage: finalCoverImage,
        heroImage: finalHeroImage,
        videoUrl: formData.videoUrl,
        isFeatured: formData.isFeatured,
        articleType: formData.articleType,
        tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean)
      };

      if (articleId) {
        await articlesApi.updateArticle(articleId, payload);
        toast.success('อัปเดตบทความสำเร็จ');
      } else {
        await articlesApi.createArticle(payload as CreateArticleDto);
        toast.success('สร้างบทความสำเร็จ');
      }
      
      router.push('/admin/articles');
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto w-full pb-20">
      
      {/* 🟢 คอลัมน์ซ้าย: ข้อมูลหลักและเนื้อหา */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* ส่วนอารัมภบท */}
        <div className="bg-[#141c15] border border-[#202d21] rounded-2xl p-6 md:p-8 shadow-xl">
          <h3 className="text-xl font-bold text-[#f7ebc6] mb-6 border-b border-[#202d21] pb-4">ข้อมูลส่วนอารัมภบท</h3>
          
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-3">ประเภทของบทความ (Type)</label>
              <div className="flex flex-wrap gap-4">
                {[
                  { value: ArticleType.NEWS, label: '📰 ข่าวอัปเดต (News)' },
                  { value: ArticleType.REVIEW, label: '🎯 รีวิวเกม (Review)' },
                  { value: ArticleType.GUIDE, label: '💡 เทคนิค/บทสรุป (Guide)' },
                  { value: ArticleType.FEATURE, label: '✨ บทความพิเศษ (Feature)' }
                ].map((type) => (
                  <label key={type.value} className={`flex items-center gap-2 px-4 py-3 rounded-xl border cursor-pointer transition-all ${formData.articleType === type.value ? 'bg-lime-500/10 border-lime-400 text-lime-400 font-bold' : 'bg-[#1a241b] border-[#2e3b2c] text-gray-400 hover:border-gray-500'}`}>
                    <input
                      type="radio"
                      name="articleType"
                      value={type.value}
                      checked={formData.articleType === type.value}
                      onChange={e => setFormData(prev => ({ ...prev, articleType: e.target.value as ArticleType }))}
                      className="accent-lime-400 w-4 h-4"
                    />
                    {type.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-2 flex items-center gap-1">
                <Gamepad2 size={16} /> เกมที่เกี่ยวข้อง (Related Game) - ตัวเลือกเสริม
              </label>
              <select
                value={formData.gameId}
                onChange={e => setFormData(prev => ({ ...prev, gameId: e.target.value }))}
                className="w-full bg-[#1a241b] border border-[#2e3b2c] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-400"
              >
                <option value="">-- ไม่ระบุเกม --</option>
                {games.map(g => (
                  <option key={g.id} value={g.id}>{g.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ส่วนเนื้อหาหลัก */}
        <div className="bg-[#141c15] border border-[#202d21] rounded-2xl p-6 md:p-8 shadow-xl flex flex-col gap-6">
          <h3 className="text-xl font-bold text-[#f7ebc6] border-b border-[#202d21] pb-4">ข้อมูลเนื้อหา</h3>
          
          <div>
            <label className="text-gray-400 font-bold text-sm mb-2 block">ชื่อหัวข้อ (Title) *</label>
            <input 
              type="text" 
              placeholder="หัวข้อบทความ..." 
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-4 rounded-xl bg-[#1a241b] border border-[#2e3b2c] text-2xl font-bold text-white placeholder:text-gray-600 outline-none focus:border-lime-400 transition-colors"
            />
          </div>

          <div>
            <label className="text-gray-400 font-bold text-sm mb-2 block">คำโปรย (Excerpt) *</label>
            <input 
              type="text" 
              placeholder="คำโปรยสั้นๆ..." 
              required
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              className="w-full p-4 rounded-xl bg-[#1a241b] border border-[#2e3b2c] text-white placeholder:text-gray-600 outline-none focus:border-lime-400 transition-colors font-medium"
            />
          </div>

          <div>
            <label className="text-gray-400 font-bold text-sm mb-2 flex items-center gap-2">
              <Sparkles size={16} /> เนื้อหา (CONTENT) *
            </label>
            <div className="bg-[#1a241b] border border-[#2e3b2c] rounded-2xl overflow-hidden">
              <TipTapEditor 
                content={formData.content} 
                onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
                onImageUpload={handleMediaUpload}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 🔴 คอลัมน์ขวา: แผงตั้งค่าด้านขวา */}
      <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
        
        {/* ปุ่ม Submit */}
        <div className="bg-[#141c15] border border-[#202d21] rounded-2xl p-6 shadow-xl">
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 rounded-xl font-bold text-lg text-[#1a241b] bg-lime-400 hover:bg-lime-500 transition-all flex items-center justify-center gap-2 mb-4 disabled:opacity-50 shadow-[0_0_20px_rgba(163,230,53,0.2)]"
          >
            {isLoading && <Loader2 size={24} className="animate-spin" />}
            {isLoading ? 'กำลังบันทึก...' : (articleId ? 'อัปเดตบทความ' : 'บันทึกและเผยแพร่')}
          </button>
          
          <label className="flex items-center gap-3 p-4 bg-[#1a241b] rounded-xl border border-[#2e3b2c] cursor-pointer hover:border-lime-400 transition-colors">
            <input
              type="checkbox"
              checked={formData.isFeatured || false}
              onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))}
              className="w-5 h-5 accent-lime-400"
            />
            <span className="text-[#f7ebc6] font-bold flex items-center gap-2">
              <Sparkles size={18} className="text-amber-400" />
              แนะนำ (Featured)
            </span>
          </label>
        </div>

        {/* หมวดหมู่ */}
        <div className="bg-[#141c15] border border-[#202d21] rounded-2xl p-6 shadow-xl">
          <h3 className="font-bold text-[#f7ebc6] mb-4">หมวดหมู่ (Category) *</h3>
          <select 
            required
            value={formData.categoryId || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
            className="w-full bg-[#1a241b] border border-[#2e3b2c] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-400"
          >
            <option value="" disabled>-- เลือกหมวดหมู่ --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon ? `${cat.icon} ` : ''}{cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* รูปหน้าปก */}
        <div className="bg-[#141c15] border border-[#202d21] rounded-2xl p-6 shadow-xl">
          <h3 className="font-bold text-[#f7ebc6] mb-4 flex items-center gap-2">
            <ImageIcon size={18} /> รูปหน้าปก (Cover)
          </h3>
          <input
            type="file"
            accept="image/*"
            onChange={e => setCoverFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#2e3b2c] file:text-[#f7ebc6] hover:file:bg-[#3a4a37] cursor-pointer mb-4"
          />
          {(coverFile || formData.coverImage) && (
            <div className="aspect-video rounded-xl bg-[#1a241b] border border-[#2e3b2c] overflow-hidden relative">
              <img 
                src={coverFile ? URL.createObjectURL(coverFile) : formData.coverImage} 
                alt="Cover preview" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* แท็ก */}
        <div className="bg-[#141c15] border border-[#202d21] rounded-2xl p-6 shadow-xl">
          <h3 className="font-bold text-[#f7ebc6] mb-4">แท็ก (Tags) *</h3>
          <input 
            type="text" 
            placeholder="news, review (คั่นด้วย ,)" 
            required
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="w-full bg-[#1a241b] border border-[#2e3b2c] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-400 placeholder:text-gray-600"
          />
        </div>

        {/* วิดีโอ (ถ้ามี) */}
        <div className="bg-[#141c15] border border-[#202d21] rounded-2xl p-6 shadow-xl">
          <h3 className="font-bold text-[#f7ebc6] mb-4 flex items-center gap-2">
            <Video size={18} /> วิดีโอ (YouTube URL)
          </h3>
          <input
            type="text"
            value={formData.videoUrl || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full bg-[#1a241b] border border-[#2e3b2c] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-400"
          />
        </div>

      </div>
    </form>
  );
}

