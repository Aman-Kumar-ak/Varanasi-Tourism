'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DatePicker from './DatePicker';
import SlotSelector from './SlotSelector';
import { formatCurrency, formatDate, getApiUrl } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Jyotirlinga {
  _id: string;
  name: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  city: string;
  state: string;
}

interface DarshanType {
  _id: string;
  name: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  price: number;
  duration: number;
}

interface BookingFlowProps {
  jyotirlingaId: string;
  darshanTypeId: string;
}

export default function BookingFlow({ jyotirlingaId, darshanTypeId }: BookingFlowProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [temple, setTemple] = useState<Jyotirlinga | null>(null);
  const [darshanType, setDarshanType] = useState<DarshanType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTempleAndDarshanType();
  }, [jyotirlingaId, darshanTypeId]);

  const fetchTempleAndDarshanType = async () => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      
      // First, try to fetch temple by ID (MongoDB ObjectId)
      let templeData;
      let templeRes = await fetch(`${apiUrl}/api/jyotirlingas/${jyotirlingaId}`);
      templeData = await templeRes.json();
      
      // If not found by ID (might be ObjectId), try fetching all temples and finding by ID
      if (!templeData.success) {
        const allTemplesRes = await fetch(`${apiUrl}/api/jyotirlingas`);
        const allTemplesData = await allTemplesRes.json();
        if (allTemplesData.success && allTemplesData.data) {
          const foundTemple = allTemplesData.data.find((t: any) => t._id === jyotirlingaId);
          if (foundTemple) {
            templeData = { success: true, data: foundTemple };
          }
        }
      }

      if (templeData.success && templeData.data) {
        setTemple(templeData.data);
        const templeSlug = templeData.data.slug || jyotirlingaId;
        
        // Fetch darshan types using slug (API expects slug)
        const darshanRes = await fetch(`${apiUrl}/api/jyotirlingas/${templeSlug}/darshan-types`);
        const darshanData = await darshanRes.json();

        if (darshanData.success && darshanData.data) {
          const type = darshanData.data.find((dt: DarshanType) => dt._id === darshanTypeId);
          if (type) {
            setDarshanType(type);
          } else {
            console.error('Darshan type not found in list:', darshanTypeId);
            toast.error('Darshan type not found');
          }
        } else {
          console.error('Failed to fetch darshan types:', darshanData);
          toast.error(darshanData.error || 'Failed to load darshan types');
        }
      } else {
        console.error('Temple not found:', jyotirlingaId);
        toast.error('Temple not found');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load booking details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlotId(null);
    setStep(2);
  };

  const handleSlotSelect = (slotId: string) => {
    setSelectedSlotId(slotId);
    setStep(3);
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedSlotId) {
      toast.error('Please select date and time slot');
      return;
    }

    // Check if user is logged in
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Please login to continue');
      router.push(`/login?redirect=/booking?temple=${jyotirlingaId}&darshan=${darshanTypeId}`);
      return;
    }

    // Get temple ID (might be slug, need to convert to ID)
    const templeId = temple?._id || jyotirlingaId;
    
    // Redirect to enhanced booking flow to collect attendee details
    router.push(
      `/booking/details?temple=${templeId}&darshan=${darshanTypeId}&date=${selectedDate.toISOString()}&slot=${selectedSlotId}`
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
          <p className="mt-4 text-primary-dark/70">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!temple || !darshanType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">Invalid Booking</h2>
          <p className="text-primary-dark/70 mb-6">Temple or Darshan type not found</p>
          <button
            onClick={() => router.push('/jyotirlingas')}
            className="px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90"
          >
            Browse Jyotirlingas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-parchment py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-primary-dark mb-4">Book Your Darshan</h1>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-primary-dark">
              {temple.name.en || temple.name.hi}
            </p>
            <p className="text-primary-dark/70">
              {temple.city}, {temple.state}
            </p>
            <div className="flex items-center gap-4 pt-2 border-t border-primary-blue/20">
              <span className="text-primary-dark/70">
                Darshan Type: <span className="font-semibold text-primary-dark">{darshanType.name.en || darshanType.name.hi}</span>
              </span>
              <span className="text-primary-orange font-bold text-xl">
                {formatCurrency(darshanType.price)}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      step >= stepNum
                        ? 'bg-primary-orange text-white'
                        : 'bg-background-parchment text-primary-dark/40'
                    }`}
                  >
                    {step > stepNum ? '✓' : stepNum}
                  </div>
                  <span className="text-xs mt-2 text-center text-primary-dark/70">
                    {stepNum === 1 ? 'Select Date' : stepNum === 2 ? 'Choose Slot' : 'Confirm'}
                  </span>
                </div>
                {stepNum < 3 && (
                  <div
                    className={`h-1 flex-1 mx-2 ${
                      step > stepNum ? 'bg-primary-orange' : 'bg-background-parchment'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {step === 1 && (
            <div>
              <DatePicker
                selectedDate={selectedDate}
                onDateChange={handleDateSelect}
                minDate={new Date()}
              />
            </div>
          )}

          {step === 2 && selectedDate && (
            <div>
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setSelectedSlotId(null);
                  }}
                  className="text-primary-blue hover:underline mb-4"
                >
                  ← Change Date
                </button>
                <p className="text-primary-dark/70 mb-4">
                  Selected Date: <span className="font-semibold text-primary-dark">{formatDate(selectedDate)}</span>
                </p>
              </div>
              <SlotSelector
                darshanTypeId={darshanTypeId}
                selectedDate={selectedDate}
                selectedSlotId={selectedSlotId}
                onSlotSelect={handleSlotSelect}
              />
            </div>
          )}

          {step === 3 && selectedDate && selectedSlotId && (
            <div>
              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setStep(2);
                  }}
                  className="text-primary-blue hover:underline mb-4"
                >
                  ← Change Time Slot
                </button>
                <h2 className="text-2xl font-bold text-primary-dark mb-4">Confirm Your Booking</h2>
              </div>

              {/* Booking Summary */}
              <div className="bg-background-parchment rounded-lg p-6 mb-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-primary-dark/70">Temple:</span>
                  <span className="font-semibold text-primary-dark">{temple.name.en || temple.name.hi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-dark/70">Darshan Type:</span>
                  <span className="font-semibold text-primary-dark">{darshanType.name.en || darshanType.name.hi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-dark/70">Date:</span>
                  <span className="font-semibold text-primary-dark">{formatDate(selectedDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-dark/70">Amount:</span>
                  <span className="font-bold text-primary-orange text-xl">{formatCurrency(darshanType.price)}</span>
                </div>
                <div className="border-t border-primary-dark/20 pt-4 mt-4">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold text-primary-dark">Total:</span>
                    <span className="font-bold text-primary-orange text-2xl">{formatCurrency(darshanType.price)}</span>
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirmBooking}
                disabled={submitting}
                className="w-full px-8 py-4 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Loading...' : 'Continue to Attendee Details'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

