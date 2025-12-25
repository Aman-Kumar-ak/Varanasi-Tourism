# Firebase OTP Testing Guide

## Prerequisites
- ✅ Backend server running on `http://localhost:5000`
- ✅ Frontend server running on `http://localhost:3000`
- ✅ MongoDB connected
- ✅ Firebase credentials added to `backend/.env`
- ✅ Environment variables synced (`npm run sync-env`)

## Testing Steps

### 1. Setup Test Phone Number (Recommended)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `jyotirlinga-booking`
3. Navigate to: **Authentication → Sign-in method → Phone**
4. Scroll to **"Phone numbers for testing"**
5. Click **"Add phone number"**
6. Add:
   - **Phone number**: `+91 9876543210`
   - **Verification code**: `123456`
7. Click **Save**

### 2. Start Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Expected output: `🚀 Server running on port 5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Expected output: `Ready on http://localhost:3000`

### 3. Test Login Flow

1. **Open Browser**: Navigate to `http://localhost:3000/login`

2. **Enter Details**:
   - Name: `Test User` (minimum 2 characters)
   - Phone: `9876543210` (10 digits, no spaces)

3. **Click "Send OTP"**:
   - Should see: "OTP sent to your phone!" toast
   - Form should switch to OTP input

4. **Enter OTP**:
   - If using test number: Enter `123456`
   - If using real number: Enter OTP from SMS

5. **Click "Verify OTP"**:
   - Should see: "Login successful!" toast
   - Should redirect to home page (`/`)
   - User should be logged in

### 4. Verify Authentication

After successful login:
- Check browser console (F12) - should see token stored
- Check `localStorage` - should have `authToken`
- Header should show user is logged in
- Can access protected pages (e.g., `/my-bookings`)

## Testing with Real Phone Number

1. Use your actual phone number (10 digits)
2. Click "Send OTP"
3. Wait for SMS (may take 10-30 seconds)
4. Enter the 6-digit OTP from SMS
5. Verify and login

## Common Issues & Solutions

### Issue: "Failed to send OTP"
**Solutions:**
- Check Firebase Console → Authentication → Phone is enabled
- Verify Firebase credentials in `backend/.env`
- Check browser console for specific error
- Ensure reCAPTCHA is not blocked by ad blocker

### Issue: "reCAPTCHA expired"
**Solutions:**
- Refresh the page
- Clear browser cache
- Check Firebase Console → Authentication → Settings → Authorized domains includes `localhost`

### Issue: "Invalid OTP"
**Solutions:**
- For test numbers: Use the exact code you set in Firebase Console
- For real numbers: Check SMS carefully, code expires in 5 minutes
- Try requesting new OTP

### Issue: Backend connection error
**Solutions:**
- Verify backend is running: `http://localhost:5000/api/health`
- Check `NEXT_PUBLIC_API_URL` in frontend environment
- Ensure CORS is configured correctly

## Expected Behavior

✅ **Success Flow:**
1. Enter phone → Click "Send OTP" → Toast: "OTP sent"
2. Enter OTP → Click "Verify" → Toast: "Login successful"
3. Redirects to home page
4. User logged in, token stored

❌ **Error Flow:**
- Invalid phone: Toast error immediately
- Invalid OTP: Toast error after verification attempt
- Network error: Toast with error message

## Testing Checklist

- [ ] Backend server running
- [ ] Frontend server running
- [ ] Test phone number added in Firebase Console
- [ ] Can access `/login` page
- [ ] Can enter name and phone
- [ ] OTP sent successfully
- [ ] OTP verification works
- [ ] User redirected after login
- [ ] Token stored in localStorage
- [ ] User can access protected routes

## Next Steps After Testing

Once OTP verification works:
1. Test booking flow (requires login)
2. Test "My Bookings" page
3. Test logout functionality
4. Test session persistence (refresh page, should stay logged in)

