'use client';

import { t } from '@/lib/translations';
import { openGoogleMapsDirections } from '@/lib/googleMaps';
import type { LanguageCode } from '@/lib/constants';
import { getIconComponent } from '@/lib/iconMapping';

interface EntryPoint {
  type: 'airport' | 'railway' | 'bus';
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  code?: string;
}

interface EntryPointCardProps {
  entryPoint: EntryPoint;
  language: LanguageCode;
}

const entryPointIconMap: Record<string, string> = {
  airport: '✈️',
  railway: '🚂',
  bus: '🚌',
};

export default function EntryPointCard({ entryPoint, language }: EntryPointCardProps) {
  const iconEmoji = entryPointIconMap[entryPoint.type] || '📍';
  const IconComponent = getIconComponent(iconEmoji);

  return (
    <div className="card-modern rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 border-l-4 border-primary-gold h-full flex flex-col relative overflow-hidden shadow-none sm:shadow-card">
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-temple opacity-5 rounded-full -mr-10 -mt-10 sm:-mr-12 sm:-mt-12"></div>
      
      <div className="flex items-start gap-2 sm:gap-3 md:gap-4 flex-1 relative z-10">
        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-gradient-temple flex items-center justify-center text-white">
          {IconComponent ? (
            <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
          ) : (
            <span className="text-base sm:text-xl md:text-2xl">{iconEmoji}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-primary-dark mb-1.5 sm:mb-2 break-words" style={{ lineHeight: '1.4' }}>
            {entryPoint.name}
          </h3>
          <p className="text-[10px] sm:text-xs md:text-sm text-primary-dark/70 capitalize font-medium mb-2 sm:mb-3">
            {entryPoint.type} {t('station', language)}
          </p>
          {/* Code and Get Directions in one row */}
          {entryPoint.location && (
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {entryPoint.code && (
                <div className="bg-primary-gold/10 rounded-md sm:rounded-lg px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 inline-flex items-center">
              <p className="text-xs sm:text-sm md:text-base font-semibold text-primary-dark">
                {t('code', language)}: <span className="font-mono font-bold text-primary-gold text-sm sm:text-base md:text-lg">{entryPoint.code}</span>
              </p>
            </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering parent div's onClick
                  openGoogleMapsDirections(entryPoint.location, entryPoint.name);
                }}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 bg-primary-blue/10 hover:bg-primary-blue/20 active:bg-primary-blue/30 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-md sm:rounded-lg font-medium transition-colors text-primary-blue text-[10px] sm:text-xs md:text-sm min-h-[36px] sm:min-h-[44px] touch-manipulation ${entryPoint.code ? 'flex-1 sm:flex-initial' : 'w-full sm:w-auto'}`}
                aria-label={t('get.directions', language)}
                title={t('get.directions', language)}
              >
                <span className="text-xs sm:text-sm">🗺️</span>
                <span>{t('get.directions', language)}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

