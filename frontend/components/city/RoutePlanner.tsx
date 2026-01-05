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
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-dark mb-2">
          🗺️ {t('how.to.reach', language)}
        </h2>
        <p className="text-primary-dark/70 text-base">
          {t('select.entry.point', language)}
        </p>
      </div>

      {/* Entry Points */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-primary-dark mb-4">{t('entry.points', language)}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  ? 'ring-2 ring-primary-orange ring-offset-2'
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
          <h3 className="text-xl font-bold text-primary-dark mb-4">
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

