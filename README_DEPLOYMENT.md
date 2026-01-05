# 🚀 Vercel Deployment Guide

This guide will help you deploy the Varanasi Tourism Guide to Vercel for your team to see.

## 📦 What's Been Prepared

✅ **Vercel Configuration** - `frontend/vercel.json`  
✅ **Next.js Config** - Updated for production  
✅ **Environment Variables** - `.env.example` template  
✅ **Deployment Documentation** - Complete guide  

## 🎯 Quick Start (5 Minutes)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Deploy to Vercel

**Option A: Via Vercel Dashboard (Easiest)**
1. Go to [vercel.com](https://vercel.com) → Sign up/Login
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure:
   - **Root Directory**: `frontend` ⚠️ Important!
   - **Framework**: Next.js (auto-detected)
   - Click **"Deploy"**

**Option B: Via Vercel CLI**
```bash
npm i -g vercel
cd frontend
vercel login
vercel
```

### Step 3: Add Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

Add these (replace with your actual values):

```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

⚠️ **Important**: Set for **Production**, **Preview**, and **Development** environments.

### Step 4: Redeploy

After adding environment variables, Vercel will auto-redeploy, or manually:
- Go to **Deployments** tab
- Click **"..."** → **"Redeploy"**

## 🔧 Configuration Details

### Root Directory
Vercel needs to know the frontend is in the `frontend/` folder:
- In Vercel Dashboard: Set **Root Directory** to `frontend`
- Or use `vercel.json` (already configured)

### Build Settings
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

## 🌐 Backend Setup

Your backend needs to be deployed separately. Options:

1. **Railway** (Recommended - Easy setup)
   - Go to [railway.app](https://railway.app)
   - Connect GitHub repo
   - Set root directory to `backend`
   - Add environment variables
   - Deploy

2. **Render** (Free tier available)
   - Go to [render.com](https://render.com)
   - Create new Web Service
   - Connect repository
   - Set root directory to `backend`

3. **Vercel** (Requires refactoring to serverless)

### Update Backend CORS

In `backend/src/server.ts`, add your Vercel URL:
```typescript
origin: [
  'http://localhost:3000',
  'https://your-app.vercel.app', // Add this
],
```

## 📝 Environment Variables Reference

### Frontend (Vercel)
All variables must start with `NEXT_PUBLIC_`:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://api.railway.app` |
| `NEXT_PUBLIC_FIREBASE_*` | Firebase config | (from Firebase console) |

### Backend (Railway/Render)
| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for JWT tokens |
| `FRONTEND_URL` | Your Vercel frontend URL |
| `RAZORPAY_KEY_ID` | Razorpay key |
| `RAZORPAY_KEY_SECRET` | Razorpay secret |

## ✅ Post-Deployment Checklist

- [ ] Site loads without errors
- [ ] All pages accessible
- [ ] Images load correctly
- [ ] API calls work
- [ ] Authentication works
- [ ] Language switching works
- [ ] Mobile view works
- [ ] Google Maps buttons work

## 🔍 Troubleshooting

### Build Fails
- Check Vercel build logs
- Ensure all dependencies in `package.json`
- Fix any TypeScript errors

### API Not Working
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend is deployed and running
- Verify CORS settings in backend

### Images Not Loading
- Check Cloudinary URLs are correct
- Verify `next.config.js` image domains

## 📊 Monitoring

- **Deployments**: View in Vercel dashboard
- **Logs**: Check deployment logs
- **Analytics**: Available in Vercel dashboard
- **Errors**: Monitor in Vercel dashboard

## 🎉 Success!

Once deployed, you'll get a URL like:
`https://varanasi-tourism.vercel.app`

Share this with your team to show progress!

## 🔄 Development Workflow

1. **Local Development**: Continue using `npm run dev` locally
2. **Preview Deployments**: Vercel creates previews for each PR
3. **Production**: Auto-deploys from `main` branch

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- See `VERCEL_DEPLOYMENT.md` for detailed guide

