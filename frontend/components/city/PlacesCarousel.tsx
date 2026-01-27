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

  return (
    <div className="relative">
      {/* Mobile: Horizontal Scrollable Carousel */}
      <div className="sm:hidden">
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

        {/* Bottom Navigation Buttons - Similar to Quotes Section */}
        {places.length > 1 && (
          <div className="mt-6 sm:mt-8 flex items-center justify-between max-w-xs mx-auto">
            <button
              onClick={goToPrevious}
              className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-primary-saffron/40 bg-white shadow-md text-primary-saffron hover:bg-primary-saffron/10 active:scale-95 transition-all duration-300 outline-none focus:outline-none focus-visible:outline-none"
              style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
              aria-label="Previous slide"
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
              onClick={goToNext}
              className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-primary-saffron/40 bg-white shadow-md text-primary-saffron hover:bg-primary-saffron/10 active:scale-95 transition-all duration-300 outline-none focus:outline-none focus-visible:outline-none"
              style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}
              aria-label="Next slide"
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

