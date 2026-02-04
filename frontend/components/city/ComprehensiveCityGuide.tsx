'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SafeImage from '@/components/common/SafeImage';
import { getLocalizedContent } from '@/lib/i18n';
import { getOptimizedVideoUrl, getVideoThumbnail } from '@/lib/cloudinary';
import { t } from '@/lib/translations';
import type { LanguageCode } from '@/lib/constants';
import SectionHeader from './SectionHeader';
import PlacesCarousel from './PlacesCarousel';
import TransportationGuide from './TransportationGuide';
import RoutePlanner from './RoutePlanner';
import KashiRopeway from './KashiRopeway';
import CricketStadium from './CricketStadium';
import WellnessRetreats from './WellnessRetreats';
import AcademicTourism from './AcademicTourism';
import QuotesSection from './QuotesSection';
import CuisineSection from './CuisineSection';
import PlacesToStay from './PlacesToStay';
import ContentModal from './ContentModal';
import { ACCORDION_RESTORE_KEYS, getRestoredAccordionIndex, saveAccordionIndex } from '@/lib/accordionRestore';

/** Show more content in the card when space allows; "Know More" only when content is actually truncated. */
const PREVIEW_CHARS = 480;

function truncateForPreview(text: string, maxChars: number = PREVIEW_CHARS): { text: string; truncated: boolean } {
  const trimmed = (text || '').trim();
  if (trimmed.length <= maxChars) return { text: trimmed, truncated: false };
  const cut = trimmed.slice(0, maxChars);
  const lastSpace = cut.lastIndexOf(' ');
  const end = lastSpace > maxChars * 0.6 ? lastSpace : maxChars;
  return { text: cut.slice(0, end).trim() + '…', truncated: true };
}

interface City {
  _id: string;
  name: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  state: string;
  images: string[];
  videos?: string[];
  places: any[];
  hotels: any[];
  restaurants: any[];
  transportInfo: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  emergencyContacts: Array<{
    name: string;
    phone: string;
    type: 'police' | 'hospital' | 'temple' | 'tourist-helpline';
  }>;
  weatherInfo?: {
    bestTimeToVisit: string;
    averageTemp: string;
  };
  jyotirlingaId?: {
    _id: string;
    name: {
      en: string;
      hi: string;
      [key: string]: string;
    };
    slug: string;
  };
  // New fields
  bookingEnabled?: boolean;
  officialBookingUrl?: string;
  spiritualSignificance?: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  history?: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  festivals?: Array<{
    name: string;
    date: string;
    description: {
      en: string;
      hi: string;
      [key: string]: string;
    };
    image?: string;
  }>;
  rituals?: Array<{
    name: {
      en: string;
      hi: string;
      [key: string]: string;
    };
    description: {
      en: string;
      hi: string;
      [key: string]: string;
    };
    timing?: string;
    image?: string;
    imageId?: string;
  }>;
  darshanInfo?: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  entryPoints?: any[];
  transportOptions?: any[];
  routes?: any[];
  transportTips?: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  // New features
  events?: Array<{
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
  }>;
  kashiRopeway?: {
    name: {
      en: string;
      hi: string;
      [key: string]: string;
    };
    description: {
      en: string;
      hi: string;
      [key: string]: string;
    };
    route: {
      en: string;
      hi: string;
      [key: string]: string;
    };
    stations: Array<{
      name: string;
      description?: {
        en: string;
        hi: string;
        [key: string]: string;
      };
    }>;
    openingDate?: string;
    capacity?: string;
    ticketPrice?: {
      min: number;
      max: number;
      currency: string;
    };
    features?: {
      en: string;
      hi: string;
      [key: string]: string;
    };
    location?: {
      lat: number;
      lng: number;
    };
  };
  cricketStadium?: {
    name: {
      en: string;
      hi: string;
      [key: string]: string;
    };
    description: {
      en: string;
      hi: string;
      [key: string]: string;
    };
    capacity: string;
    openingDate?: string;
    features?: {
      en: string;
      hi: string;
      [key: string]: string;
    };
    location?: {
      lat: number;
      lng: number;
    };
    tourInfo?: {
      en: string;
      hi: string;
      [key: string]: string;
    };
    contact?: string;
  };
  wellnessCenters?: Array<{
    name: string;
    type: 'yoga' | 'meditation' | 'ayurveda' | 'spa' | 'retreat';
    description: {
      en: string;
      hi: string;
      [key: string]: string;
    };
    address: string;
    contact?: string;
    website?: string;
    priceRange?: 'budget' | 'mid-range' | 'luxury';
    rating?: number;
  }>;
  academicInstitutions?: Array<{
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
  }>;
}

interface ComprehensiveCityGuideProps {
  city: City;
  language: LanguageCode;
  /** URL slug for the city (e.g. varanasi) used for Explore more link */
  citySlug?: string;
  quotes?: Array<{
    _id: string;
    quote: {
      en: string;
      hi: string;
      [key: string]: string;
    };
    author: string;
    source?: {
      en: string;
      hi: string;
      [key: string]: string;
    };
    image: string;
    order: number;
  }>;
}

function getPriceRangeLabel(range: string) {
  switch (range) {
    case 'budget':
      return '₹';
    case 'mid-range':
      return '₹₹';
    case 'luxury':
      return '₹₹₹';
    default:
      return '';
  }
}

function getPriceRangeColor(range: string) {
  switch (range) {
    case 'budget':
      return 'bg-primary-gold';
      case 'mid-range':
      return 'bg-primary-blue';
      case 'luxury':
      return 'bg-gradient-temple';
      default:
      return 'bg-gray-500';
  }
}

