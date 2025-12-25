---
name: Jyotirlinga Booking Platform
overview: Build a complete multi-language religious tourism platform for booking Darshan at all 12 Jyotirlingas, with phone-based OTP authentication, payment integration (Razorpay), city tourism pages, and admin panel. Using Next.js, Node.js/Express, MongoDB, and implementing the color palette from the provided design.
todos:
  - id: setup-project
    content: "Initialize Next.js 14 project with TypeScript, Tailwind CSS, and configure custom color palette (#00ABE7, #FE9000, #EDE6E3, #5B9279, #183446)"
    status: completed
  - id: setup-database
    content: Set up MongoDB connection and create Mongoose schemas for users, jyotirlingas, darshanTypes, bookings, cities, and adminUsers
    status: completed
    dependencies:
      - setup-project
  - id: setup-firebase
    content: Configure Firebase Phone Authentication for OTP-based login/registration
    status: completed
    dependencies:
      - setup-project
  - id: auth-flow
    content: "Build phone-based authentication flow: login/register pages, OTP verification, JWT token management"
    status: completed
    dependencies:
      - setup-firebase
      - setup-database
  - id: jyotirlinga-pages
    content: Create Jyotirlinga listing page and individual detail pages with darshan types, prices, and timings
    status: completed
    dependencies:
      - setup-database
  - id: booking-system
    content: "Implement booking flow: date selection, slot availability (Redis-based), booking creation, and slot locking mechanism"
    status: completed
    dependencies:
      - auth-flow
      - jyotirlinga-pages
  - id: payment-integration
    content: "Integrate Razorpay: create order, payment verification webhook, update booking status on successful payment"
    status: skipped
    dependencies:
      - booking-system
  - id: receipt-generation
    content: Build PDF receipt generation with booking details, QR code, and download functionality
    status: pending
    dependencies:
      - payment-integration
  - id: city-pages
    content: Create city tourism pages with places to visit, hotels, restaurants, transport info, and emergency contacts
    status: pending
    dependencies:
      - setup-database
  - id: admin-panel
    content: Build admin panel with dashboard, Jyotirlinga management, booking management, and slot limit controls
    status: pending
    dependencies:
      - setup-database
      - auth-flow
  - id: multi-language
    content: Implement multi-language support for all major Indian languages (Hindi, Gujarati, Tamil, Telugu, Marathi, Bengali, Kannada, Malayalam, Odia, Punjabi, Assamese, etc.) with language selector and content switching
    status: completed
    dependencies:
      - jyotirlinga-pages
      - city-pages
  - id: state-filtering
    content: Build state and city filtering system for Jyotirlingas listing page with dropdown filters and search functionality
    status: completed
    dependencies:
      - setup-database
      - jyotirlinga-pages
  - id: mobile-responsive
    content: Implement mobile-first responsive design ensuring all pages work perfectly on phones with touch-friendly UI, mobile navigation, and optimized layouts
    status: completed
    dependencies:
      - setup-project
  - id: seed-data
    content: Create seed script to populate database with all 12 Jyotirlingas, darshan types, and initial city data
    status: completed
    dependencies:
      - setup-database
  - id: home-page
    content: Build home page with hero section, featured Jyotirlingas grid, features section, how it works, city carousel, and footer using the specified color palette
    status: completed
    dependencies:
      - setup-project
      - setup-database
---

# Jyotirlinga Booking Platform - Implementation Plan

## Project Overview

A full-stack religious tourism platform supporting all 12 Jyotirlingas with booking, payment, and city tourism features. Built with Next.js (frontend + API routes), Express backend, MongoDB, and Firebase OTP authentication.

## Architecture Overview

```javascript
┌─────────────────┐
│   Next.js App   │  (Frontend + API Routes)
│  (Pages/App)    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐  ┌──▼────┐
│MongoDB│  │ Redis │  (Slot locking, caching)
└───────┘  └───────┘
    │
┌───▼──────────────┐
│  External APIs   │
│  - Firebase OTP  │
│  - Razorpay      │
│  - SMS Gateway   │
└──────────────────┘
```



## Project Structure

