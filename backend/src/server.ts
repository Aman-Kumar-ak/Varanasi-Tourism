import express from 'express';
import cors from 'cors';
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

// Load environment variables from backend/.env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/api/upload', uploadRoutes);
// Payment routes disabled for guide-first phase
// app.use('/api/payments', paymentRoutes);
// Time slot routes disabled for guide-first phase
// app.use('/api/time-slots', timeSlotRoutes);
// Receipt routes disabled for guide-first phase
// app.use('/api/receipts', receiptRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

