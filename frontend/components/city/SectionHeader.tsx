'use client';

interface SectionHeaderProps {
  title: string;
  icon?: string;
  subtitle?: string;
}

export default function SectionHeader({ title, icon, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-5 mb-4">
        {icon && (
          <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-temple flex items-center justify-center text-2xl shadow-temple">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-temple mb-5 leading-tight break-words">
            {title}
          </h2>
          <div className="w-20 h-1 bg-gradient-temple rounded-full"></div>
        </div>
      </div>
      {subtitle && (
        <p className="text-primary-dark/80 text-base sm:text-lg ml-[4.5rem] font-medium">{subtitle}</p>
      )}
    </div>
  );
}

