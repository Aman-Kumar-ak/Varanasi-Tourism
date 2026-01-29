'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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

  const SLIDE_ANIMATION_MS = 420; // Keep in sync with `globals.css`
  const slideResetTimerRef = useRef<number | null>(null);

  const totalItems = quotes?.length ?? 0;

  // Use one shared function for both manual + auto slide so animation is identical.
  // NOTE: "right" means the next item enters from the right (cards appear to move left).
  const advance = useCallback(
    (direction: 'left' | 'right') => {
      if (totalItems <= 1) return;
      setSlideDirection(direction);
      setStartIndex((prev) => {
        if (direction === 'right') return (prev + 1) % totalItems;
        return (prev - 1 + totalItems) % totalItems;
      });
    },
    [totalItems],
  );

  // Auto-slide every 6 seconds (to the left)
  useEffect(() => {
    if (totalItems <= 1) return;

    const intervalId = window.setInterval(() => {
      // Same behavior as clicking the "Next" arrow:
      // cards visually move left, next card enters from the right.
      advance('right');
    }, 6000);

    return () => window.clearInterval(intervalId);
  }, [advance, totalItems]);

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

  // Reset slide direction after animation completes.
  // Use a single timer keyed only on `slideDirection` so it doesn't get re-triggered
  // by unrelated renders; this keeps the CSS animation and state in sync.
  useEffect(() => {
    if (slideResetTimerRef.current !== null) {
      window.clearTimeout(slideResetTimerRef.current);
      slideResetTimerRef.current = null;
    }

    if (slideDirection === null) return;

    slideResetTimerRef.current = window.setTimeout(() => {
      setSlideDirection(null);
      slideResetTimerRef.current = null;
    }, SLIDE_ANIMATION_MS);

    return () => {
      if (slideResetTimerRef.current !== null) {
        window.clearTimeout(slideResetTimerRef.current);
        slideResetTimerRef.current = null;
      }
    };
  }, [slideDirection]);

  if (!quotes || totalItems === 0) {
    return null;
  }

  // Build a sliding window of pageSize quotes, wrapping around the list
  const visibleQuotes = Array.from(
    { length: Math.min(pageSize, totalItems) },
    (_, offset) => quotes[(startIndex + offset) % totalItems],
  );

  const handleNext = () => {
    advance('right');
  };

  const handlePrevious = () => {
    advance('left');
  };

  return (
    <section className="mb-6 sm:mb-8 lg:mb-10">
      <SectionHeader
        title={t('quotes.title', language)}
        subtitle={t('quotes.subtitle', language)}
      />

      {/* Background panel to visually group the quotes */}
      <div className="mt-3 sm:mt-4 rounded-3xl bg-white/60 border border-primary-gold/10 shadow-temple px-3 sm:px-4 py-4 sm:py-6">
        {/* Cards row */}
        <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 md:grid-cols-3 items-stretch">
          {visibleQuotes.map((quote) => (
            <article
              key={`${quote._id}-${startIndex}`}
              className={`group relative bg-gradient-to-b from-background-cream to-white rounded-2xl shadow-card border border-slate-200/70 px-5 sm:px-6 pt-5 pb-6 flex flex-col overflow-hidden min-h-[260px] sm:min-h-[270px] ${
                slideDirection === 'right' ? 'quote-slide-right' : slideDirection === 'left' ? 'quote-slide-left' : ''
              }`}
            >
              {/* Soft decorative glow */}
              <div className="pointer-events-none absolute -top-14 -right-10 h-32 w-32 rounded-full bg-gradient-temple opacity-10 blur-2xl" />

              {/* Top accent bar */}
              <div className="relative z-10 h-1 w-16 mx-auto mb-4 rounded-full bg-gradient-temple opacity-70" />

              {/* Decorative quotes */}
              <div className="absolute top-4 left-4 text-3xl sm:text-4xl text-primary-orange/25 select-none">
                “
              </div>
              <div className="absolute bottom-4 right-4 text-3xl sm:text-4xl text-primary-orange/20 select-none">
                ”
              </div>

              {/* Quote text */}
              <p className="relative z-10 text-sm sm:text-base text-primary-dark/80 leading-relaxed text-center mb-4 sm:mb-5 px-6 sm:px-8 multilingual-text italic text-balance break-words">
                {getLocalizedContent(quote.quote, language)}
              </p>

              {/* Divider between quote and author */}
              <div className="relative z-10 w-10 h-px mx-auto mb-4 bg-gradient-to-r from-transparent via-primary-gold/60 to-transparent" />

              {/* Avatar + author */}
              <div className="relative z-10 flex flex-col items-center mt-auto">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-[68px] md:h-[68px] rounded-full overflow-hidden border-[3px] border-primary-orange/40 shadow-md bg-gradient-to-tr from-primary-orange to-primary-gold flex items-center justify-center text-white text-lg sm:text-xl font-bold">
                  {quote.image ? (
                    <Image
                      src={quote.image}
                      alt={quote.author}
                      fill
                      className="object-cover"
                      sizes="72px"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span>{quote.author.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                <div className="bg-transparent pt-3 text-center">
                  <p className="text-sm sm:text-base font-semibold text-primary-dark leading-tight">
                    {quote.author}
                  </p>
                  {quote.source && (
                    <p className="text-xs sm:text-sm text-primary-dark/60 multilingual-text mt-1 leading-snug">
                      {getLocalizedContent(quote.source, language)}
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom navigation (arrows) */}
        {totalItems > 1 && (
          <div className="mt-5 sm:mt-6 flex items-center justify-between max-w-xs mx-auto">
            <button
              onClick={handlePrevious}
              className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-primary-orange/40 bg-white shadow-md text-primary-orange touch-manipulation"
              aria-label="Previous quotes"
            >
              <svg
                className="w-5 h-5 sm:w-5 sm:h-5"
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
              className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-primary-orange/40 bg-white shadow-md text-primary-orange touch-manipulation"
              aria-label="Next quotes"
            >
              <svg
                className="w-5 h-5 sm:w-5 sm:h-5"
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
      </div>
    </section>
  );
}
