import { Request, Response, NextFunction } from 'express';

/**
 * Cache duration constants (in seconds)
 */
export const CACHE_DURATIONS = {
  STATIC: 7 * 24 * 60 * 60, // 7 days for static data (cities, temples)
  SEMI_STATIC: 24 * 60 * 60, // 24 hours for semi-static data (quotes, config)
  DYNAMIC: 5 * 60, // 5 minutes for dynamic data
  NO_CACHE: 0, // No cache for sensitive data
};

/**
 * Set cache headers for response
 */
export function setCacheHeaders(
  res: Response,
  duration: number = CACHE_DURATIONS.STATIC,
  isPublic: boolean = true
): void {
  if (duration === 0) {
    // No cache
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  } else {
    // Cache with revalidation
    const cacheControl = isPublic
      ? `public, max-age=${duration}, stale-while-revalidate=${Math.floor(duration * 0.5)}`
      : `private, max-age=${duration}, stale-while-revalidate=${Math.floor(duration * 0.5)}`;
    
    res.setHeader('Cache-Control', cacheControl);
    res.setHeader('ETag', `"${Date.now()}"`); // Simple ETag for cache validation
  }
}

/**
 * Middleware to set cache headers based on route type
 */
export function cacheMiddleware(duration: number = CACHE_DURATIONS.STATIC, isPublic: boolean = true) {
  return (req: Request, res: Response, next: NextFunction) => {
    setCacheHeaders(res, duration, isPublic);
    next();
  };
}

/**
 * Check if request has If-None-Match header (ETag validation)
 */
export function checkETag(req: Request, res: Response, etag: string): boolean {
  const ifNoneMatch = req.headers['if-none-match'];
  if (ifNoneMatch === etag) {
    res.status(304).end(); // Not Modified
    return true;
  }
  res.setHeader('ETag', etag);
  return false;
}
