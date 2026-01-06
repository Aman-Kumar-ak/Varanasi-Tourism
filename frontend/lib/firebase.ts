import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

// Get API URL from environment or fallback
const getApiUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
};

// Firebase configuration - fetched from backend
let firebaseConfig: any = null;
let configPromise: Promise<any> | null = null;

// Fetch Firebase config from backend
const fetchFirebaseConfig = async (): Promise<any> => {
  if (configPromise) {
    return configPromise;
  }

  configPromise = (async () => {
    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/config/firebase`);
      const data = await response.json();

      if (data.success && data.data) {
        return data.data;
      } else {
        throw new Error(data.error || 'Failed to fetch Firebase config');
      }
    } catch (error) {
      console.error('Error fetching Firebase config from backend:', error);
      // Fallback to environment variables if backend fetch fails
      return {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };
    }
  })();

  return configPromise;
};

// Validate Firebase configuration
const isFirebaseConfigValid = (config: any): boolean => {
  return !!(
    config?.apiKey &&
    config?.authDomain &&
    config?.projectId &&
    config?.storageBucket &&
    config?.messagingSenderId &&
    config?.appId
  );
};

// Initialize Firebase
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let initPromise: Promise<void> | null = null;

const initializeFirebase = async (): Promise<void> => {
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    if (typeof window === 'undefined') {
      return;
    }

    // Fetch config from backend
    firebaseConfig = await fetchFirebaseConfig();

    if (!isFirebaseConfigValid(firebaseConfig)) {
      console.error('Firebase configuration is missing. Please configure Firebase in backend environment variables.');
      return;
    }

    try {
      if (!getApps().length) {
        app = initializeApp(firebaseConfig);
      } else {
        app = getApps()[0];
      }
      auth = getAuth(app);
    } catch (error) {
      console.error('Firebase initialization error:', error);
    }
  })();

  return initPromise;
};

// Initialize Firebase when module loads (client-side only)
if (typeof window !== 'undefined') {
  initializeFirebase();
}

export { app, auth, initializeFirebase };

