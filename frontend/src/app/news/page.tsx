export default function NewsPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12 md:px-8 lg:px-12">
      <h1 className="text-4xl font-black text-[#f7ebc6] mb-6">ข่าวเกมล่าสุด</h1>
      <p className="text-[#a0a8a1] text-lg">ติดตามอัปเดตข่าวสารวงการเกมใหม่ล่าสุดได้ที่นี่...</p>
      
      {/* Mock content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-[#1a241b] border border-[#2e3b2c] rounded-xl p-6 hover:border-[#B05B27] transition-colors cursor-pointer">
            <div className="w-full h-48 bg-[#0b0f0c] rounded-lg mb-4"></div>
            <h2 className="text-xl font-bold text-[#f7ebc6] mb-2">หัวข้อข่าวที่ {item}</h2>
            <p className="text-[#a0a8a1] text-sm">รายละเอียดเนื้อหาข่าวคร่าวๆ จะแสดงตรงนี้...</p>
          </div>
        ))}
      </div>
    </main>
  );
}
