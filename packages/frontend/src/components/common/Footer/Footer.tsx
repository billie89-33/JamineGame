import React from 'react';

export const Footer = () => {
  return (
    <footer className="w-full bg-[#0b0f0c] border-t border-[#1a241b] py-10 mt-12 z-10">
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#5d6b5e]">
        <div className="font-bold text-xl text-[#f7ebc6]/50">GAMEVERSE</div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-[#f7ebc6] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#f7ebc6] transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-[#f7ebc6] transition-colors">Contact</a>
        </div>
        <div>&copy; 2026 Gameverse. All rights reserved.</div>
      </div>
    </footer>
  );
};