```javascript
varanasi-tourism/
├── frontend/                    # Next.js application
│   ├── app/                     # App router (Next.js 13+)
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (main)/
│   │   │   ├── page.tsx         # Home page
│   │   │   ├── jyotirlingas/
│   │   │   ├── jyotirlinga/[id]/
│   │   │   ├── booking/
│   │   │   ├── city/[name]/
│   │   │   └── my-bookings/
│   │   ├── receipt/[id]/
│   │   └── api/                 # API routes
│   ├── components/
│   │   ├── auth/
│   │   ├── booking/
│   │   ├── temple/
│   │   ├── city/
│   │   └── common/
│   ├── lib/
│   │   ├── firebase.ts
│   │   ├── razorpay.ts
│   │   ├── db.ts
│   │   └── utils.ts
│   ├── styles/
│   │   └── globals.css          # Tailwind + custom colors
│   └── public/
│       └── images/
├── backend/                      # Express API (if separate)
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── services/
├── database/
│   └── schemas/                  # MongoDB schemas
└── docs/
    └── api.md
```



## Color Palette Implementation

Based on the provided palette:

- **#00ABE7 (Fresh Sky)** - Login/Register pages, primary buttons, links
- **#FE9000 (Deep Saffron)** - Main body accents, CTAs, highlights
- **#EDE6E3 (Parchment)** - Main body background, cards
- **#5B9279 (Jungle Teal)** - Success states, secondary actions
- **#183446 (Deep Space Blue)** - Headers, text, dark elements

## Database Schema (MongoDB)

### Collections

1. **users**

- `_id`, `name`, `phone`, `isVerified`, `createdAt`, `lastLogin`

2. **jyotirlingas**

- `_id`, `name`, `nameHindi`, `city`, `state`, `stateCode`, `images[]`, `description` (multi-lang), `history` (multi-lang), `significance` (multi-lang), `whyFamous` (multi-lang), `location` (lat/lng), `templeRules[]`, `nearbyPlaces[]`, `isActive`, `displayOrder`

3. **darshanTypes**

- `_id`, `jyotirlingaId`, `name`, `nameHindi`, `price`, `duration`, `dailyLimit`, `isActive`

4. **timeSlots**

- `_id`, `darshanTypeId`, `startTime`, `endTime`, `maxBookings`, `isActive`

5. **bookings**

- `_id`, `userId`, `jyotirlingaId`, `darshanTypeId`, `date`, `timeSlotId`, `amount`, `paymentStatus`, `paymentId`, `receiptNumber`, `qrCode`, `createdAt`, `status`

6. **cities**

- `_id`, `name`, `nameHindi`, `jyotirlingaId`, `hotels[]`, `restaurants[]`, `places[]`, `transportInfo`, `emergencyContacts[]`, `weatherInfo`

7. **adminUsers**

- `_id`, `email`, `password` (hashed), `role`, `permissions[]`

## Key Features Implementation

### 1. Authentication System (Firebase OTP)

**Flow:**

```javascript
User enters phone → Firebase sends OTP → User verifies → 
Backend creates/updates user → JWT token issued → Session stored
```

**Files:**

- `frontend/lib/firebase.ts` - Firebase config & OTP functions
- `frontend/app/api/auth/verify-otp/route.ts` - OTP verification endpoint
- `frontend/components/auth/PhoneLogin.tsx` - Login component

### 2. Jyotirlinga Listing with State/City Filtering

**Filtering System:**

- **State Filter Dropdown**: Shows all states with Jyotirlinga count (e.g., "Gujarat (2)", "Uttar Pradesh (1)")
- **City Filter Dropdown**: Shows cities within selected state
- **Search Bar**: Search by temple name (all languages)
- **Clear Filters**: Reset to show all Jyotirlingas
- **Filter Results Display**: Shows count (e.g., "2 Jyotirlingas found in Gujarat")

**Filter UI (Mobile-Optimized):**

- Sticky filter bar on mobile (collapsible)
- Touch-friendly dropdowns
- Filter chips showing active filters
- Quick filter buttons for popular states

**Files:**

- `frontend/components/jyotirlinga/StateFilter.tsx` - State filter component
- `frontend/components/jyotirlinga/CityFilter.tsx` - City filter component
- `frontend/components/jyotirlinga/FilterBar.tsx` - Combined filter bar
- `frontend/app/api/jyotirlingas/states/route.ts` - States API endpoint

