import React, { useMemo } from 'react';
import { Container } from '../shared/Container';
import { Button } from '../shared/Button';
import { SectionTitle } from '../shared/SectionTitle';
import { Badge } from '../shared/Badge';
import { FaqSection } from '../shared/FaqSection';
import { useLanguage } from '../../i18n/LanguageContext';
import { useSiteContent } from '../../lib/SiteContentContext';
import { AppRoute } from '../../navigation/routes';
import { CmsHeroSettings, CmsBottomCtaSettings } from '../../types';
import { 
  BookOpen, 
  GraduationCap, 
  Award, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Compass, 
  HeartHandshake, 
  Clock, 
  FileText,
  Star,
  ShieldCheck,
  Target,
  MessageCircle,
  LucideIcon
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (route: AppRoute) => void;
}

// Icon helper map
const ICON_MAP: Record<string, LucideIcon> = {
  GraduationCap,
  BookOpen,
  Compass,
  Award,
  Users,
  Clock,
  FileText,
  HeartHandshake,
  ShieldCheck,
  Target,
  MessageCircle,
  Sparkles,
  Star
};

export function HomePage({ onNavigate }: HomePageProps) {
  const { t, isRTL, lang } = useLanguage();
  const { content } = useSiteContent();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const visibility = content?.visibility || {
    showHero: true,
    showPillars: true,
    showFeaturedCurricula: true,
    showWhyGoStars: true,
    showStats: true,
    showHonorStars: true,
    showFaq: true,
    showBottomCta: true,
  };
  
  const hero: Partial<CmsHeroSettings> = content?.hero || {};
  const bottomCta: Partial<CmsBottomCtaSettings> = content?.bottomCta || {};

  // Dynamic Curricula from CMS
  const displayCurricula = useMemo(() => {
    const active = (content?.curriculaList || []).filter(c => c && c.isActive !== false);
    const featured = active.filter(c => c.featuredOnHome);
    return (featured.length > 0 ? featured : active).slice(0, 3);
  }, [content?.curriculaList]);

  // Dynamic Honor Stars
  const topHonorStars = useMemo(() => {
    const active = (content?.honorStarsList || []).filter(s => s && s.isActive !== false);
    const highlighted = active.filter(s => s.highlighted || s.category === 'quran_complete');
    return (highlighted.length > 0 ? highlighted : active).slice(0, 2);
  }, [content?.honorStarsList]);

  // Dynamic Pillars
  const pillars = useMemo(() => {
    return (content?.pillarsList || []).filter(p => p && p.isActive !== false);
  }, [content?.pillarsList]);

  // Dynamic Why GoStars
  const whyGoStarsList = useMemo(() => {
    return (content?.whyGoStarsList || []).filter(w => w && w.isActive !== false);
  }, [content?.whyGoStarsList]);

  // Dynamic Stats
  const statsList = useMemo(() => {
    return (content?.statsList || []).filter(s => s && s.isActive !== false);
  }, [content?.statsList]);

  // Dynamic Hero values
  const heroBadge = lang === 'ar' ? (hero?.badgeAr || t.homeHeroBadge) : (hero?.badgeEn || hero?.badgeAr || t.homeHeroBadge);
  const heroTitle = lang === 'ar' ? (hero?.titleAr || t.homeHeroTitle) : (hero?.titleEn || hero?.titleAr || t.homeHeroTitle);
  const heroSubtitle = lang === 'ar' ? (hero?.subtitleAr || t.homeHeroSubtitle) : (hero?.subtitleEn || hero?.subtitleAr || t.homeHeroSubtitle);
  const heroH1 = lang === 'ar' ? (hero?.highlight1Ar || t.homeHeroHighlight1) : (hero?.highlight1En || hero?.highlight1Ar || t.homeHeroHighlight1);
  const heroH2 = lang === 'ar' ? (hero?.highlight2Ar || t.homeHeroHighlight2) : (hero?.highlight2En || hero?.highlight2Ar || t.homeHeroHighlight2);
  const heroH3 = lang === 'ar' ? (hero?.highlight3Ar || t.homeHeroHighlight3) : (hero?.highlight3En || hero?.highlight3Ar || t.homeHeroHighlight3);
  const heroCta1 = lang === 'ar' ? (hero?.ctaPrimaryAr || t.homeHeroCtaPrimary) : (hero?.ctaPrimaryEn || hero?.ctaPrimaryAr || t.homeHeroCtaPrimary);
  const heroCta2 = lang === 'ar' ? (hero?.ctaSecondaryAr || t.homeHeroCtaSecondary) : (hero?.ctaSecondaryEn || hero?.ctaSecondaryAr || t.homeHeroCtaSecondary);

  // Bottom CTA values
  const bottomTitle = lang === 'ar' ? (bottomCta?.titleAr || t.ctaBannerTitle) : (bottomCta?.titleEn || bottomCta?.titleAr || t.ctaBannerTitle);
  const bottomSubtitle = lang === 'ar' ? (bottomCta?.subtitleAr || t.ctaBannerSubtitle) : (bottomCta?.subtitleEn || bottomCta?.subtitleAr || t.ctaBannerSubtitle);
  const bottomBtn = lang === 'ar' ? (bottomCta?.buttonTextAr || t.ctaBannerButton) : (bottomCta?.buttonTextEn || bottomCta?.buttonTextAr || t.ctaBannerButton);

  return (
    <div className="flex flex-col gap-20 sm:gap-28 pb-20">
      {/* 1. HERO SECTION */}
      {visibility.showHero && (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#0B192C] via-[#0E243D] to-[#0B192C] text-white pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-[#1E3A5F]/60">
          {content.images?.heroBannerImage && (
            <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-luminosity">
              <img
                src={content.images.heroBannerImage}
                alt="Academy Background"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0B192C] via-[#0B192C]/80 to-[#0B192C]" />
            </div>
          )}

          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#C59B27] blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#0F4C81] blur-3xl" />
          </div>

          <Container size="lg" className="relative z-10">
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
              <Badge variant="gold" size="md" className="mb-6 font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{heroBadge}</span>
              </Badge>

              <span className="text-amber-400/90 font-bold text-sm tracking-widest uppercase mb-3">
                {lang === 'ar' ? (content.branding?.academyNameAr || 'GoStars Academy') : (content.branding?.academyNameEn || 'GoStars Academy')}
              </span>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight sm:leading-tight mb-6">
                {heroTitle}
              </h1>

              <p className="text-slate-300 text-base sm:text-xl font-normal leading-relaxed max-w-3xl mb-10">
                {heroSubtitle}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl mb-10 text-xs sm:text-sm">
                {heroH1 && (
                  <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white/5 border border-white/10 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-[#C59B27] shrink-0" />
                    <span>{heroH1}</span>
                  </div>
                )}
                {heroH2 && (
                  <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white/5 border border-white/10 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-[#C59B27] shrink-0" />
                    <span>{heroH2}</span>
                  </div>
                )}
                {heroH3 && (
                  <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white/5 border border-white/10 text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-[#C59B27] shrink-0" />
                    <span>{heroH3}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Button
                  variant="gold"
                  size="lg"
                  onClick={() => onNavigate('contact')}
                  icon={<ArrowIcon className="w-5 h-5" />}
                  iconPosition="end"
                  className="w-full sm:w-auto"
                >
                  {heroCta1}
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => onNavigate('curricula')}
                  className="w-full sm:w-auto text-slate-900 font-bold"
                >
                  {heroCta2}
                </Button>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* 2. PILLARS OF EXCELLENCE */}
      {visibility.showPillars && pillars.length > 0 && (
        <section>
          <Container size="lg">
            <SectionTitle
              title={t.pillarsTitle}
              subtitle={t.pillarsSubtitle}
              badge={isRTL ? 'الركائز الأساسية' : 'Core Foundations'}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pillars.map((pillar, idx) => {
                const IconComponent = ICON_MAP[pillar.iconName || ''] || (idx % 2 === 0 ? GraduationCap : BookOpen);
                const title = lang === 'ar' ? pillar.titleAr : (pillar.titleEn || pillar.titleAr);
                const desc = lang === 'ar' ? pillar.descriptionAr : (pillar.descriptionEn || pillar.descriptionAr);
                const badge = lang === 'ar' ? pillar.badgeAr : (pillar.badgeEn || pillar.badgeAr);
                const isGold = idx % 2 === 1;

                return (
                  <div
                    key={pillar.id}
                    className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 flex flex-col text-start hover:border-[#0F4C81]/40 transition-colors justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                          isGold ? 'bg-[#FDF7E2] text-[#7E5B10]' : 'bg-[#EFF6FF] text-[#0F4C81]'
                        }`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        {badge && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                            {badge}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-[#0B192C] mb-2">
                        {title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* 3. FEATURED CURRICULA PREVIEW */}
      {visibility.showFeaturedCurricula && displayCurricula.length > 0 && (
        <section className="bg-white py-16 sm:py-20 border-y border-[#E2E8F0]">
          <Container size="lg">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <Badge variant="blue" size="sm" className="mb-3">
                  {isRTL ? 'الخطط الدراسية' : 'Study Tracks'}
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0B192C]">
                  {t.featuredCurriculaTitle}
                </h2>
                <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-xl">
                  {t.featuredCurriculaSubtitle}
                </p>
              </div>

              <Button
                variant="outline"
                size="md"
                onClick={() => onNavigate('curricula')}
                icon={<ArrowIcon className="w-4 h-4" />}
                iconPosition="end"
              >
                {t.ctaExploreCurricula}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayCurricula.map((curr) => {
                const title = lang === 'ar' ? curr.titleAr : (curr.titleEn || curr.titleAr);
                const gradeLabel = lang === 'ar' ? curr.gradeLabelAr : (curr.gradeLabelEn || curr.gradeLabelAr);
                const desc = lang === 'ar' ? curr.descriptionAr : (curr.descriptionEn || curr.descriptionAr);
                const duration = lang === 'ar' ? curr.durationAr : (curr.durationEn || curr.durationAr);

                return (
                  <div
                    key={curr.id}
                    className="bg-[#F7F9FC] rounded-2xl border border-slate-200 p-6 flex flex-col justify-between text-start hover:border-purple-300 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-bold text-[#0F4C81] bg-[#EFF6FF] px-2.5 py-1 rounded-md">
                          {gradeLabel}
                        </span>
                        {duration && (
                          <span className="text-xs text-slate-400 font-medium">
                            {duration}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-base text-[#0B192C] mb-2">
                        {title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
                        {desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
                      <button
                        onClick={() => onNavigate('curricula')}
                        className="text-xs font-bold text-[#0F4C81] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>{t.viewDetails}</span>
                        <ArrowIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* 4. WHY CHOOSE GOSTARS (VALUES & METHODOLOGY) */}
      {visibility.showWhyGoStars && whyGoStarsList.length > 0 && (
        <section>
          <Container size="lg">
            <SectionTitle
              title={t.homeWhyGoStarsTitle}
              subtitle={t.homeWhyGoStarsSubtitle}
              badge={isRTL ? 'معايير الجودة' : 'Why GoStars'}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {whyGoStarsList.map((item, idx) => {
                const IconComponent = ICON_MAP[item.iconName || ''] || (idx % 2 === 0 ? Users : Clock);
                const title = lang === 'ar' ? item.titleAr : (item.titleEn || item.titleAr);
                const desc = lang === 'ar' ? item.descriptionAr : (item.descriptionEn || item.descriptionAr);
                const isGold = idx % 2 === 1;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 flex items-start gap-4 text-start hover:border-[#0F4C81]/30 transition"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      isGold ? 'bg-[#FDF7E2] text-[#7E5B10]' : 'bg-[#EFF6FF] text-[#0F4C81]'
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#0B192C] mb-1.5">
                        {title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* 5. HONOR STARS SPOTLIGHT */}
      {visibility.showHonorStars && (
        <section className="bg-gradient-to-br from-[#0B192C] to-[#122A4A] text-white py-16 sm:py-20 rounded-3xl mx-4 sm:mx-8">
          <Container size="lg">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30 mb-3">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  {t.honorRollPageTitle}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">
                  {t.honorRollPageSubtitle}
                </h2>
              </div>

              <Button
                variant="gold"
                size="md"
                onClick={() => onNavigate('honor-roll')}
                icon={<ArrowIcon className="w-4 h-4" />}
                iconPosition="end"
              >
                {isRTL ? 'استعرض كافة المتميزين' : 'View All Stars'}
              </Button>
            </div>

            {topHonorStars.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {topHonorStars.map((star) => {
                  const name = lang === 'ar' ? star.studentDisplayNameAr : (star.studentDisplayNameEn || star.studentDisplayNameAr);
                  const badge = lang === 'ar' ? star.categoryBadgeAr : (star.categoryBadgeEn || star.categoryBadgeAr);
                  const countryName = lang === 'ar' ? star.countryAr : (star.countryEn || star.countryAr);
                  const detail = lang === 'ar' ? star.achievementDetailAr : (star.achievementDetailEn || star.achievementDetailAr);
                  const praise = lang === 'ar' ? star.teacherPraiseAr : (star.teacherPraiseEn || star.teacherPraiseAr);

                  return (
                    <div
                      key={star.id}
                      className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-6 sm:p-7 text-start flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <span className="text-sm font-bold text-amber-300 bg-amber-400/10 px-3 py-1 rounded-lg border border-amber-400/20">
                            {badge}
                          </span>
                          <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                            <span>{star.countryCode}</span>
                            <span>{countryName}</span>
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2">
                          {name}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                          {detail}
                        </p>
                      </div>

                      {praise && (
                        <div className="pt-4 border-t border-white/10">
                          <p className="text-xs italic text-amber-200/90 leading-relaxed">
                            {praise}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-8 sm:p-10 text-center max-w-xl mx-auto">
                <Sparkles className="w-10 h-10 text-amber-300 mx-auto mb-3" />
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  {isRTL ? 'بيئة تصنع الأبطال وترعى الحفاظ المتميزين' : 'An Environment That Nurtures Quranic Champions'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                  {isRTL
                    ? 'انضم إلينا اليوم وابدأ رحلة حفظ وتلاوة كتاب الله واللغة العربية بإشراف مباشر من نخبة المعلمين المجازين.'
                    : 'Join us today and begin your Quran memorization and Arabic journey under the guidance of certified educators.'}
                </p>
                <Button
                  variant="gold"
                  size="md"
                  onClick={() => onNavigate('contact')}
                  icon={<ArrowIcon className="w-4 h-4" />}
                  iconPosition="end"
                >
                  {isRTL ? 'احجز جلستك التجريبية' : 'Book Assessment Session'}
                </Button>
              </div>
            )}
          </Container>
        </section>
      )}

      {/* 6. STATS & IMPACT */}
      {visibility.showStats && statsList.length > 0 && (
        <section>
          <Container size="lg">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
              {statsList.map((stat, idx) => {
                const label = lang === 'ar' ? stat.labelAr : (stat.labelEn || stat.labelAr);
                const desc = lang === 'ar' ? stat.descriptionAr : (stat.descriptionEn || stat.descriptionAr);
                const isGold = idx % 2 === 1;

                return (
                  <div key={stat.id} className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 flex flex-col justify-center">
                    <span className={`block text-2xl sm:text-4xl font-black mb-1 ${
                      isGold ? 'text-[#7E5B10]' : 'text-[#0F4C81]'
                    }`}>
                      {stat.value}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-900 font-bold mb-1">
                      {label}
                    </span>
                    {desc && (
                      <span className="text-[11px] text-slate-500 leading-snug">
                        {desc}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* 7. INTERACTIVE FAQ SECTION */}
      {visibility.showFaq && <FaqSection />}

      {/* 8. BOTTOM CTA BANNER */}
      {visibility.showBottomCta && (
        <section>
          <Container size="lg">
            <div className="bg-[#0B192C] text-white rounded-3xl p-8 sm:p-14 text-center flex flex-col items-center justify-center relative overflow-hidden border border-[#1E3A5F]">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C59B27] mb-3">
                {lang === 'ar' ? (content.branding?.academyNameAr || 'GoStars Educational Academy') : (content.branding?.academyNameEn || 'GoStars Educational Academy')}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black mb-4 max-w-2xl leading-tight">
                {bottomTitle}
              </h2>
              <p className="text-slate-300 text-xs sm:text-base max-w-xl mb-8 leading-relaxed">
                {bottomSubtitle}
              </p>

              <Button
                variant="gold"
                size="lg"
                onClick={() => onNavigate('contact')}
                icon={<ArrowIcon className="w-5 h-5" />}
                iconPosition="end"
              >
                {bottomBtn}
              </Button>
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
