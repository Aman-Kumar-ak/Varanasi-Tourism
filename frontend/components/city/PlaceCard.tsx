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
  /** When true, use shorter image, less padding, and truncated description for a more compact card. */
  compact?: boolean;
  /** When true, on mobile show minimal layout (image + name only) for 2-col grid; on sm+ show compact. */
  minimal?: boolean;
}

const categoryIcons: Record<string, string> = {
  temple: '🛕',
  ghat: '🌊',
  monument: '🏛️',
  market: '🛒',
  museum: '🏛️',
  other: '📍',
};

export default function PlaceCard({ place, language, fillHeight, hideImage, hideTitle, compact, minimal }: PlaceCardProps) {
  const category = place.category || 'other';
  const icon = categoryIcons[category] || '📍';

  const imageHeight = compact ? 'h-40 sm:h-48 md:h-52' : fillHeight ? 'h-44 sm:h-48' : 'h-48 sm:h-56 md:h-64';
  const contentPadding = compact ? 'p-4 sm:p-5' : 'p-5 sm:p-6 md:p-8';
  const titleSize = compact ? 'text-lg sm:text-xl' : 'text-lg sm:text-xl md:text-2xl';
  const iconSize = compact ? 'w-10 h-10 sm:w-11 sm:h-11 text-lg sm:text-xl' : 'w-12 h-12 sm:w-14 sm:h-14 text-xl sm:text-2xl';

  const minimalMobileLayout = minimal && (
    <article className="sm:hidden group relative flex flex-col overflow-hidden rounded-xl border border-primary-saffron/10 bg-white shadow-md transition-all duration-300 active:scale-[0.98]">
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-saffron via-amber-400 to-primary-saffron z-10" aria-hidden />
      {place.image && (
        <div className="relative w-full aspect-[3/2] overflow-hidden flex-shrink-0">
          <Image
            src={place.image}
            alt={getLocalizedContent(place.name, language)}
            fill
            sizes="50vw"
            className="object-cover transition-transform duration-300 group-active:scale-[1.02]"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}
      <div className="flex flex-col flex-shrink-0 p-3 sm:p-4 bg-gradient-to-b from-white to-premium-peach/20 text-center">
        <h3 className="font-bold text-primary-dark text-sm sm:text-base leading-snug line-clamp-2 break-words">
          {getLocalizedContent(place.name, language)}
        </h3>
      </div>
    </article>
  );

  const mainLayout = (
    <article className={`group relative flex flex-col overflow-hidden border border-primary-saffron/10 transition-all duration-300 ${minimal ? 'hidden sm:flex' : ''} ${hideImage ? 'rounded-b-2xl rounded-t-none border-t-0 bg-white/98 shadow-[0_4px_24px_rgba(0,0,0,0.06)]' : 'rounded-2xl premium-card'} ${fillHeight ? 'h-full min-h-0' : ''}`}>
      {!hideImage && <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-saffron via-amber-400 to-primary-saffron z-20" aria-hidden />}

      {place.image && !hideImage && (
        <div className={`relative w-full overflow-hidden flex-shrink-0 ${imageHeight}`}>
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

      <div className={`relative flex flex-col flex-1 min-h-0 ${contentPadding} bg-gradient-to-b from-white to-premium-peach/30`}>
        {/* Icon + title row (hidden when name/logo/category shown on hero, e.g. PC view) */}
        {!hideTitle && (
          <div className={`flex items-start gap-3 ${compact ? 'mb-2' : 'mb-4'} flex-shrink-0`}>
            <div className={`flex-shrink-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary-saffron to-amber-400 flex items-center justify-center shadow-premium ring-2 ring-white/80 ${iconSize}`}>
              {icon}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <h3 className={`font-bold text-primary-dark tracking-tight break-words leading-tight ${titleSize}`}>
                {getLocalizedContent(place.name, language)}
              </h3>
              {place.category && (
                <span className={`inline-block font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary-saffron/10 text-primary-saffron border border-primary-saffron/20 ${compact ? 'text-xs sm:text-sm mt-1' : 'text-xs mt-2'}`}>
                  {place.category}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Description + spiritual: flex-1 so chips stay at bottom when fillHeight; no scroll */}
        <div className={fillHeight ? 'flex-1 min-h-0 flex flex-col' : ''}>
          <p className={`text-primary-dark/85 leading-relaxed ${compact ? 'text-base sm:text-base mb-2 line-clamp-3' : 'text-base sm:text-lg mb-5'}`}>
            {getLocalizedContent(place.description, language)}
          </p>

          {place.spiritualImportance && !compact && (
            <div className="rounded-xl bg-premium-peach/60 border border-primary-saffron/20 p-4 mb-5">
              <p className="text-primary-dark/90 text-sm sm:text-base leading-relaxed">
                {getLocalizedContent(place.spiritualImportance, language)}
              </p>
            </div>
          )}
          {place.spiritualImportance && compact && (
            <p className="text-primary-dark/80 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-2">
              {getLocalizedContent(place.spiritualImportance, language)}
            </p>
          )}
        </div>

        {/* Info chips row – at bottom when fillHeight */}
        <div className={`flex flex-wrap gap-2 mt-auto flex-shrink-0 ${compact ? 'gap-2' : 'gap-3'}`}>
          {place.bestTimeToVisit && (
            <span className={`inline-flex items-center gap-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/60 font-medium shadow-sm ${compact ? 'px-3 py-2 text-sm' : 'px-4 py-2.5 text-sm'}`}>
              <svg className={`flex-shrink-0 text-amber-600 ${compact ? 'w-4 h-4' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {place.bestTimeToVisit}
            </span>
          )}
          {place.visitDuration && (
            <span className={`inline-flex items-center gap-1.5 rounded-lg bg-violet-50 text-violet-900 border border-violet-200/60 font-medium shadow-sm ${compact ? 'px-3 py-2 text-sm' : 'px-4 py-2.5 text-sm'}`}>
              <svg className={`flex-shrink-0 text-violet-600 ${compact ? 'w-4 h-4' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {place.visitDuration}
            </span>
          )}
          {place.location && (
            <button
              type="button"
              onClick={() => openGoogleMapsDirections(place.location!, getLocalizedContent(place.name, language))}
              className={`inline-flex items-center gap-2 rounded-lg bg-sky-50 text-sky-800 border border-sky-200/60 font-medium shadow-sm hover:bg-sky-100 hover:border-sky-300/80 active:scale-[0.98] transition-all touch-manipulation ${compact ? 'px-3 py-2 text-sm min-h-[40px] sm:min-h-0' : 'px-4 py-2.5 text-sm min-h-[44px] sm:min-h-0'}`}
              aria-label={t('get.directions', language)}
              title={t('get.directions', language)}
            >
              <svg className={`flex-shrink-0 text-sky-600 w-4 h-4`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
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

  if (minimal) {
    return (
      <>
        {minimalMobileLayout}
        {mainLayout}
      </>
    );
  }
  return mainLayout;
}

