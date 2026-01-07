"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-950 to-black flex items-center justify-center">
      <div className="text-center text-white">
        <div className="w-16 h-16 border-4 border-white/30 border-t-accent-400 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xl font-medium">Loading Admin Portal...</p>
        <p className="text-primary-300 text-sm mt-2">Welcome, Administrator</p>
      </div>
    </div>
  );
}
