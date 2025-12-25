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
  stateCode: string;
  images: string[];
  location: {
    lat: number;
    lng: number;
  };
  templeRules: string[];
  nearbyPlaces: string[];
}

interface DefaultTemplePageProps {
  temple: Temple;
  language: string;
}

export default function DefaultTemplePage({ temple, language }: DefaultTemplePageProps) {
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
      {/* Hero Section */}
      <section className="relative h-96 bg-primary-blue">
        {temple.images && temple.images.length > 0 ? (
          <Image
            src={temple.images[0]}
            alt={getLocalizedContent(temple.name, language as any)}
            fill
            className="object-cover opacity-80"
          />
        ) : null}
        <div className="absolute inset-0 bg-primary-dark/40"></div>
        <div className="container mx-auto px-4 relative z-10 h-full flex items-end pb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {getLocalizedContent(temple.name, language as any)}
            </h1>
            <p className="text-xl text-white/90">
              {temple.city}, {temple.state}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Temple Info */}
            <section className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-primary-dark mb-4">
                About the Temple
              </h2>
              <p className="text-primary-dark/80 leading-relaxed">
                This is one of the 12 sacred Jyotirlingas. Each temple has its unique significance and history.
                Customize this page by creating a specific component for this temple.
              </p>
            </section>

            {/* Temple Rules */}
            {temple.templeRules && temple.templeRules.length > 0 && (
              <section className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-bold text-primary-dark mb-4">
                  Temple Rules & Guidelines
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

            {/* Nearby Places */}
            {temple.nearbyPlaces && temple.nearbyPlaces.length > 0 && (
              <section className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-bold text-primary-dark mb-4">
                  Nearby Places
                </h2>
                <ul className="space-y-2">
                  {temple.nearbyPlaces.map((place, index) => (
                    <li key={index} className="flex items-start gap-2 text-primary-dark/80">
                      <span className="text-primary-blue mt-1">📍</span>
                      <span>{place}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Darshan Types */}
            <section className="bg-white rounded-xl p-6 shadow-md sticky top-24">
              <h2 className="text-2xl font-bold text-primary-dark mb-4">
                Darshan Types & Pricing
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
                  <span className="text-primary-dark/70">{temple.city}, {temple.state}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary-blue">🏛️</span>
                  <span className="text-primary-dark/70">Jyotirlinga Temple</span>
                </div>
              </div>
            </section>

            {/* Explore City */}
            <Link
              href={`/city/${temple.city.toLowerCase()}`}
              className="block bg-primary-teal text-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all text-center"
            >
              <span className="text-2xl block mb-2">🗺️</span>
              <span className="font-semibold">Explore {temple.city}</span>
              <p className="text-sm text-white/90 mt-1">
                Hotels, Restaurants & Places
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

