import { type LanguageCode, SUPPORTED_LANGUAGES } from './constants';

/**
 * Get multi-language content based on current language
 * Falls back to English if translation not available
 */
export function getLocalizedContent<T extends Record<string, any> | undefined>(
  content: T,
  language: LanguageCode
): string {
  if (!content) return '';
  
  // Ensure content is an object (handle Mongoose documents, etc.)
  const contentObj: Record<string, any> = typeof content === 'object' && content !== null ? content : {};
  
  // Try to get content in requested language
  if (contentObj[language] && typeof contentObj[language] === 'string') {
    return contentObj[language];
  }
  
  // Fallback to English
  if (contentObj.en && typeof contentObj.en === 'string') {
    return contentObj.en;
  }
  
  // Fallback to Hindi
  if (contentObj.hi && typeof contentObj.hi === 'string') {
    return contentObj.hi;
  }
  
  // Try to find any available language translation
  for (const lang of SUPPORTED_LANGUAGES) {
    if (contentObj[lang.code] && typeof contentObj[lang.code] === 'string') {
      return contentObj[lang.code];
    }
  }
  
  // Return first available string value
  const firstValue = Object.values(contentObj).find(
    (val) => typeof val === 'string' && val.length > 0
  );
  return (firstValue as string) || '';
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

