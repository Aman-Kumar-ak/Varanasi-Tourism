# Temple Page Components

This directory contains individual page components for each Jyotirlinga temple. This allows for custom design and content for each temple while keeping the booking/payment flow consistent.

## Structure

- **DefaultTemplePage.tsx** - Default template used for temples without a custom page
- **KashiVishwanathPage.tsx** - Custom page for Kashi Vishwanath (Varanasi)
- **SomnathPage.tsx** - Custom page for Somnath Temple
- **MahakaleshwarPage.tsx** - Custom page for Mahakaleshwar (Ujjain)
- Add more temple-specific pages as needed

## How It Works

1. Each temple can have a `pageTemplate` field in the database (e.g., 'kashi-vishwanath', 'somnath')
2. The main page router (`app/(main)/jyotirlinga/[id]/page.tsx`) checks for a custom component
3. If a custom component exists, it uses that; otherwise, it falls back to `DefaultTemplePage`

## Creating a New Custom Temple Page

1. Create a new component file: `[TempleName]Page.tsx`
2. Follow the interface structure:
   ```typescript
   interface [TempleName]PageProps {
     temple: Temple;
     language: string;
   }
   ```
3. Add it to the `TEMPLE_PAGE_MAP` in `app/(main)/jyotirlinga/[id]/page.tsx`
4. Update the database seed script to include `pageTemplate: 'temple-name'` for that temple

## Benefits

- **Custom Design**: Each temple can have unique layouts, colors, and sections
- **Custom Content**: Temple-specific information, history, and highlights
- **Consistent Booking**: All temples use the same booking/payment flow
- **Easy Maintenance**: Each temple's design is isolated in its own component

## Payment Flow

The payment and booking flow remains the same for all temples - it's handled by the shared booking components in `/components/booking/`.

