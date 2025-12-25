'use client';

import { getLocalizedContent } from '@/lib/i18n';

interface Temple {
  _id: string;
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
}

interface ComingSoonPageProps {
  temple: Temple;
  language: string;
}

export default function ComingSoonPage({ temple, language }: ComingSoonPageProps) {
  return (
    <div className="min-h-screen bg-background-parchment">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-primary-blue to-primary-orange">
        <div className="absolute inset-0 bg-primary-dark/40"></div>
        <div className="container mx-auto px-4 relative z-10 h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              {getLocalizedContent(temple.name, language as any)}
            </h1>
            <p className="text-xl text-white/90">
              {temple.city}, {temple.state}
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-xl p-12 shadow-lg">
            <div className="mb-8">
              <div className="inline-block bg-primary-orange/10 rounded-full p-6 mb-6">
                <svg
                  className="w-24 h-24 text-primary-orange"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-primary-dark mb-4">
                {language === 'hi' ? 'जल्द ही आ रहा है' : 'Coming Soon'}
              </h2>
              <p className="text-lg text-primary-dark/70 leading-relaxed">
                {language === 'hi'
                  ? 'हम जल्द ही इस मंदिर के लिए ऑनलाइन दर्शन बुकिंग सेवा शुरू करेंगे। कृपया बाद में वापस आएं।'
                  : 'We are working on bringing online darshan booking for this temple. Please check back soon.'}
              </p>
            </div>

            <div className="border-t border-primary-blue/20 pt-8">
              <p className="text-primary-dark/60 mb-4">
                {language === 'hi'
                  ? 'इस बीच, आप अन्य ज्योतिर्लिंग मंदिरों के लिए बुकिंग कर सकते हैं।'
                  : 'In the meantime, you can book darshan for other Jyotirlinga temples.'}
              </p>
              <a
                href="/jyotirlingas"
                className="inline-block px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors font-medium"
              >
                {language === 'hi' ? 'अन्य मंदिर देखें' : 'View Other Temples'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

