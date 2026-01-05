'use client';

interface SectionHeaderProps {
  title: string;
  icon?: string;
  subtitle?: string;
}

export default function SectionHeader({ title, icon, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 sm:gap-3 md:gap-5 mb-4">
        {icon && (
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gradient-temple flex items-center justify-center text-lg sm:text-xl md:text-2xl shadow-temple">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-temple mb-3 sm:mb-4 md:mb-5 leading-tight break-words">
            {title}
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-gradient-temple rounded-full"></div>
        </div>
      </div>
      {subtitle && (
        <p className="text-primary-dark/80 text-sm sm:text-base md:text-lg ml-0 sm:ml-12 md:ml-[4.5rem] font-medium px-1 sm:px-0">{subtitle}</p>
      )}
    </div>
  );
}

