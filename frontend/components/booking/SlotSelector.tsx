'use client';

import { useState, useEffect } from 'react';
import { formatTime } from '@/lib/utils';

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  maxBookings: number;
  booked: number;
  available: number;
  isAvailable: boolean;
}

interface SlotSelectorProps {
  darshanTypeId: string;
  selectedDate: Date | null;
  selectedSlotId: string | null;
  onSlotSelect: (slotId: string) => void;
}

export default function SlotSelector({
  darshanTypeId,
  selectedDate,
  selectedSlotId,
  onSlotSelect,
}: SlotSelectorProps) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (darshanTypeId && selectedDate) {
      fetchSlots();
    } else {
      setSlots([]);
    }
  }, [darshanTypeId, selectedDate]);

  const fetchSlots = async () => {
    if (!selectedDate) return;

    setLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await fetch(
        `${apiUrl}/api/bookings/slots?date=${dateStr}&darshanTypeId=${darshanTypeId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken') || ''}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setSlots(data.data || []);
      } else {
        setError(data.error || 'Failed to load slots');
      }
    } catch (err) {
      setError('Failed to load available slots');
      console.error('Error fetching slots:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedDate) {
    return (
      <div className="bg-background-parchment rounded-lg p-6 text-center">
        <p className="text-primary-dark/70">Please select a date first</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-background-parchment rounded-lg p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
        <p className="mt-2 text-primary-dark/70">Loading available slots...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="bg-background-parchment rounded-lg p-6 text-center">
        <p className="text-primary-dark/70">No time slots available for this date</p>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-primary-dark mb-4">
        Select Time Slot
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {slots.map((slot) => (
          <button
            key={slot.id}
            type="button"
            onClick={() => slot.isAvailable && onSlotSelect(slot.id)}
            disabled={!slot.isAvailable}
            className={`px-4 py-3 rounded-lg border-2 transition-all text-center ${
              selectedSlotId === slot.id
                ? 'border-primary-orange bg-primary-orange text-white font-semibold'
                : slot.isAvailable
                ? 'border-primary-blue/30 bg-white hover:border-primary-blue hover:bg-primary-blue/10 text-primary-dark'
                : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <div className="font-semibold">
              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
            </div>
            {slot.isAvailable ? (
              <div className="text-xs mt-1 text-primary-dark/60">
                {slot.available} available
              </div>
            ) : (
              <div className="text-xs mt-1">Fully booked</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