**Jyotirlingas Listing Page Structure:**

- **Page Route**: `/jyotirlingas`
- **Filter Bar** (sticky on mobile):
- State dropdown (shows count: "Gujarat (2)", "Maharashtra (3)")
- City dropdown (populated based on selected state)
- Search bar (searches name in all languages)
- Clear filters button
- Active filter chips (removable)
- **Results Display**:
- Grid/List toggle (mobile: list view default)
- Results count ("2 Jyotirlingas found in Gujarat")
- Sort options (Name, State, Popularity)
- **Jyotirlinga Cards**:
- Image, name (current language), location
- State badge
- Quick view button
- Book Now button
- **Empty State**: "No Jyotirlingas found" with clear filters option
- **Mobile**: Collapsible filter drawer, swipeable cards

**Additional Files:**

- `frontend/app/(main)/jyotirlingas/page.tsx` - Listing page
- `frontend/components/jyotirlinga/FilterDrawer.tsx` - Mobile filter drawer
- `frontend/components/jyotirlinga/TempleCard.tsx` - Temple card component

### 3. Jyotirlinga Detail Page - History & Context

**Detail Page Sections:**

1. **Hero Section**

- Large temple image
- Temple name (current language)
- Location (City, State)
- Quick stats (established year, significance)

2. **History & Significance Section** (NEW - Important)

- **Why It's Famous**: Short paragraph explaining the temple's importance
- **Historical Context**: When and how it was established
- **Mythological Significance**: Stories and legends associated
- **Spiritual Importance**: Why devotees visit
- **Architectural Highlights**: Unique features
- All content in current selected language

3. **Darshan Types & Pricing**

- Available darshan types
- Prices in INR
- Duration and benefits
- "Book Now" buttons

4. **Timings & Rules**

- Opening/closing times
- Best time to visit
- Temple rules and guidelines
- Dress code

5. **Location & Map**

- Interactive map
- Address
- Directions

6. **Nearby Places**

- Other attractions
- Hotels
- Restaurants

**Files:**

- `frontend/app/(main)/jyotirlinga/[id]/page.tsx` - Detail page
- `frontend/components/jyotirlinga/HistorySection.tsx` - History component
- `frontend/components/jyotirlinga/SignificanceCard.tsx` - Why famous card
- `frontend/components/jyotirlinga/TempleHero.tsx` - Hero section

### 4. Booking System

**Critical Flow:**

1. Select Jyotirlinga → 2. Select Darshan Type → 3. Select Date → 
2. View Available Slots (Redis-locked) → 5. Login (if needed) → 
3. Confirm → 7. Create Razorpay Order → 8. Payment → 9. Verify → 10. Generate Receipt

**Slot Availability Algorithm:**

- Check daily limit per darshan type
- Check existing bookings for date+slot
- Use Redis for real-time slot locking during booking
- Release lock after 5 minutes if not completed

**Files:**

- `frontend/app/api/bookings/create/route.ts` - Create booking
- `frontend/app/api/bookings/slots/route.ts` - Get available slots
- `frontend/components/booking/BookingFlow.tsx` - Multi-step booking component
- `frontend/components/booking/SlotSelector.tsx` - Time slot picker

### 5. Payment Integration (Razorpay)

**Flow:**

```javascript
Create Razorpay order → Frontend payment → 
Razorpay callback → Verify signature → 
Update booking status → Generate receipt
```

**Files:**

- `frontend/lib/razorpay.ts` - Razorpay config
- `frontend/app/api/payments/create-order/route.ts` - Create order
- `frontend/app/api/payments/verify/route.ts` - Verify payment webhook

### 6. Receipt Generation

**PDF Receipt with:**

- Temple name, Darshan type, Date/Time
- User details, Booking ID, Amount
- QR code (for entry verification)

**Files:**

- `frontend/app/api/receipts/[id]/route.ts` - Generate PDF
- `frontend/lib/pdf-generator.ts` - PDF creation utility

### 7. City Tourism Pages

**Structure:**

- Hero section with city image
- Jyotirlinga info card
- Places to visit (grid)
- Hotels (affordable to luxury)
- Restaurants (veg-friendly)
- Local transport guide
- Emergency contacts

**Files:**

