'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { formatCurrency, formatDate, getApiUrl } from '@/lib/utils';
import { getLocalizedContent } from '@/lib/i18n';
import toast from 'react-hot-toast';

interface Booking {
  _id: string;
  receiptNumber: string;
  date: string;
  amount: number;
  paymentStatus: string;
  primaryContact: {
    name: string;
    phone: string;
    email?: string;
  };
  adults: Array<{
    name: string;
    age: number;
    gender: string;
  }>;
  children: Array<{
    name: string;
    age: number;
    gender: string;
  }>;
  jyotirlingaId: {
    name: {
      en: string;
      hi: string;
    };
    city: string;
    state: string;
  };
  darshanTypeId: {
    name: {
      en: string;
      hi: string;
    };
    price: number;
  };
  timeSlotId: {
    startTime: string;
    endTime: string;
  };
}

export default function ReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchBooking();
    }
  }, [params.id]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      const token = localStorage.getItem('authToken');

      const response = await fetch(`${apiUrl}/api/bookings/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setBooking(data.data);
      } else {
        toast.error('Booking not found');
        router.push('/my-bookings');
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast.error('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!booking) return;

    setGeneratingPDF(true);
    try {
      const apiUrl = getApiUrl();
      const token = localStorage.getItem('authToken');

      const response = await fetch(`${apiUrl}/api/receipts/${booking._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt-${booking.receiptNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('Receipt downloaded successfully!');
      } else {
        throw new Error('Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate receipt PDF');
    } finally {
      setGeneratingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-parchment">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
          <p className="mt-4 text-primary-dark/70">Loading receipt...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-parchment">
        <div className="text-center bg-white rounded-xl shadow-md p-8 max-w-md">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">Receipt Not Found</h2>
          <button
            onClick={() => router.push('/my-bookings')}
            className="px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90"
          >
            View My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-parchment py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Receipt Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          {/* Header */}
          <div className="text-center mb-8 border-b border-primary-blue/20 pb-6">
            <h1 className="text-4xl font-bold text-primary-blue mb-2">Booking Receipt</h1>
            <p className="text-primary-dark/70">Receipt Number: {booking.receiptNumber}</p>
            <p className="text-sm text-primary-dark/60 mt-2">
              Booking Date: {formatDate(new Date(booking.date))}
            </p>
          </div>

          {/* Booking Details */}
          <div className="space-y-6 mb-8">
            <div>
              <h2 className="text-xl font-bold text-primary-dark mb-4">Booking Details</h2>
              <div className="bg-background-parchment rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-primary-dark/70">Temple:</span>
                  <span className="font-semibold text-primary-dark">
                    {getLocalizedContent(booking.jyotirlingaId.name, 'en')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-dark/70">Location:</span>
                  <span className="font-semibold text-primary-dark">
                    {booking.jyotirlingaId.city}, {booking.jyotirlingaId.state}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-dark/70">Darshan Type:</span>
                  <span className="font-semibold text-primary-dark">
                    {getLocalizedContent(booking.darshanTypeId.name, 'en')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-dark/70">Date & Time:</span>
                  <span className="font-semibold text-primary-dark">
                    {formatDate(new Date(booking.date))} ({booking.timeSlotId.startTime} - {booking.timeSlotId.endTime})
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-bold text-primary-dark mb-4">Contact Information</h2>
              <div className="bg-background-parchment rounded-lg p-4 space-y-2">
                <p><span className="text-primary-dark/70">Name:</span> <span className="font-semibold text-primary-dark">{booking.primaryContact.name}</span></p>
                <p><span className="text-primary-dark/70">Phone:</span> <span className="font-semibold text-primary-dark">{booking.primaryContact.phone}</span></p>
                {booking.primaryContact.email && (
                  <p><span className="text-primary-dark/70">Email:</span> <span className="font-semibold text-primary-dark">{booking.primaryContact.email}</span></p>
                )}
              </div>
            </div>

            {/* Attendees */}
            <div>
              <h2 className="text-xl font-bold text-primary-dark mb-4">Attendees</h2>
              {booking.adults.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-primary-dark mb-2">Adults ({booking.adults.length})</h3>
                  <div className="bg-background-parchment rounded-lg p-4 space-y-2">
                    {booking.adults.map((adult, index) => (
                      <p key={index} className="text-primary-dark">
                        {adult.name} ({adult.age} years, {adult.gender})
                      </p>
                    ))}
                  </div>
                </div>
              )}
              {booking.children.length > 0 && (
                <div>
                  <h3 className="font-semibold text-primary-dark mb-2">Children ({booking.children.length})</h3>
                  <div className="bg-background-parchment rounded-lg p-4 space-y-2">
                    {booking.children.map((child, index) => (
                      <p key={index} className="text-primary-dark">
                        {child.name} ({child.age} years, {child.gender})
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Payment Summary */}
            <div>
              <h2 className="text-xl font-bold text-primary-dark mb-4">Payment Summary</h2>
              <div className="bg-background-parchment rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-primary-dark/70">Total Attendees:</span>
                  <span className="font-semibold text-primary-dark">
                    {booking.adults.length + booking.children.length} Person{booking.adults.length + booking.children.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-dark/70">Price per Person:</span>
                  <span className="font-semibold text-primary-dark">
                    {formatCurrency(booking.darshanTypeId.price)}
                  </span>
                </div>
                <div className="border-t border-primary-dark/20 pt-3 mt-3">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-primary-dark">Total Amount:</span>
                    <span className="font-bold text-primary-orange text-2xl">
                      {formatCurrency(booking.amount)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-primary-dark/70">Payment Status:</span>
                  <span className={`font-semibold ${
                    booking.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {booking.paymentStatus === 'completed' ? '✓ Paid' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-6 border-t border-primary-blue/20">
            <button
              onClick={generatePDF}
              disabled={generatingPDF}
              className="flex-1 px-6 py-3 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 transition-colors font-semibold disabled:opacity-50"
            >
              {generatingPDF ? 'Generating PDF...' : 'Download PDF Receipt'}
            </button>
            <button
              onClick={() => router.push('/my-bookings')}
              className="px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors font-semibold"
            >
              View All Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

