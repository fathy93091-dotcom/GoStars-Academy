import React, { useState, useMemo } from 'react';
import { Container } from '../shared/Container';
import { SectionTitle } from '../shared/SectionTitle';
import { Badge } from '../shared/Badge';
import { Button } from '../shared/Button';
import { useLanguage } from '../../i18n/LanguageContext';
import { useSiteContent } from '../../lib/SiteContentContext';
import { AppRoute } from '../../navigation/routes';
import { CmsPricingPlanItem } from '../../types';
import { 
  Check, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  CalendarCheck,
  ShieldAlert
} from 'lucide-react';

interface PricingPageProps {
  onNavigate: (route: AppRoute) => void;
}

export function PricingPage({ onNavigate }: PricingPageProps) {
  const { t, isRTL, lang } = useLanguage();
  const { content } = useSiteContent();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'SAR' | 'EGP'>('USD');
  
  const pricingPlans = useMemo(() => {
    return (content.pricingPlansList || []).filter(p => p.isActive !== false);
  }, [content.pricingPlansList]);

  const pricingFaqs = useMemo(() => {
    const all = content.faqList || [];
    const filtered = all.filter(f => f.isActive && (f.category === 'pricing' || f.category === 'general'));
    return filtered.length > 0 ? filtered : all.filter(f => f.isActive);
  }, [content.faqList]);

  const [openFaqId, setOpenFaqId] = useState<string | null>(pricingFaqs[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => prev === id ? null : id);
  };

  const formatPrice = (plan: CmsPricingPlanItem) => {
    switch (selectedCurrency) {
      case 'SAR':
        return `${plan.priceSar || 0} ر.س`;
      case 'EGP':
        return `${plan.priceEgp || 0} ج.م`;
      case 'USD':
      default:
        return `$${plan.priceUsd || 0}`;
    }
  };

  return (
    <div className="flex flex-col gap-16 sm:gap-24 py-10 sm:py-16">
      {/* Header */}
      <section>
        <Container size="lg">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="gold" size="md" className="mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isRTL ? 'اشتراكات شهرية مرنة' : 'Flexible Monthly Plans'}</span>
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-black text-[#0B192C] tracking-tight mb-4">
              {t.pricingPageTitle}
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6">
              {t.pricingPageSubtitle}
            </p>

            {/* Currency Selector */}
            <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => setSelectedCurrency('USD')}
                className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedCurrency === 'USD'
                    ? 'bg-white text-[#0F4C81] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.currencyLabelUSD}
              </button>
              <button
                onClick={() => setSelectedCurrency('SAR')}
                className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedCurrency === 'SAR'
                    ? 'bg-white text-[#0F4C81] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.currencyLabelSAR}
              </button>
              <button
                onClick={() => setSelectedCurrency('EGP')}
                className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  selectedCurrency === 'EGP'
                    ? 'bg-white text-[#0F4C81] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.currencyLabelEGP}
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Pricing Cards Grid */}
      <section>
        <Container size="lg">
          {pricingPlans.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {pricingPlans.map((plan) => {
                const isPopular = plan.isPopular;
                const name = lang === 'ar' ? plan.nameAr : (plan.nameEn || plan.nameAr);
                const badge = lang === 'ar' ? plan.badgeAr : (plan.badgeEn || plan.badgeAr);
                const targetAudience = lang === 'ar' ? plan.targetAudienceAr : (plan.targetAudienceEn || plan.targetAudienceAr);
                const period = lang === 'ar' ? (plan.periodAr || t.planDurationMonthly) : (plan.periodEn || t.planDurationMonthly);
                const description = lang === 'ar' ? plan.descriptionAr : (plan.descriptionEn || plan.descriptionAr);
                const features = lang === 'ar' ? plan.featuresAr : (plan.featuresEn || plan.featuresAr);
                const ctaText = lang === 'ar' ? (plan.ctaTextAr || t.ctaRegister) : (plan.ctaTextEn || t.ctaRegister);

                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-3xl p-8 flex flex-col justify-between text-start transition-all ${
                      isPopular
                        ? 'bg-white border-2 border-[#0F4C81] shadow-lg ring-4 ring-[#0F4C81]/10 -translate-y-1'
                        : 'bg-white border border-[#E2E8F0] shadow-xs'
                    }`}
                  >
                    {badge && (
                      <div className="absolute -top-3.5 start-8">
                        <span className="bg-[#0F4C81] text-white text-xs font-black px-3.5 py-1 rounded-full shadow-xs uppercase tracking-wider">
                          {badge}
                        </span>
                      </div>
                    )}

                    <div>
                      {/* Title & Target */}
                      <div className="mb-4">
                        <h3 className="text-xl font-black text-[#0B192C] mb-1">
                          {name}
                        </h3>
                        {targetAudience && (
                          <p className="text-xs text-slate-500 font-medium">
                            {targetAudience}
                          </p>
                        )}
                      </div>

                      {/* Price display */}
                      <div className="flex items-baseline gap-1 my-6 pb-6 border-b border-slate-100">
                        <span className="text-3xl sm:text-4xl font-black text-[#0B192C]">
                          {formatPrice(plan)}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-slate-500">
                          / {period}
                        </span>
                      </div>

                      {/* Description */}
                      {description && (
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                          {description}
                        </p>
                      )}

                      {/* Features list */}
                      {features && features.length > 0 && (
                        <div className="space-y-3 mb-8">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                            {isRTL ? 'المزايا المتضمنة:' : 'What is included:'}
                          </span>
                          {features.map((feature, i) => (
                            <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                              <div className="w-4 h-4 rounded-full bg-[#EFF6FF] text-[#0F4C81] flex items-center justify-center shrink-0 mt-0.5">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Button */}
                    <Button
                      variant={isPopular ? 'primary' : 'outline'}
                      size="md"
                      fullWidth
                      onClick={() => onNavigate('contact')}
                      icon={<ArrowIcon className="w-4 h-4" />}
                      iconPosition="end"
                    >
                      {ctaText}
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-10 sm:p-14 text-center max-w-2xl mx-auto shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[#C59B27] flex items-center justify-center mx-auto mb-4 border border-amber-200">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#0B192C] mb-2">
                {isRTL ? 'باقات الاشتراك قيد التحديث' : 'Pricing Plans Updating'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {isRTL
                  ? 'يمكنك التواصل معنا مباشرة لتصميم باقة مخصصة تلائم عدد الحصص والمواد لأبنائك.'
                  : 'Contact us directly to tailor a customized learning schedule and package for your family.'}
              </p>
              <Button
                variant="gold"
                size="md"
                onClick={() => onNavigate('contact')}
                icon={<ArrowIcon className="w-4 h-4" />}
                iconPosition="end"
              >
                {t.ctaRegister}
              </Button>
            </div>
          )}

          {/* Guarantee Note */}
          <div className="mt-8 bg-[#F7F9FC] rounded-2xl border border-slate-200 p-4 text-center max-w-2xl mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-600">
            <CalendarCheck className="w-4 h-4 text-[#0F4C81] shrink-0" />
            <span>{t.pricingNote}</span>
          </div>
        </Container>
      </section>

      {/* Custom Family Plan CTA */}
      <section>
        <Container size="lg">
          <div className="bg-[#0B192C] text-white rounded-3xl p-8 sm:p-12 border border-[#1E3A5F] flex flex-col md:flex-row items-center justify-between gap-8 text-start">
            <div className="max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C59B27] mb-2 block">
                {isRTL ? 'خطط العائلات والأخوة' : 'Family & Multi-Subject Package'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mb-3 text-white">
                {t.planCustomTitle}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {t.planCustomDesc}
              </p>
            </div>

            <Button
              variant="gold"
              size="lg"
              onClick={() => onNavigate('contact')}
              className="shrink-0"
            >
              {t.planCustomButton}
            </Button>
          </div>
        </Container>
      </section>

      {/* Pricing FAQs */}
      {pricingFaqs.length > 0 && (
        <section>
          <Container size="md">
            <SectionTitle
              title={t.pricingFaqTitle}
              subtitle={t.pricingFaqSubtitle}
              badge={isRTL ? 'إجابات مباشرة' : 'FAQ'}
            />

            <div className="space-y-4">
              {pricingFaqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                const question = lang === 'ar' ? faq.questionAr : (faq.questionEn || faq.questionAr);
                const answer = lang === 'ar' ? faq.answerAr : (faq.answerEn || faq.answerAr);

                return (
                  <div
                    key={faq.id}
                    className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full px-6 py-5 flex items-center justify-between text-start gap-4 cursor-pointer hover:bg-slate-50"
                    >
                      <span className="font-bold text-sm sm:text-base text-[#0B192C]">
                        {question}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 text-start">
                        {answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
