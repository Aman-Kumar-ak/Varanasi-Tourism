// Vercel serverless function handler for Express app
import app from '../dist/server.js';

// Export the Express app as the default handler for Vercel
// Vercel will automatically handle the request/response conversion
export default app;

