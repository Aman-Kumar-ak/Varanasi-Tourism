import express, { Request, Response } from 'express';
import connectDB from '../lib/db.js';
import Booking from '../models/Booking.js';
import TimeSlot from '../models/TimeSlot.js';
import DarshanType from '../models/DarshanType.js';
import { verifyAuth, AuthRequest } from '../middleware/auth.js';
import { z } from 'zod';
import { generateReceiptNumber } from '../lib/utils.js';

const router = express.Router();

// All booking routes require authentication
router.use(verifyAuth);

// Get available slots for a date and darshan type
router.get('/slots', async (req: Request, res: Response) => {
  try {
    await connectDB();

    const { date, darshanTypeId } = req.query;

    if (!date || !darshanTypeId) {
      return res.status(400).json({
        success: false,
        error: 'Date and darshanTypeId are required',
      });
    }

    // Get all time slots for this darshan type
    const timeSlots = await TimeSlot.find({
      darshanTypeId,
      isActive: true,
    });

    // Get darshan type to check daily limit
    const darshanType = await DarshanType.findById(darshanTypeId);
    if (!darshanType) {
      return res.status(404).json({
        success: false,
        error: 'Darshan type not found',
      });
    }

    // Get bookings for this date
    const selectedDate = new Date(date as string);
    selectedDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const bookings = await Booking.find({
      date: {
        $gte: selectedDate,
        $lt: nextDay,
      },
      darshanTypeId,
      status: { $ne: 'cancelled' },
    });

    // Calculate available slots
    const availableSlots = timeSlots.map((slot) => {
      const bookingsForSlot = bookings.filter(
        (b) => b.timeSlotId.toString() === slot._id.toString()
      );
      const bookedCount = bookingsForSlot.length;
      const available = slot.maxBookings - bookedCount;
      const isAvailable = available > 0;

      // Check daily limit
      const totalBookingsForDate = bookings.length;
      const dailyLimitReached = totalBookingsForDate >= darshanType.dailyLimit;

      return {
        id: slot._id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        maxBookings: slot.maxBookings,
        booked: bookedCount,
        available: isAvailable && !dailyLimitReached ? available : 0,
        isAvailable: isAvailable && !dailyLimitReached,
      };
    });

    res.json({
      success: true,
      data: availableSlots,
      dailyLimit: darshanType.dailyLimit,
      totalBookings: bookings.length,
    });
  } catch (error) {
    console.error('Error fetching slots:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch available slots',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Create booking
const createBookingSchema = z.object({
  jyotirlingaId: z.string().min(1),
  darshanTypeId: z.string().min(1),
  timeSlotId: z.string().min(1),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  primaryContact: z.object({
    name: z.string().min(1),
    phone: z.string().min(10),
    email: z.string().email().optional(),
  }),
  adults: z.array(
    z.object({
      name: z.string().min(1),
      age: z.number().min(18),
      gender: z.enum(['male', 'female', 'other']),
      idProof: z.string().optional(),
      idProofNumber: z.string().optional(),
    })
  ).min(1),
  children: z.array(
    z.object({
      name: z.string().min(1),
      age: z.number().min(0).max(17),
      gender: z.enum(['male', 'female', 'other']),
      idProof: z.string().optional(),
      idProofNumber: z.string().optional(),
    })
  ).optional().default([]),
});

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    await connectDB();

    const validatedData = createBookingSchema.parse(req.body);
    const { jyotirlingaId, darshanTypeId, timeSlotId, date, primaryContact, adults, children } = validatedData;

    // Verify user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    // Get darshan type to get price
    const darshanType = await DarshanType.findById(darshanTypeId);
    if (!darshanType) {
      return res.status(404).json({
        success: false,
        error: 'Darshan type not found',
      });
    }

    // Check slot availability
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const existingBookings = await Booking.find({
      date: {
        $gte: selectedDate,
        $lt: nextDay,
      },
      timeSlotId,
      status: { $ne: 'cancelled' },
    });

    const timeSlot = await TimeSlot.findById(timeSlotId);
    if (!timeSlot) {
      return res.status(404).json({
        success: false,
        error: 'Time slot not found',
      });
    }

    if (existingBookings.length >= timeSlot.maxBookings) {
      return res.status(400).json({
        success: false,
        error: 'This time slot is fully booked',
      });
    }

    // Check daily limit
    const dailyBookings = await Booking.find({
      date: {
        $gte: selectedDate,
        $lt: nextDay,
      },
      darshanTypeId,
      status: { $ne: 'cancelled' },
    });

    if (dailyBookings.length >= darshanType.dailyLimit) {
      return res.status(400).json({
        success: false,
        error: 'Daily booking limit reached for this darshan type',
      });
    }

    // Generate receipt number
    let receiptNumber = generateReceiptNumber();
    let isUnique = false;
    while (!isUnique) {
      const existing = await Booking.findOne({ receiptNumber });
      if (!existing) {
        isUnique = true;
      } else {
        receiptNumber = generateReceiptNumber();
      }
    }

    // Calculate total amount (price per person)
    const totalAmount = darshanType.price * (adults.length + (children?.length || 0));

    // Create booking
    const booking = await Booking.create({
      userId: req.user.userId,
      jyotirlingaId,
      darshanTypeId,
      timeSlotId,
      date: selectedDate,
      amount: totalAmount,
      paymentStatus: 'pending',
      receiptNumber,
      status: 'confirmed',
      primaryContact,
      adults,
      children: children || [],
    });

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking created successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.errors,
      });
    }

    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create booking',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get user's bookings
router.get('/my-bookings', async (req: AuthRequest, res: Response) => {
  try {
    await connectDB();

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    const bookings = await Booking.find({ userId: req.user.userId })
      .populate('jyotirlingaId', 'name city state')
      .populate('darshanTypeId', 'name price')
      .populate('timeSlotId', 'startTime endTime')
      .sort({ date: -1, createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookings',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Update booking payment status
router.post('/:id/payment', async (req: AuthRequest, res: Response) => {
  try {
    await connectDB();

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    const { paymentId, paymentStatus } = req.body;

    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    booking.paymentStatus = paymentStatus || 'completed';
    if (paymentId) {
      booking.paymentId = paymentId;
    }

    await booking.save();

    res.json({
      success: true,
      data: booking,
      message: 'Payment status updated successfully',
    });
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update payment status',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get single booking by ID
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    await connectDB();

    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
      });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    })
      .populate('jyotirlingaId', 'name city state images')
      .populate('darshanTypeId', 'name price')
      .populate('timeSlotId', 'startTime endTime')
      .select('-__v');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found',
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch booking',
    });
  }
});

export default router;
