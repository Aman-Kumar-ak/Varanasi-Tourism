'use client';

import { useState, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth, initializeFirebase } from '@/lib/firebase';
import { validatePhoneNumber, formatPhoneNumber } from '@/lib/utils';
import toast from 'react-hot-toast';

interface PhoneLoginProps {
  onSuccess: (token: string, user: any) => void;
}

export default function PhoneLogin({ onSuccess }: PhoneLoginProps) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  useEffect(() => {
    // Initialize Firebase and reCAPTCHA
    const init = async () => {
      if (typeof window === 'undefined') return;

      try {
        // Ensure Firebase is initialized
        await initializeFirebase();

        // Check if auth is available before initializing reCAPTCHA
        if (!auth) {
          console.warn('Firebase auth not available. Authentication features may not work.');
          return;
        }

        // Clean up existing verifier if present
        if (window.recaptchaVerifier) {
          try {
            window.recaptchaVerifier.clear();
          } catch (e) {
            // Ignore cleanup errors
          }
          window.recaptchaVerifier = null as any;
        }

        // Initialize new reCAPTCHA verifier
        try {
          window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
            callback: () => {
              // reCAPTCHA solved
            },
            'expired-callback': () => {
              toast.error('reCAPTCHA expired. Please try again.');
            },
          });
        } catch (error: any) {
          console.error('Error initializing reCAPTCHA:', error);
          // Don't show toast on every navigation - only log the error
          if (error?.code !== 'auth/invalid-api-key') {
            toast.error('Firebase authentication is not configured. Please check backend environment variables.');
          }
        }
      } catch (error: any) {
        console.error('Error initializing Firebase:', error);
        // Only show error toast if it's not an invalid API key (to avoid spam)
        if (error?.message && !error.message.includes('invalid-api-key')) {
          toast.error('Failed to initialize Firebase. Please check backend configuration.');
        }
      }
    };

    init();

    // Cleanup function
    return () => {
      if (typeof window !== 'undefined' && window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {
          // Ignore cleanup errors
        }
        window.recaptchaVerifier = null as any;
      }
    };
  }, []);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || name.length < 2) {
      toast.error('Please enter a valid name (at least 2 characters)');
      return;
    }

    if (!validatePhoneNumber(phone)) {
      toast.error('Please enter a valid 10-digit Indian phone number');
      return;
    }

    if (!auth) {
      toast.error('Firebase authentication is not configured. Please check environment variables.');
      return;
    }

    setLoading(true);
    try {
      const phoneNumber = `+91${phone.replace(/\D/g, '')}`;
      const appVerifier = window.recaptchaVerifier;

      if (!appVerifier) {
        toast.error('reCAPTCHA not initialized. Please refresh the page.');
        return;
      }

      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setStep('otp');
      toast.success('OTP sent to your phone!');
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      toast.error(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const firebaseToken = await result.user.getIdToken();

      // Verify with backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone.replace(/\D/g, ''),
          name: name.trim(),
          firebaseToken,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('authToken', data.token);
        toast.success('Login successful!');
        onSuccess(data.token, data.user);
      } else {
        throw new Error(data.error || 'Verification failed');
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast.error(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div id="recaptcha-container"></div>

      {step === 'phone' ? (
        <form onSubmit={handleSendOTP} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-primary-dark mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border border-primary-blue/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              required
              minLength={2}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-primary-dark mb-2">
              Phone Number
            </label>
            <div className="flex items-center gap-2">
              <span className="px-3 py-3 bg-background-parchment rounded-l-lg border border-r-0 border-primary-blue/30 text-primary-dark">
                +91
              </span>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="9876543210"
                className="flex-1 px-4 py-3 border border-primary-blue/30 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                required
                maxLength={10}
              />
            </div>
            {phone && (
              <p className="mt-1 text-sm text-primary-dark/60">
                {formatPhoneNumber(phone)}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <div>
            <p className="text-sm text-primary-dark/80 mb-4">
              OTP sent to <span className="font-semibold">{formatPhoneNumber(phone)}</span>
            </p>
            <label htmlFor="otp" className="block text-sm font-medium text-primary-dark mb-2">
              Enter OTP
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="w-full px-4 py-3 border border-primary-blue/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent text-center text-2xl tracking-widest"
              required
              maxLength={6}
              autoFocus
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => {
                setStep('phone');
                setOtp('');
                setConfirmationResult(null);
              }}
              className="flex-1 px-6 py-3 border border-primary-blue text-primary-blue rounded-lg hover:bg-primary-blue/10 transition-colors font-medium"
            >
              Change Number
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// Extend Window interface for reCAPTCHA
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

