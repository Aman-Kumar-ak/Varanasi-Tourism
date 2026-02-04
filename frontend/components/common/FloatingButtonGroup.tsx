'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import UserMenu from './UserMenu';
import LoginModal from '@/components/auth/LoginModal';
import FontSizeControl from './FontSizeControl';
import LanguageSelector from './LanguageSelector';

export default function FloatingButtonGroup() {
  const { isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const settingsPanelRef = useRef<HTMLDivElement>(null);

  // Close the settings panel as soon as the user changes language
  useEffect(() => {
    setIsSettingsOpen(false);
  }, [language]);

  // Check if loading screen is active
  useEffect(() => {
    const checkLoading = () => {
      setIsLoading(document.body.classList.contains('loading-active'));
    };
    
    checkLoading();
    const observer = new MutationObserver(checkLoading);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

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

  // Don't render when loading
  if (isLoading) {
    return null;
  }

  return (
    <>
      {/* Dark toolbar pill - solid background, no glass effect */}
      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-40 flex items-center gap-1 sm:gap-1.5 rounded-full bg-slate-800 sm:bg-slate-800/95 px-1.5 sm:px-2 py-1.5 sm:py-2 border border-white/10 [&_button]:[-webkit-tap-highlight-color:transparent]">
        {/* Login/Profile Button - Left Circle */}
        <div className="flex items-center">
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-temple flex items-center justify-center text-white shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-200 [-webkit-tap-highlight-color:transparent] focus:outline-none focus-visible:outline-none"
              aria-label="Login"
              title="Login"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
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
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-600 hover:bg-slate-500 border border-white/15 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 text-white/90 hover:text-white [-webkit-tap-highlight-color:transparent] focus:outline-none focus-visible:outline-none"
            aria-label="Open settings"
            title="Settings"
          >
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7"
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

          {/* Settings Dropdown Panel – smooth open on phone */}
          <div
            className={`absolute top-full mt-2 right-0 sm:top-14 sm:mt-0 z-50 max-w-[calc(100vw-2rem)] sm:max-w-none w-auto transform-gpu origin-top-right ${
              isSettingsOpen
                ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
            }`}
          >
            <div className="relative rounded-2xl bg-gradient-to-br from-white/95 via-premium-peach/90 to-white/95 backdrop-blur-xl shadow-[0_18px_45px_rgba(15,23,42,0.18)] border border-primary-saffron/25 p-3 sm:p-4">
              <div
                className="absolute -top-2.5 right-3 h-5 w-5 rotate-45 rounded-[6px] bg-gradient-to-br from-white/95 via-premium-peach/90 to-white/95 border-l border-t border-primary-saffron/25 shadow-[0_8px_16px_rgba(15,23,42,0.08)]"
                aria-hidden
              />
              {/* Controls - In One Column */}
              <div className="flex flex-col gap-3">
                <FontSizeControl />
                <LanguageSelector />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}

