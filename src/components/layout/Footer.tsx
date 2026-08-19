import React from 'react';
import { Container } from '../shared/Container';
import { Logo } from '../shared/Logo';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';
import { useLanguage } from '../../i18n/LanguageContext';
import { AppRoute, PUBLIC_NAV_ITEMS } from '../../navigation/routes';
import { BRAND_TOKENS } from '../../theme/tokens';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: AppRoute) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const { t, lang } = useLanguage();

  const handleNavClick = (route: AppRoute) => {
    onNavigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B192C] text-slate-300 pt-16 pb-12 border-t border-[#132238]">
      <Container size="lg">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-slate-800">
          {/* Column 1: Brand & Slogan (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <button
              onClick={() => handleNavClick('home')}
              className="text-start focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 rounded-lg cursor-pointer"
            >
              <Logo size="lg" variant="light" showSlogan={true} />
            </button>

            <p className="text-slate-400 text-sm leading-relaxed max-w-md mt-2">
              {t.footerAboutText}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-slate-800/90 text-amber-300 border border-slate-700 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C59B27]" />
                {t.brandSlogan}
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h3 className="text-white text-sm font-bold tracking-wider uppercase">
              {t.footerQuickLinks}
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              {PUBLIC_NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className="text-slate-400 hover:text-white hover:underline transition-colors text-start cursor-pointer font-medium"
                  >
                    {t[item.translationKey]}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <h3 className="text-white text-sm font-bold tracking-wider uppercase">
              {t.footerContactInfo}
            </h3>
            <ul className="flex flex-col gap-3.5 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" />
                <span>{BRAND_TOKENS.contactInfo.address[lang]}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C59B27] shrink-0" />
                <span dir="ltr" className="text-slate-200 font-bold">
                  {BRAND_TOKENS.contactInfo.phone}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C59B27] shrink-0" />
                <span>{BRAND_TOKENS.contactInfo.email}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#C59B27] shrink-0" />
                <span>{BRAND_TOKENS.contactInfo.workingHours[lang]}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {t.allRightsReserved}.</p>

          <div className="flex items-center gap-6">
            <LanguageSwitcher variant="footer" />
          </div>
        </div>
      </Container>
    </footer>
  );
}
