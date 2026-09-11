"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LayoutDashboard, FileText, Users, Settings, LogOut, Gamepad2, Layers, Globe, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  { name: 'แดชบอร์ด', href: '/admin', icon: LayoutDashboard },
  { name: 'ข่าวสารและบทความ', href: '/admin/articles', icon: FileText },
  { name: 'คลังสารานุกรมเกม', href: '/admin/games', icon: Gamepad2 },
  { name: 'จัดการหมวดหมู่', href: '/admin/categories', icon: Layers },
  { name: 'จัดการผู้ใช้งาน', href: '/admin/users', icon: Users },
  { name: 'ตั้งค่าระบบ', href: '/admin/settings', icon: Settings },
];

function SidebarContent({ 
  pathname, 
  user, 
  logout, 
  setIsSidebarOpen 
}: { 
  pathname: string, 
  user: { username: string, role: string }, 
  logout: () => void, 
  setIsSidebarOpen: (v: boolean) => void 
}) {
  return (
    <div className="flex flex-col h-full bg-[#1a241b] text-[#f7ebc6] p-6 w-64 md:w-full border-r border-[#202d21]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-lime-400 leading-none">GAMEVERSE</h2>
          <span className="text-xs font-black tracking-widest text-[#f7ebc6]/70 uppercase">Control Center</span>
        </div>
        <button className="md:hidden text-[#f7ebc6]" onClick={() => setIsSidebarOpen(false)}>
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 flex flex-col gap-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-[#2e3b2c] border-l-4 border-lime-400 font-bold text-white' 
                  : 'hover:bg-[#202d21] text-[#f7ebc6]/80 hover:text-white font-medium'
              }`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon size={20} className={isActive ? 'text-lime-400' : 'text-gray-400'} />
              {item.name}
            </Link>
          );
        })}

        <div className="my-3 border-t border-[#2e3b2c]" />

        {/* Back to Website Home Button */}
        <Link 
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#202d21] hover:bg-[#2e3b2c] text-[#d4c38d] hover:text-[#f7ebc6] border border-[#2e3b2c] font-bold transition-all"
          onClick={() => setIsSidebarOpen(false)}
        >
          <Globe size={18} className="text-lime-400 shrink-0" />
          <span>กลับสู่หน้าเว็บไซต์</span>
        </Link>
      </nav>

      <div className="pt-6 border-t border-[#2e3b2c] mt-auto">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-10 h-10 rounded-full bg-lime-400 flex items-center justify-center text-[#1a241b] font-black">
            {user?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div>
            <p className="font-bold text-sm text-white">{user?.username || 'ผู้ดูแลระบบ'}</p>
            <p className="text-xs text-gray-400">ผู้ดูแลระบบสูงสุด</p>
          </div>
        </div>
        
        <button 
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
          className="flex items-center gap-4 px-4 py-3 rounded-xl w-full hover:bg-red-500/20 text-red-400 transition-all font-bold cursor-pointer"
        >
          <LogOut size={20} />
          ออกจากระบบ
        </button>
      </div>
    </div>
  );
}

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.role !== 'ADMIN') {
        alert('ปฏิเสธการเข้าถึง: สำหรับผู้ดูแลระบบเท่านั้น');
        router.push('/');
      }
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center bg-[#0b0f0c] text-lime-400 font-black text-2xl tracking-widest">กำลังโหลด...</div>;
  }

  // ป้องกันการ render ถ้าไม่ใช่ Admin
  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="flex h-screen w-full bg-[#0b0f0c] overflow-hidden font-sans relative">
      
      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-[#1a241b] flex items-center justify-between px-6 z-40 border-b border-[#202d21]">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(true)} className="text-[#f7ebc6] p-1">
            <Menu size={24} />
          </button>
          <h2 className="text-xl font-black text-lime-400">GAMEVERSE</h2>
        </div>
        <Link 
          href="/"
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-[#202d21] text-[#f7ebc6] border border-[#2e3b2c] hover:bg-[#2e3b2c]"
        >
          <Globe size={14} className="text-lime-400" />
          <span>หน้าหลัก</span>
        </Link>
      </div>

      {/* Mobile Overlay & Drawer */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-50 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div 
            className="h-full shadow-2xl transition-transform transform translate-x-0" 
            onClick={e => e.stopPropagation()}
          >
            <SidebarContent pathname={pathname} user={user} logout={logout} setIsSidebarOpen={setIsSidebarOpen} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-shrink-0 h-full">
        <SidebarContent pathname={pathname} user={user} logout={logout} setIsSidebarOpen={setIsSidebarOpen} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto w-full md:w-auto h-full pt-16 md:pt-0 flex flex-col">
        {/* Desktop Topbar Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-[#141c15] border-b border-[#202d21]">
          <div className="flex items-center gap-3 text-sm text-[#a5b8a6]">
            <span className="w-2.5 h-2.5 rounded-full bg-lime-400 inline-block animate-pulse"></span>
            <span className="font-bold text-[#d4c38d]">ระบบจัดการ Gameverse Admin</span>
          </div>
          <Link 
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a241b] text-[#f7ebc6] border border-[#2e3b2c] hover:bg-[#2e3b2c] hover:border-lime-400/50 text-xs font-bold transition-all shadow-sm"
          >
            <ArrowLeft size={14} className="text-lime-400" />
            <Globe size={14} className="text-[#d4c38d]" />
            <span>กลับสู่หน้าเว็บไซต์หลัก</span>
          </Link>
        </header>

        <div className="p-4 md:p-8 min-h-full flex-1">
          {children}
        </div>
      </div>
      
    </div>
  );
}
