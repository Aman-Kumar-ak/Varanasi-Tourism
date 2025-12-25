'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated: authIsAuthenticated } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (authIsAuthenticated) {
      router.push('/');
    }
  }, [authIsAuthenticated, router]);

  const handleSuccess = (token: string, user: any) => {
    login(token, user);
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
              {isAuthenticated ? 'Welcome!' : mode === 'login' ? 'Login' : 'Register'}
            </h1>
            <p className="text-primary-dark/60">
              {isAuthenticated
                ? 'Redirecting...'
                : mode === 'login'
                ? 'Enter your phone number to login'
                : 'Create your account to get started'}
            </p>
          </div>

          {/* Mode Toggle */}
          {!isAuthenticated && (
            <div className="mb-6">
              <div className="flex bg-background-parchment rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    // Reset form state
                    if (typeof window !== 'undefined') {
                      window.recaptchaVerifier = null as any;
                    }
                  }}
                  className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                    mode === 'login'
                      ? 'bg-primary-blue text-white shadow-sm'
                      : 'text-primary-dark/60 hover:text-primary-dark'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    // Reset form state
                    if (typeof window !== 'undefined') {
                      window.recaptchaVerifier = null as any;
                    }
                  }}
                  className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
                    mode === 'register'
                      ? 'bg-primary-blue text-white shadow-sm'
                      : 'text-primary-dark/60 hover:text-primary-dark'
                  }`}
                >
                  Register
                </button>
              </div>
            </div>
          )}

          {!isAuthenticated && (
            <>
              {mode === 'login' ? (
                <LoginForm onSuccess={handleSuccess} />
              ) : (
                <RegisterForm onSuccess={handleSuccess} />
              )}
            </>
          )}

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
