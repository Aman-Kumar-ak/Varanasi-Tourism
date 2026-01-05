# Vercel Deployment Guide

This guide will help you deploy the Varanasi Tourism Guide frontend to Vercel.

## 📋 Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. GitHub/GitLab/Bitbucket account (for connecting your repository)
3. Backend API deployed (on Vercel, Railway, Render, or another service)

## 🚀 Deployment Steps

### Step 1: Prepare Your Repository

1. **Ensure your code is pushed to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub/GitLab/Bitbucket repository
4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

#### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```

4. Deploy:
   ```bash
   vercel
   ```

5. For production deployment:
   ```bash
   vercel --prod
   ```

### Step 3: Configure Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key (optional)
   ```

3. **Important**: Set these for all environments (Production, Preview, Development)

### Step 4: Update Backend CORS Settings

Make sure your backend allows requests from your Vercel domain:

In `backend/src/server.ts`, ensure CORS includes your Vercel URL:
```typescript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-app.vercel.app', // Add your Vercel URL here
  ],
  credentials: true,
};
```

### Step 5: Redeploy

After setting environment variables, Vercel will automatically redeploy. Or manually trigger a redeploy:
- Go to **Deployments** tab
- Click the **"..."** menu on the latest deployment
- Select **"Redeploy"**

## 🔧 Configuration Files

### `vercel.json`
The `vercel.json` file in the `frontend/` directory configures:
- Build and install commands
- Framework detection
- API rewrites (if needed)

### `next.config.js`
Already configured for:
- Image optimization with Cloudinary
- Environment variable handling
- API rewrites for development

## 🌍 Environment-Specific Settings

### Development (Local)
- Uses `http://localhost:5000` for API
- Reads from `frontend/.env.local`

### Production (Vercel)
- Uses environment variables from Vercel dashboard
- API URL should point to your deployed backend

## 📝 Important Notes

1. **Backend Deployment**: The backend needs to be deployed separately. Options:
   - **Vercel Serverless Functions** (requires refactoring)
   - **Railway** (recommended for Express apps)
   - **Render** (free tier available)
   - **Heroku** (paid)
   - **DigitalOcean App Platform**

2. **MongoDB**: Ensure your MongoDB Atlas (or other MongoDB service) allows connections from your backend server's IP.

3. **Cloudinary**: Already configured, no changes needed.

4. **Build Time**: First build may take 3-5 minutes. Subsequent builds are faster.

## 🐛 Troubleshooting

### Build Fails
- Check that all dependencies are in `package.json`
- Ensure TypeScript errors are resolved
- Check build logs in Vercel dashboard

### API Calls Fail
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check backend CORS settings
- Ensure backend is deployed and accessible

### Images Not Loading
- Verify Cloudinary URLs are correct
- Check `next.config.js` image domains
- Ensure images are publicly accessible

### Environment Variables Not Working
- Variables must start with `NEXT_PUBLIC_` to be available in browser
- Redeploy after adding new variables
- Check variable names match exactly

## 🔄 Continuous Deployment

Vercel automatically deploys on every push to your main branch:
- **Production**: Deploys from `main` branch
- **Preview**: Creates preview deployments for pull requests

## 📊 Monitoring

- View deployment logs in Vercel dashboard
- Check analytics in Vercel dashboard
- Monitor errors in Vercel dashboard → **Logs**

## 🎯 Next Steps After Deployment

1. Test all features on the deployed site
2. Set up a custom domain (optional)
3. Configure analytics (optional)
4. Set up monitoring and alerts

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review Next.js build output
3. Verify environment variables
4. Check backend API status

