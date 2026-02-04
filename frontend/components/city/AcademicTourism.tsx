'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getLocalizedContent } from '@/lib/i18n';
import { t } from '@/lib/translations';
import type { LanguageCode } from '@/lib/constants';
import SectionHeader from './SectionHeader';
import { ACCORDION_RESTORE_KEYS, getRestoredAccordionIndex, saveAccordionIndex } from '@/lib/accordionRestore';

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
  image?: string;
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

const HIGHLIGHT_INTERVAL_MS = 1900;

export default function AcademicTourism({ institutions, language }: AcademicTourismProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [highlightStep, setHighlightStep] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasRestoredRef = useRef(false);

  useEffect(() => {
    if (!institutions?.length || hasRestoredRef.current) return;
    hasRestoredRef.current = true;
    const idx = getRestoredAccordionIndex(ACCORDION_RESTORE_KEYS.academic);
    if (idx != null && idx >= 0 && idx < institutions.length) setExpandedIndex(idx);
  }, [institutions?.length, institutions]);

  useEffect(() => {
    saveAccordionIndex(ACCORDION_RESTORE_KEYS.academic, expandedIndex);
  }, [expandedIndex]);

  const closedIndices = institutions.map((_, i) => i).filter((i) => expandedIndex !== i);
  const highlightedIndex = closedIndices.length > 0 ? closedIndices[highlightStep % closedIndices.length] : -1;
  useEffect(() => {
    if (closedIndices.length <= 1) return;
    const t = setInterval(() => setHighlightStep((s) => s + 1), HIGHLIGHT_INTERVAL_MS);
    return () => clearInterval(t);
  }, [closedIndices.length]);

  useEffect(() => {
    if (expandedIndex == null) return;
    const el = cardRefs.current[expandedIndex];
    if (el) {
      const timeoutId = window.setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
      return () => window.clearTimeout(timeoutId);
    }
  }, [expandedIndex]);

  const featuredInstitution = institutions[selectedIndex];

  return (
    <section className="mb-12">
      <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#FDF6ED] via-[#F5E6D8] to-[#FFF8E7] border border-amber-200/50 shadow-xl shadow-amber-900/5 p-4 sm:p-6 lg:p-8">
        <SectionHeader title={t('academic.tourism', language)} icon="🎓" subtitle={t('universities.institutes', language)} />
        {/* Mobile: accordion (blue accent) – clear division */}
        <div className="sm:hidden rounded-2xl overflow-hidden border-2 border-blue-200/90 bg-white shadow-sm divide-y divide-blue-200/80">
        {institutions.map((institution, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <div
              key={index}
              ref={(el) => { cardRefs.current[index] = el; }}
              className="bg-white first:rounded-t-2xl last:rounded-b-2xl scroll-mt-20 sm:scroll-mt-24"
            >
              <button
                type="button"
                onClick={() => setExpandedIndex((prev) => (prev === index ? null : index))}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left bg-white hover:bg-blue-50/50 active:bg-blue-50 transition-colors touch-manipulation ${!isExpanded && index === highlightedIndex ? 'accordion-highlight-academic' : ''}`}
              >
                <div className="w-12 h-12 rounded-xl bg-primary-blue/10 flex items-center justify-center text-xl flex-shrink-0">{getTypeIcon(institution.type)}</div>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-primary-dark text-sm break-words text-left block">{institution.name}</span>
                  <span className="text-xs text-primary-blue font-semibold capitalize block mt-0.5">{institution.type}</span>
                </div>
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-blue/10 flex items-center justify-center text-primary-blue">
                  {isExpanded ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>}
                </span>
              </button>
              <div
                className={`accordion-panel-smooth overflow-hidden transition-[max-height,opacity] duration-300 ease-out sm:transition-none ${
                  isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
                aria-hidden={!isExpanded}
              >
                <div className="px-4 pb-4 pt-0 space-y-3 bg-blue-50/30 border-t border-blue-100">
                  <p className="text-primary-dark/90 text-sm leading-relaxed">{getLocalizedContent(institution.description, language)}</p>
                  {institution.notableFeatures && <p className="text-xs text-primary-dark/80">{getLocalizedContent(institution.notableFeatures, language)}</p>}
                  <p className="text-xs text-primary-dark/70">📍 {institution.address}</p>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                    {institution.campusTour && <span className="text-xs font-semibold text-primary-gold">👥 {t('campus.tours.available', language)}</span>}
                    {institution.website && <a href={institution.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-blue font-semibold hover:underline">Visit website →</a>}
                  </div>
                  {institution.contact && <p className="text-xs text-primary-dark/80">📞 {institution.contact}</p>}
                </div>
              </div>
            </div>
          );
        })}
        </div>
        {/* Desktop: featured institution (left) + Quick View sidebar (right) – like Places to Visit */}
        <div className="hidden sm:grid sm:grid-cols-12 gap-6 lg:gap-8 items-start">
        <div className="sm:col-span-7 lg:col-span-8 w-full">
          {featuredInstitution && (
            <div className="rounded-2xl overflow-hidden border border-amber-200/70 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
              <div className="h-1 w-full bg-gradient-to-r from-primary-saffron via-primary-gold to-primary-saffron flex-shrink-0" aria-hidden />
              {featuredInstitution.image ? (
                <div className="relative w-full h-72 sm:h-80 lg:h-96 overflow-hidden">
                  <Image src={featuredInstitution.image} alt={featuredInstitution.name} fill sizes="(min-width: 1024px) 66vw, (min-width: 640px) 58vw, 100vw" className="object-cover" />
                  <h3 className="absolute top-4 left-4 right-4 text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] break-words z-10">{featuredInstitution.name}</h3>
                </div>
              ) : (
                <div className="relative w-full h-72 sm:h-80 lg:h-96 bg-gradient-to-br from-primary-blue/15 via-blue-100/30 to-primary-blue/15 flex items-center justify-center">
                  <span className="text-6xl sm:text-7xl opacity-40 absolute" aria-hidden>{getTypeIcon(featuredInstitution.type)}</span>
                  <h3 className="absolute top-4 left-4 right-4 text-lg sm:text-xl md:text-2xl font-bold text-primary-dark drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)] break-words z-10">{featuredInstitution.name}</h3>
                </div>
              )}
              <div className="rounded-t-none border-t-0 p-5 sm:p-6 md:p-8 bg-white/98 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                <p className="text-primary-dark/90 text-sm leading-relaxed mb-4">{getLocalizedContent(featuredInstitution.description, language)}</p>
                {featuredInstitution.notableFeatures && (
                  <div className="mb-4">
                    <h4 className="text-sm font-bold text-primary-dark mb-2">{t('notable.features', language)}:</h4>
                    <p className="text-sm text-primary-dark/80 leading-relaxed">{getLocalizedContent(featuredInstitution.notableFeatures, language)}</p>
                  </div>
                )}
                <p className="text-sm text-primary-dark/70 flex items-start gap-2 mb-4">📍 {featuredInstitution.address}</p>
                {featuredInstitution.campusTour && <p className="text-xs sm:text-sm text-primary-gold font-bold mb-4">👥 {t('campus.tours.available', language)}</p>}
                <div className="space-y-2">
                  {featuredInstitution.contact && <p className="text-sm text-primary-dark/80 break-all">📞 {featuredInstitution.contact}</p>}
                  {featuredInstitution.website && <a href={featuredInstitution.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-blue font-semibold hover:underline">Visit website →</a>}
                </div>
              </div>
            </div>
          )}
        </div>
        <aside className="sm:col-span-5 lg:col-span-4 w-full">
          <div className="sticky top-4 rounded-2xl overflow-hidden premium-card border border-amber-200/70 flex flex-col">
            <div className="h-1 w-full bg-gradient-to-r from-primary-saffron via-primary-gold to-primary-saffron flex-shrink-0" aria-hidden />
            <div className="flex flex-col p-4 sm:p-5">
              <header className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-primary-saffron font-semibold">
                    {language === 'hi' ? 'त्वरित दृश्य' : 'Quick view'}
                  </p>
                  <h3 className="text-base sm:text-lg font-bold text-premium-section-text mt-0.5">
                    {language === 'hi' ? 'अन्य संस्थान' : 'More institutions'}
                  </h3>
                </div>
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-saffron/10 border border-amber-200/70 flex items-center justify-center text-primary-saffron">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </header>
              <div className="space-y-2">
                {institutions.map((institution, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedIndex(index)}
                      className={`w-full text-left rounded-xl border-2 px-4 py-3 min-h-[52px] flex items-start justify-between gap-2 transition-colors duration-200 ${
                        isSelected ? 'border-primary-saffron/60 bg-amber-50/80 text-premium-section-text shadow-sm' : 'border-slate-200/80 bg-white hover:border-primary-saffron/30 hover:bg-amber-50/50 text-premium-section-text/90'
                      }`}
                    >
                      <div className="min-w-0 flex-1 flex flex-col items-start gap-0.5">
                        <span className="font-semibold text-sm sm:text-base text-primary-dark leading-snug break-words text-left">{institution.name}</span>
                        <span className="text-xs text-primary-saffron font-medium capitalize">{institution.type}</span>
                      </div>
                      <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                        {isSelected ? (
                          <svg className="w-3.5 h-3.5 text-primary-saffron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        ) : (
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>
        </div>
      </div>
    </section>
  );
}

