# Backend Deployment Guide

This guide will help you deploy the Varanasi Tourism Guide backend to production.

## 🌐 Frontend URL Configuration

The backend is now configured to accept requests from:
- **Local Development**: `http://localhost:3000`
- **Production**: `https://indiatourtourism.vercel.app`

The CORS configuration in `backend/src/server.ts` has been updated to support both URLs.

## 📋 Deployment Options

### Option 1: Railway (Recommended)

1. Go to [railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
6. Add environment variables (see below)
7. Deploy!

### Option 2: Render

1. Go to [render.com](https://render.com)
2. Sign up/Login
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository
5. Configure:
   - **Name**: `varanasi-tourism-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. Add environment variables (see below)
7. Deploy!

### Option 3: Vercel (Serverless Functions)

Vercel requires refactoring to serverless functions. Not recommended for Express apps.

## 🔧 Environment Variables

Add these environment variables in your deployment platform:

### Required Variables

```env
# Server
PORT=5000
NODE_ENV=production

# MongoDB
MONGODB_URI=your_mongodb_atlas_connection_string

# JWT
JWT_SECRET=your_strong_random_jwt_secret

# Frontend URL (for CORS)
FRONTEND_URL=https://indiatourtourism.vercel.app

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Firebase (for OTP)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id

# Razorpay (optional, for payments)
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

## 🔗 Update Frontend API URL

After deploying the backend, update the frontend environment variable in Vercel:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_API_URL` to your backend deployment URL
   - Example: `https://varanasi-tourism-backend.railway.app`
3. Redeploy the frontend

## ✅ Post-Deployment Checklist

- [ ] Backend is accessible (check `/api/health` endpoint)
- [ ] CORS is working (frontend can make API calls)
- [ ] MongoDB connection is successful
- [ ] Environment variables are set correctly
- [ ] Frontend `NEXT_PUBLIC_API_URL` is updated
- [ ] Test API endpoints from frontend

## 🧪 Testing

Test the backend health endpoint:
```bash
curl https://your-backend-url.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Server is healthy",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 📝 Notes

- **MongoDB Atlas**: Make sure your MongoDB Atlas allows connections from your deployment platform's IP addresses (or allow all IPs for testing)
- **CORS**: The backend now automatically allows requests from both localhost and the production frontend URL
- **Environment Variables**: Never commit `.env` files to git
- **Build**: The backend uses TypeScript, so it needs to be compiled before running

## 🐛 Troubleshooting

### CORS Errors
- Verify `FRONTEND_URL` is set correctly
- Check that the frontend URL matches exactly (including `https://`)
- Ensure CORS middleware is configured correctly

### MongoDB Connection Issues
- Check MongoDB Atlas network access settings
- Verify `MONGODB_URI` is correct
- Ensure MongoDB Atlas allows connections from your deployment platform

### Build Failures
- Check that all dependencies are in `package.json`
- Verify TypeScript compilation succeeds
- Check build logs for specific errors

