import React from 'react';
import { Container } from '../shared/Container';
import { SectionTitle } from '../shared/SectionTitle';
import { Badge } from '../shared/Badge';
import { Button } from '../shared/Button';
import { useLanguage } from '../../i18n/LanguageContext';
import { AppRoute } from '../../navigation/routes';
import { 
  Eye, 
  Target, 
  Sparkles, 
  ShieldCheck, 
  Heart, 
  Users, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';

interface AboutPageProps {
  onNavigate: (route: AppRoute) => void;
}

export function AboutPage({ onNavigate }: AboutPageProps) {
  const { t, isRTL } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className="flex flex-col gap-16 sm:gap-24 py-10 sm:py-16">
      {/* Page Header */}
      <section>
        <Container size="lg">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="gold" size="md" className="mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.brandSlogan}</span>
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-black text-[#0B192C] tracking-tight mb-4">
              {t.aboutPageTitle}
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              {t.aboutPageSubtitle}
            </p>
          </div>
        </Container>
      </section>

      {/* Story & Philosophy */}
      <section className="bg-white py-14 sm:py-16 border-y border-[#E2E8F0]">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7 flex flex-col gap-6 text-start">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C81]">
                {isRTL ? 'النشأة والمسيرة' : 'Our Story'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0B192C]">
                {t.aboutStoryTitle}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {t.aboutStoryP1}
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {t.aboutStoryP2}
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0B192C] bg-[#EFF6FF] px-3.5 py-2 rounded-lg border border-[#DBEAFE]">
                  <CheckCircle2 className="w-4 h-4 text-[#0F4C81]" />
                  <span>{isRTL ? 'معايير إجازة مسندة' : 'Certified Ijazah Standards'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#0B192C] bg-[#FDF7E2] px-3.5 py-2 rounded-lg border border-[#FEEFC3]">
                  <CheckCircle2 className="w-4 h-4 text-[#7E5B10]" />
                  <span>{isRTL ? 'مناهج معتمدة متعددة' : 'Accredited Curricula'}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#0B192C] text-white rounded-3xl p-8 sm:p-10 border border-[#1E3A5F] flex flex-col gap-6 text-start">
              <span className="text-xs font-bold text-[#C59B27] uppercase tracking-widest">
                GoStars Academy Code
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                {isRTL ? '«العلم رحلة تبدأ بالإتقان وتكتمل بحسن الخلق»' : '"Knowledge is a journey beginning with precision and fulfilled with noble character."'}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {t.brandTagline}
              </p>
              <div className="pt-4 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
                <span>{isRTL ? 'إشراف أكاديمي مباشر' : 'Direct Academic Oversight'}</span>
                <span className="text-amber-300 font-bold">100% Focused</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Vision & Mission */}
      <section>
        <Container size="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 sm:p-10 flex flex-col text-start hover:border-[#0F4C81]/30 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] text-[#0F4C81] flex items-center justify-center mb-6">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#0B192C] mb-4">
                {t.aboutVisionTitle}
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {t.aboutVisionText}
              </p>
            </div>

            {/* Mission */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 sm:p-10 flex flex-col text-start hover:border-[#7E5B10]/30 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-[#FDF7E2] text-[#7E5B10] flex items-center justify-center mb-6">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#0B192C] mb-4">
                {t.aboutMissionTitle}
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {t.aboutMissionText}
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="bg-white py-16 border-y border-[#E2E8F0]">
        <Container size="lg">
          <SectionTitle
            title={t.aboutValuesTitle}
            subtitle={t.aboutValuesSubtitle}
            badge={isRTL ? 'المبادئ والمرتكزات' : 'Our Values'}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#F7F9FC] rounded-2xl border border-slate-200 p-6 text-start">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#0F4C81] flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#0B192C] mb-2">{t.value1Title}</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{t.value1Desc}</p>
            </div>

            <div className="bg-[#F7F9FC] rounded-2xl border border-slate-200 p-6 text-start">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-[#7E5B10] flex items-center justify-center mb-4">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#0B192C] mb-2">{t.value2Title}</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{t.value2Desc}</p>
            </div>

            <div className="bg-[#F7F9FC] rounded-2xl border border-slate-200 p-6 text-start">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#0F4C81] flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#0B192C] mb-2">{t.value3Title}</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{t.value3Desc}</p>
            </div>

            <div className="bg-[#F7F9FC] rounded-2xl border border-slate-200 p-6 text-start">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-[#7E5B10] flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#0B192C] mb-2">{t.value4Title}</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{t.value4Desc}</p>
            </div>

            <div className="bg-[#F7F9FC] rounded-2xl border border-slate-200 p-6 text-start md:col-span-2 lg:col-span-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#0F4C81] flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-[#0B192C] mb-2">{t.value5Title}</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{t.value5Desc}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Footer */}
      <section>
        <Container size="md">
          <div className="text-center bg-[#F7F9FC] border border-[#E2E8F0] rounded-3xl p-8 sm:p-12">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B192C] mb-3">
              {isRTL ? 'هل تود التعرف على خططنا ومناهجنا؟' : 'Ready to explore our study tracks?'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mb-8">
              {isRTL ? 'تصفح باقة المناهج المعتمدة واختر المسار الأنسب لطموحات طفلك.' : 'Browse our accredited curricula and find the optimal pathway for your child.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="primary"
                size="md"
                onClick={() => onNavigate('curricula')}
                icon={<ArrowIcon className="w-4 h-4" />}
                iconPosition="end"
              >
                {t.ctaExploreCurricula}
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => onNavigate('contact')}
              >
                {t.ctaContactUs}
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
