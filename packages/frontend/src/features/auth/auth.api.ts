import { API_URL } from '@/lib/config';
import { LoginDto, RegisterDto } from '@shared/dto';
import { User } from '@/contexts/AuthContext';

export interface AuthResponse {
  message: string;
  user?: User;
  userId?: string;
  error?: string;
}

/**
 * รวม API ที่เกี่ยวกับ Auth ไว้ที่เดียว
 */
export const authApi = {
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include', // สำคัญ: เพื่อรับ HTTP-Only Cookie
    });
    
    const result: AuthResponse = await response.json();
    if (!response.ok) throw new Error(result.message || 'รหัสผ่านไม่ถูกต้อง');
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
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Logout failed');
  },

  me: async (): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include',
    });
    
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Not authenticated');
    return result;
  }
};
