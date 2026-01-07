'use client';

import { useState, useEffect, useRef } from 'react';
import FontSizeControl from './FontSizeControl';
import LanguageSelector from './LanguageSelector';

export default function FloatingControls() {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Auto-hide after 4 seconds of inactivity
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsOpen(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        // Don't close if clicking on the trigger button
        if (!target.closest('button[aria-label="Open settings"]')) {
          setIsOpen(false);
        }
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Single fixed position for all pages - same as Varanasi page
  return (
    <div className="relative" ref={panelRef}>
      {/* Settings trigger button - Fixed position, same on all pages */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 sm:top-7 sm:right-6 z-40 w-9 h-9 sm:w-10 sm:h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-primary-gold/20 flex items-center justify-center transition-all duration-200 hover:bg-white/95 hover:shadow-lg hover:scale-105 active:scale-95"
        aria-label="Open settings"
        title="Settings"
      >
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5 text-primary-dark"
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

      {/* Dropdown panel */}
      {isOpen && (
        <div className="fixed top-16 right-4 sm:top-20 sm:right-6 z-50 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-primary-gold/30 p-4 sm:p-5 space-y-4 min-w-[200px] sm:min-w-[240px] transform transition-all duration-200 opacity-100 translate-y-0">
          {/* Close button */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-primary-dark uppercase tracking-wide">
              Settings
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 rounded-full bg-primary-gold/10 hover:bg-primary-gold/20 flex items-center justify-center transition-colors"
              aria-label="Close settings"
            >
              <svg
                className="w-4 h-4 text-primary-dark"
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
          </div>

          {/* Controls */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-primary-dark/70 mb-2 block uppercase tracking-wide">
                Font Size
              </label>
              <FontSizeControl />
            </div>

            <div>
              <label className="text-xs font-medium text-primary-dark/70 mb-2 block uppercase tracking-wide">
                Language
              </label>
              <LanguageSelector />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

