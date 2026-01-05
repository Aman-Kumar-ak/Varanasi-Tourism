---
name: Guide-First Reusable Tourism System
overview: Restructure the system to start with comprehensive guide pages (no booking), making them reusable for all cities. Add booking-enabled flags to control when booking features appear. Start with Varanasi as the first complete implementation.
todos:
  - id: update-city-model
    content: Add bookingEnabled, officialBookingUrl, spiritualSignificance, history, festivals, rituals, and darshanInfo fields to City model
    status: pending
  - id: update-jyotirlinga-model
    content: Add bookingEnabled, officialBookingUrl, spiritualSignificance, history, and darshanInfo fields to Jyotirlinga model
    status: pending
  - id: enhance-place-schema
    content: Add category, spiritualImportance, bestTimeToVisit, and visitDuration to Place schema in City model
    status: pending
  - id: create-comprehensive-city-guide
    content: Create ComprehensiveCityGuide.tsx component with all sections (spiritual significance, history, places, rituals, festivals, darshan info, etc.)
    status: pending
    dependencies:
      - update-city-model
  - id: create-darshan-info-section
    content: Create DarshanInfoSection.tsx component that shows darshan types with booking status and official links
    status: pending
    dependencies:
      - update-jyotirlinga-model
  - id: update-city-page
    content: Update city/[name]/page.tsx to use ComprehensiveCityGuide component
    status: pending
    dependencies:
      - create-comprehensive-city-guide
  - id: update-temple-pages
    content: Update DefaultTemplePage and KashiVishwanathPage to use bookingEnabled flag and show official links when disabled
    status: pending
    dependencies:
      - create-darshan-info-section
      - update-jyotirlinga-model
  - id: update-backend-routes
    content: Update cities.ts and jyotirlingas.ts routes to include all new fields in API responses
    status: pending
    dependencies:
      - update-city-model
      - update-jyotirlinga-model
  - id: add-transportation-model
    content: Add entryPoints, transportOptions, routes, and transportTips fields to City model
    status: pending
    dependencies:
      - update-city-model
  - id: create-transportation-components
    content: Create TransportationGuide.tsx, RoutePlanner.tsx, EntryPointCard.tsx, and RouteCard.tsx components
    status: pending
    dependencies:
      - add-transportation-model
  - id: cleanup-booking-routes
    content: Comment out or disable booking, payment, receipt, and time-slot routes in server.ts (keep files for future use)
    status: pending
  - id: cleanup-booking-frontend
    content: Hide/disable booking pages and links in frontend (booking/, my-bookings/) - keep files but make them inaccessible or show 'Coming Soon'
    status: pending
  - id: cleanup-seed-data
    content: Remove booking-related seed data (time slots, booking-enabled darshan types) and keep only guide content
    status: pending
  - id: cleanup-navigation
    content: Remove booking links from navigation/header, keep only guide-related navigation
    status: pending
  - id: seed-varanasi-data
    content: Add comprehensive Varanasi guide content to seed script including entry points, transport options, routes (Airport/Station to key destinations), and transport tips
    status: pending
    dependencies:
      - update-city-model
      - update-jyotirlinga-model
      - add-transportation-model
      - cleanup-seed-data
---

# Guide-First Reusable Tourism System

## Overview

Transform the system from booking-first to **guide-first**, with a reusable page structure that works for all cities. The same page template will be used for Varanasi, Ujjain, Somnath, and all future cities. Booking features will be controlled by flags and can be enabled later when temple trusts are onboarded.

## Architecture Changes

### Phase 1: Data Model Updates

**1.1. Add Booking Control Flags**

