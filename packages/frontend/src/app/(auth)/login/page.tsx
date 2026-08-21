"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, User } from '@/contexts/AuthContext';
import { API_URL } from '@/lib/config';

// Best Practice: กำหนด Interface ให้ชัดเจนว่า API จะตอบกลับมาเป็นรูปร่างแบบไหน
interface LoginResponse {
  message: string;
  user?: User;
  error?: string;
  statusCode?: number;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        // สำคัญมาก! ต้องมี credentials: 'include' เพื่อให้เบราว์เซอร์ยอมรับ HTTP-Only Cookie ข้ามโดเมน
        credentials: 'include',
      });
      
      const data: LoginResponse = await response.json();

      if (!response.ok) {
        // จัดการ Error ตาม Best Practice ของ TS
        throw new Error(data.message || 'รหัสผ่านไม่ถูกต้อง');
      }

      if (data.user) {
        // บันทึก State ลง Context
        login(data.user);
        
        // เด้งกลับไปหน้าแรกหลังจากล็อกอินเสร็จ
        router.push('/');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f0c] flex items-center justify-center font-sans">
      <div className="w-full max-w-md bg-[#f7ebc6] rounded-3xl p-8 border border-[#d4c38d] shadow-[0_15px_40px_-10px_rgba(250,214,97,0.3)]">
        <h1 className="text-3xl font-black text-[#1a241b] mb-6 text-center">GAMEVERSE LOGIN</h1>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <input 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="p-4 rounded-xl bg-[#e8d7a5] border border-[#d4c38d] text-[#1a241b] placeholder:text-[#5d6b5e] outline-none focus:border-[#1a241b] transition-colors" 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-4 rounded-xl bg-[#e8d7a5] border border-[#d4c38d] text-[#1a241b] placeholder:text-[#5d6b5e] outline-none focus:border-[#1a241b] transition-colors" 
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#1a241b] text-[#f7ebc6] font-bold rounded-xl mt-4 hover:bg-[#2e3b2c] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
          
          <p className="text-center text-[#5d6b5e] mt-4 text-sm">
            Don't have an account? <Link href="/register" className="font-bold text-[#1a241b] hover:underline">Register here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
