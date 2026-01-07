'use client';

import Image from 'next/image';
import { getLocalizedContent } from '@/lib/i18n';
import { t } from '@/lib/translations';
import type { LanguageCode } from '@/lib/constants';
import SectionHeader from './SectionHeader';

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
  return (
    <section className="mb-12">
      <SectionHeader
        title={getLocalizedContent(ropeway.name, language)}
        icon="🚡"
        subtitle={t('indias.first.public.ropeway', language)}
      />
      
      {/* Ropeway Image */}
      <div className="mb-6 rounded-2xl overflow-hidden shadow-temple">
        <div className="relative w-full h-64 sm:h-80 md:h-96">
          <Image
            src="https://res.cloudinary.com/dp0gqerkk/image/upload/v1767775525/ropeway_fwbcfo.webp"
            alt={getLocalizedContent(ropeway.name, language)}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
      
      <div className="card-modern rounded-2xl p-5 sm:p-6 md:p-8 shadow-temple border-l-4 border-primary-blue relative overflow-hidden">
        {/* Decorative gradient background */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-temple opacity-5 rounded-full -mr-20 -mt-20"></div>
        
        <div className="relative z-10">
          {/* Main Description */}
          <p className="text-primary-dark/90 leading-relaxed text-base sm:text-lg mb-5 sm:mb-6">
            {getLocalizedContent(ropeway.description, language)}
          </p>

          {/* Route Information */}
          <div className="bg-primary-blue/10 rounded-xl p-4 sm:p-5 md:p-6 mb-5 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-primary-dark mb-2 sm:mb-3 flex items-center gap-2">
              <span>🛤️</span> {t('route', language)}
            </h3>
            <p className="text-primary-dark/80 leading-relaxed text-sm sm:text-base">
              {getLocalizedContent(ropeway.route, language)}
            </p>
          </div>

          {/* Stations - Only show confirmed ones */}
          {ropeway.stations && ropeway.stations.filter(station => station.confirmed !== false).length > 0 && (
            <div className="mb-5 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-primary-dark mb-3 sm:mb-4 flex items-center gap-2">
                <span>🚉</span> {t('stations', language)}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {ropeway.stations
                  .filter(station => station.confirmed !== false)
                  .map((station, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-primary-blue/10 to-primary-gold/5 rounded-xl p-4 sm:p-5 border border-primary-blue/20"
                    >
                      <div className="mb-2">
                        <h4 className="font-bold text-primary-dark text-sm sm:text-base">{station.name}</h4>
                      </div>
                      {station.description && (
                        <p className="text-xs sm:text-sm text-primary-dark/70 mt-2">
                          {getLocalizedContent(station.description, language)}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Key Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
            {ropeway.openingDate && (
              <div className="bg-primary-gold/10 rounded-xl p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-primary-dark/70 mb-1 sm:mb-2 font-medium">
                  {t('opening.date', language)}
                </p>
                <p className="font-bold text-primary-dark text-sm sm:text-base">
                  {ropeway.openingDate}
                </p>
              </div>
            )}
            {ropeway.capacity && (
              <div className="bg-primary-saffron/10 rounded-xl p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-primary-dark/70 mb-1 sm:mb-2 font-medium">
                  {t('daily.capacity', language)}
                </p>
                <p className="font-bold text-primary-dark text-sm sm:text-base">
                  {ropeway.capacity}
                </p>
              </div>
            )}
            {ropeway.ticketPrice && (
              <div className="bg-primary-blue/10 rounded-xl p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-primary-dark/70 mb-1 sm:mb-2 font-medium">
                  {t('ticket.price', language)}
                </p>
                <p className="font-bold text-primary-dark text-sm sm:text-base">
                  ₹{ropeway.ticketPrice.min} - ₹{ropeway.ticketPrice.max}
                </p>
              </div>
            )}
          </div>

          {/* Features */}
          {ropeway.features && (
            <div className="bg-gradient-to-br from-primary-gold/10 to-primary-saffron/5 rounded-xl p-4 sm:p-5 md:p-6 mb-5 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-primary-dark mb-2 sm:mb-3 flex items-center gap-2">
                <span>✨</span> {t('key.features', language)}
              </h3>
              <p className="text-primary-dark/80 leading-relaxed text-sm sm:text-base">
                {getLocalizedContent(ropeway.features, language)}
              </p>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

