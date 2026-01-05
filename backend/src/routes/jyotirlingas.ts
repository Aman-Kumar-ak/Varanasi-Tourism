import express, { Request, Response } from 'express';
import connectDB from '../lib/db.js';
import Jyotirlinga from '../models/Jyotirlinga.js';

const router = express.Router();

// Get all Jyotirlingas with optional filters
router.get('/', async (req: Request, res: Response) => {
  try {
    await connectDB();

    const { state, city, search } = req.query;

    let query: any = { isActive: true };

    if (state) {
      query.state = state;
    }

    if (city) {
      query.city = city;
    }

    if (search) {
      query.$or = [
        { 'name.en': { $regex: search, $options: 'i' } },
        { 'name.hi': { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } },
      ];
    }

    const jyotirlingas = await Jyotirlinga.find(query)
      .sort({ displayOrder: 1, name: 1 })
      .select('-__v');

    res.json({
      success: true,
      count: jyotirlingas.length,
      data: jyotirlingas,
    });
  } catch (error) {
    console.error('Error fetching Jyotirlingas:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Jyotirlingas',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get states with Jyotirlinga count
router.get('/states', async (req: Request, res: Response) => {
  try {
    await connectDB();

    const states = await Jyotirlinga.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$state',
          stateCode: { $first: '$stateCode' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: states.map((s) => ({
        state: s._id,
        stateCode: s.stateCode,
        count: s.count,
      })),
    });
  } catch (error) {
    console.error('Error fetching states:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch states',
    });
  }
});

// Get single Jyotirlinga by slug or ID
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    await connectDB();

    const identifier = req.params.slug;
    
    // Try to find by slug first
    let jyotirlinga = await Jyotirlinga.findOne({ slug: identifier }).select('-__v');

    // If not found by slug, try by MongoDB ObjectId
    if (!jyotirlinga && /^[0-9a-fA-F]{24}$/.test(identifier)) {
      jyotirlinga = await Jyotirlinga.findById(identifier).select('-__v');
    }

    if (!jyotirlinga) {
      return res.status(404).json({
        success: false,
        error: 'Jyotirlinga not found',
      });
    }

    res.json({
      success: true,
      data: jyotirlinga,
    });
  } catch (error) {
    console.error('Error fetching Jyotirlinga:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Jyotirlinga',
    });
  }
});

// Get darshan types for a Jyotirlinga by slug
router.get('/:slug/darshan-types', async (req: Request, res: Response) => {
  try {
    await connectDB();
    const DarshanType = (await import('../models/DarshanType.js')).default;

    // First find the Jyotirlinga by slug
    const jyotirlinga = await Jyotirlinga.findOne({ slug: req.params.slug });
    
    if (!jyotirlinga) {
      return res.status(404).json({
        success: false,
        error: 'Jyotirlinga not found',
      });
    }

    const darshanTypes = await DarshanType.find({
      jyotirlingaId: jyotirlinga._id,
      isActive: true,
    }).select('-__v').sort({ price: 1 });

    res.json({
      success: true,
      data: darshanTypes,
    });
  } catch (error) {
    console.error('Error fetching darshan types:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch darshan types',
    });
  }
});

export default router;

