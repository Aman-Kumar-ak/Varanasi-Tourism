'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import FilterBar from '@/components/jyotirlinga/FilterBar';
import TempleCard from '@/components/jyotirlinga/TempleCard';
import { getApiUrl } from '@/lib/utils';

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
  description: {
    en: string;
    hi: string;
    [key: string]: string;
  };
}

export default function JyotirlingasPage() {
  const { language } = useLanguage();
  const [jyotirlingas, setJyotirlingas] = useState<Jyotirlinga[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchJyotirlingas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedState, selectedCity, searchQuery]);

  const fetchJyotirlingas = async () => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      let url = `${apiUrl}/api/jyotirlingas`;
      
      const params = new URLSearchParams();
      if (selectedState !== 'all') params.append('state', selectedState);
      if (selectedCity !== 'all') params.append('city', selectedCity);
      if (searchQuery) params.append('search', searchQuery);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setJyotirlingas(data.data || []);
      } else {
        console.error('API Error:', data.error);
      }
    } catch (error) {
      console.error('Error fetching Jyotirlingas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique cities for selected state
  const cities = useMemo(() => {
    if (selectedState === 'all') return [];
    const stateTemples = jyotirlingas.filter((t) => t.state === selectedState);
    return Array.from(new Set(stateTemples.map((t) => t.city))).sort();
  }, [jyotirlingas, selectedState]);

  return (
    <div className="min-h-screen bg-background-parchment">
      {/* Page Header */}
      <div className="bg-primary-blue text-white py-12 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            All 12 Jyotirlingas
          </h1>
          <p className="text-xl text-white/90">
            Discover and book Darshan at India&apos;s most sacred temples
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        onStateChange={setSelectedState}
        onCityChange={setSelectedCity}
        onSearchChange={setSearchQuery}
        selectedState={selectedState}
        selectedCity={selectedCity}
        searchQuery={searchQuery}
        cities={cities}
      />

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-primary-dark/70">
            {loading ? (
              'Loading...'
            ) : (
              <>
                <span className="font-semibold text-primary-dark">
                  {jyotirlingas.length}
                </span>{' '}
                {jyotirlingas.length === 1 ? 'Jyotirlinga' : 'Jyotirlingas'} found
                {selectedState !== 'all' && ` in ${selectedState}`}
                {selectedCity !== 'all' && `, ${selectedCity}`}
              </>
            )}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
            <p className="mt-4 text-primary-dark/70">Loading temples...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && jyotirlingas.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-primary-dark mb-2">
              No Jyotirlingas Found
            </h3>
            <p className="text-primary-dark/70 mb-6">
              Try adjusting your filters or search query
            </p>
            <button
              onClick={() => {
                setSelectedState('all');
                setSelectedCity('all');
                setSearchQuery('');
              }}
              className="px-6 py-3 bg-primary-blue text-white rounded-lg font-medium hover:bg-primary-blue/90 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Jyotirlingas Grid */}
        {!loading && jyotirlingas.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {jyotirlingas.map((temple) => (
              <TempleCard key={temple._id} temple={temple} language={language} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

