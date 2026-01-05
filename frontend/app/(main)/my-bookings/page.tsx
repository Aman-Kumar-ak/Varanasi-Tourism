'use client';

import Link from 'next/link';

export default function MyBookingsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-parchment">
      <div className="text-center bg-white rounded-xl shadow-md p-8 max-w-md">
        <div className="text-6xl mb-4">🚧</div>
        <h2 className="text-2xl font-bold text-primary-dark mb-4">My Bookings Coming Soon</h2>
        <p className="text-primary-dark/70 mb-6">
          We're currently in guide mode, helping you discover and learn about sacred places.
          Booking management will be available soon when we integrate with official temple trust booking systems.
        </p>
        <div className="flex flex-col gap-3">
          <Link
            href="/jyotirlingas"
            className="inline-block px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors"
          >
            Explore Jyotirlingas
          </Link>
          <Link
            href="/cities"
            className="inline-block px-6 py-3 border border-primary-orange text-primary-orange rounded-lg hover:bg-primary-orange/10 transition-colors"
          >
            Discover Cities
          </Link>
        </div>
      </div>
    </div>
  );
}

