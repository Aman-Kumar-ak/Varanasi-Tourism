'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { getApiUrl } from '@/lib/utils';
import ComprehensiveCityGuide from '@/components/city/ComprehensiveCityGuide';
import BeautifulLoading from '@/components/common/BeautifulLoading';

export default function CityPage() {
  const params = useParams();
  const { language } = useLanguage();
  const [city, setCity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCityData = useCallback(async () => {
    if (!params.name) return;
    
    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      // Add cache-busting query parameter to ensure fresh data
      const response = await fetch(`${apiUrl}/api/cities/${params.name}?t=${Date.now()}`, {
        cache: 'no-store',
      });
      const data = await response.json();

      if (data.success) {
        setCity(data.data);
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

  return <ComprehensiveCityGuide city={city} language={language} />;
}

