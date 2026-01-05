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
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const currentIndexRef = useRef(0);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);

  // Keep ref in sync with state
  useEffect(() => {
    previousIndexRef.current = currentIndexRef.current;
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

  // Initialize scroll position to first real card (skip duplicate last card)
  useEffect(() => {
    if (scrollContainerRef.current && places.length > 0) {
      const container = scrollContainerRef.current;
      const cards = container.children;
      // Scroll to first real card (index 1, after duplicate last card)
      if (cards[1]) {
        const firstCard = cards[1] as HTMLElement;
        const cardLeft = firstCard.offsetLeft;
        const cardWidth = firstCard.offsetWidth;
        const containerWidth = container.offsetWidth;
        const scrollPosition = cardLeft - (containerWidth - cardWidth) / 2;
        container.scrollLeft = Math.max(0, scrollPosition);
      }
    }
  }, [places.length]);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoPlaying || isUserInteracting || places.length <= 1) {
      clearAutoPlay();
      return;
    }

    // Start auto-play from current position    
    const interval = setInterval(() => {
      // Double check user is not interacting before auto-scrolling
      if (!isUserInteracting && scrollContainerRef.current && !isTransitioningRef.current) {
        const container = scrollContainerRef.current;
        const cards = container.children;
        const currentIdx = currentIndexRef.current;
        const nextIndex = (currentIdx + 1) % places.length;
        
        // Calculate the actual card index in the DOM (accounting for duplicate last card at start)
        // Real cards start at index 1 (after duplicate last card)
        const realCardIndex = nextIndex + 1;
        
        if (cards[realCardIndex]) {
          const card = cards[realCardIndex] as HTMLElement;
          const cardLeft = card.offsetLeft;
          const cardWidth = card.offsetWidth;
          const containerWidth = container.offsetWidth;
          const scrollPosition = cardLeft - (containerWidth - cardWidth) / 2;
          
          // Check if we're moving to the duplicate first card at the end
          if (nextIndex === 0 && currentIdx === places.length - 1) {
            // We're at the duplicate first card - after scroll completes, jump to real first card
            isTransitioningRef.current = true;
            
            container.scrollTo({
              left: Math.max(0, scrollPosition),
              behavior: 'smooth',
            });
            
            // After scroll animation completes, instantly jump to real first card
            setTimeout(() => {
              if (scrollContainerRef.current && cards[1]) {
                const firstCard = cards[1] as HTMLElement;
                const firstCardLeft = firstCard.offsetLeft;
                const firstCardWidth = firstCard.offsetWidth;
                const containerWidth = scrollContainerRef.current.offsetWidth;
                const firstScrollPosition = firstCardLeft - (containerWidth - firstCardWidth) / 2;
                
                // Instantly jump to real first card without animation
                scrollContainerRef.current.scrollTo({
                  left: Math.max(0, firstScrollPosition),
                  behavior: 'auto',
                });
                isTransitioningRef.current = false;
              }
            }, 500); // Wait for smooth scroll to complete
          } else {
            // Normal forward scroll
            container.scrollTo({
              left: Math.max(0, scrollPosition),
              behavior: 'smooth',
            });
          }
          
          setCurrentIndex(nextIndex);
        }
      }
    }, 4000); // Change slide every 4 seconds

    autoPlayRef.current = interval;

    return () => {
      clearAutoPlay();
      clearResumeTimeout();
    };
  }, [isAutoPlaying, isUserInteracting, places.length]);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsUserInteracting(true);
    setIsAutoPlaying(false);
    clearAutoPlay();
    clearResumeTimeout();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    // User is actively touching, keep auto-play disabled
    setIsUserInteracting(true);
  };

  const handleTouchEnd = () => {
    setIsUserInteracting(false);
    
    if (!touchStartX.current || !touchEndX.current) {
      touchStartX.current = 0;
      touchEndX.current = 0;
      // Resume auto-play after a delay, starting from current position
      clearResumeTimeout();
      resumeTimeoutRef.current = setTimeout(() => {
        setIsAutoPlaying(true);
      }, 3000);
      return;
    }

    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cards = container.children;
      let targetIndex = currentIndex;
      
      if (distance > minSwipeDistance) {
        // Swipe left - next
        targetIndex = (currentIndex + 1) % places.length;
      } else if (distance < -minSwipeDistance) {
        // Swipe right - previous
        targetIndex = (currentIndex - 1 + places.length) % places.length;
      }
      
      // Account for duplicate last card at start - real cards start at index 1
      const realCardIndex = targetIndex + 1;
      
      if (cards[realCardIndex]) {
        const card = cards[realCardIndex] as HTMLElement;
        const cardLeft = card.offsetLeft;
        const cardWidth = card.offsetWidth;
        const containerWidth = container.offsetWidth;
        const scrollPosition = cardLeft - (containerWidth - cardWidth) / 2;
        
        // Scroll only the carousel container, not the entire page
        container.scrollTo({
          left: Math.max(0, scrollPosition),
          behavior: 'smooth',
        });
        setCurrentIndex(targetIndex);
      }
    }

    touchStartX.current = 0;
    touchEndX.current = 0;

    // Resume auto-play after 3 seconds, starting from the new current position
    clearResumeTimeout();
    resumeTimeoutRef.current = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 3000);
  };

  return (
    <div className="relative">
      {/* Mobile: Horizontal Scrollable Carousel */}
      <div className="sm:hidden">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
          style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Duplicate last card at the beginning for seamless loop */}
          {places.length > 0 && (
            <div
              key={`duplicate-last-${places.length - 1}`}
              className="flex-shrink-0 w-full snap-center px-2"
              style={{ scrollSnapAlign: 'center' }}
            >
              <PlaceCard place={places[places.length - 1]} language={language} />
            </div>
          )}
          
          {/* Original cards */}
          {places.map((place, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full snap-center px-2"
              style={{ scrollSnapAlign: 'center' }}
            >
              <PlaceCard place={place} language={language} />
            </div>
          ))}
          
          {/* Duplicate first card at the end for seamless loop */}
          {places.length > 0 && (
            <div
              key={`duplicate-first-0`}
              className="flex-shrink-0 w-full snap-center px-2"
              style={{ scrollSnapAlign: 'center' }}
            >
              <PlaceCard place={places[0]} language={language} />
            </div>
          )}
        </div>

        {/* Dots Indicator */}
        {places.length > 1 && (
          <div className="flex justify-center gap-2 mt-6 relative">
            <div className="flex gap-2">
              {places.map((_, index) => {
                const isActive = index === currentIndex;
                const wasActive = previousIndexRef.current === index;
                
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                      setIsAutoPlaying(false);
                      clearAutoPlay();
                      clearResumeTimeout();
                      if (scrollContainerRef.current) {
                        const container = scrollContainerRef.current;
                        const cards = container.children;
                        // Account for duplicate last card at start - real cards start at index 1
                        const realCardIndex = index + 1;
                        if (cards[realCardIndex]) {
                          const card = cards[realCardIndex] as HTMLElement;
                          const cardLeft = card.offsetLeft;
                          const cardWidth = card.offsetWidth;
                          const containerWidth = container.offsetWidth;
                          const scrollPosition = cardLeft - (containerWidth - cardWidth) / 2;
                          
                          // Scroll only the carousel container, not the entire page
                          container.scrollTo({
                            left: Math.max(0, scrollPosition),
                            behavior: 'smooth',
                          });
                        }
                      }
                      // Resume auto-play after 3 seconds, starting from clicked position
                      resumeTimeoutRef.current = setTimeout(() => {
                        setIsAutoPlaying(true);
                      }, 3000);
                    }}
                    className={`h-2 rounded-full relative ${
                      isActive
                        ? 'w-8 bg-gradient-temple'
                        : 'w-2 bg-primary-gold/30'
                    }`}
                    style={{
                      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease-in-out',
                      order: index, // Ensure proper order for animation
                    }}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                );
              })}
            </div>
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

