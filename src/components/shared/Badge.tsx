import React, { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'gold' | 'blue' | 'navy' | 'neutral' | 'success';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'gold',
  size = 'md',
  className = '',
}: BadgeProps) {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md font-medium',
    md: 'text-xs px-2.5 py-1 rounded-md font-medium',
  }[size];

  const variantStyles = {
    gold: 'bg-[#FDF7E2] text-[#7E5B10] border border-[#F7E7B5]',
    blue: 'bg-[#EFF6FF] text-[#0F4C81] border border-[#BFDBFE]',
    navy: 'bg-[#0B192C] text-white',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap select-none ${sizeStyles} ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
}
