'use client';

import { getLocalizedContent } from '@/lib/i18n';
import { t } from '@/lib/translations';
import type { LanguageCode } from '@/lib/constants';

interface TransportOption {
  type: 'taxi' | 'auto' | 'rickshaw' | 'bus' | 'metro' | 'boat';
  name: string;
  description: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  priceRange: {
    min: number;
    max: number;
    currency: string;
  };
  perKm?: boolean;
  perHour?: boolean;
}

interface TransportationGuideProps {
  transportOptions: TransportOption[];
  transportTips?: {
    en: string;
    hi: string;
    [key: string]: string;
  };
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

function formatCurrency(amount: number, currency: string = 'INR'): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export default function TransportationGuide({
  transportOptions,
  transportTips,
  language,
}: TransportationGuideProps) {
  if (!transportOptions || transportOptions.length === 0) {
    return null;
  }

  return (
    <section className="mb-10 sm:mb-12">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4 mb-3">
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gradient-temple flex items-center justify-center text-xl sm:text-2xl shadow-temple">
            🚗
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gradient-temple mb-2 leading-tight break-words">
              {t('transportation.guide', language)}
            </h2>
            <div className="w-12 sm:w-16 md:w-20 h-0.5 sm:h-1 bg-gradient-temple rounded-full"></div>
          </div>
        </div>
        <p className="text-primary-dark/80 text-xs sm:text-sm md:text-base lg:text-lg ml-0 sm:ml-12 md:ml-[4.5rem] font-medium px-1 sm:px-0">
          {t('transportation.subtitle', language)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 mb-6 sm:mb-8">
        {transportOptions.map((option, index) => (
          <div
            key={index}
            className="card-modern rounded-2xl p-5 sm:p-6 shadow-card border-l-4 border-primary-gold relative overflow-hidden flex flex-col h-full"
          >
            {/* Decorative gradient background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-temple opacity-5 rounded-full -mr-16 -mt-16"></div>
            
            {/* Icon and Header */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-4 relative z-10">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl bg-gradient-temple flex items-center justify-center text-xl sm:text-2xl md:text-3xl shadow-temple">
                <span>{transportIcons[option.type] || '🚗'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-primary-dark break-words leading-tight">
                  {option.name}
                </h3>
              </div>
            </div>
            
            {/* Description */}
            <p className="text-sm sm:text-base text-primary-dark/80 leading-relaxed mb-4 sm:mb-5 relative z-10 flex-grow">
              {getLocalizedContent(option.description, language)}
            </p>
            
            {/* Price Section */}
            <div className="relative z-10 mt-auto pt-3 sm:pt-4 border-t border-primary-gold/20">
              <div className="bg-gradient-to-br from-primary-gold/15 to-primary-saffron/10 rounded-xl p-3 sm:p-4 border border-primary-gold/20">
                <div className="text-center">
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-gradient-temple mb-1">
                    {formatCurrency(option.priceRange.min, option.priceRange.currency)} -{' '}
                    {formatCurrency(option.priceRange.max, option.priceRange.currency)}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-primary-dark/70 mt-1">
                    {option.perKm && t('per.km', language)}
                    {option.perHour && t('per.hour', language)}
                    {!option.perKm && !option.perHour && t('per.trip', language)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {transportTips && (
        <div className="bg-primary-gold/10 border border-primary-gold/30 rounded-xl p-4 sm:p-5 md:p-6">
          <h3 className="text-base sm:text-lg font-bold text-primary-dark mb-2 sm:mb-3 flex items-center gap-2">
            <span>💡</span>
            <span>{t('travel.tips', language)}</span>
          </h3>
          <p className="text-sm sm:text-base text-primary-dark/80 leading-relaxed whitespace-pre-line">
            {getLocalizedContent(transportTips, language)}
          </p>
        </div>
      )}
    </section>
  );
}

