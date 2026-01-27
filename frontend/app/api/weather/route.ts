import { NextResponse } from 'next/server';

// Varanasi coordinates: 25.3176° N, 82.9739° E
const VARANASI_LAT = 25.3176;
const VARANASI_LON = 82.9739;

export async function GET() {
  try {
    // Check if OpenWeatherMap API key is configured
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      // Return mock data if API key is not configured
      return NextResponse.json({
        success: true,
        data: {
          temperature: 25,
          precipitation: 'Clouds',
          windSpeed: 2.86,
          condition: 'Partly Cloudy',
        },
      });
    }

    // Fetch real weather data from OpenWeatherMap
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${VARANASI_LAT}&lon=${VARANASI_LON}&appid=${apiKey}&units=metric`;
    
    const response = await fetch(weatherUrl, {
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    if (!response.ok) {
      throw new Error('Weather API request failed');
    }

    const data = await response.json();
    
    // Transform OpenWeatherMap data to our format
    const weatherData = {
      temperature: Math.round(data.main.temp),
      precipitation: data.weather[0]?.main || 'Clear',
      windSpeed: (data.wind?.speed * 3.6).toFixed(2), // Convert m/s to km/hr
      condition: data.weather[0]?.description || 'Clear',
    };

    return NextResponse.json({
      success: true,
      data: weatherData,
    });
  } catch (error) {
    console.error('Error fetching weather:', error);
    
    // Return mock data as fallback
    return NextResponse.json({
      success: true,
      data: {
        temperature: 25,
        precipitation: 'Clouds',
        windSpeed: 2.86,
        condition: 'Partly Cloudy',
      },
    });
  }
}
