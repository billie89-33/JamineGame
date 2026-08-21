import React from 'react';

export default function NewsPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-16 md:px-8">
      
      {/* Header สไตล์ Minimal */}
      <div className="flex flex-col items-center mb-16 text-center">
        <h1 className="text-5xl font-light text-[#f7ebc6] tracking-widest uppercase mb-4">
          Gaming News
        </h1>
        <div className="w-16 h-[1px] bg-[#B05B27]"></div>
      </div>

      {/* Wireframe Section 1: ข่าวเด่น (Featured News) แบบหัวข้อทับเส้น */}
      <fieldset className="border-4 border-[#B05B27] rounded-xl p-8 mb-16 relative hover:border-[#f7ebc6] transition-colors duration-300">
        <legend className="text-2xl font-bold text-[#f7ebc6] px-4 ml-4 tracking-wide uppercase">
          🔥 Highlight
        </legend>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* รูปภาพจำลอง */}
          <div className="w-full md:w-1/2 aspect-video bg-[#1a241b] rounded flex items-center justify-center text-[#4a574b] border border-[#2e3b2c]">
            [ รูปภาพข่าวเด่น ]
          </div>
          
          {/* เนื้อหาจำลอง */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <span className="text-xs text-[#B05B27] tracking-widest uppercase mb-2">20 Aug 2026</span>
            <h2 className="text-3xl font-medium text-[#f7ebc6] mb-4 leading-tight">
              เตรียมพบกับอัปเดตครั้งใหญ่ที่จะเปลี่ยนวงการเกม
            </h2>
            <p className="text-[#a0a8a1] font-light leading-relaxed mb-6">
              เนื้อหาข่าวสรุปสั้นๆ แบบมินิมอล เน้นพื้นที่ว่างให้ดูสบายตา อ่านง่าย ไม่มีสิ่งรบกวนมากเกินไป...
            </p>
            <button className="self-start text-[#e8d7a5] border-b border-[#B05B27] pb-1 hover:text-[#f7ebc6] hover:border-[#f7ebc6] transition-colors uppercase tracking-widest text-sm">
              อ่านต่อ ⟶
            </button>
          </div>
        </div>
      </fieldset>

      {/* Wireframe Section 2: ข่าวอื่นๆ (Latest News) แบ่งเป็น Grid */}
      <fieldset className="border-4 border-[#B05B27] rounded-xl p-8 relative hover:border-[#f7ebc6] transition-colors duration-300">
        <legend className="text-xl font-medium text-[#f7ebc6] px-4 ml-4 tracking-wide uppercase">
          Latest Updates
        </legend>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="group cursor-pointer">
              <div className="w-full aspect-video bg-[#1a241b] rounded flex items-center justify-center text-[#2e3b2c] mb-4 border border-[#2e3b2c] group-hover:border-[#d4c38d] transition-colors">
                [ รูปข่าว ]
              </div>
              <h3 className="text-lg font-medium text-[#f7ebc6] group-hover:text-[#B05B27] transition-colors mb-2">
                หัวข้อข่าวอัปเดตย่อย {item}
              </h3>
              <p className="text-[#a0a8a1] text-sm font-light line-clamp-2">
                คำอธิบายข่าวสั้นๆ สไตล์มินิมอล เน้นความเรียบง่ายและตัวหนังสือที่อ่านสบาย...
              </p>
            </div>
          ))}
        </div>
      </fieldset>

    </main>
  );
}
