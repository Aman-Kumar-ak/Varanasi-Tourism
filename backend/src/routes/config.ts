import express, { Request, Response } from 'express';

const router = express.Router();

// Get Firebase configuration for frontend
// This endpoint provides Firebase config without exposing it in frontend build
router.get('/firebase', (req: Request, res: Response) => {
  try {
    // Check for both naming conventions (with and without NEXT_PUBLIC_ prefix)
    // This allows flexibility in environment variable naming
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID || process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    // Validate all required fields are present
    const missingFields = Object.entries(firebaseConfig)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(500).json({
        success: false,
        error: 'Firebase configuration is incomplete',
        missingFields,
      });
    }

    res.json({
      success: true,
      data: firebaseConfig,
    });
  } catch (error) {
    console.error('Error fetching Firebase config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Firebase configuration',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;

