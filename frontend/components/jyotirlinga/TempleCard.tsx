'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getLocalizedContent } from '@/lib/i18n';
import type { LanguageCode } from '@/lib/constants';

interface TempleCardProps {
  temple: {
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
    description?: {
      en: string;
      hi: string;
      [key: string]: string;
    };
  };
  language: LanguageCode;
}

export default function TempleCard({ temple, language }: TempleCardProps) {
  return (
    <Link
      href={`/jyotirlinga/${temple.slug}`}
      className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all transform hover:-translate-y-2 block"
    >
      {/* Temple Image */}
      <div className="relative h-56 bg-gradient-to-br from-primary-blue/20 to-primary-orange/20">
        {temple.images && temple.images.length > 0 ? (
          <Image
            src={temple.images[0]}
            alt={getLocalizedContent(temple.name, language)}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-7xl">
            🏛️
          </div>
        )}
        {/* State Badge */}
        <div className="absolute top-3 right-3 bg-primary-teal text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
          {temple.stateCode}
        </div>
      </div>

      {/* Temple Info */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-primary-dark mb-2 group-hover:text-primary-orange transition-colors">
          {getLocalizedContent(temple.name, language)}
        </h3>
        <p className="text-sm text-primary-dark/60 mb-3 flex items-center gap-2">
          <span>📍</span>
          <span>{temple.city}, {temple.state}</span>
        </p>
        {temple.description && (
          <p className="text-sm text-primary-dark/70 line-clamp-3 mb-4">
            {getLocalizedContent(temple.description, language)}
          </p>
        )}
        <div className="flex gap-3">
          <span className="px-4 py-2 bg-primary-blue text-white rounded-lg text-sm font-medium hover:bg-primary-blue/90 transition-colors">
            Book Now
          </span>
          <span className="px-4 py-2 border border-primary-teal text-primary-teal rounded-lg text-sm font-medium hover:bg-primary-teal/10 transition-colors">
            Explore City
          </span>
        </div>
      </div>
    </Link>
  );
}

