'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { getLocalizedContent } from '@/lib/i18n';
import type { LanguageCode } from '@/lib/constants';
import { t } from '@/lib/translations';
import SectionHeader from './SectionHeader';

const MOBILE_BREAKPOINT = 640; // Tailwind sm

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);
  return isMobile;
}

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
  image: string;
  order: number;
}

interface QuotesSectionProps {
  quotes: Quote[];
  language: LanguageCode;
}

const SLIDE_DURATION_MS = 450;
// 7-card strip: viewport shows 2.5 cards; offset so ~75% of left card + full center + ~75% of right (symmetric).
const NUM_STRIP_CARDS = 7;
const CARD_WIDTH_PCT = 100 / NUM_STRIP_CARDS; // % of strip per card
const SLIDE_OFFSET_IDLE = -2.25 * CARD_WIDTH_PCT; // symmetric: ~3/4 of 2, full 3, ~3/4 of 4
const SLIDE_OFFSET_NEXT = -3.25 * CARD_WIDTH_PCT; // after "next": ~3/4 of 3, full 4, ~3/4 of 5
const SLIDE_OFFSET_PREV = -1.25 * CARD_WIDTH_PCT; // after "prev": ~3/4 of 1, full 2, ~3/4 of 3
const STRIP_WIDTH_PCT = NUM_STRIP_CARDS * 40; // 280% so each card = 40% viewport (wider)

