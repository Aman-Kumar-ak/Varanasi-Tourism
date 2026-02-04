'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';

interface BeautifulLoadingProps {
  message?: string;
  subMessage?: string;
}

export default function BeautifulLoading({ 
  message,
  subMessage 
}: BeautifulLoadingProps) {
  const { language } = useLanguage();

  const defaultMessage = message || t('loading.city.information', language) || 'Loading city information...';
  const defaultSubMessage = subMessage || t('loading.please.wait', language) || 'Please wait while we prepare your journey...';

  // Add class to body and html when loading and remove when unmounting
  // Also prevent scrolling
  useEffect(() => {
    document.body.classList.add('loading-active');
    document.documentElement.classList.add('loading-active');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
    return () => {
      document.body.classList.remove('loading-active');
      document.documentElement.classList.remove('loading-active');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center overflow-hidden z-[9999]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating temple silhouette */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 opacity-10 animate-pulse">
          <div className="w-full h-full bg-primary-blue rounded-t-full"></div>
        </div>
        
        {/* Floating circles */}
        <div className="absolute top-1/3 right-1/4 w-24 h-24 sm:w-32 sm:h-32 bg-primary-gold/20 rounded-full animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-20 h-20 sm:w-28 sm:h-28 bg-primary-orange/20 rounded-full animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-md">
        {/* Main spinner with temple icon */}
        <div className="relative mb-8">
          {/* Outer rotating ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-primary-gold/30 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
          </div>
          
          {/* Middle ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-primary-orange/40 rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
          </div>
          
          {/* Inner icon */}
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-gold to-primary-orange rounded-full flex items-center justify-center shadow-2xl transform animate-pulse">
              <span className="text-2xl sm:text-3xl">🕉️</span>
            </div>
          </div>
        </div>

        {/* Loading text */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-dark animate-fade-in">
            {defaultMessage}
          </h2>
          <p className="text-base sm:text-lg text-primary-dark/70 animate-fade-in-delay">
            {defaultSubMessage}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <div className="w-2 h-2 bg-primary-gold rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-primary-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}

