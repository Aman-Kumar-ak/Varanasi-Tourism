'use client';

import Link from 'next/link';

export default function FinalCTA() {
  return (
    <section className="py-20 bg-primary-dark text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.05]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Start Your Spiritual Journey Today
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Book your Darshan at any of the 12 Jyotirlingas and experience the divine blessings
          </p>
          <Link
            href="/jyotirlingas"
            className="inline-block px-10 py-4 bg-primary-orange text-white rounded-xl font-bold text-lg hover:bg-primary-orange/95 transition-all shadow-2xl hover:shadow-[0_20px_50px_rgba(254,144,0,0.4)] border-2 border-transparent hover:border-white/20"
          >
            Book Now
          </Link>
        </div>
      </div>
    </section>
  );
}

