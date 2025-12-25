'use client';

import { useState, useEffect } from 'react';
import { INDIAN_STATES } from '@/lib/constants';

interface FilterBarProps {
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
  onSearchChange: (search: string) => void;
  selectedState: string;
  selectedCity: string;
  searchQuery: string;
  cities: string[];
}

export default function FilterBar({
  onStateChange,
  onCityChange,
  onSearchChange,
  selectedState,
  selectedCity,
  searchQuery,
  cities,
}: FilterBarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Filter Bar */}
      <div className="hidden md:block sticky top-16 z-40 bg-white shadow-md border-b border-primary-blue/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* State Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-primary-dark mb-2">
                Filter by State
              </label>
              <select
                value={selectedState}
                onChange={(e) => onStateChange(e.target.value)}
                className="w-full px-4 py-2 border border-primary-blue/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              >
                <option value="all">All States</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state.code} value={state.name}>
                    {state.name} ({state.jyotirlingaCount})
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            {selectedState !== 'all' && cities.length > 0 && (
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-primary-dark mb-2">
                  Filter by City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => onCityChange(e.target.value)}
                  className="w-full px-4 py-2 border border-primary-blue/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                >
                  <option value="all">All Cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-primary-dark mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search temples..."
                className="w-full px-4 py-2 border border-primary-blue/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
              />
            </div>

            {/* Clear Filters */}
            {(selectedState !== 'all' || selectedCity !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  onStateChange('all');
                  onCityChange('all');
                  onSearchChange('');
                }}
                className="px-4 py-2 text-primary-blue hover:bg-primary-blue/10 rounded-lg font-medium transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="md:hidden sticky top-16 z-40 bg-white shadow-md border-b border-primary-blue/20">
        <div className="container mx-auto px-4 py-3">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="w-full flex items-center justify-between px-4 py-2 bg-background-parchment rounded-lg"
          >
            <span className="font-medium text-primary-dark">Filters</span>
            <svg
              className={`w-5 h-5 transition-transform ${isMobileOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileOpen && (
        <div className="md:hidden bg-white border-b border-primary-blue/20">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* State Filter */}
            <div>
              <label className="block text-sm font-medium text-primary-dark mb-2">
                State
              </label>
              <select
                value={selectedState}
                onChange={(e) => onStateChange(e.target.value)}
                className="w-full px-4 py-2 border border-primary-blue/30 rounded-lg"
              >
                <option value="all">All States</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state.code} value={state.name}>
                    {state.name} ({state.jyotirlingaCount})
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            {selectedState !== 'all' && cities.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-primary-dark mb-2">
                  City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => onCityChange(e.target.value)}
                  className="w-full px-4 py-2 border border-primary-blue/30 rounded-lg"
                >
                  <option value="all">All Cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-primary-dark mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search temples..."
                className="w-full px-4 py-2 border border-primary-blue/30 rounded-lg"
              />
            </div>

            {/* Clear Filters */}
            {(selectedState !== 'all' || selectedCity !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  onStateChange('all');
                  onCityChange('all');
                  onSearchChange('');
                }}
                className="w-full px-4 py-2 bg-primary-blue text-white rounded-lg font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

