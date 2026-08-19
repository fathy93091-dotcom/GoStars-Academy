import React, { useState } from "react";
import { useSiteContent } from "../../lib/SiteContentContext";
import { useLanguage } from "../../i18n/LanguageContext";
import { AppRoute } from "../../navigation/routes";
import { Container } from "../shared/Container";
import { Sparkles, ArrowRight, ArrowLeft, X, ExternalLink } from "lucide-react";

interface AnnouncementBannerProps {
  onNavigate: (route: AppRoute) => void;
}

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({ onNavigate }) => {
  const { content } = useSiteContent();
  const { isRTL, lang } = useLanguage();
  const [isDismissed, setIsDismissed] = useState(false);

  const banner = content.announcementBanner;
  const isVisible = content.visibility.showAnnouncementBanner && banner.isActive && !isDismissed;

  if (!isVisible) return null;

  const text = lang === "ar" ? banner.textAr : banner.textEn;
  const badge = lang === "ar" ? banner.badgeAr : banner.badgeEn;
  const linkText = lang === "ar" ? banner.linkTextAr : banner.linkTextEn;
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const colorStyles = {
    gold: "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 border-amber-300",
    blue: "bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white border-blue-500",
    emerald: "bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white border-emerald-500",
    purple: "bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-700 text-white border-purple-500",
    rose: "bg-gradient-to-r from-rose-700 via-rose-600 to-pink-700 text-white border-rose-500"
  }[banner.type || "gold"];

  return (
    <div className={`relative py-2 px-4 border-b text-xs transition-all duration-300 shadow-xs z-40 ${colorStyles}`}>
      <Container size="lg" className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden flex-1 justify-center sm:justify-start">
          {badge && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/15 shrink-0 shadow-xs">
              {badge}
            </span>
          )}

          <p className="font-semibold truncate text-[11px] sm:text-xs">
            {text}
          </p>

          {banner.linkRoute && linkText && (
            <button
              onClick={() => onNavigate(banner.linkRoute!)}
              className="inline-flex items-center gap-1 font-black underline underline-offset-2 hover:opacity-80 transition shrink-0 cursor-pointer text-[11px]"
            >
              <span>{linkText}</span>
              <ArrowIcon className="w-3 h-3" />
            </button>
          )}
        </div>

        {banner.isDismissable && (
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-md hover:bg-black/10 transition shrink-0 opacity-70 hover:opacity-100"
            title={isRTL ? "إغلاق الإعلان" : "Dismiss Banner"}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </Container>
    </div>
  );
};
