import express, { Request, Response } from 'express';

const router = express.Router();

// Get city info
router.get('/:name', async (req: Request, res: Response) => {
  // TODO: Implement
  res.json({ success: true, data: {} });
});

export default router;

