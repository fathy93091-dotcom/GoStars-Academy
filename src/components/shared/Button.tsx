import React, { ReactNode } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gold' | 'outline' | 'ghost' | 'navy';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: 'start' | 'end';
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPosition = 'start',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none whitespace-nowrap cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-5 py-2.5 rounded-lg gap-2',
    lg: 'text-base px-6 py-3 rounded-xl gap-2.5 font-semibold',
  }[size];

  const variantStyles = {
    primary: 'bg-[#0F4C81] text-white hover:bg-[#0c3c66] active:bg-[#092e4e] focus:ring-[#0F4C81]/40 shadow-xs',
    navy: 'bg-[#0B192C] text-white hover:bg-[#132238] active:bg-[#060d17] focus:ring-[#0B192C]/40 shadow-xs',
    gold: 'bg-[#C59B27] text-slate-900 font-semibold hover:bg-[#b08920] active:bg-[#977418] focus:ring-[#C59B27]/40 shadow-xs',
    secondary: 'bg-white text-[#0B192C] border border-[#E2E8F0] hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 focus:ring-slate-400',
    outline: 'bg-transparent text-[#0F4C81] border border-[#0F4C81] hover:bg-[#0F4C81]/5 active:bg-[#0F4C81]/10 focus:ring-[#0F4C81]',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100/80 active:bg-slate-200/80 focus:ring-slate-300',
  }[variant];

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${widthStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'start' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'end' && <span className="shrink-0">{icon}</span>}
    </button>
  );
}
