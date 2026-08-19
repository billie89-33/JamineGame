import React from 'react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#0b0f0c] text-white flex flex-col relative overflow-hidden font-sans p-8">
      <h1 className="text-3xl font-bold text-lime-400 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#121813] border border-[#202d21] p-6 rounded-xl">
          <h2 className="text-xl text-[#f7ebc6]">Total Articles</h2>
          <p className="text-4xl font-black mt-4">124</p>
        </div>
        <div className="bg-[#121813] border border-[#202d21] p-6 rounded-xl">
          <h2 className="text-xl text-[#f7ebc6]">New Users</h2>
          <p className="text-4xl font-black mt-4">12</p>
        </div>
      </div>
    </div>
  );
}
