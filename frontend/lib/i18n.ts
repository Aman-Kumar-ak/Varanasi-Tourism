import { type LanguageCode, SUPPORTED_LANGUAGES } from './constants';

/**
 * Get multi-language content based on current language
 * Falls back to English if translation not available
 */
export function getLocalizedContent<T extends Record<string, any>>(
  content: T,
  language: LanguageCode
): string {
  if (!content) return '';
  
  // Try to get content in requested language
  if (content[language]) {
    return content[language];
  }
  
  // Fallback to English
  if (content.en) {
    return content.en;
  }
  
  // Fallback to Hindi
  if (content.hi) {
    return content.hi;
  }
  
  // Return first available value
  return Object.values(content)[0] || '';
}

/**
 * Get all available translations for a content object
 */
export function getAllTranslations<T extends Record<string, any>>(
  content: T
): Array<{ code: LanguageCode; text: string }> {
  return SUPPORTED_LANGUAGES
    .map((lang) => ({
      code: lang.code,
      text: content[lang.code] || content.en || '',
    }))
    .filter((item) => item.text);
}

/**
 * Check if a language code is supported
 */
export function isLanguageSupported(code: string): code is LanguageCode {
  return SUPPORTED_LANGUAGES.some((lang) => lang.code === code);
}

/**
 * Get language info by code
 */
export function getLanguageInfo(code: LanguageCode) {
  return SUPPORTED_LANGUAGES.find((lang) => lang.code === code);
}

