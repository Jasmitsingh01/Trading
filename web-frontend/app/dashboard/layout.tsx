// frontend/src/app/(dashboard)/layout.tsx
'use client'

import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/dashboard/Navbar";
import { MobileBottomNav } from "@/components/mobile/MobileBottomNav";
import { useAuth } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Only redirect if not loading and no user
    if (!loading && !user) {
      console.log('❌ No user, redirecting to login');
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-emerald-950/20 to-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className={`${geistSans.variable} ${geistMono.variable} flex h-screen bg-gradient-to-br from-slate-950 via-emerald-950/20 to-slate-950`}>
      {/* Desktop: Show sidebar navigation */}
      {!isMobile && <Navbar />}

      {/* Main content area */}
      <main className={`flex-1 h-screen overflow-y-auto ${isMobile ? 'pb-20' : ''}`}>
        {children}
      </main>

      {/* Mobile: Show bottom navigation */}
      {isMobile && <MobileBottomNav />}
    </div>
  );
}
