'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated: authIsAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect to home with login modal open
    if (authIsAuthenticated) {
      router.push('/');
    } else {
      router.push('/?login=true');
    }
  }, [authIsAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-parchment">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary-blue rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
          <span className="text-white font-bold text-2xl">J</span>
        </div>
        <p className="text-primary-dark/60">Redirecting to login...</p>
      </div>
    </div>
  );
}
