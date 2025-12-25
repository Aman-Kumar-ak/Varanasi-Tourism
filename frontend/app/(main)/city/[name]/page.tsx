'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedContent } from '@/lib/i18n';
import { getApiUrl } from '@/lib/utils';

interface Place {
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
  image?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

interface Hotel {
  name: string;
  address: string;
  priceRange: 'budget' | 'mid-range' | 'luxury';
  rating?: number;
  contact?: string;
  website?: string;
}

interface Restaurant {
  name: string;
  cuisine: string;
  address: string;
  priceRange: 'budget' | 'mid-range' | 'luxury';
  contact?: string;
}

interface City {
  _id: string;
  name: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  state: string;
  images: string[];
  places: Place[];
  hotels: Hotel[];
  restaurants: Restaurant[];
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
}

export default function CityPage() {
  const params = useParams();
  const { language } = useLanguage();
  const [city, setCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.name) {
      fetchCityData();
    }
  }, [params.name, language]);

  const fetchCityData = async () => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/cities/${params.name}`);
      const data = await response.json();

      if (data.success) {
        setCity(data.data);
      }
    } catch (error) {
      console.error('Error fetching city data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-parchment flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
          <p className="mt-4 text-primary-dark/70">Loading city information...</p>
        </div>
      </div>
    );
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

  const getPriceRangeLabel = (range: string) => {
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
  };

  const getPriceRangeColor = (range: string) => {
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
  };

  return (
    <div className="min-h-screen bg-background-parchment">
      {/* Hero Section */}
      <section className="relative h-64 sm:h-80 md:h-96 bg-primary-blue">
        {city.images && city.images.length > 0 ? (
          <Image
            src={city.images[0]}
            alt={getLocalizedContent(city.name, language)}
            fill
            className="object-cover opacity-60"
          />
        ) : null}
        <div className="absolute inset-0 bg-primary-dark/40"></div>
        <div className="container mx-auto px-4 relative z-10 h-full flex items-end pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {getLocalizedContent(city.name, language)}
            </h1>
            <p className="text-xl text-white/90">
              {city.state}
            </p>
            {city.jyotirlingaId && (
              <Link
                href={`/jyotirlinga/${city.jyotirlingaId.slug}`}
                className="mt-4 inline-block px-4 py-2 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 transition-colors font-medium"
              >
                Visit {getLocalizedContent(city.jyotirlingaId.name, language)}
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Places to Visit Section */}
        {city.places && city.places.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-dark mb-6">
              Places to Visit
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {city.places.map((place, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 border border-primary-blue/5"
                >
                  {place.image && (
                    <div className="relative h-48 sm:h-56 w-full">
                      <Image
                        src={place.image}
                        alt={getLocalizedContent(place.name, language)}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-primary-dark mb-2">
                      {getLocalizedContent(place.name, language)}
                    </h3>
                    <p className="text-primary-dark/70 text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-none">
                      {getLocalizedContent(place.description, language)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Hotels Section */}
        {city.hotels && city.hotels.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-dark mb-6">
              Hotels
            </h2>
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
                      className={`${getPriceRangeColor(hotel.priceRange)} text-white px-2 py-1 rounded text-xs font-semibold flex-shrink-0`}
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

        {/* Restaurants Section */}
        {city.restaurants && city.restaurants.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-dark mb-6">
              Restaurants
            </h2>
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
                      className={`${getPriceRangeColor(restaurant.priceRange)} text-white px-2 py-1 rounded text-xs font-semibold flex-shrink-0`}
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
                  <p className="text-xs sm:text-sm text-primary-dark/60 mb-1">Best Time</p>
                  <p className="font-semibold text-primary-dark text-sm sm:text-base">
                    {city.weatherInfo.bestTimeToVisit}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-primary-dark/60 mb-1">Temperature</p>
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

