/**
 * Service Worker for Varanasi Tourism Website
 * Provides offline caching for images, videos, and static assets
 */

const CACHE_VERSION = '1.0.0';
const CACHE_NAME = `varanasi-tourism-${CACHE_VERSION}`;

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/cities',
  '/jyotirlingas',
];

// Cache duration for different resource types (in milliseconds)
const CACHE_DURATIONS = {
  IMAGES: 30 * 24 * 60 * 60 * 1000, // 30 days
  VIDEOS: 30 * 24 * 60 * 60 * 1000, // 30 days
  API: 7 * 24 * 60 * 60 * 1000, // 7 days
  STATIC: 365 * 24 * 60 * 60 * 1000, // 1 year
};

/**
 * Install event - cache static assets
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })));
    }).then(() => {
      return self.skipWaiting(); // Activate immediately
    })
  );
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim(); // Take control of all pages
    })
  );
});

/**
 * Check if URL is cacheable
 */
function isCacheable(url) {
  // Cache Cloudinary images and videos (prioritize videos for better playback)
  if (url.includes('cloudinary.com')) {
    return true;
  }
  
  // Cache API responses
  if (url.includes('/api/')) {
    return true;
  }
  
  // Cache static assets
  if (url.match(/\.(jpg|jpeg|png|gif|webp|svg|ico|woff|woff2|ttf|eot)$/i)) {
    return true;
  }
  
  return false;
}

/**
 * Get cache duration for a URL
 */
function getCacheDuration(url) {
  if (url.includes('cloudinary.com')) {
    if (url.includes('/video/')) {
      // Videos: cache longer for better playback
      return CACHE_DURATIONS.VIDEOS;
    }
    return CACHE_DURATIONS.IMAGES;
  }
  
  if (url.includes('/api/')) {
    return CACHE_DURATIONS.API;
  }
  
  return CACHE_DURATIONS.STATIC;
}

/**
 * Fetch event - implement cache-first strategy with network fallback
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Only cache specific resources
  if (!isCacheable(url.href)) {
    return;
  }
  
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        // Check if cache is still valid
        const cacheDate = cachedResponse.headers.get('sw-cache-date');
        if (cacheDate) {
          const age = Date.now() - parseInt(cacheDate, 10);
          const maxAge = getCacheDuration(url.href);
          
          if (age < maxAge) {
            return cachedResponse;
          }
        } else {
          // No date header, assume valid
          return cachedResponse;
        }
      }
      
      // Fetch from network
      return fetch(request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }
        
        // Clone the response
        const responseToCache = response.clone();
        
        // Add cache date header
        const headers = new Headers(responseToCache.headers);
        headers.set('sw-cache-date', Date.now().toString());
        
        // Cache the response
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, new Response(responseToCache.body, {
            status: responseToCache.status,
            statusText: responseToCache.statusText,
            headers: headers,
          }));
        });
        
        return response;
      }).catch((error) => {
        console.error('[SW] Fetch failed:', error);
        // Return cached version even if expired as fallback
        if (cachedResponse) {
          return cachedResponse;
        }
        throw error;
      });
    })
  );
});

/**
 * Message handler for cache invalidation
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('[SW] Clearing cache...');
    caches.delete(CACHE_NAME).then(() => {
      event.ports[0].postMessage({ success: true });
    });
  }
  
  if (event.data && event.data.type === 'CACHE_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});