- `frontend/app/(main)/city/[name]/page.tsx` - City page
- `frontend/components/city/CityInfo.tsx` - City details component
- `frontend/components/city/PlacesGrid.tsx` - Places listing

### 8. Multi-Language Support (All Indian Languages)

**Supported Languages:**

1. English (en)
2. Hindi (hi) - हिंदी
3. Gujarati (gu) - ગુજરાતી
4. Tamil (ta) - தமிழ்
5. Telugu (te) - తెలుగు
6. Marathi (mr) - मराठी
7. Bengali (bn) - বাংলা
8. Kannada (kn) - ಕನ್ನಡ
9. Malayalam (ml) - മലയാളം
10. Odia (or) - ଓଡ଼ିଆ
11. Punjabi (pa) - ਪੰਜਾਬੀ
12. Assamese (as) - অসমীয়া
13. Urdu (ur) - اردو

**Implementation:**

- **Database**: Store all content in all languages (JSON structure)
- **Language Selector**: Dropdown in header with language names in native script
- **Context/Provider**: React Context for language state (persisted in localStorage)
- **URL-based**: Optional language prefix (`/hi/jyotirlingas`, `/gu/jyotirlingas`)
- **Auto-detect**: Detect browser language on first visit
- **Fallback**: If translation missing, show English

**Content Structure:**

```json
{
  "name": {
    "en": "Kashi Vishwanath",
    "hi": "काशी विश्वनाथ",
    "gu": "કાશી વિશ્વનાથ",
    "ta": "காசி விஸ்வநாத்"
  },
  "history": {
    "en": "History text...",
    "hi": "इतिहास पाठ...",
    ...
  }
}
```

**Language Selector UI:**

- Mobile: Bottom sheet or dropdown
- Desktop: Dropdown in header
- Shows flag icon + native name
- Current language highlighted

**Files:**

- `frontend/lib/i18n.ts` - Language utilities and translations
- `frontend/lib/language-detector.ts` - Browser language detection
- `frontend/components/common/LanguageSelector.tsx` - Language picker
- `frontend/contexts/LanguageContext.tsx` - Language state management
- `frontend/locales/en.json`, `frontend/locales/hi.json`, etc. - Translation files
- `frontend/hooks/useTranslation.ts` - Translation hook

### 7. Home Page Design

**Home Page Structure:**The home page (`frontend/app/(main)/page.tsx`) will be the main landing page with the following sections:

#### Section 1: Hero Section

