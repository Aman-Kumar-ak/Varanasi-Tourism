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
      return 'bg-primary-gold';
      case 'mid-range':
      return 'bg-primary-blue';
      case 'luxury':
      return 'bg-gradient-temple';
      default:
      return 'bg-gray-500';
  }
}

export default function ComprehensiveCityGuide({
  city,
  language,
}: ComprehensiveCityGuideProps) {
  return (
    <div className="min-h-screen bg-gradient-sacred">
      {/* Hero Section with Video Background */}
      <section className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
        {/* Video Background */}
        {city.videos && city.videos.length > 0 ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-105"
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
            className="object-cover scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-temple"></div>
        )}
        {/* Enhanced overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-overlay"></div>
        {/* Decorative golden border at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-temple"></div>
        {/* Text Content */}
        <div className="container mx-auto px-4 relative z-10 h-full flex items-end pb-12">
          <div className="animate-fade-in-up">
            <div className="inline-block mb-3 px-4 py-1 bg-primary-gold/20 backdrop-blur-sm rounded-full border border-primary-gold/30">
              <span className="text-primary-gold text-sm font-semibold">✨ {city.state}</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3 drop-shadow-2xl">
              {getLocalizedContent(city.name, language)}
            </h1>
            <div className="w-24 h-1 bg-gradient-temple rounded-full"></div>
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
            <div className="card-modern rounded-2xl p-8 shadow-temple border-l-4 border-primary-gold relative overflow-hidden">
              {/* Decorative gradient background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-temple opacity-5 rounded-full -mr-16 -mt-16"></div>
              <p className="text-primary-dark/90 leading-relaxed whitespace-pre-line text-lg relative z-10">
                {getLocalizedContent(city.spiritualSignificance, language)}
              </p>
            </div>
          </section>
        )}

        {/* History */}
        {city.history && (
          <section className="mb-16 animate-fade-in-up">
            <SectionHeader title={t('history', language)} icon="📜" subtitle={t('historical.background', language)} />
            <div className="card-modern rounded-2xl p-8 shadow-temple border-l-4 border-primary-saffron relative overflow-hidden">
              {/* Decorative gradient background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-temple opacity-5 rounded-full -mr-16 -mt-16"></div>
              <div className="flex items-start gap-5 relative z-10">
                <div className="text-4xl flex-shrink-0">📜</div>
                <p className="text-primary-dark/90 leading-relaxed whitespace-pre-line text-lg flex-1">
                  {getLocalizedContent(city.history, language)}
                </p>
              </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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
                <div key={index} className="card-modern rounded-2xl p-8 shadow-temple border-l-4 border-primary-saffron relative overflow-hidden h-full flex flex-col">
                  {/* Decorative gradient background */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-temple opacity-5 rounded-full -mr-16 -mt-16"></div>
                  <div className="flex items-start gap-5 mb-5 relative z-10">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-temple flex items-center justify-center text-3xl shadow-temple">
                      🕯️
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-primary-dark mb-3 leading-tight">
                        {getLocalizedContent(ritual.name, language)}
                      </h3>
                      {ritual.timing && (
                        <div className="bg-primary-saffron/10 rounded-lg px-3 py-2 mb-4 inline-block">
                          <p className="text-sm text-primary-saffron font-bold flex items-center gap-2">
                            <span>⏰</span> {ritual.timing}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-primary-dark/90 leading-relaxed text-base relative z-10 flex-grow">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {city.festivals.map((festival, index) => (
                <div key={index} className="card-modern rounded-2xl p-6 shadow-temple border-l-4 border-primary-gold relative overflow-hidden h-full flex flex-col">
                  {/* Decorative gradient background */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-temple opacity-5 rounded-full -mr-12 -mt-12"></div>
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-temple flex items-center justify-center text-3xl shadow-temple mb-4 relative z-10">
                    🎉
                  </div>
                  <h3 className="text-xl font-bold text-primary-dark mb-4 leading-tight relative z-10">
                    {festival.name}
                  </h3>
                  <div className="bg-primary-gold/10 rounded-lg px-3 py-2 mb-4 relative z-10">
                    <p className="text-sm text-primary-gold font-bold flex items-center gap-2">
                      <span>📅</span> {festival.date}
                    </p>
                  </div>
                  <p className="text-primary-dark/90 text-sm leading-relaxed relative z-10 flex-grow">
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
            <div className="card-modern rounded-2xl p-8 shadow-temple border-l-4 border-primary-blue relative overflow-hidden">
              {/* Decorative gradient background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-temple opacity-5 rounded-full -mr-16 -mt-16"></div>
              <div className="flex items-start gap-5 mb-6 relative z-10">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-temple flex items-center justify-center text-3xl shadow-temple">
                  📿
                </div>
                <p className="text-primary-dark/90 leading-relaxed whitespace-pre-line text-lg flex-1">
                  {getLocalizedContent(city.darshanInfo, language)}
                </p>
              </div>
              {city.officialBookingUrl && (
                <div className="relative z-10">
                  <a
                    href={city.officialBookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-temple text-white rounded-xl font-semibold shadow-md"
                  >
                    {t('visit.official.website', language)}
                    <span className="text-xl">→</span>
                  </a>
                </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {city.hotels.map((hotel, index) => (
                <div
                  key={index}
                  className="card-modern rounded-2xl p-6 shadow-card border-l-4 border-primary-gold h-full flex flex-col relative overflow-hidden"
                >
                  {/* Decorative gradient background */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-temple opacity-5 rounded-full -mr-12 -mt-12"></div>
                  
                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <h3 className="text-lg sm:text-xl font-bold text-primary-dark flex-1 leading-tight">
                      {hotel.name}
                    </h3>
                    <span
                      className={`${getPriceRangeColor(
                        hotel.priceRange
                      )} text-white px-3 py-1.5 rounded-lg text-xs font-bold flex-shrink-0 ml-2 shadow-md`}
                    >
                      {getPriceRangeLabel(hotel.priceRange)}
                    </span>
                  </div>
                  
                  <div className="mb-4 relative z-10">
                    <p className="text-sm text-primary-dark/70 flex items-start gap-2 leading-relaxed">
                      <span className="flex-shrink-0 text-lg">📍</span>
                      <span>{hotel.address}</span>
                    </p>
                  </div>
                  
                  {hotel.rating && (
                    <div className="flex items-center gap-2 mb-4 relative z-10">
                      <div className="bg-primary-gold/10 rounded-lg px-3 py-1.5">
                        <span className="text-primary-gold font-bold text-base">
                          ⭐ {hotel.rating}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-auto space-y-2 relative z-10">
                    {hotel.contact && (
                      <p className="text-sm text-primary-dark/80 break-all flex items-center gap-2">
                        <span className="text-primary-gold">📞</span>
                        <span>{hotel.contact}</span>
                      </p>
                    )}
                    {hotel.website && (
                      <a
                        href={hotel.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary-gold font-semibold break-all flex items-center gap-1"
                      >
                        Visit Website <span>→</span>
                      </a>
                    )}
                  </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {city.restaurants.map((restaurant, index) => (
                <div
                  key={index}
                  className="card-modern rounded-2xl p-6 shadow-card border-l-4 border-primary-saffron h-full flex flex-col relative overflow-hidden"
                >
                  {/* Decorative gradient background */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-temple opacity-5 rounded-full -mr-12 -mt-12"></div>
                  
                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <h3 className="text-lg sm:text-xl font-bold text-primary-dark flex-1 leading-tight">
                      {restaurant.name}
                    </h3>
                    <span
                      className={`${getPriceRangeColor(
                        restaurant.priceRange
                      )} text-white px-3 py-1.5 rounded-lg text-xs font-bold flex-shrink-0 ml-2 shadow-md`}
                    >
                      {getPriceRangeLabel(restaurant.priceRange)}
                    </span>
                  </div>
                  
                  {restaurant.cuisine && (
                    <div className="mb-3 relative z-10">
                      <p className="text-sm text-primary-saffron font-bold bg-primary-saffron/10 rounded-lg px-3 py-1.5 inline-block">
                        {restaurant.cuisine}
                      </p>
                    </div>
                  )}
                  
                  <div className="mb-4 relative z-10">
                    <p className="text-sm text-primary-dark/70 flex items-start gap-2 leading-relaxed">
                      <span className="flex-shrink-0 text-lg">📍</span>
                      <span>{restaurant.address}</span>
                    </p>
                  </div>
                  
                  <div className="mt-auto space-y-2 relative z-10">
                    {restaurant.contact && (
                      <p className="text-sm text-primary-dark/80 break-all flex items-center gap-2">
                        <span className="text-primary-saffron">📞</span>
                        <span>{restaurant.contact}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Transport & Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {/* Transport Info */}
          <div className="card-modern rounded-2xl p-8 shadow-temple border-l-4 border-primary-gold relative overflow-hidden h-full">
            {/* Decorative gradient background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-temple opacity-5 rounded-full -mr-16 -mt-16"></div>
            <div className="flex items-center gap-5 mb-6 relative z-10">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-temple flex items-center justify-center text-3xl shadow-temple">
                🚗
              </div>
              <h3 className="text-2xl font-bold text-primary-dark">
                Transport Information
              </h3>
            </div>
            <p className="text-sm sm:text-base text-primary-dark/80 leading-relaxed relative z-10">
              {getLocalizedContent(city.transportInfo, language)}
            </p>
          </div>

          {/* Weather & Best Time */}
          {city.weatherInfo && (
            <div className="card-modern rounded-2xl p-8 shadow-temple border-l-4 border-primary-saffron relative overflow-hidden h-full">
              {/* Decorative gradient background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-temple opacity-5 rounded-full -mr-16 -mt-16"></div>
              <div className="flex items-center gap-5 mb-6 relative z-10">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-temple flex items-center justify-center text-3xl shadow-temple">
                  🌤️
                </div>
                <h3 className="text-2xl font-bold text-primary-dark">
                  Weather & Best Time to Visit
                </h3>
              </div>
              <div className="space-y-4 relative z-10">
                <div className="bg-primary-gold/10 rounded-lg p-4">
                  <p className="text-sm text-primary-dark/70 mb-2 font-medium">
                    {t('best.time', language)}
                  </p>
                  <p className="font-bold text-primary-dark text-base">
                    {city.weatherInfo.bestTimeToVisit}
                  </p>
                </div>
                <div className="bg-primary-saffron/10 rounded-lg p-4">
                  <p className="text-sm text-primary-dark/70 mb-2 font-medium">
                    {t('temperature', language)}
                  </p>
                  <p className="font-bold text-primary-dark text-sm sm:text-base">
                    {city.weatherInfo.averageTemp}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Emergency Contacts */}
        {city.emergencyContacts && city.emergencyContacts.length > 0 && (
          <section className="card-modern rounded-2xl p-8 shadow-temple border-l-4 border-primary-maroon relative overflow-hidden mb-12">
            {/* Decorative gradient background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-temple opacity-5 rounded-full -mr-16 -mt-16"></div>
            <div className="flex items-center gap-5 mb-6 relative z-10">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-temple flex items-center justify-center text-3xl shadow-temple">
                🆘
              </div>
              <h3 className="text-2xl font-bold text-primary-dark">
                Emergency Contacts
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
              {city.emergencyContacts.map((contact, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-primary-gold/10 to-primary-saffron/5 rounded-xl p-4 border border-primary-gold/20"
                >
                  <p className="font-bold text-primary-dark mb-2 text-sm sm:text-base">
                    {contact.name}
                  </p>
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-primary-gold font-semibold text-xs sm:text-sm break-all flex items-center gap-1"
                  >
                    <span>📞</span> {contact.phone}
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

