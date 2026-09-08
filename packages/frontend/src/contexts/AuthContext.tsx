"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

import { authApi, getStoredUser, setStoredUser, clearAuthStorage, getAuthToken } from "@/features/auth/auth.api";

// กำหนดรูปร่างของข้อมูล User
export interface User {
  id: string;
  email?: string;
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

  // 1. Initial hydration from localStorage to prevent flash of unauthenticated state
  useEffect(() => {
    const cachedUser = getStoredUser();
    const token = getAuthToken();
    if (cachedUser && token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(cachedUser);
    }
  }, []);

  // 2. Background verification with backend
  useEffect(() => {
    const fetchUser = async () => {
      const token = getAuthToken();
      if (!token) {
        setIsLoading(false);
        setUser(null);
        clearAuthStorage();
        return;
      }

      try {
        const response = await authApi.me();
        if (response.user) {
          setUser(response.user);
          setStoredUser(response.user);
        } else {
          setUser(null);
          clearAuthStorage();
        }
      } catch (error) {
        // Token is invalid or expired
        console.log("Session expired or invalid:", error);
        setUser(null);
        clearAuthStorage();
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUser();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setStoredUser(userData);
  };

  const logout = async () => {
    setUser(null);
    clearAuthStorage();
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
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
