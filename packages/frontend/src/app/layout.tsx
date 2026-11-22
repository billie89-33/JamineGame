import type { Metadata } from "next";
import { Outfit, Kanit } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/config";
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


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - ข่าวเกม รีวิว และไกด์เกม`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "th_TH",
    title: `${SITE_NAME} - ข่าวเกม รีวิว และไกด์เกม`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - ข่าวเกม รีวิว และไกด์เกม`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${outfitFont.variable} ${kanitFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#0b0f0c] text-white relative font-sans">
        <AuthProvider>
          <ToastProvider>
            {/* Background Glow Effects (Global) */}
            <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-[#1a241b]/40 rounded-full blur-[150px] mix-blend-screen pointer-events-none -z-10"></div>
            <div className="fixed bottom-1/4 right-0 w-[500px] h-[500px] bg-[#2e3b2c]/40 rounded-full blur-[120px] mix-blend-screen pointer-events-none -z-10"></div>
            
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
