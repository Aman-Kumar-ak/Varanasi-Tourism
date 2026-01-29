import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './lib/db.js';
import authRoutes from './routes/auth.js';
import jyotirlingaRoutes from './routes/jyotirlingas.js';
import bookingRoutes from './routes/bookings.js';
import cityRoutes from './routes/cities.js';
import paymentRoutes from './routes/payments.js';
import timeSlotRoutes from './routes/time-slots.js';
import receiptRoutes from './routes/receipts.js';
import uploadRoutes from './routes/upload.js';
import configRoutes from './routes/config.js';
import quoteRoutes from './routes/quotes.js';

// Load environment variables
// Render provides environment variables directly, but we load .env for local development
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

// Trust proxy:
// - In production, trust only the first proxy (typical for Render/NGINX)
// - In development, don't trust any proxy (avoids express-rate-limit warning)
if (isProduction) {
  app.set('trust proxy', 1);
} else {
  app.set('trust proxy', false);
}

// ==================== SECURITY MIDDLEWARE ====================

// 1. Security Headers (Helmet)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles for Next.js
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:', 'http:'], // Allow images from any source
      connectSrc: ["'self'", 'https:', 'http:'], // Allow API calls
      fontSrc: ["'self'", 'data:', 'https:'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", 'https:', 'http:'],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for Cloudinary/CDN compatibility
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow Cloudinary resources
}));

// 2. Rate Limiting
// General API rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs (prevents brute force)
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

// Apply general rate limiting to all routes
app.use('/api/', generalLimiter);

// Apply strict rate limiting to auth routes
app.use('/api/auth/', authLimiter);

// 3. Request Size Limits (prevent DoS)
app.use(express.json({ limit: '1mb' })); // Limit JSON payloads to 1MB
app.use(express.urlencoded({ extended: true, limit: '1mb' })); // Limit URL-encoded payloads

// Middleware
// CORS configuration - support both localhost and production frontend URL
const allowedOrigins = [
  'http://localhost:3000',
  'https://indiatourtourism.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

// Allow Vercel preview deployments (all branches)
const isVercelPreview = (origin: string): boolean => {
  return origin.includes('.vercel.app');
};

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In production, be more restrictive with Vercel previews
    if (isProduction && isVercelPreview(origin)) {
      // Only allow main branch previews in production, or restrict entirely
      // For now, keeping it permissive but you can tighten this
      return callback(null, true);
    }
    
    // Allow Vercel preview deployments in development
    if (!isProduction && isVercelPreview(origin)) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Connect to MongoDB
connectDB().catch((error) => {
  console.error('Failed to connect to MongoDB on startup:', error.message);
  console.error('Server will continue to run, but database operations will fail.');
  console.error('Please fix the MongoDB connection issue and restart the server.');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jyotirlingas', jyotirlingaRoutes);
// Booking routes disabled for guide-first phase - will be re-enabled when temple trusts are onboarded
// app.use('/api/bookings', bookingRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/config', configRoutes);
// Payment routes disabled for guide-first phase
// app.use('/api/payments', paymentRoutes);
// Time slot routes disabled for guide-first phase
// app.use('/api/time-slots', timeSlotRoutes);
// Receipt routes disabled for guide-first phase
// app.use('/api/receipts', receiptRoutes);

// Root route - for UptimeRobot and general access
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Varanasi Tourism Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      cities: '/api/cities',
      jyotirlingas: '/api/jyotirlingas',
      auth: '/api/auth',
    },
  });
});

// Health check endpoint - optimized for monitoring services
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Lightweight ping endpoint for UptimeRobot (even faster than health check)
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  // Don't expose internal error details in production
  const errorMessage = isProduction 
    ? (err.status === 500 ? 'Internal server error' : err.message)
    : err.message;
  
  res.status(err.status || 500).json({
    success: false,
    error: errorMessage || 'Internal server error',
    // Only include stack trace in development
    ...(isProduction ? {} : { stack: err.stack }),
  });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

