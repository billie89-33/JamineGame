/* eslint-disable */
/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect } from 'react';
import { categoriesApi, Category } from '@/features/categories/categories.api';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', slug: '', icon: '', description: '' });

  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchCategories = async () => {
    await Promise.resolve();
    setIsLoading(true);
    await Promise.resolve();
    setIsLoading(true);
    try {
      const data = await categoriesApi.getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await categoriesApi.updateCategory(editingId, formData);
        alert('อัปเดตหมวดหมู่สำเร็จ');
      } else {
        await categoriesApi.createCategory(formData);
        alert('สร้างหมวดหมู่สำเร็จ');
      }
      setFormData({ name: '', slug: '', icon: '', description: '' });
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      alert('เกิดข้อผิดพลาด: ' + (error as Error).message);
    }
  };

  const handleEdit = (cat: Category) => {
    setFormData({
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || '',
      description: cat.description || ''
    });
    setEditingId(cat.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setFormData({ name: '', slug: '', icon: '', description: '' });
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ยืนยันการลบหมวดหมู่นี้? (บทความในหมวดหมู่นี้จะกลายเป็นไม่มีหมวดหมู่)')) return;
    try {
      await categoriesApi.deleteCategory(id);
      fetchCategories();
    } catch (error) {
      alert('ลบไม่สำเร็จ (อาจมีข้อมูลอ้างอิงอยู่)');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-black text-[#f7ebc6] mb-8 tracking-wider">จัดการหมวดหมู่</h1>
      
      <form onSubmit={handleSubmit} className={`flex flex-col gap-4 p-6 rounded-2xl border mb-8 transition-colors ${editingId ? 'bg-[#e8d7a5] border-[#B05B27]' : 'bg-[#f7ebc6] border-[#d4c38d]'}`}>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#1a241b]">{editingId ? '✏️ แก้ไขหมวดหมู่' : '✨ เพิ่มหมวดหมู่ใหม่'}</h2>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="text-sm font-bold text-red-500 hover:text-red-700">ยกเลิกการแก้ไข</button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="ชื่อ (เช่น เกม Online)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="p-3 rounded-lg bg-white/50 border border-[#d4c38d] text-[#1a241b]" />
          <input type="text" placeholder="Slug (เช่น online)" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required className="p-3 rounded-lg bg-white/50 border border-[#d4c38d] text-[#1a241b]" />
          <input type="text" placeholder="ไอคอน (เช่น 🌍)" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="p-3 rounded-lg bg-white/50 border border-[#d4c38d] text-[#1a241b]" />
          <input type="text" placeholder="คำอธิบายสั้นๆ" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="p-3 rounded-lg bg-white/50 border border-[#d4c38d] text-[#1a241b]" />
        </div>
        <button type="submit" className={`mt-2 py-3 rounded-lg font-bold transition-colors ${editingId ? 'bg-[#B05B27] text-white hover:bg-[#8a461e]' : 'bg-[#1a241b] text-[#f7ebc6] hover:bg-[#2e3b2c]'}`}>
          {editingId ? 'บันทึกการแก้ไข' : 'เพิ่มหมวดหมู่'}
        </button>
      </form>

      <div className="bg-[#f7ebc6] rounded-2xl border border-[#d4c38d] overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-[#1a241b] font-bold">กำลังโหลด...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-[#1a241b]">ยังไม่มีหมวดหมู่</div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-[#e8d7a5] text-[#1a241b]">
              <tr>
                <th className="p-4 font-bold w-20 text-center">ไอคอน</th>
                <th className="p-4 font-bold">ชื่อ</th>
                <th className="p-4 font-bold">Slug</th>
                <th className="p-4 font-bold text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id} className="border-b border-[#d4c38d] last:border-0 hover:bg-[#e8d7a5]/50">
                  <td className="p-4 text-2xl text-center">{cat.icon}</td>
                  <td className="p-4 font-bold text-[#1a241b]">{cat.name}</td>
                  <td className="p-4 text-[#4a574b]">{cat.slug}</td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button onClick={() => handleEdit(cat)} className="text-[#B05B27] hover:text-white font-bold px-3 py-1 border border-[#B05B27] rounded-lg hover:bg-[#B05B27] transition-colors">แก้ไข</button>
                    <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:text-white font-bold px-3 py-1 border border-red-500 rounded-lg hover:bg-red-500 transition-colors">ลบ</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
