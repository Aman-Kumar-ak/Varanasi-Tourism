'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedContent } from '@/lib/i18n';
import { INDIAN_STATES } from '@/lib/constants';

interface Jyotirlinga {
  _id: string;
  slug: string;
  name: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  city: string;
  state: string;
  stateCode: string;
  images: string[];
  description?: {
    en: string;
    hi: string;
    [key: string]: string;
  };
}

export default function FeaturedTemples() {
  const { language } = useLanguage();
  const [jyotirlingas, setJyotirlingas] = useState<Jyotirlinga[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string>('all');

  useEffect(() => {
    fetchJyotirlingas();
  }, [selectedState]);

  const fetchJyotirlingas = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const url = selectedState === 'all' 
        ? `${apiUrl}/api/jyotirlingas`
        : `${apiUrl}/api/jyotirlingas?state=${selectedState}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setJyotirlingas(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching Jyotirlingas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">
            All 12 Jyotirlingas
          </h2>
          <p className="text-lg text-primary-dark/70 max-w-2xl mx-auto">
            Discover and book Darshan at all sacred Jyotirlingas across India
          </p>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <button
            onClick={() => setSelectedState('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedState === 'all'
                ? 'bg-primary-orange text-white'
                : 'bg-background-parchment text-primary-dark hover:bg-primary-blue/10'
            }`}
          >
            All
          </button>
          {INDIAN_STATES.map((state) => (
            <button
              key={state.code}
              onClick={() => setSelectedState(state.name)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedState === state.name
                  ? 'bg-primary-orange text-white'
                  : 'bg-background-parchment text-primary-dark hover:bg-primary-blue/10'
              }`}
            >
              {state.name} ({state.jyotirlingaCount})
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
            <p className="mt-4 text-primary-dark/70">Loading temples...</p>
          </div>
        )}

        {/* Jyotirlingas Grid */}
        {!loading && (
          <>
            {jyotirlingas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-primary-dark/70">No Jyotirlingas found. Please check back later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {jyotirlingas.map((temple) => (
                  <Link
                    key={temple._id}
                    href={`/jyotirlinga/${temple.slug}`}
                    className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 border border-primary-blue/5 hover:border-primary-blue/20"
                  >
                    {/* Mobile: Horizontal Layout, Desktop: Vertical Layout */}
                    <div className="flex sm:flex-col">
                      {/* Temple Image */}
                      <div className="relative w-28 sm:w-full h-28 sm:h-48 bg-background-parchment flex-shrink-0">
                        {temple.images && temple.images.length > 0 ? (
                          <Image
                            src={temple.images[0]}
                            alt={getLocalizedContent(temple.name, language)}
                            fill
                            sizes="(max-width: 640px) 112px, 100vw"
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl sm:text-6xl">
                            🏛️
                          </div>
                        )}
                        {/* State Badge */}
                        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-primary-gold text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-semibold">
                          {temple.stateCode}
                        </div>
                      </div>

                      {/* Temple Info */}
                      <div className="flex-1 p-3 sm:p-5 flex flex-col">
                        <h3 className="text-base sm:text-xl font-bold text-primary-dark mb-1 sm:mb-2 group-hover:text-primary-orange transition-colors line-clamp-2">
                          {getLocalizedContent(temple.name, language)}
                        </h3>
                        <p className="text-xs sm:text-sm text-primary-dark/60 mb-2 sm:mb-4 line-clamp-1">
                          {temple.city}, {temple.state}
                        </p>
                        <p className="text-xs sm:text-sm text-primary-dark/70 line-clamp-2 mb-3 sm:mb-4 hidden sm:block">
                          {getLocalizedContent(temple.description, language)}
                        </p>
                        <div className="flex gap-2 sm:gap-3 mt-auto">
                          <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-primary-blue text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-primary-blue/90 transition-colors whitespace-nowrap">
                            Book Now
                          </span>
                          <span className="px-3 py-1.5 sm:px-4 sm:py-2 border border-primary-gold text-primary-gold rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap">
                            Explore
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/jyotirlingas"
            className="inline-block px-8 py-3 bg-primary-orange text-white rounded-lg font-semibold hover:bg-primary-orange/90 transition-colors shadow-lg"
          >
            View All Jyotirlingas
          </Link>
        </div>
      </div>
    </section>
  );
}

