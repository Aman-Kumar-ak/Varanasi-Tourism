'use client';

import { getLocalizedContent } from '@/lib/i18n';
import { t } from '@/lib/translations';
import type { LanguageCode } from '@/lib/constants';
import SectionHeader from './SectionHeader';

interface WellnessCenter {
  name: string;
  type: 'yoga' | 'meditation' | 'ayurveda' | 'spa' | 'retreat';
  description: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  address: string;
  contact?: string;
  website?: string;
  priceRange?: 'budget' | 'mid-range' | 'luxury';
  rating?: number;
}

interface WellnessRetreatsProps {
  centers: WellnessCenter[];
  language: LanguageCode;
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'yoga':
      return '🧘';
    case 'meditation':
      return '🕉️';
    case 'ayurveda':
      return '🌿';
    case 'spa':
      return '💆';
    case 'retreat':
      return '🏛️';
    default:
      return '✨';
  }
}

function getPriceRangeLabel(range: string) {
  switch (range) {
    case 'budget':
      return '₹';
    case 'mid-range':
      return '₹₹';
    case 'luxury':
      return '₹₹₹';
    default:
      return '';
  }
}

function getPriceRangeColor(range: string) {
  switch (range) {
    case 'budget':
      return 'bg-primary-gold';
    case 'mid-range':
      return 'bg-primary-blue';
    case 'luxury':
      return 'bg-gradient-temple';
    default:
      return 'bg-gray-500';
  }
}

export default function WellnessRetreats({ centers, language }: WellnessRetreatsProps) {
  return (
    <section className="mb-12">
      <SectionHeader
        title={t('wellness.spiritual.retreats', language)}
        icon="🧘"
        subtitle={t('yoga.meditation.ayurveda', language)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {centers.map((center, index) => (
          <div
            key={index}
            className="card-modern rounded-2xl p-5 sm:p-6 shadow-temple border-l-4 border-primary-gold h-full flex flex-col relative overflow-hidden group hover:shadow-xl transition-all duration-300"
          >
            {/* Decorative gradient background */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-temple opacity-5 rounded-full -mr-12 -mt-12 group-hover:opacity-10 transition-opacity"></div>
            
            {/* Type Icon */}
            <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-temple flex items-center justify-center text-2xl sm:text-3xl shadow-temple mb-3 sm:mb-4 relative z-10">
              {getTypeIcon(center.type)}
            </div>

            {/* Name and Price Range */}
            <div className="flex items-start justify-between mb-3 sm:mb-4 relative z-10">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary-dark flex-1 leading-tight">
                {center.name}
              </h3>
              {center.priceRange && (
                <span
                  className={`${getPriceRangeColor(
                    center.priceRange
                  )} text-white px-3 py-1.5 rounded-lg text-xs font-bold flex-shrink-0 ml-2 shadow-md`}
                >
                  {getPriceRangeLabel(center.priceRange)}
                </span>
              )}
            </div>

            {/* Type Badge */}
            <div className="mb-3 relative z-10">
              <p className="text-sm text-primary-gold font-bold bg-primary-gold/10 rounded-lg px-3 py-1.5 inline-block capitalize">
                {center.type}
              </p>
            </div>

            {/* Description */}
            <p className="text-primary-dark/90 text-sm leading-relaxed mb-4 relative z-10 flex-grow">
              {getLocalizedContent(center.description, language)}
            </p>

            {/* Address */}
            <div className="mb-4 relative z-10">
              <p className="text-sm text-primary-dark/70 flex items-start gap-2 leading-relaxed">
                <span className="flex-shrink-0 text-lg">📍</span>
                <span>{center.address}</span>
              </p>
            </div>

            {/* Rating */}
            {center.rating && (
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <div className="bg-primary-gold/10 rounded-lg px-3 py-1.5">
                  <span className="text-primary-gold font-bold text-base">
                    ⭐ {center.rating}
                  </span>
                </div>
              </div>
            )}

            {/* Contact and Website */}
            <div className="mt-auto space-y-2 relative z-10">
              {center.contact && (
                <p className="text-sm text-primary-dark/80 break-all flex items-center gap-2">
                  <span className="text-primary-gold">📞</span>
                  <span>{center.contact}</span>
                </p>
              )}
              {center.website && (
                <a
                  href={center.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-gold font-semibold break-all flex items-center gap-1 hover:underline py-2 px-2 -mx-2 rounded-lg hover:bg-primary-gold/5 transition-colors touch-manipulation min-h-[44px]"
                >
                  Visit Website <span>→</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

