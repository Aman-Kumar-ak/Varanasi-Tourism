'use client';

import Link from 'next/link';
import { useState } from 'react';
import LanguageSelector from './LanguageSelector';
import UserMenu from './UserMenu';
import FontSizeControl from './FontSizeControl';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-primary-gold/20 shadow-lg shadow-primary-gold/10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-105 active:scale-95">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-temple rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
              <span className="text-white font-bold text-xl sm:text-2xl drop-shadow-lg relative z-10">🕉️</span>
            </div>
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-gradient-temple hidden sm:block tracking-tight">
              Varanasi Tourism
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/city/varanasi"
              className="text-primary-dark font-semibold text-base hover:text-primary-orange transition-colors duration-200 relative group"
            >
              Varanasi
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-gold to-primary-orange group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* Right Side - Font Size, Language & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            <FontSizeControl />
            <LanguageSelector />
            {isAuthenticated ? (
              <UserMenu />
            ) : (
            <Link
              href="/login"
              className="px-5 sm:px-6 py-2 sm:py-2.5 bg-gradient-temple text-white rounded-xl font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 whitespace-nowrap"
            >
              Login
            </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
