'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedContent } from '@/lib/i18n';
import { getApiUrl } from '@/lib/utils';

interface City {
  _id: string;
  name: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  state: string;
  images: string[];
  jyotirlingaId?: {
    name: {
      en: string;
      hi: string;
      [key: string]: string;
    };
    slug: string;
  };
}

export default function CitiesPage() {
  const { language } = useLanguage();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/cities`);
      const data = await response.json();

      if (data.success) {
        setCities(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-parchment flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
          <p className="mt-4 text-primary-dark/70">Loading cities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-parchment">
      {/* Page Header */}
      <div className="bg-primary-blue text-white py-12 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Explore Cities
          </h1>
          <p className="text-lg sm:text-xl text-white/90">
            Discover spiritual destinations across India
          </p>
        </div>
      </div>

      {/* Cities Grid */}
      <div className="container mx-auto px-4 py-8">
        {cities.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-primary-dark/70">No cities found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {cities.map((city) => (
              <Link
                key={city._id}
                href={`/city/${city.name.en.toLowerCase()}`}
                className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 border border-primary-blue/5 hover:border-primary-blue/20 block"
              >
                {/* City Image */}
                <div className="relative h-48 sm:h-56 bg-background-parchment">
                  {city.images && city.images.length > 0 ? (
                    <Image
                      src={city.images[0]}
                      alt={getLocalizedContent(city.name, language)}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl sm:text-7xl">
                      🏛️
                    </div>
                  )}
                </div>

                {/* City Info */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-primary-dark mb-2">
                    {getLocalizedContent(city.name, language)}
                  </h3>
                  <p className="text-sm sm:text-base text-primary-dark/60 mb-3">
                    {city.state}
                  </p>
                  {city.jyotirlingaId && (
                    <p className="text-sm text-primary-teal font-semibold mb-4">
                      {getLocalizedContent(city.jyotirlingaId.name, language)}
                    </p>
                  )}
                  <span className="inline-block px-4 py-2 bg-primary-blue text-white rounded-lg text-sm font-medium hover:bg-primary-blue/90 transition-colors">
                    Explore City
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

