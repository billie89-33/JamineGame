"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGamesOpen, setIsGamesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close dropdown if clicked outside of it
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsGamesOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full sticky top-0 z-50">
      <nav className="w-full backdrop-blur-xl bg-[#f7ebc6]/90 border-b border-[#d4c38d] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-4 flex justify-between items-center w-full">
          {/* Left Side: Hamburger (Mobile) + Logo */}
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-2xl text-[#1a241b] hover:text-[#B05B27] transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Mobile Menu"
            >
              ☰
            </button>
            <Link href="/" className="text-2xl font-black tracking-widest text-[#1a241b] drop-shadow-sm hover:text-[#B05B27] transition-colors cursor-pointer">
              GAMEVERSE
            </Link>
          </div>

          {/* Center: Desktop Links */}
          <div className="hidden md:flex gap-8 font-bold text-sm text-[#4a574b] items-center relative">
            <Link href="/" className="text-[#1a241b] drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] hover:text-[#B05B27] transition-colors">หน้าแรก</Link>
            <Link href="/news" className="hover:text-[#1a241b] transition-colors">ข่าวเกม</Link>
            
            <div className="relative py-2" ref={dropdownRef}>
              <button 
                className="flex items-center gap-1 hover:text-[#1a241b] transition-colors"
                onClick={() => setIsGamesOpen(!isGamesOpen)}
              >
                เกม <span className="text-[10px]">{isGamesOpen ? '▲' : '▼'}</span>
              </button>
              
              {isGamesOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#f7ebc6] border border-[#d4c38d] rounded-lg shadow-xl transition-all duration-300">
                  <div className="py-2 flex flex-col font-medium">
                    <Link href="/games/online" className="px-4 py-2 hover:bg-[#e8d7a5] hover:text-[#B05B27] transition-colors" onClick={() => setIsGamesOpen(false)}>🌍 เกม Online</Link>
                    <Link href="/games/coop" className="px-4 py-2 hover:bg-[#e8d7a5] hover:text-[#B05B27] transition-colors" onClick={() => setIsGamesOpen(false)}>🤝 เกม Co-op</Link>
                    <Link href="/games/singleplayer" className="px-4 py-2 hover:bg-[#e8d7a5] hover:text-[#B05B27] transition-colors" onClick={() => setIsGamesOpen(false)}>👤 เกมเล่นคนเดียว</Link>
                    <Link href="/games/indie" className="px-4 py-2 hover:bg-[#e8d7a5] hover:text-[#B05B27] transition-colors" onClick={() => setIsGamesOpen(false)}>💎 เกมอินดี้</Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/about" className="hover:text-[#1a241b] transition-colors">เกี่ยวกับเรา</Link>
          </div>

          {/* Right Side: Search + Auth */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-[#e8d7a5] border border-[#d4c38d] rounded-full px-4 py-2 shadow-inner cursor-pointer hover:bg-[#e0cba0] transition-colors">
              <span className="text-sm text-[#5d6b5e]">Search games...</span>
              <span className="ml-4 text-[#1a241b]">🔍</span>
            </div>
            
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <div className="relative" ref={userDropdownRef}>
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 bg-[#e8d7a5] px-4 py-2 rounded-full border border-[#d4c38d] hover:bg-[#e0cba0] transition-colors"
                  >
                    <span className="font-bold text-[#1a241b]">{user.username}</span>
                    <span className="text-[10px] text-[#1a241b]">{isUserMenuOpen ? '▲' : '▼'}</span>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-[#f7ebc6] border border-[#d4c38d] rounded-lg shadow-xl transition-all duration-300 overflow-hidden">
                      <div className="py-2 flex flex-col font-medium text-sm">
                        <Link href="/profile" className="px-4 py-2 hover:bg-[#e8d7a5] hover:text-[#B05B27] transition-colors text-[#1a241b]" onClick={() => setIsUserMenuOpen(false)}>👤 โปรไฟล์ (Profile)</Link>
                        {user.role === 'ADMIN' && (
                          <Link href="/admin" className="px-4 py-2 hover:bg-[#e8d7a5] hover:text-[#B05B27] transition-colors text-[#1a241b]" onClick={() => setIsUserMenuOpen(false)}>⚙️ หลังบ้าน (Admin)</Link>
                        )}
                        <button onClick={() => { logout(); setIsUserMenuOpen(false); }} className="text-left px-4 py-2 hover:bg-[#e8d7a5] hover:text-red-600 transition-colors text-red-500 border-t border-[#d4c38d] mt-1 pt-2">
                          🚪 ออกจากระบบ (Logout)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className="px-4 py-2 text-sm font-bold text-[#1a241b] hover:text-[#B05B27] transition-colors"
                  >
                    SIGN IN
                  </Link>
                  <Link 
                    href="/register" 
                    className="px-4 py-2 text-sm font-bold bg-[#1a241b] text-[#f7ebc6] rounded-full hover:bg-[#B05B27] shadow-[0_0_15px_rgba(250,214,97,0.4)] transition-all hover:scale-105"
                  >
                    SIGN UP
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* --- Mobile Sidebar --- */}
      
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden z-[60] ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 left-0 h-screen w-64 bg-[#f7ebc6] border-r border-[#d4c38d] shadow-[8px_0_32px_0_rgba(0,0,0,0.5)] transform transition-transform duration-300 ease-out z-[70] md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-4 border-b border-[#d4c38d] flex justify-between items-center bg-[#e8d7a5]/50">
          <span className="text-xl font-black tracking-widest text-[#1a241b]">GAMEVERSE</span>
          <button 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="text-3xl text-[#1a241b] hover:text-[#B05B27] transition-colors leading-none"
          >
            ×
          </button>
        </div>
        
        <div className="flex flex-col py-4 font-bold text-[#4a574b] overflow-y-auto h-[calc(100vh-70px)]">
          <Link href="/" className="px-6 py-4 hover:bg-[#e8d7a5] hover:text-[#B05B27] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>หน้าแรก</Link>
          <Link href="/news" className="px-6 py-4 hover:bg-[#e8d7a5] hover:text-[#B05B27] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>ข่าวเกม</Link>
          
          <div className="px-6 py-4">
            <button 
              className="flex justify-between items-center w-full text-left text-[#1a241b]"
              onClick={() => setIsGamesOpen(!isGamesOpen)}
            >
              <span>เกม</span>
              <span className="text-[12px]">{isGamesOpen ? '▲' : '▼'}</span>
            </button>
            {isGamesOpen && (
              <div className="flex flex-col mt-4 ml-4 font-medium border-l-2 border-[#d4c38d]">
                <Link href="/games/online" className="pl-4 py-3 hover:text-[#B05B27] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>🌍 เกม Online</Link>
                <Link href="/games/coop" className="pl-4 py-3 hover:text-[#B05B27] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>🤝 เกม Co-op</Link>
                <Link href="/games/singleplayer" className="pl-4 py-3 hover:text-[#B05B27] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>👤 เกมเล่นคนเดียว</Link>
                <Link href="/games/indie" className="pl-4 py-3 hover:text-[#B05B27] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>💎 เกมอินดี้</Link>
              </div>
            )}
          </div>
          
          <Link href="/about" className="px-6 py-4 hover:bg-[#e8d7a5] hover:text-[#B05B27] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>เกี่ยวกับเรา</Link>
          
          {/* Mobile Auth Buttons */}
          <div className="mt-auto px-6 py-8 flex flex-col gap-3">
            {user ? (
              <div className="flex flex-col gap-3">
                <div className="py-2 border-b border-[#d4c38d] mb-2 text-center text-[#1a241b] font-bold">
                  ยินดีต้อนรับ, {user.username}
                </div>
                <Link 
                  href="/profile" 
                  className="w-full py-3 text-center font-bold text-[#1a241b] border-2 border-[#1a241b] rounded-xl hover:bg-[#e8d7a5] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  👤 โปรไฟล์ (Profile)
                </Link>
                {user.role === 'ADMIN' && (
                  <Link 
                    href="/admin" 
                    className="w-full py-3 text-center font-bold text-[#1a241b] border-2 border-[#1a241b] rounded-xl hover:bg-[#e8d7a5] transition-colors bg-[#e8d7a5]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ⚙️ หลังบ้าน (Admin)
                  </Link>
                )}
                <button 
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  className="w-full py-3 text-center font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors shadow-lg mt-2"
                >
                  🚪 ออกจากระบบ (Logout)
                </button>
              </div>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="w-full py-3 text-center font-bold text-[#1a241b] border-2 border-[#1a241b] rounded-xl hover:bg-[#e8d7a5] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  SIGN IN
                </Link>
                <Link 
                  href="/register" 
                  className="w-full py-3 text-center font-bold bg-[#1a241b] text-[#f7ebc6] rounded-xl hover:bg-[#B05B27] transition-colors shadow-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  SIGN UP
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
