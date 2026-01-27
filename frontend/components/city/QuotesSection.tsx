'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { getLocalizedContent } from '@/lib/i18n';
import type { LanguageCode } from '@/lib/constants';
import { t } from '@/lib/translations';
import SectionHeader from './SectionHeader';

interface Quote {
  _id: string;
  quote: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  author: string;
  source?: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  image: string; // Cloudinary URL - placeholder for now
  order: number;
}

interface QuotesSectionProps {
  quotes: Quote[];
  language: LanguageCode;
}

export default function QuotesSection({ quotes, language }: QuotesSectionProps) {
  // Number of cards visible at once (1 on mobile, 3 on desktop)
  const [pageSize, setPageSize] = useState(3);
  // Index of the first (left-most) quote currently visible
  const [startIndex, setStartIndex] = useState(0);
  // Track slide direction for animation
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);

  // Update page size based on viewport: 1 card on small screens, 3 on md+
  useEffect(() => {
    const updatePageSize = () => {
      if (typeof window === 'undefined') return;
      setPageSize(window.innerWidth < 768 ? 1 : 3);
    };

    updatePageSize();
    window.addEventListener('resize', updatePageSize);
    return () => window.removeEventListener('resize', updatePageSize);
  }, []);

  // Reset slide direction after animation completes
  useEffect(() => {
    if (slideDirection !== null) {
      const timer = setTimeout(() => {
        setSlideDirection(null);
      }, 300); // Slightly longer than animation duration (250ms)
      return () => clearTimeout(timer);
    }
  }, [slideDirection, startIndex]);

  if (!quotes || quotes.length === 0) {
    return null;
  }

  const totalItems = quotes.length;

  // Build a sliding window of pageSize quotes, wrapping around the list
  const visibleQuotes = Array.from(
    { length: Math.min(pageSize, totalItems) },
    (_, offset) => quotes[(startIndex + offset) % totalItems],
  );

  const handleNext = () => {
    // Set direction for animation
    setSlideDirection('right');
    // Move window one quote to the right (like a slider)
    setStartIndex((prev) => (prev + 1) % totalItems);
  };

  const handlePrevious = () => {
    // Set direction for animation
    setSlideDirection('left');
    // Move window one quote to the left (like a slider)
    setStartIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  return (
    <section className="mb-4 sm:mb-6 lg:mb-8">
      <SectionHeader
        title={t('quotes.title', language)}
        subtitle={t('quotes.subtitle', language)}
      />

      {/* Cards row */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {visibleQuotes.map((quote) => (
          <article
            key={`${quote._id}-${startIndex}`}
            className={`relative bg-white rounded-3xl shadow-lg shadow-slate-900/5 border border-slate-200/80 px-6 sm:px-8 pt-8 pb-12 flex flex-col justify-between overflow-hidden ${
              slideDirection === 'right' ? 'quote-slide-right' : slideDirection === 'left' ? 'quote-slide-left' : ''
            }`}
          >
            {/* Decorative quotes */}
            <div className="absolute top-4 left-5 text-4xl text-primary-orange/25 select-none">
              “
            </div>
            <div className="absolute bottom-4 right-5 text-4xl text-primary-orange/20 select-none">
              ”
            </div>

            {/* Quote text */}
            <p className="relative z-10 text-sm sm:text-base text-primary-dark/80 leading-relaxed text-center mb-10 multilingual-text">
              {getLocalizedContent(quote.quote, language)}
            </p>

            {/* Avatar + author */}
            <div className="relative z-10 flex flex-col items-center mt-auto">
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-primary-orange/40 shadow-lg -mb-3 bg-gradient-to-tr from-primary-orange to-primary-gold flex items-center justify-center text-white text-xl font-bold">
                {quote.image ? (
                  <Image
                    src={quote.image}
                    alt={quote.author}
                    fill
                    className="object-cover"
                    sizes="80px"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                ) : (
                  <span>{quote.author.charAt(0).toUpperCase()}</span>
                )}
              </div>

              <div className="bg-transparent pt-5 text-center">
                <p className="text-sm sm:text-base font-semibold text-primary-dark">
                  {quote.author}
                </p>
                {quote.source && (
                  <p className="text-xs sm:text-sm text-primary-dark/60 multilingual-text mt-1">
                    {getLocalizedContent(quote.source, language)}
                  </p>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Bottom navigation (arrows + indicators) */}
      {totalItems > 1 && (
        <div className="mt-8 flex items-center justify-between max-w-xs mx-auto">
          <button
            onClick={handlePrevious}
            className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-primary-orange/40 bg-white shadow-md text-primary-orange"
            aria-label="Previous quotes"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-primary-orange/40 bg-white shadow-md text-primary-orange"
            aria-label="Next quotes"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
