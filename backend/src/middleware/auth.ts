import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt.js';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    phone: string;
    name: string;
  };
}

/**
 * Middleware to verify JWT token
 */
export function verifyAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'No token provided',
    });
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }

  req.user = decoded;
  next();
}

