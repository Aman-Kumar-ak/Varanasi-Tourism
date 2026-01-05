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
    <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 border border-primary-blue/5">
      {place.image && (
        <div className="relative h-48 sm:h-56 w-full">
          <Image
            src={place.image}
            alt={getLocalizedContent(place.name, language)}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4 sm:p-6">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-xl">{icon}</span>
          <h3 className="text-lg sm:text-xl font-bold text-primary-dark flex-1">
            {getLocalizedContent(place.name, language)}
          </h3>
        </div>
        {place.category && (
          <span className="inline-block text-xs px-2 py-1 bg-primary-blue/10 text-primary-blue rounded-full mb-2 capitalize">
            {place.category}
          </span>
        )}
        <p className="text-primary-dark/70 text-xs sm:text-sm leading-relaxed line-clamp-3 sm:line-clamp-none mb-3">
          {getLocalizedContent(place.description, language)}
        </p>
        {place.spiritualImportance && (
          <p className="text-primary-teal text-xs sm:text-sm italic mb-3 line-clamp-2">
            {getLocalizedContent(place.spiritualImportance, language)}
          </p>
        )}
        <div className="flex flex-wrap gap-3 text-xs text-primary-dark/60">
          {place.bestTimeToVisit && (
            <span className="flex items-center gap-1">
              <span>⏰</span>
              <span>{place.bestTimeToVisit}</span>
            </span>
          )}
          {place.visitDuration && (
            <span className="flex items-center gap-1">
              <span>⏱️</span>
              <span>{place.visitDuration}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

