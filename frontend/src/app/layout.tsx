import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar, Footer } from "@/components/common";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gameverse - Gaming News",
  description: "Your ultimate gaming news platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0b0f0c] text-white relative font-sans">
        
        {/* Background Glow Effects (Global) */}
        <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-[#1a241b]/40 rounded-full blur-[150px] mix-blend-screen pointer-events-none -z-10"></div>
        <div className="fixed bottom-1/4 right-0 w-[500px] h-[500px] bg-[#2e3b2c]/40 rounded-full blur-[120px] mix-blend-screen pointer-events-none -z-10"></div>

        <Navbar />
        
        {/* Only this 'children' part changes when you click links! */}
        <div className="flex-1">
          {children}
        </div>
        
        <Footer />
      </body>
    </html>
  );
}
