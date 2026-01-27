'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/lib/translations';

interface WeatherData {
  temperature: number;
  precipitation: string;
  windSpeed: number;
  condition: string;
}

export default function WeatherWidget() {
  const { language } = useLanguage();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/weather');
        const data = await response.json();
        
        if (data.success) {
          setWeather(data.data);
        } else {
          setError(data.message || 'Failed to fetch weather');
        }
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError('Unable to load weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    
    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border-2 border-primary-saffron/20 p-3 sm:p-4 md:p-5 relative overflow-hidden">
        {/* Decorative gradient background */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-temple opacity-5 rounded-full -mr-12 -mt-12"></div>
        
        <div className="flex items-center justify-between mb-3 relative z-10">
          <h3 className="text-primary-saffron font-bold text-sm sm:text-base md:text-lg flex items-center gap-2">
            <span className="text-lg sm:text-xl">🌤️</span>
            {t('weather.title', language)}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-xs sm:text-sm relative z-10">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border-2 border-primary-saffron/20 p-3 sm:p-4 md:p-5 relative overflow-hidden">
        {/* Decorative gradient background */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-temple opacity-5 rounded-full -mr-12 -mt-12"></div>
        
        <div className="flex items-center justify-between mb-3 relative z-10">
          <h3 className="text-primary-saffron font-bold text-sm sm:text-base md:text-lg flex items-center gap-2">
            <span className="text-lg sm:text-xl">🌤️</span>
            {t('weather.title', language)}
          </h3>
        </div>
        <div className="text-slate-500 text-xs sm:text-sm relative z-10">
          {t('weather.unavailable', language)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border-2 border-primary-saffron/30 p-3 sm:p-4 md:p-5 relative overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-temple opacity-5 rounded-full -mr-16 -mt-16"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4 relative z-10">
        <h3 className="text-primary-saffron font-bold text-sm sm:text-base md:text-lg flex items-center gap-2">
          <span className="text-lg sm:text-xl">🌤️</span>
          {t('weather.title', language)}
        </h3>
      </div>
      
      {/* Horizontal Layout - Always Horizontal */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 relative z-10">
        {/* Temperature */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 bg-gradient-to-br from-primary-saffron/5 to-primary-gold/5 rounded-lg sm:rounded-xl p-1.5 sm:p-2 md:p-2.5 lg:p-3 border border-primary-saffron/10 hover:shadow-md transition-shadow">
          <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full bg-gradient-to-br from-primary-saffron/20 to-primary-gold/20 flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">🌡️</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold text-primary-dark leading-tight">
              {weather.temperature}°C
            </div>
            <div className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-slate-600 mt-0.5 line-clamp-1">
              {t('weather.temperature', language)}
            </div>
          </div>
        </div>

        {/* Precipitation/Clouds */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 bg-gradient-to-br from-primary-saffron/5 to-primary-gold/5 rounded-lg sm:rounded-xl p-1.5 sm:p-2 md:p-2.5 lg:p-3 border border-primary-saffron/10 hover:shadow-md transition-shadow">
          <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full bg-gradient-to-br from-primary-saffron/20 to-primary-gold/20 flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">☁️</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-semibold text-primary-dark leading-tight line-clamp-1">
              {weather.precipitation}
            </div>
            <div className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-slate-600 mt-0.5 line-clamp-1">
              {t('weather.precipitation', language)}
            </div>
          </div>
        </div>

        {/* Wind */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 bg-gradient-to-br from-primary-saffron/5 to-primary-gold/5 rounded-lg sm:rounded-xl p-1.5 sm:p-2 md:p-2.5 lg:p-3 border border-primary-saffron/10 hover:shadow-md transition-shadow">
          <div className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full bg-gradient-to-br from-primary-saffron/20 to-primary-gold/20 flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">💨</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-semibold text-primary-dark leading-tight">
              {weather.windSpeed} km/hr
            </div>
            <div className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-slate-600 mt-0.5 line-clamp-1">
              {t('weather.wind', language)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
