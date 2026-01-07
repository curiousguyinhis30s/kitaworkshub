"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PortalPage() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect to dashboard (demo mode)
    router.push('/portal/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-800 via-primary-900 to-primary-950 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="w-16 h-16 border-4 border-white/30 border-t-accent-400 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xl font-medium">Loading Client Portal...</p>
        <p className="text-primary-300 text-sm mt-2">Welcome, Demo User</p>
      </div>
    </div>
  );
}
