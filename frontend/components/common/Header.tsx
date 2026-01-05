'use client';

import Link from 'next/link';
import { useState } from 'react';
import LanguageSelector from './LanguageSelector';
import UserMenu from './UserMenu';
import FontSizeControl from './FontSizeControl';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/city/varanasi" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-blue to-primary-orange rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">V</span>
            </div>
            <span className="text-xl font-bold text-primary-dark hidden sm:block">
              Varanasi Tourism
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/city/varanasi"
              className="text-primary-dark hover:text-primary-orange transition-colors font-medium"
            >
              Varanasi
            </Link>
          </nav>

          {/* Right Side - Font Size, Language & Auth */}
          <div className="flex items-center gap-3">
            <FontSizeControl />
            <LanguageSelector />
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors font-medium text-sm md:text-base"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-primary-dark"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-blue/20">
            <nav className="flex flex-col gap-4">
              <Link
                href="/city/varanasi"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-primary-dark hover:text-primary-orange transition-colors font-medium px-2 py-1"
              >
                Varanasi
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
