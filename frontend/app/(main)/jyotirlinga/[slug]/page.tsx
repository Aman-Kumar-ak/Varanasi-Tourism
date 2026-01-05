'use client';

import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getApiUrl } from '@/lib/utils';

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
      <p className="mt-4 text-primary-dark/70">Loading temple details...</p>
    </div>
  </div>
);

// Default template component
const DefaultTemplePage = dynamic(() => import('@/components/temples/DefaultTemplePage'), {
  loading: () => <LoadingSpinner />,
});

// Individual temple page components
const KashiVishwanathPage = dynamic(() => import('@/components/temples/KashiVishwanathPage'), {
  loading: () => <LoadingSpinner />,
});

const ComingSoonPage = dynamic(() => import('@/components/temples/ComingSoonPage'), {
  loading: () => <LoadingSpinner />,
});

// Map of temple IDs or names to their custom components
// Only Kashi Vishwanath has full functionality, all others show Coming Soon
const TEMPLE_PAGE_MAP: Record<string, React.ComponentType<any>> = {
  'kashi-vishwanath': KashiVishwanathPage,
  // All other temples will use ComingSoonPage
  'somnath': ComingSoonPage,
  'mahakaleshwar': ComingSoonPage,
  'mallikarjuna': ComingSoonPage,
  'omkareshwar': ComingSoonPage,
  'kedarnath': ComingSoonPage,
  'bhimashankar': ComingSoonPage,
  'trimbakeshwar': ComingSoonPage,
  'vaidyanath': ComingSoonPage,
  'nageshwar': ComingSoonPage,
  'ramanathaswamy': ComingSoonPage,
  'grishneshwar': ComingSoonPage,
};

interface Jyotirlinga {
  _id: string;
  slug: string;
  name: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  city: string;
  state: string;
  stateCode: string;
  images: string[];
  location: {
    lat: number;
    lng: number;
  };
  templeRules: string[];
  nearbyPlaces: string[];
  pageTemplate?: string;
  bookingEnabled?: boolean;
  officialBookingUrl?: string;
  spiritualSignificance?: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  history?: {
    en: string;
    hi: string;
    [key: string]: string;
  };
  darshanInfo?: {
    en: string;
    hi: string;
    [key: string]: string;
  };
}

export default function JyotirlingaDetailPage() {
  const params = useParams();
  const { language } = useLanguage();
  const [temple, setTemple] = useState<Jyotirlinga | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      fetchTempleDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.slug]);

  const fetchTempleDetails = async () => {
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/jyotirlingas/${params.slug}`);
      const data = await response.json();

      if (data.success) {
        setTemple(data.data);
      }
    } catch (error) {
      console.error('Error fetching temple details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!temple) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">Temple Not Found</h2>
          <a href="/jyotirlingas" className="text-primary-blue hover:underline">
            Back to Jyotirlingas
          </a>
        </div>
      </div>
    );
  }

  // Determine which component to use
  const pageTemplate = temple.pageTemplate || temple.slug;
  const TempleComponent = TEMPLE_PAGE_MAP[pageTemplate] || ComingSoonPage;

  return <TempleComponent temple={temple} language={language} />;
}

