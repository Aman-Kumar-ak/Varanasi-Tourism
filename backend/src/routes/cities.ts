import express, { Request, Response } from 'express';
import connectDB from '../lib/db.js';
import City from '../models/City.js';
import Jyotirlinga from '../models/Jyotirlinga.js';

const router = express.Router();

// Get all cities - MUST come before /:name route
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

// Get city info by name (case-insensitive, handles URL slugs)
router.get('/:name', async (req: Request, res: Response) => {
  try {
    await connectDB();

    const cityNameParam = req.params.name.toLowerCase();
    // Convert URL slug back to city name (e.g., "varanasi" -> "Varanasi")
    const cityName = cityNameParam
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Try exact match first, then regex match
    let city = await City.findOne({
      $or: [
        { 'name.en': { $regex: new RegExp(`^${cityName}$`, 'i') } },
        { 'name.en': { $regex: new RegExp(cityNameParam.replace(/-/g, ' '), 'i') } },
      ],
    })
      .populate('jyotirlingaId', 'name slug city state images')
      .select('-__v');

    // If not found, try more flexible search
    if (!city) {
      city = await City.findOne({
        $or: [
          { 'name.en': { $regex: new RegExp(cityNameParam.replace(/-/g, '.*'), 'i') } },
          { 'name.hi': { $regex: new RegExp(cityNameParam.replace(/-/g, '.*'), 'i') } },
        ],
      })
        .populate('jyotirlingaId', 'name slug city state images')
        .select('-__v');
    }

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
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;

