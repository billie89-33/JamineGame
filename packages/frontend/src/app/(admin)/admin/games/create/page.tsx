import React from 'react';
import { AdminGameForm } from '@/features/games/components/AdminGameForm/AdminGameForm';
import { Gamepad2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'สร้างเกมใหม่ - Jamine Admin',
};

export default function CreateGamePage() {
  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <Link 
          href="/admin/games" 
          className="p-3 bg-[#1a241b] text-gray-400 rounded-xl hover:text-lime-400 hover:bg-[#202d21] transition-all self-start"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-[#f7ebc6] flex items-center gap-3">
            <Gamepad2 size={32} className="text-lime-400" />
            สร้างข้อมูลเกมใหม่
          </h1>
          <p className="text-gray-400 mt-1">กรอกรายละเอียดเกมที่ต้องการเพิ่มลงในระบบ</p>
        </div>
      </div>
      
      <AdminGameForm />
    </div>
  );
}
