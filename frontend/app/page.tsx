'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to dashboard for MVP
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-pulse">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Loading Anapath...
          </h1>
          <p className="text-gray-600">Redirecting to dashboard</p>
        </div>
      </div>
    </div>
  );
}

