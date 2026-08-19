import React from 'react';

export const Navbar = () => {
  return (
    <div className="w-full sticky top-0 z-50">
      <nav className="w-full backdrop-blur-xl bg-[#f7ebc6]/90 border-b border-[#d4c38d] px-4 md:px-8 lg:px-12 py-4 flex justify-between items-center shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
        <div className="text-2xl font-black tracking-widest text-[#1a241b] drop-shadow-sm">
          GAMEVERSE
        </div>
        <div className="hidden md:flex gap-8 font-bold text-sm text-[#4a574b]">
          <a href="#" className="text-[#1a241b] drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">Home</a>
          <a href="#" className="hover:text-[#1a241b] transition-colors">News</a>
          <a href="#" className="hover:text-[#1a241b] transition-colors">Reviews</a>
          <a href="#" className="hover:text-[#1a241b] transition-colors">Guides</a>
        </div>
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
    </div>
  );
};
