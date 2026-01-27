'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';
import { getLocalizedContent } from '@/lib/i18n';
import type { LanguageCode } from '@/lib/constants';

interface TopAttraction {
  name: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  slug: string;
  image?: string;
  icon: string;
}

const topAttractions: TopAttraction[] = [
  {
    name: {
      en: 'Kashi Vishwanath Temple',
      hi: 'श्री काशी विश्वनाथ मंदिर',
      gu: 'કાશી વિશ્વનાથ મંદિર',
      ta: 'காசி விஸ்வநாதர் கோயில்',
      te: 'కాశీ విశ్వనాథ దేవాలయం',
      mr: 'काशी विश्वनाथ मंदिर',
      bn: 'কাশী বিশ্বনাথ মন্দির',
      kn: 'ಕಾಶಿ ವಿಶ್ವನಾಥ ದೇವಸ್ಥಾನ',
      ml: 'കാശി വിശ്വനാഥ ക്ഷേത്രം',
      or: 'କାଶୀ ବିଶ୍ଵନାଥ ମନ୍ଦିର',
      pa: 'ਕਾਸ਼ੀ ਵਿਸ਼ਵਨਾਥ ਮੰਦਿਰ',
      as: 'কাশী বিশ্বনাথ মন্দিৰ',
      ur: 'کاشی وشوناتھ مندر',
    },
    slug: 'kashi-vishwanath-temple',
    icon: '🕉️',
  },
  {
    name: {
      en: 'Assi Ghat',
      hi: 'अस्सी घाट',
      gu: 'અસ્સી ઘાટ',
      ta: 'அஸ்ஸி கடை',
      te: 'అస్సీ ఘాట్',
      mr: 'अस्सी घाट',
      bn: 'আসি ঘাট',
      kn: 'ಅಸ್ಸಿ ಘಾಟ್',
      ml: 'അസ്സി ഘാട്ട്',
      or: 'ଅସ୍ସୀ ଘାଟ',
      pa: 'ਅੱਸੀ ਘਾਟ',
      as: 'আসি ঘাট',
      ur: 'اسی گھاٹ',
    },
    slug: 'assi-ghat',
    icon: '🌊',
  },
  {
    name: {
      en: 'Manikarnika Ghat',
      hi: 'मणिकर्णिका घाट',
      gu: 'મણિકર્ણિકા ઘાટ',
      ta: 'மணிகர்ணிகா கடை',
      te: 'మణికర్ణిక ఘాట్',
      mr: 'मणिकर्णिका घाट',
      bn: 'মণিকর্ণিকা ঘাট',
      kn: 'ಮಣಿಕರ್ಣಿಕ ಘಾಟ್',
      ml: 'മണികർണിക ഘാട്ട്',
      or: 'ମଣିକର୍ଣ୍ଣିକା ଘାଟ',
      pa: 'ਮਣਿਕਰਨਿਕਾ ਘਾਟ',
      as: 'মণিকৰ্ণিকা ঘাট',
      ur: 'منیکرنیکا گھاٹ',
    },
    slug: 'manikarnika-ghat',
    icon: '🕯️',
  },
  {
    name: {
      en: 'Namo Ghat',
      hi: 'नमो घाट',
      gu: 'નમો ઘાટ',
      ta: 'நமோ கடை',
      te: 'నమో ఘాట్',
      mr: 'नमो घाट',
      bn: 'নমো ঘাট',
      kn: 'ನಮೋ ಘಾಟ್',
      ml: 'നമോ ഘാട്ട്',
      or: 'ନମୋ ଘାଟ',
      pa: 'ਨਮੋ ਘਾਟ',
      as: 'নমো ঘাট',
      ur: 'نامو گھاٹ',
    },
    slug: 'namo-ghat',
    icon: '🛕',
  },
  {
    name: {
      en: 'Shri Durga Temple',
      hi: 'श्री दुर्गा मंदिर',
      gu: 'શ્રી દુર્ગા મંદિર',
      ta: 'ஸ்ரீ துர்கா கோயில்',
      te: 'శ్రీ దుర్గ దేవాలయం',
      mr: 'श्री दुर्गा मंदिर',
      bn: 'শ্রী দুর্গা মন্দির',
      kn: 'ಶ್ರೀ ದುರ್ಗ ದೇವಸ್ಥಾನ',
      ml: 'ശ്രീ ദുർഗ ക്ഷേത്രം',
      or: 'ଶ୍ରୀ ଦୁର୍ଗା ମନ୍ଦିର',
      pa: 'ਸ਼੍ਰੀ ਦੁਰਗਾ ਮੰਦਿਰ',
      as: 'শ্ৰী দুৰ্গা মন্দিৰ',
      ur: 'شری درگا مندر',
    },
    slug: 'shri-durga-temple',
    icon: '🕉️',
  },
];

export default function TopAttractions() {
  const { language } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % topAttractions.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + topAttractions.length) % topAttractions.length);
  };

  return (
    <section className="mb-8 sm:mb-12 lg:mb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-dark mb-2 sm:mb-3">
            {t('top.attractions.title', language)}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {t('top.attractions.subtitle', language)}
          </p>
        </div>

        {/* Mobile: Carousel */}
        <div className="block sm:hidden">
          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {topAttractions.map((attraction, index) => (
                  <div key={index} className="min-w-full">
                    <Link
                      href={`/city/varanasi#${attraction.slug}`}
                      className="block bg-white rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden group"
                    >
                      <div className="relative h-48 bg-gradient-to-br from-primary-orange/20 to-primary-gold/20 flex items-center justify-center">
                        <span className="text-6xl">{attraction.icon}</span>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-primary-dark text-center group-hover:text-primary-orange transition-colors">
                          {getLocalizedContent(attraction.name, language)}
                        </h3>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md border border-primary-orange/40 text-primary-orange flex items-center justify-center z-10"
              aria-label="Previous"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md border border-primary-orange/40 text-primary-orange flex items-center justify-center z-10"
              aria-label="Next"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {topAttractions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-primary-orange w-6'
                    : 'bg-slate-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
          {topAttractions.map((attraction, index) => (
            <Link
              key={index}
              href={`/city/varanasi#${attraction.slug}`}
              className="bg-white rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-32 lg:h-40 bg-gradient-to-br from-primary-orange/20 to-primary-gold/20 flex items-center justify-center group-hover:from-primary-orange/30 group-hover:to-primary-gold/30 transition-all">
                <span className="text-5xl lg:text-6xl">{attraction.icon}</span>
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-primary-dark text-center group-hover:text-primary-orange transition-colors">
                  {getLocalizedContent(attraction.name, language)}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
