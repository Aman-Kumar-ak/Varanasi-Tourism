'use client';

import Image from 'next/image';
import Link from 'next/link';
import { getLocalizedContent } from '@/lib/i18n';
import { getOptimizedVideoUrl, getVideoThumbnail } from '@/lib/cloudinary';
import { t } from '@/lib/translations';
import type { LanguageCode } from '@/lib/constants';
import SectionHeader from './SectionHeader';
import PlacesCarousel from './PlacesCarousel';
import TransportationGuide from './TransportationGuide';
import RoutePlanner from './RoutePlanner';
import EventsCalendar from './EventsCalendar';
import KashiRopeway from './KashiRopeway';
import CricketStadium from './CricketStadium';
import WellnessRetreats from './WellnessRetreats';
import AcademicTourism from './AcademicTourism';

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
  // New features
  events?: Array<{
    name: string;
    date: string;
    endDate?: string;
    type: 'festival' | 'cultural' | 'sports' | 'academic' | 'exhibition' | 'performance';
    description: {
      en: string;
      hi: string;
      [key: string]: string;
    };
    venue?: string;
    website?: string;
    contact?: string;
  }>;
  kashiRopeway?: {
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
    route: {
      en: string;
      hi: string;
      [key: string]: string;
    };
    stations: Array<{
      name: string;
      description?: {
        en: string;
        hi: string;
        [key: string]: string;
      };
    }>;
    openingDate?: string;
    capacity?: string;
    ticketPrice?: {
      min: number;
      max: number;
      currency: string;
    };
    features?: {
      en: string;
      hi: string;
      [key: string]: string;
    };
    location?: {
      lat: number;
      lng: number;
    };
  };
  cricketStadium?: {
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
    capacity: string;
    openingDate?: string;
    features?: {
      en: string;
      hi: string;
      [key: string]: string;
    };
    location?: {
      lat: number;
      lng: number;
    };
    tourInfo?: {
      en: string;
      hi: string;
      [key: string]: string;
    };
    contact?: string;
  };
  wellnessCenters?: Array<{
    name: string;
    type: 'yoga' | 'meditation' | 'ayurveda' | 'spa' | 'retreat';
    description: {
      en: string;
      hi: string;
      [key: string]: string;
    };
    address: string;
    contact?: string;
    website?: string;
    priceRange?: 'budget' | 'mid-range' | 'luxury';
    rating?: number;
  }>;
  academicInstitutions?: Array<{
    name: string;
    type: 'university' | 'college' | 'institute' | 'research';
    description: {
      en: string;
      hi: string;
      [key: string]: string;
    };
    address: string;
    contact?: string;
    website?: string;
    campusTour?: boolean;
    notableFeatures?: {
      en: string;
      hi: string;
      [key: string]: string;
    };
  }>;
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
      <section className="relative h-[50vh] min-h-[280px] sm:h-[55vh] sm:min-h-[320px] md:h-96 lg:h-[500px] overflow-hidden">
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
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-temple"></div>
        )}
        {/* Enhanced overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-overlay"></div>
        {/* Decorative golden border at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-temple"></div>
        {/* Text Content */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10 h-full flex items-end pb-8 sm:pb-12">
          <div className="animate-fade-in-up w-full">
            <div className="inline-block mb-2 sm:mb-3 px-3 sm:px-4 py-1.5 sm:py-1 bg-primary-gold/20 backdrop-blur-sm rounded-full border border-primary-gold/30">
              <span className="text-primary-gold text-xs sm:text-sm font-semibold">✨ {city.state}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-2 sm:mb-3 drop-shadow-2xl break-words" style={{ lineHeight: '1.5' }}>
              {getLocalizedContent(city.name, language)}
            </h1>
            <div className="w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-gradient-temple rounded-full"></div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Spiritual Significance */}
        {city.spiritualSignificance && (
          <section className="mb-12">
            <SectionHeader
              title={t('spiritual.significance', language)}
              icon="🕉️"
              subtitle={t('why.city.sacred', language)}
            />
            <div className="card-modern rounded-2xl p-5 sm:p-6 md:p-8 shadow-temple border-l-4 border-primary-gold relative overflow-hidden">
              {/* Decorative gradient background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-temple opacity-5 rounded-full -mr-16 -mt-16"></div>
              <p className="text-primary-dark/90 leading-relaxed whitespace-pre-line text-base sm:text-lg relative z-10">
                {getLocalizedContent(city.spiritualSignificance, language)}
              </p>
            </div>
          </section>
        )}

        {/* History */}
        {city.history && (
          <section className="mb-16 animate-fade-in-up">
            <SectionHeader title={t('history', language)} icon="📜" subtitle={t('historical.background', language)} />
            <div className="card-modern rounded-2xl p-5 sm:p-6 md:p-8 shadow-temple border-l-4 border-primary-saffron relative overflow-hidden">
              {/* Decorative gradient background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-temple opacity-5 rounded-full -mr-16 -mt-16"></div>
              <div className="flex items-start gap-4 sm:gap-5 relative z-10">
                <p className="text-primary-dark/90 leading-relaxed whitespace-pre-line text-base sm:text-lg flex-1">
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
            <PlacesCarousel places={city.places} language={language} />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              {city.rituals.map((ritual, index) => (
                <div key={index} className="card-modern rounded-2xl p-5 sm:p-6 md:p-8 shadow-temple border-l-4 border-primary-saffron relative overflow-hidden h-full flex flex-col">
                  {/* Decorative gradient background */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-temple opacity-5 rounded-full -mr-16 -mt-16"></div>
                  <div className="flex items-start gap-3 sm:gap-4 md:gap-5 mb-4 sm:mb-5 relative z-10">
                    <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-temple flex items-center justify-center text-2xl sm:text-3xl shadow-temple">
                      🕯️
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary-dark mb-2 sm:mb-3" style={{ lineHeight: '1.5' }}>
                        {getLocalizedContent(ritual.name, language)}
                      </h3>
                      {ritual.timing && (
                        <div className="bg-primary-saffron/10 rounded-lg px-3 py-2 sm:py-2.5 mb-3 sm:mb-4 inline-block">
                          <p className="text-xs sm:text-sm text-primary-saffron font-bold flex items-center gap-2">
                            <span>⏰</span> {ritual.timing}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-primary-dark/90 leading-relaxed text-base sm:text-lg relative z-10 flex-grow">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {city.festivals.map((festival, index) => (
                <div key={index} className="card-modern rounded-2xl p-5 sm:p-6 shadow-temple border-l-4 border-primary-gold relative overflow-hidden h-full flex flex-col">
                  {/* Decorative gradient background */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-temple opacity-5 rounded-full -mr-12 -mt-12"></div>
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-temple flex items-center justify-center text-2xl sm:text-3xl shadow-temple mb-3 sm:mb-4 relative z-10">
                    🎉
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-primary-dark mb-3 sm:mb-4 relative z-10" style={{ lineHeight: '1.5' }}>
                    {festival.name}
                  </h3>
                  <div className="bg-primary-gold/10 rounded-lg px-3 py-2 sm:py-2.5 mb-3 sm:mb-4 relative z-10">
                    <p className="text-xs sm:text-sm text-primary-gold font-bold flex items-center gap-2">
                      <span>📅</span> {festival.date}
                    </p>
                  </div>
                  <p className="text-primary-dark/90 text-sm sm:text-base leading-relaxed relative z-10 flex-grow">
                    {getLocalizedContent(festival.description, language)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Events Calendar - Enhanced */}
        {city.events && city.events.length > 0 && (
          <EventsCalendar events={city.events} language={language} />
        )}

        {/* Kashi Ropeway */}
        {city.kashiRopeway && (
          <KashiRopeway ropeway={city.kashiRopeway} language={language} />
        )}

        {/* Cricket Stadium */}
        {city.cricketStadium && (
          <CricketStadium stadium={city.cricketStadium} language={language} />
        )}

        {/* Wellness & Spiritual Retreats */}
        {city.wellnessCenters && city.wellnessCenters.length > 0 && (
          <WellnessRetreats centers={city.wellnessCenters} language={language} />
        )}

        {/* Academic Tourism */}
        {city.academicInstitutions && city.academicInstitutions.length > 0 && (
          <AcademicTourism institutions={city.academicInstitutions} language={language} />
        )}

        {/* Darshan Information */}
        {city.darshanInfo && (
          <section className="mb-12">
            <SectionHeader
              title={t('darshan.information', language)}
              icon="📿"
              subtitle={t('how.to.book.darshan', language)}
            />
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-primary-gold/20 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-gold/10 to-primary-orange/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-primary-blue/5 to-primary-teal/5 rounded-full -ml-24 -mb-24 blur-2xl"></div>
              
              {/* Content */}
              <div className="relative z-10 p-6 sm:p-8 md:p-10">
                {/* Icon and Title */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary-gold to-primary-orange flex items-center justify-center shadow-lg">
                    <span className="text-2xl sm:text-3xl">🕉️</span>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-primary-dark mb-1">
                      {t('darshan.information', language)}
                    </h3>
                    <p className="text-sm sm:text-base text-primary-dark/70">
                      {t('how.to.book.darshan', language)}
                    </p>
                  </div>
                </div>

                {/* Information Text */}
                <div className="mb-8">
                  <p className="text-base sm:text-lg text-primary-dark/90 leading-relaxed whitespace-pre-line">
                    {getLocalizedContent(city.darshanInfo, language)}
                  </p>
                </div>

                {/* Call to Action Button */}
                {city.officialBookingUrl && (
                  <div className="flex flex-col gap-3">
                    <a
                      href={city.officialBookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative inline-flex items-center justify-center px-3 sm:px-6 md:px-8 py-2.5 sm:py-3.5 md:py-4 bg-primary-gold text-white rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm md:text-base lg:text-lg shadow-xl hover:shadow-2xl hover:bg-primary-orange transform hover:-translate-y-1 transition-all duration-300 min-h-[44px] sm:min-h-[48px] md:min-h-[52px] touch-manipulation whitespace-nowrap max-w-full overflow-hidden"
                    >
                      {t('visit.official.website', language).replace(' →', '')}
                    </a>
                    
                    {/* Official website indicator - Right aligned */}
                    <div className="flex items-center justify-end gap-2 text-sm sm:text-base text-primary-dark/80">
                      <span className="font-medium">
                        {language === 'hi' ? 'आधिकारिक वेबसाइट' : 
                         language === 'en' ? 'Official website' : 'Official website'}
                      </span>
                      <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6">
              {city.hotels.map((hotel, index) => (
                <div
                  key={index}
                  className="card-modern rounded-xl sm:rounded-2xl p-3.5 sm:p-5 md:p-6 shadow-none sm:shadow-card border-l-4 border-primary-gold h-full flex flex-col relative overflow-hidden"
                >
                  {/* Decorative gradient background */}
                  <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-temple opacity-5 rounded-full -mr-10 -mt-10 sm:-mr-12 sm:-mt-12"></div>
                  
                  {/* Header: Name only */}
                  <div className="mb-2 sm:mb-2.5 relative z-10">
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-primary-dark" style={{ lineHeight: '1.4' }}>
                      {hotel.name}
                    </h3>
                  </div>
                  
                  {/* Address - Compact with reduced gap */}
                  <div className="mb-1 sm:mb-1.5 relative z-10">
                    <p className="text-xs sm:text-sm md:text-base text-primary-dark/70 flex items-start gap-1.5 sm:gap-2 leading-relaxed">
                      <span className="flex-shrink-0 text-sm sm:text-base md:text-lg">📍</span>
                      <span className="break-words">{hotel.address}</span>
                    </p>
                  </div>
                  
                  {/* Rating and Contact - Compact symmetric layout */}
                  <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3 relative z-10 flex-wrap">
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
                  
                  {/* Website link - Bottom aligned */}
                  {hotel.website && (
                    <div className="mt-auto relative z-10">
                      <a
                        href={hotel.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm text-primary-gold font-semibold break-all flex items-center justify-center gap-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-md sm:rounded-lg hover:bg-primary-gold/5 transition-colors touch-manipulation min-h-[36px] sm:min-h-[44px] border border-primary-gold/20"
                      >
                        Visit Website <span>→</span>
                      </a>
                    </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6">
              {city.restaurants.map((restaurant, index) => (
                <div
                  key={index}
                  className="card-modern rounded-xl sm:rounded-2xl p-3.5 sm:p-5 md:p-6 shadow-none sm:shadow-card border-l-4 border-primary-saffron h-full flex flex-col relative overflow-hidden"
                >
                  {/* Decorative gradient background */}
                  <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-temple opacity-5 rounded-full -mr-10 -mt-10 sm:-mr-12 sm:-mt-12"></div>
                  
                  {/* Header: Name only */}
                  <div className="mb-2 sm:mb-2.5 relative z-10">
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-primary-dark" style={{ lineHeight: '1.4' }}>
                      {restaurant.name}
                    </h3>
                  </div>
                  
                  {/* Cuisine - Compact badge */}
                  {restaurant.cuisine && (
                    <div className="mb-2 sm:mb-2.5 relative z-10">
                      <p className="text-xs sm:text-sm text-primary-saffron font-bold bg-primary-saffron/10 rounded-md sm:rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 inline-block">
                        {restaurant.cuisine}
                      </p>
                    </div>
                  )}
                  
                  {/* Address - Compact with reduced gap */}
                  <div className="mb-1 sm:mb-1.5 relative z-10">
                    <p className="text-xs sm:text-sm md:text-base text-primary-dark/70 flex items-start gap-1.5 sm:gap-2 leading-relaxed">
                      <span className="flex-shrink-0 text-sm sm:text-base md:text-lg">📍</span>
                      <span className="break-words">{restaurant.address}</span>
                    </p>
                  </div>
                  
                  {/* Contact - Reduced gap from address */}
                  {restaurant.contact && (
                    <div className="relative z-10">
                      <p className="text-xs sm:text-sm text-primary-dark/80 break-all flex items-center gap-1.5 sm:gap-2">
                        <span className="text-primary-saffron text-sm sm:text-base">📞</span>
                        <span className="truncate sm:break-all">{restaurant.contact}</span>
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Transport & Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 mb-10 sm:mb-12">
          {/* Transport Info */}
          <div className="card-modern rounded-2xl p-5 sm:p-6 md:p-8 shadow-temple border-l-4 border-primary-gold relative overflow-hidden h-full">
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
            <div className="card-modern rounded-2xl p-5 sm:p-6 md:p-8 shadow-temple border-l-4 border-primary-saffron relative overflow-hidden h-full">
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
          <section className="card-modern rounded-2xl p-5 sm:p-6 md:p-8 shadow-temple border-l-4 border-primary-maroon relative overflow-hidden mb-10 sm:mb-12">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 relative z-10">
              {city.emergencyContacts.map((contact, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-primary-gold/10 to-primary-saffron/5 rounded-xl p-4 sm:p-5 border border-primary-gold/20"
                >
                  <p className="font-bold text-primary-dark mb-2 sm:mb-3 text-sm sm:text-base">
                    {contact.name}
                  </p>
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-primary-gold font-semibold text-sm sm:text-base break-all flex items-center gap-2 py-2 px-2 -mx-2 rounded-lg hover:bg-primary-gold/10 transition-colors touch-manipulation min-h-[44px]"
                  >
                    <span className="text-lg">📞</span> {contact.phone}
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

