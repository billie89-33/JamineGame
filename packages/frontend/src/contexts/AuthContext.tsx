"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { API_URL } from "@/lib/config";

// กำหนดรูปร่างของข้อมูล User
export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // สมมติฐาน: ถ้ามีการรีเฟรชหน้าเว็บ เราอาจจะต้องมี API /auth/me ดึงข้อมูลจาก Cookie คืนมา 
  // (เดี๋ยวเราค่อยไปสร้าง API นี้ทีหลัง ตอนนี้เอาแบบเบสิกก่อน)
  useEffect(() => {
    // อ่านข้อมูล User จาก LocalStorage ชั่วคราวไปก่อน (ถ้ามี API /me ค่อยเปลี่ยน)
    const storedUser = localStorage.getItem("gameverse_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("gameverse_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("gameverse_user");
    // TODO: ยิง API ไปหาหลังบ้านเพื่อสั่ง clearCookie
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
