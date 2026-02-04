'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { getApiUrl } from '@/lib/utils';
import BeautifulLoading from '@/components/common/BeautifulLoading';
import { LANGUAGE_CHANGE_SCROLL_KEY } from '@/components/common/LanguageSelector';
import { clearAccordionRestoreKeys } from '@/lib/accordionRestore';
import { cachedFetch, CACHE_DURATIONS, getCachedData } from '@/lib/cache';

// Dynamically import ComprehensiveCityGuide for code splitting and faster initial load
// SSR enabled for SEO, but code-split for faster hydration and smaller initial bundle
const ComprehensiveCityGuide = dynamic(
  () => import('@/components/city/ComprehensiveCityGuide'),
  {
    loading: () => <BeautifulLoading />,
    ssr: true, // Keep SSR for SEO
  }
);

export default function CityPage() {
  const params = useParams();
  const { language } = useLanguage();
  // Initial state must match server (no localStorage/cache) to avoid hydration mismatch
  const [city, setCity] = useState<any>(null);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const prevLoadingRef = useRef(true);
  const cacheAppliedRef = useRef(false);

  const fetchCityData = useCallback(async () => {
    if (!params.name) return;
    
    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      
      // Fetch city data and quotes in parallel for faster loading
      const [cityResponse, quotesResponse] = await Promise.allSettled([
        cachedFetch<{ success: boolean; data: any }>(
          `${apiUrl}/api/cities/${params.name}`,
          {},
          CACHE_DURATIONS.STATIC
        ),
        cachedFetch<{ success: boolean; data: any[] }>(
          `${apiUrl}/api/quotes`,
          {},
          CACHE_DURATIONS.SEMI_STATIC
        ),
      ]);

      // Process city data
      if (cityResponse.status === 'fulfilled' && cityResponse.value.success) {
        setCity(cityResponse.value.data);
      }

      // Process quotes data (non-blocking - can load after city)
      if (quotesResponse.status === 'fulfilled' && quotesResponse.value.success) {
        setQuotes(quotesResponse.value.data || []);
      }
    } catch (error) {
      console.error('Error fetching city data:', error);
    } finally {
      setLoading(false);
    }
  }, [params.name]);

  // After mount (client-only): apply cache for fast display, then fetch. Refetch when language changes.
  useEffect(() => {
    if (!params.name) return;
    const apiUrl = getApiUrl();
    const isInitial = !cacheAppliedRef.current;
    if (isInitial) {
      cacheAppliedRef.current = true;
      const cityCached = getCachedData<{ success: boolean; data: any }>(
        `${apiUrl}/api/cities/${params.name}`
      );
      const quotesCached = getCachedData<{ success: boolean; data: any[] }>(
        `${apiUrl}/api/quotes`
      );
      if (cityCached?.success && cityCached.data) {
        setCity(cityCached.data);
        setLoading(false);
      }
      if (quotesCached?.success && quotesCached.data) {
        setQuotes(quotesCached.data);
      }
    }
    fetchCityData();
  }, [params.name, language, fetchCityData]);

  useEffect(() => {
    fetchCityData();
  }, [fetchCityData, language]);

  // Optimized scroll to top - single synchronous call for instant positioning
  const scrollToTop = useCallback(() => {
    if (typeof window === 'undefined') return;
    // Use instant scroll without animation for faster initial load
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, []);

  // On mount: clear scroll restore and accordion restore so refresh/close = start at top, all dropdowns closed
  useEffect(() => {
    sessionStorage.removeItem(LANGUAGE_CHANGE_SCROLL_KEY);
    clearAccordionRestoreKeys();
    if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    scrollToTop();
    return () => {
      if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    };
  }, [scrollToTop]);

  // After loading: restore scroll only after language change; otherwise always scroll to top (refresh/first visit)
  // Optimized: single synchronous scroll call without RAF delays
  useEffect(() => {
    if (prevLoadingRef.current === true && loading === false && city) {
      const scrollY = sessionStorage.getItem(LANGUAGE_CHANGE_SCROLL_KEY);
      if (scrollY !== null) {
        const position = parseInt(scrollY, 10);
        if (Number.isFinite(position)) {
          sessionStorage.removeItem(LANGUAGE_CHANGE_SCROLL_KEY);
          // Direct scroll without RAF delays for instant positioning
          window.scrollTo({ top: position, left: 0, behavior: 'instant' });
        } else {
          sessionStorage.removeItem(LANGUAGE_CHANGE_SCROLL_KEY);
        }
      } else {
        // No saved position (refresh or first visit): scroll to top instantly
        scrollToTop();
      }
    }
    prevLoadingRef.current = loading;
  }, [loading, city, scrollToTop]);

  if (loading) {
    return <BeautifulLoading />;
  }

  if (!city) {
    return (
      <div className="min-h-screen bg-background-parchment flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">City Not Found</h2>
          <Link href="/cities" className="text-primary-blue hover:underline">
            Back to Cities
          </Link>
        </div>
      </div>
    );
  }

  return <ComprehensiveCityGuide city={city} language={language} citySlug={typeof params.name === 'string' ? params.name : undefined} quotes={quotes} />;
}

