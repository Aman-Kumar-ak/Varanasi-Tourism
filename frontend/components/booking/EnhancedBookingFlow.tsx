'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency, formatDate, getApiUrl } from '@/lib/utils';
import toast from 'react-hot-toast';
// import { useAuth } from '@/contexts/AuthContext';

interface Jyotirlinga {
  _id: string;
  slug: string;
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

interface TimeSlot {
  _id: string;
  startTime: string;
  endTime: string;
}

interface Attendee {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  idProof?: string;
  idProofNumber?: string;
}

interface BookingFlowProps {
  jyotirlingaId: string;
  darshanTypeId: string;
  date: string;
  timeSlotId: string;
}

export default function EnhancedBookingFlow({
  jyotirlingaId,
  darshanTypeId,
  date,
  timeSlotId,
}: BookingFlowProps) {
  const router = useRouter();
  // const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [temple, setTemple] = useState<Jyotirlinga | null>(null);
  const [darshanType, setDarshanType] = useState<DarshanType | null>(null);
  const [timeSlot, setTimeSlot] = useState<TimeSlot | null>(null);

  // Form data
  const [primaryContact, setPrimaryContact] = useState({
    name: '',
    phone: '',
    email: '',
  });

  // Load user data from localStorage if available
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setPrimaryContact({
            name: user.name || '',
            phone: user.phone || '',
            email: '',
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
  }, []);
  const [adults, setAdults] = useState<Attendee[]>([
    { name: '', age: 18, gender: 'male' },
  ]);
  const [children, setChildren] = useState<Attendee[]>([]);

  useEffect(() => {
    fetchBookingDetails();
  }, []);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl();

      // Fetch temple by ID (backend now supports both slug and ObjectId)
      const templeRes = await fetch(`${apiUrl}/api/jyotirlingas/${jyotirlingaId}`);
      const templeData = await templeRes.json();

      if (templeData.success && templeData.data) {
        setTemple(templeData.data);
        const templeSlug = templeData.data.slug || jyotirlingaId;

        // Fetch darshan types using slug
        const darshanRes = await fetch(`${apiUrl}/api/jyotirlingas/${templeSlug}/darshan-types`);
        const darshanData = await darshanRes.json();

        if (darshanData.success && darshanData.data) {
          const type = darshanData.data.find((dt: DarshanType) => dt._id === darshanTypeId);
          if (type) {
            setDarshanType(type);
          } else {
            console.error('Darshan type not found:', darshanTypeId);
            toast.error('Darshan type not found');
          }
        } else {
          console.error('Failed to fetch darshan types:', darshanData);
          toast.error('Failed to load darshan types');
        }

        // Fetch time slot
        const slotRes = await fetch(`${apiUrl}/api/time-slots/${timeSlotId}`);
        if (slotRes.ok) {
          const slotData = await slotRes.json();
          if (slotData.success) {
            setTimeSlot(slotData.data);
          }
        } else {
          console.error('Failed to fetch time slot');
        }
      } else {
        console.error('Temple not found:', jyotirlingaId);
        toast.error('Temple not found');
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      toast.error('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const addAdult = () => {
    setAdults([...adults, { name: '', age: 18, gender: 'male' }]);
  };

  const removeAdult = (index: number) => {
    if (adults.length > 1) {
      setAdults(adults.filter((_, i) => i !== index));
    } else {
      toast.error('At least one adult is required');
    }
  };

  const updateAdult = (index: number, field: keyof Attendee, value: any) => {
    const updated = [...adults];
    updated[index] = { ...updated[index], [field]: value };
    setAdults(updated);
  };

  const addChild = () => {
    setChildren([...children, { name: '', age: 5, gender: 'male' }]);
  };

  const removeChild = (index: number) => {
    setChildren(children.filter((_, i) => i !== index));
  };

  const updateChild = (index: number, field: keyof Attendee, value: any) => {
    const updated = [...children];
    updated[index] = { ...updated[index], [field]: value };
    setChildren(updated);
  };

  const calculateTotal = () => {
    if (!darshanType) return 0;
    // Children under 5 are usually free, but we'll charge for all for now
    const totalAttendees = adults.length + children.length;
    return darshanType.price * totalAttendees;
  };

  const validateForm = () => {
    if (!primaryContact.name.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (!primaryContact.phone.trim()) {
      toast.error('Please enter your phone number');
      return false;
    }
    if (adults.some((a) => !a.name.trim())) {
      toast.error('Please enter name for all adults');
      return false;
    }
    if (children.some((c) => !c.name.trim())) {
      toast.error('Please enter name for all children');
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const apiUrl = getApiUrl();
      const token = localStorage.getItem('authToken');

      if (!token) {
        toast.error('Please login to continue');
        router.push('/login');
        return;
      }

      // Get temple ID (ensure we use the actual _id, not slug)
      const templeId = temple?._id || jyotirlingaId;

      // Create booking
      const bookingData = {
        jyotirlingaId: templeId,
        darshanTypeId,
        timeSlotId,
        date,
        primaryContact,
        adults,
        children,
        amount: calculateTotal(),
      };

      const response = await fetch(`${apiUrl}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (data.success) {
        // Simulate payment (demo mode)
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        // Update booking with payment
        const paymentResponse = await fetch(`${apiUrl}/api/bookings/${data.data._id}/payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            paymentId: `demo_${Date.now()}`,
            paymentStatus: 'completed',
          }),
        });

        const paymentData = await paymentResponse.json();
        
        if (paymentData.success) {
          toast.success('Booking confirmed! Generating receipt...');
          router.push(`/booking/receipt/${data.data._id}`);
        } else {
          throw new Error('Payment processing failed');
        }
      } else {
        throw new Error(data.error || 'Failed to create booking');
      }
    } catch (error: any) {
      console.error('Error processing booking:', error);
      toast.error(error.message || 'Failed to process booking. Please try again.');
    } finally {
      setSubmitting(false);
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

  if (!temple || !darshanType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-parchment">
        <div className="text-center bg-white rounded-xl shadow-md p-8 max-w-md">
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
    <div className="min-h-screen bg-background-parchment py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-primary-dark mb-4">Complete Your Booking</h1>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-primary-dark">
              {temple.name.en || temple.name.hi}
            </p>
            <p className="text-primary-dark/70">
              {temple.city}, {temple.state}
            </p>
            <div className="flex items-center gap-4 pt-2 border-t border-primary-blue/20">
              <span className="text-primary-dark/70">
                Darshan: <span className="font-semibold text-primary-dark">
                  {darshanType.name.en || darshanType.name.hi}
                </span>
              </span>
              <span className="text-primary-dark/70">
                Date: <span className="font-semibold text-primary-dark">{formatDate(new Date(date))}</span>
              </span>
              {timeSlot && (
                <span className="text-primary-dark/70">
                  Time: <span className="font-semibold text-primary-dark">
                    {timeSlot.startTime} - {timeSlot.endTime}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
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
                    {stepNum === 1 ? 'Attendees' : stepNum === 2 ? 'Payment' : 'Receipt'}
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

        {/* Step 1: Attendee Details */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
            <h2 className="text-2xl font-bold text-primary-dark mb-4">Attendee Information</h2>

            {/* Primary Contact */}
            <div className="border-b border-primary-blue/20 pb-6">
              <h3 className="text-lg font-semibold text-primary-dark mb-4">Primary Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary-dark mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={primaryContact.name}
                    onChange={(e) => setPrimaryContact({ ...primaryContact, name: e.target.value })}
                    className="w-full px-4 py-2 border border-primary-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-dark mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={primaryContact.phone}
                    onChange={(e) => setPrimaryContact({ ...primaryContact, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-primary-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-primary-dark mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={primaryContact.email}
                    onChange={(e) => setPrimaryContact({ ...primaryContact, email: e.target.value })}
                    className="w-full px-4 py-2 border border-primary-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  />
                </div>
              </div>
            </div>

            {/* Adults */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary-dark">
                  Adults ({adults.length})
                </h3>
                <button
                  onClick={addAdult}
                  className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 text-sm font-medium"
                >
                  + Add Adult
                </button>
              </div>
              <div className="space-y-4">
                {adults.map((adult, index) => (
                  <div key={index} className="border border-primary-blue/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium text-primary-dark">Adult {index + 1}</span>
                      {adults.length > 1 && (
                        <button
                          onClick={() => removeAdult(index)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-primary-dark mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={adult.name}
                          onChange={(e) => updateAdult(index, 'name', e.target.value)}
                          className="w-full px-4 py-2 border border-primary-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary-dark mb-2">
                          Age *
                        </label>
                        <input
                          type="number"
                          min="18"
                          value={adult.age}
                          onChange={(e) => updateAdult(index, 'age', parseInt(e.target.value))}
                          className="w-full px-4 py-2 border border-primary-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-primary-dark mb-2">
                          Gender *
                        </label>
                        <select
                          value={adult.gender}
                          onChange={(e) => updateAdult(index, 'gender', e.target.value)}
                          className="w-full px-4 py-2 border border-primary-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                          required
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Children */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary-dark">
                  Children ({children.length})
                </h3>
                <button
                  onClick={addChild}
                  className="px-4 py-2 bg-primary-teal text-white rounded-lg hover:bg-primary-teal/90 text-sm font-medium"
                >
                  + Add Child
                </button>
              </div>
              {children.length === 0 ? (
                <p className="text-primary-dark/60 text-sm">No children added</p>
              ) : (
                <div className="space-y-4">
                  {children.map((child, index) => (
                    <div key={index} className="border border-primary-teal/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium text-primary-dark">Child {index + 1}</span>
                        <button
                          onClick={() => removeChild(index)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-primary-dark mb-2">
                            Name *
                          </label>
                          <input
                            type="text"
                            value={child.name}
                            onChange={(e) => updateChild(index, 'name', e.target.value)}
                            className="w-full px-4 py-2 border border-primary-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-primary-dark mb-2">
                            Age *
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="17"
                            value={child.age}
                            onChange={(e) => updateChild(index, 'age', parseInt(e.target.value))}
                            className="w-full px-4 py-2 border border-primary-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-primary-dark mb-2">
                            Gender *
                          </label>
                          <select
                            value={child.gender}
                            onChange={(e) => updateChild(index, 'gender', e.target.value)}
                            className="w-full px-4 py-2 border border-primary-blue/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                            required
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="bg-background-parchment rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-primary-dark/70">Total Attendees:</p>
                  <p className="text-lg font-semibold text-primary-dark">
                    {adults.length} Adult{adults.length !== 1 ? 's' : ''}
                    {children.length > 0 && `, ${children.length} Child${children.length !== 1 ? 'ren' : ''}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-primary-dark/70">Total Amount:</p>
                  <p className="text-2xl font-bold text-primary-orange">
                    {formatCurrency(calculateTotal())}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full px-8 py-4 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 transition-colors font-bold text-lg"
            >
              Proceed to Payment
            </button>
          </div>
        )}

        {/* Step 2: Payment (Demo) */}
        {step === 2 && (
          <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
            <div className="mb-4">
              <button
                onClick={() => setStep(1)}
                className="text-primary-blue hover:underline mb-4"
              >
                ← Back to Attendees
              </button>
              <h2 className="text-2xl font-bold text-primary-dark mb-4">Payment</h2>
            </div>

            {/* Booking Summary */}
            <div className="bg-background-parchment rounded-lg p-6 space-y-3">
              <h3 className="font-semibold text-primary-dark mb-4">Booking Summary</h3>
              <div className="flex justify-between">
                <span className="text-primary-dark/70">Temple:</span>
                <span className="font-semibold text-primary-dark">
                  {temple.name.en || temple.name.hi}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-dark/70">Darshan Type:</span>
                <span className="font-semibold text-primary-dark">
                  {darshanType.name.en || darshanType.name.hi}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-dark/70">Date & Time:</span>
                <span className="font-semibold text-primary-dark">
                  {formatDate(new Date(date))} {timeSlot && `(${timeSlot.startTime} - ${timeSlot.endTime})`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-dark/70">Attendees:</span>
                <span className="font-semibold text-primary-dark">
                  {adults.length} Adult{adults.length !== 1 ? 's' : ''}
                  {children.length > 0 && `, ${children.length} Child${children.length !== 1 ? 'ren' : ''}`}
                </span>
              </div>
              <div className="border-t border-primary-dark/20 pt-3 mt-3">
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-primary-dark">Total Amount:</span>
                  <span className="font-bold text-primary-orange text-2xl">
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>
              </div>
            </div>

            {/* Demo Payment Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Demo Mode:</strong> This is a demonstration payment. No actual payment will be processed.
                Click "Complete Payment" to proceed with the booking.
              </p>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={submitting}
              className="w-full px-8 py-4 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Processing Payment...' : 'Complete Payment (Demo)'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

