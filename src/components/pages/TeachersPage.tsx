import React, { useState, useMemo } from 'react';
import { Container } from '../shared/Container';
import { SectionTitle } from '../shared/SectionTitle';
import { Badge } from '../shared/Badge';
import { Button } from '../shared/Button';
import { useLanguage } from '../../i18n/LanguageContext';
import { AppRoute } from '../../navigation/routes';
import { MOCK_TEACHERS, TeacherPublicProfile } from '../../data/teachersData';
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
  Users
} from 'lucide-react';

interface TeachersPageProps {
  onNavigate: (route: AppRoute) => void;
}

export function TeachersPage({ onNavigate }: TeachersPageProps) {
  const { t, isRTL, lang } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all');

  const specializationsList = [
    { id: 'all', label: { ar: 'كافة التخصصات', en: 'All Disciplines' } },
    { id: 'quran', label: { ar: 'القرآن الكريم والقراءات', en: 'Quran & Recitation' } },
    { id: 'arabic', label: { ar: 'اللغة العربية واللسان', en: 'Arabic Language' } },
    { id: 'islamic', label: { ar: 'العلوم الشرعية والسيرة', en: 'Islamic Studies' } },
    { id: 'foundation', label: { ar: 'التأسيس والقاعدة النورانية', en: 'Foundation Phonics' } },
  ];

  const filteredTeachers = useMemo(() => {
    if (selectedSpecialization === 'all') return MOCK_TEACHERS;
    return MOCK_TEACHERS.filter((teacher) => teacher.specialization === selectedSpecialization);
  }, [selectedSpecialization]);

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTeachers.map((teacher) => (
              <article
                key={teacher.id}
                className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-7 flex flex-col justify-between text-start hover:border-[#0F4C81]/40 hover:shadow-xs transition-all"
              >
                <div>
                  {/* Top Badge and Experience */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-bold text-[#0F4C81] bg-[#EFF6FF] px-3 py-1 rounded-lg border border-[#DBEAFE]">
                      {teacher.specializationLabel[lang]}
                    </span>

                    {teacher.featuredTag && (
                      <span className="text-[11px] font-bold text-[#7E5B10] bg-[#FDF7E2] px-2.5 py-0.5 rounded-md border border-[#FEEFC3]">
                        {teacher.featuredTag[lang]}
                      </span>
                    )}
                  </div>

                  {/* Teacher Name & Title */}
                  <h2 className="text-lg sm:text-xl font-black text-[#0B192C] mb-1">
                    {teacher.name[lang]}
                  </h2>
                  <p className="text-xs font-semibold text-slate-500 mb-4">
                    {teacher.title[lang]} • {isRTL ? `خبرة ${teacher.experienceYears} سنوات` : `${teacher.experienceYears} Years Experience`}
                  </p>

                  {/* Qualifications */}
                  <div className="mb-6 bg-[#F7F9FC] rounded-2xl p-4 border border-slate-100">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-[#C59B27]" />
                      <span>{t.teachersCertLabel}</span>
                    </h3>
                    <ul className="flex flex-col gap-2">
                      {teacher.qualifications[lang].map((q, i) => (
                        <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0F4C81] shrink-0 mt-0.5" />
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Philosophy Quote */}
                  <div className="mb-6 bg-[#FAFBFD] p-4 rounded-2xl border-s-4 border-s-[#C59B27] text-slate-700">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-1.5">
                      <Quote className="w-3.5 h-3.5 text-[#C59B27]" />
                      <span>{t.teachersApproachLabel}</span>
                    </div>
                    <p className="text-xs italic leading-relaxed text-slate-600">
                      {teacher.teachingPhilosophy[lang]}
                    </p>
                  </div>
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
            ))}
          </div>

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
