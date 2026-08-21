export default function OnlineGamesPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-12 md:px-8 lg:px-12">
      <div className="flex items-center gap-4 mb-8">
        <span className="text-4xl">🌍</span>
        <h1 className="text-4xl font-black text-[#f7ebc6]">เกม Online</h1>
      </div>
      <p className="text-[#a0a8a1] text-lg mb-8">พบปะและต่อสู้กับผู้เล่นมากมายจากทั่วทุกมุมโลก</p>
      
      {/* Mock content */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-[#1a241b] rounded-xl overflow-hidden shadow-lg border border-[#2e3b2c] hover:scale-105 transition-transform cursor-pointer">
            <div className="w-full h-40 bg-gradient-to-br from-[#2e3b2c] to-[#1a241b]"></div>
            <div className="p-4">
              <h3 className="font-bold text-[#f7ebc6]">ชื่อเกมออนไลน์ {item}</h3>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
