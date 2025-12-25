'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
import toast from 'react-hot-toast';

interface BookingDetails {
  _id: string;
  receiptNumber: string;
  date: string;
  amount: number;
  paymentStatus: string;
  status: string;
  jyotirlingaId: {
    _id: string;
    name: {
      en: string;
      hi: string;
    };
    city: string;
    state: string;
  };
  darshanTypeId: {
    _id: string;
    name: {
      en: string;
      hi: string;
    };
    price: number;
  };
  timeSlotId: {
    _id: string;
    startTime: string;
    endTime: string;
  };
}

export default function BookingConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchBookingDetails();
    }
  }, [params.id]);

  const fetchBookingDetails = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/bookings/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setBooking(data.data);
      } else {
        toast.error(data.error || 'Booking not found');
        router.push('/my-bookings');
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast.error('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-parchment">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
          <p className="mt-4 text-primary-dark/70">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-parchment">
        <div className="text-center bg-white rounded-xl shadow-md p-8 max-w-md">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">Booking Not Found</h2>
          <Link
            href="/my-bookings"
            className="inline-block px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors"
          >
            View My Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-parchment py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Message */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6 text-center">
          <div className="w-20 h-20 bg-primary-teal rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="text-3xl font-bold text-primary-dark mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-primary-dark/70">
            Your booking has been created successfully
          </p>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-primary-dark mb-6">Booking Details</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between py-3 border-b border-primary-blue/20">
              <span className="text-primary-dark/70">Receipt Number:</span>
              <span className="font-semibold text-primary-dark">{booking.receiptNumber}</span>
            </div>
            
            <div className="flex justify-between py-3 border-b border-primary-blue/20">
              <span className="text-primary-dark/70">Temple:</span>
              <span className="font-semibold text-primary-dark text-right">
                {booking.jyotirlingaId.name.en || booking.jyotirlingaId.name.hi}
              </span>
            </div>
            
            <div className="flex justify-between py-3 border-b border-primary-blue/20">
              <span className="text-primary-dark/70">Location:</span>
              <span className="font-semibold text-primary-dark text-right">
                {booking.jyotirlingaId.city}, {booking.jyotirlingaId.state}
              </span>
            </div>
            
            <div className="flex justify-between py-3 border-b border-primary-blue/20">
              <span className="text-primary-dark/70">Darshan Type:</span>
              <span className="font-semibold text-primary-dark">
                {booking.darshanTypeId.name.en || booking.darshanTypeId.name.hi}
              </span>
            </div>
            
            <div className="flex justify-between py-3 border-b border-primary-blue/20">
              <span className="text-primary-dark/70">Date:</span>
              <span className="font-semibold text-primary-dark">{formatDate(booking.date)}</span>
            </div>
            
            <div className="flex justify-between py-3 border-b border-primary-blue/20">
              <span className="text-primary-dark/70">Time:</span>
              <span className="font-semibold text-primary-dark">
                {formatTime(booking.timeSlotId.startTime)} - {formatTime(booking.timeSlotId.endTime)}
              </span>
            </div>
            
            <div className="flex justify-between py-3 border-b border-primary-blue/20">
              <span className="text-primary-dark/70">Payment Status:</span>
              <span className={`font-semibold ${
                booking.paymentStatus === 'completed' ? 'text-primary-teal' : 'text-primary-orange'
              }`}>
                {booking.paymentStatus === 'completed' ? 'Paid' : 'Pending Payment'}
              </span>
            </div>
            
            <div className="flex justify-between py-3 pt-4">
              <span className="text-lg font-semibold text-primary-dark">Total Amount:</span>
              <span className="text-2xl font-bold text-primary-orange">
                {formatCurrency(booking.amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl shadow-md p-8">
          {booking.paymentStatus === 'pending' ? (
            <div className="space-y-4">
              <p className="text-primary-dark/70 text-center mb-4">
                Complete your payment to confirm your booking
              </p>
              <button
                onClick={() => {
                  // TODO: Navigate to payment page
                  toast.success('Payment integration coming soon');
                }}
                className="w-full px-8 py-4 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 transition-colors font-bold text-lg"
              >
                Proceed to Payment
              </button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-primary-teal font-semibold mb-4">
                ✓ Payment Completed
              </p>
              <Link
                href={`/receipt/${booking._id}`}
                className="inline-block px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors font-medium"
              >
                Download Receipt
              </Link>
            </div>
          )}
          
          <div className="mt-6 pt-6 border-t border-primary-blue/20">
            <Link
              href="/my-bookings"
              className="block text-center text-primary-blue hover:underline font-medium"
            >
              View All My Bookings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

