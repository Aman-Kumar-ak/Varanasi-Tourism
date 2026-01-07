'use client';

import { useFontSize } from '@/contexts/FontSizeContext';

export default function FontSizeControl() {
  const { fontSizeLevel, increaseFontSize, decreaseFontSize } = useFontSize();

  const isMaxSize = fontSizeLevel >= 1;
  const isMinSize = fontSizeLevel <= -1;

  return (
    <div className="flex items-center gap-0.5 bg-white rounded-lg border border-primary-blue/20 p-0.5 shadow-sm max-w-fit">
      <button
        onClick={decreaseFontSize}
        disabled={isMinSize}
        className={`px-1.5 py-0.5 rounded text-xs font-bold transition-colors focus:outline-none touch-manipulation min-h-[32px] min-w-[32px] flex items-center justify-center ${
          isMinSize
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-primary-dark hover:bg-primary-blue/10 hover:text-primary-blue active:bg-primary-blue/20'
        }`}
        style={{ fontSize: '12px' }}
        aria-label="Decrease font size"
        title="Decrease font size (A-)"
      >
        A-
      </button>
      <div className="h-3 w-px bg-primary-blue/20"></div>
      <button
        onClick={increaseFontSize}
        disabled={isMaxSize}
        className={`px-1.5 py-0.5 rounded text-xs font-bold transition-colors focus:outline-none touch-manipulation min-h-[32px] min-w-[32px] flex items-center justify-center ${
          isMaxSize
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-primary-dark hover:bg-primary-blue/10 hover:text-primary-blue active:bg-primary-blue/20'
        }`}
        style={{ fontSize: '12px' }}
        aria-label="Increase font size"
        title="Increase font size (A+)"
      >
        A+
      </button>
    </div>
  );
}

