"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/dashboard');

  return (
    <>
      {!isAdmin && <Navbar />}
      <div className="flex-1">
        {children}
      </div>
      {!isAdmin && <Footer />}
    </>
  );
}
