import React, { useState } from "react";
import { useSiteContent } from "../../lib/SiteContentContext";
import { useLanguage } from "../../i18n/LanguageContext";
import { Container } from "./Container";
import { SectionTitle } from "./SectionTitle";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

interface FaqSectionProps {
  categoryFilter?: string;
  title?: string;
  subtitle?: string;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  categoryFilter,
  title,
  subtitle
}) => {
  const { content } = useSiteContent();
  const { isRTL, lang } = useLanguage();
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  if (!content.visibility.showFaq) return null;

  const rawFaqs = content.faqList || [];
  const activeFaqs = rawFaqs
    .filter(f => f.isActive)
    .filter(f => (categoryFilter && categoryFilter !== "all" ? f.category === categoryFilter : true))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  if (activeFaqs.length === 0) return null;

  const defaultTitle = isRTL ? "الأسئلة الشائعة وإجاباتها" : "Frequently Asked Questions";
  const defaultSubtitle = isRTL
    ? "كل ما يهم أولياء الأمور والطلاب حول المناهج، الحصص، المتابعة ونظام الأكاديمية"
    : "Everything parents and students need to know about curricula, sessions, and grading";

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

  return (
    <section className="py-12 sm:py-16">
      <Container size="lg">
        <SectionTitle
          title={title || defaultTitle}
          subtitle={subtitle || defaultSubtitle}
          badge={isRTL ? "إجابات وافية" : "Help & FAQ"}
        />

        <div className="max-w-3xl mx-auto space-y-3">
          {activeFaqs.map(faq => {
            const isOpen = openFaqId === faq.id;
            const question = lang === "ar" ? faq.questionAr : (faq.questionEn || faq.questionAr);
            const answer = lang === "ar" ? faq.answerAr : (faq.answerEn || faq.answerAr);

            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition hover:border-purple-200"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-4 sm:p-5 text-start flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-xs shrink-0">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                      {question}
                    </span>
                  </div>

                  <div
                    className={`w-7 h-7 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 bg-purple-100 text-purple-700" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    <p>{answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
