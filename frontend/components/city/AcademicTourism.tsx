'use client';

import { getLocalizedContent } from '@/lib/i18n';
import { t } from '@/lib/translations';
import type { LanguageCode } from '@/lib/constants';
import SectionHeader from './SectionHeader';

interface AcademicInstitution {
  name: string;
  type: 'university' | 'college' | 'institute' | 'research';
  description: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  address: string;
  contact?: string;
  website?: string;
  campusTour?: boolean;
  notableFeatures?: {
    en: string;
    hi: string;
    [key: string]: string;
  };
}

interface AcademicTourismProps {
  institutions: AcademicInstitution[];
  language: LanguageCode;
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'university':
      return '🎓';
    case 'college':
      return '📚';
    case 'institute':
      return '🔬';
    case 'research':
      return '🔭';
    default:
      return '🏛️';
  }
}

export default function AcademicTourism({ institutions, language }: AcademicTourismProps) {
  return (
    <section className="mb-12">
      <SectionHeader
        title={t('academic.tourism', language)}
        icon="🎓"
        subtitle={t('universities.institutes', language)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        {institutions.map((institution, index) => (
          <div
            key={index}
            className="card-modern rounded-2xl p-5 sm:p-6 shadow-temple border-l-4 border-primary-blue h-full flex flex-col relative overflow-hidden group hover:shadow-xl transition-all duration-300"
          >
            {/* Decorative gradient background */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-temple opacity-5 rounded-full -mr-12 -mt-12 group-hover:opacity-10 transition-opacity"></div>
            
            {/* Type Icon */}
            <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-temple flex items-center justify-center text-2xl sm:text-3xl shadow-temple mb-3 sm:mb-4 relative z-10">
              {getTypeIcon(institution.type)}
            </div>

            {/* Name */}
            <h3 className="text-lg sm:text-xl font-bold text-primary-dark mb-2 sm:mb-3 relative z-10" style={{ lineHeight: '1.5' }}>
              {institution.name}
            </h3>

            {/* Type Badge */}
            <div className="mb-3 relative z-10">
              <p className="text-sm text-primary-blue font-bold bg-primary-blue/10 rounded-lg px-3 py-1.5 inline-block capitalize">
                {institution.type}
              </p>
            </div>

            {/* Description */}
            <p className="text-primary-dark/90 text-sm leading-relaxed mb-4 relative z-10 flex-grow">
              {getLocalizedContent(institution.description, language)}
            </p>

            {/* Notable Features */}
            {institution.notableFeatures && (
              <div className="mb-4 relative z-10">
                <h4 className="text-sm font-bold text-primary-dark mb-2">
                  {t('notable.features', language)}:
                </h4>
                <p className="text-sm text-primary-dark/80 leading-relaxed">
                  {getLocalizedContent(institution.notableFeatures, language)}
                </p>
              </div>
            )}

            {/* Address */}
            <div className="mb-4 relative z-10">
              <p className="text-sm text-primary-dark/70 flex items-start gap-2 leading-relaxed">
                <span className="flex-shrink-0 text-lg">📍</span>
                <span>{institution.address}</span>
              </p>
            </div>

            {/* Campus Tour Badge */}
            {institution.campusTour && (
              <div className="mb-3 sm:mb-4 relative z-10">
                <div className="bg-primary-gold/10 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 inline-block min-h-[44px] flex items-center">
                  <p className="text-xs sm:text-sm text-primary-gold font-bold flex items-center gap-2">
                    <span>👥</span> {t('campus.tours.available', language)}
                  </p>
                </div>
              </div>
            )}

            {/* Contact and Website */}
            <div className="mt-auto space-y-2 relative z-10">
              {institution.contact && (
                <p className="text-sm text-primary-dark/80 break-all flex items-center gap-2">
                  <span className="text-primary-blue">📞</span>
                  <span>{institution.contact}</span>
                </p>
              )}
              {institution.website && (
                <a
                  href={institution.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-blue font-semibold break-all flex items-center gap-1 hover:underline py-2 px-2 -mx-2 rounded-lg hover:bg-primary-blue/5 transition-colors touch-manipulation min-h-[44px]"
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

