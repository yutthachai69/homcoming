import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { HeaderStats } from "@/components/HeaderStats";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Homecoming Booking | จองโต๊ะงานคืนสู่เหย้า",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col font-sans bg-slate-50 dark:bg-slate-950`}
      >
        <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-950 dark:to-black opacity-60 pointer-events-none"></div>

        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gradient-to-r from-blue-900 to-indigo-900 shadow-md">
          <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
            <a
              href="/"
              className="flex items-center space-x-4 group"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-white/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg border-2 border-amber-400">
                  <span className="text-blue-900 font-bold text-2xl font-serif">๓๔</span>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl md:text-2xl font-bold text-white leading-none shadow-black drop-shadow-md">
                    ตุ้มโฮมศิษย์เก่า
                  </span>
                  <span className="text-sm md:text-base font-medium text-amber-400 tracking-wide drop-shadow-sm hidden sm:inline-block">
                    คืนสู่เหย้า 34 ปี
                  </span>
                </div>
                <span className="text-xs text-blue-200 sm:hidden">คืนสู่เหย้า 34 ปี</span>
              </div>
            </a>

            <div className="flex items-center gap-4">
              {/* Stats Summary - Visible on Desktop */}
              <HeaderStats />
            </div>
          </div>
        </header>

        <main className="relative z-10 flex-1 container mx-auto py-8 px-4">
          <Providers>
            {children}
          </Providers>
        </main>

        <footer className="relative z-10 py-8 border-t bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row px-6">
            <p className="text-center text-sm text-muted-foreground">
              © 2026 Homecoming Event. All rights reserved.
            </p>
          </div>
        </footer>

        <Toaster />
      </body>
    </html>
  );
}
