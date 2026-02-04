/**
 * Client-side caching utility with version-based invalidation
 * Provides intelligent caching for API responses, images, and videos
 */

const CACHE_VERSION = '1.0.0';
const CACHE_PREFIX = 'vt_cache_';
const VERSION_KEY = `${CACHE_PREFIX}version`;

// Cache duration constants (in milliseconds)
export const CACHE_DURATIONS = {
  STATIC: 7 * 24 * 60 * 60 * 1000, // 7 days for static data (cities, temples)
  SEMI_STATIC: 24 * 60 * 60 * 1000, // 24 hours for semi-static data (quotes, config)
  DYNAMIC: 5 * 60 * 1000, // 5 minutes for dynamic data (bookings, user data)
  IMAGES: 30 * 24 * 60 * 60 * 1000, // 30 days for images
  VIDEOS: 30 * 24 * 60 * 60 * 1000, // 30 days for videos
};

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  version: string;
  expiresAt: number;
}

/**
 * Check if cache version is valid
 */
function isValidCacheVersion(): boolean {
  if (typeof window === 'undefined') return false;
  
  const storedVersion = localStorage.getItem(VERSION_KEY);
  if (!storedVersion) {
    localStorage.setItem(VERSION_KEY, CACHE_VERSION);
    return false; // First time, clear any old cache
  }
  
  if (storedVersion !== CACHE_VERSION) {
    // Version mismatch - clear all cache
    clearAllCache();
    localStorage.setItem(VERSION_KEY, CACHE_VERSION);
    return false;
  }
  
  return true;
}

/**
 * Clear all cached data
 */
export function clearAllCache(): void {
  if (typeof window === 'undefined') return;
  
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith(CACHE_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
}

/**
 * Get cache key for a URL
 */
function getCacheKey(url: string): string {
  // Remove query parameters for cache key (except version params)
  const urlObj = new URL(url, window.location.origin);
  const params = new URLSearchParams(urlObj.search);
  
  // Remove cache-busting parameters
  params.delete('t');
  params.delete('_t');
  params.delete('timestamp');
  
  urlObj.search = params.toString();
  return `${CACHE_PREFIX}${urlObj.pathname}${urlObj.search}`;
}

/**
 * Get cached data
 */
export function getCachedData<T>(url: string): T | null {
  if (typeof window === 'undefined') return null;
  
  // Check cache version first
  if (!isValidCacheVersion()) {
    return null;
  }
  
  const cacheKey = getCacheKey(url);
  const cached = localStorage.getItem(cacheKey);
  
  if (!cached) return null;
  
  try {
    const entry: CacheEntry<T> = JSON.parse(cached);
    const now = Date.now();
    
    // Check if expired
    if (now > entry.expiresAt) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    // Check version
    if (entry.version !== CACHE_VERSION) {
      localStorage.removeItem(cacheKey);
      return null;
    }
    
    return entry.data;
  } catch (error) {
    console.error('Error reading cache:', error);
    localStorage.removeItem(cacheKey);
    return null;
  }
}

/**
 * Set cached data
 */
export function setCachedData<T>(
  url: string,
  data: T,
  duration: number = CACHE_DURATIONS.STATIC
): void {
  if (typeof window === 'undefined') return;
  
  const cacheKey = getCacheKey(url);
  const now = Date.now();
  
  const entry: CacheEntry<T> = {
    data,
    timestamp: now,
    version: CACHE_VERSION,
    expiresAt: now + duration,
  };
  
  try {
    localStorage.setItem(cacheKey, JSON.stringify(entry));
  } catch (error) {
    // Handle quota exceeded error
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.warn('Cache storage quota exceeded, clearing old cache');
      // Clear oldest 50% of cache entries
      clearOldCacheEntries();
      // Retry
      try {
        localStorage.setItem(cacheKey, JSON.stringify(entry));
      } catch (retryError) {
        console.error('Failed to cache data after cleanup:', retryError);
      }
    } else {
      console.error('Error caching data:', error);
    }
  }
}

/**
 * Clear old cache entries when storage is full
 */
function clearOldCacheEntries(): void {
  if (typeof window === 'undefined') return;
  
  const entries: Array<{ key: string; expiresAt: number }> = [];
  
  // Collect all cache entries
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith(CACHE_PREFIX) && key !== VERSION_KEY) {
      try {
        const cached = localStorage.getItem(key);
        if (cached) {
          const entry = JSON.parse(cached) as CacheEntry<any>;
          entries.push({ key, expiresAt: entry.expiresAt });
        }
      } catch {
        // Invalid entry, remove it
        localStorage.removeItem(key);
      }
    }
  });
  
  // Sort by expiration time (oldest first)
  entries.sort((a, b) => a.expiresAt - b.expiresAt);
  
  // Remove oldest 50%
  const toRemove = Math.floor(entries.length / 2);
  for (let i = 0; i < toRemove; i++) {
    localStorage.removeItem(entries[i].key);
  }
}

/**
 * Invalidate cache for a specific URL pattern
 */
export function invalidateCache(pattern: string): void {
  if (typeof window === 'undefined') return;
  
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith(CACHE_PREFIX) && key.includes(pattern)) {
      localStorage.removeItem(key);
    }
  });
}

/**
 * Get cache statistics
 */
export function getCacheStats(): {
  entries: number;
  totalSize: number;
  oldestEntry: number | null;
  newestEntry: number | null;
} {
  if (typeof window === 'undefined') {
    return { entries: 0, totalSize: 0, oldestEntry: null, newestEntry: null };
  }
  
  const keys = Object.keys(localStorage);
  let entries = 0;
  let totalSize = 0;
  let oldestEntry: number | null = null;
  let newestEntry: number | null = null;
  
  keys.forEach(key => {
    if (key.startsWith(CACHE_PREFIX) && key !== VERSION_KEY) {
      try {
        const cached = localStorage.getItem(key);
        if (cached) {
          entries++;
          totalSize += cached.length;
          const entry = JSON.parse(cached) as CacheEntry<any>;
          
          if (oldestEntry === null || entry.timestamp < oldestEntry) {
            oldestEntry = entry.timestamp;
          }
          if (newestEntry === null || entry.timestamp > newestEntry) {
            newestEntry = entry.timestamp;
          }
        }
      } catch {
        // Skip invalid entries
      }
    }
  });
  
  return { entries, totalSize, oldestEntry, newestEntry };
}

/**
 * Enhanced fetch with caching
 */
export async function cachedFetch<T>(
  url: string,
  options: RequestInit = {},
  cacheDuration: number = CACHE_DURATIONS.STATIC
): Promise<T> {
  // Try cache first
  const cached = getCachedData<T>(url);
  if (cached !== null) {
    return cached;
  }
  
  // Fetch from network
  const response = await fetch(url, {
    ...options,
    // Remove cache: 'no-store' if present, use default caching
    cache: options.cache === 'no-store' ? 'default' : options.cache,
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Cache the response
  setCachedData(url, data, cacheDuration);
  
  return data;
}
