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
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-primary-blue/5 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-primary-dark mb-1">
          {route.from} → {route.to}
        </h3>
        <div className="flex items-center gap-4 text-base text-primary-dark/60">
          <span className="flex items-center gap-1">
            <span>📏</span>
            <span>{route.distance} {t('km', language)}</span>
          </span>
          <span className="flex items-center gap-1">
            <span>⏱️</span>
            <span>{route.duration} {t('min', language)}</span>
          </span>
        </div>
      </div>

      {route.routeDescription && (
        <p className="text-sm text-primary-dark/70 mb-4">
          {getLocalizedContent(route.routeDescription, language)}
        </p>
      )}

      <div className="space-y-3">
        <h4 className="text-base font-semibold text-primary-dark">{t('transport.options', language)}</h4>
        {route.transportOptions.map((option, index) => (
          <div
            key={index}
            className="bg-background-parchment rounded-lg p-4 border border-primary-blue/10"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {transportIcons[option.type] || '🚗'}
                </span>
                <span className="font-semibold text-primary-dark capitalize">
                  {option.type}
                </span>
              </div>
              <div className="text-right">
                <div className="font-bold text-primary-orange">
                  {formatCurrency(option.priceRange.min)} - {formatCurrency(option.priceRange.max)}
                </div>
                <div className="text-sm text-primary-dark/60">
                  ~{option.estimatedTime} {t('min', language)}
                </div>
              </div>
            </div>
            {option.tips && (
              <div className="mt-2 pt-2 border-t border-primary-blue/20">
                <p className="text-sm text-primary-teal">
                  💡 {getLocalizedContent(option.tips, language)}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

