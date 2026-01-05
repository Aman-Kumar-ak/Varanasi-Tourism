# Cloudinary Setup Guide

This guide explains how to set up and use Cloudinary for image and video storage in the Varanasi Tourism platform.

## Step 1: Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account (no credit card required)
3. Once logged in, go to Dashboard
4. Copy your credentials:
   - **Cloud Name**
   - **API Key**
   - **API Secret** (keep this secret!)

## Step 2: Configure Environment Variables

Create a `.env` file in the `backend` directory (or update existing one) with:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

⚠️ **Important**: Never commit `.env` file to Git. It contains sensitive credentials.

## Step 3: Folder Structure in Cloudinary

Organize your media files using this structure:

```
/cities/varanasi/
   hero.jpg
   ghats/dashashwamedh.jpg
   temples/kashi-vishwanath.jpg

/jyotirlingas/kashi-vishwanath/
   temple.jpg
   aarti.jpg

/videos/varanasi/
   ganga-aarti.mp4
```

## Step 4: Upload Endpoints

### Upload Image

**Endpoint**: `POST /api/upload/image`

**Authentication**: Required (JWT token)

**Request**:
- Method: `POST`
- Headers:
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- Body (form-data):
  - `image`: File (max 10MB)
  - `folder`: String (e.g., "cities/varanasi")

**Example using curl**:
```bash
curl -X POST http://localhost:5000/api/upload/image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/image.jpg" \
  -F "folder=cities/varanasi"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/xxx/image/upload/...",
    "publicId": "cities/varanasi/image-1234567890",
    "width": 1920,
    "height": 1080,
    "format": "jpg",
    "bytes": 245678
  }
}
```

### Upload Video

**Endpoint**: `POST /api/upload/video`

**Authentication**: Required (JWT token)

**Request**:
- Method: `POST`
- Headers:
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- Body (form-data):
  - `video`: File (max 10MB)
  - `folder`: String (e.g., "videos/varanasi")

**Response**:
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/xxx/video/upload/...",
    "publicId": "videos/varanasi/video-1234567890",
    "thumbnailUrl": "https://res.cloudinary.com/xxx/image/upload/...",
    "width": 1920,
    "height": 1080,
    "format": "mp4",
    "bytes": 5245678,
    "duration": 120.5
  }
}
```

### Delete Media

**Endpoint**: `DELETE /api/upload/:publicId`

**Authentication**: Required (JWT token)

**Query Parameters**:
- `resource_type`: "image" | "video" (default: "image")

**Example**:
```bash
curl -X DELETE "http://localhost:5000/api/upload/cities/varanasi/image-1234567890?resource_type=image" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Step 5: Using URLs in Database

Store only the Cloudinary URL in your database:

```javascript
// City document example
{
  "name": { "en": "Varanasi", "hi": "वाराणसी" },
  "images": [
    "https://res.cloudinary.com/xxx/image/upload/cities/varanasi/hero.jpg",
    "https://res.cloudinary.com/xxx/image/upload/cities/varanasi/ghat.jpg"
  ]
}
```

## Step 6: Frontend Usage

### Basic Image Display

```tsx
import Image from 'next/image';
import { getOptimizedImageUrl } from '@/lib/cloudinary';

<img 
  src={getOptimizedImageUrl(imageUrl)} 
  alt="Varanasi" 
/>
```

### Responsive Images

```tsx
import { getResponsiveSrcSet } from '@/lib/cloudinary';

<img
  src={getOptimizedImageUrl(imageUrl, { width: 800 })}
  srcSet={getResponsiveSrcSet(imageUrl, [400, 800, 1200, 1920])}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  alt="Varanasi"
/>
```

### Video Display

```tsx
<video controls width="100%">
  <source src={videoUrl} type="video/mp4" />
</video>
```

## Step 7: Auto-Optimization

Cloudinary automatically optimizes images when you use the utility functions:

- **Quality**: Auto-optimized based on image content
- **Format**: Automatically serves WebP to supported browsers
- **Compression**: Reduces file size without visible quality loss

The `getOptimizedImageUrl` function automatically adds these transformations.

## Free Tier Limits

Cloudinary Free Tier includes:
- **25 GB** storage
- **25 GB** bandwidth/month
- Unlimited transformations
- CDN delivery

This is sufficient for Phase 1 (guide platform with hundreds of images and some videos).

## Security Notes

1. **Upload Endpoint Protection**: Only authenticated users can upload (JWT required)
2. **File Type Validation**: Only images and videos are allowed
3. **File Size Limit**: 10MB per file
4. **API Secret**: Never expose in frontend code

## Troubleshooting

### "Invalid file type" error
- Ensure file is one of: jpeg, jpg, png, webp, gif, mp4, webm, mov

### "File too large" error
- Maximum file size is 10MB
- Compress images before uploading if needed

### "Authentication required" error
- Ensure JWT token is included in Authorization header
- Token must be valid and not expired

### Cloudinary configuration error
- Verify all three environment variables are set correctly
- Check that credentials match your Cloudinary dashboard

## Next Steps

1. Set up Cloudinary account
2. Add credentials to `.env` file
3. Test upload endpoint with Postman or curl
4. Update seed script to use Cloudinary URLs (optional)
5. Build admin panel for image/video uploads (future)

