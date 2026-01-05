'use client';

interface SectionHeaderProps {
  title: string;
  icon?: string;
  subtitle?: string;
}

export default function SectionHeader({ title, icon, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        {icon && <span className="text-3xl">{icon}</span>}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary-dark">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="text-primary-dark/70 text-sm sm:text-base">{subtitle}</p>
      )}
    </div>
  );
}

