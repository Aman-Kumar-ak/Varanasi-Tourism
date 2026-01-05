# Cloudinary Integration - Complete Setup

## ✅ What's Been Implemented

### Backend
1. **Cloudinary Configuration** (`backend/src/lib/cloudinary.ts`)
   - Configured with environment variables
   - Ready to use across the application

2. **Upload Routes** (`backend/src/routes/upload.ts`)
   - `POST /api/upload/image` - Upload images
   - `POST /api/upload/video` - Upload videos
   - `DELETE /api/upload/:publicId` - Delete media
   - All endpoints protected with JWT authentication
   - Automatic file cleanup after upload
   - File type and size validation

3. **Server Integration** (`backend/src/server.ts`)
   - Upload routes added to server
   - Available at `/api/upload/*`

### Frontend
1. **Cloudinary Utilities** (`frontend/lib/cloudinary.ts`)
   - `getOptimizedImageUrl()` - Auto-optimize images
   - `getResponsiveSrcSet()` - Generate responsive image sets
   - `getVideoThumbnail()` - Get video thumbnails
   - `isCloudinaryUrl()` - Check if URL is from Cloudinary

### Documentation
1. **Setup Guide** (`backend/CLOUDINARY_SETUP.md`)
   - Complete step-by-step instructions
   - API endpoint documentation
   - Examples and troubleshooting

## 🚀 Quick Start

### 1. Get Cloudinary Credentials
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy:
   - Cloud Name
   - API Key
   - API Secret

### 2. Add to Environment Variables
Create or update `backend/.env`:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Test Upload
```bash
# Get JWT token first (login via /api/auth/login)
curl -X POST http://localhost:5000/api/upload/image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/image.jpg" \
  -F "folder=cities/varanasi"
```

### 4. Use in Frontend
```tsx
import { getOptimizedImageUrl } from '@/lib/cloudinary';

<img 
  src={getOptimizedImageUrl(imageUrl)} 
  alt="Varanasi" 
/>
```

## 📁 Folder Structure

Organize uploads in Cloudinary:

```
/cities/varanasi/
   hero.jpg
   ghats/dashashwamedh.jpg
   temples/kashi-vishwanath.jpg

/videos/varanasi/
   ganga-aarti.mp4
```

## 🔒 Security

- ✅ Upload endpoints require JWT authentication
- ✅ File type validation (images + videos only)
- ✅ File size limit (10MB)
- ✅ API Secret never exposed to frontend
- ✅ Temporary files automatically deleted

## 📊 Free Tier Limits

- **25 GB** storage
- **25 GB** bandwidth/month
- Perfect for Phase 1 (guide platform)

## 🎯 Next Steps

1. **Set up Cloudinary account** and add credentials
2. **Test upload endpoints** with Postman/curl
3. **Build admin panel** for image/video uploads (future)
4. **Update seed script** to use Cloudinary URLs (optional)

## 📝 Important Notes

- **Never store images in database** - only URLs
- **Never commit `.env` file** - contains secrets
- **Uploads folder is gitignored** - temporary files only
- **All files uploaded to Cloudinary** - not stored locally

## 🔗 Related Files

- `backend/src/lib/cloudinary.ts` - Cloudinary configuration
- `backend/src/routes/upload.ts` - Upload API endpoints
- `frontend/lib/cloudinary.ts` - Frontend utilities
- `backend/CLOUDINARY_SETUP.md` - Detailed setup guide