- **City Model** (`backend/src/models/City.ts`):
- Add `bookingEnabled: boolean` (default: `false`)
- Add `officialBookingUrl?: string` (for temple trust booking links)
- Add `spiritualSignificance: IMultiLanguageContent` (comprehensive spiritual context)
- Add `history: IMultiLanguageContent` (historical background)
- Add `festivals: Array<{name: string, date: string, description: IMultiLanguageContent}>`
- Add `rituals: Array<{name: IMultiLanguageContent, description: IMultiLanguageContent, timing?: string}>`
- Add `darshanInfo: IMultiLanguageContent` (how to book darshan - informational)
- **Jyotirlinga Model** (`backend/src/models/Jyotirlinga.ts`):
- Add `bookingEnabled: boolean` (default: `false`)
- Add `officialBookingUrl?: string`
- Add `spiritualSignificance: IMultiLanguageContent`
- Add `history: IMultiLanguageContent`
- Add `darshanInfo: IMultiLanguageContent` (informational guide on booking process)

**1.2. Enhance Place Schema**

- Add `category: 'temple' | 'ghat' | 'monument' | 'market' | 'museum' | 'other'`
- Add `spiritualImportance?: IMultiLanguageContent`
- Add `bestTimeToVisit?: string`
- Add `visitDuration?: string` (e.g., "1-2 hours")

**1.3. Add Transportation & Routing System**

- **City Model** (`backend/src/models/City.ts`):
                                                                                                                                - Add `entryPoints: Array<{type: 'airport' | 'railway' | 'bus', name: string, location: {lat: number, lng: number}, code?: string}>`
                                                                                                                                - Add `transportOptions: Array<{type: 'taxi' | 'auto' | 'rickshaw' | 'bus' | 'metro' | 'boat', name: string, description: IMultiLanguageContent, priceRange: {min: number, max: number, currency: string}, perKm?: boolean, perHour?: boolean}>`
                                                                                                                                - Add `routes: Array<{from: string, to: string, distance: number, duration: number, transportOptions: Array<{type: string, priceRange: {min: number, max: number}, estimatedTime: number, tips?: IMultiLanguageContent}>, routeDescription?: IMultiLanguageContent}>`
                                                                                                                                - Add `transportTips: IMultiLanguageContent` (anti-fraud tips, bargaining advice, etc.)

**Note**: Routes will be stored as "from entry point to destination" (e.g., "Airport to Kashi Vishwanath Temple", "Railway Station to Dashashwamedh Ghat"). This structure allows for future AI integration while providing manual routes now.

### Phase 2: Reusable City Guide Page Component

**2.1. Create Comprehensive City Guide Template**Create `frontend/components/city/ComprehensiveCityGuide.tsx` - a single reusable component that handles:

- **Hero Section**: City name, state, main image, spiritual tagline
- **Spiritual Significance**: Why this city is important
- **History Section**: Historical background
- **Places to Visit**: Enhanced with categories (temples, ghats, monuments, etc.)
- **Main Jyotirlinga/Temple Section**: Link to temple page with booking status
- **Rituals & Practices**: Local rituals, timings, significance
- **Festivals Calendar**: Important festivals and dates
- **Darshan Information**: How to book (informational, with official links if available)
- **Hotels & Accommodation**: Existing hotels section
- **Restaurants & Food**: Existing restaurants section
- **How to Reach**: Entry points (Airport, Railway, Bus) with location info
- **Transportation Guide**: 
                                                                                                                                - Available transport modes (Taxi, Auto, Rickshaw, Bus) with price ranges
                                                                                                                                - Anti-fraud tips and bargaining guidelines
                                                                                                                                - Route planner section showing routes from entry points to key destinations
- **Weather & Best Time**: Existing weather info
- **Emergency Contacts**: Existing emergency contacts

**2.2. Create Transportation Components**

- **TransportationGuide.tsx**: Shows available transport modes with price ranges
- **RoutePlanner.tsx**: Interactive section showing routes from entry points (Airport/Railway/Bus) to destinations
- **EntryPointCard.tsx**: Card showing entry point info (Airport code, station name, etc.)
- **RouteCard.tsx**: Card showing a specific route with distance, time, transport options, and price ranges

**2.3. Update City Page Route**Modify `frontend/app/(main)/city/[name]/page.tsx` to:

- Use the new `ComprehensiveCityGuide` component
- Pass all city data to the component
- Handle loading and error states

### Phase 3: Temple Page Updates for Guide Mode

**3.1. Update Default Temple Page**Modify `frontend/components/temples/DefaultTemplePage.tsx`:

