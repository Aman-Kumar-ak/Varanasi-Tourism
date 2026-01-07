'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from './UserMenu';
import LoginModal from '@/components/auth/LoginModal';

export default function GlobalAuthButton() {
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Open login modal if redirected from /login
  useEffect(() => {
    if (searchParams.get('login') === 'true') {
      setIsLoginModalOpen(true);
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [searchParams]);

  return (
    <>
      {/* Login/Profile Button - Fixed position, available on all pages */}
      <div className="fixed top-4 right-[60px] sm:top-7 sm:right-[72px] z-40 flex items-center">
        {isAuthenticated ? (
          <UserMenu />
        ) : (
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="px-5 sm:px-6 h-9 sm:h-10 bg-white/90 backdrop-blur-sm text-primary-blue rounded-xl font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 whitespace-nowrap flex items-center justify-center"
            aria-label="Login"
          >
            Login
          </button>
        )}
      </div>

      {/* Login Modal - Available on all pages */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}

