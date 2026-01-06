// Vercel serverless function handler for Express app
// This file must be in the api/ directory for Vercel to recognize it as a serverless function

// Import the compiled Express app
import app from '../dist/server.js';

// Export as default handler for Vercel
export default app;

