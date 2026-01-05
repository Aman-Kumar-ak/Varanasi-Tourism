'use client';

import Image from 'next/image';
import Link from 'next/link';
import { getLocalizedContent } from '@/lib/i18n';
import { getOptimizedVideoUrl, getVideoThumbnail } from '@/lib/cloudinary';
import { t } from '@/lib/translations';
import type { LanguageCode } from '@/lib/constants';
import SectionHeader from './SectionHeader';
import PlaceCard from './PlaceCard';
import TransportationGuide from './TransportationGuide';
import RoutePlanner from './RoutePlanner';

interface City {
  _id: string;
  name: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  state: string;
  images: string[];
  videos?: string[];
  places: any[];
  hotels: any[];
  restaurants: any[];
  transportInfo: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  emergencyContacts: Array<{
    name: string;
    phone: string;
    type: 'police' | 'hospital' | 'temple' | 'tourist-helpline';
  }>;
  weatherInfo?: {
    bestTimeToVisit: string;
    averageTemp: string;
  };
  jyotirlingaId?: {
    _id: string;
    name: {
      en: string;
      hi: string;
      [key: string]: string;
    };
    slug: string;
  };
  // New fields
  bookingEnabled?: boolean;
  officialBookingUrl?: string;
  spiritualSignificance?: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  history?: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  festivals?: Array<{
    name: string;
    date: string;
    description: {
      en: string;
      hi: string;
      [key: string]: string;
    };
  }>;
  rituals?: Array<{
    name: {
      en: string;
      hi: string;
      [key: string]: string;
    };
    description: {
      en: string;
      hi: string;
      [key: string]: string;
    };
    timing?: string;
  }>;
  darshanInfo?: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  entryPoints?: any[];
  transportOptions?: any[];
  routes?: any[];
  transportTips?: {
    en: string;
    hi: string;
    [key: string]: string;
  };
}

interface ComprehensiveCityGuideProps {
  city: City;
  language: LanguageCode;
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
      return 'bg-primary-teal';
    case 'mid-range':
      return 'bg-primary-blue';
    case 'luxury':
      return 'bg-primary-orange';
    default:
      return 'bg-gray-500';
  }
}

