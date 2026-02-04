'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CityCarousel() {
  const router = useRouter();
  const cities = [
    {
      name: 'Varanasi',
      state: 'Uttar Pradesh',
      jyotirlinga: 'Kashi Vishwanath',
      image: '🏛️',
      description: 'The spiritual capital of India',
    },
    {
      name: 'Somnath',
      state: 'Gujarat',
      jyotirlinga: 'Somnath Temple',
      image: '🌊',
      description: 'The first among 12 Jyotirlingas',
    },
    {
      name: 'Ujjain',
      state: 'Madhya Pradesh',
      jyotirlinga: 'Mahakaleshwar',
      image: '⛰️',
      description: 'Famous for Bhasma Aarti',
    },
    {
      name: 'Rameshwaram',
      state: 'Tamil Nadu',
      jyotirlinga: 'Ramanathaswamy',
      image: '🌊',
      description: 'Southernmost Jyotirlinga',
    },
    {
      name: 'Dwarka',
      state: 'Gujarat',
      jyotirlinga: 'Nageshwar',
      image: '🏛️',
      description: 'Ancient temple by the sea',
    },
    {
      name: 'Kedarnath',
      state: 'Uttarakhand',
      jyotirlinga: 'Kedarnath',
      image: '⛰️',
      description: 'Himalayan pilgrimage site',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prefetchCity = useCallback((slug: string) => {
    router.prefetch(`/city/${slug}`);
    router.prefetch(`/city/${slug}/explore`);
  }, [router]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % cities.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + cities.length) % cities.length);
  };

  return (
    <section className="py-16 bg-background-parchment">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">
            Popular Cities
          </h2>
          <p className="text-lg text-primary-dark/70 max-w-2xl mx-auto">
            Explore these spiritual destinations
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* City Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city, index) => {
              const slug = city.name.toLowerCase();
              return (
              <Link
                key={index}
                href={`/city/${slug}`}
                onMouseEnter={() => prefetchCity(slug)}
                onFocus={() => prefetchCity(slug)}
                onTouchStart={() => prefetchCity(slug)}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-primary-blue/5 hover:border-primary-blue/20"
              >
                {/* City Image/Icon */}
                <div className="h-48 bg-background-parchment flex items-center justify-center border-b border-primary-blue/10">
                  <span className="text-8xl">{city.image}</span>
                </div>

                {/* City Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-primary-dark mb-2">
                    {city.name}
                  </h3>
                  <p className="text-sm text-primary-gold font-semibold mb-2">
                    {city.jyotirlinga}
                  </p>
                  <p className="text-sm text-primary-dark/60 mb-4">
                    {city.state}
                  </p>
                  <p className="text-sm text-primary-dark/70 mb-4">
                    {city.description}
                  </p>
                  <span className="inline-block px-4 py-2 bg-primary-blue text-white rounded-lg text-sm font-medium hover:bg-primary-blue/90 transition-colors">
                    Explore City
                  </span>
                </div>
              </Link>
            );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

