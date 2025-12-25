import express, { Request, Response } from 'express';
import connectDB from '../lib/db.js';
import User from '../models/User.js';
import { generateToken } from '../lib/jwt.js';
import { verifyAuth, AuthRequest } from '../middleware/auth.js';
import { z } from 'zod';

const router = express.Router();

// Validation schemas
const loginSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
  firebaseToken: z.string().min(1, 'Firebase token is required'),
});

const registerSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  firebaseToken: z.string().min(1, 'Firebase token is required'),
});

// Login - Only phone number required
router.post('/login', async (req: Request, res: Response) => {
  try {
    await connectDB();

    const validatedData = loginSchema.parse(req.body);
    const { phone, firebaseToken } = validatedData;

    // In production, verify firebaseToken with Firebase Admin SDK
    // For now, we'll trust the frontend verification
    // TODO: Add Firebase Admin SDK verification

    // Find user
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found. Please register first.',
      });
    }

    // Update last login
    user.isVerified = true;
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      phone: user.phone,
      name: user.name,
    });

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }

    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to login',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Register - Name and phone required
router.post('/register', async (req: Request, res: Response) => {
  try {
    await connectDB();

    const validatedData = registerSchema.parse(req.body);
    const { phone, name, firebaseToken } = validatedData;

    // In production, verify firebaseToken with Firebase Admin SDK
    // For now, we'll trust the frontend verification
    // TODO: Add Firebase Admin SDK verification

    // Check if user already exists
    const existingUser = await User.findOne({ phone });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists. Please login instead.',
      });
    }

    // Create new user
    const user = await User.create({
      phone,
      name,
      isVerified: true,
      lastLogin: new Date(),
    });

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      phone: user.phone,
      name: user.name,
    });

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }

    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to register',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get current user
router.get('/me', verifyAuth, async (req: AuthRequest, res: Response) => {
  try {
    await connectDB();

    const user = await User.findById(req.user!.userId).select('-__v');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get user',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;