export default function ComprehensiveCityGuide({
  city,
  language,
}: ComprehensiveCityGuideProps) {
  return (
    <div className="min-h-screen bg-background-parchment">
      {/* Hero Section with Video Background */}
      <section className="relative h-64 sm:h-80 md:h-96 bg-primary-blue overflow-hidden">
        {/* Video Background */}
        {city.videos && city.videos.length > 0 ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster={getVideoThumbnail(city.videos[0], 1920, 1080)}
          >
            <source 
              src={getOptimizedVideoUrl(city.videos[0], { 
                width: 1920, 
                quality: 'auto',
                format: 'auto'
              })} 
              type="video/mp4" 
            />
          </video>
        ) : city.images && city.images.length > 0 ? (
          <Image
            src={city.images[0]}
            alt={getLocalizedContent(city.name, language)}
            fill
            sizes="100vw"
            className="object-cover opacity-60"
          />
        ) : null}
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-primary-dark/50"></div>
        {/* Text Content */}
        <div className="container mx-auto px-4 relative z-10 h-full flex items-end pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {getLocalizedContent(city.name, language)}
            </h1>
            <p className="text-xl text-white/90">{city.state}</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Spiritual Significance */}
        {city.spiritualSignificance && (
          <section className="mb-12">
            <SectionHeader
              title={t('spiritual.significance', language)}
              icon="🕉️"
              subtitle={t('why.city.sacred', language)}
            />
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <p className="text-primary-dark/80 leading-relaxed whitespace-pre-line">
                {getLocalizedContent(city.spiritualSignificance, language)}
              </p>
            </div>
          </section>
        )}

        {/* History */}
        {city.history && (
          <section className="mb-12">
            <SectionHeader title={t('history', language)} icon="📜" subtitle={t('historical.background', language)} />
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <p className="text-primary-dark/80 leading-relaxed whitespace-pre-line">
                {getLocalizedContent(city.history, language)}
              </p>
            </div>
          </section>
        )}

        {/* Places to Visit */}
        {city.places && city.places.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              title={t('places.to.visit', language)}
              icon="📍"
              subtitle={t('explore.sacred.sites', language)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {city.places.map((place, index) => (
                <PlaceCard key={index} place={place} language={language} />
              ))}
            </div>
          </section>
        )}

        {/* Rituals & Practices */}
        {city.rituals && city.rituals.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              title={t('rituals.practices', language)}
              icon="🕯️"
              subtitle={t('sacred.rituals.significance', language)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {city.rituals.map((ritual, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-primary-dark mb-2">
                    {getLocalizedContent(ritual.name, language)}
                  </h3>
                  {ritual.timing && (
                    <p className="text-sm text-primary-orange mb-2">⏰ {ritual.timing}</p>
                  )}
                  <p className="text-primary-dark/80 leading-relaxed">
                    {getLocalizedContent(ritual.description, language)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Festivals Calendar */}
        {city.festivals && city.festivals.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              title={t('festivals.calendar', language)}
              icon="🎉"
              subtitle={t('important.festivals', language)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {city.festivals.map((festival, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-primary-dark mb-2">
                    {festival.name}
                  </h3>
                  <p className="text-sm text-primary-orange mb-3">📅 {festival.date}</p>
                  <p className="text-primary-dark/80 text-sm leading-relaxed">
                    {getLocalizedContent(festival.description, language)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Darshan Information */}
        {city.darshanInfo && (
          <section className="mb-12">
            <SectionHeader
              title={t('darshan.information', language)}
              icon="📿"
              subtitle={t('how.to.book.darshan', language)}
            />
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <p className="text-primary-dark/80 leading-relaxed whitespace-pre-line mb-4">
                {getLocalizedContent(city.darshanInfo, language)}
              </p>
              {city.officialBookingUrl && (
                <a
                  href={city.officialBookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-primary-teal text-white rounded-lg hover:bg-primary-teal/90 transition-colors font-medium"
                >
                  {t('visit.official.website', language)}
                </a>
              )}
            </div>
          </section>
        )}

        {/* Transportation Guide */}
        {city.transportOptions && city.transportOptions.length > 0 && (
          <TransportationGuide
            transportOptions={city.transportOptions}
            transportTips={city.transportTips}
            language={language}
          />
        )}

        {/* Route Planner */}
        {city.entryPoints && city.entryPoints.length > 0 && city.routes && (
          <RoutePlanner
            entryPoints={city.entryPoints}
            routes={city.routes}
            language={language}
          />
        )}

        {/* Hotels & Accommodation */}
        {city.hotels && city.hotels.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              title={t('hotels.accommodation', language)}
              icon="🏨"
              subtitle={t('where.to.stay', language)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {city.hotels.map((hotel, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-primary-blue/5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg sm:text-xl font-bold text-primary-dark flex-1">
                      {hotel.name}
                    </h3>
                    <span
                      className={`${getPriceRangeColor(
                        hotel.priceRange
                      )} text-white px-2 py-1 rounded text-xs font-semibold flex-shrink-0`}
                    >
                      {getPriceRangeLabel(hotel.priceRange)}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-primary-dark/60 mb-3 flex items-start gap-2">
                    <span className="flex-shrink-0">📍</span>
                    <span className="line-clamp-2">{hotel.address}</span>
                  </p>
                  {hotel.rating && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-primary-orange font-semibold text-sm sm:text-base">
                        ⭐ {hotel.rating}
                      </span>
                    </div>
                  )}
                  {hotel.contact && (
                    <p className="text-xs sm:text-sm text-primary-dark/70 mb-2 break-all">
                      📞 {hotel.contact}
                    </p>
                  )}
                  {hotel.website && (
                    <a
                      href={hotel.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm text-primary-blue hover:underline break-all"
                    >
                      Visit Website →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Restaurants & Food */}
        {city.restaurants && city.restaurants.length > 0 && (
          <section className="mb-12">
            <SectionHeader
              title={t('restaurants.food', language)}
              icon="🍽️"
              subtitle={t('where.to.eat', language)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {city.restaurants.map((restaurant, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-primary-blue/5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg sm:text-xl font-bold text-primary-dark flex-1">
                      {restaurant.name}
                    </h3>
                    <span
                      className={`${getPriceRangeColor(
                        restaurant.priceRange
                      )} text-white px-2 py-1 rounded text-xs font-semibold flex-shrink-0`}
                    >
                      {getPriceRangeLabel(restaurant.priceRange)}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-primary-teal font-semibold mb-2">
                    {restaurant.cuisine}
                  </p>
                  <p className="text-xs sm:text-sm text-primary-dark/60 mb-3 flex items-start gap-2">
                    <span className="flex-shrink-0">📍</span>
                    <span className="line-clamp-2">{restaurant.address}</span>
                  </p>
                  {restaurant.contact && (
                    <p className="text-xs sm:text-sm text-primary-dark/70 break-all">
                      📞 {restaurant.contact}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Transport & Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-12">
          {/* Transport Info */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <h3 className="text-xl sm:text-2xl font-bold text-primary-dark mb-4">
              🚗 Transport Information
            </h3>
            <p className="text-sm sm:text-base text-primary-dark/70 leading-relaxed">
              {getLocalizedContent(city.transportInfo, language)}
            </p>
          </div>

          {/* Weather & Best Time */}
          {city.weatherInfo && (
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
              <h3 className="text-xl sm:text-2xl font-bold text-primary-dark mb-4">
                🌤️ Weather & Best Time to Visit
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-primary-dark/60 mb-1">
                    {t('best.time', language)}
                  </p>
                  <p className="font-semibold text-primary-dark text-base">
                    {city.weatherInfo.bestTimeToVisit}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-primary-dark/60 mb-1">
                    {t('temperature', language)}
                  </p>
                  <p className="font-semibold text-primary-dark text-sm sm:text-base">
                    {city.weatherInfo.averageTemp}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Emergency Contacts */}
        {city.emergencyContacts && city.emergencyContacts.length > 0 && (
          <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
            <h3 className="text-xl sm:text-2xl font-bold text-primary-dark mb-4">
              🆘 Emergency Contacts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {city.emergencyContacts.map((contact, index) => (
                <div
                  key={index}
                  className="bg-background-parchment rounded-lg p-3 sm:p-4"
                >
                  <p className="font-semibold text-primary-dark mb-1 text-sm sm:text-base">
                    {contact.name}
                  </p>
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-primary-blue hover:underline text-xs sm:text-sm break-all"
                  >
                    {contact.phone}
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

