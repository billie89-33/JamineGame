import { API_URL } from '@/lib/config';
import { LoginDto, RegisterDto } from '@shared/dto';
import { User } from '@/contexts/AuthContext';

export interface AuthResponse {
  message: string;
  user?: User;
  userId?: string;
  access_token?: string;
  error?: string;
}

export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', token);
  }
};

export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
  }
};

export const getStoredUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('auth_user');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        localStorage.removeItem('auth_user');
      }
    }
  }
  return null;
};

export const setStoredUser = (user: User): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_user', JSON.stringify(user));
  }
};

export const removeStoredUser = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_user');
  }
};

export const clearAuthStorage = (): void => {
  removeAuthToken();
  removeStoredUser();
};

export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * รวม API ที่เกี่ยวกับ Auth ไว้ที่เดียว
 */
export const authApi = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include', // เพื่อรับ HTTP-Only Cookie
    });
    
    const result: AuthResponse = await response.json();
    if (!response.ok) throw new Error(result.message || 'รหัสผ่านไม่ถูกต้อง');
    if (result.access_token) {
      setAuthToken(result.access_token);
    }
    if (result.user) {
      setStoredUser(result.user);
    }
    return result;
  },

  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    const result: AuthResponse = await response.json();
    if (!response.ok) throw new Error(result.message || 'ไม่สามารถสมัครสมาชิกได้');
    return result;
  },

  logout: async (): Promise<void> => {
    clearAuthStorage();
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: { ...getAuthHeaders() },
        credentials: 'include',
      });
    } catch {
      // Ignore network errors on logout
    }
  },

  me: async (): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: { ...getAuthHeaders() },
      credentials: 'include',
    });
    
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Not authenticated');
    return result;
  }
};
