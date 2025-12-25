'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PhoneLogin from '@/components/auth/PhoneLogin';

export default function LoginPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSuccess = (token: string, user: any) => {
    setIsAuthenticated(true);
    // Redirect to home or intended page
    setTimeout(() => {
      router.push('/');
      router.refresh();
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-blue/10 via-background-parchment to-primary-orange/10 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-blue to-primary-orange rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">J</span>
            </div>
            <h1 className="text-3xl font-bold text-primary-dark mb-2">
              {isAuthenticated ? 'Welcome!' : 'Login / Register'}
            </h1>
            <p className="text-primary-dark/60">
              {isAuthenticated
                ? 'Redirecting...'
                : 'Enter your phone number to continue'}
            </p>
          </div>

          {!isAuthenticated && <PhoneLogin onSuccess={handleSuccess} />}

          <div className="mt-6 text-center">
            <p className="text-sm text-primary-dark/60">
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-primary-blue hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary-blue hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

