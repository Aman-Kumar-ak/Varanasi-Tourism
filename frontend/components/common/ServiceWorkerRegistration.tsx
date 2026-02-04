'use client';

import { useEffect } from 'react';
import { registerServiceWorker } from '@/lib/serviceWorker';

/**
 * Component to register service worker on client side
 */
export default function ServiceWorkerRegistration() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
}
