"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGamesOpen, setIsGamesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close dropdown if clicked outside of it
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsGamesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full sticky top-0 z-50">
      <nav className="w-full backdrop-blur-xl bg-[#f7ebc6]/90 border-b border-[#d4c38d] px-4 md:px-8 lg:px-12 py-4 flex justify-between items-center shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
        
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

        {/* Right Side: Search + User */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-[#e8d7a5] border border-[#d4c38d] rounded-full px-4 py-2 shadow-inner">
            <span className="text-sm text-[#5d6b5e]">Search games...</span>
            <span className="ml-4 text-[#1a241b]">🔍</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1a241b] to-[#2e3b2c] shadow-[0_0_15px_rgba(250,214,97,0.4)] border border-[#f7ebc6] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
            <span className="text-[#f7ebc6]">👤</span>
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
        </div>
      </div>

    </div>
  );
};
