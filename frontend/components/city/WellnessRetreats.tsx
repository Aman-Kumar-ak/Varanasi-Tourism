'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getLocalizedContent } from '@/lib/i18n';
import { t } from '@/lib/translations';
import type { LanguageCode } from '@/lib/constants';
import SectionHeader from './SectionHeader';
import { ACCORDION_RESTORE_KEYS, getRestoredAccordionIndex, saveAccordionIndex } from '@/lib/accordionRestore';

interface WellnessCenter {
  name: string;
  type: 'yoga' | 'meditation' | 'ayurveda' | 'spa' | 'retreat';
  description: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  address: string;
  contact?: string;
  website?: string;
  priceRange?: 'budget' | 'mid-range' | 'luxury';
  rating?: number;
  image?: string;
}

interface WellnessRetreatsProps {
  centers: WellnessCenter[];
  language: LanguageCode;
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'yoga':
      return '🧘';
    case 'meditation':
      return '🕉️';
    case 'ayurveda':
      return '🌿';
    case 'spa':
      return '💆';
    case 'retreat':
      return '🏛️';
    default:
      return '✨';
  }
}

function getPriceRangeLabel(range: string) {
  switch (range) {
    case 'budget':
      return '₹';
    case 'mid-range':
      return '₹₹';
    case 'luxury':
      return '₹₹₹';
    default:
      return '';
  }
}

function getPriceRangeColor(range: string) {
  switch (range) {
    case 'budget':
      return 'bg-primary-gold';
    case 'mid-range':
      return 'bg-primary-blue';
    case 'luxury':
      return 'bg-gradient-temple';
    default:
      return 'bg-gray-500';
  }
}

const HIGHLIGHT_INTERVAL_MS = 1900;

