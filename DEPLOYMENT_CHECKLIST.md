# Deployment Checklist

Use this checklist before deploying to Vercel.

## ✅ Pre-Deployment

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] No console errors in browser
- [ ] All linting issues fixed
- [ ] Code is committed and pushed to repository

### Environment Variables
- [ ] `NEXT_PUBLIC_API_URL` - Backend API URL (production)
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY` - Firebase API key
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Firebase project ID
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID` - Firebase app ID
- [ ] `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps API key (optional)

### Backend Setup
- [ ] Backend is deployed and accessible
- [ ] Backend CORS allows Vercel domain
- [ ] MongoDB connection is configured
- [ ] Backend environment variables are set

### Testing
- [ ] Test all pages load correctly
- [ ] Test authentication flow
- [ ] Test API calls work
- [ ] Test image loading
- [ ] Test on mobile devices
- [ ] Test all language options
- [ ] Test font size controls

## 🚀 Deployment Steps

### Vercel Setup
- [ ] Create Vercel account
- [ ] Connect GitHub/GitLab repository
- [ ] Set root directory to `frontend`
- [ ] Configure build settings
- [ ] Add all environment variables
- [ ] Trigger first deployment

### Post-Deployment
- [ ] Verify site loads correctly
- [ ] Test all major features
- [ ] Check mobile responsiveness
- [ ] Verify API connectivity
- [ ] Test authentication
- [ ] Check image loading
- [ ] Verify all languages work
- [ ] Test Google Maps integration

## 🔍 Verification

### Functionality Checks
- [ ] Home page loads
- [ ] City page (Varanasi) loads
- [ ] Places carousel works on mobile
- [ ] Language switching works
- [ ] Font size controls work
- [ ] Google Maps buttons work
- [ ] All images load
- [ ] Navigation works

### Performance
- [ ] Page load times are acceptable
- [ ] Images are optimized
- [ ] No console errors
- [ ] No 404 errors in network tab

## 📝 Notes

- Keep development environment running locally for testing
- Use Vercel preview deployments for testing before production
- Monitor Vercel logs for any issues
- Set up error tracking (optional)

