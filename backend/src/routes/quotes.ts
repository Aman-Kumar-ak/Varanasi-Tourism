import express, { Request, Response } from 'express';
import connectDB from '../lib/db.js';
import Quote from '../models/Quote.js';
import { verifyAuth } from '../middleware/auth.js';
import { setCacheHeaders, CACHE_DURATIONS } from '../middleware/cache.js';

const router = express.Router();

// Get all active quotes
router.get('/', async (req: Request, res: Response) => {
  try {
    await connectDB();

    const quotes = await Quote.find({ isActive: true })
      .sort({ order: 1 })
      .select('quote author source image order');

    // Set cache headers for semi-static data (24 hours)
    setCacheHeaders(res, CACHE_DURATIONS.SEMI_STATIC);

    res.json({
      success: true,
      data: quotes,
    });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch quotes',
    });
  }
});

// Get quotes for a specific city
router.get('/city/:cityId', async (req: Request, res: Response) => {
  try {
    await connectDB();

    const { cityId } = req.params;

    const quotes = await Quote.find({
      isActive: true,
      $or: [
        { cityId: cityId },
        { cityId: { $exists: false } }, // Also include quotes without cityId (global quotes)
      ],
    })
      .sort({ order: 1 })
      .select('quote author source image order');

    // Set cache headers for semi-static data (24 hours)
    setCacheHeaders(res, CACHE_DURATIONS.SEMI_STATIC);

    res.json({
      success: true,
      data: quotes,
    });
  } catch (error) {
    console.error('Error fetching city quotes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch city quotes',
    });
  }
});

// Get single quote by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    await connectDB();

    const quote = await Quote.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        error: 'Quote not found',
      });
    }

    res.json({
      success: true,
      data: quote,
    });
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch quote',
    });
  }
});

// Create quote (admin only)
router.post('/', verifyAuth, async (req: Request, res: Response) => {
  try {
    await connectDB();

    const { quote, author, source, image, order, isActive, cityId } = req.body;

    if (!quote || !author) {
      return res.status(400).json({
        success: false,
        error: 'Quote text and author are required',
      });
    }

    const newQuote = new Quote({
      quote,
      author,
      source: source || undefined,
      image: image || '', // Placeholder - user will add Cloudinary URL
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
      cityId: cityId || undefined,
    });

    await newQuote.save();

    res.status(201).json({
      success: true,
      data: newQuote,
    });
  } catch (error) {
    console.error('Error creating quote:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create quote',
    });
  }
});

// Update quote (admin only)
router.put('/:id', verifyAuth, async (req: Request, res: Response) => {
  try {
    await connectDB();

    const { quote, author, source, image, order, isActive, cityId } = req.body;

    const updatedQuote = await Quote.findByIdAndUpdate(
      req.params.id,
      {
        ...(quote && { quote }),
        ...(author && { author }),
        ...(source !== undefined && { source }),
        ...(image !== undefined && { image }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
        ...(cityId !== undefined && { cityId }),
      },
      { new: true, runValidators: true }
    );

    if (!updatedQuote) {
      return res.status(404).json({
        success: false,
        error: 'Quote not found',
      });
    }

    res.json({
      success: true,
      data: updatedQuote,
    });
  } catch (error) {
    console.error('Error updating quote:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update quote',
    });
  }
});

// Delete quote (admin only)
router.delete('/:id', verifyAuth, async (req: Request, res: Response) => {
  try {
    await connectDB();

    const deletedQuote = await Quote.findByIdAndDelete(req.params.id);

    if (!deletedQuote) {
      return res.status(404).json({
        success: false,
        error: 'Quote not found',
      });
    }

    res.json({
      success: true,
      message: 'Quote deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting quote:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete quote',
    });
  }
});

export default router;
