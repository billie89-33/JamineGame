import React from 'react';

export const Sidebar = () => {
  return (
    <aside className="w-full flex flex-col gap-8">
      {/* Trending Section */}
      <div className="bg-[#f7ebc6] border border-[#d4c38d] p-6 shadow-sm">
        <h3 className="text-xl font-black text-[#1a241b] mb-4 uppercase border-b-2 border-[#1a241b] pb-2">
          Trending
        </h3>
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex gap-4 group cursor-pointer">
              <div className="w-20 h-20 bg-gray-300 overflow-hidden shrink-0">
                <img 
                  src={`https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=200`} 
                  alt="Trending thumbnail"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#1a241b] group-hover:text-[#4a574b] line-clamp-2 leading-tight mb-1">
                  The competitive scene is heating up this season
                </h4>
                <span className="text-xs text-[#5d6b5e] font-medium">2 hours ago</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories / Tags */}
      <div className="bg-[#f7ebc6] border border-[#d4c38d] p-6 shadow-sm">
        <h3 className="text-xl font-black text-[#1a241b] mb-4 uppercase border-b-2 border-[#1a241b] pb-2">
          Topics
        </h3>
        <div className="flex flex-wrap gap-2">
          {['ESPORTS', 'RPG', 'SHOOTER', 'HARDWARE', 'REVIEWS', 'INDIE'].map((tag) => (
            <span key={tag} className="text-xs font-bold bg-[#1a241b] text-[#f7ebc6] px-3 py-1.5 hover:bg-[#2e3b2c] cursor-pointer transition-colors">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
};
