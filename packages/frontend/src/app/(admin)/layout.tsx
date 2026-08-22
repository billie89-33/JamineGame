import React from 'react';
import { AdminLayoutClient } from '@/components/common/AdminLayout/AdminLayoutClient';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
