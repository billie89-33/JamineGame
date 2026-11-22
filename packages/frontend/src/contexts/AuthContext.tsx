"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

import { authApi, getStoredUser, setStoredUser, clearAuthStorage, getAuthToken } from "@/features/auth/auth.api";
import { ApiError } from "@/lib/api-client";

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

  // 1. Initial hydration from localStorage + background verification
  useEffect(() => {
    const cachedUser = getStoredUser();
    const token = getAuthToken();
    if (cachedUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(cachedUser);
    }

    const fetchUser = async () => {
      if (!token && !cachedUser) {
        // Still try cookie-based session check silently
        try {
          const response = await authApi.me();
          if (response.user) {
            setUser(response.user);
            setStoredUser(response.user);
            authApi.refresh().catch(() => {});
          }
        } catch {
          // Guest user with no cookie/token
        } finally {
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await authApi.me();
        if (response.user) {
          setUser(response.user);
          setStoredUser(response.user);
          // Sliding session: extend token & cookie lifetime in the background
          authApi.refresh().catch(() => {});
        } else {
          setUser(null);
          clearAuthStorage();
        }
      } catch (error) {
        // Clear session ONLY when the server explicitly rejects the token (401/403).
        // Network errors, timeouts, or 5xx (e.g. cold start / sleeping backend) keep the cached session intact.
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          setUser(null);
          clearAuthStorage();
        } else {
          console.warn("Auth verification skipped due to temporary server/network error:", error);
        }
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
