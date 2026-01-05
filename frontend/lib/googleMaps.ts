/**
 * Utility functions for Google Maps integration
 */

export interface Location {
  lat: number;
  lng: number;
}

/**
 * Opens Google Maps with directions to a location
 * @param location - The destination location
 * @param placeName - Optional name of the place for better search results
 */
export function openGoogleMapsDirections(location: Location, placeName?: string): void {
  const { lat, lng } = location;
  
  // Google Maps URL format: https://www.google.com/maps/dir/?api=1&destination=lat,lng
  // Using 'dir' mode for directions (will use user's current location as origin)
  const baseUrl = 'https://www.google.com/maps/dir/?api=1';
  const destination = `&destination=${lat},${lng}`;
  const query = placeName ? `&destination_place_id=${encodeURIComponent(placeName)}` : '';
  
  const mapsUrl = `${baseUrl}${destination}${query}`;
  
  window.open(mapsUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Opens Google Maps to view a location (without directions)
 * @param location - The location to view
 * @param placeName - Optional name of the place
 */
export function openGoogleMapsLocation(location: Location, placeName?: string): void {
  const { lat, lng } = location;
  
  // Google Maps URL format: https://www.google.com/maps/search/?api=1&query=lat,lng
  const baseUrl = 'https://www.google.com/maps/search/?api=1';
  const query = placeName 
    ? `&query=${encodeURIComponent(placeName)}`
    : `&query=${lat},${lng}`;
  
  const mapsUrl = `${baseUrl}${query}`;
  
  window.open(mapsUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Generates a Google Maps embed URL (for iframe use)
 * @param location - The location to embed
 * @param zoom - Zoom level (default: 15)
 */
export function getGoogleMapsEmbedUrl(location: Location, zoom: number = 15): string {
  const { lat, lng } = location;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  
  if (apiKey) {
    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=${zoom}`;
  }
  
  // Fallback to static map if no API key
  return `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}`;
}

