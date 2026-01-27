'use client';

import { useState, useMemo } from 'react';
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

export default function PlacesToStay({ hotels, language }: PlacesToStayProps) {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      const typeMatch = selectedType === 'all' || hotel.type === selectedType;
      const locationMatch = selectedLocation === 'all' || 
        (hotel.location && hotel.location.toLowerCase().includes(selectedLocation.replace('-', ' ')));
      return typeMatch && locationMatch;
    });
  }, [hotels, selectedType, selectedLocation]);

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

      {/* Hotels Grid */}
      {filteredHotels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {filteredHotels.map((hotel, index) => (
            <div
              key={index}
              className="card-modern rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-none sm:shadow-card border-l-4 border-primary-gold h-full flex flex-col relative overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
              {/* Decorative gradient background */}
              <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-temple opacity-5 rounded-full -mr-10 -mt-10 sm:-mr-12 sm:-mt-12 group-hover:opacity-10 transition-opacity"></div>
              
              {/* Header: Name */}
              <div className="mb-3 sm:mb-4 relative z-10">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary-dark" style={{ lineHeight: '1.4' }}>
                  {hotel.name}
                </h3>
              </div>

              {/* Type Badge */}
              {hotel.type && (
                <div className="mb-3 sm:mb-4 relative z-10">
                  <span className="text-xs sm:text-sm text-primary-gold font-bold bg-primary-gold/10 rounded-md sm:rounded-lg px-3 py-1.5 inline-block capitalize">
                    {t(`places.stay.filter.${hotel.type}`, language)}
                  </span>
                </div>
              )}
              
              {/* Address */}
              {hotel.address && (
                <div className="mb-2 sm:mb-3 relative z-10">
                  <p className="text-xs sm:text-sm md:text-base text-primary-dark/70 flex items-start gap-1.5 sm:gap-2 leading-relaxed">
                    <span className="flex-shrink-0 text-sm sm:text-base md:text-lg">📍</span>
                    <span className="break-words">{hotel.address}</span>
                  </p>
                </div>
              )}
              
              {/* Rating and Contact */}
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 relative z-10 flex-wrap">
                {hotel.rating && (
                  <div className="bg-primary-gold/10 rounded-md sm:rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 inline-flex items-center gap-1">
                    <span className="text-primary-gold text-xs sm:text-sm md:text-base">⭐</span>
                    <span className="text-primary-gold font-bold text-xs sm:text-sm md:text-base">
                      {hotel.rating}
                    </span>
                  </div>
                )}
                {hotel.contact && (
                  <p className="text-xs sm:text-sm text-primary-dark/80 break-all flex items-center gap-1.5 sm:gap-2">
                    <span className="text-primary-gold text-sm sm:text-base">📞</span>
                    <span className="truncate sm:break-all">{hotel.contact}</span>
                  </p>
                )}
              </div>
              
              {/* Website link */}
              {hotel.website && (
                <div className="mt-auto relative z-10">
                  <a
                    href={hotel.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm text-primary-gold font-semibold break-all flex items-center justify-center gap-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-md sm:rounded-lg hover:bg-primary-gold/5 transition-colors touch-manipulation min-h-[36px] sm:min-h-[44px] border border-primary-gold/20"
                  >
                    {t('places.stay.visit.website', language)} <span>→</span>
                  </a>
                </div>
              )}
            </div>
          ))}
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
