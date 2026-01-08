'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SUPPORTED_LANGUAGES, type LanguageCode } from '@/lib/constants';

interface LanguageSelectorProps {
  disableHover?: boolean;
  variant?: 'default' | 'footer';
}

export default function LanguageSelector({ disableHover = false, variant = 'default' }: LanguageSelectorProps) {
  const { language, setLanguage, getNativeLanguageName } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Restore scroll position after language change
  useEffect(() => {
    if (scrollPositionRef.current !== null) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({
            top: scrollPositionRef.current!,
            behavior: 'instant' as ScrollBehavior
          });
          scrollPositionRef.current = null;
        });
      });
    }
  }, [language]);

  const handleLanguageChange = (langCode: LanguageCode) => {
    // Save current scroll position before changing language
    scrollPositionRef.current = window.scrollY || document.documentElement.scrollTop;
    
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 h-8 sm:h-9 rounded-lg ${
          variant === 'footer' 
            ? 'bg-white/90 backdrop-blur-sm text-primary-dark border border-primary-blue/20 hover:bg-white/95 hover:border-primary-blue/30 w-auto' 
            : 'bg-background-parchment/90 backdrop-blur-sm text-primary-dark border border-primary-gold/20 w-full'
        } ${disableHover ? '' : variant === 'footer' ? '' : 'hover:bg-primary-gold/20 hover:border-primary-gold/40'} transition-all duration-200 font-medium text-sm sm:text-base shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0`}
        aria-label="Select language"
      >
        <span className="text-sm sm:text-base">🌐</span>
        <span className="font-semibold text-sm sm:text-base">{language.toUpperCase()}</span>
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? (variant === 'footer' ? 'rotate-90' : 'rotate-180') : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className={`absolute ${
          variant === 'footer' 
            ? 'bottom-full mb-2 left-0 sm:bottom-0 sm:left-auto sm:right-full sm:mr-2' 
            : 'right-0 mt-2 top-full'
        } w-36 sm:w-40 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-primary-gold/30 z-50 max-h-[240px] sm:max-h-[280px] overflow-y-auto`}>
          <div className="py-1">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left px-3 py-1.5 ${disableHover ? '' : 'hover:bg-primary-gold/20'} transition-colors flex items-center justify-between ${
                  language === lang.code ? 'bg-primary-gold/30 font-semibold' : ''
                }`}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-sm font-semibold text-primary-dark flex-shrink-0 w-8">{lang.code.toUpperCase()}</span>
                  <span className="text-sm text-primary-dark truncate">{lang.nativeName}</span>
                </div>
                {language === lang.code && (
                  <span className="text-primary-gold text-sm ml-2 flex-shrink-0">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

