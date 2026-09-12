"use client";

import React, { useState, useEffect } from 'react';
import { TipTapEditor } from '@/features/articles/components/AdminArticleForm/TipTapEditor';
import { gamesApi } from '../../games.api';
import { articlesApi } from '@/features/articles/articles.api'; // for uploadMedia
import { categoriesApi, Category } from '../../../categories/categories.api';
import { CreateGameDto, GameResponseDto } from '@shared/dto';
import { useRouter } from 'next/navigation';
import { Video, Image as ImageIcon, Sparkles, Loader2, Gamepad2, Monitor, Download, Calendar } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DEFAULT_SYS_REQ = `**แนะนำ (Recommended):**\n`;

export function AdminGameForm({ 
  initialData, 
  gameId 
}: { 
  initialData?: Partial<GameResponseDto>, 
  gameId?: string 
} = {}) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<Omit<CreateGameDto, 'tags' | 'platforms'>>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    categoryId: initialData?.categoryId || '',
    coverImage: initialData?.coverImage || '',
    videoUrl: initialData?.videoUrl || '',
    developer: initialData?.developer || '',
    publisher: initialData?.publisher || '',
    releaseDate: initialData?.releaseDate ? new Date(initialData.releaseDate).toISOString().split('T')[0] : '',
    downloadLinks: initialData?.downloadLinks || '',
    systemRequirements: initialData?.systemRequirements || DEFAULT_SYS_REQ,
    rating: initialData?.rating || undefined,
    isFeatured: initialData?.isFeatured || false,
  });
  
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') || '');
  const [platformsInput, setPlatformsInput] = useState(initialData?.platforms?.join(', ') || '');
  
  const [isLoading, setIsLoading] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    categoriesApi.getCategories()
      .then(setCategories)
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleMediaUpload = async (file: File) => {
    const res = await articlesApi.uploadMedia(file);
    return res.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('กรุณากรอกชื่อเกมและเนื้อหา');
      return;
    }

    setIsLoading(true);
    try {
      let finalCoverImage = formData.coverImage;

      if (coverFile) {
        finalCoverImage = await handleMediaUpload(coverFile);
      }

      const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
      const platforms = platformsInput.split(',').map(p => p.trim()).filter(Boolean);

      const payload: CreateGameDto = {
        ...formData,
        coverImage: finalCoverImage,
        releaseDate: formData.releaseDate ? new Date(formData.releaseDate) : undefined,
        tags,
        platforms,
        systemRequirements: formData.systemRequirements,
        categoryId: formData.categoryId || undefined,
        rating: formData.rating ? Number(formData.rating) : undefined,
      };

      if (gameId) {
        await gamesApi.updateGame(gameId, payload);
        toast.success('อัปเดตข้อมูลเกมเรียบร้อยแล้ว');
      } else {
        await gamesApi.createGame(payload);
        toast.success('สร้างข้อมูลเกมใหม่เรียบร้อยแล้ว');
      }
      
      router.push('/admin/games');
      router.refresh();
    } catch (error: unknown) {
      console.error(error);
      const err = error as { message?: string };
      toast.error(err?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
      <div className="flex-1 flex flex-col gap-6">
        <div className="bg-[#141c15] border border-[#202d21] rounded-2xl p-6 md:p-8 shadow-xl">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="ชื่อเกม (Game Title)"
            className="w-full text-3xl md:text-5xl font-black bg-transparent border-none text-white focus:outline-none placeholder-gray-600 mb-4"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="คำอธิบายสั้นๆ (Short Description)"
            rows={2}
            className="w-full text-lg bg-transparent border-none text-gray-300 focus:outline-none placeholder-gray-700 resize-none"
          />
        </div>

        <div className="bg-[#141c15] border border-[#202d21] rounded-2xl p-6 md:p-8 shadow-xl">
           <h3 className="text-xl font-bold text-[#f7ebc6] mb-4 border-b border-[#202d21] pb-2">ข้อมูลจำเพาะ (Game Details)</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">ผู้พัฒนา (Developer)</label>
                <input type="text" name="developer" value={formData.developer} onChange={handleChange} className="w-full bg-[#1a241b] border border-[#2e3b2c] rounded-xl px-4 py-3 text-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">ผู้จัดจำหน่าย (Publisher)</label>
                <input type="text" name="publisher" value={formData.publisher} onChange={handleChange} className="w-full bg-[#1a241b] border border-[#2e3b2c] rounded-xl px-4 py-3 text-white" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1 flex items-center gap-1"><Calendar size={14}/> วันวางจำหน่าย (Release Date)</label>
                <div className="w-full">
                  <DatePicker
                    selected={formData.releaseDate ? new Date(formData.releaseDate) : null}
                    onChange={(date: Date | null) => {
                      setFormData(prev => ({
                        ...prev,
                        releaseDate: date ? date.toISOString().split('T')[0] : ''
                      }));
                    }}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="วัน/เดือน/ปี"
                    className="w-full bg-[#1a241b] border border-[#2e3b2c] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-400"
                    wrapperClassName="w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1">คะแนน (Rating /10)</label>
                <input type="number" step="0.1" min="0" max="10" name="rating" value={formData.rating || ''} onChange={handleChange} className="w-full bg-[#1a241b] border border-[#2e3b2c] rounded-xl px-4 py-3 text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-400 mb-1 flex items-center gap-1"><Monitor size={14}/> แพลตฟอร์ม (คั่นด้วยลูกน้ำ)</label>
                <input type="text" value={platformsInput} onChange={e => setPlatformsInput(e.target.value)} placeholder="PC, PS5, Xbox Series X, Switch" className="w-full bg-[#1a241b] border border-[#2e3b2c] rounded-xl px-4 py-3 text-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-400 mb-1 flex items-center gap-1"><Download size={14}/> ลิงก์ดาวน์โหลด (Download Links)</label>
                <input type="text" name="downloadLinks" value={formData.downloadLinks} onChange={handleChange} placeholder="https://store.steampowered.com/..." className="w-full bg-[#1a241b] border border-[#2e3b2c] rounded-xl px-4 py-3 text-white" />
              </div>
           </div>
        </div>

        <div className="bg-[#141c15] border border-[#202d21] rounded-2xl overflow-hidden shadow-xl">
          <TipTapEditor 
            content={formData.content} 
            onChange={(html) => setFormData(prev => ({ ...prev, content: html }))}
          />
        </div>
        
        <div className="bg-[#141c15] border border-[#202d21] rounded-2xl p-6 md:p-8 shadow-xl">
           <h3 className="text-xl font-bold text-[#f7ebc6] mb-4 border-b border-[#202d21] pb-2">ความต้องการระบบ (System Requirements)</h3>
           <textarea
            name="systemRequirements"
            value={formData.systemRequirements}
            onChange={handleChange}
            placeholder="Minimum & Recommended Specs..."
            rows={10}
            className="w-full bg-[#1a241b] border border-[#2e3b2c] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-400 transition-colors"
          />
        </div>
      </div>

      <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
        <div className="bg-[#141c15] border border-[#202d21] rounded-2xl p-6 shadow-xl">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-xl font-bold text-lg text-[#1a241b] bg-lime-400 hover:bg-lime-500 transition-all flex items-center justify-center gap-2 mb-4 disabled:opacity-50"
          >
            {isLoading ? <Loader2 size={24} className="animate-spin" /> : 'บันทึกข้อมูลเกม'}
          </button>
          
          <label className="flex items-center gap-3 p-4 bg-[#1a241b] rounded-xl border border-[#2e3b2c] cursor-pointer hover:border-lime-400 transition-colors">
            <input 
              type="checkbox" 
              name="isFeatured" 
              checked={formData.isFeatured} 
              onChange={handleChange}
              className="w-5 h-5 accent-lime-400"
            />
            <span className="text-[#f7ebc6] font-bold flex items-center gap-2">
              <Sparkles size={18} className="text-amber-400" />
              แนะนำเกมนี้
            </span>
          </label>
        </div>

        <div className="bg-[#141c15] border border-[#202d21] rounded-2xl p-6 shadow-xl">
          <h3 className="font-bold text-[#f7ebc6] mb-4 flex items-center gap-2">
            <Gamepad2 size={18} /> หมวดหมู่เกม
          </h3>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full bg-[#1a241b] border border-[#2e3b2c] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-400"
          >
            <option value="">-- เลือกหมวดหมู่ --</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="bg-[#141c15] border border-[#202d21] rounded-2xl p-6 shadow-xl">
          <h3 className="font-bold text-[#f7ebc6] mb-4 flex items-center gap-2">
            <ImageIcon size={18} /> รูปหน้าปก (Cover)
          </h3>
          <input
            type="file"
            accept="image/*"
            onChange={e => setCoverFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-[#2e3b2c] file:text-[#f7ebc6] hover:file:bg-[#3a4a37]"
          />
          {(coverFile || formData.coverImage) && (
            <div className="mt-4 aspect-video rounded-xl bg-[#1a241b] border border-[#2e3b2c] overflow-hidden">
              <img 
                src={coverFile ? URL.createObjectURL(coverFile) : formData.coverImage} 
                alt="Cover preview" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="bg-[#141c15] border border-[#202d21] rounded-2xl p-6 shadow-xl">
          <h3 className="font-bold text-[#f7ebc6] mb-4 flex items-center gap-2">
            <Video size={18} /> วิดีโอ (YouTube URL)
          </h3>
          <input
            type="text"
            name="videoUrl"
            value={formData.videoUrl}
            onChange={handleChange}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full bg-[#1a241b] border border-[#2e3b2c] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-400"
          />
        </div>

        <div className="bg-[#141c15] border border-[#202d21] rounded-2xl p-6 shadow-xl">
          <h3 className="font-bold text-[#f7ebc6] mb-4">แท็ก (Tags)</h3>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Action, RPG, Open World (คั่นด้วย ,)"
            className="w-full bg-[#1a241b] border border-[#2e3b2c] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-400"
          />
        </div>
      </div>
    </form>
  );
}
