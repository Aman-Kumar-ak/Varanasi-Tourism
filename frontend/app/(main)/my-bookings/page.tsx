'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
import { getLocalizedContent } from '@/lib/i18n';
import { useLanguage } from '@/contexts/LanguageContext';
import toast from 'react-hot-toast';

interface Booking {
  _id: string;
  receiptNumber: string;
  date: string;
  amount: number;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  status: 'confirmed' | 'cancelled' | 'completed';
  jyotirlingaId: {
    _id: string;
    name: {
      en: string;
      hi: string;
      [key: string]: string;
    };
    city: string;
    state: string;
  };
  darshanTypeId: {
    _id: string;
    name: {
      en: string;
      hi: string;
      [key: string]: string;
    };
    price: number;
  };
  timeSlotId: {
    _id: string;
    startTime: string;
    endTime: string;
  };
}

export default function MyBookingsPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/bookings/my-bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setBookings(data.data || []);
      } else {
        toast.error(data.error || 'Failed to load bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-parchment">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
          <p className="mt-4 text-primary-dark/70">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-parchment py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary-dark mb-2">My Bookings</h1>
          <p className="text-primary-dark/70">
            View and manage all your Darshan bookings
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-primary-dark mb-2">No Bookings Yet</h2>
            <p className="text-primary-dark/70 mb-6">
              You haven't made any bookings yet. Start your spiritual journey today!
            </p>
            <Link
              href="/jyotirlingas"
              className="inline-block px-6 py-3 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 transition-colors font-semibold"
            >
              Book Darshan Now
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Booking Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-primary-dark mb-1">
                            {getLocalizedContent(booking.jyotirlingaId.name, language)}
                          </h3>
                          <p className="text-sm text-primary-dark/60">
                            {booking.jyotirlingaId.city}, {booking.jyotirlingaId.state}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary-orange mb-1">
                            {formatCurrency(booking.amount)}
                          </div>
                          <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                            booking.paymentStatus === 'completed'
                              ? 'bg-primary-teal/20 text-primary-teal'
                              : booking.paymentStatus === 'pending'
                              ? 'bg-primary-orange/20 text-primary-orange'
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {booking.paymentStatus === 'completed' ? 'Paid' : 
                             booking.paymentStatus === 'pending' ? 'Payment Pending' : 
                             'Payment Failed'}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-primary-dark/60">Darshan Type:</span>
                          <p className="font-semibold text-primary-dark">
                            {getLocalizedContent(booking.darshanTypeId.name, language)}
                          </p>
                        </div>
                        <div>
                          <span className="text-primary-dark/60">Date:</span>
                          <p className="font-semibold text-primary-dark">
                            {formatDate(booking.date)}
                          </p>
                        </div>
                        <div>
                          <span className="text-primary-dark/60">Time:</span>
                          <p className="font-semibold text-primary-dark">
                            {formatTime(booking.timeSlotId.startTime)} - {formatTime(booking.timeSlotId.endTime)}
                          </p>
                        </div>
                        <div>
                          <span className="text-primary-dark/60">Receipt:</span>
                          <p className="font-semibold text-primary-dark font-mono text-xs">
                            {booking.receiptNumber}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 md:w-48">
                      <Link
                        href={`/booking/confirm/${booking._id}`}
                        className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors text-center font-medium text-sm"
                      >
                        View Details
                      </Link>
                      {booking.paymentStatus === 'completed' && (
                        <Link
                          href={`/receipt/${booking._id}`}
                          className="px-4 py-2 border border-primary-teal text-primary-teal rounded-lg hover:bg-primary-teal/10 transition-colors text-center font-medium text-sm"
                        >
                          Download Receipt
                        </Link>
                      )}
                      {booking.paymentStatus === 'pending' && (
                        <button
                          onClick={() => {
                            // TODO: Navigate to payment
                            toast.success('Payment integration coming soon');
                          }}
                          className="px-4 py-2 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 transition-colors font-medium text-sm"
                        >
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

