'use client';

import { useState } from 'react';
import EntryPointCard from './EntryPointCard';
import RouteCard from './RouteCard';
import { t } from '@/lib/translations';
import type { LanguageCode } from '@/lib/constants';

interface EntryPoint {
  type: 'airport' | 'railway' | 'bus';
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  code?: string;
}

interface Route {
  from: string;
  to: string;
  distance: number;
  duration: number;
  transportOptions: Array<{
    type: string;
    priceRange: {
      min: number;
      max: number;
    };
    estimatedTime: number;
    tips?: {
      en: string;
      hi: string;
      [key: string]: string;
    };
  }>;
  routeDescription?: {
    en: string;
    hi: string;
    [key: string]: string;
  };
}

interface RoutePlannerProps {
  entryPoints: EntryPoint[];
  routes: Route[];
  language: LanguageCode;
}

export default function RoutePlanner({
  entryPoints,
  routes,
  language,
}: RoutePlannerProps) {
  const [selectedEntryPoint, setSelectedEntryPoint] = useState<string | null>(null);

  if (!entryPoints || entryPoints.length === 0) {
    return null;
  }

  const filteredRoutes = selectedEntryPoint
    ? routes.filter((route) => route.from === selectedEntryPoint)
    : routes;

  return (
    <section className="mb-10 sm:mb-12">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4 md:gap-5 mb-3 sm:mb-4">
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gradient-temple flex items-center justify-center text-xl sm:text-2xl shadow-temple">
            🗺️
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gradient-temple mb-2 sm:mb-3 leading-tight break-words">
              {t('how.to.reach', language)}
            </h2>
            <div className="w-12 sm:w-16 md:w-20 h-0.5 sm:h-1 bg-gradient-temple rounded-full"></div>
          </div>
        </div>
        <p className="text-primary-dark/80 text-xs sm:text-sm md:text-base lg:text-lg ml-0 sm:ml-12 md:ml-[4.5rem] font-medium px-1 sm:px-0">
          {t('select.entry.point', language)}
        </p>
      </div>

      {/* Entry Points */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-lg sm:text-xl font-bold text-primary-dark mb-4 sm:mb-5">{t('entry.points', language)}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {entryPoints.map((entryPoint, index) => (
            <div
              key={index}
              onClick={() =>
                setSelectedEntryPoint(
                  selectedEntryPoint === entryPoint.name ? null : entryPoint.name
                )
              }
              className={`w-full transition-all cursor-pointer rounded-xl touch-manipulation ${
                selectedEntryPoint === entryPoint.name
                  ? 'ring-2 ring-primary-gold ring-offset-2'
                  : ''
              }`}
            >
              <EntryPointCard entryPoint={entryPoint} language={language} />
            </div>
          ))}
        </div>
      </div>

      {/* Routes */}
      {filteredRoutes.length > 0 && (
        <div>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary-dark mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
            <span className="w-6 sm:w-8 h-0.5 sm:h-1 bg-gradient-temple rounded-full"></span>
            <span className="break-words">
              {selectedEntryPoint
                ? `${t('routes.from', language)} ${selectedEntryPoint}`
                : t('all.available.routes', language)}
            </span>
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {filteredRoutes.map((route, index) => (
              <RouteCard key={index} route={route} language={language} />
            ))}
          </div>
        </div>
      )}

      {selectedEntryPoint && filteredRoutes.length === 0 && (
        <div className="bg-white rounded-xl p-8 text-center shadow-lg">
          <p className="text-primary-dark/70">
            No routes available from {selectedEntryPoint} yet. Check back soon!
          </p>
        </div>
      )}
    </section>
  );
}

