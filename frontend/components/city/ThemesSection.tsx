'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';
import SectionHeader from './SectionHeader';
import type { LanguageCode } from '@/lib/constants';

interface Theme {
  name: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  icon: string;
  description?: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  href: string;
}

const themes: Theme[] = [
  {
    name: {
      en: 'City Life',
      hi: 'शहर का जीवन',
      gu: 'શહેરનું જીવન',
      ta: 'நகர வாழ்க்கை',
      te: 'నగర జీవితం',
      mr: 'शहराचे जीवन',
      bn: 'শহরের জীবন',
      kn: 'ನಗರದ ಜೀವನ',
      ml: 'നഗര ജീവിതം',
      or: 'ସହରର ଜୀବନ',
      pa: 'ਸ਼ਹਿਰ ਦੀ ਜ਼ਿੰਦਗੀ',
      as: 'চহৰৰ জীৱন',
      ur: 'شہر کی زندگی',
    },
    icon: '🏙️',
    href: '/city/varanasi#themes-city-life',
  },
  {
    name: {
      en: 'Sports',
      hi: 'खेल',
      gu: 'ખેલ',
      ta: 'விளையாட்டு',
      te: 'క్రీడలు',
      mr: 'क्रीडा',
      bn: 'খেলাধুলা',
      kn: 'ಕ್ರೀಡೆ',
      ml: 'കായികം',
      or: 'କ୍ରୀଡା',
      pa: 'ਖੇਡਾਂ',
      as: 'ক্ৰীড়া',
      ur: 'کھیل',
    },
    icon: '⚽',
    href: '/city/varanasi#themes-sports',
  },
  {
    name: {
      en: 'Music',
      hi: 'संगीत',
      gu: 'સંગીત',
      ta: 'இசை',
      te: 'సంగీతం',
      mr: 'संगीत',
      bn: 'সংগীত',
      kn: 'ಸಂಗೀತ',
      ml: 'സംഗീതം',
      or: 'ସଙ୍ଗୀତ',
      pa: 'ਸੰਗੀਤ',
      as: 'সংগীত',
      ur: 'موسیقی',
    },
    icon: '🎵',
    href: '/city/varanasi#themes-music',
  },
  {
    name: {
      en: 'Spirituality',
      hi: 'आध्यात्मिकता',
      gu: 'આધ્યાત્મિકતા',
      ta: 'ஆன்மீகம்',
      te: 'ఆధ్యాత్మికత',
      mr: 'आध्यात्मिकता',
      bn: 'আধ্যাত্মিকতা',
      kn: 'ಆಧ್ಯಾತ್ಮಿಕತೆ',
      ml: 'ആധ്യാത്മികത',
      or: 'ଆଧ୍ୟାତ୍ମିକତା',
      pa: 'ਆਧਿਆਤਮਿਕਤਾ',
      as: 'আধ্যাত্মিকতা',
      ur: 'روحانیت',
    },
    icon: '🕉️',
    href: '/city/varanasi#themes-spirituality',
  },
  {
    name: {
      en: 'Education',
      hi: 'शिक्षा',
      gu: 'શિક્ષણ',
      ta: 'கல்வி',
      te: 'విద్య',
      mr: 'शिक्षण',
      bn: 'শিক্ষা',
      kn: 'ಶಿಕ್ಷಣ',
      ml: 'വിദ്യാഭ്യാസം',
      or: 'ଶିକ୍ଷା',
      pa: 'ਸਿੱਖਿਆ',
      as: 'শিক্ষা',
      ur: 'تعلیم',
    },
    icon: '🎓',
    href: '/city/varanasi#themes-education',
  },
];

export default function ThemesSection() {
  const { language } = useLanguage();

  return (
    <section className="mb-12" id="themes">
      <SectionHeader
        title={t('themes.title', language)}
        subtitle={t('themes.subtitle', language)}
      />
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
        {themes.map((theme, index) => (
          <Link
            key={index}
            href={theme.href}
            className="bg-white rounded-2xl shadow-lg border border-slate-200/80 p-5 sm:p-6 flex flex-col items-center text-center group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-primary-orange/20 to-primary-gold/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-3xl sm:text-4xl">{theme.icon}</span>
            </div>
            <h3 className="text-sm sm:text-base lg:text-lg font-bold text-primary-dark group-hover:text-primary-orange transition-colors">
              {theme.name[language] || theme.name.en}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
