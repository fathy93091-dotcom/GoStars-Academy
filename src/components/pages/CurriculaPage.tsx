import React, { useState, useMemo } from 'react';
import { Container } from '../shared/Container';
import { SectionTitle } from '../shared/SectionTitle';
import { Badge } from '../shared/Badge';
import { Button } from '../shared/Button';
import { useLanguage } from '../../i18n/LanguageContext';
import { useSiteContent } from '../../lib/SiteContentContext';
import { AppRoute } from '../../navigation/routes';
import { 
  MOCK_CURRICULA, 
  COUNTRIES_CONFIG, 
  STAGES_CONFIG, 
  SUBJECTS_CONFIG, 
  CurriculumItem 
} from '../../data/curriculaData';
import { 
  BookOpen, 
  Target, 
  Layers, 
  Bookmark, 
  Filter, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft,
  Search,
  CheckCircle2
} from 'lucide-react';

interface CurriculaPageProps {
  onNavigate: (route: AppRoute) => void;
}

export function CurriculaPage({ onNavigate }: CurriculaPageProps) {
  const { t, isRTL, lang } = useLanguage();
  const { content } = useSiteContent();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCurriculum, setActiveCurriculum] = useState<CurriculumItem | null>(null);

  // Dynamic curricula from CMS
  const allCurricula = useMemo<CurriculumItem[]>(() => {
    const list = content?.curriculaList;
    if (list && list.length > 0) {
      return list
        .filter(c => c && c.isActive !== false)
        .map(c => ({
          id: c.id,
          country: c.country,
          stage: c.stage,
          subject: c.subject,
          title: { ar: c.titleAr || '', en: c.titleEn || c.titleAr || '' },
          gradeLabel: { ar: c.gradeLabelAr || '', en: c.gradeLabelEn || c.gradeLabelAr || '' },
          description: { ar: c.descriptionAr || '', en: c.descriptionEn || c.descriptionAr || '' },
          objectives: { ar: c.objectivesAr || [], en: c.objectivesEn || c.objectivesAr || [] },
          topics: { ar: c.topicsAr || [], en: c.topicsEn || c.topicsAr || [] },
          referenceBooks: { ar: ['المنهج المعتمد لوزارة التعليم'], en: ['Ministry Approved Standard Syllabus'] }
        }));
    }

    return MOCK_CURRICULA;
  }, [content?.curriculaList]);

  // Filtered list
  const filteredCurricula = useMemo(() => {
    return allCurricula.filter((item) => {
      const matchCountry = selectedCountry === 'all' || item.country === selectedCountry;
      const matchStage = selectedStage === 'all' || item.stage === selectedStage;
      const matchSubject = selectedSubject === 'all' || item.subject === selectedSubject;
      
      const q = searchQuery.trim().toLowerCase();
      const titleText = (item.title?.[lang] || item.title?.ar || item.title?.en || '').toLowerCase();
      const descText = (item.description?.[lang] || item.description?.ar || item.description?.en || '').toLowerCase();
      const gradeText = (item.gradeLabel?.[lang] || item.gradeLabel?.ar || item.gradeLabel?.en || '').toLowerCase();

      const matchSearch = !q || 
        titleText.includes(q) ||
        descText.includes(q) ||
        gradeText.includes(q);

      return matchCountry && matchStage && matchSubject && matchSearch;
    });
  }, [allCurricula, selectedCountry, selectedStage, selectedSubject, searchQuery, lang]);

  const handleResetFilters = () => {
    setSelectedCountry('all');
    setSelectedStage('all');
    setSelectedSubject('all');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCountry !== 'all' || selectedStage !== 'all' || selectedSubject !== 'all' || searchQuery !== '';

  return (
    <div className="flex flex-col gap-12 sm:gap-16 py-10 sm:py-16">
      {/* Header */}
      <section>
        <Container size="lg">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="blue" size="md" className="mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isRTL ? 'دليل المسارات الأكاديمية' : 'Curricula Guide'}</span>
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-black text-[#0B192C] tracking-tight mb-4">
              {t.curriculaPageTitle}
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              {t.curriculaPageSubtitle}
            </p>
          </div>
        </Container>
      </section>

      {/* Interactive Filters Bar */}
      <section>
        <Container size="lg">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-xs flex flex-col gap-6">
            {/* Country Selector (Horizontal Tabs) */}
            <div>
              <div className="flex items-center justify-between gap-4 mb-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#0F4C81]" />
                  {t.filterByCountry}
                </span>

                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs font-semibold text-[#0F4C81] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{t.curriculaEmptyStateReset}</span>
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {COUNTRIES_CONFIG.map((c) => {
                  const isSelected = selectedCountry === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCountry(c.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0F4C81] text-white shadow-xs'
                          : 'bg-[#F7F9FC] text-slate-700 hover:bg-slate-200/70 border border-slate-200'
                      }`}
                    >
                      {c.label[lang]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Stage & Subject & Search Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              {/* Stage Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.filterByStage}
                </label>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="w-full bg-[#F7F9FC] border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F4C81] cursor-pointer"
                >
                  {STAGES_CONFIG.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label[lang]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.filterBySubject}
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full bg-[#F7F9FC] border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F4C81] cursor-pointer"
                >
                  {SUBJECTS_CONFIG.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.label[lang]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Box */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isRTL ? 'بحث سريع:' : 'Search Curricula:'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isRTL ? 'ابحث بالاسم أو المرحلة...' : 'Search by title or grade...'}
                    className="w-full bg-[#F7F9FC] border border-slate-200 rounded-lg px-3 py-2 pl-9 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute top-2.5 right-3 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Curricula Cards Grid */}
      <section>
        <Container size="lg">
          {filteredCurricula.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-base font-bold text-slate-800 mb-2">
                {t.curriculaEmptyState}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilters}
                className="mt-4"
              >
                {t.curriculaEmptyStateReset}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredCurricula.map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 flex flex-col justify-between text-start hover:border-[#0F4C81]/40 hover:shadow-xs transition-all"
                >
                  <div>
                    {/* Tags row */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="text-xs font-bold bg-[#EFF6FF] text-[#0F4C81] px-3 py-1 rounded-md">
                        {item.gradeLabel?.[lang] || item.gradeLabel?.ar || ''}
                      </span>
                      <span className="text-xs font-bold bg-[#FDF7E2] text-[#7E5B10] px-3 py-1 rounded-md">
                        {COUNTRIES_CONFIG.find(c => c.id === item.country)?.label?.[lang] || item.country}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg sm:text-xl font-black text-[#0B192C] mb-3">
                      {item.title?.[lang] || item.title?.ar || ''}
                    </h2>

                    {/* Overview */}
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                      {item.description?.[lang] || item.description?.ar || ''}
                    </p>

                    {/* Objectives */}
                    <div className="mb-6 bg-[#F7F9FC] rounded-xl p-4 border border-slate-100">
                      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-[#0F4C81]" />
                        <span>{t.curriculumObjectivesLabel}</span>
                      </h3>
                      <ul className="flex flex-col gap-2">
                        {(item.objectives?.[lang] || item.objectives?.ar || []).map((obj, i) => (
                          <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#0F4C81] shrink-0 mt-0.5" />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Topics & Reference */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div>
                        <h3 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-[#7E5B10]" />
                          <span>{t.curriculumTopicsLabel}</span>
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {(item.topics?.[lang] || item.topics?.ar || []).map((topic, i) => (
                            <span
                              key={i}
                              className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                          <Bookmark className="w-3.5 h-3.5 text-[#0F4C81]" />
                          <span>{t.curriculumMaterialsLabel}</span>
                        </h3>
                        <ul className="flex flex-col gap-1 text-[11px] text-slate-600">
                          {(item.referenceBooks?.[lang] || item.referenceBooks?.ar || []).map((book, i) => (
                            <li key={i}>• {book}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-4">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onNavigate('contact')}
                      icon={<ArrowIcon className="w-4 h-4" />}
                      iconPosition="end"
                      fullWidth
                    >
                      {t.requestCurriculumPlan}
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Guidance Banner */}
      <section>
        <Container size="md">
          <div className="bg-[#0B192C] text-white rounded-3xl p-8 sm:p-10 text-center border border-[#1E3A5F]">
            <h3 className="text-xl sm:text-2xl font-black mb-3">
              {isRTL ? 'لم تجد المنهج أو الصف الدراسي الذي تبحث عنه؟' : 'Looking for a custom grade or track?'}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto mb-6 leading-relaxed">
              {isRTL 
                ? 'فريقنا الأكاديمي جاهز لتنسيق خطة دراسية مخصصة تناسب المنهج المعتمد في مدرستكم أو بلد إقامتكم.'
                : 'Our academic team can configure a bespoke study plan tailored to your school or country requirements.'}
            </p>
            <Button
              variant="gold"
              size="md"
              onClick={() => onNavigate('contact')}
            >
              {t.ctaConsultation}
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
