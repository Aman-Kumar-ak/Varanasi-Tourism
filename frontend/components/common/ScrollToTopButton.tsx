'use client';

import { useEffect, useState } from 'react';

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      setIsVisible(y > 400);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      className="fixed right-4 bottom-28 sm:right-6 sm:bottom-16 z-40 flex items-center justify-center rounded-full bg-primary-blue text-white border border-primary-gold/40 w-11 h-11 sm:w-12 sm:h-12 touch-manipulation"
      aria-label="Back to top"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="w-5 h-5"
        aria-hidden="true"
      >
        <path
          d="M12 4l-7 7h4v7h6v-7h4z"
          fill="currentColor"
        />
      </svg>
    </button>
  );
}


