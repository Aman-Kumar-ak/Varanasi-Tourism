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
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary-blue flex items-center justify-center text-white font-bold text-base sm:text-lg hover:ring-2 ring-primary-blue/50 transition-all shadow-md hover:shadow-lg active:scale-95 flex-shrink-0"
        aria-label="User menu"
      >
        {firstLetter}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-primary-blue/20 py-2 z-50">
          <div className="px-4 py-2 border-b border-primary-blue/10">
            <p className="text-sm font-semibold text-primary-dark">{user.name}</p>
            <p className="text-xs text-primary-dark/60">{user.phone}</p>
          </div>
          <button
            onClick={() => {
              router.push('/my-bookings');
              setIsOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-sm text-primary-dark hover:bg-primary-blue/10 transition-colors"
          >
            My Bookings
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

