'use client';

import { useFontSize } from '@/contexts/FontSizeContext';

export default function FontSizeControl() {
  const { fontSizeLevel, increaseFontSize, decreaseFontSize } = useFontSize();

  const isMaxSize = fontSizeLevel >= 1;
  const isMinSize = fontSizeLevel <= -1;

  return (
    <div className="flex items-center gap-0 bg-white/90 backdrop-blur-sm rounded-lg border border-primary-blue/20 p-0.5 shadow-sm w-full">
      <button
        onClick={decreaseFontSize}
        disabled={isMinSize}
        className={`flex-1 px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-md text-base sm:text-lg font-bold transition-all duration-200 focus:outline-none touch-manipulation h-8 sm:h-9 flex items-center justify-center ${
          isMinSize
            ? 'text-gray-300 cursor-not-allowed opacity-50'
            : 'text-primary-dark hover:bg-primary-blue/15 hover:text-primary-blue active:bg-primary-blue/25 hover:scale-105'
        }`}
        aria-label="Decrease font size"
        title="Decrease font size (A-)"
      >
        A-
      </button>
      <div className="h-4 sm:h-5 w-px bg-primary-blue/30"></div>
      <button
        onClick={increaseFontSize}
        disabled={isMaxSize}
        className={`flex-1 px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-md text-base sm:text-lg font-bold transition-all duration-200 focus:outline-none touch-manipulation h-8 sm:h-9 flex items-center justify-center ${
          isMaxSize
            ? 'text-gray-300 cursor-not-allowed opacity-50'
            : 'text-primary-dark hover:bg-primary-blue/15 hover:text-primary-blue active:bg-primary-blue/25 hover:scale-105'
        }`}
        aria-label="Increase font size"
        title="Increase font size (A+)"
      >
        A+
      </button>
    </div>
  );
}