- Check `bookingEnabled` flag from temple data
- If `bookingEnabled === false`:
- Show darshan types as **informational cards** (no booking buttons)
- Display "How to Book" section with official booking link if available
- Show "Booking through official temple trust website" message
- If `bookingEnabled === true`:
- Show booking buttons (existing behavior)

**3.2. Update Kashi Vishwanath Page**Modify `frontend/components/temples/KashiVishwanathPage.tsx`:

- Apply same booking-enabled logic
- Keep custom content but make booking conditional

**3.3. Create Reusable Darshan Info Component**Create `frontend/components/temples/DarshanInfoSection.tsx`:

- Displays darshan types
- Shows booking status (enabled/disabled)
- Shows official booking links when disabled
- Reusable across all temple pages

### Phase 4: Backend API Updates

**4.1. Update City Routes**Modify `backend/src/routes/cities.ts`:

- Include `bookingEnabled` and `officialBookingUrl` in responses
- Include new fields (spiritualSignificance, history, festivals, rituals, darshanInfo)

**4.2. Update Jyotirlinga Routes**Modify `backend/src/routes/jyotirlingas.ts`:

- Include `bookingEnabled` and `officialBookingUrl` in responses
- Include new fields (spiritualSignificance, history, darshanInfo)

### Phase 5: Varanasi Seed Data

**5.1. Comprehensive Varanasi Content**Update `backend/src/scripts/seed.ts` to include:

- Complete spiritual significance content (English + Hindi)
- Historical background
- All major ghats (Dashashwamedh, Manikarnika, Assi, etc.)
- Major temples (Kashi Vishwanath, Sankat Mochan, Durga Temple, etc.)
- Rituals (Ganga Aarti, Morning Aarti, etc.)
- Festivals (Maha Shivaratri, Dev Deepawali, etc.)
- Darshan information with official Kashi Vishwanath booking link
- **Entry Points**: 
                                                                - Lal Bahadur Shastri International Airport (VNS)
                                                                - Varanasi Junction Railway Station (BSB)
                                                                - Varanasi Bus Stand
- **Transport Options**: Taxi (₹15-20/km), Auto-rickshaw (₹10-15/km), E-rickshaw (₹5-10/km), Bus (₹10-50), Boat (for ghats)
- **Key Routes**:
                                                                - Airport → Kashi Vishwanath (25 km, 45 min, Taxi: ₹400-600, Auto: ₹300-450)
                                                                - Airport → Dashashwamedh Ghat (26 km, 50 min, Taxi: ₹450-650, Auto: ₹350-500)
                                                                - Railway Station → Kashi Vishwanath (4 km, 15 min, Auto: ₹80-120, E-rickshaw: ₹50-80)
                                                                - Railway Station → Dashashwamedh Ghat (5 km, 20 min, Auto: ₹100-150, E-rickshaw: ₹60-100)
                                                                - Bus Stand → Kashi Vishwanath (3 km, 10 min, Auto: ₹60-100, E-rickshaw: ₹40-70)
- **Transport Tips**: Anti-fraud guidelines, bargaining tips, meter vs fixed fare advice
- Set `bookingEnabled: false` for Varanasi city
- Set `bookingEnabled: false` for Kashi Vishwanath temple

### Phase 6: Content Structure for Reusability

**6.1. Content Sections Standardization**All cities will have the same structure:

```javascript
City {
    - Basic Info (name, state, images)
    - Spiritual Significance
    - History
    - Places (categorized)
    - Main Temple/Jyotirlinga
    - Rituals
    - Festivals
    - Darshan Info (with booking status)
    - Hotels
    - Restaurants
    - Entry Points (Airport, Railway, Bus)
    - Transport Options (Taxi, Auto, Bus with price ranges)
    - Routes (from entry points to destinations)
    - Transport Tips (anti-fraud, bargaining)
    - Weather
    - Emergency Contacts
}
```

**6.2. Template-Based Rendering**The `ComprehensiveCityGuide` component will:

- Check if sections have data
- Only render sections with content
- Use consistent styling across all cities
- Support all languages from the start

**6.3. Transportation & Routing System Design**The transportation system is designed to:

