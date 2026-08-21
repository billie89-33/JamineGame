"use client";

import { useState } from 'react';
import { authApi } from './auth.api';
import { LoginDto, RegisterDto } from '@shared/dto';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export function useLogin() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const executeLogin = async (data: LoginDto) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await authApi.login(data);
      if (response.user) {
        login(response.user); // อัปเดต Global Context
        router.push('/');     // พาไปหน้าแรก
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setIsLoading(false);
    }
  };

  return { executeLogin, isLoading, error };
}

export function useRegister() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const executeRegister = async (data: RegisterDto) => {
    setIsLoading(true);
    setError('');
    
    try {
      await authApi.register(data);
      alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setIsLoading(false);
    }
  };

  return { executeRegister, isLoading, error, setError };
}
