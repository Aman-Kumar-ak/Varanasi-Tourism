import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cloudinary from '../lib/cloudinary.js';
import { verifyAuth } from '../middleware/auth.js';

const router = express.Router();

// Configure multer for temporary file storage
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and videos
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'video/mp4',
      'video/webm',
      'video/quicktime',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
  },
});

// Upload image endpoint
router.post(
  '/image',
  verifyAuth, // Protect upload endpoint - only authenticated users can upload
  upload.single('image'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
        });
      }

      // Get folder from request body (e.g., 'cities/varanasi', 'jyotirlingas/kashi-vishwanath')
      const folder = req.body.folder || 'general';
      const resourceType = 'image';

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: folder,
        resource_type: resourceType,
        transformation: [
          {
            quality: 'auto',
            fetch_format: 'auto',
          },
        ],
      });

      // Delete temporary file
      fs.unlinkSync(req.file.path);

      res.json({
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        },
      });
    } catch (error) {
      // Clean up temp file on error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      console.error('Error uploading image:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload image',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

// Upload video endpoint
router.post(
  '/video',
  verifyAuth, // Protect upload endpoint
  upload.single('video'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
        });
      }

      // Get folder from request body
      const folder = req.body.folder || 'videos/general';
      const resourceType = 'video';

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: folder,
        resource_type: resourceType,
        eager: [
          // Generate thumbnail
          { width: 640, height: 360, crop: 'fill', format: 'jpg' },
        ],
      });

      // Delete temporary file
      fs.unlinkSync(req.file.path);

      res.json({
        success: true,
        data: {
          url: result.secure_url,
          publicId: result.public_id,
          thumbnailUrl: result.eager?.[0]?.secure_url || null,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
          duration: result.duration,
        },
      });
    } catch (error) {
      // Clean up temp file on error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      console.error('Error uploading video:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload video',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

// Delete media endpoint (optional - for cleanup)
router.delete(
  '/:publicId',
  verifyAuth,
  async (req: Request, res: Response) => {
    try {
      const { publicId } = req.params;
      const resourceType = req.query.resource_type || 'image';

      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType as 'image' | 'video' | 'raw' | 'auto',
      });

      res.json({
        success: result.result === 'ok',
        data: result,
      });
    } catch (error) {
      console.error('Error deleting media:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete media',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

export default router;

