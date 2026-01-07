'use client';

import { getLocalizedContent } from '@/lib/i18n';
import { t } from '@/lib/translations';
import type { LanguageCode } from '@/lib/constants';
import SectionHeader from './SectionHeader';

interface Event {
  name: string;
  date: string;
  endDate?: string;
  type: 'festival' | 'cultural' | 'sports' | 'academic' | 'exhibition' | 'performance';
  description: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  venue?: string;
  website?: string;
  contact?: string;
}

interface EventsCalendarProps {
  events: Event[];
  language: LanguageCode;
}

function getEventTypeColor(type: string) {
  switch (type) {
    case 'festival':
      return 'bg-gradient-temple';
    case 'cultural':
      return 'bg-primary-blue';
    case 'sports':
      return 'bg-primary-saffron';
    case 'academic':
      return 'bg-primary-gold';
    case 'exhibition':
      return 'bg-primary-maroon';
    case 'performance':
      return 'bg-gradient-to-r from-purple-500 to-pink-500';
    default:
      return 'bg-gray-500';
  }
}

function getEventTypeIcon(type: string) {
  switch (type) {
    case 'festival':
      return '🎉';
    case 'cultural':
      return '🎭';
    case 'sports':
      return '⚽';
    case 'academic':
      return '🎓';
    case 'exhibition':
      return '🎨';
    case 'performance':
      return '🎪';
    default:
      return '📅';
  }
}

export default function EventsCalendar({ events, language }: EventsCalendarProps) {
  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB;
  });

  return (
    <section className="mb-12">
      <SectionHeader
        title={t('events.calendar', language)}
        icon="📅"
        subtitle={t('upcoming.events.festivals', language)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        {sortedEvents.map((event, index) => (
          <div
            key={index}
            className="card-modern rounded-2xl p-5 sm:p-6 shadow-temple border-l-4 border-primary-gold relative overflow-hidden h-full flex flex-col group hover:shadow-xl transition-all duration-300"
          >
            {/* Decorative gradient background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-temple opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-10 transition-opacity"></div>
            
            {/* Event Type Badge */}
            <div className={`${getEventTypeColor(event.type)} text-white px-3 py-1.5 rounded-lg text-xs font-bold inline-block mb-4 relative z-10`}>
              {getEventTypeIcon(event.type)} {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </div>

            {/* Event Icon */}
            <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-temple flex items-center justify-center text-2xl sm:text-3xl shadow-temple mb-3 sm:mb-4 relative z-10">
              {getEventTypeIcon(event.type)}
            </div>

            {/* Event Name */}
            <h3 className="text-lg sm:text-xl font-bold text-primary-dark mb-2 sm:mb-3 leading-tight relative z-10">
              {event.name}
            </h3>

            {/* Date */}
            <div className="bg-primary-gold/10 rounded-lg px-3 py-2 mb-4 relative z-10">
              <p className="text-sm text-primary-gold font-bold flex items-center gap-2">
                <span>📅</span>
                {event.endDate ? `${event.date} - ${event.endDate}` : event.date}
              </p>
            </div>

            {/* Venue */}
            {event.venue && (
              <div className="mb-4 relative z-10">
                <p className="text-sm text-primary-dark/70 flex items-start gap-2">
                  <span className="flex-shrink-0 text-lg">📍</span>
                  <span>{event.venue}</span>
                </p>
              </div>
            )}

            {/* Description */}
            <p className="text-primary-dark/90 text-sm leading-relaxed relative z-10 flex-grow mb-4">
              {getLocalizedContent(event.description, language)}
            </p>

            {/* Links */}
            <div className="mt-auto space-y-2 relative z-10">
              {event.website && (
                <a
                  href={event.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-gold font-semibold flex items-center gap-1 hover:underline py-2 px-2 -mx-2 rounded-lg hover:bg-primary-gold/5 transition-colors touch-manipulation min-h-[44px]"
                >
                  Visit Website <span>→</span>
                </a>
              )}
              {event.contact && (
                <p className="text-sm text-primary-dark/80 break-all flex items-center gap-2">
                  <span className="text-primary-gold">📞</span>
                  <span>{event.contact}</span>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

