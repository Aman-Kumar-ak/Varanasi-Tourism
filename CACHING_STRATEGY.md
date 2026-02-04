# Caching Strategy Documentation

## Overview

This document describes the comprehensive caching strategy implemented for the Varanasi Tourism website to enhance performance and reduce server load.

## Caching Layers

### 1. Browser Cache (HTTP Cache Headers)

**Backend Implementation:**
- Static data (cities, temples): 7 days cache with stale-while-revalidate
- Semi-static data (quotes, config): 24 hours cache
- Dynamic data: 5 minutes cache
- No cache for sensitive data (auth, bookings)

**Location:** `backend/src/middleware/cache.ts`

**Usage:**
```typescript
import { setCacheHeaders, CACHE_DURATIONS } from '../middleware/cache.js';

// In route handler
setCacheHeaders(res, CACHE_DURATIONS.STATIC); // 7 days
```

### 2. Client-Side Cache (localStorage)

**Implementation:** `frontend/lib/cache.ts`

**Features:**
- Version-based cache invalidation
- Automatic expiration
- Quota management (clears old cache when storage is full)
- Cache statistics

**Cache Durations:**
- Static data: 7 days
- Semi-static data: 24 hours
- Dynamic data: 5 minutes
- Images: 30 days
- Videos: 30 days

**Usage:**
```typescript
import { cachedFetch, CACHE_DURATIONS } from '@/lib/cache';

// Fetch with caching
const data = await cachedFetch<{ success: boolean; data: any }>(
  `${apiUrl}/api/cities/${cityName}`,
  {},
  CACHE_DURATIONS.STATIC
);
```

### 3. Service Worker Cache

**Implementation:** `frontend/public/sw.js`

**Features:**
- Offline support
- Aggressive caching for images/videos
- Cache-first strategy with network fallback
- Automatic cache cleanup

**Cached Resources:**
- Cloudinary images/videos (30 days)
- API responses (7 days)
- Static assets (1 year)

### 4. Next.js Image Optimization

**Configuration:** `frontend/next.config.js`

**Features:**
- Automatic image optimization
- WebP/AVIF format conversion
- Responsive image sizes
- 30-day cache for optimized images

## Cache Invalidation

### When Data Changes

When admins update content, use the cache invalidation utilities:

```typescript
import { invalidateCityCache, invalidateTempleCache, forceRefreshCache } from '@/lib/cacheInvalidation';

// Invalidate specific city cache
invalidateCityCache('varanasi');

// Invalidate specific temple cache
invalidateTempleCache('kashi-vishwanath');

// Force refresh all caches (use after major updates)
await forceRefreshCache();
```

### Version-Based Invalidation

The cache system uses version numbers. When you update the cache version in `frontend/lib/cache.ts`, all old cache entries are automatically cleared.

**To update cache version:**
1. Change `CACHE_VERSION` in `frontend/lib/cache.ts`
2. Change `CACHE_VERSION` in `frontend/public/sw.js`
3. Deploy - old caches will be automatically cleared

## Performance Benefits

### Before Caching:
- Every page load: ~2-5 API calls
- Image loading: Full resolution every time
- Video loading: No preloading
- Offline: No access

### After Caching:
- First visit: Normal loading
- Subsequent visits: Instant from cache
- Images: Optimized formats, cached
- Videos: Preloaded metadata, cached
- Offline: Basic functionality available

## Cache Statistics

Monitor cache usage:

```typescript
import { getCacheStats } from '@/lib/cache';

const stats = getCacheStats();
console.log('Cache entries:', stats.entries);
console.log('Total size:', stats.totalSize, 'bytes');
```

## Best Practices

1. **Static Data**: Use `CACHE_DURATIONS.STATIC` (7 days)
   - Cities list
   - Temples list
   - Temple details

2. **Semi-Static Data**: Use `CACHE_DURATIONS.SEMI_STATIC` (24 hours)
   - Quotes
   - Config
   - Darshan types

3. **Dynamic Data**: Use `CACHE_DURATIONS.DYNAMIC` (5 minutes)
   - User bookings
   - Real-time data

4. **Never Cache**: Sensitive data
   - Authentication tokens
   - Payment information
   - User personal data

## Troubleshooting

### Cache Not Updating

1. Check cache version matches in both files
2. Clear browser cache manually
3. Use `forceRefreshCache()` function
4. Check service worker is registered

### Storage Quota Exceeded

The cache system automatically clears old entries when storage is full. If issues persist:
1. Clear all cache: `clearAllCache()`
2. Clear service worker cache: `clearServiceWorkerCache()`

### Service Worker Not Working

1. Check browser console for errors
2. Verify `/sw.js` is accessible
3. Check HTTPS requirement (service workers need HTTPS)
4. Unregister and re-register: `unregisterServiceWorker()` then refresh

## Future Enhancements

- [ ] IndexedDB for larger cache storage
- [ ] Background sync for offline updates
- [ ] Push notifications for cache updates
- [ ] Cache warming on build time
- [ ] CDN integration for static assets
