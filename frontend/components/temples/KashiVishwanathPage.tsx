'use client';

import { useState, useEffect } from 'react';
import { getLocalizedContent } from '@/lib/i18n';
import { getApiUrl } from '@/lib/utils';
import type { LanguageCode } from '@/lib/constants';
import DarshanInfoSection from './DarshanInfoSection';

interface DarshanType {
  _id: string;
  name: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  price: number;
  duration: number;
  dailyLimit: number;
  description?: {
    en: string;
    hi: string;
    [key: string]: string;
  };
}

interface Temple {
  _id: string;
  slug: string;
  name: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  city: string;
  state: string;
  images: string[];
  location: {
    lat: number;
    lng: number;
  };
  templeRules: string[];
  nearbyPlaces: string[];
  bookingEnabled?: boolean;
  officialBookingUrl?: string;
}

interface KashiVishwanathPageProps {
  temple: Temple;
  language: LanguageCode;
}

export default function KashiVishwanathPage({ temple, language }: KashiVishwanathPageProps) {
  const [darshanTypes, setDarshanTypes] = useState<DarshanType[]>([]);
  const [loadingDarshanTypes, setLoadingDarshanTypes] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (temple.slug) {
      fetchDarshanTypes();
    }
  }, [temple.slug]);

  const fetchDarshanTypes = async () => {
    try {
      setLoadingDarshanTypes(true);
      setError(null);
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/jyotirlingas/${temple.slug}/darshan-types`);
      const data = await response.json();

      if (data.success) {
        setDarshanTypes(data.data || []);
      } else {
        setError(data.error || 'Failed to load darshan types');
      }
    } catch (error) {
      console.error('Error fetching darshan types:', error);
      setError('Unable to load darshan types. Please try again later.');
    } finally {
      setLoadingDarshanTypes(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-parchment">
      {/* Custom Hero Section for Kashi Vishwanath */}
      <section className="relative h-[500px] bg-primary-blue">
        <div className="absolute inset-0 bg-primary-dark/30"></div>
        <div className="container mx-auto px-4 relative z-10 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              {getLocalizedContent(temple.name, language as any)}
            </h1>
            <p className="text-2xl text-white/90 mb-6">
              The Spiritual Capital of India
            </p>
            <p className="text-lg text-white/80">
              Varanasi, Uttar Pradesh
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Booking Section - Prominent Display */}
        <section className="bg-white rounded-xl p-6 shadow-lg mb-8 border border-primary-blue/10">
          {loadingDarshanTypes ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary-blue mb-3"></div>
              <p className="text-primary-dark/60">Loading darshan types...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchDarshanTypes}
                className="px-6 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors font-medium"
              >
                Retry
              </button>
            </div>
          ) : (
            <DarshanInfoSection
              darshanTypes={darshanTypes}
              bookingEnabled={temple.bookingEnabled || false}
              officialBookingUrl={temple.officialBookingUrl}
              language={language}
              templeSlug={temple.slug}
            />
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Custom for Kashi */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Shri Kashi Vishwanath */}
            <section className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-primary-dark mb-4">
                About Shri Kashi Vishwanath—The Eternal Guardian of Kashi
              </h2>
              <p className="text-primary-dark/80 leading-relaxed mb-4">
                In the heart of the ancient city of Varanasi resides Shri Kashi Vishwanath, revered as Lord Shiva in his most sacred form. Known as the Lord of the Universe, Vishwanath (Adi Vishweshwara), the ruler of the universe, is believed to be the eternal protector of Kashi, the city of light. For millions of devotees, he is not just a deity but a guiding presence who watches over life, death, and the soul&apos;s journey toward liberation.
              </p>
              <p className="text-primary-dark/80 leading-relaxed">
                Shri Kashi Vishwanath is worshipped as one of the twelve Jyotirlingas, the most powerful manifestations of Lord Shiva. According to belief, Shiva himself chose Kashi as his eternal home, making this city a sacred gateway to moksha—freedom from the cycle of birth and rebirth. Stepping into Kashi means entering Shiva&apos;s city. And standing before Vishwanath means facing eternity.
              </p>
            </section>

            {/* The Shri Kashi Vishwanath Temple */}
            <section className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-primary-dark mb-4">
                The Shri Kashi Vishwanath Temple—The Soul of Varanasi
              </h2>
              <p className="text-primary-dark/80 leading-relaxed mb-4">
                Standing close to the holy Ganga, the Shri Kashi Vishwanath Temple is the spiritual heart of Varanasi. It is not just a place of worship—it is a living symbol of faith that has drawn pilgrims for thousands of years. Every day, the temple echoes with the sound of bells, mantras, and prayers. Devotees walk through its ancient corridors with folded hands and hopeful hearts, believing that even a single darshan of Vishwanath can change the course of one&apos;s life.
              </p>
              <p className="text-primary-dark/80 leading-relaxed">
                The temple is known for its golden spire, sacred Jyotirlinga, and powerful spiritual atmosphere. It is here that people come to pray for peace, strength, forgiveness, and guidance. For many, this temple is not a destination—it is a calling.
              </p>
            </section>

            {/* History */}
            <section className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-primary-dark mb-4">
                History—A Timeless History Carved in Faith
              </h2>
              <p className="text-primary-dark/80 leading-relaxed mb-4">
                The history of the Shri Kashi Vishwanath Temple stretches back more than 2000 years, making it one of the oldest living centers of worship in the world. Ancient Hindu scriptures such as the Skanda Purana and Kashi Khanda speak of this sacred shrine and its divine importance. Over the centuries, the temple witnessed both glory and hardship. It was destroyed and rebuilt several times during medieval invasions, yet the devotion of the people never faded. Even when the structure fell, worship continued—proving that faith is stronger than stone.
              </p>
              <p className="text-primary-dark/80 leading-relaxed">
                In 1780, the temple was rebuilt in its present form by the devoted Maratha queen Ahilyabai Holkar of Indore. Later, in 1835, Maharaja Ranjit Singh of the Sikh Empire donated gold to cover the temple spire, giving it the title of the Golden Temple of Kashi. In recent years, the development of the Kashi Vishwanath Corridor has beautifully restored the temple&apos;s grandeur and improved access for pilgrims while preserving its sacred heritage.
              </p>
            </section>

            {/* Today's Significance */}
            <section className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-primary-dark mb-4">
                Today&apos;s Significance
              </h2>
              <p className="text-primary-dark/80 leading-relaxed mb-4">
                Today, the temple stands strong—calm yet powerful. Devotees believe that a single visit here can free a soul from the cycle of birth and death. The sound of bells, the scent of incense, and the chants of &quot;OM Namah Parwati Pataye Har Har Mahadev.&quot;
              </p>
              <p className="text-primary-dark/80 leading-relaxed font-medium">
                &quot;Kashi is not just a city; it is a living prayer—and Kashi (BABA) Vishwanath is its soul.&quot;
              </p>
            </section>

            {/* Daily Aartis at Shri Kashi Vishwanath Temple */}
            <section className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold text-primary-dark mb-4">
                Daily Aartis at Shri Kashi Vishwanath Temple
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-primary-dark mb-2">Mangala Aarti (3:00 AM – 4:00 AM)</h3>
                  <p className="text-primary-dark/80 leading-relaxed">
                    The Mangala Aarti is the sacred opening ritual of the day at the Kashi Vishwanath Temple, performed in the calm and quiet hours before sunrise. As early as 2:30 AM, devotees enter the temple as its doors open to begin this divine ceremony. Inside, priests gently awaken Lord Shiva with the rhythmic flow of Vedic chants, the deep call of conch shells, and the echo of temple bells. Golden lamps are lifted and moved in graceful circles, symbolizing the victory of light over darkness and wisdom over ignorance. For those who witness it, the Mangala Aarti feels like a spiritual sunrise. It marks the birth of a new day and the renewal of the soul&apos;s journey. Devotees believe this sacred moment washes away sins and invites Lord Shiva&apos;s blessings for the journey ahead. In the stillness of the early dawn, when the world is asleep, Kashi is already praying. And in that silence, faith speaks the loudest.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary-dark mb-2">Bhog Aarti (11:15 AM – 12:20 PM)</h3>
                  <p className="text-primary-dark/80 leading-relaxed">
                    The Bhog Aarti, performed in the late morning at the Kashi Vishwanath Temple, is a beautiful expression of gratitude offered through food. During this ritual, freshly prepared traditional dishes are lovingly presented to Lord Shiva as bhog. As priests chant sacred mantras and wave incense and lamps, the atmosphere fills with devotion and warmth. After the offering, the food is shared as prasadam, which devotees receive as a blessing from the divine. This aarti gently reminds everyone that every meal is a gift from a supreme power. For many visitors, the Bhog Aarti feels deeply grounding—a sacred pause that connects daily life with spiritual devotion.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary-dark mb-2">Saptarishi Aarti (7:00 PM – 8:15 PM)</h3>
                  <p className="text-primary-dark/80 leading-relaxed">
                    Late in the evening, the Shringar Aarti unfolds as a celebration of Lord Shiva&apos;s divine beauty. During this graceful ritual, the deity is lovingly adorned with fresh flowers, fine garments, shimmering jewelry, and fragrant sandalwood paste, revealing Shiva in his most radiant form. The sanctum fills with the perfume of incense and blossoms, while lamps glow softly and hymns rise in devotion. For those watching, the Shringar Aarti feels like a moment of pure elegance—a reminder that devotion is not only about prayer but also about offering beauty, care, and the very best to the Supreme.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary-dark mb-2">Shayan Aarti (10:30 PM – 11:00 PM)</h3>
                  <p className="text-primary-dark/80 leading-relaxed">
                    The day gently comes to a close with the Shayan Aarti, the final ritual before the temple doors are shut for the night. In this serene ceremony, priests symbolically prepare Lord Shiva for rest, offering soft, lullaby-like chants and tender waves of glowing lamps. The lights dim, the chants slow, and a deep sense of peace settles over the sanctum. The Shayan Aarti reflects rest, protection, and surrender—a reminder of life&apos;s natural rhythm. For many pilgrims, this moment feels deeply personal, like whispering goodnight to the Lord before stepping back into the world.
                  </p>
                </div>
              </div>
            </section>

            {/* About Dashashwamedh Ghat */}
            <section className="bg-primary-gold rounded-xl p-6 text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-4">About Dashashwamedh Ghat</h2>
              <p className="text-white/90 leading-relaxed mb-4">
                Dashashwamedh Ghat stands as the most vibrant and celebrated riverfront of Varanasi, located just a short walk from the sacred Kashi Vishwanath Temple. It is here that the spirit of the city feels most alive—where devotion, tradition, and daily life flow together along the banks of the holy Ganga.
              </p>
              <p className="text-white/90 leading-relaxed mb-4">
                The name Dashashwamedh comes from ancient legend: Dash meaning ten, Ashwa meaning horse, and Medh meaning sacrifice. It is believed that Lord Brahma performed a grand yajna here, offering ten horses to welcome Lord Shiva to Kashi. As evening falls, the ghat transforms into a breathtaking stage for the world-famous Ganga Aarti. Priests dressed in traditional attire perform synchronized rituals with towering fire lamps, incense, flowers, and conch shells. The sound of bells and chants fills the air as rows of glowing flames reflect on the river, creating a powerful spiritual atmosphere that leaves visitors deeply moved.
              </p>
              <p className="text-white/90 leading-relaxed">
                Its close proximity to the Kashi Vishwanath Temple adds to its importance, as many devotees begin their spiritual journey here before heading for temple darshan. More than just a place of ritual, Dashashwamedh Ghat captures the living soul of Varanasi—a place where faith is not only practiced, but truly felt.
              </p>
            </section>

            {/* Temple Rules */}
            {temple.templeRules && temple.templeRules.length > 0 && (
              <section className="bg-white rounded-xl p-6 shadow-md">
                <h2 className="text-2xl font-bold text-primary-dark mb-4">
                  Temple Guidelines
                </h2>
                <ul className="space-y-2">
                  {temple.templeRules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2 text-primary-dark/80">
                      <span className="text-primary-orange mt-1">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <section className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-bold text-primary-dark mb-4">Quick Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-primary-blue">📍</span>
                  <span className="text-primary-dark/70">Varanasi, Uttar Pradesh</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary-blue">⏰</span>
                  <span className="text-primary-dark/70">Open: 3:00 AM - 11:00 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary-blue">🌊</span>
                  <span className="text-primary-dark/70">Ganga Aarti: 6:30 PM</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

