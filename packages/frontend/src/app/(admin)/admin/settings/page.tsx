import React from 'react';
import Link from 'next/link';
import { Settings, ArrowLeft } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="w-full flex flex-col gap-6 font-sans">
      <div className="bg-[#f7ebc6] p-8 rounded-3xl border border-[#d4c38d] shadow-[0_15px_40px_-10px_rgba(250,214,97,0.3)] text-center max-w-2xl mx-auto my-12">
        <div className="w-16 h-16 bg-[#1a241b] text-[#f7ebc6] rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Settings size={32} />
        </div>
        <h1 className="text-3xl font-black text-[#1a241b] mb-2">ตั้งค่าระบบ (System Settings)</h1>
        <p className="text-[#5d6b5e] font-medium mb-6">
          ระบบตั้งค่าเว็บไซต์และคอนฟิกูเรชันกำลังอยู่ระหว่างการพัฒนา (Coming Soon)
        </p>
        <Link 
          href="/admin" 
          className="inline-flex items-center gap-2 bg-[#1a241b] text-[#f7ebc6] font-bold px-6 py-3 rounded-xl hover:bg-[#2e3b2c] transition-colors"
        >
          <ArrowLeft size={18} />
          กลับสู่หน้าแดชบอร์ด
        </Link>
      </div>
    </div>
  );
}
