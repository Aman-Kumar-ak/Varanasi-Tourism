import express, { Request, Response } from 'express';
import connectDB from '../lib/db.js';
import TimeSlot from '../models/TimeSlot.js';

const router = express.Router();

// Get time slot by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    await connectDB();

    const timeSlot = await TimeSlot.findById(req.params.id).select('-__v');

    if (!timeSlot) {
      return res.status(404).json({
        success: false,
        error: 'Time slot not found',
      });
    }

    res.json({
      success: true,
      data: timeSlot,
    });
  } catch (error) {
    console.error('Error fetching time slot:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch time slot',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;

