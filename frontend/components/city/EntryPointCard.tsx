'use client';

import { t } from '@/lib/translations';
import { openGoogleMapsDirections } from '@/lib/googleMaps';
import type { LanguageCode } from '@/lib/constants';

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

const entryPointIcons: Record<string, string> = {
  airport: '✈️',
  railway: '🚂',
  bus: '🚌',
};

export default function EntryPointCard({ entryPoint, language }: EntryPointCardProps) {
  const icon = entryPointIcons[entryPoint.type] || '📍';

  return (
    <div className="card-modern rounded-2xl p-6 shadow-card border-l-4 border-primary-gold h-full flex flex-col relative overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-temple opacity-5 rounded-full -mr-12 -mt-12"></div>
      
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 relative z-10">
        <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-gradient-temple flex items-center justify-center text-xl sm:text-2xl md:text-3xl shadow-temple">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-primary-dark mb-2 break-words leading-tight">
            {entryPoint.name}
          </h3>
          {entryPoint.code && (
            <div className="bg-primary-gold/10 rounded-lg px-3 py-1.5 mb-2 inline-block">
              <p className="text-sm font-semibold text-primary-dark">
                {t('code', language)}: <span className="font-mono font-bold text-primary-gold">{entryPoint.code}</span>
              </p>
            </div>
          )}
          <p className="text-sm text-primary-dark/70 capitalize font-medium mb-3">
            {entryPoint.type} {t('station', language)}
          </p>
          {entryPoint.location && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering parent div's onClick
                openGoogleMapsDirections(entryPoint.location, entryPoint.name);
              }}
              className="flex items-center gap-2 bg-primary-blue/10 hover:bg-primary-blue/20 px-3 py-1.5 rounded-lg font-medium transition-colors text-primary-blue text-sm w-full sm:w-auto"
              aria-label={t('get.directions', language)}
              title={t('get.directions', language)}
            >
              <span>🗺️</span>
              <span>{t('get.directions', language)}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

