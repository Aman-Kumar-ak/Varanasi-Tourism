---
name: Enhance Varanasi Tourism Website with Quotes and Kashi.gov.in Inspired Features
overview: Add a quotes section with images (inspired by kashi.gov.in) and enhance the website with additional content sections, improved navigation, and better mobile/desktop responsiveness based on the official Kashi portal design.
todos:
  - id: "1"
    content: Create Quote model in backend (backend/src/models/Quote.ts) with multilingual quote text, author, source, image, and order fields
    status: completed
  - id: "2"
    content: Add quotes routes to backend (backend/src/routes/quotes.ts) with CRUD operations
    status: completed
  - id: "3"
    content: Create QuotesSection component (frontend/components/city/QuotesSection.tsx) with carousel, circular images, and multilingual support
    status: completed
  - id: "4"
    content: Create WeatherWidget component (frontend/components/common/WeatherWidget.tsx) with temperature, precipitation, and wind data
    status: completed
  - id: "5"
    content: Create Next.js API route for weather (frontend/app/api/weather/route.ts) to proxy weather API requests
    status: completed
  - id: "6"
    content: Enhance Header component with dropdown menus for Top Attractions, Themes, Events, Places to Stay, and Cuisine
    status: in_progress
  - id: "7"
    content: Create ThemesSection component (frontend/components/city/ThemesSection.tsx) displaying City Life, Sports, Music, Spirituality, Education themes
    status: pending
  - id: "8"
    content: Create TopAttractions component (frontend/components/home/TopAttractions.tsx) showing top 5 attractions carousel
    status: completed
  - id: "9"
    content: Create CuisineSection component (frontend/components/city/CuisineSection.tsx) displaying local cuisine and restaurants
    status: pending
  - id: "10"
    content: Create PlacesToStay component (frontend/components/city/PlacesToStay.tsx) with filters for hotel types and location
    status: pending
  - id: "11"
    content: Update City model to include quotes reference, themes array, and enhanced restaurant fields
    status: pending
  - id: "12"
    content: Integrate QuotesSection into home page and city guide page
    status: completed
  - id: "13"
    content: Add all new translations to translations.ts file for multilingual support
    status: pending
  - id: "14"
    content: Update ComprehensiveCityGuide to include new sections (Quotes, Themes, Cuisine, enhanced Places to Stay)
    status: pending
  - id: "15"
    content: Create seed script or admin interface to add the 7 provided quotes (Mark Twain, Sadhguru, Ustad Bismillah Khan x2, Skanda Purana, Mahatma Gandhi, Annie Besant)
    status: completed
  - id: "16"
    content: Add translations for all 7 quotes in all supported languages (en, hi, gu, ta, te, mr, bn, kn, ml, or, pa, as, ur)
    status: completed
isProject: false
---

# Enhance Varanasi Tourism Website with Quotes and Kashi.gov.in Inspired Features

## Overview

