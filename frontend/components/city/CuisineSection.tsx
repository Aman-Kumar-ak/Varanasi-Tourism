'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';
import SectionHeader from './SectionHeader';
import type { LanguageCode } from '@/lib/constants';
import { ACCORDION_RESTORE_KEYS, getRestoredAccordionIndex, saveAccordionIndex } from '@/lib/accordionRestore';

interface Restaurant {
  name: string;
  cuisine?: string;
  address?: string;
  contact?: string;
  specialty?: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  image?: string;
}

interface CuisineSectionProps {
  restaurants: Restaurant[];
  language: LanguageCode;
  /** When set, show an "Explore more" link in the Quick View sidebar (cuisine/saffron styling) */
  exploreSlug?: string;
}

const HIGHLIGHT_INTERVAL_MS = 1900;

export default function CuisineSection({ restaurants, language, exploreSlug }: CuisineSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [highlightStep, setHighlightStep] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasRestoredRef = useRef(false);

  useEffect(() => {
    if (!restaurants?.length || hasRestoredRef.current) return;
    hasRestoredRef.current = true;
    const idx = getRestoredAccordionIndex(ACCORDION_RESTORE_KEYS.cuisine);
    if (idx != null && idx >= 0 && idx < restaurants.length) setExpandedIndex(idx);
  }, [restaurants?.length, restaurants]);

  useEffect(() => {
    saveAccordionIndex(ACCORDION_RESTORE_KEYS.cuisine, expandedIndex);
  }, [expandedIndex]);

  const closedIndices = restaurants.map((_, i) => i).filter((i) => expandedIndex !== i);
  const highlightedIndex = closedIndices.length > 0 ? closedIndices[highlightStep % closedIndices.length] : -1;
  useEffect(() => {
    if (closedIndices.length <= 1) return;
    const t = setInterval(() => setHighlightStep((s) => s + 1), HIGHLIGHT_INTERVAL_MS);
    return () => clearInterval(t);
  }, [closedIndices.length]);

  useEffect(() => {
    if (expandedIndex == null) return;
    const el = cardRefs.current[expandedIndex];
    if (el) {
      const timeoutId = window.setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
      return () => window.clearTimeout(timeoutId);
    }
  }, [expandedIndex]);

  useEffect(() => {
    if (restaurants.length > 0 && selectedIndex >= restaurants.length) {
      setSelectedIndex(Math.max(0, restaurants.length - 1));
    }
  }, [restaurants.length, selectedIndex]);

  const featuredRestaurant = restaurants[selectedIndex];

  if (!restaurants || restaurants.length === 0) {
    return null;
  }

  return (
    <section className="mb-12" id="cuisine">
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#FDF6ED] via-[#F5E6D8] to-[#FFF8E7] border border-amber-200/50 shadow-xl shadow-amber-900/5 p-4 sm:p-6 lg:p-8">
        <SectionHeader title={t('cuisine.title', language)} icon="🍽️" subtitle={t('cuisine.subtitle', language)} />
        {/* Mobile: accordion (saffron/orange accent) – clear division */}
        <div className="sm:hidden rounded-2xl overflow-hidden border-2 border-orange-200/90 bg-white shadow-sm divide-y divide-orange-200/80">
        {restaurants.map((restaurant, index) => {
          const isExpanded = expandedIndex === index;
          const specialty = restaurant.specialty?.[language] || restaurant.specialty?.en;
          return (
            <div
              key={index}
              ref={(el) => { cardRefs.current[index] = el; }}
              className="bg-white first:rounded-t-2xl last:rounded-b-2xl scroll-mt-20 sm:scroll-mt-24"
            >
              <button
                type="button"
                onClick={() => setExpandedIndex((prev) => (prev === index ? null : index))}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left bg-white hover:bg-orange-50/50 active:bg-orange-50 transition-colors touch-manipulation ${!isExpanded && index === highlightedIndex ? 'accordion-highlight-cuisine' : ''}`}
              >
                <div className="w-12 h-12 rounded-xl bg-primary-saffron/10 flex items-center justify-center text-xl flex-shrink-0">🍽️</div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-primary-dark text-sm break-words text-left block">{restaurant.name}</span>
                  {restaurant.cuisine && <span className="text-xs text-primary-saffron font-semibold block mt-0.5">{restaurant.cuisine}</span>}
                </div>
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-saffron/10 flex items-center justify-center text-primary-saffron">
                  {isExpanded ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>}
                </span>
              </button>
              <div
                className={`accordion-panel-smooth overflow-hidden transition-[max-height,opacity] duration-300 ease-out sm:transition-none ${
                  isExpanded ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
                }`}
                aria-hidden={!isExpanded}
              >
                <div className="px-4 pb-4 pt-0 space-y-2 bg-orange-50/30 border-t border-orange-100">
                  {specialty && <p className="text-sm text-primary-dark/80 leading-relaxed">{specialty}</p>}
                  {restaurant.address && <p className="text-xs text-primary-dark/70">📍 {restaurant.address}</p>}
                  {restaurant.contact && <p className="text-xs text-primary-dark/80">📞 {restaurant.contact}</p>}
                </div>
              </div>
            </div>
          );
        })}
        </div>
        {exploreSlug && (
          <div className="mt-4 px-2 sm:hidden">
            <Link
              href={`/city/${exploreSlug}/explore#food`}
              className="group relative w-full rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-pink-500 text-white px-5 py-4 min-h-[56px] flex items-center justify-center gap-3 font-bold text-sm shadow-[0_4px_20px_rgba(239,68,68,0.4)] hover:shadow-[0_6px_30px_rgba(239,68,68,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-3">
                <span className="text-base">{t('explore.more', language)}</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
          </div>
        )}
        {/* Desktop: featured restaurant (left) + Quick View sidebar (right) – like Places to Visit */}
        <div className="hidden sm:grid sm:grid-cols-12 gap-6 lg:gap-8 items-start">
        <div className="sm:col-span-7 lg:col-span-8 w-full">
          {featuredRestaurant && (
            <div className="rounded-2xl overflow-hidden border border-amber-200/70 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
              <div className="h-1 w-full bg-gradient-to-r from-primary-saffron via-primary-orange to-primary-saffron flex-shrink-0" aria-hidden />
              {featuredRestaurant.image ? (
                <div className="relative w-full h-72 sm:h-80 lg:h-96 overflow-hidden">
                  <Image src={featuredRestaurant.image} alt={featuredRestaurant.name} fill sizes="(min-width: 1024px) 66vw, (min-width: 640px) 58vw, 100vw" className="object-cover" />
                  <h3 className="absolute top-4 left-4 right-4 text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] break-words z-10">{featuredRestaurant.name}</h3>
                </div>
              ) : (
                <div className="relative w-full h-72 sm:h-80 lg:h-96 bg-gradient-to-br from-primary-saffron/15 via-primary-orange/10 to-primary-saffron/15 flex items-center justify-center">
                  <span className="text-6xl sm:text-7xl opacity-40 absolute" aria-hidden>🍽️</span>
                  <h3 className="absolute top-4 left-4 right-4 text-lg sm:text-xl md:text-2xl font-bold text-primary-dark drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] break-words z-10">{featuredRestaurant.name}</h3>
                </div>
              )}
              <div className="rounded-t-none border-t-0 p-5 sm:p-6 md:p-8 bg-white/98 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                {featuredRestaurant.specialty && <p className="text-primary-dark/80 text-sm leading-relaxed mb-4">{featuredRestaurant.specialty[language] || featuredRestaurant.specialty.en}</p>}
                {featuredRestaurant.address && <p className="text-sm text-primary-dark/70 flex items-start gap-2 mb-4">📍 {featuredRestaurant.address}</p>}
                {featuredRestaurant.contact && <p className="text-sm text-primary-dark/80 break-all">📞 {featuredRestaurant.contact}</p>}
              </div>
            </div>
          )}
        </div>
        <aside className="sm:col-span-5 lg:col-span-4 w-full">
          <div className="sticky top-4 rounded-2xl overflow-hidden premium-card border border-amber-200/70 flex flex-col">
            <div className="h-1 w-full bg-gradient-to-r from-primary-saffron via-primary-gold to-primary-saffron flex-shrink-0" aria-hidden />
            <div className="flex flex-col p-4 sm:p-5">
              <header className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-primary-saffron font-semibold">
                    {language === 'hi' ? 'त्वरित दृश्य' : 'Quick view'}
                  </p>
                  <h3 className="text-base sm:text-lg font-bold text-premium-section-text mt-0.5">
                    {language === 'hi' ? 'अन्य रेस्तरां' : 'More restaurants'}
                  </h3>
                </div>
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-saffron/10 border border-amber-200/70 flex items-center justify-center text-primary-saffron">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </header>
              <div className="space-y-2">
                {restaurants.map((restaurant, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedIndex(index)}
                      className={`w-full text-left rounded-xl border-2 px-4 py-3 min-h-[52px] flex items-start justify-between gap-2 transition-colors duration-200 ${
                        isSelected ? 'border-primary-saffron/60 bg-amber-50/80 text-premium-section-text shadow-sm' : 'border-slate-200/80 bg-white hover:border-primary-saffron/30 hover:bg-amber-50/50 text-premium-section-text/90'
                      }`}
                    >
                      <div className="min-w-0 flex-1 flex flex-col items-start gap-0.5">
                        <span className="font-semibold text-sm sm:text-base text-primary-dark leading-snug break-words text-left">{restaurant.name}</span>
                        {restaurant.cuisine && <span className="text-xs text-primary-saffron font-medium">{restaurant.cuisine}</span>}
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
                    href={`/city/${exploreSlug}/explore#food`}
                    className="group relative w-full rounded-xl bg-gradient-to-r from-red-500 via-rose-600 to-pink-500 text-white px-5 py-4 min-h-[56px] flex items-center justify-center gap-3 font-bold text-sm sm:text-base shadow-[0_4px_20px_rgba(239,68,68,0.4)] hover:shadow-[0_6px_30px_rgba(239,68,68,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden mt-3"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative flex items-center gap-3">
                      <span>{t('explore.more', language)}</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </aside>
        </div>
      </div>
    </section>
  );
}
