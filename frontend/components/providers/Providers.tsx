'use client';

import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { FontSizeProvider } from '@/contexts/FontSizeContext';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: React.ReactNode }) {
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

