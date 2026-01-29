'use client';

import Image from 'next/image';
import { getLocalizedContent } from '@/lib/i18n';
import { t } from '@/lib/translations';
import type { LanguageCode } from '@/lib/constants';

interface Station {
  name: string;
  description?: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  confirmed?: boolean;
}

interface KashiRopeway {
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
  route: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  stations: Station[];
  openingDate?: string;
  capacity?: string;
  ticketPrice?: {
    min: number;
    max: number;
    currency: string;
  };
  features?: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  location?: {
    lat: number;
    lng: number;
  };
}

interface KashiRopewayProps {
  ropeway: KashiRopeway;
  language: LanguageCode;
}

export default function KashiRopeway({ ropeway, language }: KashiRopewayProps) {
  const confirmedStations = ropeway.stations?.filter((s) => s.confirmed !== false) ?? [];

  return (
    <section className="mb-12">
      {/* Hero: image with overlay and title */}
      <div className="relative rounded-2xl overflow-hidden mb-6 sm:mb-8 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
        <div className="relative w-full aspect-[21/9] min-h-[200px] sm:min-h-[240px] md:min-h-[280px]">
          <Image
            src="https://res.cloudinary.com/dp0gqerkk/image/upload/v1767775525/ropeway_fwbcfo.webp"
            alt={getLocalizedContent(ropeway.name, language)}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
            <p className="text-white/90 text-xs sm:text-sm font-medium uppercase tracking-wider mb-1">
              {t('indias.first.public.ropeway', language)}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-lg" style={{ lineHeight: 1.2 }}>
              {getLocalizedContent(ropeway.name, language)}
            </h2>
          </div>
        </div>
      </div>

      {/* Main content card */}
      <div className="rounded-2xl overflow-hidden bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-200/60">
        {/* Accent strip */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary-blue via-blue-400 to-primary-blue" aria-hidden />

        <div className="p-5 sm:p-6 md:p-8">
          {/* Intro */}
          <p className="text-primary-dark/90 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
            {getLocalizedContent(ropeway.description, language)}
          </p>

          {/* Key stats: Opening, Capacity, Price */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
            {ropeway.openingDate && (
              <div className="flex items-start gap-4 rounded-xl bg-slate-50 border border-slate-200/80 p-4 sm:p-5">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary-blue/10 flex items-center justify-center text-primary-blue">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-primary-dark/60 uppercase tracking-wide">
                    {t('opening.date', language)}
                  </p>
                  <p className="font-bold text-primary-dark text-base sm:text-lg mt-0.5">
                    {ropeway.openingDate}
                  </p>
                </div>
              </div>
            )}
            {ropeway.capacity && (
              <div className="flex items-start gap-4 rounded-xl bg-slate-50 border border-slate-200/80 p-4 sm:p-5">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary-saffron/10 flex items-center justify-center text-primary-saffron">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-primary-dark/60 uppercase tracking-wide">
                    {t('daily.capacity', language)}
                  </p>
                  <p className="font-bold text-primary-dark text-base sm:text-lg mt-0.5">
                    {ropeway.capacity}
                  </p>
                </div>
              </div>
            )}
            {ropeway.ticketPrice && (
              <div className="flex items-start gap-4 rounded-xl bg-slate-50 border border-slate-200/80 p-4 sm:p-5">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-primary-gold/10 flex items-center justify-center text-primary-gold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-primary-dark/60 uppercase tracking-wide">
                    {t('ticket.price', language)}
                  </p>
                  <p className="font-bold text-primary-dark text-base sm:text-lg mt-0.5">
                    ₹{ropeway.ticketPrice.min} – ₹{ropeway.ticketPrice.max}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Route: visual A → B */}
          <div className="mb-6 sm:mb-8">
            <h3 className="text-sm font-semibold text-primary-dark/70 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="text-primary-blue" aria-hidden>🛤️</span>
              {t('route', language)}
            </h3>
            <div className="rounded-xl bg-gradient-to-r from-primary-blue/5 to-primary-gold/5 border border-primary-blue/15 p-4 sm:p-5">
              <p className="text-primary-dark/90 text-sm sm:text-base font-medium leading-relaxed">
                {getLocalizedContent(ropeway.route, language)}
              </p>
            </div>
          </div>

          {/* Stations: pills */}
          {confirmedStations.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h3 className="text-sm font-semibold text-primary-dark/70 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="text-primary-blue" aria-hidden>🚉</span>
                {t('stations', language)}
              </h3>
              <div className="flex flex-wrap gap-3">
                {confirmedStations.map((station, index) => (
                  <div
                    key={index}
                    title={station.description ? getLocalizedContent(station.description, language) : undefined}
                    className="inline-flex items-center gap-2 rounded-xl bg-white border-2 border-primary-blue/20 px-4 py-3 shadow-sm"
                  >
                    <span className="w-2 h-2 rounded-full bg-primary-blue flex-shrink-0" aria-hidden />
                    <span className="font-semibold text-primary-dark text-sm sm:text-base">{station.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Features */}
          {ropeway.features && (
            <div className="rounded-xl bg-gradient-to-br from-primary-gold/5 to-primary-saffron/5 border border-primary-gold/20 p-4 sm:p-5 md:p-6">
              <h3 className="text-sm font-semibold text-primary-dark/70 uppercase tracking-wider mb-3 flex items-center gap-2">
                <span className="text-primary-gold" aria-hidden>✨</span>
                {t('key.features', language)}
              </h3>
              <p className="text-primary-dark/85 leading-relaxed text-sm sm:text-base">
                {getLocalizedContent(ropeway.features, language)}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
