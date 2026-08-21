import React, { useState, useEffect } from 'react';
import { Logo } from '../shared/Logo';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';
import { Button } from '../shared/Button';
import { Container } from '../shared/Container';
import { PUBLIC_NAV_ITEMS, AppRoute } from '../../navigation/routes';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../lib/AuthContext';
import { Menu, X, LogIn, ArrowRight, ArrowLeft, User, GraduationCap, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  onOpenLoginModal?: () => void;
}

export function Header({ currentRoute, onNavigate, onOpenLoginModal }: HeaderProps) {
  const { t, isRTL } = useLanguage();
  const { user, profile, role } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (route: AppRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginClick = () => {
    setMobileMenuOpen(false);
    if (onOpenLoginModal) {
      onOpenLoginModal();
    } else {
      onNavigate('login');
    }
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-[#E2E8F0]'
          : 'bg-white border-b border-[#E2E8F0]/80'
      }`}
    >
      {/* Top subtle bar */}
      <div className="bg-[#0B192C] text-white py-1.5 px-4 text-xs">
        <Container size="lg" className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C59B27] animate-pulse" />
            <span className="text-slate-300 font-medium">{t.brandSlogan}</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-slate-300 text-xs">
            <button
              onClick={handleLoginClick}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white font-medium transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t.navLogin}</span>
            </button>
          </div>
        </Container>
      </div>

      {/* Main Navigation Bar */}
      <div className="py-3 sm:py-3.5">
        <Container size="lg" className="flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="text-start focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F4C81] rounded-lg cursor-pointer shrink-0"
            aria-label="GoStars Academy Home"
          >
            <Logo size="md" showSlogan={true} />
          </button>

          {/* Desktop Navigation Links (7 public pages) */}
          <nav className="hidden xl:flex items-center gap-1">
            {PUBLIC_NAV_ITEMS.map((item) => {
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'text-[#0F4C81] bg-[#EFF6FF] shadow-xs'
                      : 'text-slate-700 hover:text-[#0F4C81] hover:bg-slate-50'
                  }`}
                >
                  {t[item.translationKey]}
                </button>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2.5">
            <LanguageSwitcher variant="header" />

            {user ? (
              <button
                onClick={() => {
                  if (role === 'admin') onNavigate('admin');
                  else if (role === 'teacher' || role === 'supervisor') onNavigate('teacher-platform');
                  else onNavigate('portal');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                {role === 'admin' ? (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                    <span>{isRTL ? 'لوحة الإدارة' : 'Admin Hub'}</span>
                  </>
                ) : (role === 'teacher' || role === 'supervisor') ? (
                  <>
                    <User className="w-3.5 h-3.5 text-blue-700" />
                    <span>{isRTL ? 'منصة المعلم' : 'Teacher Workspace'}</span>
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-3.5 h-3.5 text-blue-700" />
                    <span>{isRTL ? 'بوابة ولي الأمر' : 'Parent Portal'}</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleLoginClick}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                <span>{t.navLogin}</span>
              </button>
            )}

            <Button
              variant="primary"
              size="sm"
              onClick={() => handleNavClick('contact')}
              icon={<ArrowIcon className="w-4 h-4" />}
              iconPosition="end"
            >
              {t.ctaRegister}
            </Button>
          </div>

          {/* Mobile Actions: Language Switcher & Hamburger Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher variant="header" />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-[#0F4C81] hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0F4C81] cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </Container>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E2E8F0] bg-white px-4 py-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-1.5 mb-6">
            {PUBLIC_NAV_ITEMS.map((item) => {
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors text-start cursor-pointer ${
                    isActive
                      ? 'bg-[#EFF6FF] text-[#0F4C81]'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{t[item.translationKey]}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C81]" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
            {user ? (
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (role === 'admin') onNavigate('admin');
                  else if (role === 'teacher' || role === 'supervisor') onNavigate('teacher-platform');
                  else onNavigate('portal');
                }}
                icon={
                  role === 'admin' ? (
                    <ShieldCheck className="w-4 h-4" />
                  ) : (role === 'teacher' || role === 'supervisor') ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <GraduationCap className="w-4 h-4" />
                  )
                }
              >
                {role === 'admin'
                  ? (isRTL ? 'الدخول للوحة الإدارة' : 'Enter Admin Hub')
                  : (role === 'teacher' || role === 'supervisor')
                  ? (isRTL ? 'الدخول لمنصة المعلم' : 'Enter Teacher Workspace')
                  : (isRTL ? 'الدخول لبوابة ولي الأمر' : 'Enter Parent Portal')}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={handleLoginClick}
                icon={<LogIn className="w-4 h-4 text-slate-600" />}
              >
                {t.navLogin}
              </Button>
            )}

            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={() => handleNavClick('contact')}
              icon={<ArrowIcon className="w-4 h-4" />}
              iconPosition="end"
            >
              {t.ctaRegister}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
