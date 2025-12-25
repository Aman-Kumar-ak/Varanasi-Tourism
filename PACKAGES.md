# Package Dependencies Summary

## Frontend Packages (`frontend/package.json`)

### Dependencies (Production)
- **react** (^18.3.1) - React library
- **react-dom** (^18.3.1) - React DOM renderer
- **next** (^14.2.5) - Next.js framework
- **firebase** (^10.12.2) - Firebase SDK for authentication
- **react-hot-toast** (^2.6.0) - Toast notifications
- **framer-motion** (^11.3.6) - Animation library
- **clsx** (^2.1.1) - Utility for constructing className strings
- **tailwind-merge** (^3.4.0) - Merge Tailwind CSS classes

### DevDependencies (Development)
- **typescript** (^5.5.3) - TypeScript compiler
- **@types/node** (^20.14.12) - TypeScript types for Node.js
- **@types/react** (^18.3.3) - TypeScript types for React
- **@types/react-dom** (^18.3.0) - TypeScript types for React DOM
- **autoprefixer** (^10.4.19) - CSS autoprefixer
- **postcss** (^8.4.40) - CSS post-processor
- **tailwindcss** (^3.4.7) - Tailwind CSS framework
- **eslint** (^8.57.0) - JavaScript linter
- **eslint-config-next** (^14.2.5) - ESLint config for Next.js

### Usage in Code
- `react`, `react-dom` - Used in all React components
- `next` - Next.js app router, routing, and API
- `firebase` - Phone authentication (PhoneLogin component)
- `react-hot-toast` - Toast notifications (Toaster component)
- `framer-motion` - (Reserved for future animations)
- `clsx`, `tailwind-merge` - Utility functions (lib/utils.ts)

## Backend Packages (`backend/package.json`)

### Dependencies (Production)
- **express** (^4.18.2) - Web framework
- **mongoose** (^8.5.1) - MongoDB ODM
- **cors** (^2.8.5) - CORS middleware
- **dotenv** (^16.4.5) - Environment variables loader
- **jsonwebtoken** (^9.0.2) - JWT token generation/verification
- **bcryptjs** (^2.4.3) - Password hashing (for admin users)
- **zod** (^3.23.8) - Schema validation
- **razorpay** (^2.9.2) - Razorpay payment gateway SDK
- **express-rate-limit** (^7.1.5) - Rate limiting middleware

### DevDependencies (Development)
- **@types/express** (^4.17.21) - TypeScript types for Express
- **@types/cors** (^2.8.17) - TypeScript types for CORS
- **@types/node** (^20.14.12) - TypeScript types for Node.js
- **@types/bcryptjs** (^2.4.6) - TypeScript types for bcryptjs
- **@types/jsonwebtoken** (^9.0.5) - TypeScript types for JWT
- **typescript** (^5.5.3) - TypeScript compiler
- **tsx** (^4.7.1) - TypeScript execution for development

### Usage in Code
- `express` - Server setup (server.ts)
- `mongoose` - Database models (all models in src/models/)
- `cors` - CORS configuration (server.ts)
- `dotenv` - Environment variables (server.ts)
- `jsonwebtoken` - JWT token management (lib/jwt.ts)
- `bcryptjs` - Password hashing (models/AdminUser.ts)
- `zod` - Request validation (routes/auth.ts)
- `razorpay` - (Reserved for payment routes)
- `express-rate-limit` - (Reserved for rate limiting)

## Installation Status

✅ **Frontend**: All dependencies installed (470 packages)
✅ **Backend**: All dependencies installed (142 packages)

## Installation Commands

### Frontend
```bash
cd frontend
npm install
```

### Backend
```bash
cd backend
npm install
```

## Notes

- Frontend has 13 vulnerabilities (10 moderate, 3 high) - mostly from deprecated ESLint packages. These are dev dependencies and don't affect production.
- Backend has 0 vulnerabilities.
- All required packages for current implementation are installed.
- Future packages may be needed for:
  - PDF generation (receipts)
  - Redis client (for slot locking)
  - Firebase Admin SDK (for server-side OTP verification)

