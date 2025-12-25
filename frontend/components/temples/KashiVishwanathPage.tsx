'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getLocalizedContent } from '@/lib/i18n';
import { formatCurrency } from '@/lib/utils';

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

  useEffect(() => {
    fetchDarshanTypes();
  }, [temple._id]);

  const fetchDarshanTypes = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiUrl}/api/jyotirlingas/${temple.slug}/darshan-types`);
      const data = await response.json();

      if (data.success) {
        setDarshanTypes(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching darshan types:', error);
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

          {/* Sidebar - Same booking component */}
          <div className="space-y-6">
            <section className="bg-white rounded-xl p-6 shadow-md sticky top-24">
              <h2 className="text-2xl font-bold text-primary-dark mb-4">
                Book Your Darshan
              </h2>
              {darshanTypes.length === 0 ? (
                <p className="text-primary-dark/70">No darshan types available yet.</p>
              ) : (
                <div className="space-y-4">
                  {darshanTypes.map((type) => (
                    <div
                      key={type._id}
                      className="border border-primary-blue/20 rounded-lg p-4 hover:border-primary-orange transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-primary-dark">
                          {getLocalizedContent(type.name, language as any)}
                        </h3>
                        <span className="text-xl font-bold text-primary-orange">
                          {formatCurrency(type.price)}
                        </span>
                      </div>
                      <p className="text-sm text-primary-dark/60 mb-3">
                        Duration: {type.duration} minutes
                      </p>
                      <Link
                        href={`/booking?temple=${temple._id}&darshan=${type._id}`}
                        className="block w-full text-center px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors font-medium"
                      >
                        Book Now
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </section>

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

