'use client';

import { useSearchParams } from 'next/navigation';
import EnhancedBookingFlow from '@/components/booking/EnhancedBookingFlow';

export default function BookingDetailsPage() {
  const searchParams = useSearchParams();
  const templeId = searchParams.get('temple');
  const darshanId = searchParams.get('darshan');
  const date = searchParams.get('date');
  const slotId = searchParams.get('slot');

  if (!templeId || !darshanId || !date || !slotId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-parchment">
        <div className="text-center bg-white rounded-xl shadow-md p-8 max-w-md">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">Invalid Booking Request</h2>
          <p className="text-primary-dark/70 mb-6">
            Please select a temple, darshan type, date, and time slot to book
          </p>
          <a
            href="/jyotirlingas"
            className="inline-block px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors"
          >
            Browse Jyotirlingas
          </a>
        </div>
      </div>
    );
  }

  return (
    <EnhancedBookingFlow
      jyotirlingaId={templeId}
      darshanTypeId={darshanId}
      date={date}
      timeSlotId={slotId}
    />
  );
}

