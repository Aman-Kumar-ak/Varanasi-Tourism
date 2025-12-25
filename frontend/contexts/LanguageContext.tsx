'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, type LanguageCode } from '@/lib/constants';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  getLanguageName: (code: LanguageCode) => string;
  getNativeLanguageName: (code: LanguageCode) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [translations, setTranslations] = useState<Record<string, any>>({});

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as LanguageCode;
    if (savedLanguage && SUPPORTED_LANGUAGES.some((lang) => lang.code === savedLanguage)) {
      setLanguageState(savedLanguage);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0];
      const matchedLang = SUPPORTED_LANGUAGES.find((lang) => lang.code === browserLang);
      if (matchedLang) {
        setLanguageState(matchedLang.code);
      }
    }
  }, []);

  // Load translations (will be implemented with actual translation files)
  useEffect(() => {
    // TODO: Load translation file for current language
    // For now, using empty object - will be populated with actual translations
    setTranslations({});
  }, [language]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  // Translation function
  const t = (key: string, fallback?: string): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    
    return value || fallback || key;
  };

  const getLanguageName = (code: LanguageCode): string => {
    return SUPPORTED_LANGUAGES.find((lang) => lang.code === code)?.name || code;
  };

  const getNativeLanguageName = (code: LanguageCode): string => {
    return SUPPORTED_LANGUAGES.find((lang) => lang.code === code)?.nativeName || code;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        getLanguageName,
        getNativeLanguageName,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

