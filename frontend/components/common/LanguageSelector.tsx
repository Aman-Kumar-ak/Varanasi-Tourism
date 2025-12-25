'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SUPPORTED_LANGUAGES, type LanguageCode } from '@/lib/constants';

export default function LanguageSelector() {
  const { language, setLanguage, getNativeLanguageName } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleLanguageChange = (langCode: LanguageCode) => {
    setLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background-parchment hover:bg-primary-blue/10 transition-colors text-primary-dark font-medium text-sm md:text-base"
        aria-label="Select language"
      >
        <span className="text-lg">🌐</span>
        <span className="hidden sm:inline">{getNativeLanguageName(language)}</span>
        <span className="sm:hidden">{language.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-primary-blue/20 z-50 max-h-96 overflow-y-auto">
          <div className="py-1">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left px-4 py-2 hover:bg-primary-blue/10 transition-colors flex items-center justify-between ${
                  language === lang.code ? 'bg-primary-blue/20 font-semibold' : ''
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm text-primary-dark">{lang.nativeName}</span>
                  <span className="text-xs text-primary-dark/60">{lang.name}</span>
                </div>
                {language === lang.code && (
                  <span className="text-primary-blue">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