- **Prevent Fraud**: Show price ranges so travelers know what to expect
- **Entry Point Based**: Organize routes from where travelers arrive (Airport, Railway, Bus)
- **Destination Focused**: Show routes to key places (temples, hotels, ghats, markets)
- **Multi-Modal**: Support all transport types (Taxi, Auto, Rickshaw, Bus, Boat)
- **AI-Ready Structure**: Data format allows future AI integration for:
                                                                - Dynamic route suggestions based on traffic
                                                                - Real-time price updates
                                                                - Personalized route recommendations
                                                                - Multi-stop route optimization

**Route Structure Example:**

```javascript
{
  from: "Lal Bahadur Shastri Airport",
  to: "Kashi Vishwanath Temple",
  distance: 25, // km
  duration: 45, // minutes
  transportOptions: [
    {
      type: "taxi",
      priceRange: { min: 400, max: 600 },
      estimatedTime: 45,
      tips: "Always ask for meter or agree on fare before starting"
    },
    {
      type: "auto",
      priceRange: { min: 300, max: 450 },
      estimatedTime: 50,
      tips: "Bargain before boarding, typical rate ₹12-15/km"
    }
  ]
}
```

**Transport Options Structure:**

```javascript
{
  type: "auto",
  name: "Auto Rickshaw",
  description: "Most common mode of transport in Varanasi",
  priceRange: { min: 10, max: 15, currency: "INR" },
  perKm: true,
  tips: "Always negotiate fare before starting journey"
}
```



## Implementation Files

### New Files to Create:

1. `frontend/components/city/ComprehensiveCityGuide.tsx` - Main reusable city guide component
2. `frontend/components/temples/DarshanInfoSection.tsx` - Reusable darshan info component
3. `frontend/components/city/SectionHeader.tsx` - Reusable section header component
4. `frontend/components/city/PlaceCard.tsx` - Enhanced place card with categories
5. `frontend/components/city/TransportationGuide.tsx` - Transport modes with price ranges
6. `frontend/components/city/RoutePlanner.tsx` - Routes from entry points to destinations
7. `frontend/components/city/EntryPointCard.tsx` - Entry point information card
8. `frontend/components/city/RouteCard.tsx` - Individual route card with transport options

### Files to Modify:

1. `backend/src/models/City.ts` - Add new fields
2. `backend/src/models/Jyotirlinga.ts` - Add booking flags and content fields
3. `frontend/app/(main)/city/[name]/page.tsx` - Use new component
4. `frontend/components/temples/DefaultTemplePage.tsx` - Add booking-enabled logic
5. `frontend/components/temples/KashiVishwanathPage.tsx` - Add booking-enabled logic
6. `backend/src/routes/cities.ts` - Include new fields
7. `backend/src/routes/jyotirlingas.ts` - Include new fields
8. `backend/src/scripts/seed.ts` - Add comprehensive Varanasi data

## Cleanup Strategy (Phase 0 - Before New Implementation)

### What to Clean Up

