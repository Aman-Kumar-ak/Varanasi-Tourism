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
      className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 block border border-primary-blue/5 hover:border-primary-blue/20"
    >
      {/* Mobile: Horizontal Layout, Desktop: Vertical Layout */}
      <div className="flex sm:flex-col">
        {/* Temple Image */}
        <div className="relative w-32 sm:w-full h-32 sm:h-56 bg-background-parchment flex-shrink-0">
          {temple.images && temple.images.length > 0 ? (
            <Image
              src={temple.images[0]}
              alt={getLocalizedContent(temple.name, language)}
              fill
              sizes="(max-width: 640px) 128px, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl sm:text-7xl">
              🏛️
            </div>
          )}
          {/* State Badge */}
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-primary-gold text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-semibold shadow-lg">
            {temple.stateCode}
          </div>
        </div>

        {/* Temple Info */}
        <div className="flex-1 p-3 sm:p-6 flex flex-col">
          <h3 className="text-lg sm:text-2xl font-bold text-primary-dark mb-1 sm:mb-2 group-hover:text-primary-orange transition-colors line-clamp-2">
            {getLocalizedContent(temple.name, language)}
          </h3>
          <p className="text-xs sm:text-sm text-primary-dark/60 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
            <span className="text-sm sm:text-base">📍</span>
            <span className="line-clamp-1">{temple.city}, {temple.state}</span>
          </p>
          {temple.description && (
            <p className="text-xs sm:text-sm text-primary-dark/70 line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-4 hidden sm:block">
              {getLocalizedContent(temple.description, language)}
            </p>
          )}
          <div className="flex gap-2 sm:gap-3 mt-auto">
            <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-primary-blue text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-primary-blue/90 transition-colors whitespace-nowrap">
              Book Now
            </span>
            <span className="px-3 py-1.5 sm:px-4 sm:py-2 border border-primary-gold text-primary-gold rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap">
              Explore
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

