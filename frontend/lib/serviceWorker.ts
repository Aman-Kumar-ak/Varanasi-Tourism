/**
 * Service Worker registration and management
 */

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Register service worker
 */
export function registerServiceWorker(): void {
  if (typeof window === 'undefined') return;
  
  // Only register in production or if explicitly enabled
  if (!isProduction && !process.env.NEXT_PUBLIC_ENABLE_SW) {
    return;
  }
  
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[SW] Service Worker registered:', registration.scope);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker available
                  console.log('[SW] New service worker available');
                  // Optionally notify user or auto-update
                  if (confirm('New version available! Reload to update?')) {
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('[SW] Service Worker registration failed:', error);
        });
    });
  }
}

/**
 * Unregister service worker
 */
export function unregisterServiceWorker(): void {
  if (typeof window === 'undefined') return;
  
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister().then((success) => {
        if (success) {
          console.log('[SW] Service Worker unregistered');
        }
      });
    });
  }
}

/**
 * Clear service worker cache
 */
export async function clearServiceWorkerCache(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.success);
      };
      navigator.serviceWorker.controller?.postMessage(
        { type: 'CLEAR_CACHE' },
        [messageChannel.port2]
      );
    });
  }
  
  return false;
}
