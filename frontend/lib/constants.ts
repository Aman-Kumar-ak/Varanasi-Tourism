/**
 * Supported languages for the platform
 */
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

export const DEFAULT_LANGUAGE: LanguageCode = 'en';

/**
 * Indian states with their codes
 */
export const INDIAN_STATES = [
  { code: 'GJ', name: 'Gujarat', jyotirlingaCount: 2 },
  { code: 'MH', name: 'Maharashtra', jyotirlingaCount: 3 },
  { code: 'MP', name: 'Madhya Pradesh', jyotirlingaCount: 2 },
  { code: 'UP', name: 'Uttar Pradesh', jyotirlingaCount: 1 },
  { code: 'UK', name: 'Uttarakhand', jyotirlingaCount: 1 },
  { code: 'AP', name: 'Andhra Pradesh', jyotirlingaCount: 1 },
  { code: 'TN', name: 'Tamil Nadu', jyotirlingaCount: 1 },
  { code: 'JH', name: 'Jharkhand', jyotirlingaCount: 1 },
] as const;

