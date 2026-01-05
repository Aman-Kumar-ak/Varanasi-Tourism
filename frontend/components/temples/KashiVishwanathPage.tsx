'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getLocalizedContent } from '@/lib/i18n';
import { formatCurrency, getApiUrl } from '@/lib/utils';

interface DarshanType {
  _id: string;
  name: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  price: number;
  duration: number;
  dailyLimit: number;
  description?: {
    en: string;
    hi: string;
    [key: string]: string;
  };
}

interface Temple {
  _id: string;
  slug: string;
  name: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  city: string;
  state: string;
  images: string[];
  location: {
    lat: number;
    lng: number;
  };
  templeRules: string[];
  nearbyPlaces: string[];
}

interface KashiVishwanathPageProps {
  temple: Temple;
  language: string;
}

export default function KashiVishwanathPage({ temple, language }: KashiVishwanathPageProps) {
  const [darshanTypes, setDarshanTypes] = useState<DarshanType[]>([]);
  const [loadingDarshanTypes, setLoadingDarshanTypes] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (temple.slug) {
      fetchDarshanTypes();
    }
  }, [temple.slug]);

  const fetchDarshanTypes = async () => {
    try {
      setLoadingDarshanTypes(true);
      setError(null);
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/jyotirlingas/${temple.slug}/darshan-types`);
      const data = await response.json();

      if (data.success) {
        setDarshanTypes(data.data || []);
      } else {
        setError(data.error || 'Failed to load darshan types');
      }
    } catch (error) {
      console.error('Error fetching darshan types:', error);
      setError('Unable to load darshan types. Please try again later.');
    } finally {
      setLoadingDarshanTypes(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-parchment">
      {/* Custom Hero Section for Kashi Vishwanath */}
      <section className="relative h-[500px] bg-primary-blue">
        <div className="absolute inset-0 bg-primary-dark/30"></div>
        <div className="container mx-auto px-4 relative z-10 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              {getLocalizedContent(temple.name, language as any)}
            </h1>
            <p className="text-2xl text-white/90 mb-6">
              The Spiritual Capital of India
            </p>
            <p className="text-lg text-white/80">
              Varanasi, Uttar Pradesh
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Booking Section - Prominent Display */}
        <section className="bg-white rounded-xl p-6 shadow-lg mb-8 border border-primary-blue/10">
          <div className="bg-primary-blue text-white rounded-lg px-6 py-4 mb-6 -mx-6 -mt-6">
            <h2 className="text-2xl font-bold text-center">
              List of Pooja / Darshan
            </h2>
          </div>
          
          {loadingDarshanTypes ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary-blue mb-3"></div>
              <p className="text-primary-dark/60">Loading darshan types...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchDarshanTypes}
                className="px-6 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors font-medium"
              >
                Retry
              </button>
            </div>
          ) : darshanTypes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📿</div>
              <p className="text-primary-dark/70 mb-2 text-lg">No darshan types available yet.</p>
              <p className="text-sm text-primary-dark/50">Please check back later or contact the temple office.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {darshanTypes.map((type) => (
                <Link
                  key={type._id}
                  href={`/booking?temple=${temple.slug || temple._id}&darshan=${type._id}`}
                  className="block group"
                >
                  <div className="bg-primary-orange hover:bg-primary-orange/90 text-white rounded-lg p-6 transition-all duration-200 shadow-md hover:shadow-xl transform hover:scale-[1.02] cursor-pointer h-full">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mt-1">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-bold text-xl mb-2">
                          {getLocalizedContent(type.name, language as any)}
                        </h3>
                        {type.description && (
                          <p className="text-white/90 text-sm mb-4 leading-relaxed">
                            {getLocalizedContent(type.description, language as any)}
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-4 border-t border-white/20">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <span>⏱️</span>
                              <span>{type.duration} min</span>
                            </span>
                            {type.dailyLimit && (
                              <span className="flex items-center gap-1">
                                <span>👥</span>
                                <span>{type.dailyLimit.toLocaleString()}/day</span>
                              </span>
                            )}
                          </div>
                          <span className="text-2xl font-bold bg-white/20 px-4 py-2 rounded-lg">
                            {formatCurrency(type.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Custom for Kashi */}
          <div className="lg:col-span-2 space-y-8">
            {/* Why Kashi is Special */}
            <section className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-primary-dark mb-4">
                Why Kashi Vishwanath is Special
              </h2>
              <p className="text-primary-dark/80 leading-relaxed mb-4">
                Kashi Vishwanath Temple is considered the holiest of all Shiva temples. 
                It is believed that dying in Varanasi grants moksha (liberation). 
                The temple is a symbol of spiritual liberation and has been a center of 
                devotion for thousands of years.
              </p>
              <p className="text-primary-dark/80 leading-relaxed">
                The temple is located on the western bank of the Ganges River and is one 
                of the most visited pilgrimage sites in India. The Ganga Aarti performed 
                here every evening is a spectacular spiritual experience.
              </p>
            </section>

            {/* Historical Significance */}
            <section className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-primary-dark mb-4">
                Historical Significance
              </h2>
              <p className="text-primary-dark/80 leading-relaxed">
                The temple has been destroyed and rebuilt several times throughout history. 
                The current structure was built by Ahilyabai Holkar in 1780. Varanasi is 
                considered one of the oldest continuously inhabited cities in the world, 
                with a history spanning over 3,000 years.
              </p>
            </section>

            {/* Ganga Aarti Info */}
            <section className="bg-primary-teal rounded-xl p-6 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Ganga Aarti Experience</h2>
              <p className="text-white/90 leading-relaxed">
                Don't miss the spectacular Ganga Aarti ceremony performed every evening at 
                Dashashwamedh Ghat. This spiritual ceremony is a must-see experience that 
                combines fire, water, and devotion in a mesmerizing display.
              </p>
            </section>

            {/* Temple Rules */}
            {temple.templeRules && temple.templeRules.length > 0 && (
              <section className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-bold text-primary-dark mb-4">
                  Temple Guidelines
                </h2>
                <ul className="space-y-2">
                  {temple.templeRules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2 text-primary-dark/80">
                      <span className="text-primary-orange mt-1">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <section className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-primary-dark mb-4">Quick Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-primary-blue">📍</span>
                  <span className="text-primary-dark/70">Varanasi, Uttar Pradesh</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary-blue">⏰</span>
                  <span className="text-primary-dark/70">Open: 3:00 AM - 11:00 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary-blue">🌊</span>
                  <span className="text-primary-dark/70">Ganga Aarti: 6:30 PM</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