- **Large hero image** (rotating carousel of Jyotirlinga images or single spiritual image)
- **Main headline** (e.g., "Experience Divine Darshan at All 12 Jyotirlingas")
- **Subheadline** (e.g., "Book your spiritual journey with ease")
- **Primary CTA button** (#FE9000 orange) - "Book Darshan Now" → links to `/jyotirlingas`
- **Secondary CTA button** (#00ABE7 blue) - "Explore Temples" → links to `/jyotirlingas`
- Background: Gradient using #EDE6E3 (Parchment) and #183446 (Deep Space Blue)

#### Section 2: Quick Stats / Trust Indicators

- **4 stat cards** with icons:
- Total Jyotirlingas (12)
- Successful Bookings (dynamic count)
- Happy Devotees (user count)
- Cities Covered
- Background: #EDE6E3 (Parchment)
- Cards: White with shadow, hover effects

#### Section 3: Featured Jyotirlingas Grid

- **Grid layout** (responsive: 1 column mobile, 2 tablet, 3-4 desktop) showing all 12 Jyotirlingas
- **Quick filter buttons** above grid (Popular States: Gujarat, Maharashtra, UP, etc.)
- Each card shows:
- Temple image (lazy loaded, optimized)
- Name (in current language)
- City, State (with state badge)
- "Book Now" button (#00ABE7 blue, touch-friendly on mobile)
- "Explore City" link (#5B9279 teal)
- Hover/tap effect: Card lifts, image zooms slightly
- **"View All Jyotirlingas"** button linking to `/jyotirlingas` page with full filtering
- Background: White
- Mobile: Swipeable cards or vertical scroll

#### Section 4: Why Choose Us / Features

- **3-4 feature cards** with icons:
- "Easy Online Booking" - Simple booking process
- "Secure Payment" - Razorpay integration
- "Instant Receipt" - PDF download
- "City Guides" - Tourism information
- Icons in #FE9000 (orange) or #00ABE7 (blue)
- Background: #EDE6E3 (Parchment)

#### Section 5: How It Works (Step-by-Step)

- **4-step process** with icons:

1. Select Jyotirlinga & Darshan Type
2. Choose Date & Time Slot
3. Login & Confirm Booking
4. Pay & Get Receipt

- Visual flow with connecting lines/arrows
- Background: White

#### Section 6: Popular Cities (Carousel/Slider)

- **Horizontal scrollable cards** for top 4-6 cities
- Each city card:
- City image
- City name
- Jyotirlinga name
- "Explore City" button
- Background: #EDE6E3 (Parchment)

#### Section 7: Testimonials / Reviews (Optional)

- **3-4 testimonial cards** with:
- User name (initials)
- Rating (stars)
- Review text
- Temple visited
- Background: White

#### Section 8: Final CTA Section

- **Large call-to-action**:
- Headline: "Start Your Spiritual Journey Today"
- Description: Brief text about booking
- "Book Now" button (large, #FE9000 orange)
- Background: Gradient #183446 (Deep Space Blue) to #00ABE7 (Fresh Sky)

#### Footer

- **4-column layout**:
- Column 1: Logo, tagline, social links
- Column 2: Quick Links (Jyotirlingas, Bookings, Cities)
- Column 3: Support (Help, Contact, FAQ)
- Column 4: Legal (Privacy, Terms, About)
- Language selector (All Indian languages)
- Copyright notice
- Background: #183446 (Deep Space Blue)
- Text: White

**Header/Navigation:**

- **Sticky header** with:
- Logo (left)
- Navigation links: Home, Jyotirlingas, Cities, My Bookings
- Language selector (All Indian languages - dropdown with native names)
- Login/Profile button (#00ABE7 blue)
- Background: White with shadow
- Active link: #FE9000 (orange) underline

**Files:**

- `frontend/app/(main)/page.tsx` - Home page
- `frontend/components/home/HeroSection.tsx` - Hero component
- `frontend/components/home/FeaturedTemples.tsx` - Jyotirlinga grid
- `frontend/components/home/FeaturesSection.tsx` - Features
- `frontend/components/home/HowItWorks.tsx` - Process steps
- `frontend/components/home/CityCarousel.tsx` - Cities slider
- `frontend/components/common/Header.tsx` - Navigation header (mobile-responsive)
- `frontend/components/common/Footer.tsx` - Footer component
- `frontend/components/common/MobileNav.tsx` - Mobile hamburger menu

### 8. Admin Panel

**Features:**

- Dashboard with booking stats
- Manage Jyotirlingas (CRUD)
- Manage Darshan types & pricing
- View/manage bookings
- Slot limit management
- Reports export

**Files:**

- `frontend/app/admin/page.tsx` - Admin dashboard
- `frontend/app/admin/jyotirlingas/page.tsx` - Temple management
- `frontend/app/admin/bookings/page.tsx` - Booking management
- `frontend/components/admin/AdminLayout.tsx`

## API Routes Design

### Authentication

- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP & login
- `POST /api/auth/logout` - Logout

### Jyotirlingas

- `GET /api/jyotirlingas` - List all (query params: `state`, `city`, `search`)
- `GET /api/jyotirlingas/states` - Get all states with Jyotirlinga count
- `GET /api/jyotirlingas/[id]` - Get details
- `GET /api/jyotirlingas/[id]/darshan-types` - Get darshan types

### Bookings

- `GET /api/bookings/slots` - Get available slots (query: date, darshanTypeId)
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - User's bookings
- `GET /api/bookings/[id]` - Booking details

### Payments

- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment (webhook)

### Cities

- `GET /api/cities/[name]` - Get city info

### Receipts

- `GET /api/receipts/[id]` - Download receipt PDF

## Security Measures

1. **OTP Security:**

- Rate limiting (max 3 OTPs per phone per hour)
- OTP expiry (5 minutes)
- Backend verification only

2. **Booking Security:**

- Redis-based slot locking
- Server-side slot availability check
- Payment verification before confirmation

3. **API Security:**

- JWT authentication
- Rate limiting (express-rate-limit)
- Input validation (Zod)
- CORS configuration

4. **Payment Security:**

- Razorpay signature verification
- Never trust frontend payment status
- Webhook verification

## Initial Data Setup

**12 Jyotirlingas to seed:**

1. Somnath (Gujarat) - 2 Jyotirlingas in Gujarat
2. Mallikarjuna (Andhra Pradesh)
3. Mahakaleshwar (Madhya Pradesh)
4. Omkareshwar (Madhya Pradesh)
5. Kedarnath (Uttarakhand)
6. Bhimashankar (Maharashtra) - 3 Jyotirlingas in Maharashtra
7. Kashi Vishwanath (Uttar Pradesh) - Varanasi
8. Trimbakeshwar (Maharashtra)
9. Vaidyanath (Jharkhand)
10. Nageshwar (Gujarat)
11. Rameshwaram (Tamil Nadu)
12. Grishneshwar (Maharashtra)

**State Distribution:**

- Gujarat: 2 (Somnath, Nageshwar)
- Maharashtra: 3 (Bhimashankar, Trimbakeshwar, Grishneshwar)
- Madhya Pradesh: 2 (Mahakaleshwar, Omkareshwar)
- Uttar Pradesh: 1 (Kashi Vishwanath - Varanasi)
- Uttarakhand: 1 (Kedarnath)
- Andhra Pradesh: 1 (Mallikarjuna)
- Tamil Nadu: 1 (Rameshwaram)
- Jharkhand: 1 (Vaidyanath)

Each with:

- Basic info (name in all languages, location, images)
- **History & Significance** (in all languages):
- Why it's famous
- Historical context
- Mythological stories
- Spiritual importance
- 3-4 darshan types (Sugam, Special, VIP, etc.)
- City tourism data
- State and city codes for filtering

## Development Phases

**Phase 1: Foundation** ✅ **COMPLETED**

- ✅ Project setup (Next.js, Tailwind, MongoDB connection)
- ✅ Color theme implementation
- ✅ Basic routing structure
- ✅ **Mobile-first responsive setup**
- ✅ Firebase OTP setup
- ✅ **Multi-language infrastructure**
- ✅ Frontend/Backend separation
- ✅ Slug-based URLs for Jyotirlingas

**Phase 2: Core Features** ✅ **COMPLETED**

- ✅ Authentication flow (Login/Register separated)
- ✅ Jyotirlinga listing & detail pages
- ✅ **State/city filtering system**
- ✅ **History & significance sections**
- ✅ Booking flow (without payment)
- ✅ Slot availability system
- ✅ User profile menu with logout
- ✅ Auth context for global state

**Phase 3: Payment & Receipts** ⏸️ **SKIPPED**

- ⏸️ Razorpay integration (User requested to skip)
- ⏸️ Payment verification
- ⏸️ Receipt generation

**Phase 4: City Pages** 📋 **PENDING**

- 📋 City tourism pages
- 📋 Places, hotels, restaurants data
- 📋 Transport information
- 📋 Emergency contacts

**Phase 5: Admin Panel** 📋 **PENDING**

- 📋 Admin authentication
- 📋 CRUD operations
- 📋 Booking management
- 📋 Dashboard with stats

**Phase 6: Polish** 🔄 **IN PROGRESS**

- ✅ **Multi-language support infrastructure (all Indian languages)**
- ✅ **Mobile optimization & responsive design**
- 📋 SEO optimization
- 📋 Performance optimization
- 📋 Testing (mobile devices, various screen sizes)

## Technology Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes + Express (if needed)
- **Database:** MongoDB (Mongoose)
- **Caching/Locking:** Redis (Upstash or local)
- **Authentication:** Firebase Phone Auth
- **Payment:** Razorpay
- **PDF Generation:** pdfkit or @react-pdf/renderer
- **Validation:** Zod
- **State Management:** React Context / Zustand (if needed)
- **Mobile UI:** Touch-friendly components, swipe gestures (react-swipeable or framer-motion)
- **Language:** i18next or custom i18n solution for multi-language support

## Environment Variables Needed

```javascript
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
MONGODB_URI=
REDIS_URL=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
JWT_SECRET=
NEXT_PUBLIC_APP_URL=


```