'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from './UserMenu';
import LoginModal from '@/components/auth/LoginModal';
import FontSizeControl from './FontSizeControl';
import LanguageSelector from './LanguageSelector';

export default function FloatingButtonGroup() {
  const { isAuthenticated } = useAuth();
  const searchParams = useSearchParams();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsPanelRef = useRef<HTMLDivElement>(null);

  // Open login modal if redirected from /login
  useEffect(() => {
    if (searchParams.get('login') === 'true') {
      setIsLoginModalOpen(true);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [searchParams]);

  // Close settings when clicking outside (button toggle is handled by onClick)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      const target = event.target as HTMLElement;
      
      // Don't close if clicking inside the settings panel or on the settings button
      if (settingsPanelRef.current && settingsPanelRef.current.contains(target)) {
        return;
      }
      
      // Close if clicking anywhere else
      setIsSettingsOpen(false);
    }

    if (isSettingsOpen) {
      // Use a small delay to prevent immediate closing when opening
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside as EventListener);
        document.addEventListener('touchstart', handleClickOutside as EventListener);
      }, 100);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside as EventListener);
        document.removeEventListener('touchstart', handleClickOutside as EventListener);
      };
    }
  }, [isSettingsOpen]);

  return (
    <>
      {/* Unified Button Group Container - Capsule/Dumbbell Shape */}
      <div className="fixed top-4 right-4 sm:top-7 sm:right-6 z-40 flex items-center gap-1 sm:gap-1.5 bg-black/30 backdrop-blur-md rounded-full px-1 sm:px-1.5 py-1 sm:py-1.5 border border-black/40 shadow-lg">
        {/* Login/Profile Button - Left Circle */}
        <div className="flex items-center">
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-temple flex items-center justify-center text-white shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200"
              aria-label="Login"
              title="Login"
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Settings Button - Right Circle */}
        <div className="relative" ref={settingsPanelRef}>
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/80 backdrop-blur-sm shadow-md border border-primary-gold/20 flex items-center justify-center transition-all duration-200 hover:bg-white/95 hover:shadow-lg hover:scale-105 active:scale-95"
            aria-label="Open settings"
            title="Settings"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-primary-dark"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </button>

          {/* Settings Dropdown Panel */}
          {isSettingsOpen && (
            <div className="fixed top-14 right-2 sm:top-18 sm:right-4 z-50 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-primary-gold/30 p-3 sm:p-4 max-w-[calc(100vw-2rem)] sm:max-w-none w-auto transform transition-all duration-200 opacity-100 translate-y-0">
              {/* Controls - In One Column */}
              <div className="flex flex-col gap-3">
                <FontSizeControl />
                <LanguageSelector />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}

