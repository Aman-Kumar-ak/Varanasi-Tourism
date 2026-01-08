import React from 'react';

interface AutoRickshawIconProps {
  className?: string;
}

export default function AutoRickshawIcon({ className }: AutoRickshawIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Auto Rickshaw - Simplified three-wheeled vehicle */}
      {/* Main body */}
      <rect x="5" y="9" width="14" height="7" rx="1" fill="currentColor" opacity="0.3"/>
      <rect x="5" y="9" width="14" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      
      {/* Canopy/Roof */}
      <path d="M6 9 L12 4 L18 9" fill="currentColor" opacity="0.4"/>
      <path d="M6 9 L12 4 L18 9" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      
      {/* Front wheel (single center wheel) */}
      <circle cx="9" cy="19" r="2.5" fill="currentColor"/>
      <circle cx="9" cy="19" r="1.2" fill="white"/>
      
      {/* Back wheels (two wheels) */}
      <circle cx="15.5" cy="19" r="2.5" fill="currentColor"/>
      <circle cx="15.5" cy="19" r="1.2" fill="white"/>
      <circle cx="18.5" cy="19" r="2.5" fill="currentColor"/>
      <circle cx="18.5" cy="19" r="1.2" fill="white"/>
    </svg>
  );
}
