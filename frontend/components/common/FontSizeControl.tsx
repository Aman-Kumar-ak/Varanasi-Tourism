'use client';

import { useFontSize } from '@/contexts/FontSizeContext';

export default function FontSizeControl() {
  const { fontSizeLevel, increaseFontSize, decreaseFontSize } = useFontSize();

  const isMaxSize = fontSizeLevel >= 1;
  const isMinSize = fontSizeLevel <= -1;

  return (
    <div className="flex items-center gap-1 bg-white rounded-lg border border-primary-blue/20 p-1 shadow-sm">
      <button
        onClick={decreaseFontSize}
        disabled={isMinSize}
        className={`px-2 py-1 rounded text-sm font-bold transition-colors focus:outline-none ${
          isMinSize
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-primary-dark hover:bg-primary-blue/10 hover:text-primary-blue'
        }`}
        aria-label="Decrease font size"
        title="Decrease font size (A-)"
      >
        A-
      </button>
      <div className="h-4 w-px bg-primary-blue/20"></div>
      <button
        onClick={increaseFontSize}
        disabled={isMaxSize}
        className={`px-2 py-1 rounded text-sm font-bold transition-colors focus:outline-none ${
          isMaxSize
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-primary-dark hover:bg-primary-blue/10 hover:text-primary-blue'
        }`}
        aria-label="Increase font size"
        title="Increase font size (A+)"
      >
        A+
      </button>
    </div>
  );
}