export default function WellnessRetreats({ centers, language }: WellnessRetreatsProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [highlightStep, setHighlightStep] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasRestoredRef = useRef(false);

  useEffect(() => {
    if (!centers?.length || hasRestoredRef.current) return;
    hasRestoredRef.current = true;
    const idx = getRestoredAccordionIndex(ACCORDION_RESTORE_KEYS.wellness);
    if (idx != null && idx >= 0 && idx < centers.length) setExpandedIndex(idx);
  }, [centers?.length, centers]);

  useEffect(() => {
    saveAccordionIndex(ACCORDION_RESTORE_KEYS.wellness, expandedIndex);
  }, [expandedIndex]);

  const closedIndices = centers.map((_, i) => i).filter((i) => expandedIndex !== i);
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

  const featuredCenter = centers[selectedIndex];

  return (
    <section className="mb-12">
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#FDF6ED] via-[#F5E6D8] to-[#FFF8E7] border border-amber-200/50 shadow-xl shadow-amber-900/5 p-4 sm:p-6 lg:p-8">
        <SectionHeader title={t('wellness.spiritual.retreats', language)} icon="🧘" subtitle={t('yoga.meditation.ayurveda', language)} />
        {/* Mobile: accordion (teal accent) – clear division */}
        <div className="sm:hidden rounded-2xl overflow-hidden border-2 border-teal-200/90 bg-white shadow-sm divide-y divide-teal-200/80">
        {centers.map((center, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <div
              key={index}
              ref={(el) => { cardRefs.current[index] = el; }}
              className="bg-white first:rounded-t-2xl last:rounded-b-2xl scroll-mt-20 sm:scroll-mt-24"
            >
              <button
                type="button"
                onClick={() => setExpandedIndex((prev) => (prev === index ? null : index))}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left bg-white hover:bg-teal-50/50 active:bg-teal-50 transition-colors touch-manipulation ${!isExpanded && index === highlightedIndex ? 'accordion-highlight-wellness' : ''}`}
              >
                <div className="w-12 h-12 rounded-xl bg-premium-teal/10 flex items-center justify-center text-xl flex-shrink-0">{getTypeIcon(center.type)}</div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-primary-dark text-sm break-words text-left block">{center.name}</span>
                  <span className="text-xs text-premium-teal font-semibold capitalize block mt-0.5">{center.type}</span>
                </div>
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-premium-teal/10 flex items-center justify-center text-premium-teal">
                  {isExpanded ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>}
                </span>
              </button>
              <div
                className={`accordion-panel-smooth overflow-hidden ${
                  isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
                aria-hidden={!isExpanded}
              >
                <div className="px-4 pb-4 pt-0 space-y-3 bg-teal-50/30 border-t border-teal-100">
                  <p className="text-primary-dark/90 text-sm leading-relaxed">{getLocalizedContent(center.description, language)}</p>
                  <p className="text-xs text-primary-dark/70 flex items-start gap-2">📍 {center.address}</p>
                  {center.priceRange && <span className={`inline-block ${getPriceRangeColor(center.priceRange)} text-white px-2 py-1 rounded text-xs font-bold`}>{getPriceRangeLabel(center.priceRange)}</span>}
                  {center.contact && <p className="text-xs text-primary-dark/80">📞 {center.contact}</p>}
                  {center.website && <a href={center.website} target="_blank" rel="noopener noreferrer" className="text-xs text-premium-teal font-semibold hover:underline">Visit website →</a>}
                </div>
              </div>
            </div>
          );
        })}
        </div>
        {/* Desktop: featured center (left) + Quick View sidebar (right) – like Places to Visit */}
        <div className="hidden sm:grid sm:grid-cols-12 gap-6 lg:gap-8 items-start">
        <div className="sm:col-span-7 lg:col-span-8 w-full">
          {featuredCenter && (
            <div className="rounded-2xl overflow-hidden border border-amber-200/70 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
              <div className="h-1 w-full bg-gradient-to-r from-primary-saffron via-primary-gold to-primary-saffron flex-shrink-0" aria-hidden />
              {featuredCenter.image ? (
                <div className="relative w-full h-72 sm:h-80 lg:h-96 overflow-hidden">
                  <Image src={featuredCenter.image} alt={featuredCenter.name} fill sizes="(min-width: 1024px) 66vw, (min-width: 640px) 58vw, 100vw" className="object-cover" />
                  <h3 className="absolute top-4 left-4 right-4 text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] break-words z-10">{featuredCenter.name}</h3>
                </div>
              ) : (
                <div className="relative w-full h-72 sm:h-80 lg:h-96 bg-gradient-to-br from-premium-teal/15 via-teal-100/30 to-premium-teal/15 flex items-center justify-center">
                  <span className="text-6xl sm:text-7xl opacity-40 absolute" aria-hidden>{getTypeIcon(featuredCenter.type)}</span>
                  <h3 className="absolute top-4 left-4 right-4 text-lg sm:text-xl md:text-2xl font-bold text-primary-dark drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] break-words z-10">{featuredCenter.name}</h3>
                </div>
              )}
              <div className="rounded-t-none border-t-0 p-5 sm:p-6 md:p-8 bg-white/98 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                <p className="text-primary-dark/90 text-sm leading-relaxed mb-4">{getLocalizedContent(featuredCenter.description, language)}</p>
                {featuredCenter.priceRange && <span className={`inline-block ${getPriceRangeColor(featuredCenter.priceRange)} text-white px-2.5 py-1.5 rounded-lg text-xs font-bold mb-4`}>{getPriceRangeLabel(featuredCenter.priceRange)}</span>}
                <p className="text-sm text-primary-dark/70 flex items-start gap-2 mb-4">📍 {featuredCenter.address}</p>
                {featuredCenter.rating != null && <p className="text-sm text-primary-gold font-semibold mb-4">⭐ {featuredCenter.rating}</p>}
                <div className="space-y-2">
                  {featuredCenter.contact && <p className="text-sm text-primary-dark/80 break-all">📞 {featuredCenter.contact}</p>}
                  {featuredCenter.website && <a href={featuredCenter.website} target="_blank" rel="noopener noreferrer" className="text-sm text-premium-teal font-semibold hover:underline">Visit website →</a>}
                </div>
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
                    {language === 'hi' ? 'अन्य केंद्र' : 'More centers'}
                  </h3>
                </div>
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-saffron/10 border border-amber-200/70 flex items-center justify-center text-primary-saffron">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              </header>
              <div className="space-y-2">
                {centers.map((center, index) => {
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
                        <span className="font-semibold text-sm sm:text-base text-primary-dark leading-snug break-words text-left">{center.name}</span>
                        <span className="text-xs text-primary-saffron font-medium capitalize">{center.type}{(center.rating != null || center.priceRange) && ` · ${[center.rating != null && `⭐ ${center.rating}`, center.priceRange && getPriceRangeLabel(center.priceRange)].filter(Boolean).join(' ')}`}</span>
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
              </div>
            </div>
          </div>
        </aside>
        </div>
      </div>
    </section>
  );
}

