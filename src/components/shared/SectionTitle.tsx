import React, { ReactNode } from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  badge?: string | ReactNode;
  align?: 'center' | 'start';
  className?: string;
  titleClassName?: string;
}

export function SectionTitle({
  title,
  subtitle,
  badge,
  align = 'center',
  className = '',
  titleClassName = '',
}: SectionTitleProps) {
  const alignmentClass = align === 'center' ? 'text-center mx-auto items-center' : 'text-start items-start';

  return (
    <div className={`flex flex-col max-w-3xl mb-12 sm:mb-16 ${alignmentClass} ${className}`}>
      {badge && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FDF7E2] text-[#7E5B10] border border-[#F7E7B5] mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C59B27]" />
          {badge}
        </div>
      )}
      <h2
        className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B192C] tracking-tight leading-tight ${titleClassName}`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3.5 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
      <div className={`w-16 h-1 bg-[#C59B27] rounded-full mt-4 ${align === 'center' ? 'mx-auto' : ''}`} />
    </div>
  );
}
