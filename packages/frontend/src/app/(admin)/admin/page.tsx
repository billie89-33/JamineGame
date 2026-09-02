"use client";

import React, { useEffect, useState } from 'react';
import { API_URL } from '@/lib/config';

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalArticles: 0, totalUsers: 0 });

  useEffect(() => {
    fetch(`${API_URL}/stats`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error('Failed to load stats', err));
  }, []);

  return (
    <div className="flex flex-col relative font-sans w-full">
      <h1 className="text-3xl font-black text-lime-400 mb-6 tracking-wider">ภาพรวมระบบ (Dashboard)</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#121813] border border-[#202d21] p-6 rounded-xl">
          <h2 className="text-xl text-[#f7ebc6]">จำนวนบทความทั้งหมด</h2>
          <p className="text-4xl font-black mt-4">{stats.totalArticles}</p>
        </div>
        <div className="bg-[#121813] border border-[#202d21] p-6 rounded-xl">
          <h2 className="text-xl text-[#f7ebc6]">ผู้ใช้งานใหม่</h2>
          <p className="text-4xl font-black mt-4">{stats.totalUsers}</p>
        </div>
      </div>
    </div>
  );
}
