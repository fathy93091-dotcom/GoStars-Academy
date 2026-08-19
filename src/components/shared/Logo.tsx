import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

interface LogoProps {
  className?: string;
  showSlogan?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'iconOnly' | 'light';
  customLogoSrc?: string;
}

export function Logo({
  className = '',
  showSlogan = true,
  size = 'md',
  variant = 'full',
  customLogoSrc,
}: LogoProps) {
  const { t, isRTL } = useLanguage();

  const sizeClasses = {
    sm: { icon: 'w-8 h-8', title: 'text-base', slogan: 'text-[10px]' },
    md: { icon: 'w-10 h-10 md:w-11 md:h-11', title: 'text-lg md:text-xl', slogan: 'text-xs' },
    lg: { icon: 'w-14 h-14', title: 'text-2xl', slogan: 'text-sm' },
    xl: { icon: 'w-20 h-20', title: 'text-3xl', slogan: 'text-base' },
  }[size];

  const textColor = variant === 'light' ? 'text-white' : 'text-[#0B192C]';
  const sloganColor = variant === 'light' ? 'text-amber-200/90' : 'text-[#C59B27] font-medium';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Brand Crest / Star Symbol */}
      <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses.icon}`}>
        {customLogoSrc ? (
          <img
            src={customLogoSrc}
            alt="GoStars Academy Logo"
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        ) : (
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-sm"
          >
            {/* Outer Circular Navy/Gold Frame */}
            <circle cx="50" cy="50" r="46" fill="#0B192C" stroke="#C59B27" strokeWidth="2.5" />
            <circle cx="50" cy="50" r="41" fill="#0F4C81" opacity="0.9" />
            
            {/* Academic Rays / Horizons */}
            <path
              d="M50 12 L50 22 M50 78 L50 88 M12 50 L22 50 M78 50 L88 50 M24 24 L31 31 M69 69 L76 76 M24 76 L31 69 M69 31 L76 24"
              stroke="#C59B27"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.8"
            />
            
            {/* Central 8-Point Golden Star */}
            <path
              d="M50 20 L58 37 L77 37 L62 49 L68 67 L50 56 L32 67 L38 49 L23 37 L42 37 Z"
              fill="#C59B27"
            />

            {/* Inner Star Highlight */}
            <polygon
              points="50,28 55,40 68,40 57,48 61,61 50,52 39,61 43,48 32,40 45,40"
              fill="#FDF7E2"
            />

            {/* Open Book of Knowledge Symbol */}
            <path
              d="M36 68 C42 64 47 65 50 67 C53 65 58 64 64 68 L64 74 C58 70 53 71 50 73 C47 71 42 70 36 74 Z"
              fill="#FFFFFF"
              stroke="#0B192C"
              strokeWidth="1.2"
            />
          </svg>
        )}
      </div>

      {/* Typography and Slogan */}
      {variant !== 'iconOnly' && (
        <div className="flex flex-col justify-center leading-tight">
          <div className="flex items-center gap-1.5 font-bold tracking-tight">
            <span className={`${sizeClasses.title} ${textColor} font-black`}>
              GoStars
            </span>
            <span className={`${sizeClasses.title} text-[#0F4C81] font-bold ${variant === 'light' ? '!text-amber-300' : ''}`}>
              {isRTL ? 'أكاديمية' : 'Academy'}
            </span>
          </div>
          {showSlogan && (
            <span className={`${sizeClasses.slogan} ${sloganColor} tracking-wide mt-0.5`}>
              {t.brandSlogan}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
