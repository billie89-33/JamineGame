import React from 'react';

export const GameCategoryList = () => {
  const categories = [
    { name: 'เกม Online', icon: '🌍', link: '/games/online' },
    { name: 'เกม Co-op', icon: '🤝', link: '/games/coop' },
    { name: 'เล่นคนเดียว', icon: '👤', link: '/games/singleplayer' },
    { name: 'เกมอินดี้', icon: '💎', link: '/games/indie' },
  ];

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-black text-[#f7ebc6] border-l-4 border-[#B05B27] pl-3 mb-6">
        🎮 ค้นหาตามหมวดหมู่ (Categories)
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat, index) => (
          <a 
            key={index} 
            href={cat.link}
            className="flex flex-col items-center justify-center p-6 bg-[#1a241b] border border-[#2e3b2c] rounded-xl hover:bg-[#e8d7a5] group transition-all cursor-pointer shadow-md"
          >
            <span className="text-4xl mb-3 group-hover:scale-110 transition-transform">{cat.icon}</span>
            <span className="font-bold text-[#f7ebc6] group-hover:text-[#1a241b] transition-colors">{cat.name}</span>
          </a>
        ))}
      </div>
    </section>
  );
};
