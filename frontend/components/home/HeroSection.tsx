'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HeroSection() {
  const { language } = useLanguage();

  return (
    <section className="relative min-h-[600px] flex items-center justify-center bg-gradient-to-br from-primary-blue/20 via-background-parchment to-primary-orange/20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23183446' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-primary-dark mb-6 leading-tight">
            Experience Divine Darshan at All 12 Jyotirlingas
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-primary-dark/80 mb-10 leading-relaxed">
            Book your spiritual journey with ease. Connect with the divine at India's most sacred temples.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/jyotirlingas"
              className="px-8 py-4 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 transition-all transform hover:scale-105 shadow-lg font-semibold text-lg w-full sm:w-auto"
            >
              Book Darshan Now
            </Link>
            <Link
              href="/jyotirlingas"
              className="px-8 py-4 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-all transform hover:scale-105 shadow-lg font-semibold text-lg w-full sm:w-auto"
            >
              Explore Temples
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-primary-dark/70">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span>Secure Booking</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span>Instant Confirmation</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span>Easy Cancellation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

