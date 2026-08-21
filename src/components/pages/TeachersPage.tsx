import React, { useState, useMemo } from 'react';
import { Container } from '../shared/Container';
import { SectionTitle } from '../shared/SectionTitle';
import { Badge } from '../shared/Badge';
import { Button } from '../shared/Button';
import { useLanguage } from '../../i18n/LanguageContext';
import { useSiteContent } from '../../lib/SiteContentContext';
import { AppRoute } from '../../navigation/routes';
import { CmsTeacherItem } from '../../types';
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Quote, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Users,
  Star
} from 'lucide-react';

interface TeachersPageProps {
  onNavigate: (route: AppRoute) => void;
}

export function TeachersPage({ onNavigate }: TeachersPageProps) {
  const { t, isRTL, lang } = useLanguage();
  const { content } = useSiteContent();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all');

  const specializationsList = [
    { id: 'all', label: { ar: 'كافة التخصصات', en: 'All Disciplines' } },
    { id: 'quran', label: { ar: 'القرآن الكريم والقراءات', en: 'Quran & Recitation' } },
    { id: 'arabic', label: { ar: 'اللغة العربية واللسان', en: 'Arabic Language' } },
    { id: 'english', label: { ar: 'اللغة الإنجليزية', en: 'English Language' } },
    { id: 'islamic', label: { ar: 'العلوم الشرعية والسيرة', en: 'Islamic Studies' } },
    { id: 'foundation', label: { ar: 'التأسيس والقاعدة النورانية', en: 'Foundation Phonics' } },
  ];

  const teachersList = useMemo(() => {
    return (content.teachersList || []).filter(t => t.isActive !== false);
  }, [content.teachersList]);

  const filteredTeachers = useMemo(() => {
    if (selectedSpecialization === 'all') return teachersList;
    return teachersList.filter((teacher) => {
      const specAr = teacher.specializationAr?.toLowerCase() || '';
      const specEn = teacher.specializationEn?.toLowerCase() || '';
      if (selectedSpecialization === 'quran') {
        return specAr.includes('قرآن') || specAr.includes('تجويد') || specAr.includes('قراءات') || specEn.includes('quran');
      }
      if (selectedSpecialization === 'arabic') {
        return specAr.includes('عربية') || specAr.includes('لغة عربية') || specEn.includes('arabic');
      }
      if (selectedSpecialization === 'english') {
        return specAr.includes('إنجليزية') || specAr.includes('انجليزية') || specEn.includes('english');
      }
      if (selectedSpecialization === 'islamic') {
        return specAr.includes('شرعية') || specAr.includes('إسلامية') || specEn.includes('islamic');
      }
      if (selectedSpecialization === 'foundation') {
        return specAr.includes('نورانية') || specAr.includes('تأسيس') || specEn.includes('foundation') || specEn.includes('nooraniyah');
      }
      return true;
    });
  }, [teachersList, selectedSpecialization]);

  return (
    <div className="flex flex-col gap-14 sm:gap-20 py-10 sm:py-16">
      {/* Header */}
      <section>
        <Container size="lg">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="gold" size="md" className="mb-4">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{isRTL ? 'كوادر أكاديمية متخصصة' : 'Distinguished Faculty'}</span>
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-black text-[#0B192C] tracking-tight mb-4">
              {t.teachersPageTitle}
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              {t.teachersPageSubtitle}
            </p>
          </div>
        </Container>
      </section>

      {/* Filter Tabs */}
      <section>
        <Container size="lg">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {specializationsList.map((spec) => {
              const isSelected = selectedSpecialization === spec.id;
              return (
                <button
                  key={spec.id}
                  onClick={() => setSelectedSpecialization(spec.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0F4C81] text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {spec.label[lang]}
                </button>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Teachers Showcase Cards */}
      <section>
        <Container size="lg">
          {filteredTeachers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTeachers.map((teacher) => {
                const name = lang === 'ar' ? teacher.nameAr : (teacher.nameEn || teacher.nameAr);
                const title = lang === 'ar' ? teacher.titleAr : (teacher.titleEn || teacher.titleAr);
                const specialization = lang === 'ar' ? teacher.specializationAr : (teacher.specializationEn || teacher.specializationAr);
                const badge = lang === 'ar' ? teacher.badgeAr : (teacher.badgeEn || teacher.badgeAr);
                const qualifications = lang === 'ar' ? teacher.qualificationsAr : (teacher.qualificationsEn || teacher.qualificationsAr);
                const philosophy = lang === 'ar' ? teacher.teachingPhilosophyAr : (teacher.teachingPhilosophyEn || teacher.teachingPhilosophyAr);

                return (
                  <article
                    key={teacher.id}
                    className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-7 flex flex-col justify-between text-start hover:border-[#0F4C81]/40 hover:shadow-md transition-all group"
                  >
                    <div>
                      {/* Teacher Avatar & Badges Header */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          {teacher.avatarUrl ? (
                            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-200 shadow-sm shrink-0">
                              <img
                                src={teacher.avatarUrl}
                                alt={name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ) : (
                            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-[#C59B27] border border-amber-200 flex items-center justify-center font-black text-xl shrink-0">
                              <GraduationCap className="w-7 h-7" />
                            </div>
                          )}
                          <div>
                            <h2 className="text-base sm:text-lg font-black text-[#0B192C] leading-snug">
                              {name}
                            </h2>
                            <p className="text-xs font-semibold text-slate-500">
                              {title}
                            </p>
                          </div>
                        </div>

                        {badge && (
                          <span className="text-[10px] font-bold text-[#7E5B10] bg-[#FDF7E2] px-2.5 py-0.5 rounded-full border border-[#FEEFC3] shrink-0">
                            {badge}
                          </span>
                        )}
                      </div>

                      {/* Specialization & Experience */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="text-xs font-bold text-[#0F4C81] bg-[#EFF6FF] px-3 py-1 rounded-lg border border-[#DBEAFE]">
                          {specialization}
                        </span>
                        <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                          {isRTL ? `خبرة ${teacher.experienceYears} سنوات` : `${teacher.experienceYears} Years Exp.`}
                        </span>
                      </div>

                      {/* Qualifications */}
                      {qualifications && qualifications.length > 0 && (
                        <div className="mb-5 bg-[#F7F9FC] rounded-2xl p-4 border border-slate-100">
                          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-[#C59B27]" />
                            <span>{t.teachersCertLabel}</span>
                          </h3>
                          <ul className="flex flex-col gap-1.5">
                            {qualifications.map((q, i) => (
                              <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#0F4C81] shrink-0 mt-0.5" />
                                <span>{q}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Philosophy Quote */}
                      {philosophy && (
                        <div className="mb-5 bg-[#FAFBFD] p-3.5 rounded-2xl border-s-4 border-s-[#C59B27] text-slate-700">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1">
                            <Quote className="w-3.5 h-3.5 text-[#C59B27]" />
                            <span>{t.teachersApproachLabel}</span>
                          </div>
                          <p className="text-xs italic leading-relaxed text-slate-600">
                            {philosophy}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action */}
                    <div className="pt-4 border-t border-slate-100">
                      <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        onClick={() => onNavigate('contact')}
                        icon={<ArrowIcon className="w-4 h-4" />}
                        iconPosition="end"
                      >
                        {isRTL ? 'طلب الدراسة مع المعلم' : 'Request Study Session'}
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-10 sm:p-14 text-center max-w-2xl mx-auto shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#C59B27] flex items-center justify-center mx-auto mb-4 border border-amber-200">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#0B192C] mb-2">
                {isRTL ? 'دليل المعلمين جاهز لاستقبال الكادر الجديد' : 'Faculty Directory Ready For New Educators'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {isRTL
                  ? 'يتم تحديث وإضافة ملفات المعلمين والمعلمات المجازين مباشرة عبر لوحة تحكم الإدارة. يمكنك التواصل معنا لتحديد المعلم الأنسب لطفلك.'
                  : 'Certified educators and faculty profiles are being updated via the administration dashboard. Feel free to reach out to assign the best educator for your child.'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button
                  variant="gold"
                  size="md"
                  onClick={() => onNavigate('contact')}
                  icon={<ArrowIcon className="w-4 h-4" />}
                  iconPosition="end"
                >
                  {isRTL ? 'تواصل مع إدارة الأكاديمية' : 'Contact Academy Team'}
                </Button>
              </div>
            </div>
          )}

          {/* Privacy & Safety Note */}
          <div className="mt-12 bg-[#F7F9FC] rounded-2xl border border-slate-200 p-4 text-center max-w-2xl mx-auto flex items-center justify-center gap-2.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-[#0F4C81] shrink-0" />
            <span>{t.teachersDisclaimer}</span>
          </div>
        </Container>
      </section>

      {/* Faculty Application CTA */}
      <section>
        <Container size="md">
          <div className="bg-[#0B192C] text-white rounded-3xl p-8 sm:p-10 text-center border border-[#1E3A5F]">
            <h3 className="text-xl sm:text-2xl font-black mb-3">
              {isRTL ? 'هل أنت معلم أو معلمة مجازة وترغب في الانضمام لكادرنا؟' : 'Are you a certified educator seeking to join our faculty?'}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto mb-6 leading-relaxed">
              {isRTL 
                ? 'نرحب دومًا بالكفاءات التعليمية والمجازين بالسند المتصل لتعزيز بيئتنا الأكاديمية.'
                : 'We welcome certified educators holding authentic Ijazah and exceptional pedagogical expertise.'}
            </p>
            <Button
              variant="gold"
              size="md"
              onClick={() => onNavigate('contact')}
            >
              {isRTL ? 'تقديم طلب انضمام كمعلم' : 'Apply as an Educator'}
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
