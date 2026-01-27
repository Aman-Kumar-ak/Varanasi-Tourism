'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';
import SectionHeader from './SectionHeader';
import type { LanguageCode } from '@/lib/constants';

interface Restaurant {
  name: string;
  cuisine?: string;
  address?: string;
  contact?: string;
  specialty?: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  image?: string;
}

interface CuisineSectionProps {
  restaurants: Restaurant[];
  language: LanguageCode;
}

export default function CuisineSection({ restaurants, language }: CuisineSectionProps) {
  if (!restaurants || restaurants.length === 0) {
    return null;
  }

  return (
    <section className="mb-12" id="cuisine">
      <SectionHeader
        title={t('cuisine.title', language)}
        icon="🍽️"
        subtitle={t('cuisine.subtitle', language)}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {restaurants.map((restaurant, index) => (
          <div
            key={index}
            className="card-modern rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-none sm:shadow-card border-l-4 border-primary-saffron h-full flex flex-col relative overflow-hidden group hover:shadow-xl transition-all duration-300"
          >
            {/* Decorative gradient background */}
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-temple opacity-5 rounded-full -mr-10 -mt-10 sm:-mr-12 sm:-mt-12 group-hover:opacity-10 transition-opacity"></div>
            
            {/* Header: Name */}
            <div className="mb-3 sm:mb-4 relative z-10">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-primary-dark" style={{ lineHeight: '1.4' }}>
                {restaurant.name}
              </h3>
            </div>
            
            {/* Cuisine Badge */}
            {restaurant.cuisine && (
              <div className="mb-3 sm:mb-4 relative z-10">
                <p className="text-xs sm:text-sm text-primary-saffron font-bold bg-primary-saffron/10 rounded-md sm:rounded-lg px-3 py-1.5 inline-block">
                  {restaurant.cuisine}
                </p>
              </div>
            )}

            {/* Specialty */}
            {restaurant.specialty && (
              <div className="mb-3 sm:mb-4 relative z-10 flex-grow">
                <p className="text-sm sm:text-base text-primary-dark/80 leading-relaxed">
                  {restaurant.specialty[language] || restaurant.specialty.en}
                </p>
              </div>
            )}
            
            {/* Address */}
            {restaurant.address && (
              <div className="mb-2 sm:mb-3 relative z-10">
                <p className="text-xs sm:text-sm md:text-base text-primary-dark/70 flex items-start gap-1.5 sm:gap-2 leading-relaxed">
                  <span className="flex-shrink-0 text-sm sm:text-base md:text-lg">📍</span>
                  <span className="break-words">{restaurant.address}</span>
                </p>
              </div>
            )}
            
            {/* Contact */}
            {restaurant.contact && (
              <div className="relative z-10">
                <p className="text-xs sm:text-sm text-primary-dark/80 break-all flex items-center gap-1.5 sm:gap-2">
                  <span className="text-primary-saffron text-sm sm:text-base">📞</span>
                  <span className="truncate sm:break-all">{restaurant.contact}</span>
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
