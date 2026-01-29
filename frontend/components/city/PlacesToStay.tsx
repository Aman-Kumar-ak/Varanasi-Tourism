'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';
import SectionHeader from './SectionHeader';
import type { LanguageCode } from '@/lib/constants';

interface Hotel {
  name: string;
  type?: 'hotel' | 'budget-hotel' | 'guest-house' | 'dharamshala' | 'dormitory' | 'luxury-hotel';
  address?: string;
  contact?: string;
  rating?: number;
  website?: string;
  location?: string;
  image?: string;
}

interface PlacesToStayProps {
  hotels: Hotel[];
  language: LanguageCode;
}

const hotelTypes = [
  { value: 'all', translationKey: 'places.stay.filter.all' },
  { value: 'hotel', translationKey: 'places.stay.filter.hotels' },
  { value: 'budget-hotel', translationKey: 'places.stay.filter.budget' },
  { value: 'guest-house', translationKey: 'places.stay.filter.guesthouse' },
  { value: 'dharamshala', translationKey: 'places.stay.filter.dharamshala' },
  { value: 'dormitory', translationKey: 'places.stay.filter.dormitory' },
  { value: 'luxury-hotel', translationKey: 'places.stay.filter.luxury' },
];

const locations = [
  { value: 'all', translationKey: 'places.stay.filter.nearby.all' },
  { value: 'mal-road', translationKey: 'places.stay.filter.nearby.malroad' },
  { value: 'cantonment', translationKey: 'places.stay.filter.nearby.cantonment' },
  { value: 'station', translationKey: 'places.stay.filter.nearby.station' },
  { value: 'temple', translationKey: 'places.stay.filter.nearby.temple' },
  { value: 'ghat', translationKey: 'places.stay.filter.nearby.ghat' },
  { value: 'court', translationKey: 'places.stay.filter.nearby.court' },
  { value: 'bhu', translationKey: 'places.stay.filter.nearby.bhu' },
];

const HIGHLIGHT_INTERVAL_MS = 1900;

