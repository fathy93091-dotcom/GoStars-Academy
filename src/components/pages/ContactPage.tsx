import React, { useState } from 'react';
import { Container } from '../shared/Container';
import { SectionTitle } from '../shared/SectionTitle';
import { Badge } from '../shared/Badge';
import { Button } from '../shared/Button';
import { useLanguage } from '../../i18n/LanguageContext';
import { AppRoute } from '../../navigation/routes';
import { BRAND_TOKENS } from '../../theme/tokens';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Sparkles,
  MessageSquare,
  HelpCircle
} from 'lucide-react';

interface ContactPageProps {
  onNavigate?: (route: AppRoute) => void;
}

export function ContactPage({ onNavigate }: ContactPageProps) {
  const { t, isRTL, lang } = useLanguage();

  const [formData, setFormData] = useState({
    parentName: '',
    studentName: '',
    studentAge: '',
    phone: '',
    email: '',
    countryOrCurriculum: '',
    subject: '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate smooth submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-16 sm:gap-24 py-10 sm:py-16">
      {/* Header */}
      <section>
        <Container size="lg">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="blue" size="md" className="mb-4">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{isRTL ? 'خدمة أولياء الأمور والطلاب' : 'Admissions & Support'}</span>
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-black text-[#0B192C] tracking-tight mb-4">
              {t.contactPageTitle}
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              {t.contactPageSubtitle}
            </p>
          </div>
        </Container>
      </section>

      {/* Main Grid: Channels on one side, Registration/Inquiry Form on the other */}
      <section>
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Left/Right: Contact Channels Info */}
            <div className="lg:col-span-5 flex flex-col gap-6 text-start">
              <div className="bg-[#0B192C] text-white rounded-3xl p-8 sm:p-10 border border-[#1E3A5F] flex flex-col gap-6">
                <div>
                  <span className="text-xs font-bold text-[#C59B27] uppercase tracking-widest block mb-2">
                    GoStars Academy Info
                  </span>
                  <h2 className="text-2xl font-black text-white mb-2">
                    {t.contactChannelsTitle}
                  </h2>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {isRTL 
                      ? 'نسعد باستقبال استفساراتكم وترتيب جلسات التقييم المجانية على مدار الأسبوع.' 
                      : 'We look forward to receiving your inquiries and scheduling free assessment sessions.'}
                  </p>
                </div>

                <div className="space-y-5 pt-2 border-t border-slate-700">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#C59B27]">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-slate-400">
                        {t.contactAddressLabel}
                      </span>
                      <span className="text-sm font-medium text-slate-200">
                        {BRAND_TOKENS.contactInfo.address[lang]}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#C59B27]">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-slate-400">
                        {t.contactPhoneLabel}
                      </span>
                      <span dir="ltr" className="text-sm font-bold text-amber-300">
                        {BRAND_TOKENS.contactInfo.phone}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#C59B27]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-slate-400">
                        {t.contactEmailLabel}
                      </span>
                      <span className="text-sm font-medium text-slate-200">
                        {BRAND_TOKENS.contactInfo.email}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#C59B27]">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-xs font-semibold text-slate-400">
                        {t.contactHoursLabel}
                      </span>
                      <span className="text-sm font-medium text-slate-200">
                        {BRAND_TOKENS.contactInfo.workingHours[lang]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enrollment Steps Highlight */}
              <div className="bg-[#F7F9FC] rounded-3xl border border-slate-200 p-6 sm:p-8">
                <h3 className="text-base font-bold text-[#0B192C] mb-4">
                  {t.enrollStepsTitle}
                </h3>
                <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#0F4C81] text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
                    <div>
                      <span className="font-bold text-slate-900 block">{t.enrollStep1Title}</span>
                      <span>{t.enrollStep1Desc}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#0F4C81] text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
                    <div>
                      <span className="font-bold text-slate-900 block">{t.enrollStep2Title}</span>
                      <span>{t.enrollStep2Desc}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#0F4C81] text-white flex items-center justify-center font-bold text-xs shrink-0">3</span>
                    <div>
                      <span className="font-bold text-slate-900 block">{t.enrollStep3Title}</span>
                      <span>{t.enrollStep3Desc}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#0F4C81] text-white flex items-center justify-center font-bold text-xs shrink-0">4</span>
                    <div>
                      <span className="font-bold text-slate-900 block">{t.enrollStep4Title}</span>
                      <span>{t.enrollStep4Desc}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right/Left: Inquiry and Registration Form */}
            <div className="lg:col-span-7">
              <div className="bg-white rounded-3xl border border-[#E2E8F0] p-8 sm:p-10 shadow-xs text-start">
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-[#0B192C] mb-2">
                    {t.inquiryFormTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
                    {t.inquiryFormSubtitle}
                  </p>
                </div>

                {submitted ? (
                  <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-8 text-center animate-in fade-in duration-300">
                    <div className="w-14 h-14 rounded-full bg-[#0F4C81] text-white flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0B192C] mb-2">
                      {isRTL ? 'تم استلام طلبكم بنجاح' : 'Inquiry Received Successfully'}
                    </h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                      {t.formSuccessMessage}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSubmitted(false)}
                    >
                      {isRTL ? 'إرسال طلب آخر' : 'Submit Another Request'}
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {t.formParentName} <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.parentName}
                          onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                          className="w-full bg-[#F7F9FC] border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                          placeholder={isRTL ? 'مثال: أبو محمد' : 'e.g. John Doe'}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {t.formStudentName} <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.studentName}
                          onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                          className="w-full bg-[#F7F9FC] border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                          placeholder={isRTL ? 'مثال: محمد' : 'e.g. Alex'}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {t.formPhone} <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          dir="ltr"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-[#F7F9FC] border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                          placeholder="+966 50 000 0000"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {t.formEmail}
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-[#F7F9FC] border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                          placeholder="example@domain.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {t.formCountry}
                        </label>
                        <input
                          type="text"
                          value={formData.countryOrCurriculum}
                          onChange={(e) => setFormData({ ...formData, countryOrCurriculum: e.target.value })}
                          className="w-full bg-[#F7F9FC] border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                          placeholder={isRTL ? 'مثال: السعودية / المنهج السعودي' : 'e.g. Saudi Arabia / National'}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {t.formInterestedSubject}
                        </label>
                        <select
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full bg-[#F7F9FC] border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F4C81] cursor-pointer"
                        >
                          <option value="">{isRTL ? '-- اختر المادة أو المسار --' : '-- Select Subject Track --'}</option>
                          <option value="quran">{isRTL ? 'القرآن الكريم والتجويد' : 'Quran & Tajweed'}</option>
                          <option value="arabic">{isRTL ? 'اللغة العربية واللسان' : 'Arabic Language'}</option>
                          <option value="nooraniyah">{isRTL ? 'القاعدة النورانية والتأسيس' : 'Nooraniyah Phonics'}</option>
                          <option value="islamic">{isRTL ? 'التربية الإسلامية والفقه' : 'Islamic Studies'}</option>
                          <option value="school">{isRTL ? 'المناهج المدرسية والوزارية' : 'National Curricula'}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {t.formNotes}
                      </label>
                      <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full bg-[#F7F9FC] border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
                        placeholder={isRTL ? 'أي تفاصيل عن مستوى الطالب أو الأوقات المفضلة...' : 'Any details on student level or preferred timings...'}
                      />
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        disabled={loading}
                        icon={<Send className="w-4 h-4" />}
                        iconPosition="end"
                      >
                        {loading ? (isRTL ? 'جاري الإرسال...' : 'Submitting...') : t.formSubmitBtn}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
