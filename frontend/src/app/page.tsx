import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b0f0c] text-white flex flex-col relative overflow-hidden font-sans">
      {/* Background Deep Olive Glow Effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#1a241b]/40 rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-[#2e3b2c]/40 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>

      {/* 1. Navbar - Glassy Golden Yellow (Full Width Floating Pill) */}
      <div className="w-full px-4 md:px-8 lg:px-12 pt-6 sticky top-0 z-50">
        <nav className="w-full backdrop-blur-xl bg-[#f7ebc6]/90 border border-[#d4c38d] rounded-2xl p-4 flex justify-between items-center shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]">
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

      <main className="flex-1 w-full px-4 md:px-8 lg:px-12 py-12 z-10">
        
        {/* 2. Hero Section - Soft Golden Yellow Inside */}
        <section className="mb-20">
          <div className="group relative w-full rounded-3xl bg-[#f7ebc6] border border-[#d4c38d] p-6 lg:p-10 transition-all duration-700 hover:shadow-[0_20px_60px_-15px_rgba(250,214,97,0.3)] flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* Cover Image */}
            <div className="w-full lg:w-2/3 aspect-[4/3] md:aspect-video lg:aspect-[21/9] rounded-2xl overflow-hidden relative shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a241b]/20 to-[#0b0f0c]/60 mix-blend-overlay z-10"></div>
              <img src="https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&q=80&w=2500" alt="Hero Game" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute bottom-6 left-6 z-20 flex gap-3">
                <span className="bg-[#f7ebc6]/90 backdrop-blur-md text-[#1a241b] text-sm font-black px-4 py-1.5 rounded-md shadow-md">FEATURED</span>
                <span className="bg-[#1a241b] text-[#f7ebc6] text-sm font-bold px-4 py-1.5 rounded-md shadow-md">REVIEW</span>
              </div>
            </div>

            {/* Content */}
            <div className="w-full lg:w-1/3 flex flex-col justify-center">
              <h1 className="text-4xl lg:text-6xl font-black text-[#1a241b] mb-6 leading-tight group-hover:text-[#2e3b2c] transition-colors duration-500">
                Massive New RPG Revealed
              </h1>
              <p className="text-[#4a574b] text-lg font-medium mb-8 leading-relaxed">
                Explore the punishing world of Eldoria in this groundbreaking new adventure that redefines the genre with deep combat mechanics.
              </p>
              <button className="self-start px-10 py-4 bg-[#1a241b] border border-[#2e3b2c] rounded-xl font-bold text-lg text-[#f7ebc6] hover:bg-[#2e3b2c] hover:shadow-[0_0_20px_rgba(26,36,27,0.4)] transition-all duration-300">
                READ REVIEW
              </button>
            </div>
          </div>
        </section>

        {/* 3. Latest Articles Grid */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#f7ebc6] border-b-2 border-[#f7ebc6]/30 pb-2 inline-block drop-shadow-[0_0_8px_rgba(247,235,198,0.2)]">
              Latest Articles
            </h2>
            <a href="#" className="text-[#a5b8a6] hover:text-[#f7ebc6] transition-colors text-base font-semibold">View All &raquo;</a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <div key={item} className="group relative rounded-2xl bg-[#f7ebc6] border border-[#d4c38d] p-5 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_40px_-10px_rgba(250,214,97,0.25)] flex flex-col h-full">
                
                {/* Thumbnail */}
                <div className="w-full aspect-[4/3] md:aspect-video rounded-xl bg-[#e8d7a5] mb-5 overflow-hidden relative shadow-inner">
                  <div className="absolute inset-0 bg-[#1a241b]/10 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity"></div>
                  <img src={`https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800&sig=${item}`} alt="Article" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale-[20%] group-hover:grayscale-0" />
                  <div className="absolute top-3 right-3 bg-[#f7ebc6]/90 backdrop-blur-md text-[#1a241b] text-xs font-black px-2.5 py-1 rounded-md z-20 shadow-sm">
                    NEWS
                  </div>
                </div>

                <h3 className="text-xl font-black text-[#1a241b] mb-3 group-hover:text-[#2e3b2c] transition-colors line-clamp-2">
                  The Future of Gaming Consoles: What to Expect in 2027
                </h3>
                <p className="text-sm text-[#4a574b] font-medium mb-6 line-clamp-3 flex-1">
                  A deep dive into the leaked specs and rumors surrounding the next generation of hardware and what it means for developers.
                </p>
                
                <div className="flex justify-between items-center text-sm text-[#5d6b5e] font-bold pt-4 border-t border-[#d4c38d]/50 mt-auto">
                  <span className="flex items-center gap-2"><span className="w-5 h-5 rounded-full bg-[#1a241b] inline-block"></span> Admin</span>
                  <span className="text-[#2e3b2c]">Oct 28, 2026</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* 4. Footer */}
      <footer className="w-full bg-[#0b0f0c] border-t border-[#1a241b] py-10 mt-12 z-10">
        <div className="w-full px-4 md:px-8 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#5d6b5e]">
          <div className="font-bold text-xl text-[#f7ebc6]/50">GAMEVERSE</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-[#f7ebc6] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#f7ebc6] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#f7ebc6] transition-colors">Contact</a>
          </div>
          <div>&copy; 2026 Gameverse. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
