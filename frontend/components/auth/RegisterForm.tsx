'use client';

import { useState, useEffect } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth, initializeFirebase } from '@/lib/firebase';
import { validatePhoneNumber, formatPhoneNumber } from '@/lib/utils';
import toast from 'react-hot-toast';

interface RegisterFormProps {
  onSuccess: (token: string, user: any) => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [step, setStep] = useState<'details' | 'otp'>('details');
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
      toast.error('Firebase authentication is not configured. Please check backend environment variables.');
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

      // Verify with backend - Register (with name)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/register`, {
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
        toast.success('Account created successfully! You are now logged in.');
        onSuccess(data.token, data.user);
      } else {
        throw new Error(data.error || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast.error(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    'w-full px-5 py-3 rounded-full border border-black/10 bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue/50 transition-all duration-200 placeholder:text-black/35 text-premium-section-text';
  const btnPrimary =
    'w-full px-6 py-3.5 rounded-full font-medium text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]';
  const btnSecondary =
    'flex-1 px-6 py-3 rounded-full font-medium border border-primary-blue/40 text-primary-blue bg-white hover:bg-primary-blue/5 transition-all duration-200';

  return (
    <div className="w-full max-w-md mx-auto">
      <div id="recaptcha-container" className="sr-only" aria-hidden="true" />

      {step === 'details' ? (
        <form onSubmit={handleSendOTP} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-premium-section-text mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className={`${inputBase} focus:ring-0 focus:border-black/10`}
              required
              minLength={2}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-premium-section-text mb-2">
              Phone Number
            </label>
            <div className="flex rounded-full border border-black/10 bg-white/80 transition-all duration-200 shadow-sm">
              <span
                className="inline-flex items-center pl-5 pr-4 py-3 rounded-l-full text-sm font-medium text-premium-section-text border-r border-black/10"
                style={{ background: 'linear-gradient(135deg, #FFF8E7 0%, #F5E6D8 100%)' }}
              >
                +91
              </span>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="9876543210"
                className="flex-1 min-w-0 px-4 py-3 pr-5 rounded-r-full bg-transparent focus:outline-none text-premium-section-text placeholder:text-black/35"
                required
                maxLength={10}
              />
            </div>
            {phone && (
              <p className="mt-1.5 text-xs text-premium-section-muted">{formatPhoneNumber(phone)}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={btnPrimary}
            style={{ background: 'linear-gradient(145deg, #1E3A8A 0%, #163072 100%)' }}
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sending OTP...
              </span>
            ) : (
              'Send OTP'
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-5">
          <div>
            <div
              className="rounded-full px-4 py-2.5 mb-4 text-sm text-premium-section-text/90"
              style={{ background: 'linear-gradient(135deg, #FFF8E7 0%, #F5E6D8 100%)' }}
            >
              <span className="text-premium-section-muted">OTP sent to </span>
              <span className="font-semibold text-premium-section-text">{formatPhoneNumber(phone)}</span>
            </div>
            <label htmlFor="otp" className="block text-sm font-medium text-premium-section-text mb-2">
              Enter 6-digit code
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              className="w-full px-5 py-3.5 rounded-full border border-black/10 bg-white/80 text-center text-2xl tracking-[0.35em] font-semibold text-premium-section-text placeholder:text-black/30 focus:outline-none focus:ring-0 focus:border-black/10 transition-all duration-200"
              required
              maxLength={6}
              autoFocus
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                setStep('details');
                setOtp('');
                setConfirmationResult(null);
              }}
              className={`${btnSecondary} w-full sm:flex-1 sm:shrink-0 whitespace-nowrap`}
            >
              Change Number
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`${btnPrimary} w-full sm:flex-1 sm:min-w-0`}
              style={{ background: 'linear-gradient(145deg, #1E3A8A 0%, #163072 100%)' }}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verifying...
                </span>
              ) : (
                'Verify OTP'
              )}
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

