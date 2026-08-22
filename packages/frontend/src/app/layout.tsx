import type { Metadata } from "next";
import { Outfit, Kanit } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const outfitFont = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const kanitFont = Kanit({
  variable: "--font-kanit",
  weight: ["300", "400", "500", "700"],
  subsets: ["thai", "latin"],
});

import { LayoutWrapper } from "@/components/common/LayoutWrapper";

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
    <html lang="en" className={`${outfitFont.variable} ${kanitFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0b0f0c] text-white relative font-sans">
        <AuthProvider>
          {/* Background Glow Effects (Global) */}
          <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-[#1a241b]/40 rounded-full blur-[150px] mix-blend-screen pointer-events-none -z-10"></div>
          <div className="fixed bottom-1/4 right-0 w-[500px] h-[500px] bg-[#2e3b2c]/40 rounded-full blur-[120px] mix-blend-screen pointer-events-none -z-10"></div>
          
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
