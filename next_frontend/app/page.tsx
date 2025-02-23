'use client';

import { useRouter } from 'next/navigation';
import React from 'react'

export default function Landing() {
  const router = useRouter();

  return (
    <main className="flex h-screen items-center justify-center bg-gray-900">
      <button 
        type="button" 
        onClick={() => router.push('/home')}
        className="px-6 py-3 text-lg font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
      >
        Home
      </button>
    </main>
  );
}
