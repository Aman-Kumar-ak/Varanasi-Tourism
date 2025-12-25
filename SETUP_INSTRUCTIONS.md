# Setup Instructions

## ✅ Project Status

The project has been successfully separated into **frontend** and **backend** folders with all files properly organized.

## 📦 Package Installation Status

### Frontend Packages ✅
All required packages are listed in `frontend/package.json`:
- ✅ Next.js 14 with React 18
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Firebase (for OTP authentication)
- ✅ React Hot Toast (notifications)
- ✅ Framer Motion (animations)
- ✅ Utility libraries (clsx, tailwind-merge)

**Status:** Packages are installed (node_modules exists)

### Backend Packages ✅
All required packages are listed in `backend/package.json`:
- ✅ Express.js
- ✅ Mongoose (MongoDB)
- ✅ JWT (authentication)
- ✅ Zod (validation)
- ✅ Razorpay (payments)
- ✅ CORS, dotenv, bcryptjs, express-rate-limit

**Status:** Packages need to be installed

## 🚀 Installation Steps

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Install Frontend Dependencies (if needed)

```bash
cd frontend
npm install
```

## ⚙️ Environment Setup

### Backend Environment (`.env` in `backend/` folder)

Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment (`.env.local` in `frontend/` folder)

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

## 🏃 Running the Application

### Terminal 1 - Backend Server

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

### Terminal 2 - Frontend Server

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

## ✅ Completed Features

1. ✅ Project structure (frontend/backend separation)
2. ✅ MongoDB models (all 7 models)
3. ✅ Authentication system (Firebase OTP + JWT)
4. ✅ Multi-language support (13 Indian languages)
5. ✅ Home page (all sections)
6. ✅ Jyotirlinga listing page (with filters)
7. ✅ Jyotirlinga detail page (with history)
8. ✅ Header & Footer components
9. ✅ Mobile-responsive design

## 📝 Next Steps

1. Install backend dependencies
2. Set up environment variables
3. Seed database with Jyotirlinga data
4. Build booking system
5. Integrate Razorpay payment
6. Create city pages

