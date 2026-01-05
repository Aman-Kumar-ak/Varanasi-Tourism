'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type FontSizeLevel = -1 | 0 | 1;

interface FontSizeContextType {
  fontSizeLevel: FontSizeLevel;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [fontSizeLevel, setFontSizeLevel] = useState<FontSizeLevel>(0);

  // Load font size from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('fontSizeLevel');
    if (saved) {
      const level = parseInt(saved) as FontSizeLevel;
      if (level >= -1 && level <= 1) {
        setFontSizeLevel(level);
      }
    }
  }, []);

  // Apply font size to document root
  useEffect(() => {
    const root = document.documentElement;
    const baseSize = 16; // Base font size in pixels
    
    // Font size multipliers: -1: 0.9375, 0: 1, 1: 1.125
    const multipliers: Record<FontSizeLevel, number> = {
      '-1': 0.9375,
      '0': 1,
      '1': 1.125,
    };

    const multiplier = multipliers[fontSizeLevel];
    root.style.setProperty('--font-size-multiplier', multiplier.toString());
    
    // Save to localStorage
    localStorage.setItem('fontSizeLevel', fontSizeLevel.toString());
  }, [fontSizeLevel]);

  const increaseFontSize = () => {
    setFontSizeLevel((prev) => {
      if (prev < 1) {
        return (prev + 1) as FontSizeLevel;
      }
      return prev;
    });
  };

  const decreaseFontSize = () => {
    setFontSizeLevel((prev) => {
      if (prev > -1) {
        return (prev - 1) as FontSizeLevel;
      }
      return prev;
    });
  };

  const resetFontSize = () => {
    setFontSizeLevel(0);
  };

  return (
    <FontSizeContext.Provider
      value={{
        fontSizeLevel,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
      }}
    >
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const context = useContext(FontSizeContext);
  if (context === undefined) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
}

