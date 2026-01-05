# Vercel Configuration Fix

## Issue
Vercel was trying to build/run the backend, which caused the error:
```
Error: Cannot find module '/vercel/path0/backend/dist/server.js'
```

## Solution

### Option 1: Configure Root Directory in Vercel Dashboard (Recommended)

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **General**
3. Under **Root Directory**, set it to: `frontend`
4. Save and redeploy

This tells Vercel to only build the frontend directory.

### Option 2: Use Root vercel.json (Already Created)

A `vercel.json` file has been created in the root directory that explicitly sets:
- `rootDirectory: "frontend"`
- Build commands point to the frontend directory

### Option 3: Deploy Frontend Separately

If you have both frontend and backend in the same repo:

1. **Frontend**: Deploy from `frontend/` directory
   - Root Directory: `frontend`
   - Framework: Next.js

2. **Backend**: Deploy separately on Railway/Render
   - See `BACKEND_DEPLOYMENT.md` for instructions

## Important Notes

- **Vercel is for frontend/serverless functions only**
- **Express.js backends should use Railway, Render, or similar platforms**
- The backend cannot run on Vercel as a traditional Express server
- If you need the backend on Vercel, you'd need to convert it to serverless functions (major refactor)

## Current Setup

✅ Root `vercel.json` created - points to frontend directory
✅ `.vercelignore` created - ignores backend directory
✅ Frontend `vercel.json` updated - explicit output directory

## Next Steps

1. **In Vercel Dashboard**:
   - Go to Settings → General
   - Set **Root Directory** to `frontend`
   - Save and redeploy

2. **Deploy Backend Separately**:
   - Use Railway (recommended): https://railway.app
   - Or Render: https://render.com
   - See `BACKEND_DEPLOYMENT.md` for full instructions

## Verification

After fixing, Vercel should:
- ✅ Only build the frontend
- ✅ Run `npm install` in `frontend/` directory
- ✅ Run `npm run build` in `frontend/` directory
- ✅ Deploy from `frontend/.next` output directory

