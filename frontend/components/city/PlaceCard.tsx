'use client';

import Image from 'next/image';
import { getLocalizedContent } from '@/lib/i18n';
import type { LanguageCode } from '@/lib/constants';

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
  category?: 'temple' | 'ghat' | 'monument' | 'market' | 'museum' | 'other';
  spiritualImportance?: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  bestTimeToVisit?: string;
  visitDuration?: string;
}

interface PlaceCardProps {
  place: Place;
  language: LanguageCode;
}

const categoryIcons: Record<string, string> = {
  temple: '🛕',
  ghat: '🌊',
  monument: '🏛️',
  market: '🛒',
  museum: '🏛️',
  other: '📍',
};

export default function PlaceCard({ place, language }: PlaceCardProps) {
  const category = place.category || 'other';
  const icon = categoryIcons[category] || '📍';

  return (
    <div className="card-modern rounded-2xl overflow-hidden shadow-card border-l-4 border-primary-gold relative h-full flex flex-col">
      {/* Decorative gradient background */}
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-temple opacity-5 rounded-full -mr-16 -mb-16 z-0"></div>
      
      {place.image && (
        <div className="relative h-48 sm:h-56 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/60 via-transparent to-transparent z-10"></div>
          <Image
            src={place.image}
            alt={getLocalizedContent(place.name, language)}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="p-6 sm:p-8 flex-grow flex flex-col relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-temple flex items-center justify-center text-2xl shadow-temple">
            {icon}
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-primary-dark flex-1 leading-tight">
            {getLocalizedContent(place.name, language)}
          </h3>
        </div>
        {place.category && (
          <div className="mb-4">
            <span className="inline-block text-xs px-3 py-1.5 bg-primary-gold/10 text-primary-gold rounded-lg capitalize font-bold border border-primary-gold/20">
              {place.category}
            </span>
          </div>
        )}
        <p className="text-primary-dark/80 text-sm sm:text-base leading-relaxed mb-4 flex-grow">
          {getLocalizedContent(place.description, language)}
        </p>
        {place.spiritualImportance && (
          <div className="bg-gradient-to-br from-primary-gold/10 to-primary-saffron/5 border-l-4 border-primary-gold rounded-r-lg p-4 mb-4">
            <p className="text-primary-dark/90 text-sm sm:text-base leading-relaxed">
              {getLocalizedContent(place.spiritualImportance, language)}
            </p>
          </div>
        )}
        <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-primary-dark/70 mt-auto">
          {place.bestTimeToVisit && (
            <span className="flex items-center gap-2 bg-primary-gold/10 px-3 py-1.5 rounded-lg font-medium">
              <span>⏰</span>
              <span>{place.bestTimeToVisit}</span>
            </span>
          )}
          {place.visitDuration && (
            <span className="flex items-center gap-2 bg-primary-saffron/10 px-3 py-1.5 rounded-lg font-medium">
              <span>⏱️</span>
              <span>{place.visitDuration}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

