'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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

interface SomnathPageProps {
  temple: Temple;
  language: string;
}

export default function SomnathPage({ temple, language }: SomnathPageProps) {
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
      {/* Custom Hero for Somnath */}
      <section className="relative h-[450px] bg-primary-blue">
        <div className="absolute inset-0 bg-primary-dark/20"></div>
        <div className="container mx-auto px-4 relative z-10 h-full flex items-center">
          <div className="max-w-2xl">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <span className="text-white font-semibold">The First Jyotirlinga</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              {getLocalizedContent(temple.name, language as any)}
            </h1>
            <p className="text-xl text-white/90">
              Where the Moon God Found Peace
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Why Somnath is First */}
            <section className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-primary-dark mb-4">
                The First Among Twelve
              </h2>
              <p className="text-primary-dark/80 leading-relaxed mb-4">
                Somnath Temple holds the distinction of being the first among the 12 Jyotirlingas. 
                It is believed to be the place where Lord Shiva appeared as a Jyotirlinga to protect 
                the moon god Chandra from a curse.
              </p>
              <p className="text-primary-dark/80 leading-relaxed">
                Located on the western coast of Gujarat, the temple overlooks the Arabian Sea, 
                creating a breathtaking spiritual setting. The temple has been destroyed and rebuilt 
                several times, with the current structure dating back to 1951.
              </p>
            </section>

            {/* Coastal Location */}
            <section className="bg-primary-gold rounded-xl p-6 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-4">By the Arabian Sea</h2>
              <p className="text-white/90 leading-relaxed">
                The temple&apos;s location by the Arabian Sea adds to its spiritual significance. 
                The sound of waves and the sea breeze create a serene atmosphere for devotees 
                seeking peace and blessings.
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

          {/* Sidebar - Same booking */}
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
          </div>
        </div>
      </div>
    </div>
  );
}

