'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PlaceCard from './PlaceCard';
import { getLocalizedContent } from '@/lib/i18n';
import { openGoogleMapsDirections } from '@/lib/googleMaps';
import { t } from '@/lib/translations';
import type { LanguageCode } from '@/lib/constants';
import { ACCORDION_RESTORE_KEYS, getRestoredAccordionIndex, saveAccordionIndex } from '@/lib/accordionRestore';

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
  /** When set, show an "Explore more" button linking to the city explore page */
  exploreSlug?: string;
}

const categoryIcons: Record<string, string> = {
  temple: '🛕',
  ghat: '🌊',
  monument: '🏛️',
  market: '🛒',
  museum: '🏛️',
  other: '📍',
};

const HIGHLIGHT_INTERVAL_MS = 1900;

export default function PlacesCarousel({ places, language, exploreSlug }: PlacesCarouselProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [highlightStep, setHighlightStep] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasRestoredRef = useRef(false);

  // Restore open accordion after language change (cleared on refresh by city page)
  useEffect(() => {
    if (!places?.length || hasRestoredRef.current) return;
    hasRestoredRef.current = true;
    const idx = getRestoredAccordionIndex(ACCORDION_RESTORE_KEYS.places);
    if (idx != null && idx >= 0 && idx < places.length) setExpandedIndex(idx);
  }, [places?.length, places]);

  useEffect(() => {
    saveAccordionIndex(ACCORDION_RESTORE_KEYS.places, expandedIndex);
  }, [expandedIndex]);

  const closedIndices = places.map((_, i) => i).filter((i) => expandedIndex !== i);
  const highlightedIndex = closedIndices.length > 0 ? closedIndices[highlightStep % closedIndices.length] : -1;

  useEffect(() => {
    if (closedIndices.length <= 1) return;
    const t = setInterval(() => setHighlightStep((s) => s + 1), HIGHLIGHT_INTERVAL_MS);
    return () => clearInterval(t);
  }, [closedIndices.length]);

  // When a card is expanded, scroll it into view and center it so all content is visible
  useEffect(() => {
    if (expandedIndex == null) return;
    const el = cardRefs.current[expandedIndex];
    if (el) {
      // Small delay so expanded content has rendered before we scroll
      const timeoutId = window.setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
      return () => window.clearTimeout(timeoutId);
    }
  }, [expandedIndex]);

  const toggleExpand = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const featuredPlace = places[selectedIndex];

  return (
    <div className="relative">
      {/* Phone: Accordion – compact, one item expanded, same content + photos */}
      <div className="sm:hidden">
        <div className="rounded-2xl overflow-hidden border-2 border-amber-200/80 bg-white shadow-sm divide-y divide-amber-200/70">
          {places.map((place, index) => {
            const isExpanded = expandedIndex === index;
            const category = place.category || 'other';
            const icon = categoryIcons[category] || '📍';

            return (
              <div
                key={index}
                ref={(el) => { cardRefs.current[index] = el; }}
                className="relative bg-white first:rounded-t-2xl last:rounded-b-2xl scroll-mt-20 sm:scroll-mt-24"
              >
                {/* Accordion header – when expanded: minus button floats above image; when collapsed: thumbnail + title + plus */}
                <button
                  type="button"
                  onClick={() => toggleExpand(index)}
                  className={`flex items-center text-left transition-colors touch-manipulation ${isExpanded ? 'absolute right-4 z-20 w-8 h-8 min-w-[32px] min-h-[32px] rounded-full bg-white shadow-sm border border-slate-200/80 justify-center items-center p-0 text-primary-dark hover:bg-white active:bg-white hover:scale-100 active:scale-100 cursor-default top-[1.375rem]' : 'w-full gap-3 px-4 py-3.5 bg-white hover:bg-amber-50/60 active:bg-amber-50'} ${!isExpanded && index === highlightedIndex ? 'accordion-highlight-places' : ''}`}
                  aria-expanded={isExpanded}
                  aria-controls={`place-accordion-${index}`}
                  id={`place-accordion-heading-${index}`}
                >
                  {!isExpanded && (
                    <>
                      {/* Thumbnail or icon – hidden when expanded */}
                      {place.image ? (
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border-0">
                          <Image
                            src={place.image}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-cover border-0 outline-none"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-primary-saffron/10 flex items-center justify-center text-lg flex-shrink-0 border border-amber-200/60">
                          {icon}
                        </div>
                      )}
                      <span className="flex-1 min-w-0 font-bold text-primary-dark text-sm sm:text-base break-words text-left">
                        {getLocalizedContent(place.name, language)}
                      </span>
                    </>
                  )}
                  <span
                    className={`flex-shrink-0 rounded-full flex items-center justify-center border ${isExpanded ? 'bg-transparent w-8 h-8 text-primary-dark border-transparent' : 'w-8 h-8 bg-primary-saffron/10 text-primary-saffron border-amber-200/70'} ${!isExpanded ? '' : ''}`}
                    aria-hidden
                  >
                    {isExpanded ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                  </span>
                </button>

                {/* Accordion panel – expanded content with image, description, CTA */}
                <div
                  id={`place-accordion-${index}`}
                  role="region"
                  aria-labelledby={`place-accordion-heading-${index}`}
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    isExpanded ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-4 pb-4 pt-0 space-y-3 bg-gradient-to-b from-premium-peach/20 to-white/80">
                    {/* Hero image when expanded – full-bleed from top (no white strip); title at bottom-left; minus button floats above */}
                    {place.image && (
                      <div className={`relative -mx-4 h-52 overflow-hidden border-0 ${index === 0 ? 'rounded-t-2xl' : ''}`}>
                        <Image
                          src={place.image}
                          alt={getLocalizedContent(place.name, language)}
                          fill
                          sizes="100vw"
                          className="object-cover border-0 outline-none"
                        />
                        {/* No full-image dark overlay – keep image bright like original; only bottom strip for title readability */}
                        <div
                          className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"
                          aria-hidden
                        />
                        <h3 className="absolute bottom-0 left-0 right-0 p-4 text-lg font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] break-words text-left">
                          {getLocalizedContent(place.name, language)}
                        </h3>
                      </div>
                    )}
                    {/* When no image: still show title at top of content */}
                    {!place.image && (
                      <h3 className="font-bold text-primary-dark text-base">
                        {getLocalizedContent(place.name, language)}
                      </h3>
                    )}

                    {place.category && (
                      <span className="inline-block text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary-saffron/10 text-primary-saffron border border-amber-200/70">
                        {place.category}
                      </span>
                    )}

                    <p className="text-primary-dark/85 text-sm leading-relaxed">
                      {getLocalizedContent(place.description, language)}
                    </p>

                    {place.spiritualImportance && (
                      <div className="rounded-xl bg-premium-peach/50 border border-amber-200/60 p-3">
                        <p className="text-primary-dark/90 text-xs sm:text-sm leading-relaxed">
                          {getLocalizedContent(place.spiritualImportance, language)}
                        </p>
                      </div>
                    )}

                    {/* Chips row */}
                    <div className="flex flex-wrap gap-2">
                      {place.bestTimeToVisit && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/60 text-xs font-medium">
                          <svg className="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {place.bestTimeToVisit}
                        </span>
                      )}
                      {place.visitDuration && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-violet-50 text-violet-900 border border-violet-200/60 text-xs font-medium">
                          <svg className="w-3.5 h-3.5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          {place.visitDuration}
                        </span>
                      )}
                    </div>

                    {/* Directions CTA – opens map when location available */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (place.location) {
                          openGoogleMapsDirections(place.location, getLocalizedContent(place.name, language));
                        }
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary-saffron text-white py-3 px-4 text-sm font-semibold shadow-md hover:bg-primary-deepOrange active:scale-[0.98] transition-all touch-manipulation disabled:opacity-70"
                      disabled={!place.location}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      {t('directions', language)}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {exploreSlug && (
          <div className="mt-4 px-2">
            <Link
              href={`/city/${exploreSlug}/explore`}
              className="w-full rounded-xl bg-gradient-to-r from-primary-saffron via-primary-gold to-primary-saffron text-white px-5 py-3.5 min-h-[52px] flex items-center justify-center gap-2.5 font-bold text-sm shadow-lg border border-primary-saffron/70 hover:brightness-105 active:brightness-95 transition-all duration-200"
            >
              {t('explore.more', language)}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>

      {/* PC: Featured place (left) + Quick View sidebar (right) */}
      <div className="hidden sm:grid sm:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left: Accent strip above image, then image + card as one attached block */}
        <div className="sm:col-span-7 lg:col-span-8">
          {featuredPlace && (
            <div className="rounded-2xl overflow-hidden border border-amber-200/70 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
              {/* Accent strip above the image */}
              <div className="h-1 w-full bg-gradient-to-r from-primary-saffron via-primary-gold to-primary-saffron flex-shrink-0" aria-hidden />
              {/* Hero image – no gap below */}
              {featuredPlace.image && (
                <div className="relative w-full h-72 sm:h-80 lg:h-96 overflow-hidden border-0">
                  <Image
                    src={featuredPlace.image}
                    alt={getLocalizedContent(featuredPlace.name, language)}
                    fill
                    sizes="(min-width: 1024px) 66vw, (min-width: 640px) 58vw, 100vw"
                    className="object-cover border-0 outline-none"
                  />
                  {/* No overlay on upper part – keep image clear; only bottom gradient for card blend */}
                  {/* Bottom gradient so image disperses into the card below */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-premium-peach to-transparent pointer-events-none"
                    aria-hidden
                  />
                  {/* Place name overlay – top-left (PC view); strong shadow for readability without top darkening */}
                  <div className="absolute top-0 left-0 right-0 p-4 sm:p-5 lg:p-6 pointer-events-none">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white break-words max-w-full [text-shadow:0_1px_2px_rgba(0,0,0,0.8),0_2px_8px_rgba(0,0,0,0.5)]" style={{ lineHeight: 1.25 }}>
                      {getLocalizedContent(featuredPlace.name, language)}
                    </h2>
                  </div>
                </div>
              )}
              {/* Detail card attached directly below image (no gap); name hidden when shown on image */}
              <PlaceCard place={featuredPlace} language={language} hideImage hideTitle={!!featuredPlace.image} />
            </div>
          )}
        </div>

        {/* Right: Quick View – More places list (no preview text, no scrolling – show all) */}
        <aside className="sm:col-span-5 lg:col-span-4">
          <div className="sticky top-4 rounded-2xl overflow-hidden premium-card border border-amber-200/70 flex flex-col">
            <div className="h-1 w-full bg-gradient-to-r from-primary-saffron via-primary-gold to-primary-saffron flex-shrink-0" aria-hidden />
            <div className="flex flex-col p-4 sm:p-5">
              <header className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-primary-saffron font-semibold">
                    {language === 'hi' ? 'त्वरित दृश्य' : 'Quick view'}
                  </p>
                  <h3 className="text-base sm:text-lg font-bold text-premium-section-text mt-0.5">
                    {language === 'hi' ? 'अन्य स्थान' : 'More places'}
                  </h3>
                </div>
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-saffron/10 border border-amber-200/70 flex items-center justify-center text-primary-saffron">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
              </header>

              <div className="space-y-2">
                {places.map((place, index) => {
                  const isSelected = index === selectedIndex;

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedIndex(index)}
                      className={`w-full text-left rounded-xl border-2 px-4 py-3 min-h-[52px] flex items-start justify-between gap-2 transition-colors duration-200 ${
                        isSelected
                          ? 'border-primary-saffron/60 bg-amber-50/80 text-premium-section-text shadow-sm'
                          : 'border-slate-200/80 bg-white hover:border-primary-saffron/30 hover:bg-amber-50/50 text-premium-section-text/90'
                      }`}
                    >
                      <div className="min-w-0 flex-1 flex flex-col items-start gap-0.5">
                        <span className="font-semibold text-sm sm:text-base text-primary-dark leading-snug break-words text-left">
                          {getLocalizedContent(place.name, language)}
                        </span>
                        {(place.category || place.bestTimeToVisit) && (
                          <span className="text-xs text-primary-saffron font-medium">
                            {[place.category && String(place.category).toUpperCase(), place.bestTimeToVisit].filter(Boolean).join(' · ')}
                          </span>
                        )}
                      </div>
                      <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                        {isSelected ? (
                          <svg className="w-3.5 h-3.5 text-primary-saffron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </span>
                    </button>
                  );
                })}
                {exploreSlug && (
                  <Link
                    href={`/city/${exploreSlug}/explore`}
                    className="w-full rounded-xl bg-gradient-to-r from-primary-saffron via-primary-gold to-primary-saffron text-white px-5 py-3.5 min-h-[52px] flex items-center justify-center gap-2.5 font-bold text-sm sm:text-base shadow-lg border border-primary-saffron/70 hover:brightness-105 hover:shadow-xl active:brightness-95 transition-all duration-200"
                  >
                    {t('explore.more', language)}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}