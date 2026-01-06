'use client';

import { useEffect, useRef, useState } from 'react';
import PlaceCard from './PlaceCard';
import type { LanguageCode } from '@/lib/constants';

interface Place {
  name: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  description: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  image?: string;
  location?: {
    lat: number;
    lng: number;
  };
  category?: 'temple' | 'ghat' | 'monument' | 'market' | 'museum' | 'other';
  spiritualImportance?: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  bestTimeToVisit?: string;
  visitDuration?: string;
}

interface PlacesCarouselProps {
  places: Place[];
  language: LanguageCode;
}

export default function PlacesCarousel({ places, language }: PlacesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentIndexRef = useRef(0);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTransitioningRef = useRef(false);

  // Keep ref in sync with state
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Clear auto-play interval helper
  const clearAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  };

  // Clear resume timeout helper
  const clearResumeTimeout = () => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  };

  // Scroll to a specific index
  const scrollToIndex = (index: number, smooth: boolean = true) => {
    if (!scrollContainerRef.current || places.length === 0) return;
    
    const container = scrollContainerRef.current;
    const cards = container.children;
    
    // Account for duplicate last card at start - real cards start at index 1
    const realCardIndex = index + 1;
    
    if (cards[realCardIndex]) {
      const card = cards[realCardIndex] as HTMLElement;
      // Use offsetLeft which includes gap spacing
      const scrollPosition = card.offsetLeft;
      
      container.scrollTo({
        left: scrollPosition,
        behavior: smooth ? 'smooth' : 'auto',
      });
      
      setCurrentIndex(index);
    }
  };

  // Navigate to next slide
  const goToNext = () => {
    if (isTransitioningRef.current) return;
    
    setIsAutoPlaying(false);
    clearAutoPlay();
    clearResumeTimeout();
    
    const nextIndex = (currentIndex + 1) % places.length;
    
    // Check if we're moving to the duplicate first card at the end
    if (nextIndex === 0 && currentIndex === places.length - 1) {
      isTransitioningRef.current = true;
      scrollToIndex(nextIndex, true);
      
      // After scroll animation completes, jump to real first card
          setTimeout(() => {
            if (scrollContainerRef.current) {
              const container = scrollContainerRef.current;
              const cards = container.children;
              if (cards[1]) {
                const firstCard = cards[1] as HTMLElement;
                // Use offsetLeft which includes gap spacing
                container.scrollTo({
                  left: firstCard.offsetLeft,
                  behavior: 'auto',
                });
                isTransitioningRef.current = false;
              }
            }
          }, 500);
    } else {
      scrollToIndex(nextIndex, true);
    }
    
    // Resume auto-play after 3 seconds
    resumeTimeoutRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 3000);
  };

  // Navigate to previous slide
  const goToPrevious = () => {
    if (isTransitioningRef.current) return;
    
    setIsAutoPlaying(false);
    clearAutoPlay();
    clearResumeTimeout();
    
    const prevIndex = (currentIndex - 1 + places.length) % places.length;
    scrollToIndex(prevIndex, true);
    
    // Resume auto-play after 3 seconds
    resumeTimeoutRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 3000);
  };

  // Initialize scroll position to first real card
  useEffect(() => {
    if (scrollContainerRef.current && places.length > 0) {
      const container = scrollContainerRef.current;
      const cards = container.children;
      if (cards[1]) {
        const firstCard = cards[1] as HTMLElement;
        // Use offsetLeft which includes gap spacing
        container.scrollLeft = firstCard.offsetLeft;
      }
    }
  }, [places.length]);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoPlaying || places.length <= 1) {
      clearAutoPlay();
      return;
    }

    const interval = setInterval(() => {
      if (!isTransitioningRef.current) {
        const currentIdx = currentIndexRef.current;
        const nextIndex = (currentIdx + 1) % places.length;
        
        if (nextIndex === 0 && currentIdx === places.length - 1) {
          isTransitioningRef.current = true;
          scrollToIndex(nextIndex, true);
          
          setTimeout(() => {
            if (scrollContainerRef.current) {
              const container = scrollContainerRef.current;
              const cards = container.children;
              if (cards[1]) {
                const firstCard = cards[1] as HTMLElement;
                // Use offsetLeft which includes gap spacing
                container.scrollTo({
                  left: firstCard.offsetLeft,
                  behavior: 'auto',
                });
                isTransitioningRef.current = false;
              }
            }
          }, 500);
        } else {
          scrollToIndex(nextIndex, true);
        }
      }
    }, 4000);

    autoPlayRef.current = interval;

    return () => {
      clearAutoPlay();
      clearResumeTimeout();
    };
  }, [isAutoPlaying, places.length]);

  // Arrow icon component
  const ArrowIcon = ({ direction }: { direction: 'left' | 'right' }) => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
    >
      {direction === 'left' ? (
        <path
          d="M15 18L9 12L15 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M9 18L15 12L9 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );

  return (
    <div className="relative">
      {/* Mobile: Horizontal Scrollable Carousel */}
      <div className="sm:hidden">
        {/* Navigation Buttons */}
        {places.length > 1 && (
          <>
            {/* Left Button */}
            <button
              onClick={goToPrevious}
              className="absolute left-2 bottom-4 z-20 bg-gradient-to-br from-white to-primary-gold/10 backdrop-blur-md rounded-full p-1.5 shadow-lg hover:shadow-xl active:scale-90 transition-all duration-300 flex items-center justify-center border border-primary-gold/30 hover:border-primary-gold/50 group"
              aria-label="Previous slide"
              style={{ 
                boxShadow: '0 4px 12px rgba(255, 184, 0, 0.2), 0 2px 6px rgba(0, 0, 0, 0.08)',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
            >
              <div className="text-primary-gold group-active:text-primary-saffron transition-colors">
                <ArrowIcon direction="left" />
              </div>
            </button>

            {/* Right Button */}
            <button
              onClick={goToNext}
              className="absolute right-2 bottom-4 z-20 bg-gradient-to-br from-white to-primary-gold/10 backdrop-blur-md rounded-full p-1.5 shadow-lg hover:shadow-xl active:scale-90 transition-all duration-300 flex items-center justify-center border border-primary-gold/30 hover:border-primary-gold/50 group"
              aria-label="Next slide"
              style={{ 
                boxShadow: '0 4px 12px rgba(255, 184, 0, 0.2), 0 2px 6px rgba(0, 0, 0, 0.08)',
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation'
              }}
            >
              <div className="text-primary-gold group-active:text-primary-saffron transition-colors">
                <ArrowIcon direction="right" />
              </div>
            </button>
          </>
        )}

        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide gap-4"
            style={{ 
              scrollBehavior: 'smooth',
              WebkitTapHighlightColor: 'transparent',
              touchAction: 'pan-y pinch-zoom'
            }}
          >
            {/* Duplicate last card at the beginning for seamless loop */}
            {places.length > 0 && (
              <div
                key={`duplicate-last-${places.length - 1}`}
                className="flex-shrink-0 w-full"
              >
                <PlaceCard place={places[places.length - 1]} language={language} />
              </div>
            )}
            
            {/* Original cards */}
            {places.map((place, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-full"
              >
                <PlaceCard place={place} language={language} />
              </div>
            ))}
            
            {/* Duplicate first card at the end for seamless loop */}
            {places.length > 0 && (
              <div
                key={`duplicate-first-0`}
                className="flex-shrink-0 w-full"
              >
                <PlaceCard place={places[0]} language={language} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop: Grid Layout */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {places.map((place, index) => (
          <PlaceCard key={index} place={place} language={language} />
        ))}
      </div>
    </div>
  );
}

