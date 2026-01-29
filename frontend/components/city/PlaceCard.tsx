'use client';

import Image from 'next/image';
import { getLocalizedContent } from '@/lib/i18n';
import { openGoogleMapsDirections } from '@/lib/googleMaps';
import { t } from '@/lib/translations';
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
  /** When true, card fills container height (uniform grid); content flows, chips at bottom, no internal scroll. */
  fillHeight?: boolean;
  /** When true, do not render the place image (e.g. when used below a separate hero image on PC). */
  hideImage?: boolean;
  /** When true, do not render the place name (e.g. when name is shown on hero image on PC). */
  hideTitle?: boolean;
}

const categoryIcons: Record<string, string> = {
  temple: '🛕',
  ghat: '🌊',
  monument: '🏛️',
  market: '🛒',
  museum: '🏛️',
  other: '📍',
};

export default function PlaceCard({ place, language, fillHeight, hideImage, hideTitle }: PlaceCardProps) {
  const category = place.category || 'other';
  const icon = categoryIcons[category] || '📍';

  return (
    <article className={`group relative flex flex-col overflow-hidden border border-premium-teal/10 transition-all duration-300 ${hideImage ? 'rounded-b-2xl rounded-t-none border-t-0 bg-white/98 shadow-[0_4px_24px_rgba(0,0,0,0.06)]' : 'rounded-2xl premium-card'} ${fillHeight ? 'h-full min-h-0' : ''}`}>
      {!hideImage && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-premium-teal via-premium-teal-light to-premium-teal z-20" aria-hidden />}

      {place.image && !hideImage && (
        <div className={`relative w-full overflow-hidden flex-shrink-0 ${fillHeight ? 'h-44 sm:h-48' : 'h-48 sm:h-56 md:h-64'}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/70 via-primary-dark/20 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary-dark/10 z-10" />
          <Image
            src={place.image}
            alt={getLocalizedContent(place.name, language)}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}

      <div className="relative flex flex-col flex-1 min-h-0 p-6 sm:p-7 md:p-8 bg-gradient-to-b from-white to-premium-peach/30">
        {/* Icon + title row (hidden when name/logo/category shown on hero, e.g. PC view) */}
        {!hideTitle && (
          <div className="flex items-start gap-4 mb-4 flex-shrink-0">
            <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-premium-teal to-premium-teal-light flex items-center justify-center text-xl sm:text-2xl shadow-premium ring-2 ring-white/80">
              {icon}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary-dark tracking-tight break-words leading-tight">
                {getLocalizedContent(place.name, language)}
              </h3>
              {place.category && (
                <span className="inline-block mt-2 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-premium-teal/10 text-premium-teal border border-premium-teal/20">
                  {place.category}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Description + spiritual: flex-1 so chips stay at bottom when fillHeight; no scroll */}
        <div className={fillHeight ? 'flex-1 min-h-0 flex flex-col' : ''}>
          <p className="text-primary-dark/85 text-base sm:text-lg leading-relaxed mb-5">
            {getLocalizedContent(place.description, language)}
          </p>

          {place.spiritualImportance && (
            <div className="rounded-xl bg-premium-peach/60 border border-premium-teal/20 p-4 mb-5">
              <p className="text-primary-dark/90 text-sm sm:text-base leading-relaxed">
                {getLocalizedContent(place.spiritualImportance, language)}
              </p>
            </div>
          )}
        </div>

        {/* Info chips row – at bottom when fillHeight */}
        <div className="flex flex-wrap gap-3 mt-auto flex-shrink-0">
          {place.bestTimeToVisit && (
            <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200/60 text-sm font-medium shadow-sm">
              <svg className="w-4 h-4 flex-shrink-0 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {place.bestTimeToVisit}
            </span>
          )}
          {place.visitDuration && (
            <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-50 text-violet-900 border border-violet-200/60 text-sm font-medium shadow-sm">
              <svg className="w-4 h-4 flex-shrink-0 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {place.visitDuration}
            </span>
          )}
          {place.location && (
            <button
              type="button"
              onClick={() => openGoogleMapsDirections(place.location!, getLocalizedContent(place.name, language))}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 text-sky-800 border border-sky-200/60 text-sm font-medium shadow-sm hover:bg-sky-100 hover:border-sky-300/80 active:scale-[0.98] transition-all min-h-[44px] sm:min-h-0 touch-manipulation"
              aria-label={t('get.directions', language)}
              title={t('get.directions', language)}
            >
              <svg className="w-4 h-4 flex-shrink-0 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="hidden sm:inline">{t('directions', language)}</span>
              <span className="sm:hidden">{t('map', language)}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

