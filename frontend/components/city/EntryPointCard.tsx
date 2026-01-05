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
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-primary-blue/5 h-full flex flex-col">
      <div className="flex items-start gap-4 flex-1">
        <div className="text-4xl flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-primary-dark mb-1 break-words">
            {entryPoint.name}
          </h3>
          {entryPoint.code && (
            <p className="text-base text-primary-dark/60 mb-2">
              {t('code', language)} <span className="font-mono font-semibold">{entryPoint.code}</span>
            </p>
          )}
          <p className="text-sm text-primary-dark/50 capitalize">
            {entryPoint.type} {t('station', language)}
          </p>
        </div>
      </div>
    </div>
  );
}

