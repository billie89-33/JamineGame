export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const SITE_NAME = 'Gameverse';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://jamine-game-frontend.vercel.app';

export const SITE_DESCRIPTION =
  'ศูนย์รวมข่าวเกม รีวิวเกม ไกด์เกม และสารานุกรมเกมอัปเดตใหม่ทุกวัน';

export const isProduction = process.env.NODE_ENV === 'production';
