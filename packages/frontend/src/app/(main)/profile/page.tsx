"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16 md:px-8 text-center min-h-[50vh] flex items-center justify-center">
        <div className="text-xl text-[#a0a8a1]">Loading profile...</div>
      </main>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-16 md:px-8 min-h-[60vh]">
      <div className="bg-[#1a241b] border border-[#d4c38d] p-8 rounded-2xl shadow-xl max-w-2xl mx-auto">
        <h1 className="text-3xl font-black text-[#f7ebc6] mb-6 border-b border-[#2e3b2c] pb-4">
          โปรไฟล์ของคุณ (Profile)
        </h1>
        
        <div className="space-y-6 text-lg">
          <div className="flex flex-col sm:flex-row gap-2">
            <span className="font-bold text-[#a0a8a1] w-32">ชื่อผู้ใช้:</span>
            <span className="text-[#f7ebc6] font-medium">{user.username}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <span className="font-bold text-[#a0a8a1] w-32">สถานะ:</span>
            <span>
              {user.role === 'ADMIN' ? (
                <span className="bg-[#B05B27] text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                  ADMIN
                </span>
              ) : (
                <span className="bg-[#2e3b2c] text-white px-4 py-1 rounded-full text-sm font-bold">
                  USER
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
