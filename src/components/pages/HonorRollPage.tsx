import React, { useState, useMemo } from 'react';
import { Container } from '../shared/Container';
import { SectionTitle } from '../shared/SectionTitle';
import { Badge } from '../shared/Badge';
import { Button } from '../shared/Button';
import { useLanguage } from '../../i18n/LanguageContext';
import { AppRoute } from '../../navigation/routes';
import { MOCK_HONOR_STARS, HonorRollStar } from '../../data/honorRollData';
import { 
  Star, 
  Award, 
  Crown, 
  Sparkles, 
  CheckCircle2, 
  Quote, 
  Calendar, 
  ArrowRight, 
  ArrowLeft,
  Heart
} from 'lucide-react';

interface HonorRollPageProps {
  onNavigate: (route: AppRoute) => void;
}

export function HonorRollPage({ onNavigate }: HonorRollPageProps) {
  const { t, isRTL, lang } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filters = [
    { id: 'all', label: { ar: 'كافة النجوم والمتميزين', en: 'All Stars & Milestones' } },
    { id: 'quran_complete', label: { ar: 'ختم القرآن الكريم', en: 'Quran Completion' } },
    { id: 'quran_milestone', label: { ar: 'إنجازات حفظ الأجزاء', en: 'Juz Milestones' } },
    { id: 'arabic_mastery', label: { ar: 'التفوق اللغوي والبلاغي', en: 'Arabic Fluency' } },
    { id: 'commitment', label: { ar: 'الانضباط والمواظبة', en: 'Perfect Diligence' } },
  ];

  const filteredStars = useMemo(() => {
    if (selectedFilter === 'all') return MOCK_HONOR_STARS;
    return MOCK_HONOR_STARS.filter((s) => s.category === selectedFilter);
  }, [selectedFilter]);

  const grandChampions = filteredStars.filter((s) => s.category === 'quran_complete' || s.highlighted);
  const otherStars = filteredStars.filter((s) => !grandChampions.includes(s));

  return (
    <div className="flex flex-col gap-14 sm:gap-20 py-10 sm:py-16">
      {/* Header with Starry Backdrop Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0B192C] via-[#0E243D] to-[#0B192C] text-white py-14 sm:py-18 rounded-3xl mx-4 sm:mx-8 border border-[#1E3A5F]">
        <Container size="lg">
          <div className="text-center max-w-3xl mx-auto relative z-10">
            <Badge variant="gold" size="md" className="mb-4 shadow-xs">
              <Crown className="w-3.5 h-3.5" />
              <span>{isRTL ? 'لوحة الشرف والأوائل' : 'Hall of Academic Honors'}</span>
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
              {t.honorRollPageTitle}
            </h1>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              {t.honorRollPageSubtitle}
            </p>
          </div>
        </Container>
      </section>

      {/* Category Filter Pills */}
      <section>
        <Container size="lg">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {filters.map((filter) => {
              const isSelected = selectedFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0F4C81] text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {filter.label[lang]}
                </button>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Empty State when no stars are added yet */}
      {filteredStars.length === 0 && (
        <section>
          <Container size="md">
            <div className="bg-white rounded-3xl border border-slate-200 p-10 sm:p-14 text-center shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#C59B27] flex items-center justify-center mx-auto mb-4 border border-amber-200">
                <Star className="w-8 h-8 fill-amber-300 text-amber-500" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#0B192C] mb-3">
                {isRTL ? 'لوحة الشرف جاهزة لاستقبال النجوم الجدد' : 'Honor Roll Ready For New Achievers'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6 max-w-lg mx-auto">
                {isRTL
                  ? 'يتم تكريم الطلاب المتميزين في حفظ القرآن الكريم وإتقان اللغة العربية تلقائيًا عبر تقييمات المعلمين وتقارير الإنجاز الدورية.'
                  : 'Distinguished students in Quran memorization and Arabic mastery will be honored here following their monthly teacher evaluations and milestone completions.'}
              </p>
              <Button
                variant="gold"
                size="md"
                onClick={() => onNavigate('contact')}
                icon={<ArrowIcon className="w-4 h-4" />}
                iconPosition="end"
              >
                {isRTL ? 'سجل طفلك ليكون النجم القادم' : 'Enroll Your Child Now'}
              </Button>
            </div>
          </Container>
        </section>
      )}
      {grandChampions.length > 0 && (
        <section>
          <Container size="lg">
            <div className="mb-6 flex items-center gap-2 text-[#0F4C81]">
              <Sparkles className="w-5 h-5 text-[#C59B27]" />
              <h2 className="text-xl sm:text-2xl font-black text-[#0B192C]">
                {isRTL ? 'وسام التميز القرآني الأرفع' : 'Premier Quranic Distinction Award'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {grandChampions.map((star) => (
                <div
                  key={star.id}
                  className="relative rounded-3xl bg-gradient-to-br from-white via-amber-50/20 to-white border-2 border-amber-300 p-8 shadow-md text-start flex flex-col justify-between"
                >
                  <div className="absolute top-4 end-6 flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-black text-[#7E5B10] bg-[#FDF7E2] px-3 py-1 rounded-md border border-amber-300">
                        {star.categoryBadge[lang]}
                      </span>
                      <span className="text-xs font-medium text-slate-500">
                        {star.country.code} {star.country[lang]}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-[#0B192C] mb-2">
                      {star.studentDisplayName[lang]}
                    </h3>

                    <p className="text-sm font-bold text-[#0F4C81] mb-3">
                      {star.achievementTitle[lang]}
                    </p>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                      {star.achievementDetail[lang]}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-amber-200/80 bg-white/80 rounded-2xl p-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                      <Quote className="w-3.5 h-3.5 text-[#C59B27]" />
                      <span>{t.honorQuoteLabel}</span>
                    </div>
                    <p className="text-xs italic text-slate-600 leading-relaxed">
                      {star.teacherPraise[lang]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* 2. General Honor Stars Wall */}
      {otherStars.length > 0 && (
        <section>
          <Container size="lg">
            <div className="mb-6 flex items-center gap-2 text-[#0F4C81]">
              <Award className="w-5 h-5 text-[#0F4C81]" />
              <h2 className="text-xl sm:text-2xl font-black text-[#0B192C]">
                {isRTL ? 'نجوم المسارات والالتزام' : 'Subject & Commitment Honorees'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherStars.map((star) => (
                <div
                  key={star.id}
                  className="bg-white rounded-2xl border border-[#E2E8F0] p-6 text-start flex flex-col justify-between hover:border-[#0F4C81]/30 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-bold text-[#0F4C81] bg-[#EFF6FF] px-2.5 py-1 rounded-md">
                        {star.categoryBadge[lang]}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {star.country.code} {star.country[lang]}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#0B192C] mb-1">
                      {star.studentDisplayName[lang]}
                    </h3>

                    <p className="text-xs font-semibold text-[#7E5B10] mb-2">
                      {star.achievementTitle[lang]}
                    </p>

                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {star.achievementDetail[lang]}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 bg-[#FAFBFD] p-3 rounded-xl">
                    <p className="text-[11px] italic text-slate-500 leading-relaxed">
                      {star.teacherPraise[lang]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Inspirational Bottom Banner */}
      <section>
        <Container size="md">
          <div className="bg-[#0B192C] text-white rounded-3xl p-8 sm:p-12 text-center border border-[#1E3A5F]">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 text-amber-300 flex items-center justify-center mx-auto mb-4 border border-amber-400/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mb-3 text-white">
              {t.honorInspirationTitle}
            </h2>
            <p className="text-slate-300 text-xs sm:text-base max-w-lg mx-auto mb-8 leading-relaxed">
              {t.honorInspirationText}
            </p>
            <Button
              variant="gold"
              size="lg"
              onClick={() => onNavigate('contact')}
              icon={<ArrowIcon className="w-4 h-4" />}
              iconPosition="end"
            >
              {t.ctaRegister}
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
