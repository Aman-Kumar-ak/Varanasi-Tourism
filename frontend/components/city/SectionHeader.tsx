'use client';

interface SectionHeaderProps {
  title: string;
  icon?: string;
  subtitle?: string;
}

export default function SectionHeader({ title, icon, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center gap-2 sm:gap-3 md:gap-5 mb-3 sm:mb-4">
        {icon && (
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-gradient-temple flex items-center justify-center text-lg sm:text-xl md:text-2xl shadow-temple">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gradient-temple mb-2 sm:mb-3 md:mb-4 leading-tight break-words">
            {title}
          </h2>
          <div className="w-12 sm:w-16 md:w-20 h-0.5 sm:h-1 bg-gradient-temple rounded-full"></div>
        </div>
      </div>
      {subtitle && (
        <p className="text-primary-dark/80 text-xs sm:text-sm md:text-base lg:text-lg ml-0 sm:ml-12 md:ml-[4.5rem] font-medium px-1 sm:px-0 leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}

