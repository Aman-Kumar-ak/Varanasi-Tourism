'use client';

import { getLocalizedContent } from '@/lib/i18n';
import { t } from '@/lib/translations';
import type { LanguageCode } from '@/lib/constants';

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

const transportIcons: Record<string, string> = {
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
    <div className="card-modern rounded-2xl p-6 shadow-card border-l-4 border-primary-gold h-full flex flex-col relative overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-temple opacity-5 rounded-full -mr-16 -mt-16"></div>
      
      <div className="mb-5 relative z-10">
        <h3 className="text-xl font-bold text-primary-dark mb-3 leading-tight">
          {route.from} → {route.to}
        </h3>
        <div className="flex items-center gap-5 text-base text-primary-dark/70">
          <span className="flex items-center gap-2 bg-primary-gold/10 px-3 py-1.5 rounded-lg">
            <span className="text-lg">📏</span>
            <span className="font-medium">{route.distance} {t('km', language)}</span>
          </span>
          <span className="flex items-center gap-2 bg-primary-saffron/10 px-3 py-1.5 rounded-lg">
            <span className="text-lg">⏱️</span>
            <span className="font-medium">{route.duration} {t('min', language)}</span>
          </span>
        </div>
      </div>

      {route.routeDescription && (
        <p className="text-sm text-primary-dark/80 mb-5 leading-relaxed relative z-10">
          {getLocalizedContent(route.routeDescription, language)}
        </p>
      )}

      <div className="space-y-4 relative z-10 flex-grow">
        <h4 className="text-lg font-bold text-primary-dark flex items-center gap-2">
          <span className="w-6 h-0.5 bg-gradient-temple"></span>
          {t('transport.options', language)}
        </h4>
        {route.transportOptions.map((option, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-primary-gold/10 to-primary-saffron/5 rounded-xl p-4 border border-primary-gold/20"
          >
            <div className="flex items-center justify-between mb-3 gap-2">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-temple flex items-center justify-center text-lg sm:text-xl shadow-temple flex-shrink-0">
                  {transportIcons[option.type] || '🚗'}
                </div>
                <span className="font-bold text-primary-dark capitalize text-sm sm:text-base break-words">
                  {option.type}
                </span>
              </div>
              <div className="text-right">
                <div className="font-bold text-gradient-temple text-lg">
                  {formatCurrency(option.priceRange.min)} - {formatCurrency(option.priceRange.max)}
                </div>
                <div className="text-sm text-primary-dark/70 font-medium">
                  ~{option.estimatedTime} {t('min', language)}
                </div>
              </div>
            </div>
            {option.tips && (
              <div className="mt-3 pt-3 border-t border-primary-gold/20">
                <p className="text-sm text-primary-dark/80 leading-relaxed flex items-start gap-2">
                  <span className="text-primary-gold flex-shrink-0">💡</span>
                  <span>{getLocalizedContent(option.tips, language)}</span>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

