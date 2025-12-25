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

interface MahakaleshwarPageProps {
  temple: Temple;
  language: string;
}

export default function MahakaleshwarPage({ temple, language }: MahakaleshwarPageProps) {
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
      {/* Custom Hero for Mahakaleshwar */}
      <section className="relative h-[450px] bg-primary-orange">
        <div className="absolute inset-0 bg-primary-dark/30"></div>
        <div className="container mx-auto px-4 relative z-10 h-full flex items-center">
          <div className="max-w-2xl">
            <div className="inline-block bg-primary-orange/30 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
              <span className="text-white font-semibold">The South-Facing Jyotirlinga</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              {getLocalizedContent(temple.name, language as any)}
            </h1>
            <p className="text-xl text-white/90">
              Famous for Bhasma Aarti
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Bhasma Aarti Highlight */}
            <section className="bg-primary-orange rounded-xl p-6 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-4">🌟 Bhasma Aarti</h2>
              <p className="text-white/90 leading-relaxed">
                Mahakaleshwar is the only Jyotirlinga facing south. The unique Bhasma Aarti 
                performed here every morning with sacred ash is a powerful spiritual experience. 
                This ritual is believed to grant wishes and remove obstacles from one's life.
              </p>
            </section>

            {/* Why It's Special */}
            <section className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-primary-dark mb-4">
                Unique Significance
              </h2>
              <p className="text-primary-dark/80 leading-relaxed mb-4">
                Mahakaleshwar Temple in Ujjain is one of the most powerful Jyotirlingas. 
                The temple is located in the ancient city of Ujjain, which is also famous 
                for the Kumbh Mela.
              </p>
              <p className="text-primary-dark/80 leading-relaxed">
                The south-facing orientation of the Jyotirlinga is unique and holds special 
                spiritual significance. Devotees believe that visiting this temple brings 
                protection and removes negative energies.
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

            {/* Bhasma Aarti Info */}
            <section className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-primary-dark mb-4">Bhasma Aarti</h3>
              <p className="text-sm text-primary-dark/70 mb-2">
                <strong>Timing:</strong> Early Morning (4:00 AM - 6:00 AM)
              </p>
              <p className="text-sm text-primary-dark/70">
                Experience the unique Bhasma Aarti ceremony performed with sacred ash. 
                This is a special spiritual ritual unique to Mahakaleshwar.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

