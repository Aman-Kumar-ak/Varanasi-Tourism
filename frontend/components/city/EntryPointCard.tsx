'use client';

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

interface EntryPointCardProps {
  entryPoint: EntryPoint;
  language: LanguageCode;
}

const entryPointIcons: Record<string, string> = {
  airport: '✈️',
  railway: '🚂',
  bus: '🚌',
};

export default function EntryPointCard({ entryPoint, language }: EntryPointCardProps) {
  const icon = entryPointIcons[entryPoint.type] || '📍';

  return (
    <div className="card-modern rounded-2xl p-6 shadow-card border-l-4 border-primary-gold h-full flex flex-col relative overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-temple opacity-5 rounded-full -mr-12 -mt-12"></div>
      
      <div className="flex items-center gap-4 flex-1 relative z-10">
        <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-temple flex items-center justify-center text-3xl shadow-temple">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-primary-dark mb-2 break-words leading-tight">
            {entryPoint.name}
          </h3>
          {entryPoint.code && (
            <div className="bg-primary-gold/10 rounded-lg px-3 py-1.5 mb-2 inline-block">
              <p className="text-sm font-semibold text-primary-dark">
                {t('code', language)}: <span className="font-mono font-bold text-primary-gold">{entryPoint.code}</span>
              </p>
            </div>
          )}
          <p className="text-sm text-primary-dark/70 capitalize font-medium">
            {entryPoint.type} {t('station', language)}
          </p>
        </div>
      </div>
    </div>
  );
}

