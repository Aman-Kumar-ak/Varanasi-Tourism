'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { useAuth } from '@/contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, isAuthenticated: authIsAuthenticated } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (authIsAuthenticated && isOpen) {
      setIsAuthenticated(true);
      setTimeout(() => {
        onClose();
        setIsAuthenticated(false);
        setMode('login');
      }, 1000);
    }
  }, [authIsAuthenticated, isOpen, onClose]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsAuthenticated(false);
      setMode('login');
      if (typeof window !== 'undefined') {
        window.recaptchaVerifier = null as any;
      }
    }
  }, [isOpen]);

  const handleSuccess = (token: string, user: any) => {
    login(token, user);
    setIsAuthenticated(true);
    setTimeout(() => {
      onClose();
      setIsAuthenticated(false);
      setMode('login');
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-primary-blue/10 relative transform transition-all duration-200 scale-100 opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary-blue/10 hover:bg-primary-blue/20 flex items-center justify-center transition-colors z-10"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5 text-primary-dark"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-blue rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
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
                <Link href="/terms" className="text-primary-blue hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary-blue hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

