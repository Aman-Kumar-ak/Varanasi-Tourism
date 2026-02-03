'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  if (!user) return null;

  const firstLetter = user.name.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-temple flex items-center justify-center text-white font-bold text-base sm:text-lg hover:ring-2 ring-primary-gold/50 transition-all shadow-md hover:shadow-lg active:scale-95 flex-shrink-0 [-webkit-tap-highlight-color:transparent] focus:outline-none focus-visible:outline-none"
        aria-label="User menu"
      >
        {firstLetter}
      </button>

      {isOpen && (
        <div className="absolute -right-10 sm:-right-1 mt-2 w-40 sm:w-44 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-primary-gold/30 py-1.5 z-50 transform transition-all duration-200 opacity-100 translate-y-0">
          <div className="px-3 py-2 border-b border-primary-blue/10">
            <p className="text-sm sm:text-base font-semibold text-primary-dark truncate">{user.name}</p>
            <p className="text-xs sm:text-sm text-primary-dark/60 truncate">{user.phone}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-1.5 text-sm sm:text-base text-red-600 hover:bg-red-50 transition-colors rounded-md mx-1 my-1"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