export default function PlacesToStay({ hotels, language }: PlacesToStayProps) {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [highlightStep, setHighlightStep] = useState(0);

  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      const typeMatch = selectedType === 'all' || hotel.type === selectedType;
      const locationMatch = selectedLocation === 'all' || 
        (hotel.location && hotel.location.toLowerCase().includes(selectedLocation.replace('-', ' ')));
      return typeMatch && locationMatch;
    });
  }, [hotels, selectedType, selectedLocation]);

  useEffect(() => {
    setExpandedIndex((prev) => (prev != null && prev >= filteredHotels.length ? 0 : prev));
    setSelectedIndex((prev) => (prev >= filteredHotels.length ? 0 : prev));
  }, [filteredHotels.length]);

  const stayClosedIndices = filteredHotels.map((_, i) => i).filter((i) => expandedIndex !== i);
  const stayHighlightedIndex = stayClosedIndices.length > 0 ? stayClosedIndices[highlightStep % stayClosedIndices.length] : -1;
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (stayClosedIndices.length <= 1) return;
    const t = setInterval(() => setHighlightStep((s) => s + 1), HIGHLIGHT_INTERVAL_MS);
    return () => clearInterval(t);
  }, [stayClosedIndices.length]);

  useEffect(() => {
    if (expandedIndex == null || filteredHotels.length === 0) return;
    const el = cardRefs.current[expandedIndex];
    if (el) {
      const timeoutId = window.setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
      return () => window.clearTimeout(timeoutId);
    }
  }, [expandedIndex, filteredHotels.length]);

  if (!hotels || hotels.length === 0) {
    return null;
  }

  return (
    <section className="mb-8 sm:mb-10 lg:mb-12" id="places-to-stay">
      <SectionHeader
        title={t('places.stay.title', language)}
        icon="🏨"
        subtitle={t('places.stay.subtitle', language)}
      />

      {/* Filters */}
      <div className="mb-4 sm:mb-6 lg:mb-8 space-y-3 sm:space-y-4">
        {/* Category Filter */}
        <div>
          <label className="block text-xs sm:text-sm md:text-base font-semibold text-primary-dark mb-1.5 sm:mb-2 md:mb-3">
            {t('places.stay.filter.category', language)}
          </label>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3">
            {hotelTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm md:text-base font-semibold transition-all min-h-[36px] sm:min-h-[40px] md:min-h-[44px] touch-manipulation ${
                  selectedType === type.value
                    ? 'bg-primary-saffron text-white shadow-md sm:shadow-lg border-2 border-primary-saffron active:bg-primary-deepOrange'
                    : 'bg-white text-primary-dark border-2 border-primary-saffron/40 active:bg-primary-saffron/10 active:border-primary-saffron/60'
                }`}
              >
                {t(type.translationKey, language)}
              </button>
            ))}
          </div>
        </div>

        {/* Near By Filter */}
        <div>
          <label className="block text-xs sm:text-sm md:text-base font-semibold text-primary-dark mb-1.5 sm:mb-2 md:mb-3">
            {t('places.stay.filter.nearby', language)}
          </label>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3">
            {locations.map((location) => (
              <button
                key={location.value}
                onClick={() => setSelectedLocation(location.value)}
                className={`px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm md:text-base font-semibold transition-all min-h-[36px] sm:min-h-[40px] md:min-h-[44px] touch-manipulation ${
                  selectedLocation === location.value
                    ? 'bg-primary-saffron text-white shadow-md sm:shadow-lg border-2 border-primary-saffron active:bg-primary-deepOrange'
                    : 'bg-white text-primary-dark border-2 border-primary-saffron/40 active:bg-primary-saffron/10 active:border-primary-saffron/60'
                }`}
              >
                {t(location.translationKey, language)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-3 sm:mb-4">
        <p className="text-xs sm:text-sm md:text-base text-primary-dark/70">
          {t('places.stay.results', language)}: {filteredHotels.length}
        </p>
      </div>

      {/* Mobile: accordion list (gold accent) – rating visible when closed; no repeat inside */}
      {filteredHotels.length > 0 && (
        <div className="sm:hidden rounded-2xl overflow-hidden border-2 border-amber-200/90 bg-white shadow-sm mb-4 divide-y divide-amber-200/80">
          {filteredHotels.map((hotel, index) => {
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
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left bg-white hover:bg-amber-50/50 active:bg-amber-50 transition-colors touch-manipulation ${!isExpanded && index === stayHighlightedIndex ? 'accordion-highlight-stay' : ''}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-gold/10 flex items-center justify-center text-xl flex-shrink-0 border border-amber-200/60">🏨</div>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-primary-dark text-sm break-words text-left block">{hotel.name}</span>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      {hotel.type && <span className="text-xs text-primary-gold font-semibold capitalize">{t(`places.stay.filter.${hotel.type}`, language)}</span>}
                      {hotel.rating != null && <span className="text-xs font-semibold text-primary-gold">⭐ {hotel.rating}</span>}
                    </div>
                  </div>
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-gold/10 flex items-center justify-center text-primary-gold border border-amber-200/60">
                    {isExpanded ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>}
                  </span>
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 pt-0 bg-amber-50/40 border-t border-amber-200/80 space-y-2">
                    {hotel.address && <p className="text-xs text-primary-dark/70">📍 {hotel.address}</p>}
                    {hotel.contact && <p className="text-xs text-primary-dark/80">📞 {hotel.contact}</p>}
                    {hotel.website && <a href={hotel.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-gold font-semibold hover:underline block">{t('places.stay.visit.website', language)} →</a>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Desktop: featured hotel (left) + Quick View sidebar (right) – like Places to Visit */}
      {filteredHotels.length > 0 ? (
        <div className="hidden sm:grid sm:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div className="sm:col-span-7 lg:col-span-8">
            {filteredHotels[selectedIndex] && (() => {
              const hotel = filteredHotels[selectedIndex];
              return (
                <div className="rounded-2xl overflow-hidden border border-primary-gold/20 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                  <div className="h-1 w-full bg-gradient-to-r from-primary-gold via-primary-orange to-primary-gold flex-shrink-0" aria-hidden />
                  {hotel.image ? (
                    <div className="relative w-full h-72 sm:h-80 lg:h-96 overflow-hidden">
                      <Image src={hotel.image} alt={hotel.name} fill sizes="(min-width: 1024px) 66vw, (min-width: 640px) 58vw, 100vw" className="object-cover" />
                      <h3 className="absolute top-4 left-4 right-4 text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] break-words z-10">{hotel.name}</h3>
                    </div>
                  ) : (
                    <div className="relative w-full h-72 sm:h-80 lg:h-96 bg-gradient-to-br from-primary-gold/15 via-amber-100/30 to-primary-gold/15 flex items-center justify-center">
                      <span className="text-6xl sm:text-7xl opacity-40 absolute" aria-hidden>🏨</span>
                      <h3 className="absolute top-4 left-4 right-4 text-lg sm:text-xl md:text-2xl font-bold text-primary-dark drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] break-words z-10">{hotel.name}</h3>
                    </div>
                  )}
                  <div className="rounded-t-none border-t-0 p-5 sm:p-6 md:p-8 bg-white/98 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                    {hotel.address && <p className="text-sm text-primary-dark/70 flex items-start gap-2 mb-4">📍 {hotel.address}</p>}
                    <div className="space-y-2">
                      {hotel.contact && <p className="text-sm text-primary-dark/80 break-all">📞 {hotel.contact}</p>}
                      {hotel.website && <a href={hotel.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-gold font-semibold hover:underline">{t('places.stay.visit.website', language)} →</a>}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
          <aside className="sm:col-span-5 lg:col-span-4">
            <div className="sticky top-4 rounded-2xl overflow-hidden border-2 border-primary-gold/20 bg-white shadow-sm flex flex-col">
              <div className="h-1 w-full bg-gradient-to-r from-primary-gold via-primary-orange to-primary-gold flex-shrink-0" aria-hidden />
              <div className="p-4 sm:p-5">
                <header className="mb-4">
                  <p className="text-[10px] sm:text-xs uppercase tracking-wider text-primary-gold font-semibold">{language === 'hi' ? 'त्वरित दृश्य' : 'Quick view'}</p>
                  <h3 className="text-base sm:text-lg font-bold text-primary-dark mt-0.5">{language === 'hi' ? 'अन्य होटल' : 'More stays'}</h3>
                </header>
                <div className="space-y-2">
                  {filteredHotels.map((hotel, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedIndex(index)}
                        className={`w-full text-left rounded-xl border-2 px-4 py-3 min-h-[52px] flex items-start justify-between gap-2 transition-colors ${
                          isSelected ? 'border-primary-gold/60 bg-amber-50/80 text-primary-dark shadow-sm' : 'border-slate-200/80 bg-white hover:border-primary-gold/30 hover:bg-amber-50/40'
                        }`}
                      >
                        <div className="min-w-0 flex-1 flex flex-col items-start gap-0.5">
                          <span className="font-semibold text-sm sm:text-base text-primary-dark break-words text-left">{hotel.name}</span>
                          <span className="text-xs text-primary-gold font-semibold">
                            {[hotel.type && t(`places.stay.filter.${hotel.type}`, language), hotel.rating != null && `⭐ ${hotel.rating}`].filter(Boolean).join(' · ')}
                          </span>
                        </div>
                        <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                          {isSelected ? <svg className="w-3.5 h-3.5 text-primary-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg> : <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <p className="text-primary-dark/60 text-sm sm:text-base">
            {t('places.stay.no.results', language)}
          </p>
        </div>
      )}
    </section>
  );
}
