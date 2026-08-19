import React, { useState } from "react";
import {
  SiteContentSettings,
  CmsCurriculumItem,
  CmsFaqItem,
  CmsHeroSettings,
  CmsAnnouncementBanner,
  CmsSectionVisibility,
  CmsAboutSettings,
  CmsContactSettings
} from "../../../types";
import { useLanguage } from "../../../i18n/LanguageContext";
import { useAuth } from "../../../lib/AuthContext";
import {
  Sparkles,
  Layout,
  Type,
  Megaphone,
  BookOpen,
  HelpCircle,
  Eye,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  Globe,
  Sliders,
  Phone,
  MessageCircle,
  ExternalLink,
  ChevronDown,
  Layers,
  AlertCircle
} from "lucide-react";

interface AdminCmsManagerProps {
  content: SiteContentSettings;
  onSaveContent: (updated: SiteContentSettings) => Promise<void>;
  onResetContent: () => Promise<void>;
}

type CmsSubTab = "hero" | "banner" | "curricula" | "faq" | "visibility" | "about_contact";

export const AdminCmsManager: React.FC<AdminCmsManagerProps> = ({
  content,
  onSaveContent,
  onResetContent
}) => {
  const { isRTL } = useLanguage();
  const { profile, user } = useAuth();

  const [activeTab, setActiveTab] = useState<CmsSubTab>("hero");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Local Editable Form States
  const [heroForm, setHeroForm] = useState<CmsHeroSettings>({ ...content.hero });
  const [bannerForm, setBannerForm] = useState<CmsAnnouncementBanner>({ ...content.announcementBanner });
  const [visibilityForm, setVisibilityForm] = useState<CmsSectionVisibility>({ ...content.visibility });
  const [aboutForm, setAboutForm] = useState<CmsAboutSettings>({ ...content.about });
  const [contactForm, setContactForm] = useState<CmsContactSettings>({ ...content.contact });
  const [curriculaList, setCurriculaList] = useState<CmsCurriculumItem[]>([...(content.curriculaList || [])]);
  const [faqList, setFaqList] = useState<CmsFaqItem[]>([...(content.faqList || [])]);

  // Modals / Item Editing States
  const [editingCurriculum, setEditingCurriculum] = useState<CmsCurriculumItem | null>(null);
  const [isCurriculumModalOpen, setIsCurriculumModalOpen] = useState(false);

  const [editingFaq, setEditingFaq] = useState<CmsFaqItem | null>(null);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);

  // Trigger Save
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const updatedSettings: SiteContentSettings = {
        ...content,
        hero: heroForm,
        announcementBanner: bannerForm,
        visibility: visibilityForm,
        about: aboutForm,
        contact: contactForm,
        curriculaList,
        faqList,
        updatedAt: new Date().toISOString(),
        updatedBy: profile?.name || user?.displayName || "Admin"
      };

      await onSaveContent(updatedSettings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save CMS settings:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Curriculum CRUD Handlers
  const handleOpenNewCurriculum = () => {
    setEditingCurriculum({
      id: `curr_${Date.now()}`,
      country: "egypt",
      stage: "primary",
      subject: "quran",
      titleAr: "",
      titleEn: "",
      gradeLabelAr: "المرحلة الابتدائية",
      gradeLabelEn: "Primary Stage",
      descriptionAr: "",
      descriptionEn: "",
      topicsAr: ["الموضوع الأول", "الموضوع الثاني"],
      topicsEn: ["Topic 1", "Topic 2"],
      objectivesAr: ["الهدف الأول", "الهدف الثاني"],
      objectivesEn: ["Objective 1", "Objective 2"],
      featuredOnHome: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setIsCurriculumModalOpen(true);
  };

  const handleSaveCurriculumItem = () => {
    if (!editingCurriculum || !editingCurriculum.titleAr) return;
    setCurriculaList(prev => {
      const exists = prev.some(c => c.id === editingCurriculum.id);
      if (exists) {
        return prev.map(c => (c.id === editingCurriculum.id ? editingCurriculum : c));
      }
      return [editingCurriculum, ...prev];
    });
    setIsCurriculumModalOpen(false);
    setEditingCurriculum(null);
  };

  const handleDeleteCurriculumItem = (id: string) => {
    setCurriculaList(prev => prev.filter(c => c.id !== id));
  };

  // FAQ CRUD Handlers
  const handleOpenNewFaq = () => {
    setEditingFaq({
      id: `faq_${Date.now()}`,
      questionAr: "",
      questionEn: "",
      answerAr: "",
      answerEn: "",
      category: "general",
      order: faqList.length + 1,
      isActive: true
    });
    setIsFaqModalOpen(true);
  };

  const handleSaveFaqItem = () => {
    if (!editingFaq || !editingFaq.questionAr) return;
    setFaqList(prev => {
      const exists = prev.some(f => f.id === editingFaq.id);
      if (exists) {
        return prev.map(f => (f.id === editingFaq.id ? editingFaq : f));
      }
      return [...prev, editingFaq];
    });
    setIsFaqModalOpen(false);
    setEditingFaq(null);
  };

  const handleDeleteFaqItem = (id: string) => {
    setFaqList(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Layout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900">
                {isRTL ? "نظام إدارة محتوى الموقع بدون كود (Site CMS)" : "No-Code Website Content CMS"}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 uppercase">
                {isRTL ? "تحكم سحابي مباشر" : "Live Firestore CMS"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              {isRTL
                ? "تعديل وتخصيص نصوص الموقع العام، البنرات الترويجية، المناهج التعليمية، الأسئلة الشائعة، والتحكم في ظهور الأقسام بشكل فوري دون تعديل الكود."
                : "Customize public website copy, hero slogans, promo banners, curricula, FAQ, and toggle section visibility in real-time."}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => {
              if (confirm(isRTL ? "هل تود استعادة النصوص الافتراضية للموقع؟" : "Reset all CMS content to defaults?")) {
                onResetContent();
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
            title={isRTL ? "استعادة الافتراضيات" : "Reset Defaults"}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isRTL ? "استعادة الافتراضي" : "Reset"}</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className={`px-5 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition shadow-md ${
              saveSuccess
                ? "bg-emerald-600 text-white"
                : "bg-slate-900 hover:bg-slate-800 text-white active:scale-95"
            } disabled:opacity-50`}
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>{isRTL ? "تم الحفظ والنشر!" : "Saved & Published!"}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isSaving ? (isRTL ? "جارٍ الحفظ..." : "Saving...") : (isRTL ? "حفظ ونشر التعديلات" : "Save & Publish")}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* CMS Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: "hero" as CmsSubTab, labelAr: "نصوص الواجهة الرئيسية", labelEn: "Hero & Copy", icon: Type },
            { id: "banner" as CmsSubTab, labelAr: "شريط الإعلانات والبنرات", labelEn: "Announcements", icon: Megaphone },
            { id: "curricula" as CmsSubTab, labelAr: "البرامج والمناهج التعليمية", labelEn: "Curricula Tracks", icon: BookOpen, count: curriculaList.length },
            { id: "faq" as CmsSubTab, labelAr: "الأسئلة الشائعة (FAQ)", labelEn: "FAQ Items", icon: HelpCircle, count: faqList.length },
            { id: "visibility" as CmsSubTab, labelAr: "التحكم بظهور الأقسام", labelEn: "Section Toggles", icon: Sliders },
            { id: "about_contact" as CmsSubTab, labelAr: "عن الأكاديمية والتواصل", labelEn: "About & Contact", icon: Phone }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  isActive
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{isRTL ? tab.labelAr : tab.labelEn}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                      isActive ? "bg-purple-700 text-purple-100" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: HERO & MAIN COPY */}
      {activeTab === "hero" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">
                {isRTL ? "تخصيص نصوص الواجهة والصفحة الرئيسية (Hero Texts)" : "Hero Section Copy & Slogans"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isRTL ? "تعديل العنوان الرئيسي، النبذة التعريفية، ونقاط القوة المعروضة في صدر الصفحة." : "Edit the main title, subtitle, and value chips."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Arabic Texts */}
            <div className="space-y-4 bg-slate-50/70 p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 pb-2 border-b border-slate-200">
                <Globe className="w-4 h-4 text-purple-600" />
                <span>{isRTL ? "النصوص باللغة العربية (Arabic)" : "Arabic Content"}</span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">شارة التميز العلوية (Badge):</label>
                <input
                  type="text"
                  value={heroForm.badgeAr}
                  onChange={e => setHeroForm({ ...heroForm, badgeAr: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">العنوان الرئيسي (Hero Title):</label>
                <textarea
                  rows={2}
                  value={heroForm.titleAr}
                  onChange={e => setHeroForm({ ...heroForm, titleAr: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">النبذة التعريفية (Hero Subtitle):</label>
                <textarea
                  rows={3}
                  value={heroForm.subtitleAr}
                  onChange={e => setHeroForm({ ...heroForm, subtitleAr: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-700 block">رقاقات المزايا الثلاث (Value Highlights):</span>
                <input
                  type="text"
                  value={heroForm.highlight1Ar}
                  onChange={e => setHeroForm({ ...heroForm, highlight1Ar: e.target.value })}
                  placeholder="ميزة 1"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                />
                <input
                  type="text"
                  value={heroForm.highlight2Ar}
                  onChange={e => setHeroForm({ ...heroForm, highlight2Ar: e.target.value })}
                  placeholder="ميزة 2"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                />
                <input
                  type="text"
                  value={heroForm.highlight3Ar}
                  onChange={e => setHeroForm({ ...heroForm, highlight3Ar: e.target.value })}
                  placeholder="ميزة 3"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">زر الدعوة الأساسي (CTA 1):</label>
                  <input
                    type="text"
                    value={heroForm.ctaPrimaryAr}
                    onChange={e => setHeroForm({ ...heroForm, ctaPrimaryAr: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">زر الاستكشاف (CTA 2):</label>
                  <input
                    type="text"
                    value={heroForm.ctaSecondaryAr}
                    onChange={e => setHeroForm({ ...heroForm, ctaSecondaryAr: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>

            {/* English Texts */}
            <div className="space-y-4 bg-slate-50/70 p-5 rounded-2xl border border-slate-200" dir="ltr">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 pb-2 border-b border-slate-200">
                <Globe className="w-4 h-4 text-purple-600" />
                <span>English Content Translation</span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Badge Text:</label>
                <input
                  type="text"
                  value={heroForm.badgeEn}
                  onChange={e => setHeroForm({ ...heroForm, badgeEn: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Hero Title:</label>
                <textarea
                  rows={2}
                  value={heroForm.titleEn}
                  onChange={e => setHeroForm({ ...heroForm, titleEn: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Hero Subtitle:</label>
                <textarea
                  rows={3}
                  value={heroForm.subtitleEn}
                  onChange={e => setHeroForm({ ...heroForm, subtitleEn: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-700 block">Value Highlights (3 Chips):</span>
                <input
                  type="text"
                  value={heroForm.highlight1En}
                  onChange={e => setHeroForm({ ...heroForm, highlight1En: e.target.value })}
                  placeholder="Highlight 1"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                />
                <input
                  type="text"
                  value={heroForm.highlight2En}
                  onChange={e => setHeroForm({ ...heroForm, highlight2En: e.target.value })}
                  placeholder="Highlight 2"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                />
                <input
                  type="text"
                  value={heroForm.highlight3En}
                  onChange={e => setHeroForm({ ...heroForm, highlight3En: e.target.value })}
                  placeholder="Highlight 3"
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Primary CTA Button:</label>
                  <input
                    type="text"
                    value={heroForm.ctaPrimaryEn}
                    onChange={e => setHeroForm({ ...heroForm, ctaPrimaryEn: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-1">Secondary CTA Button:</label>
                  <input
                    type="text"
                    value={heroForm.ctaSecondaryEn}
                    onChange={e => setHeroForm({ ...heroForm, ctaSecondaryEn: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ANNOUNCEMENT BANNER */}
      {activeTab === "banner" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">
                {isRTL ? "مركز الإعلانات والبنرات الترويجية (Announcement Banner)" : "Top Announcement Banner"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isRTL ? "إظهار شريط إعلاني متحرك أعلى الموقع العام لإعلام الزوار بفتح التسجيل أو العروض الخاصة." : "Display a global banner on the public site."}
              </p>
            </div>

            {/* Banner Toggle Switch */}
            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="text-xs font-bold text-slate-700">
                {bannerForm.isActive ? (isRTL ? "البنر مفعّل حالياً" : "Banner Active") : (isRTL ? "البنر متوقف" : "Banner Inactive")}
              </span>
              <input
                type="checkbox"
                checked={bannerForm.isActive}
                onChange={e => setBannerForm({ ...bannerForm, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-purple-600 focus:ring-0"
              />
            </label>
          </div>

          {/* Live Preview of the Banner */}
          <div>
            <span className="text-xs font-bold text-slate-400 block mb-2">
              {isRTL ? "معاينة حية لشكل البنر كما سيظهر في الموقع:" : "Live Banner Preview:"}
            </span>
            <div
              className={`p-3 rounded-2xl border flex items-center justify-between gap-4 text-xs font-medium ${
                bannerForm.type === "gold"
                  ? "bg-amber-500 text-slate-950 border-amber-400"
                  : bannerForm.type === "blue"
                  ? "bg-blue-600 text-white border-blue-500"
                  : bannerForm.type === "emerald"
                  ? "bg-emerald-600 text-white border-emerald-500"
                  : bannerForm.type === "purple"
                  ? "bg-purple-600 text-white border-purple-500"
                  : "bg-rose-600 text-white border-rose-500"
              }`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-white/20 uppercase shrink-0">
                  {bannerForm.badgeAr || "تنبيه"}
                </span>
                <span className="truncate">{bannerForm.textAr || "نص الإعلان الترويجي يظهر هنا..."}</span>
              </div>

              {bannerForm.linkTextAr && (
                <span className="text-[11px] font-bold underline shrink-0 cursor-pointer flex items-center gap-1">
                  <span>{bannerForm.linkTextAr}</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              )}
            </div>
          </div>

          {/* Form Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Color/Theme */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {isRTL ? "لون ونمط البنر (Theme Style):" : "Theme Style:"}
              </label>
              <select
                value={bannerForm.type}
                onChange={e => setBannerForm({ ...bannerForm, type: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="gold">{isRTL ? "ذهبي مميز (Gold Accent)" : "Gold Accent"}</option>
                <option value="blue">{isRTL ? "أزرق ملكي (Royal Blue)" : "Royal Blue"}</option>
                <option value="emerald">{isRTL ? "أخضر زمردي (Emerald Green)" : "Emerald Green"}</option>
                <option value="purple">{isRTL ? "بنفسجي إبداعي (Purple)" : "Creative Purple"}</option>
                <option value="rose">{isRTL ? "وردي / تحذيري (Rose / Alert)" : "Rose Alert"}</option>
              </select>
            </div>

            {/* Target Link */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                {isRTL ? "الصفحة الموجه إليها عند النقر:" : "Target Route:"}
              </label>
              <select
                value={bannerForm.linkRoute || "contact"}
                onChange={e => setBannerForm({ ...bannerForm, linkRoute: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              >
                <option value="contact">{isRTL ? "صفحة التسجيل والتواصل (/contact)" : "Contact / Register"}</option>
                <option value="curricula">{isRTL ? "صفحة المناهج والبرامج (/curricula)" : "Curricula Page"}</option>
                <option value="pricing">{isRTL ? "صفحة الأسعار والباقات (/pricing)" : "Pricing Page"}</option>
                <option value="honor-roll">{isRTL ? "لوحة الشرف والنجوم (/honor-roll)" : "Honor Roll"}</option>
              </select>
            </div>

            {/* Arabic Badge & Text */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                {isRTL ? "الشارة والنص بالعربية:" : "Arabic Badge & Text:"}
              </label>
              <input
                type="text"
                value={bannerForm.badgeAr}
                onChange={e => setBannerForm({ ...bannerForm, badgeAr: e.target.value })}
                placeholder="شارة مثل: تسجيل جديد"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              <textarea
                rows={2}
                value={bannerForm.textAr}
                onChange={e => setBannerForm({ ...bannerForm, textAr: e.target.value })}
                placeholder="نص الإعلان بالعربية..."
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              <input
                type="text"
                value={bannerForm.linkTextAr || ""}
                onChange={e => setBannerForm({ ...bannerForm, linkTextAr: e.target.value })}
                placeholder="نص الزر مثل: احجز مقعدك الآن"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            {/* English Badge & Text */}
            <div className="space-y-2" dir="ltr">
              <label className="text-xs font-bold text-slate-700 block">English Badge & Text:</label>
              <input
                type="text"
                value={bannerForm.badgeEn}
                onChange={e => setBannerForm({ ...bannerForm, badgeEn: e.target.value })}
                placeholder="Badge e.g. New Term"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              <textarea
                rows={2}
                value={bannerForm.textEn}
                onChange={e => setBannerForm({ ...bannerForm, textEn: e.target.value })}
                placeholder="Announcement message in English..."
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              <input
                type="text"
                value={bannerForm.linkTextEn || ""}
                onChange={e => setBannerForm({ ...bannerForm, linkTextEn: e.target.value })}
                placeholder="Button text e.g. Book Slot"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CURRICULA & PROGRAMS CMS */}
      {activeTab === "curricula" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">
                {isRTL ? "إدارة البرامج والمسارات التعليمية (Curricula CMS)" : "Curricula & Educational Tracks CMS"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isRTL ? "إضافة وتعديل وحذف المناهج والمسارات التعليمية المعروضة على الموقع العام." : "Manage curricula tracks displayed publicly."}
              </p>
            </div>

            <button
              onClick={handleOpenNewCurriculum}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{isRTL ? "إضافة مسار جديد" : "Add Track"}</span>
            </button>
          </div>

          {/* Curricula Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {curriculaList.map(curr => (
              <div
                key={curr.id}
                className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between hover:border-purple-300 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-800">
                      {curr.gradeLabelAr}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {curr.country} • {curr.stage}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mb-1.5">{curr.titleAr}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">
                    {curr.descriptionAr}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
                  <span className={`text-[10px] font-bold ${curr.featuredOnHome ? "text-emerald-700" : "text-slate-400"}`}>
                    {curr.featuredOnHome ? (isRTL ? "★ مميز بالرئيسية" : "★ Featured") : (isRTL ? "مخفي من الرئيسية" : "Standard")}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditingCurriculum({ ...curr });
                        setIsCurriculumModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCurriculumItem(curr.id)}
                      className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: FAQ MANAGEMENT */}
      {activeTab === "faq" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">
                {isRTL ? "إدارة الأسئلة الشائعة (FAQ Management)" : "Frequently Asked Questions CMS"}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isRTL ? "تغذية قسم الأسئلة الشائعة بالموقع العام بإجابات وافية لتسهيل انضمام أولياء الأمور والطلاب." : "Manage FAQ questions and answers."}
              </p>
            </div>

            <button
              onClick={handleOpenNewFaq}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{isRTL ? "إضافة سؤال جديد" : "Add FAQ"}</span>
            </button>
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {faqList.map((faq, idx) => (
              <div
                key={faq.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 font-black text-xs flex items-center justify-center shrink-0">
                    Q{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1">{faq.questionAr}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{faq.answerAr}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-200/60 text-slate-700 uppercase">
                      {faq.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setEditingFaq({ ...faq });
                      setIsFaqModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteFaqItem(faq.id)}
                    className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: VISIBILITY & SECTION TOGGLES */}
      {activeTab === "visibility" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900">
              {isRTL ? "التحكم في ظهور الأقسام بالصفحة الرئيسية (Visibility Switches)" : "Homepage Section Visibility Toggles"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isRTL ? "أزرار تحكم سريعة لإظهار أو إخفاء أي قسم في الموقع العام دون التأثير على التصميم الأساسي." : "Toggle on/off any section on the public homepage."}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { key: "showAnnouncementBanner" as keyof CmsSectionVisibility, labelAr: "شريط الإعلانات العلوي", labelEn: "Top Announcement Banner" },
              { key: "showHero" as keyof CmsSectionVisibility, labelAr: "القسم الترحيبي الرئيسي (Hero)", labelEn: "Hero Banner" },
              { key: "showPillars" as keyof CmsSectionVisibility, labelAr: "ركائز التميز المؤسسي", labelEn: "Core Foundations" },
              { key: "showFeaturedCurricula" as keyof CmsSectionVisibility, labelAr: "المناهج والمسارات التعليمية", labelEn: "Featured Curricula Track" },
              { key: "showWhyGoStars" as keyof CmsSectionVisibility, labelAr: "معايير الجودة والمنهجية", labelEn: "Why Choose GoStars" },
              { key: "showHonorStars" as keyof CmsSectionVisibility, labelAr: "لوحة الشرف والنجوم المتفوقين", labelEn: "Honor Stars Spotlight" },
              { key: "showStats" as keyof CmsSectionVisibility, labelAr: "الإحصائيات والأرقام القياسية", labelEn: "Impact & Statistics" },
              { key: "showFaq" as keyof CmsSectionVisibility, labelAr: "قسم الأسئلة الشائعة (FAQ)", labelEn: "Interactive FAQ Section" },
              { key: "showBottomCta" as keyof CmsSectionVisibility, labelAr: "البنر الختامي للتسجيل والتواصل", labelEn: "Bottom CTA Banner" }
            ].map(sec => {
              const isShown = visibilityForm[sec.key];

              return (
                <div
                  key={sec.key}
                  onClick={() => setVisibilityForm({ ...visibilityForm, [sec.key]: !isShown })}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    isShown
                      ? "bg-purple-50/60 border-purple-200 text-purple-900"
                      : "bg-slate-50 border-slate-200 text-slate-500 opacity-60"
                  }`}
                >
                  <div>
                    <span className="font-bold text-xs block">{isRTL ? sec.labelAr : sec.labelEn}</span>
                    <span className="text-[10px] text-slate-400">{isShown ? (isRTL ? "مُفعّل (ظاهر)" : "Visible") : (isRTL ? "مُعطّل (مخفي)" : "Hidden")}</span>
                  </div>

                  <input
                    type="checkbox"
                    checked={isShown}
                    onChange={() => {}} // handled by parent div onClick
                    className="w-4 h-4 rounded text-purple-600 focus:ring-0"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 6: ABOUT & CONTACT INFO */}
      {activeTab === "about_contact" && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900">
              {isRTL ? "بيانات التواصل ورسالة الأكاديمية (About & Contact)" : "About Academy & Official Contact Details"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isRTL ? "تحديث أرقام الواتساب وساعات العمل والرسالة والرؤية المؤسسية." : "Update phone, WhatsApp, office hours, and mission statements."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Details */}
            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-800 block pb-2 border-b border-slate-200">
                {isRTL ? "بيانات وقنوات التواصل الرسمية:" : "Official Contact Channels:"}
              </span>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">رقم الواتساب الرسمي (WhatsApp):</label>
                <input
                  type="text"
                  value={contactForm.whatsappNumber}
                  onChange={e => setContactForm({ ...contactForm, whatsappNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">البريد الإلكتروني الرسمي:</label>
                <input
                  type="email"
                  value={contactForm.supportEmail}
                  onChange={e => setContactForm({ ...contactForm, supportEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">أوقات العمل والمتابعة:</label>
                <input
                  type="text"
                  value={contactForm.officeHoursAr}
                  onChange={e => setContactForm({ ...contactForm, officeHoursAr: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">العنوان الجغرافي / التغطية الدولية:</label>
                <input
                  type="text"
                  value={contactForm.addressAr}
                  onChange={e => setContactForm({ ...contactForm, addressAr: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            {/* Mission & Vision */}
            <div className="space-y-3 bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-800 block pb-2 border-b border-slate-200">
                {isRTL ? "الرسالة والرؤية وقصة التأسيس:" : "Mission, Vision & Story:"}
              </span>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">قصة التأسيس (Story):</label>
                <textarea
                  rows={2}
                  value={aboutForm.storyContentAr}
                  onChange={e => setAboutForm({ ...aboutForm, storyContentAr: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">رسالة الأكاديمية (Mission):</label>
                <textarea
                  rows={2}
                  value={aboutForm.missionContentAr}
                  onChange={e => setAboutForm({ ...aboutForm, missionContentAr: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">رؤية الأكاديمية (Vision):</label>
                <textarea
                  rows={2}
                  value={aboutForm.visionContentAr}
                  onChange={e => setAboutForm({ ...aboutForm, visionContentAr: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CURRICULUM EDIT/ADD MODAL */}
      {isCurriculumModalOpen && editingCurriculum && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-black text-slate-900">
                {isRTL ? "إعداد المسار التعليمي" : "Curriculum Track Setup"}
              </h3>
              <button
                onClick={() => setIsCurriculumModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">الدولة / المنهج:</label>
                  <select
                    value={editingCurriculum.country}
                    onChange={e => setEditingCurriculum({ ...editingCurriculum, country: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="saudi">المنهج السعودي</option>
                    <option value="egypt">المنهج المصري</option>
                    <option value="uae">المنهج الإماراتي</option>
                    <option value="kuwait">المنهج الكويتي</option>
                    <option value="azhar">المنهج الأزهري</option>
                    <option value="international">المنهج الدولي</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">المرحلة الدراسية:</label>
                  <select
                    value={editingCurriculum.stage}
                    onChange={e => setEditingCurriculum({ ...editingCurriculum, stage: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="foundation">التأسيس ورياض الأطفال</option>
                    <option value="primary">المرحلة الابتدائية</option>
                    <option value="middle">المرحلة الإعدادية / المتوسطة</option>
                    <option value="secondary">المرحلة الثانوية</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">عنوان المسار (بالعربية):</label>
                <input
                  type="text"
                  value={editingCurriculum.titleAr}
                  onChange={e => setEditingCurriculum({ ...editingCurriculum, titleAr: e.target.value })}
                  placeholder="مثال: مسار التميز القرآني والتجويد"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">الوصف التفصيلي للمسار:</label>
                <textarea
                  rows={3}
                  value={editingCurriculum.descriptionAr}
                  onChange={e => setEditingCurriculum({ ...editingCurriculum, descriptionAr: e.target.value })}
                  placeholder="شرح ما سيتعلمه الطالب في هذا المسار..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCurriculum.featuredOnHome}
                    onChange={e => setEditingCurriculum({ ...editingCurriculum, featuredOnHome: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-600"
                  />
                  <span className="font-bold text-slate-700">عرض كمسار مميز بالصفحة الرئيسية</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
              <button
                onClick={() => setIsCurriculumModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveCurriculumItem}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
              >
                حفظ المسار
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ EDIT/ADD MODAL */}
      {isFaqModalOpen && editingFaq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-black text-slate-900">
                {isRTL ? "إعداد السؤال الشائع" : "FAQ Item Setup"}
              </h3>
              <button
                onClick={() => setIsFaqModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">التصنيف:</label>
                <select
                  value={editingFaq.category}
                  onChange={e => setEditingFaq({ ...editingFaq, category: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="general">عام (General)</option>
                  <option value="curricula">المناهج والبرامج</option>
                  <option value="pricing">الأسعار وطرق الدفع</option>
                  <option value="sessions">الحصص والمواعيد</option>
                  <option value="teachers">المعلمون</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">نص السؤال (العربية):</label>
                <input
                  type="text"
                  value={editingFaq.questionAr}
                  onChange={e => setEditingFaq({ ...editingFaq, questionAr: e.target.value })}
                  placeholder="مثال: كيف يتم تحديد مستوى الطالب؟"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">نص الإجابة (العربية):</label>
                <textarea
                  rows={3}
                  value={editingFaq.answerAr}
                  onChange={e => setEditingFaq({ ...editingFaq, answerAr: e.target.value })}
                  placeholder="شرح الإجابة بالتفصيل..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
              <button
                onClick={() => setIsFaqModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveFaqItem}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
              >
                حفظ السؤال
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