**0.1. Backend Routes (Disable, Don't Delete)**

- Comment out booking routes in `backend/src/server.ts`
- Comment out payment routes
- Comment out receipt routes  
- Comment out time-slot routes
- Keep all route files for future use

**0.2. Frontend Pages (Hide/Disable)**

- Update `frontend/app/(main)/booking/page.tsx` to show "Coming Soon" message
- Update `frontend/app/(main)/my-bookings/page.tsx` to show "Coming Soon" message
- Keep all booking component files for future use

**0.3. Navigation (Remove Links)**

- Remove booking links from `frontend/components/common/Header.tsx`
- Remove "My Bookings" from user menu

**0.4. Seed Data (Clean)**

- Remove time slot seeding from `backend/src/scripts/seed.ts`
- Keep DarshanType seeding but mark all as `bookingEnabled: false`
- Remove booking-related data from seed script

**0.5. Database (Optional Clean)**

- Optionally clear existing Booking, TimeSlot collections
- Keep User, Jyotirlinga, City, DarshanType data

### Files to Modify for Cleanup:

1. `backend/src/server.ts` - Comment out booking routes
2. `backend/src/scripts/seed.ts` - Remove booking seed data
3. `frontend/components/common/Header.tsx` - Remove booking links
4. `frontend/app/(main)/booking/page.tsx` - Show "Coming Soon"
5. `frontend/app/(main)/my-bookings/page.tsx` - Show "Coming Soon"
6. `frontend/components/temples/*` - Remove booking buttons, show info only

## Migration Strategy

1. **Cleanup existing booking system** (Phase 0 - disable, don't delete)
2. **Add new fields to models** (backward compatible - all optional)
3. **Update components** to handle both old and new data structures
4. **Seed Varanasi** with comprehensive guide content
5. **Test the reusable template** with Varanasi
6. **Verify** that adding a new city only requires database seeding (no code changes)

## Benefits

1. **Single Template**: One component handles all cities
2. **Progressive Enhancement**: Start guide-only, enable booking later
3. **Trust Building**: Official links show respect for temple authorities
4. **SEO Friendly**: Rich content for search engines
5. **Scalable**: Add new cities by just adding database records
6. **Future-Proof**: Booking can be enabled per city/temple when ready
7. **Transportation Safety**: Price ranges prevent fraud and help travelers budget
8. **AI-Ready**: Route structure allows future AI integration for dynamic route suggestions

## Transportation System UI/UX

### How It Works for Users

**1. Entry Point Selection**

- User sees cards for: Airport, Railway Station, Bus Stand
- Each card shows: Name, code (if applicable), location on map
- User clicks on their arrival point

**2. Route Display**

- Shows all available routes from selected entry point
- Routes organized by destination (Temples, Hotels, Ghats, etc.)
- Each route shows:
                                                                - Distance and estimated time
                                                                - Available transport options
                                                                - Price range for each option
                                                                - Tips and warnings

**3. Transport Mode Comparison**

- Side-by-side comparison of transport options
- Price ranges clearly displayed (prevents fraud)
- Tips for each mode (bargaining, meter usage, etc.)

**4. Anti-Fraud Features**

- Clear price ranges (not single prices)
- Tips section: "Always negotiate before boarding"
- Warning badges for common scams
- Official taxi/auto stand locations

### Example User Flow

1. User arrives at Varanasi Airport
2. Opens Varanasi city page
3. Scrolls to "How to Reach" section
4. Sees: "From Airport" section
5. Views routes: Airport → Kashi Vishwanath, Airport → Hotels, etc.
6. Sees price ranges: Taxi ₹400-600, Auto ₹300-450
7. Reads tips: "Agree on fare before starting"
8. Makes informed decision

## Future AI Integration (Phase 2+)

The data structure is designed to support:

- **Real-time Traffic**: AI can suggest faster routes based on current traffic
- **Dynamic Pricing**: Update price ranges based on time of day, season
- **Personalized Routes**: Suggest routes based on user preferences (budget, time, comfort)
- **Multi-Stop Optimization**: "Visit these 5 places in optimal order"
- **Weather-Based Suggestions**: Suggest indoor routes during monsoon
- **Crowd Avoidance**: Suggest less crowded routes during peak times

## Cleanup Checklist (Before Starting Implementation)

**Phase 0: Cleanup Existing Booking System**

- [ ] Comment out booking routes in `backend/src/server.ts` (keep files)
- [ ] Comment out payment routes in `backend/src/server.ts`
- [ ] Comment out receipt routes in `backend/src/server.ts`
- [ ] Comment out time-slot routes in `backend/src/server.ts`
- [ ] Update `frontend/app/(main)/booking/page.tsx` to show "Coming Soon"
- [ ] Update `frontend/app/(main)/my-bookings/page.tsx` to show "Coming Soon"
- [ ] Remove booking links from `frontend/components/common/Header.tsx`
- [ ] Remove "My Bookings" from user menu
- [ ] Update temple pages to remove booking buttons (show info only)
- [ ] Clean seed script: Remove time slot seeding
- [ ] Clean seed script: Mark all darshan types as `bookingEnabled: false`
- [ ] (Optional) Clear Booking and TimeSlot collections from database