export default function ComprehensiveCityGuide({
  city,
  language,
  citySlug,
  quotes = [],
}: ComprehensiveCityGuideProps) {
  const router = useRouter();
  const [ritualExpandedIndex, setRitualExpandedIndex] = useState<number | null>(null);
  const [ritualSelectedIndex, setRitualSelectedIndex] = useState(0);
  const [ritualHighlightStep, setRitualHighlightStep] = useState(0);
  const [festivalExpandedIndex, setFestivalExpandedIndex] = useState<number | null>(null);
  const [festivalSelectedIndex, setFestivalSelectedIndex] = useState(0);
  const [festivalHighlightStep, setFestivalHighlightStep] = useState(0);
  const [contentModal, setContentModal] = useState<'spiritual' | 'history' | 'darshan' | 'transport' | null>(null);
  const [heroTextSmall, setHeroTextSmall] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoDurationRef = useRef<number>(0);
  const heroTextSmallRef = useRef(false);
  const timeUpdateRAFRef = useRef<number | null>(null);
  const ritualCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const festivalCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const accordionRestoredRef = useRef(false);
  // Video clusters: sequential playback top-left → top-right → bottom, no scroll detection
  const [historyClusterPlayingSlot, setHistoryClusterPlayingSlot] = useState<0 | 1 | 2 | 3>(0);
  const [historyClusterFadingSlot, setHistoryClusterFadingSlot] = useState<1 | 2 | 3 | null>(null);
  const historyVideoRefsMobile = useRef<(HTMLVideoElement | null)[]>([]);
  const historyVideoRefsDesktop = useRef<(HTMLVideoElement | null)[]>([]);
  const historyVideoTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [historyClusterIsMobile, setHistoryClusterIsMobile] = useState(false);

  const [spiritualClusterPlayingSlot, setSpiritualClusterPlayingSlot] = useState<0 | 1 | 2 | 3>(0);
  const [spiritualClusterFadingSlot, setSpiritualClusterFadingSlot] = useState<1 | 2 | 3 | null>(null);
  const spiritualVideoRefsMobile = useRef<(HTMLVideoElement | null)[]>([]);
  const spiritualVideoRefsDesktop = useRef<(HTMLVideoElement | null)[]>([]);
  const spiritualVideoTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [spiritualClusterIsMobile, setSpiritualClusterIsMobile] = useState(false);

  const HISTORY_VIDEO_FADE_MS = 600;
  const HISTORY_VIDEO_PAUSE_BETWEEN_MS = 0;
  const HISTORY_VIDEO_PAUSE_BEFORE_LOOP_MS = 0;
  const SPIRITUAL_VIDEO_FADE_MS = 600;
  const SPIRITUAL_VIDEO_PAUSE_BETWEEN_MS = 0;
  const SPIRITUAL_VIDEO_PAUSE_BEFORE_LOOP_MS = 0;

  useEffect(() => {
    if (!citySlug) return;
    router.prefetch(`/city/${citySlug}/explore`);
  }, [citySlug, router]);

  // Preload cluster videos with raw URLs (same as video src) for cache
  useEffect(() => {
    const urls = [
      'https://res.cloudinary.com/dp0gqerkk/video/upload/v1769941733/kashi-2_rnbwom.mp4',
      'https://res.cloudinary.com/dp0gqerkk/video/upload/v1769941720/kashi-3_vqq1cs.mp4',
      'https://res.cloudinary.com/dp0gqerkk/video/upload/v1769941738/kashi_pxgwfj.mp4',
      'https://res.cloudinary.com/dp0gqerkk/video/upload/v1769943119/1_w5wxln.mp4',
      'https://res.cloudinary.com/dp0gqerkk/video/upload/v1769943128/3_fq91kq.mp4',
      'https://res.cloudinary.com/dp0gqerkk/video/upload/v1769943131/2_railpl.mp4',
    ];
    setTimeout(() => {
      urls.forEach((url, i) => {
        setTimeout(() => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.as = 'video';
          link.href = url;
          document.head.appendChild(link);
        }, i * 150);
      });
    }, 1000);
  }, []);

  // History cluster: start first video after mount so refs and DOM are ready (top-left → top-right → bottom, loop).
  useEffect(() => {
    const id = setTimeout(() => setHistoryClusterPlayingSlot(1), 600);
    historyVideoTimeoutsRef.current.push(id);
    return () => {
      clearTimeout(id);
      historyVideoTimeoutsRef.current.forEach((tid) => clearTimeout(tid));
      historyVideoTimeoutsRef.current = [];
    };
  }, []);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 640px)');
    const update = () => setHistoryClusterIsMobile(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  // Note: Video sources are set via JSX src prop, which uses optimized URLs
  // No need to manually update sources here as React handles it

  useEffect(() => {
    if (historyClusterPlayingSlot < 1 || historyClusterPlayingSlot > 3) return;
    const refs = historyClusterIsMobile ? historyVideoRefsMobile : historyVideoRefsDesktop;
    const vid = refs.current[historyClusterPlayingSlot - 1];
    if (!vid) return;

    const play = () => {
      vid.play().catch(() => {});
    };

    // Try play immediately if already ready
    if (vid.readyState >= 2) {
      play();
    } else {
      vid.addEventListener('canplay', play, { once: true });
      vid.addEventListener('canplaythrough', play, { once: true });
      vid.addEventListener('loadeddata', play, { once: true });
      if (vid.readyState === 0) vid.load();
    }

    // Retry play after short delays in case video wasn't ready yet
    const t1 = setTimeout(play, 200);
    const t2 = setTimeout(play, 600);
    const t3 = setTimeout(play, 1200);

    return () => {
      vid.removeEventListener('canplay', play);
      vid.removeEventListener('canplaythrough', play);
      vid.removeEventListener('loadeddata', play);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [historyClusterPlayingSlot, historyClusterIsMobile]);

  const scheduleHistoryNext = (delay: number, slot: 1 | 2 | 3) => {
    const id = setTimeout(() => setHistoryClusterPlayingSlot(slot), delay);
    historyVideoTimeoutsRef.current.push(id);
  };

  // After a video ends: fade out (FADE_MS), then show image, pause, then start next video
  useEffect(() => {
    if (historyClusterFadingSlot == null) return;
    const id = setTimeout(() => {
      setHistoryClusterFadingSlot(null);
      setHistoryClusterPlayingSlot(0);
      const nextSlot = historyClusterFadingSlot === 1 ? 2 : historyClusterFadingSlot === 2 ? 3 : 1;
      const pauseMs = nextSlot === 1 ? HISTORY_VIDEO_PAUSE_BEFORE_LOOP_MS : HISTORY_VIDEO_PAUSE_BETWEEN_MS;
      scheduleHistoryNext(pauseMs, nextSlot);
    }, HISTORY_VIDEO_FADE_MS);
    historyVideoTimeoutsRef.current.push(id);
    return () => {
      clearTimeout(id);
      historyVideoTimeoutsRef.current = historyVideoTimeoutsRef.current.filter((x) => x !== id);
    };
  }, [historyClusterFadingSlot]);

  // Spiritual cluster: start first video after mount so refs and DOM are ready (top-left → top-right → bottom, loop).
  useEffect(() => {
    const id = setTimeout(() => setSpiritualClusterPlayingSlot(1), 500);
    spiritualVideoTimeoutsRef.current.push(id);
    return () => {
      clearTimeout(id);
      spiritualVideoTimeoutsRef.current.forEach((tid) => clearTimeout(tid));
      spiritualVideoTimeoutsRef.current = [];
    };
  }, []);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 640px)');
    const update = () => setSpiritualClusterIsMobile(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, []);

  // Note: Video sources are set via JSX src prop, which uses optimized URLs
  // No need to manually update sources here as React handles it

  useEffect(() => {
    if (spiritualClusterPlayingSlot < 1 || spiritualClusterPlayingSlot > 3) return;
    const refs = spiritualClusterIsMobile ? spiritualVideoRefsMobile : spiritualVideoRefsDesktop;
    const vid = refs.current[spiritualClusterPlayingSlot - 1];
    if (!vid) return;

    const play = () => {
      vid.play().catch(() => {});
    };

    // Try play immediately if already ready
    if (vid.readyState >= 2) {
      play();
    } else {
      vid.addEventListener('canplay', play, { once: true });
      vid.addEventListener('canplaythrough', play, { once: true });
      vid.addEventListener('loadeddata', play, { once: true });
      if (vid.readyState === 0) vid.load();
    }

    // Retry play after short delays in case video wasn't ready yet
    const t1 = setTimeout(play, 200);
    const t2 = setTimeout(play, 600);
    const t3 = setTimeout(play, 1200);

    return () => {
      vid.removeEventListener('canplay', play);
      vid.removeEventListener('canplaythrough', play);
      vid.removeEventListener('loadeddata', play);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [spiritualClusterPlayingSlot, spiritualClusterIsMobile]);

  const scheduleSpiritualNext = (delay: number, slot: 1 | 2 | 3) => {
    const id = setTimeout(() => setSpiritualClusterPlayingSlot(slot), delay);
    spiritualVideoTimeoutsRef.current.push(id);
  };

  useEffect(() => {
    if (spiritualClusterFadingSlot == null) return;
    const id = setTimeout(() => {
      setSpiritualClusterFadingSlot(null);
      setSpiritualClusterPlayingSlot(0);
      const nextSlot = spiritualClusterFadingSlot === 1 ? 2 : spiritualClusterFadingSlot === 2 ? 3 : 1;
      const pauseMs = nextSlot === 1 ? SPIRITUAL_VIDEO_PAUSE_BEFORE_LOOP_MS : SPIRITUAL_VIDEO_PAUSE_BETWEEN_MS;
      scheduleSpiritualNext(pauseMs, nextSlot);
    }, SPIRITUAL_VIDEO_FADE_MS);
    spiritualVideoTimeoutsRef.current.push(id);
    return () => {
      clearTimeout(id);
      spiritualVideoTimeoutsRef.current = spiritualVideoTimeoutsRef.current.filter((x) => x !== id);
    };
  }, [spiritualClusterFadingSlot]);

  // Restore ritual/festival accordion after language change (cleared on refresh by city page)
  useEffect(() => {
    if (accordionRestoredRef.current) return;
    accordionRestoredRef.current = true;
    const ritualIdx = getRestoredAccordionIndex(ACCORDION_RESTORE_KEYS.rituals);
    if (ritualIdx != null && city.rituals?.length && ritualIdx >= 0 && ritualIdx < city.rituals.length) setRitualExpandedIndex(ritualIdx);
    const festivalIdx = getRestoredAccordionIndex(ACCORDION_RESTORE_KEYS.festivals);
    if (festivalIdx != null && city.festivals?.length && festivalIdx >= 0 && festivalIdx < city.festivals.length) setFestivalExpandedIndex(festivalIdx);
  }, [city.rituals?.length, city.festivals?.length]);

  useEffect(() => {
    saveAccordionIndex(ACCORDION_RESTORE_KEYS.rituals, ritualExpandedIndex);
  }, [ritualExpandedIndex]);

  useEffect(() => {
    saveAccordionIndex(ACCORDION_RESTORE_KEYS.festivals, festivalExpandedIndex);
  }, [festivalExpandedIndex]);

  const festivalClosedIndices = city.festivals ? city.festivals.map((_, i) => i).filter((i) => festivalExpandedIndex !== i) : [];
  const festivalHighlightedIndex = festivalClosedIndices.length > 0 ? festivalClosedIndices[festivalHighlightStep % festivalClosedIndices.length] : -1;
  useEffect(() => {
    if (festivalClosedIndices.length <= 1) return;
    const t = setInterval(() => setFestivalHighlightStep((s) => s + 1), 1900);
    return () => clearInterval(t);
  }, [festivalClosedIndices.length]);

  const isHolyDipRitual = (ritual: { name?: { en?: string } }) => {
    const en = (ritual.name?.en ?? '').toLowerCase();
    return en.includes('holy dip') || en.includes('ganga snan');
  };
  const ritualsToShowWithIndex = city.rituals
    ? city.rituals.map((ritual, i) => ({ ritual, originalIndex: i })).filter(({ ritual }) => !isHolyDipRitual(ritual))
    : [];
  const ritualClosedIndices = ritualsToShowWithIndex.map(({ originalIndex }) => originalIndex).filter((i) => ritualExpandedIndex !== i);
  const ritualHighlightedIndex = ritualClosedIndices.length > 0 ? ritualClosedIndices[ritualHighlightStep % ritualClosedIndices.length] : -1;
  useEffect(() => {
    if (ritualClosedIndices.length <= 1) return;
    const t = setInterval(() => setRitualHighlightStep((s) => s + 1), 1900);
    return () => clearInterval(t);
  }, [ritualClosedIndices.length]);

  // Clamp ritualSelectedIndex when it points to Holy Dip (filtered out)
  useEffect(() => {
    if (!city.rituals?.length || ritualsToShowWithIndex.length === 0) return;
    const isSelectedHolyDip = city.rituals[ritualSelectedIndex] && isHolyDipRitual(city.rituals[ritualSelectedIndex]);
    if (isSelectedHolyDip) setRitualSelectedIndex(ritualsToShowWithIndex[0].originalIndex);
  }, [city.rituals?.length, ritualsToShowWithIndex.length]);

  // Scroll expanded ritual card into view on desktop only; on mobile skip to avoid auto-scroll on open/load
  useEffect(() => {
    if (ritualExpandedIndex == null || !city.rituals?.length) return;
    if (typeof window !== 'undefined' && window.innerWidth < 640) return;
    const el = ritualCardRefs.current[ritualExpandedIndex];
    if (el) {
      const timeoutId = window.setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
      return () => window.clearTimeout(timeoutId);
    }
  }, [ritualExpandedIndex, city.rituals?.length]);

  // Scroll expanded festival card into view on desktop only; on mobile skip to avoid auto-scroll on open/load
  useEffect(() => {
    if (festivalExpandedIndex == null || !city.festivals?.length) return;
    if (typeof window !== 'undefined' && window.innerWidth < 640) return;
    const el = festivalCardRefs.current[festivalExpandedIndex];
    if (el) {
      const timeoutId = window.setTimeout(() => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
      return () => window.clearTimeout(timeoutId);
    }
  }, [festivalExpandedIndex, city.festivals?.length]);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Video Background */}
      <section 
        className="relative h-[50vh] min-h-[280px] sm:h-[55vh] sm:min-h-[320px] md:h-96 lg:h-[500px] overflow-hidden"
        style={{ 
          willChange: 'auto',
          transform: 'translateZ(0)', // Enable GPU acceleration
        }}
      >
        {/* Video Background */}
        {city.videos && city.videos.length > 0 ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover scale-105"
            poster={getVideoThumbnail(city.videos[0], 1920, 1080)}
            onLoadedMetadata={(e) => {
              const v = e.currentTarget;
              // Safety check: ensure video element exists and has valid duration
              if (v && v.nodeName === 'VIDEO' && v.duration && Number.isFinite(v.duration)) {
                videoDurationRef.current = v.duration;
              }
            }}
            onTimeUpdate={(e) => {
              // Throttle time updates to prevent jitter - only check every ~200ms
              if (timeUpdateRAFRef.current) return;
              
              timeUpdateRAFRef.current = requestAnimationFrame(() => {
                timeUpdateRAFRef.current = null;
                const v = e.currentTarget;
                
                // Safety check: ensure video element exists
                if (!v || v.nodeName !== 'VIDEO') return;
                
                const duration = v.duration && Number.isFinite(v.duration) ? v.duration : videoDurationRef.current;
                const t = v.currentTime;
                if (duration <= 0 || !Number.isFinite(t)) return;
                
                const shrinkAfter = 3;
                const returnBeforeEnd = 1.5;
                const shouldBeSmall = t >= shrinkAfter && t < duration - returnBeforeEnd;
                
                // Only update state if it actually changed
                if (shouldBeSmall !== heroTextSmallRef.current) {
                  heroTextSmallRef.current = shouldBeSmall;
                  setHeroTextSmall(shouldBeSmall);
                }
              });
            }}
          >
            <source 
              src={getOptimizedVideoUrl(city.videos[0], { 
                width: 1920, 
                quality: 'auto',
                format: 'auto'
              })} 
              type="video/mp4" 
            />
          </video>
        ) : city.images && city.images.length > 0 ? (
          <SafeImage
            src={city.images[0]}
            alt={getLocalizedContent(city.name, language)}
            fill
            sizes="100vw"
            className="object-cover scale-105"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-temple"></div>
        )}
        {/* Enhanced overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-overlay"></div>
        {/* Decorative golden border at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-temple"></div>
        {/* Text Content – scales down after a few seconds of video, returns to original near end */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10 h-full flex items-end pb-8 sm:pb-12">
          <div
className="w-full origin-bottom-left transition-transform duration-1000 ease-out"
            style={{ transform: heroTextSmall ? 'scale(0.72)' : 'scale(1)' }}
          >
            <div className="inline-block mb-1.5 sm:mb-2 px-2 sm:px-3 py-0.5 sm:py-0.5 bg-primary-gold/20 backdrop-blur-sm rounded-full border border-primary-gold/30">
              <span className="text-primary-gold text-[6px] sm:text-xs font-semibold">✨ {city.state}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-3 drop-shadow-2xl break-words" style={{ lineHeight: '1.5' }}>
              {getLocalizedContent(city.name, language)}
            </h1>
            <div className="w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-gradient-temple rounded-full"></div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Quotes Section */}
        {quotes && quotes.length > 0 && (
          <QuotesSection quotes={quotes} language={language} />
        )}

        {/* Spiritual Significance – more content left; editorial image panel right */}
        {city.spiritualSignificance && (() => {
          const full = getLocalizedContent(city.spiritualSignificance, language);
          const { text: preview, truncated } = truncateForPreview(full, 1200);
          const { text: previewMobile, truncated: truncatedMobile } = truncateForPreview(full, 280);
          const spiritualClusterImages = [
            'https://res.cloudinary.com/dp0gqerkk/image/upload/v1769935161/Screenshot_2026-02-01_140718_enwezm.png',
            'https://res.cloudinary.com/dp0gqerkk/image/upload/v1769935161/Screenshot_2026-02-01_140641_zmtcsv.png',
            'https://res.cloudinary.com/dp0gqerkk/image/upload/v1769936237/Screenshot_2026-02-01_142648_tegxcd.png',
          ];
          // Use raw Cloudinary URLs for reliable playback (optimization can break in some environments)
          const spiritualClusterVideos = [
            'https://res.cloudinary.com/dp0gqerkk/video/upload/v1769943119/1_w5wxln.mp4',  // top left
            'https://res.cloudinary.com/dp0gqerkk/video/upload/v1769943128/3_fq91kq.mp4',  // top right
            'https://res.cloudinary.com/dp0gqerkk/video/upload/v1769943131/2_railpl.mp4',  // bottom
          ];
          const knowMoreBtnClass =
            'inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#B88576] to-[#C49A8C] text-white py-2.5 px-5 text-sm font-semibold shadow-md border border-[#D9B8AB]/80 hover:from-[#A67566] hover:to-[#B88576] hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C49A8C] focus-visible:ring-offset-2 active:scale-[0.96] active:shadow-inner active:brightness-95 transition-all duration-150 ease-out touch-manipulation min-h-[44px] select-none';
          return (
            <section 
              className="mb-12" 
              aria-labelledby="spiritual-significance-heading"
              style={{ 
                willChange: 'auto',
                transform: 'translateZ(0)',
              }}
            >
              {/* Mobile – image cluster first, then content; optimized for phone */}
              <div className="sm:hidden rounded-2xl overflow-hidden bg-[#FFDED3] shadow-lg border border-[#D9B8AB]/60">
                <div className="px-4 pt-3.5 pb-2 flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-gradient-temple flex items-center justify-center text-lg flex-shrink-0 shadow-sm">🕉️</div>
                  <div className="flex-1 min-w-0">
                    <span id="spiritual-significance-heading" className="font-bold text-primary-dark text-sm block">{t('spiritual.significance', language)}</span>
                    <span className="text-xs text-primary-dark/70">{t('why.city.sacred', language)}</span>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-primary-dark/5 border border-[#D9B8AB] shadow-sm">
                        <SafeImage src={spiritualClusterImages[1]} alt="River and ghats" fill className="object-cover" sizes="50vw" />
                        <video 
                          ref={(el) => { spiritualVideoRefsMobile.current[0] = el; }} 
                          src={spiritualClusterVideos[0]} 
                          muted 
                          playsInline 
                          preload="auto"
                          crossOrigin="anonymous"
                          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[600ms] ease-in-out pointer-events-none ${spiritualClusterPlayingSlot === 1 && spiritualClusterFadingSlot !== 1 ? 'opacity-100' : 'opacity-0'}`} 
                          onEnded={() => setSpiritualClusterFadingSlot(1)}
                        />
                      </div>
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-primary-dark/5 border border-[#D9B8AB] shadow-sm">
                        <SafeImage src={spiritualClusterImages[2]} alt="Aarti ceremony" fill className="object-cover" sizes="50vw" />
                        <video 
                          ref={(el) => { spiritualVideoRefsMobile.current[1] = el; }} 
                          src={spiritualClusterVideos[1]} 
                          muted 
                          playsInline 
                          preload="auto"
                          crossOrigin="anonymous"
                          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[600ms] ease-in-out pointer-events-none ${spiritualClusterPlayingSlot === 2 && spiritualClusterFadingSlot !== 2 ? 'opacity-100' : 'opacity-0'}`} 
                          onEnded={() => setSpiritualClusterFadingSlot(2)}
                        />
                      </div>
                    </div>
                    <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-primary-dark/5 border border-[#D9B8AB] shadow-sm">
                      <SafeImage src={spiritualClusterImages[0]} alt="Ghats and rituals on the Ganga" fill className="object-cover" sizes="100vw" />
                      <video 
                        ref={(el) => { spiritualVideoRefsMobile.current[2] = el; }} 
                        src={spiritualClusterVideos[2]} 
                        muted 
                        playsInline 
                        preload="auto"
                        crossOrigin="anonymous"
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[600ms] ease-in-out pointer-events-none ${spiritualClusterPlayingSlot === 3 && spiritualClusterFadingSlot !== 3 ? 'opacity-100' : 'opacity-0'}`} 
                        onEnded={() => setSpiritualClusterFadingSlot(3)}
                      />
                    </div>
                  </div>
                  <p className="text-primary-dark/90 leading-relaxed whitespace-pre-line text-sm text-justify">
                    {previewMobile}
                  </p>
                  {truncatedMobile && (
                    <button type="button" onClick={() => setContentModal('spiritual')} className={`mt-4 w-full ${knowMoreBtnClass}`}>
                      {t('know.more', language)}
                    </button>
                  )}
                </div>
              </div>
              {/* Desktop */}
              <div className="hidden sm:block">
                <SectionHeader title={t('spiritual.significance', language)} icon="🕉️" subtitle={t('why.city.sacred', language)} />
                <div className="rounded-2xl overflow-hidden bg-[#FFDED3] shadow-xl border border-primary-gold/15 relative">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#FFE8E0] rounded-full -mr-20 -mt-20 pointer-events-none" aria-hidden />
                  <div className="grid lg:grid-cols-[1fr,1fr] gap-8 xl:gap-10 p-8 md:p-10 relative z-10 items-start">
                    <div className="min-w-0">
                      <p className="text-primary-dark/90 leading-[1.8] whitespace-pre-line text-base sm:text-lg text-justify">
                        {preview}
                      </p>
                      {truncated && (
                        <button type="button" onClick={() => setContentModal('spiritual')} className={`mt-6 ${knowMoreBtnClass}`}>
                          {t('know.more', language)}
                        </button>
                      )}
                    </div>
                    <div className="w-full lg:sticky lg:top-24 flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-white/80 border border-[#D9B8AB] shadow-md">
                          <SafeImage src={spiritualClusterImages[1]} alt="River and ghats" fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
                          <video 
                            ref={(el) => { spiritualVideoRefsDesktop.current[0] = el; }} 
                            src={spiritualClusterVideos[0]} 
                            muted 
                            playsInline 
                            preload="auto"
                            crossOrigin="anonymous"
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[600ms] ease-in-out pointer-events-none ${spiritualClusterPlayingSlot === 1 && spiritualClusterFadingSlot !== 1 ? 'opacity-100' : 'opacity-0'}`} 
                            onEnded={() => setSpiritualClusterFadingSlot(1)}
                          />
                        </div>
                        <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-white/80 border border-[#D9B8AB] shadow-md">
                          <SafeImage src={spiritualClusterImages[2]} alt="Aarti ceremony" fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
                          <video 
                            ref={(el) => { spiritualVideoRefsDesktop.current[1] = el; }} 
                            src={spiritualClusterVideos[1]} 
                            muted 
                            playsInline 
                            preload="auto"
                            crossOrigin="anonymous"
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[600ms] ease-in-out pointer-events-none ${spiritualClusterPlayingSlot === 2 && spiritualClusterFadingSlot !== 2 ? 'opacity-100' : 'opacity-0'}`} 
                            onEnded={() => setSpiritualClusterFadingSlot(2)}
                          />
                        </div>
                      </div>
                      <div className="relative aspect-[16/9] w-full max-w-sm mx-auto rounded-xl overflow-hidden bg-gradient-to-b from-amber-50/80 to-white border border-[#D9B8AB] shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
                        <SafeImage src={spiritualClusterImages[0]} alt="Ghats and rituals on the Ganga" fill className="object-cover object-center" sizes="(max-width: 1024px) 100vw, 50vw" />
                        <video 
                          ref={(el) => { spiritualVideoRefsDesktop.current[2] = el; }} 
                          src={spiritualClusterVideos[2]} 
                          muted 
                          playsInline 
                          preload="auto"
                          crossOrigin="anonymous"
                          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-[600ms] ease-in-out pointer-events-none ${spiritualClusterPlayingSlot === 3 && spiritualClusterFadingSlot !== 3 ? 'opacity-100' : 'opacity-0'}`} 
                          onEnded={() => setSpiritualClusterFadingSlot(3)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <ContentModal
                isOpen={contentModal === 'spiritual'}
                onClose={() => setContentModal(null)}
                title={t('spiritual.significance', language)}
                subtitle={t('why.city.sacred', language)}
                icon="🕉️"
              >
                <p className="text-primary-dark/90 leading-relaxed whitespace-pre-line text-base sm:text-lg text-justify">
                  {full}
                </p>
              </ContentModal>
            </section>
          );
        })()}

        {/* History – same layout as Spiritual Significance: left text, right image cluster; bg #EDF3F7 */}
        {city.history && (() => {
          const full = getLocalizedContent(city.history, language);
          const { text: preview, truncated } = truncateForPreview(full, 1200);
          const { text: previewMobile, truncated: truncatedMobile } = truncateForPreview(full, 280);
          const historyClusterImages = [
            'https://res.cloudinary.com/dp0gqerkk/image/upload/v1769939217/kashi_njoi6z.jpg',
            'https://res.cloudinary.com/dp0gqerkk/image/upload/v1769939212/kashi_2_f8j5qc.jpg',
            'https://res.cloudinary.com/dp0gqerkk/image/upload/v1769939210/kashi_3_yhfeny.jpg',
          ];
          // Use raw Cloudinary URLs for reliable playback (optimization can break in some environments)
          const historyClusterVideos = [
            'https://res.cloudinary.com/dp0gqerkk/video/upload/v1769941733/kashi-2_rnbwom.mp4',
            'https://res.cloudinary.com/dp0gqerkk/video/upload/v1769941720/kashi-3_vqq1cs.mp4',
            'https://res.cloudinary.com/dp0gqerkk/video/upload/v1769941738/kashi_pxgwfj.mp4',
          ];
          const knowMoreBtnClass =
            'inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6B9BB5] to-[#8BB0C5] text-white py-2.5 px-5 text-sm font-semibold shadow-md border border-[#B8D0DE]/90 hover:from-[#5A8AA5] hover:to-[#7BA3BC] hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8BB0C5] focus-visible:ring-offset-2 active:scale-[0.96] active:shadow-inner active:brightness-95 transition-all duration-150 ease-out touch-manipulation min-h-[44px] select-none';
          return (
            <section 
              className="mb-12" 
              aria-labelledby="history-heading"
              style={{ 
                willChange: 'auto',
                transform: 'translateZ(0)',
              }}
            >
              {/* Mobile – image cluster first, then content; optimized for phone */}
              <div className="sm:hidden rounded-2xl overflow-hidden bg-[#EDF3F7] shadow-lg border border-[#B8D0DE]">
                <div className="px-4 pt-3.5 pb-2 flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-gradient-temple flex items-center justify-center text-lg flex-shrink-0 shadow-sm">📜</div>
                  <div className="flex-1 min-w-0">
                    <span id="history-heading" className="font-bold text-primary-dark text-sm block">{t('history', language)}</span>
                    <span className="text-xs text-primary-dark/70">{t('historical.background', language)}</span>
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-primary-dark/5 border border-[#B8D0DE] shadow-sm">
                        <SafeImage src={historyClusterImages[1]} alt="Kashi heritage" fill className="object-cover" sizes="50vw" />
                        <video 
                          key={`history-mobile-0-${historyClusterIsMobile}`}
                          ref={(el) => { historyVideoRefsMobile.current[0] = el; }} 
                          src={historyClusterVideos[0]} 
                          muted 
                          playsInline 
                          preload="auto"
                          crossOrigin="anonymous"
                          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[600ms] ease-in-out pointer-events-none ${historyClusterPlayingSlot === 1 && historyClusterFadingSlot !== 1 ? 'opacity-100' : 'opacity-0'}`} 
                          onEnded={() => setHistoryClusterFadingSlot(1)}
                        />
                      </div>
                      <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-primary-dark/5 border border-[#B8D0DE] shadow-sm">
                        <SafeImage src={historyClusterImages[0]} alt="Kashi and the Ganga" fill className="object-cover" sizes="50vw" />
                        <video 
                          ref={(el) => { historyVideoRefsMobile.current[1] = el; }} 
                          src={historyClusterVideos[2]} 
                          muted 
                          playsInline 
                          preload="auto"
                          crossOrigin="anonymous"
                          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[600ms] ease-in-out pointer-events-none ${historyClusterPlayingSlot === 2 && historyClusterFadingSlot !== 2 ? 'opacity-100' : 'opacity-0'}`} 
                          onEnded={() => setHistoryClusterFadingSlot(2)}
                        />
                      </div>
                    </div>
                    <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-primary-dark/5 border border-[#B8D0DE] shadow-sm">
                      <SafeImage src={historyClusterImages[2]} alt="Kashi streets" fill className="object-cover" sizes="100vw" />
                      <video 
                        ref={(el) => { historyVideoRefsMobile.current[2] = el; }} 
                        src={historyClusterVideos[1]} 
                        muted 
                        playsInline 
                        preload="auto"
                        crossOrigin="anonymous"
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[600ms] ease-in-out pointer-events-none ${historyClusterPlayingSlot === 3 && historyClusterFadingSlot !== 3 ? 'opacity-100' : 'opacity-0'}`} 
                        onEnded={() => setHistoryClusterFadingSlot(3)}
                      />
                    </div>
                  </div>
                  <p className="text-primary-dark/90 leading-relaxed whitespace-pre-line text-sm text-justify">
                    {previewMobile}
                  </p>
                  {truncatedMobile && (
                    <button type="button" onClick={() => setContentModal('history')} className={`mt-4 w-full ${knowMoreBtnClass}`}>
                      {t('know.more', language)}
                    </button>
                  )}
                </div>
              </div>
              {/* Desktop – text left, image cluster right */}
              <div className="hidden sm:block">
                <SectionHeader title={t('history', language)} icon="📜" subtitle={t('historical.background', language)} />
                <div className="rounded-2xl overflow-hidden bg-[#EDF3F7] shadow-xl border border-[#B8D0DE] relative">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#E2ECF3] rounded-full -mr-20 -mt-20 pointer-events-none" aria-hidden />
                  <div className="grid lg:grid-cols-[1fr,1fr] gap-8 xl:gap-10 p-8 md:p-10 relative z-10 items-start">
                    <div className="min-w-0">
                      <p className="text-primary-dark/90 leading-[1.8] whitespace-pre-line text-base sm:text-lg text-justify">
                        {preview}
                      </p>
                      {truncated && (
                        <button type="button" onClick={() => setContentModal('history')} className={`mt-6 ${knowMoreBtnClass}`}>
                          {t('know.more', language)}
                        </button>
                      )}
                    </div>
                    <div className="w-full lg:sticky lg:top-24 flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-white/80 border border-[#B8D0DE] shadow-md">
                          <SafeImage src={historyClusterImages[1]} alt="Kashi heritage" fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
                          <video 
                            ref={(el) => { historyVideoRefsDesktop.current[0] = el; }} 
                            src={historyClusterVideos[0]} 
                            muted 
                            playsInline 
                            preload="auto"
                            crossOrigin="anonymous"
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[600ms] ease-in-out pointer-events-none ${historyClusterPlayingSlot === 1 && historyClusterFadingSlot !== 1 ? 'opacity-100' : 'opacity-0'}`} 
                            onEnded={() => setHistoryClusterFadingSlot(1)}
                          />
                        </div>
                        <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-white/80 border border-[#B8D0DE] shadow-md">
                          <SafeImage src={historyClusterImages[0]} alt="Kashi and the Ganga" fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
                          <video 
                            ref={(el) => { historyVideoRefsDesktop.current[1] = el; }} 
                            src={historyClusterVideos[2]} 
                            muted 
                            playsInline 
                            preload="auto"
                            crossOrigin="anonymous"
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[600ms] ease-in-out pointer-events-none ${historyClusterPlayingSlot === 2 && historyClusterFadingSlot !== 2 ? 'opacity-100' : 'opacity-0'}`} 
                            onEnded={() => setHistoryClusterFadingSlot(2)}
                          />
                        </div>
                      </div>
                      <div className="relative aspect-[16/9] w-full max-w-sm mx-auto rounded-xl overflow-hidden bg-gradient-to-b from-amber-50/80 to-white border border-[#B8D0DE] shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
                        <SafeImage src={historyClusterImages[2]} alt="Kashi streets" fill className="object-cover object-center" sizes="(max-width: 1024px) 100vw, 50vw" />
                          <video 
                            ref={(el) => { historyVideoRefsDesktop.current[2] = el; }} 
                            src={historyClusterVideos[1]} 
                            muted 
                            playsInline 
                            preload="auto"
                            crossOrigin="anonymous"
                            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-[600ms] ease-in-out pointer-events-none ${historyClusterPlayingSlot === 3 && historyClusterFadingSlot !== 3 ? 'opacity-100' : 'opacity-0'}`} 
                            onEnded={() => setHistoryClusterFadingSlot(3)}
                          />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <ContentModal
                isOpen={contentModal === 'history'}
                onClose={() => setContentModal(null)}
                title={t('history', language)}
                subtitle={t('historical.background', language)}
                icon="📜"
              >
                <p className="text-primary-dark/90 leading-relaxed whitespace-pre-line text-base sm:text-lg text-justify">
                  {full}
                </p>
              </ContentModal>
            </section>
          );
        })()}

        {/* Places to Visit – premium section; minimal side padding on phone so cards use full width. Exclude BHU; show Explore more link. */}
        {city.places && city.places.length > 0 && (() => {
          const placesWithoutBhu = city.places.filter(
            (p) => !(p.name?.en && (p.name.en.includes('BHU') || p.name.en.includes('Banaras Hindu University')))
          );
          return placesWithoutBhu.length > 0 ? (
            <section className="mb-12">
              <PlacesCarousel 
                places={placesWithoutBhu} 
                language={language} 
                exploreSlug={citySlug}
                title={t('places.to.visit', language)}
                icon="📍"
                subtitle={t('explore.sacred.sites', language)}
              />
            </section>
          ) : null;
        })()}

        {/* Rituals & Practices – accordion on mobile, grid on desktop */}
        {city.rituals && city.rituals.length > 0 && (
          <section className="mb-12">
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#FDF6ED] via-[#F5E6D8] to-[#FFF8E7] border border-amber-200/50 shadow-xl shadow-amber-900/5 p-4 sm:p-6 lg:p-8">
              <SectionHeader title={t('rituals.practices', language)} icon="🕯️" subtitle={t('sacred.rituals.significance', language)} />
              {/* Mobile: accordion list (saffron accent) – Holy Dip excluded; time visible when closed */}
              <div className="sm:hidden rounded-2xl overflow-hidden border-2 border-orange-200/90 bg-white shadow-sm divide-y divide-orange-200/80">
              {ritualsToShowWithIndex.map(({ ritual, originalIndex }) => {
                const isExpanded = ritualExpandedIndex === originalIndex;
                return (
                  <div
                    key={originalIndex}
                    ref={(el) => { ritualCardRefs.current[originalIndex] = el; }}
                    className="bg-white first:rounded-t-2xl last:rounded-b-2xl scroll-mt-20 sm:scroll-mt-24"
                  >
                    <button
                      type="button"
                      onClick={() => setRitualExpandedIndex((prev) => (prev === originalIndex ? null : originalIndex))}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 text-left bg-white hover:bg-orange-50/50 active:bg-orange-50 transition-colors touch-manipulation ${!isExpanded && originalIndex === ritualHighlightedIndex ? 'accordion-highlight-rituals' : ''}`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary-saffron/10 flex items-center justify-center text-xl flex-shrink-0 border border-orange-200/60">🕯️</div>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-primary-dark text-sm break-words text-left block">{getLocalizedContent(ritual.name, language)}</span>
                        {ritual.timing && <span className="text-xs text-primary-saffron font-semibold block mt-0.5">⏰ {ritual.timing}</span>}
                      </div>
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-saffron/10 flex items-center justify-center text-primary-saffron border border-orange-200/60">
                        {isExpanded ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>}
                      </span>
                    </button>
                    <div
                      className={`accordion-panel-smooth overflow-hidden ${
                        isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                      aria-hidden={!isExpanded}
                    >
                      <div className="px-4 pb-4 pt-0 bg-orange-50/40">
                        {ritual.image && (
                          <div className="mb-3 rounded-xl overflow-hidden aspect-video w-full relative bg-primary-saffron/10">
                            <SafeImage
                              src={ritual.image}
                              alt={getLocalizedContent(ritual.name, language)}
                              fill
                              sizes="100vw"
                              className="object-cover"
                            />
                          </div>
                        )}
                        <p className="text-primary-dark/90 text-sm leading-relaxed">{getLocalizedContent(ritual.description, language)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
              {citySlug && (
                <div className="mt-4 px-2 sm:hidden">
                  <Link
                    href={`/city/${citySlug}/explore#aarti`}
                    className="group relative w-full rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white px-5 py-4 min-h-[56px] flex items-center justify-center gap-3 font-bold text-sm shadow-[0_4px_20px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_30px_rgba(249,115,22,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative flex items-center gap-3">
                      <span className="text-base">{t('explore.more', language)}</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Link>
                </div>
              )}
              {/* Desktop: featured ritual (left) + Quick View sidebar (right) – like Places to Visit */}
              <div className="hidden sm:grid sm:grid-cols-12 gap-6 lg:gap-8 items-start">
              <div className="sm:col-span-7 lg:col-span-8 w-full">
                {city.rituals[ritualSelectedIndex] && (() => {
                  const ritual = city.rituals[ritualSelectedIndex];
                  return (
                    <div className="rounded-2xl overflow-hidden border border-amber-200/70 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                      <div className="h-1 w-full bg-gradient-to-r from-primary-saffron via-primary-gold to-primary-saffron flex-shrink-0" aria-hidden />
                      {/* Hero image or placeholder – name on image top-left, no top blur, bigger height (like Places to Visit) */}
                      {ritual.image ? (
                        <div className="relative w-full h-72 sm:h-80 lg:h-96 overflow-hidden">
                          <SafeImage
                            src={ritual.image}
                            alt={getLocalizedContent(ritual.name, language)}
                            fill
                            sizes="(min-width: 1024px) 66vw, (min-width: 640px) 58vw, 100vw"
                            className="object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-white/95 to-transparent pointer-events-none" aria-hidden />
                          <div className="absolute top-0 left-0 right-0 p-4 sm:p-5 lg:p-6 pointer-events-none">
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white break-words max-w-full [text-shadow:0_1px_2px_rgba(0,0,0,0.8),0_2px_8px_rgba(0,0,0,0.5)]" style={{ lineHeight: 1.25 }}>
                              {getLocalizedContent(ritual.name, language)}
                            </h2>
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full h-72 sm:h-80 lg:h-96 bg-gradient-to-br from-primary-saffron/15 via-primary-gold/10 to-primary-saffron/15 flex items-center justify-center" aria-hidden>
                          <span className="text-6xl sm:text-7xl opacity-40" aria-hidden>🕯️</span>
                          <div className="absolute top-0 left-0 right-0 p-4 sm:p-5 lg:p-6 pointer-events-none">
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-dark/90 break-words max-w-full" style={{ lineHeight: 1.25 }}>
                              {getLocalizedContent(ritual.name, language)}
                            </h2>
                          </div>
                        </div>
                      )}
                      {/* Detail card – no logo/title row (name on image); description only */}
                      <div className="rounded-t-none border-t-0 p-5 sm:p-6 md:p-8 bg-white/98 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                        <p className="text-primary-dark/90 leading-relaxed text-base sm:text-lg">{getLocalizedContent(ritual.description, language)}</p>
                      </div>
                    </div>
                  );
                })()}
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
                          {language === 'hi' ? 'अन्य अनुष्ठान' : 'More rituals'}
                        </h3>
                      </div>
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-saffron/10 border border-amber-200/70 flex items-center justify-center text-primary-saffron">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                    </header>
                    <div className="space-y-2">
                      {ritualsToShowWithIndex.map(({ ritual, originalIndex }) => {
                        const isSelected = originalIndex === ritualSelectedIndex;
                        return (
                          <button
                            key={originalIndex}
                            type="button"
                            onClick={() => setRitualSelectedIndex(originalIndex)}
                            className={`w-full text-left rounded-xl border-2 px-4 py-3 min-h-[52px] flex items-start justify-between gap-2 transition-colors duration-200 ${
                              isSelected ? 'border-primary-saffron/60 bg-amber-50/80 text-premium-section-text shadow-sm' : 'border-slate-200/80 bg-white hover:border-primary-saffron/30 hover:bg-amber-50/50 text-premium-section-text/90'
                            }`}
                          >
                            <div className="min-w-0 flex-1 flex flex-col items-start gap-0.5">
                              <span className="font-semibold text-sm sm:text-base text-primary-dark leading-snug break-words text-left">{getLocalizedContent(ritual.name, language)}</span>
                              {ritual.timing && <span className="text-xs text-primary-saffron font-medium">⏰ {ritual.timing}</span>}
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
                    {citySlug && (
                      <Link
                        href={`/city/${citySlug}/explore#aarti`}
                        className="group relative w-full rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white px-5 py-4 min-h-[56px] flex items-center justify-center gap-3 font-bold text-sm sm:text-base shadow-[0_4px_20px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_30px_rgba(249,115,22,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden mt-3"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative flex items-center gap-3">
                          <span>{t('explore.more', language)}</span>
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              </aside>
              </div>
            </div>
          </section>
        )}

        {/* Festivals Calendar – accordion on mobile, featured + Quick View on desktop */}
        {city.festivals && city.festivals.length > 0 && (
          <section className="mb-12">
            <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-[#FDF6ED] via-[#F5E6D8] to-[#FFF8E7] border border-amber-200/50 shadow-xl shadow-amber-900/5 p-4 sm:p-6 lg:p-8">
              <SectionHeader title={t('festivals.calendar', language)} icon="🎉" subtitle={t('important.festivals', language)} />
              {/* Mobile: accordion list (gold accent) – date visible when closed; no repeat inside */}
              <div className="sm:hidden rounded-2xl overflow-hidden border-2 border-amber-200/90 bg-white shadow-sm divide-y divide-amber-200/80">
              {city.festivals.map((festival, index) => {
                const isExpanded = festivalExpandedIndex === index;
                return (
                  <div
                    key={index}
                    ref={(el) => { festivalCardRefs.current[index] = el; }}
                    className="bg-white first:rounded-t-2xl last:rounded-b-2xl scroll-mt-20 sm:scroll-mt-24"
                  >
                    <button
                      type="button"
                      onClick={() => setFestivalExpandedIndex((prev) => (prev === index ? null : index))}
                      className={`w-full flex items-center gap-3 px-4 py-3.5 text-left bg-white hover:bg-amber-50/50 active:bg-amber-50 transition-colors touch-manipulation ${!isExpanded && index === festivalHighlightedIndex ? 'accordion-highlight-festivals' : ''}`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary-gold/10 flex items-center justify-center text-xl flex-shrink-0 border border-amber-200/60">🎉</div>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-primary-dark text-sm break-words text-left block">{festival.name}</span>
                        {festival.date && <span className="text-xs text-primary-gold font-semibold block mt-0.5">📅 {festival.date}</span>}
                      </div>
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-gold/10 flex items-center justify-center text-primary-gold border border-amber-200/60">
                        {isExpanded ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" /></svg> : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>}
                      </span>
                    </button>
                    <div
                      className={`accordion-panel-smooth overflow-hidden ${
                        isExpanded ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                      aria-hidden={!isExpanded}
                    >
                      <div className="px-4 pb-4 pt-0 bg-amber-50/40 border-t border-amber-200/80">
                        <p className="text-primary-dark/90 text-sm leading-relaxed">{getLocalizedContent(festival.description, language)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              </div>
              {/* Desktop: featured festival (left) + Quick View sidebar (right) – like Places to Visit */}
              <div className="hidden sm:grid sm:grid-cols-12 gap-6 lg:gap-8 items-start">
              <div className="sm:col-span-7 lg:col-span-8 w-full">
                {city.festivals[festivalSelectedIndex] && (() => {
                  const festival = city.festivals[festivalSelectedIndex];
                  return (
                    <div className="rounded-2xl overflow-hidden border border-amber-200/70 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                      <div className="h-1 w-full bg-gradient-to-r from-primary-saffron via-primary-gold to-primary-saffron flex-shrink-0" aria-hidden />
                      {/* Hero image or placeholder – name on image top-left, no top blur, bigger height (like Places to Visit) */}
                      {festival.image ? (
                        <div className="relative w-full h-72 sm:h-80 lg:h-96 overflow-hidden">
                          <SafeImage
                            src={festival.image}
                            alt={festival.name}
                            fill
                            sizes="(min-width: 1024px) 66vw, (min-width: 640px) 58vw, 100vw"
                            className="object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-white/95 to-transparent pointer-events-none" aria-hidden />
                          <div className="absolute top-0 left-0 right-0 p-4 sm:p-5 lg:p-6 pointer-events-none">
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white break-words max-w-full [text-shadow:0_1px_2px_rgba(0,0,0,0.8),0_2px_8px_rgba(0,0,0,0.5)]" style={{ lineHeight: 1.25 }}>
                              {festival.name}
                            </h2>
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full h-72 sm:h-80 lg:h-96 bg-gradient-to-br from-primary-gold/15 via-primary-orange/10 to-primary-gold/15 flex items-center justify-center" aria-hidden>
                          <span className="text-6xl sm:text-7xl opacity-40" aria-hidden>🎉</span>
                          <div className="absolute top-0 left-0 right-0 p-4 sm:p-5 lg:p-6 pointer-events-none">
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-dark/90 break-words max-w-full" style={{ lineHeight: 1.25 }}>
                              {festival.name}
                            </h2>
                          </div>
                        </div>
                      )}
                      {/* Detail card – no logo/title row (name on image); description only */}
                      <div className="rounded-t-none border-t-0 p-5 sm:p-6 md:p-8 bg-white/98 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                        <p className="text-primary-dark/90 leading-relaxed text-base sm:text-lg">{getLocalizedContent(festival.description, language)}</p>
                      </div>
                    </div>
                  );
                })()}
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
                          {language === 'hi' ? 'अन्य त्योहार' : 'More festivals'}
                        </h3>
                      </div>
                      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-saffron/10 border border-amber-200/70 flex items-center justify-center text-primary-saffron">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </header>
                    <div className="space-y-2">
                      {city.festivals.map((festival, index) => {
                        const isSelected = index === festivalSelectedIndex;
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setFestivalSelectedIndex(index)}
                            className={`w-full text-left rounded-xl border-2 px-4 py-3 min-h-[52px] flex items-start justify-between gap-2 transition-colors duration-200 ${
                              isSelected ? 'border-primary-saffron/60 bg-amber-50/80 text-premium-section-text shadow-sm' : 'border-slate-200/80 bg-white hover:border-primary-saffron/30 hover:bg-amber-50/50 text-premium-section-text/90'
                            }`}
                          >
                            <div className="min-w-0 flex-1 flex flex-col items-start gap-0.5">
                              <span className="font-semibold text-sm sm:text-base text-primary-dark leading-snug break-words text-left">{festival.name}</span>
                              {festival.date && <span className="text-xs text-primary-saffron font-medium">📅 {festival.date}</span>}
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
        )}

        {/* Kashi Ropeway */}
        {city.kashiRopeway && (
          <KashiRopeway ropeway={city.kashiRopeway} language={language} />
        )}

        {/* Cricket Stadium */}
        {city.cricketStadium && (
          <CricketStadium stadium={city.cricketStadium} language={language} />
        )}

        {/* Wellness & Spiritual Retreats */}
        {city.wellnessCenters && city.wellnessCenters.length > 0 && (
          <WellnessRetreats centers={city.wellnessCenters} language={language} />
        )}

        {/* Academic Tourism */}
        {city.academicInstitutions && city.academicInstitutions.length > 0 && (
          <AcademicTourism institutions={city.academicInstitutions} language={language} />
        )}

        {/* Darshan Information – full content visible, no Know More */}
        {city.darshanInfo && (
          <section className="mb-8 sm:mb-12">
            <SectionHeader
              title={t('darshan.information', language)}
              icon="📿"
              subtitle={t('how.to.book.darshan', language)}
            />
            <div className="rounded-2xl overflow-hidden bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-200/60">
              <div className="h-1.5 w-full bg-gradient-to-r from-primary-gold via-primary-orange to-primary-saffron" aria-hidden />
              <div className="px-4 py-5 sm:p-6 md:p-8">
                <div className="mb-5 sm:mb-6">
                  <p className="text-[15px] sm:text-base md:text-lg text-primary-dark/90 leading-[1.65] sm:leading-relaxed whitespace-pre-line max-w-none">
                    {getLocalizedContent(city.darshanInfo, language)}
                  </p>
                </div>

                {city.officialBookingUrl && (
                  <div className="pt-4 sm:pt-5 border-t border-slate-200/80">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                      <a
                        href={city.officialBookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 sm:py-3.5 bg-primary-gold text-white rounded-xl font-semibold text-sm sm:text-base shadow-md hover:shadow-lg hover:bg-primary-orange active:bg-primary-orange transition-all min-h-[52px] touch-manipulation"
                      >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        {t('visit.official.website', language).replace(' →', '')}
                      </a>
                      <div className="flex items-center justify-center sm:justify-end gap-2 text-xs sm:text-sm text-primary-dark/70">
                        <span className="font-medium">
                          {language === 'hi' ? 'आधिकारिक वेबसाइट' : language === 'en' ? 'Official website' : 'Official website'}
                        </span>
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center" aria-label="Verified">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Transportation Guide */}
        {city.transportOptions && city.transportOptions.length > 0 && (
          <TransportationGuide
            transportOptions={city.transportOptions}
            transportTips={city.transportTips}
            language={language}
          />
        )}

        {/* Route Planner */}
        {city.entryPoints && city.entryPoints.length > 0 && city.routes && (
          <RoutePlanner
            entryPoints={city.entryPoints}
            routes={city.routes}
            language={language}
          />
        )}

        {/* Hotels & Accommodation - Enhanced with Filters */}
        {city.hotels && city.hotels.length > 0 && (
          <PlacesToStay hotels={city.hotels} language={language} />
        )}

        {/* Cuisine Section – last 2 cards (e.g. Tulsi, Varuna) removed; Explore more in Quick View sidebar */}
        {city.restaurants && city.restaurants.length > 0 && (
          <CuisineSection
            restaurants={city.restaurants.length > 2 ? city.restaurants.slice(0, -2) : city.restaurants}
            language={language}
            exploreSlug={citySlug}
          />
        )}

        {/* Transport & Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 lg:gap-8 mb-10 sm:mb-12">
          {/* Transport Info – full content visible, no Know More */}
          {city.transportInfo && (
            <div className="card-modern rounded-2xl p-5 sm:p-6 md:p-8 shadow-temple border-l-4 border-primary-gold relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-temple opacity-5 rounded-full -mr-16 -mt-16"></div>
              <div className="flex items-center gap-5 mb-6 relative z-10">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-temple flex items-center justify-center text-3xl shadow-temple">
                  🚗
                </div>
                <h3 className="text-2xl font-bold text-primary-dark">
                  Transport Information
                </h3>
              </div>
              <p className="text-sm sm:text-base text-primary-dark/80 leading-relaxed relative z-10 whitespace-pre-line">
                {getLocalizedContent(city.transportInfo, language)}
              </p>
            </div>
          )}

          {/* Weather & Best Time */}
          {city.weatherInfo && (
            <div className="card-modern rounded-2xl p-5 sm:p-6 md:p-8 shadow-temple border-l-4 border-primary-saffron relative overflow-hidden h-full">
              {/* Decorative gradient background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-temple opacity-5 rounded-full -mr-16 -mt-16"></div>
              <div className="flex items-center gap-5 mb-6 relative z-10">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-temple flex items-center justify-center text-3xl shadow-temple">
                  🌤️
                </div>
                <h3 className="text-2xl font-bold text-primary-dark">
                  Weather & Best Time to Visit
                </h3>
              </div>
              <div className="space-y-4 relative z-10">
                <div className="bg-primary-gold/10 rounded-lg p-4">
                  <p className="text-sm text-primary-dark/70 mb-2 font-medium">
                    {t('best.time', language)}
                  </p>
                  <p className="font-bold text-primary-dark text-base">
                    {city.weatherInfo.bestTimeToVisit}
                  </p>
                </div>
                <div className="bg-primary-saffron/10 rounded-lg p-4">
                  <p className="text-sm text-primary-dark/70 mb-2 font-medium">
                    {t('temperature', language)}
                  </p>
                  <p className="font-bold text-primary-dark text-sm sm:text-base">
                    {city.weatherInfo.averageTemp}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Emergency Contacts */}
        {city.emergencyContacts && city.emergencyContacts.length > 0 && (
          <section className="card-modern rounded-2xl p-5 sm:p-6 md:p-8 shadow-temple border-l-4 border-primary-maroon relative overflow-hidden mb-10 sm:mb-12">
            {/* Decorative gradient background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-temple opacity-5 rounded-full -mr-16 -mt-16"></div>
            <div className="flex items-center gap-5 mb-6 relative z-10">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-temple flex items-center justify-center text-3xl shadow-temple">
                🆘
              </div>
              <h3 className="text-2xl font-bold text-primary-dark">
                Emergency Contacts
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 relative z-10">
              {city.emergencyContacts.map((contact, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-primary-gold/10 to-primary-saffron/5 rounded-xl p-4 sm:p-5 border border-primary-gold/20"
                >
                  <p className="font-bold text-primary-dark mb-2 sm:mb-3 text-sm sm:text-base">
                    {contact.name}
                  </p>
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-primary-gold font-semibold text-sm sm:text-base break-all flex items-center gap-2 py-2 px-2 -mx-2 rounded-lg hover:bg-primary-gold/10 transition-colors touch-manipulation min-h-[44px]"
                  >
                    <span className="text-lg">📞</span> {contact.phone}
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

