'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { getApiUrl } from '@/lib/utils';
import { getLocalizedContent } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';
import { openGoogleMapsDirections } from '@/lib/googleMaps';
import PlaceCard from '@/components/city/PlaceCard';
import BeautifulLoading from '@/components/common/BeautifulLoading';
import type { LanguageCode } from '@/lib/constants';

type PlaceCategory = 'temple' | 'ghat' | 'monument' | 'market' | 'museum' | 'other';
const PLACE_CATEGORIES: PlaceCategory[] = ['temple', 'ghat', 'monument', 'market', 'museum', 'other'];
const FOOD_CATEGORY = 'food';
const AARTI_CATEGORY = 'aarti';

interface Place {
  name: { en: string; hi: string; [key: string]: string };
  description: { en: string; hi: string; [key: string]: string };
  image?: string;
  location?: { lat: number; lng: number };
  category?: PlaceCategory;
  spiritualImportance?: { en: string; hi: string; [key: string]: string };
  bestTimeToVisit?: string;
  visitDuration?: string;
}

interface Restaurant {
  name: string;
  cuisine: string;
  address: string;
  priceRange?: string;
  contact?: string;
}

interface Ritual {
  name: { en: string; hi: string; [key: string]: string };
  description: { en: string; hi: string; [key: string]: string };
  timing?: string;
  image?: string;
}

interface City {
  _id: string;
  name: { en: string; hi: string; [key: string]: string };
  places: Place[];
  restaurants?: Restaurant[];
  rituals?: Ritual[];
}

const categoryOrder: (PlaceCategory | typeof FOOD_CATEGORY | typeof AARTI_CATEGORY)[] = [
  'temple',
  'ghat',
  AARTI_CATEGORY,
  'monument',
  'market',
  'museum',
  'other',
  FOOD_CATEGORY,
];

const CATEGORY_ICONS: Record<string, string> = {
  temple: '🛕',
  ghat: '🌊',
  monument: '🏛️',
  market: '🛒',
  museum: '🏛️',
  other: '📍',
  food: '🍽️',
  aarti: '🪔',
};

function RitualCard({ ritual, language }: { ritual: Ritual; language: LanguageCode }) {
  const name = getLocalizedContent(ritual.name, language);
  const description = getLocalizedContent(ritual.description, language);
  return (
    <article className="relative flex flex-col h-full min-w-0 overflow-hidden rounded-2xl bg-white/95 backdrop-blur-sm border border-amber-200/60 shadow-lg shadow-amber-900/5">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-saffron to-amber-400 rounded-l-2xl opacity-80" aria-hidden />
      <div className="relative p-5 sm:p-6 flex-1 flex flex-col min-h-0 pl-6">
        <h3 className="text-base sm:text-lg font-bold text-premium-section-text tracking-tight leading-snug line-clamp-2 flex-shrink-0">
          {name}
        </h3>
        {ritual.timing && (
          <p className="text-sm font-semibold text-primary-saffron mt-2 flex items-center gap-2 flex-shrink-0">
            <svg className="w-4 h-4 flex-shrink-0 text-primary-saffron" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{ritual.timing}</span>
          </p>
        )}
        <p className="text-sm text-premium-section-muted mt-3 leading-relaxed break-words flex-1 min-h-0">
          {description}
        </p>
      </div>
    </article>
  );
}

function RestaurantCard({ restaurant, language }: { restaurant: Restaurant; language: LanguageCode }) {
  return (
    <article className="relative flex flex-col h-full min-h-0 min-w-0 overflow-hidden rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-sm border border-amber-200/60 shadow-lg shadow-amber-900/5">
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-saffron to-amber-400 rounded-l-xl sm:rounded-l-2xl opacity-80" aria-hidden />
      <div className="relative p-3 sm:p-5 flex-1 flex flex-col min-h-0 min-w-0 pl-4 sm:pl-6">
        <h3 className="text-sm sm:text-lg font-bold text-premium-section-text tracking-tight leading-snug line-clamp-2 break-words">
          {restaurant.name}
        </h3>
        {restaurant.address && (
          <p className="text-xs sm:text-sm text-premium-section-muted mt-1.5 leading-relaxed line-clamp-2 flex items-start gap-1.5 flex-shrink-0 min-w-0">
            <svg className="w-3.5 h-3.5 flex-shrink-0 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span className="break-words overflow-hidden line-clamp-2">{restaurant.address}</span>
          </p>
        )}
        {restaurant.contact && (
          <a
            href={`tel:${restaurant.contact.replace(/\s/g, '')}`}
            onClick={(e) => e.stopPropagation()}
            className="text-xs sm:text-sm text-amber-700 font-medium mt-1 flex items-center gap-1.5 hover:text-amber-800 hover:underline flex-shrink-0 min-w-0"
          >
            <svg className="w-3.5 h-3.5 flex-shrink-0 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="truncate">{restaurant.contact}</span>
          </a>
        )}
      </div>
    </article>
  );
}

