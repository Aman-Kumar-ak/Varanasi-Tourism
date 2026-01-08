'use client';

import { getIconComponent } from '@/lib/iconMapping';

interface SectionHeaderProps {
  title: string;
  icon?: string;
  subtitle?: string;
}

export default function SectionHeader({ title, icon, subtitle }: SectionHeaderProps) {
  const IconComponent = icon ? getIconComponent(icon) : null;
  
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Compact icon */}
        {IconComponent && (
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-temple flex items-center justify-center text-white shadow-md">
              <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        )}
        
        {/* Title and subtitle - compact and integrated */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3 gap-1">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gradient-temple leading-tight break-words" style={{ lineHeight: '1.5' }}>
              {title}
            </h2>
            {subtitle && (
              <p className="text-primary-dark/70 text-sm sm:text-base md:text-lg font-normal leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          
          {/* Minimal decorative line */}
          <div className="mt-2 h-0.5 w-12 sm:w-16 bg-gradient-temple rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

