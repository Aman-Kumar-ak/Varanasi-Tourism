# Environment Variables Setup

This project uses a **single `.env` file in the backend directory** for all environment variables.

## Setup Instructions

1. **Backend `.env` file** is located at `backend/.env`

2. **Backend** reads from `backend/.env` automatically

3. **Frontend** needs environment variables synced:
   - Run `npm run sync-env` after updating `backend/.env`
   - This creates `frontend/.env.local` with `NEXT_PUBLIC_*` variables

## Environment Variables

All variables are stored in the `backend/.env` file:

- `MONGODB_URI` - MongoDB connection string
- `PORT` - Backend server port (default: 5000)
- `JWT_SECRET` - Secret key for JWT tokens
- `RAZORPAY_KEY_ID` - Razorpay API key ID
- `RAZORPAY_KEY_SECRET` - Razorpay API secret
- `CLOUDINARY_*` - Cloudinary configuration for media uploads
- `NEXT_PUBLIC_FIREBASE_*` - Firebase configuration for OTP
- `NEXT_PUBLIC_API_URL` - Backend API URL for frontend

## Important Notes

- **Never commit `.env` file** to git (it's in `.gitignore`)
- Always use `backend/.env.example` as a template
- After updating `backend/.env`, run `npm run sync-env` to sync to frontend
- Frontend only uses `NEXT_PUBLIC_*` variables (Next.js requirement)

