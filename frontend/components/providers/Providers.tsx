'use client';

import { useEffect } from 'react';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { FontSizeProvider } from '@/contexts/FontSizeContext';
import { Toaster } from 'react-hot-toast';
import { registerServiceWorker } from '@/lib/serviceWorker';

export default function Providers({ children }: { children: React.ReactNode }) {
  // Register service worker on client side
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <FontSizeProvider>
          <Toaster position="top-center" />
          {children}
        </FontSizeProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

