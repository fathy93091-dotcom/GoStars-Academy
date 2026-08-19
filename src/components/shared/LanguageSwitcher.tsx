import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'header' | 'footer' | 'pill';
  className?: string;
}

export function LanguageSwitcher({
  variant = 'header',
  className = '',
}: LanguageSwitcherProps) {
  const { lang, toggleLanguage } = useLanguage();

  if (variant === 'pill') {
    return (
      <button
        onClick={toggleLanguage}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white border border-[#E2E8F0] text-slate-700 hover:text-[#0F4C81] hover:border-[#0F4C81] transition-colors cursor-pointer ${className}`}
        aria-label="Switch Language"
      >
        <Globe className="w-3.5 h-3.5 text-[#C59B27]" />
        <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
      </button>
    );
  }

  if (variant === 'footer') {
    return (
      <button
        onClick={toggleLanguage}
        className={`inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors cursor-pointer ${className}`}
      >
        <Globe className="w-4 h-4 text-[#C59B27]" />
        <span>{lang === 'ar' ? 'English Language' : 'اللغة العربية'}</span>
      </button>
    );
  }

  // Header default
  return (
    <button
      onClick={toggleLanguage}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#0B192C] hover:bg-slate-100 border border-slate-200/80 transition-all cursor-pointer select-none ${className}`}
      title={lang === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
      aria-label="Toggle Language"
    >
      <Globe className="w-3.5 h-3.5 text-[#0F4C81]" />
      <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
    </button>
  );
}
