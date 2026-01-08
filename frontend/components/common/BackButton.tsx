'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

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

  // Don't show on home page or when loading
  if (pathname === '/' || isLoading) {
    return null;
  }

  const handleBack = () => {
    router.back();
  };

  return (
    <button
      onClick={handleBack}
      className="fixed top-4 left-4 sm:top-7 sm:left-6 z-50 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-white/40 flex items-center justify-center transition-all duration-200 hover:bg-white hover:shadow-xl hover:scale-105 active:scale-95 group"
      aria-label="Go back"
      title="Go back"
    >
      <svg
        className="w-4 h-4 sm:w-5 sm:h-5 text-primary-dark group-hover:text-primary-blue transition-colors"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>
  );
}

