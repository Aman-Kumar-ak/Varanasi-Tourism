'use client';

import Image from 'next/image';
import { getLocalizedContent } from '@/lib/i18n';
import { t } from '@/lib/translations';
import type { LanguageCode } from '@/lib/constants';
import SectionHeader from './SectionHeader';

interface CricketStadium {
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
  capacity: string;
  openingDate?: string;
  features?: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  location?: {
    lat: number;
    lng: number;
  };
  tourInfo?: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  contact?: string;
}

interface CricketStadiumProps {
  stadium: CricketStadium;
  language: LanguageCode;
}

export default function CricketStadium({ stadium, language }: CricketStadiumProps) {
  const getDirectionsUrl = () => {
    if (stadium.location) {
      return `https://www.google.com/maps/dir/?api=1&destination=${stadium.location.lat},${stadium.location.lng}`;
    }
    return '#';
  };

  return (
    <section className="mb-12">
      <SectionHeader
        title={getLocalizedContent(stadium.name, language)}
        icon="🏏"
        subtitle={t('international.cricket.stadium', language)}
      />
      
      {/* Cricket Stadium Image */}
      <div className="mb-6 rounded-2xl overflow-hidden shadow-temple">
        <div className="relative w-full h-64 sm:h-80 md:h-96">
          <Image
            src="https://res.cloudinary.com/dp0gqerkk/image/upload/v1767775525/Cricket_Stadium_j6wg1o.png"
            alt={getLocalizedContent(stadium.name, language)}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
      
      <div className="card-modern rounded-2xl p-5 sm:p-6 md:p-8 shadow-temple border-l-4 border-primary-saffron relative overflow-hidden">
        {/* Decorative gradient background */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-temple opacity-5 rounded-full -mr-20 -mt-20"></div>
        
        <div className="relative z-10">
          {/* Main Description */}
          <p className="text-primary-dark/90 leading-relaxed text-base sm:text-lg mb-5 sm:mb-6">
            {getLocalizedContent(stadium.description, language)}
          </p>

          {/* Key Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5 sm:mb-6">
            <div className="bg-primary-saffron/10 rounded-xl p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-primary-dark/70 mb-1 sm:mb-2 font-medium">
                {t('capacity', language)}
              </p>
              <p className="font-bold text-primary-dark text-lg sm:text-xl">
                {stadium.capacity}
              </p>
            </div>
            {stadium.openingDate && (
              <div className="bg-primary-gold/10 rounded-xl p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-primary-dark/70 mb-1 sm:mb-2 font-medium">
                  {t('opening.date', language)}
                </p>
                <p className="font-bold text-primary-dark text-lg sm:text-xl">
                  {stadium.openingDate}
                </p>
              </div>
            )}
          </div>

          {/* Features */}
          {stadium.features && (
            <div className="bg-gradient-to-br from-primary-saffron/10 to-primary-gold/5 rounded-xl p-4 sm:p-5 md:p-6 mb-5 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-primary-dark mb-2 sm:mb-3 flex items-center gap-2">
                <span>🏗️</span> {t('architectural.features', language)}
              </h3>
              <p className="text-primary-dark/80 leading-relaxed text-sm sm:text-base">
                {getLocalizedContent(stadium.features, language)}
              </p>
            </div>
          )}

          {/* Tour Information */}
          {stadium.tourInfo && (
            <div className="bg-primary-blue/10 rounded-xl p-4 sm:p-5 md:p-6 mb-5 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-primary-dark mb-2 sm:mb-3 flex items-center gap-2">
                <span>👥</span> {t('stadium.tours', language)}
              </h3>
              <p className="text-primary-dark/80 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
                {getLocalizedContent(stadium.tourInfo, language)}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            {stadium.location && (
              <a
                href={getDirectionsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-primary-saffron text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-shadow text-sm sm:text-base min-h-[44px] touch-manipulation w-full sm:w-auto"
              >
                <span>🗺️</span> {t('get.directions', language)}
              </a>
            )}
            {stadium.contact && (
              <a
                href={`tel:${stadium.contact}`}
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-primary-gold text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-shadow text-sm sm:text-base min-h-[44px] touch-manipulation w-full sm:w-auto"
              >
                <span>📞</span> {t('contact', language)}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

