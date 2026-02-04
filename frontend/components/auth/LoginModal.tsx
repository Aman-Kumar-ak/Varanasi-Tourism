'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [contentHeight, setContentHeight] = useState(280);
  const formWrapRef = useRef<HTMLDivElement>(null);

  // Lock background scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;
    if (typeof window === 'undefined') return;

    const body = document.body;
    const html = document.documentElement;

    // Simple reference counting so multiple overlays can coexist safely
    const currentCount = Number.parseInt(body.dataset.scrollLockCount || '0', 10) || 0;
    body.dataset.scrollLockCount = String(currentCount + 1);

    // Save original inline styles so we can restore precisely
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPaddingRight = body.style.paddingRight;
    const prevHtmlOverflow = html.style.overflow;

    // Prevent layout shift when scrollbar disappears
    const scrollbarWidth = window.innerWidth - html.clientWidth;

    body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      const nextCount = Number.parseInt(body.dataset.scrollLockCount || '1', 10) - 1;
      if (nextCount <= 0) {
        delete body.dataset.scrollLockCount;
        body.style.overflow = prevBodyOverflow;
        body.style.paddingRight = prevBodyPaddingRight;
        html.style.overflow = prevHtmlOverflow;
      } else {
        body.dataset.scrollLockCount = String(nextCount);
      }
    };
  }, [isOpen]);

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

  // Measure form height for expand/compress animation when switching Login ↔ Register
  useEffect(() => {
    if (!isOpen || isAuthenticated) return;
    const el = formWrapRef.current;
    if (!el) return;
    const updateHeight = () => {
      if (el) setContentHeight(el.offsetHeight);
    };
    updateHeight();
    const raf = requestAnimationFrame(updateHeight);
    const ro = new ResizeObserver(updateHeight);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [isOpen, isAuthenticated, mode]);

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
      {/* Backdrop – optimized for mobile performance */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 opacity-100 sm:transition-opacity sm:duration-200 backdrop-blur-[4px] sm:backdrop-blur-[12px]"
        onClick={onClose}
        style={{
          background: 'linear-gradient(160deg, rgba(26,26,46,0.6) 0%, rgba(30,58,138,0.25) 50%, rgba(26,26,46,0.5) 100%)',
        }}
      >
        {/* Modal – premium card with soft shadow and border */}
        <div
          className="w-full max-w-md relative transform scale-100 opacity-100 rounded-2xl overflow-hidden sm:transition-all sm:duration-300 sm:ease-out"
          onClick={(e) => e.stopPropagation()}
          style={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FDFBFA 100%)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.8), 0 0 80px -20px rgba(30,58,138,0.15)',
          }}
        >
          {/* Subtle top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ background: 'linear-gradient(90deg, #1E3A8A 0%, #0F766E 50%, #1E3A8A 100%)' }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center z-10 sm:transition-all sm:duration-200 sm:hover:scale-105 active:scale-95"
            style={{
              background: 'rgba(26,26,46,0.06)',
              color: '#1A1A2E',
            }}
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-8 pt-8">
            <div className="text-center mb-7 pr-14">
              {isAuthenticated && (
                <h1 className="text-2xl font-bold text-primary-dark mb-1.5 tracking-tight">
                  Welcome!
                </h1>
              )}
              <p
                className={`mx-auto max-w-[22rem] sm:max-w-none leading-relaxed tracking-tight whitespace-nowrap ${
                  isAuthenticated
                    ? 'text-sm text-premium-section-muted'
                    : 'text-base font-medium text-premium-section-text/90'
                }`}
              >
                {isAuthenticated
                  ? 'Redirecting...'
                  : mode === 'login'
                    ? 'Enter your phone number to sign in'
                    : 'Create your account to get started'}
              </p>
              {/* Subtle accent line under heading */}
              <div
                className="mx-auto mt-4 w-14 h-0.5 rounded-full opacity-70"
                style={{ background: 'linear-gradient(90deg, #1E3A8A, #0F766E)' }}
              />
            </div>

            {/* Mode Toggle – capsule with sliding pill animation */}
            {!isAuthenticated && (
              <div className="mb-6">
                <div
                  className="flex rounded-full p-1 relative"
                  style={{
                    background: 'linear-gradient(135deg, #FFF8E7 0%, #F5E6D8 100%)',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
                  }}
                >
                  {/* Sliding pill – instant on mobile, smooth on desktop */}
                  <div
                    className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full sm:transition-transform sm:duration-200 sm:ease-out"
                    style={{
                      background: 'linear-gradient(145deg, #1E3A8A 0%, #163072 100%)',
                      boxShadow: '0 2px 8px rgba(30,58,138,0.35)',
                      transform: mode === 'register' ? 'translateX(100%)' : 'translateX(0)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      if (typeof window !== 'undefined') window.recaptchaVerifier = null as any;
                    }}
                    className={`relative flex-1 px-4 py-2.5 rounded-full font-medium text-sm sm:transition-colors sm:duration-200 z-10 outline-none focus:outline-none active:outline-none ${
                      mode === 'login' ? 'text-white' : 'text-premium-section-muted sm:hover:text-premium-section-text'
                    }`}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      if (typeof window !== 'undefined') window.recaptchaVerifier = null as any;
                    }}
                    className={`relative flex-1 px-4 py-2.5 rounded-full font-medium text-sm sm:transition-colors sm:duration-200 z-10 outline-none focus:outline-none active:outline-none ${
                      mode === 'register' ? 'text-white' : 'text-premium-section-muted sm:hover:text-premium-section-text'
                    }`}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    Register
                  </button>
                </div>
              </div>
            )}

            {/* Form area – height animates when switching Login ↔ Register (instant on mobile) */}
            {!isAuthenticated && (
              <div
                className="overflow-hidden sm:transition-[height] sm:duration-200 sm:ease-out"
                style={{ height: contentHeight }}
              >
                <div ref={formWrapRef}>
                  {mode === 'login' ? (
                    <LoginForm onSuccess={handleSuccess} />
                  ) : (
                    <RegisterForm onSuccess={handleSuccess} />
                  )}
                </div>
              </div>
            )}

            <div className="mt-6 pt-5 text-center border-t border-black/5">
              <p className="text-xs text-premium-section-muted leading-relaxed">
                By continuing, you agree to our{' '}
                <Link
                  href="/terms"
                  className="text-primary-blue font-medium hover:underline underline-offset-2"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  className="text-primary-blue font-medium hover:underline underline-offset-2"
                >
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

