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

// Mobile: 3-card strip (prev, current, next); each card = 100% viewport; offset % of strip width
const MOBILE_OFFSET_IDLE = -100 / 3;   // show middle card
const MOBILE_OFFSET_NEXT = (-200 / 3); // show next card (right)
const MOBILE_OFFSET_PREV = 0;           // show prev card (left)

export default function QuotesSection({ quotes, language }: QuotesSectionProps) {
  const isMobile = useIsMobile();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideOffset, setSlideOffset] = useState(SLIDE_OFFSET_IDLE);
  const [mobileSlideOffset, setMobileSlideOffset] = useState(MOBILE_OFFSET_IDLE);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [touchDragPct, setTouchDragPct] = useState(0);
  const pendingIndexRef = useRef<number>(0);
  const mobileStripRef = useRef<HTMLDivElement>(null);
  const mobileViewportRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchStartTimeRef = useRef(0);
  const touchDragPctRef = useRef(0);
  const isSnapBackRef = useRef(false);

  const totalItems = quotes?.length ?? 0;

  // Mobile: strip follows finger during drag; combine with slide offset when not dragging
  const mobileStripTranslate = isDragging
    ? MOBILE_OFFSET_IDLE + touchDragPct
    : mobileSlideOffset;

  const goTo = useCallback((direction: 'left' | 'right') => {
    if (totalItems <= 1 || isAnimating) return;
    const nextIndex = direction === 'right'
      ? (currentIndex + 1) % totalItems
      : (currentIndex - 1 + totalItems) % totalItems;
    if (isMobile) {
      pendingIndexRef.current = nextIndex;
      setIsAnimating(true);
      if (direction === 'right') {
        setMobileSlideOffset(MOBILE_OFFSET_NEXT); // slide left to show next
      } else {
        setMobileSlideOffset(MOBILE_OFFSET_PREV); // slide right to show prev
      }
      return;
    }
    pendingIndexRef.current = nextIndex;
    setIsAnimating(true);
    if (direction === 'right') {
      setSlideOffset(SLIDE_OFFSET_NEXT); // strip slides left: right card comes into focus
    } else {
      setSlideOffset(SLIDE_OFFSET_PREV); // strip slides right: left card comes into focus
    }
  }, [totalItems, currentIndex, isAnimating, isMobile]);

  const handleTransitionEnd = useCallback(() => {
    if (!isAnimating) return;
    if (isSnapBackRef.current) {
      isSnapBackRef.current = false;
      setIsAnimating(false);
      return;
    }
    setCurrentIndex(pendingIndexRef.current);
    setIsAnimating(false);
    if (isMobile) {
      requestAnimationFrame(() => setMobileSlideOffset(MOBILE_OFFSET_IDLE));
    } else {
      requestAnimationFrame(() => setSlideOffset(SLIDE_OFFSET_IDLE));
    }
  }, [isAnimating, isMobile]);

  // Swipe: distance threshold (% of card) or velocity (px/ms) – fast flicks change slide even if distance is short
  const SWIPE_DISTANCE_PCT = 12;
  const SWIPE_VELOCITY_PX_MS = 0.35;
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (totalItems <= 1) return;
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
      touchStartTimeRef.current = Date.now();
      setIsDragging(true);
      setTouchDragPct(0);
      touchDragPctRef.current = 0;
    },
    [totalItems]
  );
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging || totalItems <= 1) return;
      const viewport = mobileViewportRef.current;
      if (!viewport) return;
      const width = viewport.getBoundingClientRect().width;
      if (width <= 0) return;
      const deltaX = e.touches[0].clientX - touchStartXRef.current;
      const deltaY = e.touches[0].clientY - touchStartYRef.current;
      // Prefer horizontal: only follow if more horizontal than vertical (or already moved a bit horizontally)
      if (Math.abs(deltaX) < 8 && Math.abs(deltaY) > Math.abs(deltaX)) return;
      const pct = (-deltaX / width) * 100;
      const clamped = Math.max(-100 / 3, Math.min(100 / 3, pct));
      touchDragPctRef.current = clamped;
      setTouchDragPct(clamped);
    },
    [isDragging, totalItems]
  );
  const handleTouchEnd = useCallback(() => {
    if (!isDragging || totalItems <= 1) return;
    const pct = touchDragPctRef.current;
    const viewport = mobileViewportRef.current;
    const width = viewport?.getBoundingClientRect().width ?? 0;
    const deltaTime = Math.max(50, Date.now() - touchStartTimeRef.current);
    const deltaXpx = -pct * (width / 100);
    const velocity = deltaXpx / deltaTime;

    setIsDragging(false);
    setTouchDragPct(0);

    const shouldGoNext = pct > SWIPE_DISTANCE_PCT || velocity < -SWIPE_VELOCITY_PX_MS;
    const shouldGoPrev = pct < -SWIPE_DISTANCE_PCT || velocity > SWIPE_VELOCITY_PX_MS;

    if (shouldGoNext) {
      goTo('right');
    } else if (shouldGoPrev) {
      goTo('left');
    } else {
      isSnapBackRef.current = true;
      setIsAnimating(true);
      setMobileSlideOffset(MOBILE_OFFSET_IDLE + pct);
      requestAnimationFrame(() => {
        setMobileSlideOffset(MOBILE_OFFSET_IDLE);
      });
    }
  }, [isDragging, totalItems, goTo]);

  useEffect(() => {
    if (totalItems <= 1) return;
    const intervalId = window.setInterval(() => goTo('right'), 6000);
    return () => window.clearInterval(intervalId);
  }, [goTo, totalItems]);

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
        <div className={`flex flex-row flex-1 min-h-0 ${compact ? 'min-h-[208px]' : 'min-h-[280px]'} sm:min-h-[300px]`}>
          {/* Left: content – text justifies; quote area scrolls when long (desktop strip) */}
          <div className={`flex flex-1 min-w-0 min-h-0 flex-col ${compact ? 'p-3 pr-2' : 'py-3 px-4 sm:py-4 sm:px-5 md:px-6 pr-4 sm:pr-5'}`}>
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
          <div className={`relative flex-shrink-0 overflow-hidden self-stretch ${compact ? 'w-24 min-h-[208px]' : 'w-40 sm:w-44 md:w-48 min-h-0'} sm:w-44 md:w-48 sm:min-h-0`}>
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

          {/* Viewport: full width on mobile (no arrows); inset on desktop for arrows */}
          <div className="flex items-stretch justify-start w-full min-w-0 overflow-hidden ml-0 mr-0 sm:ml-[48px] sm:mr-[48px]">
            {isMobile && totalItems >= 1 ? (
              <div ref={mobileViewportRef} className="w-full min-w-0 overflow-hidden">
                {totalItems === 1 ? (
                  <div className="w-full px-2">
                    <QuoteCard quote={quotes[0]} isActive={true} position="center" allInFocus compact />
                  </div>
                ) : (
                  <div
                    ref={mobileStripRef}
                    className="flex flex-shrink-0 gap-0 will-change-transform"
                    style={{
                      width: '300%',
                      transform: `translateX(${mobileStripTranslate}%)`,
                      transition: isDragging ? 'none' : isAnimating ? `transform ${SLIDE_DURATION_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)` : 'none',
                      touchAction: 'pan-y',
                    }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchEnd}
                    onTransitionEnd={handleTransitionEnd}
                  >
                    <div className="flex-shrink-0 w-1/3 min-w-0 px-0.5">
                      <QuoteCard quote={quotes[prevIndex]} isActive={false} position="center" allInFocus compact />
                    </div>
                    <div className="flex-shrink-0 w-1/3 min-w-0 px-0.5">
                      <QuoteCard quote={quotes[currentIndex]} isActive={true} position="center" allInFocus compact />
                    </div>
                    <div className="flex-shrink-0 w-1/3 min-w-0 px-0.5">
                      <QuoteCard quote={quotes[nextIndex]} isActive={false} position="center" allInFocus compact />
                    </div>
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
                if (i === currentIndex || isAnimating) return;
                setCurrentIndex(i);
                if (isMobile) {
                  setIsDragging(false);
                  setTouchDragPct(0);
                  touchDragPctRef.current = 0;
                  setMobileSlideOffset(MOBILE_OFFSET_IDLE);
                } else if (totalItems >= 3) {
                  setSlideOffset(SLIDE_OFFSET_IDLE);
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