export default function QuotesSection({ quotes, language }: QuotesSectionProps) {
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideOffset, setSlideOffset] = useState(SLIDE_OFFSET_IDLE);
  const [isAnimating, setIsAnimating] = useState(false);
  const pendingIndexRef = useRef<number>(0);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const mobileScrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isUserScrollingRef = useRef<boolean>(false);
  const autoScrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isProgrammaticScrollRef = useRef<boolean>(false);

  const totalItems = quotes?.length ?? 0;

  const goTo = useCallback((direction: 'left' | 'right') => {
    if (totalItems <= 1) return;
    const nextIndex = direction === 'right'
      ? (currentIndex + 1) % totalItems
      : (currentIndex - 1 + totalItems) % totalItems;
    if (isMobile) {
      const el = mobileScrollRef.current;
      if (el) {
        const w = el.getBoundingClientRect().width;
        // Mark as programmatic scroll to prevent handleMobileScroll from interfering
        isProgrammaticScrollRef.current = true;
        // Update currentIndex immediately to keep dots in sync
        setCurrentIndex(nextIndex);
        el.scrollTo({ left: nextIndex * w, behavior: 'smooth' });
        // Reset flag after scroll completes
        setTimeout(() => {
          isProgrammaticScrollRef.current = false;
        }, 500);
      }
      return;
    }
    if (isAnimating) return;
    pendingIndexRef.current = nextIndex;
    setIsAnimating(true);
    if (direction === 'right') {
      setSlideOffset(SLIDE_OFFSET_NEXT);
    } else {
      setSlideOffset(SLIDE_OFFSET_PREV);
    }
  }, [totalItems, currentIndex, isAnimating, isMobile]);

  const handleTransitionEnd = useCallback(() => {
    if (!isAnimating) return;
    setCurrentIndex(pendingIndexRef.current);
    setIsAnimating(false);
    requestAnimationFrame(() => setSlideOffset(SLIDE_OFFSET_IDLE));
  }, [isAnimating]);

  // Mobile: sync currentIndex from scroll position when user swipes (scroll-snap carousel)
  const handleMobileScroll = useCallback(() => {
    const el = mobileScrollRef.current;
    if (!el || totalItems <= 1) return;
    const w = el.getBoundingClientRect().width;
    if (w <= 0) return;
    
    // Only mark as user scrolling if it's not a programmatic scroll
    if (!isProgrammaticScrollRef.current) {
      isUserScrollingRef.current = true;
      if (autoScrollTimeoutRef.current) {
        clearTimeout(autoScrollTimeoutRef.current);
        autoScrollTimeoutRef.current = null;
      }
    }
    
    // Use a more accurate calculation with threshold to prevent mid-scroll updates
    const scrollLeft = el.scrollLeft;
    const index = Math.round(scrollLeft / w);
    const clamped = Math.max(0, Math.min(index, totalItems - 1));
    // Only update if we're close enough to the snap point (within 10% of card width)
    const threshold = w * 0.1;
    const expectedScrollLeft = clamped * w;
    if (Math.abs(scrollLeft - expectedScrollLeft) <= threshold) {
      setCurrentIndex((prev) => {
        // Only update if different to avoid unnecessary re-renders
        return prev !== clamped ? clamped : prev;
      });
    }
  }, [totalItems]);

  // Mobile: sync currentIndex when scroll ends (scrollend if supported, else debounced scroll)
  useEffect(() => {
    if (!isMobile || totalItems <= 1) return;
    const el = mobileScrollRef.current;
    if (!el) return;
    
    let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    
    const onScrollEnd = () => {
      // Clear any pending timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
        scrollTimeout = null;
      }
      const w = el.getBoundingClientRect().width;
      if (w <= 0) return;
      const scrollLeft = el.scrollLeft;
      const index = Math.round(scrollLeft / w);
      const clamped = Math.max(0, Math.min(index, totalItems - 1));
      setCurrentIndex(clamped);
      // Reset user scrolling flag after a delay to allow auto-scroll to resume
      isUserScrollingRef.current = false;
      autoScrollTimeoutRef.current = setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 1000);
    };
    
    // Fallback for browsers that don't support scrollend
    const onScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const w = el.getBoundingClientRect().width;
        if (w <= 0) return;
        const scrollLeft = el.scrollLeft;
        const index = Math.round(scrollLeft / w);
        const clamped = Math.max(0, Math.min(index, totalItems - 1));
        setCurrentIndex(clamped);
        // Reset user scrolling flag after a delay to allow auto-scroll to resume
        isUserScrollingRef.current = false;
        autoScrollTimeoutRef.current = setTimeout(() => {
          isUserScrollingRef.current = false;
        }, 1000);
      }, 150); // 150ms debounce for scroll end detection
    };
    
    // Try scrollend first (more reliable)
    if ('onscrollend' in el) {
      el.addEventListener('scrollend', onScrollEnd);
    } else {
      el.addEventListener('scroll', onScroll);
    }
    
    return () => {
      if ('onscrollend' in el) {
        el.removeEventListener('scrollend', onScrollEnd);
      } else {
        el.removeEventListener('scroll', onScroll);
      }
      if (scrollTimeout) clearTimeout(scrollTimeout);
      if (autoScrollTimeoutRef.current) clearTimeout(autoScrollTimeoutRef.current);
    };
  }, [isMobile, totalItems]);

  useEffect(() => {
    return () => {};
  }, []);

  useEffect(() => {
    if (totalItems <= 1) return;
    const intervalId = window.setInterval(() => {
      // Skip auto-scroll if user is manually scrolling (mobile only)
      if (isMobile && isUserScrollingRef.current) {
        return;
      }
      goTo('right');
    }, 6000);
    return () => window.clearInterval(intervalId);
  }, [goTo, totalItems, isMobile]);

  // Preload images for all quotes so no blank/empty during carousel transition
  useEffect(() => {
    if (!quotes?.length) return;
    quotes.forEach((q) => {
      if (q.image) {
        const img = new window.Image();
        img.src = q.image;
      }
    });
  }, [quotes]);

  if (!quotes || totalItems === 0) return null;

  const prevIndex = (currentIndex - 1 + totalItems) % totalItems;
  const nextIndex = (currentIndex + 1) % totalItems;
  // 7-card strip: all adjacent cards pre-rendered so no empty space during slide
  const stripIndices = totalItems >= 3
    ? Array.from({ length: NUM_STRIP_CARDS }, (_, i) => (currentIndex - 3 + i + totalItems) % totalItems)
    : [];

  function QuoteCard({
    quote,
    isActive,
    position,
    allInFocus,
    compact,
  }: {
    quote: Quote;
    isActive: boolean;
    position: 'left' | 'center' | 'right';
    allInFocus?: boolean;
    compact?: boolean;
  }) {
    return (
      <article
        className={`w-full h-full flex flex-col min-h-0 rounded-2xl bg-[#FDF2EB] border border-[#E8D9D0] overflow-hidden transition-all duration-300 ease-out ${compact ? 'rounded-xl' : ''} ${
          allInFocus || isActive
            ? 'scale-100 opacity-100 z-10'
            : position === 'left'
              ? 'scale-90 opacity-55 z-0'
              : 'scale-90 opacity-55 z-0'
        }`}
      >
        <div className={`flex flex-row flex-1 min-h-0 ${compact ? 'min-h-[180px]' : 'min-h-[240px]'} sm:min-h-[260px]`}>
          {/* Left: content – text justifies; quote area scrolls when long (desktop strip) */}
          <div className={`flex flex-1 min-w-0 min-h-0 flex-col ${compact ? 'p-2 pr-2' : 'py-2 px-3 sm:py-2.5 sm:px-4 md:px-5 pr-3 sm:pr-4'}`}>
            {/* Author name – top of content block */}
            <p className={`flex-shrink-0 ${compact ? 'text-base' : 'text-lg sm:text-xl'} font-bold text-amber-600 multilingual-text mb-0.5`}>
              {quote.author}
            </p>
            {quote.source && (
              <p className={`flex-shrink-0 ${compact ? 'text-xs' : 'text-sm'} text-primary-dark/60 multilingual-text ${compact ? 'mb-1' : 'mb-2'}`}>
                {getLocalizedContent(quote.source, language)}
              </p>
            )}
            <div className={`flex-shrink-0 ${compact ? 'w-8' : 'w-10'} h-px bg-slate-200 ${compact ? 'mb-1' : 'mb-2'}`} aria-hidden />
            {/* Quote – justified; scrolls inside card when content overflows (symmetric card height) */}
            <p className={`flex-1 min-h-0 overflow-y-auto ${compact ? 'text-[13px] leading-snug overflow-hidden' : 'text-sm sm:text-base leading-relaxed'} text-justify multilingual-text break-words`}>
              {getLocalizedContent(quote.quote, language)}
            </p>
          </div>

          {/* Right: full-height image; on mobile (compact) use smaller width */}
          <div className={`relative flex-shrink-0 overflow-hidden self-stretch ${compact ? 'w-28 min-h-[180px]' : 'w-44 sm:w-48 md:w-52 min-h-0'} sm:w-48 md:w-52 sm:min-h-0`}>
            {quote.image ? (
              <Image
                src={quote.image}
                alt={quote.author}
                fill
                className="object-cover"
                sizes="(max-width: 639px) 96px, 192px"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full bg-amber-100 flex items-center justify-center text-amber-700 text-2xl font-bold">
                {quote.author.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <section className="mb-6 animate-fade-in-up" aria-labelledby="quotes-heading">
      <SectionHeader
        title={t('quotes.title', language)}
        icon="💬"
        subtitle={t('quotes.subtitle', language)}
      />

      {/* Carousel panel – warm cream/peach; section and cards match */}
      <div className="relative rounded-2xl overflow-hidden bg-[#FFF8F5] border border-[#EDE0DB] py-3 sm:py-4 px-2 sm:px-4 w-full -mt-2 sm:-mt-3">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#FFF0EB] rounded-full -mr-20 -mt-20 pointer-events-none" aria-hidden />
        <div className="quotes-carousel-arrows relative flex items-center justify-center min-h-0 sm:min-h-[280px] px-2 sm:px-6 z-10">
          {totalItems > 1 && (
            <>
              <button
                type="button"
                onClick={() => goTo('left')}
                disabled={isAnimating}
                className="quotes-arrow-btn absolute left-0 top-1/2 -translate-y-1/2 z-20 rounded-full bg-[#B45309] text-white border border-[#92400E] hover:bg-[#92400E] hover:border-[#78350F] active:scale-95 transition-all duration-200 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-[#92400E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F5] disabled:opacity-60 disabled:pointer-events-none hidden sm:flex items-center justify-center flex-shrink-0"
                style={{ width: 'var(--quotes-arrow-size)', height: 'var(--quotes-arrow-size)', minWidth: 'var(--quotes-arrow-size)', minHeight: 'var(--quotes-arrow-size)' }}
                aria-label="Previous quote"
              >
                <svg className="quotes-arrow-icon flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => goTo('right')}
                disabled={isAnimating}
                className="quotes-arrow-btn absolute right-0 top-1/2 -translate-y-1/2 z-20 rounded-full bg-[#B45309] text-white border border-[#92400E] hidden sm:flex hover:bg-[#92400E] hover:border-[#78350F] active:scale-95 transition-all duration-200 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-[#92400E] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F5] disabled:opacity-60 disabled:pointer-events-none flex items-center justify-center flex-shrink-0"
                style={{ width: 'var(--quotes-arrow-size)', height: 'var(--quotes-arrow-size)', minWidth: 'var(--quotes-arrow-size)', minHeight: 'var(--quotes-arrow-size)' }}
                aria-label="Next quote"
              >
                <svg className="quotes-arrow-icon flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Viewport: full width on mobile (no arrows); inset on desktop for arrows; rounded corners match cards at left/right edges */}
          <div className="flex items-stretch justify-start w-full min-w-0 overflow-hidden rounded-2xl ml-0 mr-0 sm:ml-[48px] sm:mr-[48px]">
            {isMobile && totalItems >= 1 ? (
              <div className="w-full min-w-0 overflow-hidden">
                {totalItems === 1 ? (
                  <div className="w-full px-2">
                    <QuoteCard quote={quotes[0]} isActive={true} position="center" allInFocus compact />
                  </div>
                ) : (
                  <div
                    ref={mobileScrollRef}
                    className="quotes-mobile-scroll flex w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth"
                    style={{
                      WebkitOverflowScrolling: 'touch',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      touchAction: 'pan-x',
                    }}
                    onScroll={handleMobileScroll}
                  >
                    {quotes.map((quote, i) => (
                      <div
                        key={quote._id}
                        className="flex-shrink-0 w-full min-w-full snap-center px-2"
                        style={{ scrollSnapStop: 'always' }}
                      >
                        <QuoteCard
                          quote={quote}
                          isActive={i === currentIndex}
                          position="center"
                          allInFocus
                          compact
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : totalItems >= 3 ? (
              <div
                className="quotes-strip flex items-stretch flex-shrink-0 gap-0 will-change-transform"
                style={{
                  width: `${STRIP_WIDTH_PCT}%`,
                  transform: `translateX(${slideOffset}%)`,
                  transition: isAnimating ? `transform ${SLIDE_DURATION_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)` : 'none',
                }}
                onTransitionEnd={handleTransitionEnd}
              >
                {stripIndices.map((quoteIdx, i) => (
                  <div key={`${quoteIdx}-${i}`} className="flex h-full flex-shrink-0 px-1 sm:px-2 min-h-0" style={{ width: `${CARD_WIDTH_PCT}%`, minWidth: `${CARD_WIDTH_PCT}%` }}>
                    <QuoteCard
                      quote={quotes[quoteIdx]}
                      isActive={i === 3}
                      position={i < 3 ? 'left' : i === 3 ? 'center' : 'right'}
                      allInFocus
                    />
                  </div>
                ))}
              </div>
            ) : totalItems === 2 ? (
              <div className="flex items-stretch justify-center gap-3 sm:gap-4 md:gap-4 w-full">
                <div className="hidden sm:flex sm:h-full w-[32%] max-w-[320px] flex-shrink-0 justify-end">
                  <QuoteCard quote={quotes[prevIndex]} isActive={false} position="left" allInFocus />
                </div>
                <div className="flex flex-1 min-w-0 max-w-xl mx-auto sm:mx-0 sm:w-[36%] flex-shrink-0 h-full min-h-0">
                  <QuoteCard quote={quotes[currentIndex]} isActive={true} position="center" allInFocus />
                </div>
                <div className="hidden sm:flex sm:h-full w-[32%] max-w-[320px] flex-shrink-0 justify-start">
                  <QuoteCard quote={quotes[nextIndex]} isActive={false} position="right" allInFocus />
                </div>
              </div>
            ) : (
              <div className="w-full max-w-xl mx-auto">
                <QuoteCard quote={quotes[currentIndex]} isActive={true} position="center" />
              </div>
            )}
          </div>

        </div>

        {/* Carousel dots – reimplemented: small on mobile, larger from sm */}
        {totalItems > 1 && (
          <div
            className="quotes-carousel-dots flex items-center justify-center mt-2 sm:mt-3 pb-1 sm:pb-0"
            role="tablist"
            aria-label="Quote slides"
          >
            {quotes.map((_, i) => {
              const goToSlide = () => {
                if (i === currentIndex) return;
                if (isMobile) {
                  const el = mobileScrollRef.current;
                  if (el) {
                    const w = el.getBoundingClientRect().width;
                    // Mark as programmatic scroll
                    isProgrammaticScrollRef.current = true;
                    // Update index immediately to keep dots in sync
                    setCurrentIndex(i);
                    el.scrollTo({ left: i * w, behavior: 'smooth' });
                    // Reset flag after scroll completes
                    setTimeout(() => {
                      isProgrammaticScrollRef.current = false;
                    }, 500);
                  }
                } else {
                  if (isAnimating) return;
                  setCurrentIndex(i);
                  if (totalItems >= 3) setSlideOffset(SLIDE_OFFSET_IDLE);
                }
              };
              return (
              <button
                key={i}
                type="button"
                role="tab"
                tabIndex={i === currentIndex ? 0 : -1}
                aria-label={`Quote ${i + 1}`}
                aria-selected={i === currentIndex}
                onClick={goToSlide}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  goToSlide();
                }}
                className="quotes-carousel-dot rounded-full flex-shrink-0 transition-all duration-200 touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B45309] focus-visible:ring-offset-1"
                style={{
                  width: 'var(--dot-size, 6px)',
                  height: 'var(--dot-size, 6px)',
                  minWidth: 'var(--dot-size, 6px)',
                  minHeight: 'var(--dot-size, 6px)',
                  backgroundColor: i === currentIndex ? '#B45309' : 'transparent',
                  border: i === currentIndex ? 'none' : '1.5px solid rgba(0,0,0,0.25)',
                }}
              />
            );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