This plan adds a quotes section with images (similar to kashi.gov.in's "Legacy of Varanasi" quotes) and enhances the website with additional content sections, improved navigation, and better responsiveness inspired by the official Kashi portal.

## Key Features from kashi.gov.in to Implement

1. **Quotes Section** - Display quotes with circular images, attribution, and carousel navigation
2. **Weather Widget** - Current weather information for Varanasi
3. **Enhanced Navigation** - Better menu structure with dropdowns
4. **Themes Section** - City Life, Sports, Music, Spirituality, Education
5. **Top Attractions** - Featured attractions carousel
6. **Events Calendar** - Enhanced events display
7. **Cuisine Section** - Food and culinary experiences
8. **Places to Stay** - Accommodation options with filters

## Implementation Plan

### 1. Backend: Add Quotes Model

**File: `backend/src/models/Quote.ts`** (new file)

- Create a Quote model with:
  - `quote`: IMultiLanguageContent (quote text in multiple languages)
  - `author`: string (name of the person)
  - `source`: IMultiLanguageContent (optional source/book/context)
  - `image`: string (Cloudinary URL for circular portrait)
  - `order`: number (for sorting)
  - `isActive`: boolean (to show/hide quotes)

**File: `backend/src/models/City.ts`**

- Add `quotes?: mongoose.Types.ObjectId[]` field to reference Quote documents
- Or add `quotes?: IQuote[]` as embedded documents

**File: `backend/src/routes/quotes.ts`** (new file)

- GET `/api/quotes` - Get all active quotes
- GET `/api/quotes/:cityId` - Get quotes for a specific city
- POST `/api/quotes` - Create quote (admin only)
- PUT `/api/quotes/:id` - Update quote (admin only)
- DELETE `/api/quotes/:id` - Delete quote (admin only)

### 2. Frontend: Quotes Component

**File: `frontend/components/city/QuotesSection.tsx`** (new file)

- Create a carousel component displaying quotes
- Each quote card should have:
  - Large decorative quotation marks (top-left and bottom-right)
  - Quote text (multilingual)
  - Circular image of the author (centered below quote)
  - Author name and source (below image)
- Features:
  - Horizontal carousel/slider with navigation arrows
  - Responsive: 1 card on mobile, 2-3 on tablet, 3 on desktop
  - Smooth transitions
  - Auto-play option (optional)
  - Touch/swipe support for mobile

**Design Inspiration:**

- White cards with rounded corners
- Orange accent colors (matching kashi.gov.in)
- Subtle shadows
- Clean typography

### 3. Frontend: Weather Widget Component

**File: `frontend/components/common/WeatherWidget.tsx`** (new file)

- Display current weather for Varanasi
- Show:
  - Temperature (°C)
  - Precipitation/Clouds
  - Wind speed (km/hr)
- Use a weather API (OpenWeatherMap or similar)
- Cache results to avoid excessive API calls

**File: `frontend/app/api/weather/route.ts`** (new file)

- Next.js API route to fetch weather data
- Proxy requests to weather API (keep API key server-side)

### 4. Frontend: Enhanced Navigation

**File: `frontend/components/common/Header.tsx`**

- Add dropdown menus for main navigation items:
  - Top Attractions (with sub-items)
  - Themes (City Life, Sports, Music, Spirituality, Education)
  - Events
  - Places to Stay
  - Cuisine
- Improve mobile hamburger menu
- Add search functionality (if not already present)

### 5. Frontend: Themes Section

**File: `frontend/components/city/ThemesSection.tsx`** (new file)

- Display theme cards:
  - City Life
  - Sports
  - Music
  - Spirituality
  - Education
- Each theme card links to filtered content
- Use images/icons for each theme

**File: `backend/src/models/City.ts`**

- Add `themes?: Array<{name: string, description: IMultiLanguageContent, image?: string}>` field

### 6. Frontend: Top Attractions Carousel

**File: `frontend/components/home/TopAttractions.tsx`** (new file)

- Display top 5 attractions in a carousel
- Similar to kashi.gov.in's "Top 5 Attractions" section
- Include:
  - Kashi Vishwanath Temple
  - Assi Ghat
  - Manikarnika Ghat
  - Namo Ghat
  - Shri Durga Temple
- Make it clickable to navigate to place details

### 7. Frontend: Cuisine Section

**File: `frontend/components/city/CuisineSection.tsx`** (new file)

- Display local cuisine information
- Show popular dishes, restaurants, food experiences
- Use existing `restaurants` data from City model
- Add cuisine-specific content

**File: `backend/src/models/City.ts`**

- Enhance `restaurants` schema with:
  - `cuisine`: string (e.g., "Banarasi Thali", "Kachori")
  - `specialty`: IMultiLanguageContent
  - `image`: string

### 8. Frontend: Places to Stay Enhancement

**File: `frontend/components/city/PlacesToStay.tsx`** (new file)

- Enhanced accommodation section with filters:
  - Filter by: Hotels, Budget Hotels, Guest House, Dharamshala, Dormitory, Luxury Hotels
  - "Near By" location filter
  - Show results button
- Use existing `hotels` data from City model

### 9. Frontend: Home Page Enhancements

**File: `frontend/app/page.tsx`**

- Add QuotesSection after hero section
- Add WeatherWidget (can be in header or sidebar)
- Add TopAttractions section
- Improve overall layout to match kashi.gov.in structure

### 10. Frontend: City Guide Page Enhancements

**File: `frontend/components/city/ComprehensiveCityGuide.tsx`**

- Add QuotesSection component
- Add ThemesSection component
- Add CuisineSection component
- Enhance PlacesToStay section
- Improve section ordering to match kashi.gov.in flow

### 11. Translations

**File: `frontend/lib/translations.ts`**

- Add translations for:
  - Quotes section title
  - "Weather @Varanasi"
  - Theme names
  - Cuisine section
  - All new UI elements

### 12. Responsive Design Improvements

- Ensure all new components are mobile-first
- Test on various screen sizes
- Improve touch interactions for mobile
- Optimize images for different devices

## Data Structure

### Quote Model Structure

```typescript
interface IQuote {
  quote: IMultiLanguageContent;
  author: string;
  source?: IMultiLanguageContent;
  image: string; // Cloudinary URL
  order: number;
  isActive: boolean;
  cityId?: mongoose.Types.ObjectId; // Optional: link to city
}
```

### Example Quote Data

```typescript
{
  quote: {
    en: "Varanasi is older than history, older than tradition, even older than legend, and looks twice as old as all of them put together.",
    hi: "वाराणसी इतिहास से भी पुरानी है, परंपरा से भी पुरानी है, यहाँ तक कि किंवदंती से भी पुरानी है, और उन सभी को मिलाकर दोगुनी पुरानी लगती है।",
    // ... other languages
  },
  author: "Mark Twain",
  source: {
    en: "English Author",
    hi: "अंग्रेजी लेखक",
    // ... other languages
  },
  image: "https://res.cloudinary.com/.../mark_twain.jpg", // Circular portrait
  order: 1,
  isActive: true,
  cityId: ObjectId("...") // Varanasi city ID
}
```

## API Endpoints

- `GET /api/quotes` - Get all active quotes
- `GET /api/quotes/city/:cityId` - Get quotes for specific city
- `GET /api/weather` - Get weather for Varanasi (via Next.js API route)

## Files to Create

1. `backend/src/models/Quote.ts`
2. `backend/src/routes/quotes.ts`
3. `frontend/components/city/QuotesSection.tsx`
4. `frontend/components/common/WeatherWidget.tsx`
5. `frontend/components/city/ThemesSection.tsx`
6. `frontend/components/home/TopAttractions.tsx`
7. `frontend/components/city/CuisineSection.tsx`
8. `frontend/components/city/PlacesToStay.tsx`
9. `frontend/app/api/weather/route.ts`

## Files to Modify

1. `backend/src/models/City.ts` - Add quotes, themes, enhanced restaurants
2. `backend/src/server.ts` - Add quotes routes
3. `frontend/components/common/Header.tsx` - Enhanced navigation
4. `frontend/app/page.tsx` - Add new sections
5. `frontend/components/city/ComprehensiveCityGuide.tsx` - Add new sections
6. `frontend/lib/translations.ts` - Add new translations

## Design Guidelines

- **Colors**: Use orange (#FE9000) as primary accent (matching kashi.gov.in)
- **Typography**: Clean, readable fonts with proper multilingual support
- **Spacing**: Generous white space, card-based layouts
- **Images**: Circular portraits for quotes, optimized images throughout
- **Animations**: Smooth transitions, subtle hover effects
- **Mobile**: Touch-friendly, swipeable carousels, hamburger menu

## Quotes Data to Add

The following quotes have been provided and need to be added to the system:

1. **Mark Twain** (English Author)

   - Quote: "Varanasi is older than history, older than tradition, even older than legend, and looks twice as old as all of them put together."
   - Source: English Author

2. **Sadhguru** (Founder of the Isha Foundation)

   - Quote: "To visit Varanasi is to step into a world where the ancient and the eternal merge seamlessly."
   - Source: Founder of the Isha Foundation

3. **Ustad Bismillah Khan**

   - Quote: "Varanasi is my home, my life, my breath. I can never leave this city, for it has given me everything I need. It has given me music, it has given me God."
   - Source: (none specified)

4. **Ustad Bismillah Khan**

   - Quote: "An image can never be the real thing. Varanasi is where the Ganga flows, where I can play the Shehnai for Lord Balaji. I shall be at home, nowhere else but in India."
   - Source: (none specified)

5. **Skanda Purana**

   - Quote: "The three worlds form one city of mine, and Kashi is my royal palace therein."
   - Source: Skanda Purana

6. **Mahatma Gandhi**

   - Quote: "Varanasi is the city of light where the soul finds its illumination."
   - Source: (none specified)

7. **Annie Besant** (English Theosophist & Women's rights activist)

   - Quote: "Varanasi is the India of your dreams. It is the city of Shiva, the most ancient living city in the world, the center of Hinduism, and the heart of India."
   - Source: English Theosophist & Women's rights activist

**Note:** Images for each quote author will need to be provided and uploaded to Cloudinary. The images should be circular portraits suitable for display in the quotes carousel.

## Next Steps After Implementation

1. Add provided quotes data via seed script or admin panel
2. Upload author images to Cloudinary for each quote
3. User will provide additional content (themes, cuisine, etc.) later
4. Configure weather API key
5. Test on various devices
6. Optimize performance and loading times