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
    <section className="mb-12">
      <div className="mb-8">
        <div className="flex items-center gap-5 mb-4">
          <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-temple flex items-center justify-center text-2xl shadow-temple">
            🗺️
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-temple mb-3 leading-tight break-words">
              {t('how.to.reach', language)}
            </h2>
            <div className="w-20 h-1 bg-gradient-temple rounded-full"></div>
          </div>
        </div>
        <p className="text-primary-dark/80 text-base sm:text-lg ml-[4.5rem] font-medium">
          {t('select.entry.point', language)}
        </p>
      </div>

      {/* Entry Points */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-primary-dark mb-5">{t('entry.points', language)}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {entryPoints.map((entryPoint, index) => (
            <button
              key={index}
              onClick={() =>
                setSelectedEntryPoint(
                  selectedEntryPoint === entryPoint.name ? null : entryPoint.name
                )
              }
              className={`w-full transition-all focus:outline-none rounded-xl ${
                selectedEntryPoint === entryPoint.name
                  ? 'ring-2 ring-primary-gold ring-offset-2'
                  : ''
              }`}
            >
              <EntryPointCard entryPoint={entryPoint} language={language} />
            </button>
          ))}
        </div>
      </div>

      {/* Routes */}
      {filteredRoutes.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-primary-dark mb-6 flex items-center gap-3">
            <span className="w-8 h-1 bg-gradient-temple rounded-full"></span>
            {selectedEntryPoint
              ? `${t('routes.from', language)} ${selectedEntryPoint}`
              : t('all.available.routes', language)}
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

