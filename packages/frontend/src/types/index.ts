// src/types/index.ts

// 1. Base API Response Interface
// ใช้สำหรับครอบข้อมูลที่รับมาจาก Backend เสมอ (ตาม Pattern ของโปรเจกต์)
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// 2. Pagination Metadata Interface
// ใช้สำหรับจัดการข้อมูลการแบ่งหน้า (ตาม Pagination Pattern)
export interface PaginatedData<T> {
  success: boolean;
  total: number;       // จำนวนรายการทั้งหมด
  page: number;        // หน้าปัจจุบัน
  totalPages: number;  // จำนวนหน้าทั้งหมด
  data: T[];           // ข้อมูลในหน้านั้นๆ
}

// 3. User Interface (อิงจากโครงสร้าง Supabase/Next.js)
export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  updatedAt: string;
}

// 4. Base Query Options (สำหรับใช้ส่ง Filter / Pagination ไปยัง Backend)
export interface QueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}
