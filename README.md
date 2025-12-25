# Jyotirlinga Booking Platform

A complete multi-language religious tourism platform for booking Darshan at all 12 Jyotirlingas.

## Project Structure

```
├── frontend/          # Next.js frontend application
├── backend/           # Express.js backend API
└── README.md
```

## Features

- 📱 Phone-based OTP authentication
- 🏛️ All 12 Jyotirlingas listing with state/city filtering
- 📅 Online booking with time slots
- 💳 Razorpay payment integration
- 🎫 PDF receipt generation
- 🗺️ City tourism information
- 🌐 Multi-language support (All Indian languages)
- 📱 Mobile-first responsive design
- 👨‍💼 Admin panel

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Express.js, Node.js, TypeScript
- **Database**: MongoDB (Mongoose)
- **Authentication**: Firebase Phone Auth
- **Payment**: Razorpay
- **Caching**: Redis (for slot locking)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Firebase project (for OTP)
- Razorpay account (for payments)

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Run development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
FRONTEND_URL=http://localhost:3000
```

4. Run development server:
```bash
npm run dev
```

Backend will be available at `http://localhost:5000`

## Color Palette

- **Primary Blue**: #00ABE7 (Fresh Sky) - Login/Register, primary buttons
- **Primary Orange**: #FE9000 (Deep Saffron) - Main body accents, CTAs
- **Primary Teal**: #5B9279 (Jungle Teal) - Success states, secondary actions
- **Primary Dark**: #183446 (Deep Space Blue) - Headers, text, dark elements
- **Background Parchment**: #EDE6E3 - Main body background, cards

## Development

### Running Both Servers

Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

## License

MIT
