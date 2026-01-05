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
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-dark mb-2">
          🚗 {t('transportation.guide', language)}
        </h2>
        <p className="text-primary-dark/70 text-base">
          {t('transportation.subtitle', language)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {transportOptions.map((option, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-primary-blue/5"
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="text-3xl">{transportIcons[option.type] || '🚗'}</span>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-primary-dark mb-1">
                  {option.name}
                </h3>
                <p className="text-base text-primary-dark/70">
                  {getLocalizedContent(option.description, language)}
                </p>
              </div>
            </div>
            <div className="bg-primary-orange/10 rounded-lg p-3 mt-4">
              <div className="text-center">
                <div className="text-xl font-bold text-primary-orange mb-1">
                  {formatCurrency(option.priceRange.min, option.priceRange.currency)} -{' '}
                  {formatCurrency(option.priceRange.max, option.priceRange.currency)}
                </div>
                <div className="text-sm text-primary-dark/60">
                  {option.perKm && t('per.km', language)}
                  {option.perHour && t('per.hour', language)}
                  {!option.perKm && !option.perHour && t('per.trip', language)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {transportTips && (
        <div className="bg-primary-teal/10 border border-primary-teal/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-primary-dark mb-3 flex items-center gap-2">
            <span>💡</span>
            <span>{t('travel.tips', language)}</span>
          </h3>
          <p className="text-primary-dark/80 leading-relaxed whitespace-pre-line">
            {getLocalizedContent(transportTips, language)}
          </p>
        </div>
      )}
    </section>
  );
}

