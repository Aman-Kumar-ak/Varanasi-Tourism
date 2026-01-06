// Entry point for Vercel detection
// This file exists only so Vercel can detect an entry point
// All requests are routed to api/server.js via vercel.json rewrites
export default function handler(req, res) {
  // This should never be called due to rewrites
  res.status(404).json({ error: 'Not found' });
}

