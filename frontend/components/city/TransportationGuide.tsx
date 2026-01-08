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

import { getIconComponent } from '@/lib/iconMapping';

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
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Compact icon */}
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-temple flex items-center justify-center text-white shadow-md">
              {(() => {
                const IconComponent = getIconComponent('🚗');
                return IconComponent ? <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" /> : null;
              })()}
            </div>
          </div>
          
          {/* Title and subtitle - compact and integrated */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3 gap-1">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gradient-temple leading-tight break-words" style={{ lineHeight: '1.5' }}>
                {t('transportation.guide', language)}
              </h2>
              <p className="text-primary-dark/70 text-sm sm:text-base md:text-lg font-normal leading-relaxed">
                {t('transportation.subtitle', language)}
              </p>
            </div>
            
            {/* Minimal decorative line */}
            <div className="mt-2 h-0.5 w-12 sm:w-16 bg-gradient-temple rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
        {transportOptions.map((option, index) => (
          <div
            key={index}
            className="card-modern rounded-xl sm:rounded-2xl p-3.5 sm:p-5 md:p-6 shadow-none sm:shadow-card border-l-4 border-primary-gold relative overflow-hidden flex flex-col h-full"
          >
            {/* Decorative gradient background */}
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-temple opacity-5 rounded-full -mr-10 -mt-10 sm:-mr-16 sm:-mt-16"></div>
            
            {/* Icon and Header - Compact */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-2.5 sm:mb-3 md:mb-4 relative z-10">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-lg sm:rounded-xl bg-gradient-temple flex items-center justify-center text-white">
                {(() => {
                  const iconEmoji = transportIcons[option.type] || '🚗';
                  const IconComponent = getIconComponent(iconEmoji);
                  return IconComponent ? <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 md:w-7 md:h-7" /> : null;
                })()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-primary-dark break-words" style={{ lineHeight: '1.4' }}>
                  {option.name}
                </h3>
              </div>
            </div>
            
            {/* Description - Compact */}
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-primary-dark/80 leading-relaxed mb-2.5 sm:mb-3 md:mb-4 relative z-10 flex-grow">
              {getLocalizedContent(option.description, language)}
            </p>
            
            {/* Price Section - Compact with reduced gap */}
            <div className="relative z-10 mt-auto pt-2 sm:pt-3 md:pt-4 border-t border-primary-gold/20">
              <div className="bg-gradient-to-br from-primary-gold/15 to-primary-saffron/10 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 border border-primary-gold/20">
                <div className="text-center">
                  <div className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-gradient-temple mb-0.5 sm:mb-1">
                    {formatCurrency(option.priceRange.min, option.priceRange.currency)} -{' '}
                    {formatCurrency(option.priceRange.max, option.priceRange.currency)}
                  </div>
                  <div className="text-[10px] sm:text-xs md:text-sm font-medium text-primary-dark/70 mt-0.5 sm:mt-1">
                    {t('fixed.variable.price', language) || 'Fixed/Variable price from source to destination'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {transportTips && (
        <div className="bg-primary-gold/10 border border-primary-gold/30 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6">
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-primary-dark mb-1.5 sm:mb-2 md:mb-3 flex items-center gap-1.5 sm:gap-2">
            <span className="text-sm sm:text-base">💡</span>
            <span>{t('travel.tips', language)}</span>
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-primary-dark/80 leading-relaxed whitespace-pre-line">
            {getLocalizedContent(transportTips, language)}
          </p>
        </div>
      )}
    </section>
  );
}

