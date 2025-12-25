import express, { Request, Response } from 'express';
import connectDB from '../lib/db.js';
import City from '../models/City.js';
import Jyotirlinga from '../models/Jyotirlinga.js';

const router = express.Router();

// Get city info by name (case-insensitive)
router.get('/:name', async (req: Request, res: Response) => {
  try {
    await connectDB();

    const cityName = req.params.name.toLowerCase();
    
    // Find city by name (case-insensitive)
    const city = await City.findOne({
      $or: [
        { 'name.en': { $regex: new RegExp(cityName, 'i') } },
        { 'name.hi': { $regex: new RegExp(cityName, 'i') } },
      ],
    })
      .populate('jyotirlingaId', 'name slug city state images')
      .select('-__v');

    if (!city) {
      return res.status(404).json({
        success: false,
        error: 'City not found',
      });
    }

    res.json({
      success: true,
      data: city,
    });
  } catch (error) {
    console.error('Error fetching city:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch city',
    });
  }
});

// Get all cities
router.get('/', async (req: Request, res: Response) => {
  try {
    await connectDB();

    const cities = await City.find()
      .populate('jyotirlingaId', 'name slug city state')
      .select('name state images jyotirlingaId')
      .sort({ 'name.en': 1 });

    res.json({
      success: true,
      data: cities,
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cities',
    });
  }
});

export default router;

