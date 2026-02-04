/**
 * Cache invalidation utilities
 * Provides functions to invalidate cache when data changes
 */

import { invalidateCache, clearAllCache } from './cache';
import { clearServiceWorkerCache } from './serviceWorker';

/**
 * Invalidate cache for a specific resource type
 */
export async function invalidateResourceCache(resourceType: 'cities' | 'jyotirlingas' | 'quotes' | 'all'): Promise<void> {
  if (typeof window === 'undefined') return;
  
  switch (resourceType) {
    case 'cities':
      invalidateCache('/api/cities');
      break;
    case 'jyotirlingas':
      invalidateCache('/api/jyotirlingas');
      break;
    case 'quotes':
      invalidateCache('/api/quotes');
      break;
    case 'all':
      clearAllCache();
      await clearServiceWorkerCache();
      break;
  }
}

/**
 * Invalidate cache for a specific city
 */
export function invalidateCityCache(citySlug: string): void {
  if (typeof window === 'undefined') return;
  invalidateCache(`/api/cities/${citySlug}`);
}

/**
 * Invalidate cache for a specific temple
 */
export function invalidateTempleCache(templeSlug: string): void {
  if (typeof window === 'undefined') return;
  invalidateCache(`/api/jyotirlingas/${templeSlug}`);
}

/**
 * Force refresh all caches
 * Call this when admin updates content
 */
export async function forceRefreshCache(): Promise<void> {
  if (typeof window === 'undefined') return;
  
  // Clear all localStorage cache
  clearAllCache();
  
  // Clear service worker cache
  await clearServiceWorkerCache();
  
  // Reload page to fetch fresh data
  window.location.reload();
}
