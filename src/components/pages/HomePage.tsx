import React from 'react';
import { Container } from '../shared/Container';
import { Button } from '../shared/Button';
import { SectionTitle } from '../shared/SectionTitle';
import { Badge } from '../shared/Badge';
import { FaqSection } from '../shared/FaqSection';
import { useLanguage } from '../../i18n/LanguageContext';
import { useSiteContent } from '../../lib/SiteContentContext';
import { AppRoute } from '../../navigation/routes';
import { MOCK_CURRICULA } from '../../data/curriculaData';
import { MOCK_HONOR_STARS } from '../../data/honorRollData';
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
  Star
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (route: AppRoute) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { t, isRTL, lang } = useLanguage();
  const { content } = useSiteContent();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const visibility = content.visibility;
  const hero = content.hero;

  // Dynamic Curricula from CMS or fallback to Mock
  const dynamicCurricula = content.curriculaList?.filter(c => c.isActive && c.featuredOnHome) || [];
  const displayCurricula = dynamicCurricula.length > 0
    ? dynamicCurricula.slice(0, 3)
    : MOCK_CURRICULA.slice(0, 3);

  const topHonorStars = MOCK_HONOR_STARS.filter(s => s.highlighted).slice(0, 2);

  // Dynamic Hero values
  const heroBadge = lang === 'ar' ? (hero.badgeAr || t.homeHeroBadge) : (hero.badgeEn || t.homeHeroBadge);
  const heroTitle = lang === 'ar' ? (hero.titleAr || t.homeHeroTitle) : (hero.titleEn || t.homeHeroTitle);
  const heroSubtitle = lang === 'ar' ? (hero.subtitleAr || t.homeHeroSubtitle) : (hero.subtitleEn || t.homeHeroSubtitle);
  const heroH1 = lang === 'ar' ? (hero.highlight1Ar || t.homeHeroHighlight1) : (hero.highlight1En || t.homeHeroHighlight1);
  const heroH2 = lang === 'ar' ? (hero.highlight2Ar || t.homeHeroHighlight2) : (hero.highlight2En || t.homeHeroHighlight2);
  const heroH3 = lang === 'ar' ? (hero.highlight3Ar || t.homeHeroHighlight3) : (hero.highlight3En || t.homeHeroHighlight3);
  const heroCta1 = lang === 'ar' ? (hero.ctaPrimaryAr || t.homeHeroCtaPrimary) : (hero.ctaPrimaryEn || t.homeHeroCtaPrimary);
  const heroCta2 = lang === 'ar' ? (hero.ctaSecondaryAr || t.homeHeroCtaSecondary) : (hero.ctaSecondaryEn || t.homeHeroCtaSecondary);

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
                <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white/5 border border-white/10 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#C59B27] shrink-0" />
                  <span>{heroH1}</span>
                </div>
                <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white/5 border border-white/10 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#C59B27] shrink-0" />
                  <span>{heroH2}</span>
                </div>
                <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-white/5 border border-white/10 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-[#C59B27] shrink-0" />
                  <span>{heroH3}</span>
                </div>
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
      {visibility.showPillars && (
        <section>
          <Container size="lg">
            <SectionTitle
              title={t.pillarsTitle}
              subtitle={t.pillarsSubtitle}
              badge={isRTL ? 'الركائز الأساسية' : 'Core Foundations'}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 flex flex-col text-start hover:border-[#0F4C81]/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#0F4C81] flex items-center justify-center mb-5 font-bold">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#0B192C] mb-2">
                  {t.pillar1Title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t.pillar1Desc}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 flex flex-col text-start hover:border-[#0F4C81]/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#FDF7E2] text-[#7E5B10] flex items-center justify-center mb-5 font-bold">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#0B192C] mb-2">
                  {t.pillar2Title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t.pillar2Desc}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 flex flex-col text-start hover:border-[#0F4C81]/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#0F4C81] flex items-center justify-center mb-5 font-bold">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#0B192C] mb-2">
                  {t.pillar3Title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t.pillar3Desc}
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-7 flex flex-col text-start hover:border-[#0F4C81]/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#FDF7E2] text-[#7E5B10] flex items-center justify-center mb-5 font-bold">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#0B192C] mb-2">
                  {t.pillar4Title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {t.pillar4Desc}
                </p>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* 3. FEATURED CURRICULA PREVIEW */}
      {visibility.showFeaturedCurricula && (
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
              {displayCurricula.map((curr: any) => {
                const title = curr.title?.[lang] || curr.titleAr || (lang === 'ar' ? curr.titleAr : curr.titleEn);
                const gradeLabel = curr.gradeLabel?.[lang] || curr.gradeLabelAr || (lang === 'ar' ? curr.gradeLabelAr : curr.gradeLabelEn);
                const desc = curr.description?.[lang] || curr.descriptionAr || (lang === 'ar' ? curr.descriptionAr : curr.descriptionEn);

                return (
                  <div
                    key={curr.id}
                    className="bg-[#F7F9FC] rounded-2xl border border-slate-200 p-6 flex flex-col justify-between text-start hover:border-purple-300 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-bold text-[#0F4C81] bg-[#EFF6FF] px-2.5 py-1 rounded-md">
                          {gradeLabel}
                        </span>
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
      {visibility.showWhyGoStars && (
        <section>
          <Container size="lg">
            <SectionTitle
              title={t.homeWhyGoStarsTitle}
              subtitle={t.homeWhyGoStarsSubtitle}
              badge={isRTL ? 'معايير الجودة' : 'Why GoStars'}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 flex items-start gap-4 text-start">
                <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#0F4C81] flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B192C] mb-1.5">
                    {t.homeFeature1Title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {t.homeFeature1Desc}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 flex items-start gap-4 text-start">
                <div className="w-12 h-12 rounded-xl bg-[#FDF7E2] text-[#7E5B10] flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B192C] mb-1.5">
                    {t.homeFeature2Title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {t.homeFeature2Desc}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 flex items-start gap-4 text-start">
                <div className="w-12 h-12 rounded-xl bg-[#FDF7E2] text-[#7E5B10] flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B192C] mb-1.5">
                    {t.homeFeature3Title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {t.homeFeature3Desc}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 flex items-start gap-4 text-start">
                <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#0F4C81] flex items-center justify-center shrink-0">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0B192C] mb-1.5">
                    {t.homeFeature4Title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {t.homeFeature4Desc}
                  </p>
                </div>
              </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topHonorStars.map((star) => (
                <div
                  key={star.id}
                  className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-6 sm:p-7 text-start flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <span className="text-sm font-bold text-amber-300 bg-amber-400/10 px-3 py-1 rounded-lg border border-amber-400/20">
                        {star.categoryBadge[lang]}
                      </span>
                      <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                        <span>{star.country.code}</span>
                        <span>{star.country[lang]}</span>
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2">
                      {star.studentDisplayName[lang]}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                      {star.achievementDetail[lang]}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs italic text-amber-200/90 leading-relaxed">
                      {star.teacherPraise[lang]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 6. STATS & IMPACT */}
      {visibility.showStats && (
        <section>
          <Container size="lg">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8">
                <span className="block text-2xl sm:text-4xl font-black text-[#0F4C81] mb-1">
                  {t.stat1Value}
                </span>
                <span className="text-xs sm:text-sm text-slate-600 font-semibold">
                  {t.stat1Label}
                </span>
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8">
                <span className="block text-2xl sm:text-4xl font-black text-[#7E5B10] mb-1">
                  {t.stat2Value}
                </span>
                <span className="text-xs sm:text-sm text-slate-600 font-semibold">
                  {t.stat2Label}
                </span>
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8">
                <span className="block text-2xl sm:text-4xl font-black text-[#0F4C81] mb-1">
                  {t.stat3Value}
                </span>
                <span className="text-xs sm:text-sm text-slate-600 font-semibold">
                  {t.stat3Label}
                </span>
              </div>

              <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8">
                <span className="block text-2xl sm:text-4xl font-black text-[#7E5B10] mb-1">
                  {t.stat4Value}
                </span>
                <span className="text-xs sm:text-sm text-slate-600 font-semibold">
                  {t.stat4Label}
                </span>
              </div>
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
                GoStars Educational Academy
              </span>
              <h2 className="text-2xl sm:text-4xl font-black mb-4 max-w-2xl leading-tight">
                {t.ctaBannerTitle}
              </h2>
              <p className="text-slate-300 text-xs sm:text-base max-w-xl mb-8 leading-relaxed">
                {t.ctaBannerSubtitle}
              </p>

              <Button
                variant="gold"
                size="lg"
                onClick={() => onNavigate('contact')}
                icon={<ArrowIcon className="w-5 h-5" />}
                iconPosition="end"
              >
                {t.ctaBannerButton}
              </Button>
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
