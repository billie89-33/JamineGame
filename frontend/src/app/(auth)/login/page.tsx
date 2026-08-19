import React from 'react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0b0f0c] flex items-center justify-center font-sans">
      <div className="w-full max-w-md bg-[#f7ebc6] rounded-3xl p-8 border border-[#d4c38d] shadow-[0_15px_40px_-10px_rgba(250,214,97,0.3)]">
        <h1 className="text-3xl font-black text-[#1a241b] mb-6 text-center">GAMEVERSE LOGIN</h1>
        <div className="flex flex-col gap-4">
          <input type="text" placeholder="Username" className="p-4 rounded-xl bg-[#e8d7a5] border border-[#d4c38d] text-[#1a241b] placeholder:text-[#5d6b5e] outline-none focus:border-[#1a241b] transition-colors" />
          <input type="password" placeholder="Password" className="p-4 rounded-xl bg-[#e8d7a5] border border-[#d4c38d] text-[#1a241b] placeholder:text-[#5d6b5e] outline-none focus:border-[#1a241b] transition-colors" />
          <button className="w-full py-4 bg-[#1a241b] text-[#f7ebc6] font-bold rounded-xl mt-4 hover:bg-[#2e3b2c] transition-colors">
            SIGN IN
          </button>
        </div>
      </div>
    </div>
  );
}
