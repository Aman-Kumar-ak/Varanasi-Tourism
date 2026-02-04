'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { getApiUrl } from '@/lib/utils';
import ComprehensiveCityGuide from '@/components/city/ComprehensiveCityGuide';
import BeautifulLoading from '@/components/common/BeautifulLoading';
import { LANGUAGE_CHANGE_SCROLL_KEY } from '@/components/common/LanguageSelector';
import { clearAccordionRestoreKeys } from '@/lib/accordionRestore';
import { cachedFetch, CACHE_DURATIONS } from '@/lib/cache';

export default function CityPage() {
  const params = useParams();
  const { language } = useLanguage();
  const [city, setCity] = useState<any>(null);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const prevLoadingRef = useRef(true);

  const fetchCityData = useCallback(async () => {
    if (!params.name) return;
    
    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      
      // Use cached fetch for city data (static data - 7 days cache)
      const data = await cachedFetch<{ success: boolean; data: any }>(
        `${apiUrl}/api/cities/${params.name}`,
        {},
        CACHE_DURATIONS.STATIC
      );

      if (data.success) {
        setCity(data.data);
        
        // Fetch quotes for this city (semi-static data - 24 hours cache)
        try {
          const quotesData = await cachedFetch<{ success: boolean; data: any[] }>(
            `${apiUrl}/api/quotes`,
            {},
            CACHE_DURATIONS.SEMI_STATIC
          );
          if (quotesData.success) {
            setQuotes(quotesData.data || []);
          }
        } catch (error) {
          console.error('Error fetching quotes:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching city data:', error);
    } finally {
      setLoading(false);
    }
  }, [params.name]);

  useEffect(() => {
    fetchCityData();
  }, [fetchCityData, language]);

  // Scroll to top in a way that works on mobile (window + documentElement + body, and delayed retry)
  const scrollToTop = useCallback(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo(0, 0);
    const doc = document.documentElement;
    const body = document.body;
    if (doc) doc.scrollTop = 0;
    if (body) body.scrollTop = 0;
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
  useEffect(() => {
    if (prevLoadingRef.current === true && loading === false && city) {
      const scrollY = sessionStorage.getItem(LANGUAGE_CHANGE_SCROLL_KEY);
      if (scrollY !== null) {
        const position = parseInt(scrollY, 10);
        if (Number.isFinite(position)) {
          sessionStorage.removeItem(LANGUAGE_CHANGE_SCROLL_KEY);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              window.scrollTo({ top: position, behavior: 'instant' as ScrollBehavior });
            });
          });
        } else {
          sessionStorage.removeItem(LANGUAGE_CHANGE_SCROLL_KEY);
        }
      } else {
        // No saved position (refresh or first visit): scroll to top once when content is ready.
        // Avoid delayed timeouts so we don't snap back to top after the user has started scrolling.
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

