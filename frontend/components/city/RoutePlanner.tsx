'use client';

import { useState, useEffect, useRef } from 'react';
import EntryPointCard from './EntryPointCard';
import RouteCard from './RouteCard';
import { t } from '@/lib/translations';
import type { LanguageCode } from '@/lib/constants';
import { getIconComponent } from '@/lib/iconMapping';

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
  const [selectedTransportType, setSelectedTransportType] = useState<string | null>(null);
  const routesRef = useRef<HTMLDivElement>(null);

  // Get all unique transportation types from all routes
  const allTransportTypes = Array.from(
    new Set(
      routes.flatMap((route) => route.transportOptions.map((option) => option.type))
    )
  ).sort();

  // Scroll to routes section when filter is applied
  useEffect(() => {
    if (selectedTransportType && routesRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        routesRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }, 100);
    }
  }, [selectedTransportType, selectedEntryPoint]);

  if (!entryPoints || entryPoints.length === 0) {
    return null;
  }

  // Filter routes by entry point
  let filteredRoutes = selectedEntryPoint
    ? routes.filter((route) => route.from === selectedEntryPoint)
    : routes;

  // Filter routes by transportation type if selected
  if (selectedTransportType) {
    filteredRoutes = filteredRoutes.map((route) => ({
      ...route,
      transportOptions: route.transportOptions.filter(
        (option) => option.type === selectedTransportType
      ),
    })).filter((route) => route.transportOptions.length > 0);
  }

  return (
    <section className="mb-6 sm:mb-10 md:mb-12">
      <div className="mb-4 sm:mb-6 md:mb-8">
        <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
          {/* Compact icon */}
          <div className="flex-shrink-0 mt-0.5 sm:mt-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-gradient-temple flex items-center justify-center text-white shadow-md">
              {(() => {
                const IconComponent = getIconComponent('🗺️');
                return IconComponent ? <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" /> : null;
              })()}
            </div>
          </div>
          
          {/* Title and subtitle - compact and integrated */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3 gap-0.5 sm:gap-1">
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gradient-temple leading-tight break-words" style={{ lineHeight: '1.5' }}>
                {t('how.to.reach', language)}
              </h2>
              <p className="text-primary-dark/70 text-xs sm:text-sm md:text-base lg:text-lg font-normal leading-relaxed">
                {t('select.entry.point', language)}
              </p>
            </div>
            
            {/* Minimal decorative line */}
            <div className="mt-1.5 sm:mt-2 h-0.5 w-10 sm:w-12 md:w-16 bg-gradient-temple rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Entry Points - Horizontal scroll on mobile */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-sm sm:text-lg font-bold text-primary-dark mb-2 sm:mb-4">{t('entry.points', language)}</h3>
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 pt-2 sm:pt-0 px-1 sm:px-0 -mx-1 sm:mx-0 scrollbar-hide">
          {entryPoints.map((entryPoint, index) => (
            <div
              key={index}
              onClick={() =>
                setSelectedEntryPoint(
                  selectedEntryPoint === entryPoint.name ? null : entryPoint.name
                )
              }
              className={`flex-shrink-0 sm:flex-shrink w-[85vw] sm:w-full max-w-[320px] sm:max-w-none transition-all cursor-pointer rounded-xl touch-manipulation ${
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

      {/* Transportation Type Filter - Compact on mobile */}
      {allTransportTypes.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <h3 className="text-sm sm:text-base font-bold text-primary-dark mb-2 sm:mb-3">
            {t('filter.by.transport', language) || 'Filter by Transportation'}
          </h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 sm:gap-3">
            <button
              onClick={() => {
                setSelectedTransportType(null);
                // Scroll to routes after clearing filter
                setTimeout(() => {
                  routesRef.current?.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                  });
                }, 100);
              }}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium text-xs sm:text-sm md:text-base transition-all ${
                selectedTransportType === null
                  ? 'bg-gradient-temple text-white'
                  : 'bg-white text-primary-dark border border-primary-gold/30 hover:border-primary-gold/50'
              }`}
            >
              {t('all.transport', language) || 'All'}
            </button>
            {allTransportTypes.map((type) => {
              const IconComponent = getIconComponent(
                type === 'taxi' ? '🚕' :
                type === 'auto' ? '🛺' :
                type === 'rickshaw' ? '🛺' :
                type === 'bus' ? '🚌' :
                type === 'metro' ? '🚇' :
                type === 'boat' ? '⛵' : '🚗'
              );
              return (
                <button
                  key={type}
                  onClick={() => setSelectedTransportType(type)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium text-xs sm:text-sm md:text-base transition-all flex items-center gap-1.5 sm:gap-2 ${
                    selectedTransportType === type
                      ? 'bg-gradient-temple text-white'
                      : 'bg-white text-primary-dark border border-primary-gold/30 hover:border-primary-gold/50'
                  }`}
                >
                  {IconComponent && (
                    <IconComponent className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                  <span className="capitalize">{type}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Routes */}
      {filteredRoutes.length > 0 && (
        <div ref={routesRef}>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-primary-dark mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
            <span className="w-6 sm:w-8 h-0.5 sm:h-1 bg-gradient-temple rounded-full"></span>
            <span className="break-words">
              {selectedEntryPoint
                ? `${t('routes.from', language)} ${selectedEntryPoint}`
                : t('all.available.routes', language)}
              {selectedTransportType && ` - ${selectedTransportType.charAt(0).toUpperCase() + selectedTransportType.slice(1)}`}
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

