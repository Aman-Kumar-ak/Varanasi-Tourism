'use client';

import { useState } from 'react';

interface DatePickerProps {
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  minDate?: Date;
}

export default function DatePicker({ selectedDate, onDateChange, minDate }: DatePickerProps) {
  const today = minDate || new Date();
  today.setHours(0, 0, 0, 0);

  const [isOpen, setIsOpen] = useState(false);

  // Generate next 30 days
  const availableDates: Date[] = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    availableDates.push(date);
  }

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateSelect = (date: Date) => {
    onDateChange(date);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-primary-dark mb-2">
        Select Date
      </label>
      
      {/* Mobile: Native date input */}
      <input
        type="date"
        value={selectedDate ? formatDateInput(selectedDate) : ''}
        onChange={(e) => {
          if (e.target.value) {
            onDateChange(new Date(e.target.value));
          }
        }}
        min={formatDateInput(today)}
        className="w-full md:hidden px-4 py-3 border border-primary-blue/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
      />

      {/* Desktop: Custom date picker */}
      <div className="hidden md:block">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 border border-primary-blue/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent text-left bg-white"
        >
          {selectedDate ? formatDate(selectedDate) : 'Select a date'}
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-2 bg-white rounded-lg shadow-xl border border-primary-blue/20 p-4 w-full max-w-sm">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-primary-dark/60 py-1">
                  {day}
                </div>
              ))}
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {availableDates.map((date, index) => {
                const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                const isToday = date.toDateString() === today.toDateString();
                
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDateSelect(date)}
                    className={`w-full px-4 py-2 rounded-lg text-left transition-colors ${
                      isSelected
                        ? 'bg-primary-blue text-white font-semibold'
                        : 'bg-background-parchment hover:bg-primary-blue/10 text-primary-dark'
                    } ${isToday ? 'border-2 border-primary-orange' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{formatDate(date)}</span>
                      {isToday && (
                        <span className="text-xs bg-primary-orange text-white px-2 py-1 rounded">
                          Today
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

