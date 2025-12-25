import express, { Request, Response } from 'express';

const router = express.Router();

// Create Razorpay order
router.post('/create-order', async (req: Request, res: Response) => {
  // TODO: Implement
  res.json({ success: true, orderId: 'test' });
});

// Verify payment
router.post('/verify', async (req: Request, res: Response) => {
  // TODO: Implement
  res.json({ success: true });
});

export default router;

