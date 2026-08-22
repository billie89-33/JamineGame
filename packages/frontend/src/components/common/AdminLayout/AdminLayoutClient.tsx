"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard, FileText, Users, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Articles', href: '/dashboard/articles', icon: FileText },
    { name: 'Users', href: '/dashboard/users', icon: Users },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#1a241b] text-[#f7ebc6] p-6 w-64 md:w-full border-r border-[#202d21]">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-black text-lime-400">GAMEVERSE<br/><span className="text-[#f7ebc6]">ADMIN</span></h2>
        <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-[#2e3b2c] border-l-4 border-lime-400 font-bold' 
                  : 'hover:bg-[#202d21] font-medium'
              }`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <item.icon size={20} className={isActive ? 'text-lime-400' : 'text-gray-400'} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 border-t border-[#2e3b2c] mt-auto">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-10 h-10 rounded-full bg-lime-400 flex items-center justify-center text-[#1a241b] font-black">
            {user?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div>
            <p className="font-bold text-sm">{user?.username || 'Admin User'}</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>
        
        <button 
          onClick={() => {
            logout();
            window.location.href = '/login';
          }}
          className="flex items-center gap-4 px-4 py-3 rounded-xl w-full hover:bg-red-500/20 text-red-400 transition-all font-bold"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-[#0b0f0c] overflow-hidden font-sans relative">
      
      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-[#1a241b] flex items-center justify-between px-6 z-40 border-b border-[#202d21]">
        <h2 className="text-xl font-black text-lime-400">GAMEVERSE</h2>
        <button onClick={() => setIsSidebarOpen(true)} className="text-[#f7ebc6]">
          <Menu size={24} />
        </button>
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
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-shrink-0 h-full">
        <SidebarContent />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto w-full md:w-auto h-full pt-16 md:pt-0">
        <div className="p-4 md:p-8 min-h-full">
          {children}
        </div>
      </div>
      
    </div>
  );
}
