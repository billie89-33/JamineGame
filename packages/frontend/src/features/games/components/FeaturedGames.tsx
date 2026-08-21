import React from 'react';

export const FeaturedGames = () => {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-[#f7ebc6] border-l-4 border-[#B05B27] pl-3">
          🔥 เกมยอดนิยม (Featured Games)
        </h2>
        <a href="/games" className="text-sm font-bold text-[#a0a8a1] hover:text-[#B05B27] transition-colors">
          ดูทั้งหมด
        </a>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder ของแต่ละเกม */}
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-[#1a241b] rounded-xl overflow-hidden border border-[#2e3b2c] hover:border-[#B05B27] hover:scale-[1.02] transition-all cursor-pointer shadow-lg">
            {/* รูปภาพปกเกม (จำลอง) */}
            <div className="h-48 bg-gradient-to-br from-[#2e3b2c] to-[#0b0f0c] w-full flex items-center justify-center">
              <span className="text-[#a0a8a1]">Game Image {item}</span>
            </div>
            
            {/* ข้อมูลเกม */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-[#f7ebc6]">ชื่อเกมสุดฮิต {item}</h3>
                <span className="bg-[#e8d7a5] text-[#1a241b] text-[10px] font-black px-2 py-1 rounded-full">ACTION</span>
              </div>
              <p className="text-[#a0a8a1] text-sm line-clamp-2">
                คำอธิบายของเกมแบบสั้นๆ ให้ผู้เล่นรู้ว่าเกี่ยวกับอะไร เล่นสนุกแค่ไหน...
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
