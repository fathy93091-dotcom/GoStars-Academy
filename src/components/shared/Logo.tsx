import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useSiteContent } from '../../lib/SiteContentContext';

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
  const { t, isRTL, lang } = useLanguage();
  
  // Safe extraction of Site Content branding
  let branding = {
    academyNameAr: "GoStars",
    academyNameEn: "GoStars Academy",
    academySloganAr: t.brandSlogan,
    academySloganEn: "Excellence in Quranic & Academic Education",
    logoUrl: "",
    logoStyle: "default_crest"
  };

  try {
    const { content } = useSiteContent();
    if (content?.branding) {
      branding = {
        ...branding,
        ...content.branding,
        academySloganAr: content.branding.academySloganAr || t.brandSlogan,
        academySloganEn: content.branding.academySloganEn || "Excellence in Quranic & Academic Education"
      };
    }
  } catch {
    // Fallback if rendered outside provider
  }

  const sizeClasses = {
    sm: { icon: 'w-8 h-8', title: 'text-base', slogan: 'text-[10px]' },
    md: { icon: 'w-10 h-10 md:w-11 md:h-11', title: 'text-lg md:text-xl', slogan: 'text-xs' },
    lg: { icon: 'w-14 h-14', title: 'text-2xl', slogan: 'text-sm' },
    xl: { icon: 'w-20 h-20', title: 'text-3xl', slogan: 'text-base' },
  }[size];

  const textColor = variant === 'light' ? 'text-white' : 'text-[#0B192C]';
  const sloganColor = variant === 'light' ? 'text-amber-200/90' : 'text-[#C59B27] font-medium';

  const effectiveLogoUrl = customLogoSrc || branding.logoUrl;
  const currentSlogan = lang === 'ar' ? branding.academySloganAr : branding.academySloganEn;
  const currentName = lang === 'ar' ? (branding.academyNameAr || 'GoStars') : (branding.academyNameEn || 'GoStars Academy');

  const renderVectorCrest = () => {
    if (branding.logoStyle === 'modern_star') {
      return (
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-sm">
          <circle cx="50" cy="50" r="46" fill="#0F4C81" stroke="#F59E0B" strokeWidth="3" />
          <path d="M50 15 L60 38 L85 38 L65 54 L72 78 L50 63 L28 78 L35 54 L15 38 L40 38 Z" fill="#FBBF24" />
          <circle cx="50" cy="50" r="14" fill="#0B192C" />
          <path d="M45 42 L55 50 L45 58 Z" fill="#FDF7E2" />
        </svg>
      );
    }

    if (branding.logoStyle === 'golden_book') {
      return (
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full drop-shadow-sm">
          <rect x="8" y="8" width="84" height="84" rx="20" fill="#0B192C" stroke="#C59B27" strokeWidth="2.5" />
          <path d="M25 65 C38 58 46 60 50 64 C54 60 62 58 75 65 L75 35 C62 28 54 30 50 34 C46 30 38 28 25 35 Z" fill="#C59B27" />
          <path d="M28 62 C40 56 47 58 50 61 C53 58 60 56 72 62 L72 38 C60 32 53 34 50 37 C47 34 40 32 28 38 Z" fill="#FFFFFF" />
          <polygon points="50,15 54,23 63,23 56,29 59,37 50,32 41,37 44,29 37,23 46,23" fill="#FBBF24" />
        </svg>
      );
    }

    // Default 8-point luxury crest
    return (
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
    );
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Official Brand Crest / Star Symbol / Custom Logo */}
      <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses.icon}`}>
        {effectiveLogoUrl ? (
          <img
            src={effectiveLogoUrl}
            alt="Academy Logo"
            className="w-full h-full object-contain rounded-lg"
            referrerPolicy="no-referrer"
          />
        ) : (
          renderVectorCrest()
        )}
      </div>

      {/* Typography and Slogan */}
      {variant !== 'iconOnly' && (
        <div className="flex flex-col justify-center leading-tight">
          <div className="flex items-center gap-1.5 font-bold tracking-tight">
            <span className={`${sizeClasses.title} ${textColor} font-black`}>
              {currentName}
            </span>
          </div>
          {showSlogan && (
            <span className={`${sizeClasses.slogan} ${sloganColor} tracking-wide mt-0.5 max-w-[280px] truncate`}>
              {currentSlogan}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
