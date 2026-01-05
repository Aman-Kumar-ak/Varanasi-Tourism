'use client';

import Link from 'next/link';
import { getLocalizedContent } from '@/lib/i18n';
import { formatCurrency } from '@/lib/utils';
import type { LanguageCode } from '@/lib/constants';

interface DarshanType {
  _id: string;
  name: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  price: number;
  duration: number;
  dailyLimit: number;
  description?: {
    en: string;
    hi: string;
    [key: string]: string;
  };
}

interface DarshanInfoSectionProps {
  darshanTypes: DarshanType[];
  bookingEnabled: boolean;
  officialBookingUrl?: string;
  language: LanguageCode;
  templeSlug?: string;
}

export default function DarshanInfoSection({
  darshanTypes,
  bookingEnabled,
  officialBookingUrl,
  language,
  templeSlug,
}: DarshanInfoSectionProps) {
  if (darshanTypes.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center shadow-lg">
        <div className="text-5xl mb-4">📿</div>
        <p className="text-primary-dark/70 mb-2 text-lg">
          No darshan types available yet.
        </p>
        <p className="text-sm text-primary-dark/50">
          Please check back later or contact the temple office.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary-dark mb-2">
          List of Pooja / Darshan
        </h2>
        {!bookingEnabled && (
          <p className="text-sm text-primary-dark/70">
            Booking information - Please use official temple trust website for bookings
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {darshanTypes.map((type) => (
          <div
            key={type._id}
            className={`${
              bookingEnabled
                ? 'bg-primary-orange hover:bg-primary-orange/90 text-white'
                : 'bg-primary-orange/90 text-white'
            } rounded-lg p-6 transition-all duration-200 shadow-md h-full`}
          >
            <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center mt-1">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="flex-grow min-w-0">
                <h3 className="font-bold text-lg sm:text-xl mb-2 break-words leading-tight">
                  {getLocalizedContent(type.name, language)}
                </h3>
                {type.description && (
                  <p className="text-white/90 text-sm mb-4 leading-relaxed">
                    {getLocalizedContent(type.description, language)}
                  </p>
                )}
                <div className="flex items-center justify-between pt-4 border-t border-white/20">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <span>⏱️</span>
                      <span>{type.duration} min</span>
                    </span>
                    {type.dailyLimit && (
                      <span className="flex items-center gap-1">
                        <span>👥</span>
                        <span>{type.dailyLimit.toLocaleString()}/day</span>
                      </span>
                    )}
                  </div>
                  <span className="text-2xl font-bold bg-white/20 px-4 py-2 rounded-lg">
                    {formatCurrency(type.price)}
                  </span>
                </div>
                {!bookingEnabled && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <p className="text-sm text-white/80 text-center">
                      📋 Booking available through official temple trust website
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!bookingEnabled && officialBookingUrl && (
        <div className="bg-primary-gold/10 border border-primary-gold/30 rounded-xl p-6 text-center">
          <h3 className="text-lg font-bold text-primary-dark mb-2">
            Official Booking Website
          </h3>
          <p className="text-primary-dark/70 mb-4 text-sm">
            For booking darshan, please visit the official temple trust website
          </p>
          <a
            href={officialBookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-primary-gold text-white rounded-lg font-medium"
          >
            Visit Official Booking Site →
          </a>
        </div>
      )}

      {!bookingEnabled && !officialBookingUrl && (
        <div className="bg-primary-blue/10 border border-primary-blue/30 rounded-xl p-6 text-center">
          <p className="text-primary-dark/70 text-sm">
            📋 Booking information will be available soon. Please contact the temple office for
            darshan bookings.
          </p>
        </div>
      )}
    </div>
  );
}

