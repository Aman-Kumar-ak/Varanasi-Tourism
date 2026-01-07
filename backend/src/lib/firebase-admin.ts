import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    // Option 1: Load from file path (easiest for local development)
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    if (serviceAccountPath) {
      const fullPath = path.resolve(__dirname, '../../', serviceAccountPath);
      if (fs.existsSync(fullPath)) {
        const serviceAccount = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        console.log('✅ Firebase Admin SDK initialized from file:', serviceAccountPath);
      } else {
        throw new Error(`Firebase service account file not found: ${fullPath}`);
      }
    }
    // Option 2: Use service account JSON string from environment variable (for production)
    else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('✅ Firebase Admin SDK initialized with service account from environment');
    } 
    // Option 3: Use project ID (for development/testing - limited functionality)
    else if (process.env.FIREBASE_PROJECT_ID) {
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
      console.log('✅ Firebase Admin SDK initialized with project ID');
    } else {
      // In development, allow the app to run without Firebase Admin (for testing)
      // But log a warning
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Firebase Admin SDK not configured. Set FIREBASE_SERVICE_ACCOUNT_PATH, FIREBASE_SERVICE_ACCOUNT_KEY, or FIREBASE_PROJECT_ID');
      }
      console.warn('⚠️  Firebase Admin SDK not configured. Token verification will be skipped.');
      console.warn('   Set FIREBASE_SERVICE_ACCOUNT_PATH, FIREBASE_SERVICE_ACCOUNT_KEY, or FIREBASE_PROJECT_ID in .env');
    }
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', error);
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  }
}

export default admin;

/**
 * Verify Firebase ID token
 * Returns decoded token if valid, null if invalid
 */
export async function verifyFirebaseToken(idToken: string): Promise<admin.auth.DecodedIdToken | null> {
  // If Firebase Admin is not initialized, skip verification in development
  if (!admin.apps.length) {
    if (process.env.NODE_ENV === 'production') {
      console.error('Firebase Admin SDK not initialized. Cannot verify token.');
      return null;
    }
    // In development, allow skipping verification
    console.warn('⚠️  Skipping Firebase token verification (Firebase Admin not configured)');
    return null;
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error('Firebase token verification failed:', error);
    return null;
  }
}

