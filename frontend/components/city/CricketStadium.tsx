'use client';

import Image from 'next/image';
import { getLocalizedContent } from '@/lib/i18n';
import { t } from '@/lib/translations';
import type { LanguageCode } from '@/lib/constants';

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
      {/* Hero: image with overlay and title */}
      <div className="relative rounded-2xl overflow-hidden mb-6 sm:mb-8 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
        <div className="relative w-full aspect-[21/9] min-h-[240px] sm:min-h-[260px] md:min-h-[280px]">
          <Image
            src="https://res.cloudinary.com/dp0gqerkk/image/upload/v1769856593/ChatGPT_Image_Jan_31_2026_04_19_06_PM_aitfun.png"
            alt={getLocalizedContent(stadium.name, language)}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
            <p className="text-white/90 text-[10px] sm:text-xs font-medium uppercase tracking-wider mb-1">
              {t('international.cricket.stadium', language)}
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold drop-shadow-lg" style={{ lineHeight: 1.2 }}>
              {getLocalizedContent(stadium.name, language)}
            </h2>
          </div>
        </div>
      </div>

      {/* Main content card */}
      <div className="rounded-2xl overflow-hidden bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-200/60">
        {/* Accent strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary-saffron via-primary-orange to-primary-gold" aria-hidden />

        <div className="p-5 sm:p-6 md:p-8">
          {/* Intro */}
          <p className="text-primary-dark/90 text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
            {getLocalizedContent(stadium.description, language)}
          </p>

          {/* Key stats: Capacity, Opening date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6 sm:mb-8">
            <div className="flex items-start gap-4 rounded-xl bg-slate-50 border border-slate-200/80 p-4 sm:p-5">
              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary-saffron/10 flex items-center justify-center text-primary-saffron">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-primary-dark/60 uppercase tracking-wide">
                  {t('capacity', language)}
                </p>
                <p className="font-bold text-primary-dark text-lg sm:text-xl mt-0.5">
                  {stadium.capacity}
                </p>
              </div>
            </div>
            {stadium.openingDate && (
              <div className="flex items-start gap-4 rounded-xl bg-slate-50 border border-slate-200/80 p-4 sm:p-5">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary-gold/10 flex items-center justify-center text-primary-gold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-primary-dark/60 uppercase tracking-wide">
                    {t('opening.date', language)}
                  </p>
                  <p className="font-bold text-primary-dark text-lg sm:text-xl mt-0.5">
                    {stadium.openingDate === 'January 2026' ? '2026*' : stadium.openingDate}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Architectural Features */}
          {stadium.features && (
            <div className="mb-6 sm:mb-8">
              <h3 className="text-sm font-semibold text-primary-dark/70 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="text-primary-saffron" aria-hidden>🏗️</span>
                {t('architectural.features', language)}
              </h3>
              <div className="rounded-xl bg-gradient-to-br from-primary-saffron/5 to-primary-gold/5 border border-primary-saffron/20 p-4 sm:p-5 md:p-6">
                <p className="text-primary-dark/85 leading-relaxed text-sm sm:text-base">
                  {getLocalizedContent(stadium.features, language)}
                </p>
              </div>
            </div>
          )}

          {/* Stadium Tours */}
          {stadium.tourInfo && (
            <div className="mb-6 sm:mb-8">
              <h3 className="text-sm font-semibold text-primary-dark/70 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="text-primary-gold" aria-hidden>👥</span>
                {t('stadium.tours', language)}
              </h3>
              <div className="rounded-xl bg-primary-blue/5 border border-primary-blue/15 p-4 sm:p-5 md:p-6">
                <p className="text-primary-dark/85 leading-relaxed text-sm sm:text-base">
                  {getLocalizedContent(stadium.tourInfo, language)}
                </p>
              </div>
            </div>
          )}

          {/* CTAs: Directions, Contact */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
            {stadium.location && (
              <a
                href={getDirectionsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-primary-saffron text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:bg-primary-deepOrange transition-all text-sm sm:text-base min-h-[44px] touch-manipulation w-full sm:w-auto"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t('get.directions', language)}
              </a>
            )}
            {stadium.contact && (
              <a
                href={`tel:${stadium.contact}`}
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-primary-gold text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:bg-primary-orange transition-all text-sm sm:text-base min-h-[44px] touch-manipulation w-full sm:w-auto"
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {t('contact', language)}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