export default function CityExplorePage() {
  const params = useParams();
  const { language } = useLanguage();
  const [city, setCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | typeof FOOD_CATEGORY | typeof AARTI_CATEGORY | 'all'>('all');
  const [scrolledToCategory, setScrolledToCategory] = useState<PlaceCategory | typeof FOOD_CATEGORY | typeof AARTI_CATEGORY | 'all'>('all');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [guideAnimationStopped, setGuideAnimationStopped] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const filterScrollRef = useRef<HTMLDivElement>(null);
  const guideIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const guideRafRef = useRef<number | null>(null);

  const closePopup = useCallback(() => {
    setPopupOpen(false);
    setTimeout(() => setSelectedPlace(null), 300);
  }, []);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (selectedPlace) {
      setPopupOpen(false);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setPopupOpen(true));
      });
      return () => cancelAnimationFrame(id);
    } else {
      setPopupOpen(false);
    }
  }, [selectedPlace]);

  const fetchCity = useCallback(async () => {
    if (!params.name || typeof params.name !== 'string') return;
    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      const res = await fetch(`${apiUrl}/api/cities/${params.name}?t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success) setCity(data.data);
    } catch (e) {
      console.error('Error fetching city:', e);
    } finally {
      setLoading(false);
    }
  }, [params.name]);

  useEffect(() => {
    fetchCity();
  }, [fetchCity, language]);

  // When landing with a hash (e.g. /city/varanasi/explore#aarti), scroll to that category section
  useEffect(() => {
    if (loading || !city) return;
    const hash = typeof window !== 'undefined' ? window.location.hash.slice(1).toLowerCase() : '';
    if (!hash) return;
    if (hash === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setScrolledToCategory('all');
      return;
    }
    setScrolledToCategory(hash as PlaceCategory | typeof FOOD_CATEGORY | typeof AARTI_CATEGORY | 'all');
    const el = document.getElementById(hash);
    if (el) {
      const t = setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return () => clearTimeout(t);
    }
  }, [loading, city]);

  // Lock body scroll when place detail popup is open (mobile only)
  useEffect(() => {
    if (selectedPlace && isMobile) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [selectedPlace, isMobile]);

  // Guide animation: only on desktop (min-width 768px). Disabled on phone to avoid scroll jitter from RAF + scrollLeft.
  useEffect(() => {
    if (guideAnimationStopped || loading) return;
    const isDesktop = typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches;
    if (!isDesktop) return;

    const el = filterScrollRef.current;
    if (!el) return;

    const runHint = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;

      const peak = Math.min(100, maxScroll);
      const totalDuration = 1600;
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        if (elapsed >= totalDuration) {
          el.scrollLeft = 0;
          guideRafRef.current = null;
          return;
        }
        const progress = elapsed / totalDuration;
        el.scrollLeft = peak * Math.sin(progress * Math.PI);
        guideRafRef.current = requestAnimationFrame(tick);
      };
      if (guideRafRef.current) cancelAnimationFrame(guideRafRef.current);
      guideRafRef.current = requestAnimationFrame(tick);
    };

    const firstRun = setTimeout(runHint, 2000);
    const id = setInterval(runHint, 6000);
    guideIntervalRef.current = id;
    return () => {
      clearTimeout(firstRun);
      if (guideIntervalRef.current) clearInterval(guideIntervalRef.current);
      guideIntervalRef.current = null;
      if (guideRafRef.current) cancelAnimationFrame(guideRafRef.current);
      guideRafRef.current = null;
    };
  }, [guideAnimationStopped, loading]);

  const stopGuideAnimation = useCallback(() => {
    setGuideAnimationStopped(true);
    if (guideIntervalRef.current) clearInterval(guideIntervalRef.current);
    guideIntervalRef.current = null;
    if (guideRafRef.current) cancelAnimationFrame(guideRafRef.current);
    guideRafRef.current = null;
  }, []);

  if (loading) return <BeautifulLoading />;
  if (!city) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-premium-peach to-background-cream flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-primary-saffron/10 flex items-center justify-center text-4xl mx-auto mb-6">📍</div>
          <h2 className="text-2xl font-bold text-premium-section-text mb-3">City Not Found</h2>
          <p className="text-premium-section-muted mb-6">We couldn&apos;t load this city. Try another from the list.</p>
          <Link
            href="/cities"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-saffron text-white px-6 py-3 font-semibold shadow-lg shadow-primary-saffron/25 hover:bg-primary-saffron/90 transition-colors"
          >
            Back to Cities
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </div>
    );
  }

  const places = (city.places || []).filter(
    (p) => !(p.name?.en && (p.name.en.includes('BHU') || p.name.en.includes('Banaras Hindu University')))
  );

  const placesByCategory = PLACE_CATEGORIES.reduce<Record<PlaceCategory, Place[]>>(
    (acc, cat) => {
      acc[cat] = places.filter((p) => (p.category || 'other') === cat);
      return acc;
    },
    { temple: [], ghat: [], monument: [], market: [], museum: [], other: [] }
  );

  const restaurants = city.restaurants || [];
  const hasFood = restaurants.length > 0;

  const aartiPlaces = places.filter(
    (p) =>
      (p.bestTimeToVisit?.toLowerCase().includes('aarti') ||
        (p.description?.en && p.description.en.toLowerCase().includes('aarti')) ||
        (p.name?.en && p.name.en.toLowerCase().includes('aarti')))
  );
  const aartiRituals = (city.rituals || []).filter(
    (r) => (r.name?.en && r.name.en.toLowerCase().includes('aarti')) || (r.name?.hi && r.name.hi.includes('आरती'))
  );
  const hasAarti = aartiPlaces.length > 0 || aartiRituals.length > 0;

  const categoriesToShow = categoryOrder.filter((cat) => {
    if (cat === FOOD_CATEGORY) return hasFood;
    if (cat === AARTI_CATEGORY) return hasAarti;
    return (placesByCategory[cat as PlaceCategory]?.length ?? 0) > 0;
  });

  const filterCategories: { id: PlaceCategory | typeof FOOD_CATEGORY | typeof AARTI_CATEGORY | 'all'; labelKey: string; icon: string }[] = [
    ...categoriesToShow
      .filter((c) => c !== FOOD_CATEGORY && c !== AARTI_CATEGORY)
      .map((c) => ({ id: c as PlaceCategory, labelKey: `explore.category.${c}`, icon: CATEGORY_ICONS[c] || '📍' })),
    ...(hasAarti ? [{ id: AARTI_CATEGORY as typeof AARTI_CATEGORY, labelKey: 'explore.category.aarti', icon: CATEGORY_ICONS.aarti }] : []),
    ...(hasFood ? [{ id: FOOD_CATEGORY as typeof FOOD_CATEGORY, labelKey: 'explore.category.food', icon: CATEGORY_ICONS.food }] : []),
  ];

  const handleFloatingFilterClick = (id: PlaceCategory | typeof FOOD_CATEGORY | typeof AARTI_CATEGORY | 'all') => {
    setSelectedCategory('all');
    setScrolledToCategory(id);
    setTimeout(() => {
      if (id === 'all') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-premium-peach via-white/40 to-background-cream">
      {/* Modern header: single bar, content aligned with fixed back + actions */}
      <header ref={headerRef} className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500 via-primary-saffron to-primary-deepOrange" aria-hidden />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,transparent_50%,rgba(0,0,0,0.04)_100%)]" aria-hidden />
        <div className="relative w-full max-w-[1600px] mx-auto pl-14 pr-4 sm:pl-16 sm:pr-6 lg:pl-20 lg:pr-10">
          <div className="flex items-start justify-between gap-4 pt-14 pb-6 sm:pt-12 sm:pb-8 min-h-[5.5rem] sm:min-h-0">
            <div className="min-w-0 flex-1 pt-0.5">
              <span className="inline-block text-white/90 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] mb-1.5 rounded-full bg-white/15 px-2.5 py-0.5">
                {language === 'hi' ? 'खोजें' : 'Discover'}
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight leading-tight drop-shadow-sm">
                {t('explore.page.title', language)}
              </h1>
              <p className="text-white/95 mt-1.5 text-sm sm:text-base leading-snug max-w-xl">
                {t('explore.page.subtitle', language)}
              </p>
            </div>
            {/* Spacer so fixed FloatingButtonGroup aligns with this row; no content so buttons stay on top */}
            <div className="flex-shrink-0 w-20 sm:w-24 h-10 sm:h-12" aria-hidden />
          </div>
        </div>
      </header>

      {/* Floating filter bar: solid bg on mobile (no backdrop-blur) to avoid scroll jitter */}
      <div className="fixed bottom-3 left-0 right-0 z-30 flex justify-center px-3 sm:bottom-4 sm:px-4 pointer-events-none">
          <div
            ref={filterScrollRef}
            role="region"
            aria-label={language === 'hi' ? 'श्रेणी फ़िल्टर - स्वाइप करें' : 'Category filters — swipe for more'}
            onTouchStart={stopGuideAnimation}
            onTouchMove={stopGuideAnimation}
            onWheel={stopGuideAnimation}
            onMouseDown={stopGuideAnimation}
            className="pointer-events-auto flex gap-2 overflow-x-auto scrollbar-hide items-center py-2 px-3 rounded-full bg-white/60 backdrop-blur-md sm:backdrop-blur-xl border border-white/50 w-fit max-w-[calc(100vw-1.5rem)]"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch', boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.7)' }}
          >
            {filterCategories.map(({ id, labelKey }) => {
              const isSelected = scrolledToCategory === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleFloatingFilterClick(id)}
                  className={`flex-shrink-0 flex items-center px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 touch-manipulation ${
                    isSelected
                      ? 'bg-gradient-to-b from-primary-saffron to-primary-saffron/90 text-white border border-primary-saffron/80 shadow-[0_4px_12px_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.25)] active:shadow-[0_1px_4px_rgba(0,0,0,0.15),inset_0_2px_4px_rgba(0,0,0,0.1)]'
                      : 'bg-gradient-to-b from-white/70 to-white/40 text-premium-section-text border border-slate-200/90 shadow-[0_2px_6px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.8)] hover:from-white/80 hover:to-white/50 hover:text-primary-saffron hover:border-primary-saffron/40 hover:shadow-[0_3px_10px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] backdrop-blur-sm'
                  }`}
                >
                  {t(labelKey, language)}
                </button>
              );
            })}
          </div>
        </div>

      {/* Content – full width on mobile, clear spacing below header */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 pt-8 pb-10 sm:py-14">
        <div className="space-y-10 sm:space-y-16">
          {categoriesToShow.map((category) => {
            if (selectedCategory !== 'all' && selectedCategory !== category) return null;

            if (category === FOOD_CATEGORY) {
              return (
                <section
                  key="food"
                  id="food"
                  className="scroll-mt-24 rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-sm border border-amber-200/50 shadow-xl shadow-amber-900/5 overflow-hidden"
                >
                  <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-8 py-4 sm:py-6 border-b border-amber-200/40 bg-gradient-to-r from-amber-50/80 to-orange-50/50">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary-saffron/20 to-amber-200/50 flex items-center justify-center text-xl sm:text-2xl border border-amber-200/60 shadow-inner">
                      {CATEGORY_ICONS.food}
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-2xl font-bold text-premium-section-text tracking-tight">
                        {t('explore.category.food', language)}
                      </h2>
                      <p className="text-xs sm:text-sm text-premium-section-muted mt-0.5">{restaurants.length} {language === 'hi' ? 'स्थान' : 'places'}</p>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 lg:p-8">
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-5 items-start">
                      {restaurants.map((r, i) => (
                        <RestaurantCard key={i} restaurant={r} language={language} />
                      ))}
                    </div>
                  </div>
                </section>
              );
            }

            if (category === AARTI_CATEGORY) {
              return (
                <section
                  key="aarti"
                  id="aarti"
                  className="scroll-mt-24 rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-sm border border-amber-200/50 shadow-xl shadow-amber-900/5 overflow-hidden"
                >
                  <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-8 py-4 sm:py-6 border-b border-amber-200/40 bg-gradient-to-r from-amber-50/80 to-orange-50/50 border-l-4 border-l-primary-saffron">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary-saffron/20 to-amber-200/50 flex items-center justify-center text-xl sm:text-2xl border border-amber-200/60 shadow-inner">
                      {CATEGORY_ICONS.aarti}
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-2xl font-bold text-premium-section-text tracking-tight">
                        {t('explore.category.aarti', language)}
                      </h2>
                      <p className="text-xs sm:text-sm text-premium-section-muted mt-0.5">
                        {aartiPlaces.length + aartiRituals.length} {language === 'hi' ? 'स्थान / समारोह' : 'places & ceremonies'}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6 lg:p-8 space-y-8 sm:space-y-10">
                    {aartiPlaces.length > 0 && (
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-premium-section-text uppercase tracking-wider mb-3 sm:mb-4">
                          {t('explore.aarti.where', language)}
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6 items-start">
                          {aartiPlaces.map((place, i) => (
                            <div
                              key={i}
                              role="button"
                              tabIndex={0}
                              onClick={() => setSelectedPlace(place)}
                              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedPlace(place); } }}
                              className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg shadow-primary-saffron/5 border border-primary-saffron/10 bg-white/95 active:scale-[0.98] cursor-pointer"
                            >
                              <PlaceCard place={place} language={language} fillHeight compact minimal />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {aartiRituals.length > 0 && (
                      <div>
                        <h3 className="text-sm sm:text-base font-semibold text-premium-section-text uppercase tracking-wider mb-3 sm:mb-4">
                          {t('explore.aarti.ceremonies', language)}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                          {aartiRituals.map((ritual, i) => (
                            <RitualCard key={i} ritual={ritual} language={language} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              );
            }

            const items = placesByCategory[category as PlaceCategory];
            if (!items || items.length === 0) return null;

            const icon = CATEGORY_ICONS[category] || '📍';

            return (
              <section
                key={category}
                id={category}
                className="scroll-mt-24 rounded-2xl sm:rounded-3xl bg-white/80 backdrop-blur-sm border border-primary-saffron/10 shadow-xl shadow-primary-saffron/5 overflow-hidden"
              >
                <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-8 py-3.5 sm:py-6 border-b border-primary-saffron/10 bg-gradient-to-r from-premium-peach/60 to-white/80 border-l-4 border-l-primary-saffron">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary-saffron/15 to-amber-200/50 flex items-center justify-center text-xl sm:text-2xl border border-primary-saffron/20 shadow-inner flex-shrink-0">
                    {icon}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-2xl font-bold text-premium-section-text tracking-tight">
                      {t(`explore.category.${category}`, language)}
                    </h2>
                    <p className="text-xs sm:text-sm text-premium-section-muted mt-0.5">{items.length} {language === 'hi' ? 'स्थान' : 'places'}</p>
                  </div>
                </div>
                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6 items-start">
                    {items.map((place, i) => (
                      <div
                        key={i}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedPlace(place)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedPlace(place); } }}
                        className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg shadow-primary-saffron/5 border border-primary-saffron/10 bg-white/95 active:scale-[0.98] cursor-pointer"
                      >
                        <PlaceCard place={place} language={language} fillHeight compact minimal />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* Bottom spacing for scroll */}
      <div className="h-12" aria-hidden />

      {/* Place detail popup – mobile only; full details on card tap */}
      {selectedPlace && isMobile && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-out ${popupOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={closePopup}
          role="dialog"
          aria-modal="true"
          aria-labelledby="place-detail-title"
        >
          <div
            className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-primary-saffron/20 transition-all duration-300 ease-out ${popupOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closePopup}
              className="absolute top-3 right-3 z-20 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-slate-600 hover:bg-white hover:text-primary-dark transition-colors"
              aria-label={language === 'hi' ? 'बंद करें' : 'Close'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="h-1 w-full bg-gradient-to-r from-primary-saffron via-amber-400 to-primary-saffron flex-shrink-0" aria-hidden />
            {selectedPlace.image && (
              <div className="relative w-full aspect-video overflow-hidden">
                <img
                  src={selectedPlace.image}
                  alt={getLocalizedContent(selectedPlace.name, language)}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-5 sm:p-6">
              <h2 id="place-detail-title" className="text-xl sm:text-2xl font-bold text-primary-dark tracking-tight mb-2">
                {getLocalizedContent(selectedPlace.name, language)}
              </h2>
              {selectedPlace.category && (
                <span className="inline-block text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary-saffron/10 text-primary-saffron border border-primary-saffron/20 mb-4">
                  {selectedPlace.category}
                </span>
              )}
              <p className="text-primary-dark/85 text-sm sm:text-base leading-relaxed mb-4">
                {getLocalizedContent(selectedPlace.description, language)}
              </p>
              {selectedPlace.spiritualImportance && (
                <p className="text-primary-dark/80 text-sm leading-relaxed mb-4">
                  {getLocalizedContent(selectedPlace.spiritualImportance, language)}
                </p>
              )}
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedPlace.bestTimeToVisit && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/60 font-medium text-sm px-3 py-2">
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {selectedPlace.bestTimeToVisit}
                  </span>
                )}
                {selectedPlace.visitDuration && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 text-violet-900 border border-violet-200/60 font-medium text-sm px-3 py-2">
                    <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    {selectedPlace.visitDuration}
                  </span>
                )}
              </div>
              {selectedPlace.location && (
                <button
                  type="button"
                  onClick={() => openGoogleMapsDirections(selectedPlace.location!, getLocalizedContent(selectedPlace.name, language))}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-sky-50 text-sky-800 border border-sky-200/60 font-semibold text-sm py-3 hover:bg-sky-100 hover:border-sky-300/80 transition-colors touch-manipulation"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  {t('get.directions', language)}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
