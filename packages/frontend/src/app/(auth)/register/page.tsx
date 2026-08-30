"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRegister } from '@/features/auth';

import { ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirm, setConfirm] = useState<string>('');
  
  const { executeRegister, isLoading, error, setError } = useRegister();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirm) {
      setError('รหัสผ่านไม่ตรงกัน');
      return;
    }

    await executeRegister({ username, email, password, confirm });
  };

  return (
    <div className="min-h-screen bg-[#0b0f0c] flex items-center justify-center font-sans py-12 p-4">
      <div className="w-full max-w-md bg-[#f7ebc6] rounded-3xl p-8 border border-[#d4c38d] shadow-[0_15px_40px_-10px_rgba(250,214,97,0.3)]">
        <Link href="/" className="flex items-center justify-center gap-2 bg-[#1a241b] text-[#f7ebc6] hover:bg-[#2e3b2c] py-3 px-4 rounded-xl font-bold text-sm mb-6 transition-colors w-full">
          <ArrowLeft size={16} />
          BACK TO MAIN PAGE
        </Link>
        <h1 className="text-3xl font-black text-[#1a241b] mb-6 text-center">CREATE ACCOUNT</h1>
        
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
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
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <input 
            type="password" 
            placeholder="Confirm Password" 
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="p-4 rounded-xl bg-[#e8d7a5] border border-[#d4c38d] text-[#1a241b] placeholder:text-[#5d6b5e] outline-none focus:border-[#1a241b] transition-colors" 
          />
          
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#1a241b] text-[#f7ebc6] font-bold rounded-xl mt-4 hover:bg-[#2e3b2c] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'CREATING...' : 'CREATE ACCOUNT'}
          </button>
          
          <p className="text-center text-[#5d6b5e] mt-4 text-sm">
            Already have an account? <Link href="/login" className="font-bold text-[#1a241b] hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
