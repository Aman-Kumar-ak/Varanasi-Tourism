'use client';

import { getLocalizedContent } from '@/lib/i18n';
import { t } from '@/lib/translations';
import { openGoogleMapsRouteDirections } from '@/lib/googleMaps';
import type { LanguageCode } from '@/lib/constants';
import { getIconComponent } from '@/lib/iconMapping';

interface RouteTransportOption {
  type: string;
  priceRange: {
    min: number;
    max: number;
  };
  estimatedTime: number;
  tips?: {
    en: string;
    hi: string;
    [key: string]: string;
  };
}

interface Route {
  from: string;
  to: string;
  distance: number;
  duration: number;
  transportOptions: RouteTransportOption[];
  routeDescription?: {
    en: string;
    hi: string;
    [key: string]: string;
  };
}

interface RouteCardProps {
  route: Route;
  language: LanguageCode;
}

const transportIconMap: Record<string, string> = {
  taxi: '🚕',
  auto: '🛺',
  rickshaw: '🛺',
  bus: '🚌',
  metro: '🚇',
  boat: '⛵',
};

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export default function RouteCard({ route, language }: RouteCardProps) {
  return (
    <div className="card-modern rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-none sm:shadow-card border-l-4 border-primary-gold h-full flex flex-col relative overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-temple opacity-5 rounded-full -mr-16 -mt-16"></div>
      
      <div className="mb-4 sm:mb-5 relative z-10">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary-dark mb-2 sm:mb-3 break-words" style={{ lineHeight: '1.5' }}>
          {route.from} → {route.to}
        </h3>
        {/* Distance, Duration, and Directions in one row - dynamically adjusts */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="flex items-center gap-1.5 sm:gap-2 bg-primary-gold/10 px-2 sm:px-3 py-1.5 sm:py-1.5 rounded-lg text-xs sm:text-sm text-primary-dark/70 flex-shrink-0">
            <span className="text-sm sm:text-base">📏</span>
            <span className="font-medium whitespace-nowrap">{route.distance} {t('km', language)}</span>
          </span>
          <span className="flex items-center gap-1.5 sm:gap-2 bg-primary-saffron/10 px-2 sm:px-3 py-1.5 sm:py-1.5 rounded-lg text-xs sm:text-sm text-primary-dark/70 flex-shrink-0">
            <span className="text-sm sm:text-base">⏱️</span>
            <span className="font-medium whitespace-nowrap">{route.duration} {t('min', language)}</span>
          </span>
          <button
            onClick={() => openGoogleMapsRouteDirections(route.from, route.to)}
            className="flex items-center justify-center gap-1.5 sm:gap-2 bg-primary-blue/10 hover:bg-primary-blue/20 active:bg-primary-blue/30 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg font-medium transition-colors text-primary-blue text-xs sm:text-sm md:text-base min-h-[36px] sm:min-h-[44px] touch-manipulation flex-shrink-0"
            aria-label={t('get.directions', language)}
            title={t('get.directions', language)}
          >
            <span className="text-sm sm:text-base md:text-lg">🗺️</span>
            <span className="font-medium whitespace-nowrap">{t('directions', language)}</span>
          </button>
        </div>
      </div>

      {route.routeDescription && (
        <p className="text-xs sm:text-sm text-primary-dark/80 mb-4 sm:mb-5 leading-relaxed relative z-10">
          {getLocalizedContent(route.routeDescription, language)}
        </p>
      )}

      <div className="space-y-2 sm:space-y-3 md:space-y-4 relative z-10 flex-grow">
        <h4 className="text-sm sm:text-base md:text-lg font-bold text-primary-dark flex items-center gap-2 mb-2 sm:mb-3">
          <span className="w-4 sm:w-6 h-0.5 bg-gradient-temple"></span>
          {t('transport.options', language)}
        </h4>
        {/* Transport options in one row on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3 md:gap-4">
          {route.transportOptions.map((option, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-primary-gold/10 to-primary-saffron/5 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 border border-primary-gold/20"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-2 md:gap-3">
                <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 min-w-0 flex-1 w-full sm:w-auto">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-md sm:rounded-lg bg-gradient-temple flex items-center justify-center text-white flex-shrink-0">
                    {(() => {
                      const iconEmoji = transportIconMap[option.type] || '🚗';
                      const IconComponent = getIconComponent(iconEmoji);
                      return IconComponent ? (
                        <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                      ) : null;
                    })()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-primary-dark capitalize text-xs sm:text-sm md:text-base break-words block">
                      {option.type}
                    </span>
                    <div className="text-[10px] sm:text-xs md:text-sm text-primary-dark/70 font-medium mt-0.5">
                      ~{option.estimatedTime} {t('min', language)}
                    </div>
                  </div>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <div className="font-bold text-gradient-temple text-sm sm:text-base md:text-lg">
                    {formatCurrency(option.priceRange.min)} - {formatCurrency(option.priceRange.max)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Price variation advisory note */}
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-primary-gold/20">
          <p className="text-[10px] sm:text-xs md:text-sm text-primary-dark/70 leading-relaxed flex items-start gap-1.5 sm:gap-2">
            <span className="text-primary-saffron flex-shrink-0 text-xs sm:text-sm">⚠️</span>
            <span>
              {t('price.variation.note', language) || 'Prices may vary due to diversions or crowd movement for safety purposes.'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

