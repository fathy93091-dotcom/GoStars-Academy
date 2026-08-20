import React, { useState, useRef } from "react";
import {
  SiteContentSettings,
  CmsHeroSettings,
  CmsAnnouncementBanner,
  CmsSectionVisibility,
  CmsAboutSettings,
  CmsContactSettings,
  CmsBrandingSettings,
  CmsPageImages,
  CmsGalleryItem
} from "../../../types";
import { useLanguage } from "../../../i18n/LanguageContext";
import { useAuth } from "../../../lib/AuthContext";
import { AppRoute, PUBLIC_NAV_ITEMS } from "../../../navigation/routes";
import { HomePage } from "../../pages/HomePage";
import { AboutPage } from "../../pages/AboutPage";
import { CurriculaPage } from "../../pages/CurriculaPage";
import { PricingPage } from "../../pages/PricingPage";
import { TeachersPage } from "../../pages/TeachersPage";
import { HonorRollPage } from "../../pages/HonorRollPage";
import { ContactPage } from "../../pages/ContactPage";
import { Header } from "../../layout/Header";
import { Footer } from "../../layout/Footer";
import { AnnouncementBanner } from "../../layout/AnnouncementBanner";
import { Logo } from "../../shared/Logo";
import {
  Monitor,
  Tablet,
  Smartphone,
  Sparkles,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Type,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Upload,
  Globe,
  Layers,
  ArrowRight,
  ArrowLeft,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Palette,
  Phone,
  Mail,
  MapPin,
  Clock,
  BookOpen,
  HelpCircle,
  FileText,
  Compass,
  Zap,
  Edit3
} from "lucide-react";

interface AdminLiveVisualEditorProps {
  content: SiteContentSettings;
  onSaveContent: (updated: SiteContentSettings) => Promise<void>;
  onResetContent: () => Promise<void>;
  onExit?: () => void;
}

type ViewportSize = "desktop" | "tablet" | "mobile";
type ActiveEditorPanel = "branding" | "images" | "texts" | "visibility" | "curricula_faq";

const CURATED_IMAGE_PRESETS = [
  {
    titleAr: "حلقات القرآن الكريم وتلاوته",
    titleEn: "Quran Recitation Circle",
    url: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80",
    category: "quran"
  },
  {
    titleAr: "تعليم اللغة العربية والنورانية",
    titleEn: "Arabic & Nooraniyah",
    url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
    category: "arabic"
  },
  {
    titleAr: "فصل دراسي وتفاعل مباشر",
    titleEn: "Classroom & Live Interaction",
    url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80",
    category: "classroom"
  },
  {
    titleAr: "مكتبة وكتب أكاديمية",
    titleEn: "Academic Library & Books",
    url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80",
    category: "books"
  },
  {
    titleAr: "تفوق دراسي وتكريم الطلاب",
    titleEn: "Academic Excellence & Graduation",
    url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    category: "excellence"
  },
  {
    titleAr: "معلم ومتابعة فردية",
    titleEn: "Dedicated Tutor & Mentoring",
    url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    category: "teacher"
  }
];

export const AdminLiveVisualEditor: React.FC<AdminLiveVisualEditorProps> = ({
  content,
  onSaveContent,
  onResetContent,
  onExit
}) => {
  const { isRTL, lang, setLanguage } = useLanguage();
  const { profile, user } = useAuth();

  // View & Simulation States
  const [activePreviewPage, setActivePreviewPage] = useState<AppRoute>("home");
  const [viewport, setViewport] = useState<ViewportSize>("desktop");
  const [activePanel, setActivePanel] = useState<ActiveEditorPanel>("branding");
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [highlightMode, setHighlightMode] = useState(false);

  // Status indicators
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Local Editable States
  const [brandingForm, setBrandingForm] = useState<CmsBrandingSettings>({
    academyNameAr: content.branding?.academyNameAr || "أكاديمية GoStars",
    academyNameEn: content.branding?.academyNameEn || "GoStars Academy",
    academySloganAr: content.branding?.academySloganAr || "تعليم متميز ومبسط.. وتفوق مستمر لأبنائكم",
    academySloganEn: content.branding?.academySloganEn || "Excellence in Quranic & Academic Education",
    logoUrl: content.branding?.logoUrl || "",
    logoStyle: content.branding?.logoStyle || "default_crest"
  });

  const [imagesForm, setImagesForm] = useState<CmsPageImages>({
    heroBannerImage: content.images?.heroBannerImage || "",
    aboutStoryImage: content.images?.aboutStoryImage || "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80",
    aboutMissionImage: content.images?.aboutMissionImage || "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80",
    curriculaHeaderImage: content.images?.curriculaHeaderImage || "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80",
    honorRollHeroImage: content.images?.honorRollHeroImage || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80",
    contactHeaderImage: content.images?.contactHeaderImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80",
    gallery: content.images?.gallery || []
  });

  const [heroForm, setHeroForm] = useState<CmsHeroSettings>({ ...content.hero });
  const [bannerForm, setBannerForm] = useState<CmsAnnouncementBanner>({ ...content.announcementBanner });
  const [visibilityForm, setVisibilityForm] = useState<CmsSectionVisibility>({ ...content.visibility });
  const [aboutForm, setAboutForm] = useState<CmsAboutSettings>({ ...content.about });
  const [contactForm, setContactForm] = useState<CmsContactSettings>({ ...content.contact });

  // File Upload Ref
  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const storyImageInputRef = useRef<HTMLInputElement>(null);
  const missionImageInputRef = useRef<HTMLInputElement>(null);
  const galleryImageInputRef = useRef<HTMLInputElement>(null);

  // Mark changes
  const markDirty = () => setHasUnsavedChanges(true);

  // Save to Cloud
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const updatedSettings: SiteContentSettings = {
        ...content,
        branding: brandingForm,
        images: imagesForm,
        hero: heroForm,
        announcementBanner: bannerForm,
        visibility: visibilityForm,
        about: aboutForm,
        contact: contactForm,
        updatedAt: new Date().toISOString(),
        updatedBy: profile?.name || user?.displayName || "Admin"
      };

      await onSaveContent(updatedSettings);
      setHasUnsavedChanges(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save CMS modifications:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Helper for reading base64 file upload
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onLoaded: (base64Url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2.5 * 1024 * 1024) {
      alert(isRTL ? "يرجى اختيار صورة بحجم أقل من 2.5 ميجابايت لضمان سرعة التحميل." : "Please choose an image smaller than 2.5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onLoaded(reader.result);
        markDirty();
      }
    };
    reader.readAsDataURL(file);
  };

  // Gallery Add Handler
  const handleAddGalleryItem = (url: string, titleAr: string, titleEn: string) => {
    const newItem: CmsGalleryItem = {
      id: `gal_${Date.now()}`,
      url,
      titleAr: titleAr || "صورة من أنشطة الأكاديمية",
      titleEn: titleEn || "Academy Activities",
      category: "general"
    };
    setImagesForm(prev => ({
      ...prev,
      gallery: [...(prev.gallery || []), newItem]
    }));
    markDirty();
  };

  const handleRemoveGalleryItem = (id: string) => {
    setImagesForm(prev => ({
      ...prev,
      gallery: (prev.gallery || []).filter(g => g.id !== id)
    }));
    markDirty();
  };

  // Viewport Container Dimensions
  const viewportStyles: Record<ViewportSize, string> = {
    desktop: "w-full",
    tablet: "max-w-[768px] shadow-2xl rounded-3xl border-8 border-slate-800 my-4 overflow-hidden",
    mobile: "max-w-[390px] shadow-2xl rounded-3xl border-8 border-slate-900 my-4 overflow-hidden"
  };

  // Render current simulated preview page
  const renderSimulatedPage = () => {
    switch (activePreviewPage) {
      case "home":
        return <HomePage onNavigate={setActivePreviewPage} />;
      case "about":
        return <AboutPage onNavigate={setActivePreviewPage} />;
      case "curricula":
        return <CurriculaPage onNavigate={setActivePreviewPage} />;
      case "pricing":
        return <PricingPage onNavigate={setActivePreviewPage} />;
      case "teachers":
        return <TeachersPage onNavigate={setActivePreviewPage} />;
      case "honor-roll":
        return <HonorRollPage onNavigate={setActivePreviewPage} />;
      case "contact":
        return <ContactPage onNavigate={setActivePreviewPage} />;
      default:
        return <HomePage onNavigate={setActivePreviewPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans" dir={isRTL ? "rtl" : "ltr"}>
      {/* 1. TOP LIVE BUILDER TOOLBAR */}
      <header className="bg-slate-950/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg">
        {/* Left: Brand / Title */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-black shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">
                {isRTL ? "محرر الموقع المباشر (Visual Live Site Builder)" : "Live Visual Site Editor"}
              </span>
              {hasUnsavedChanges && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                  {isRTL ? "تعديلات غير محفوظة" : "Unsaved changes"}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              {isRTL ? "عدّل الشعار، الأسماء، الصور، والنصوص وعاينها لحظياً" : "Modify branding, logo, images & copy in real-time"}
            </p>
          </div>
        </div>

        {/* Center: Device Viewport & Page Navigation */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Viewport Toggles */}
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setViewport("desktop")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                viewport === "desktop" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
              title={isRTL ? "عرض شاشة سطح المكتب" : "Desktop View"}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport("tablet")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                viewport === "tablet" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
              title={isRTL ? "عرض الجهاز اللوحي" : "Tablet View"}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport("mobile")}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                viewport === "mobile" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
              title={isRTL ? "عرض الهاتف المحمول" : "Mobile View"}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Page Selector Tabs */}
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-800 flex items-center gap-1 overflow-x-auto max-w-xl no-scrollbar">
            {[
              { id: "home" as AppRoute, labelAr: "الرئيسية", labelEn: "Home" },
              { id: "about" as AppRoute, labelAr: "عن الأكاديمية", labelEn: "About" },
              { id: "curricula" as AppRoute, labelAr: "المناهج", labelEn: "Curricula" },
              { id: "pricing" as AppRoute, labelAr: "الأسعار", labelEn: "Pricing" },
              { id: "teachers" as AppRoute, labelAr: "المعلمون", labelEn: "Teachers" },
              { id: "honor-roll" as AppRoute, labelAr: "لوحة الشرف", labelEn: "Honor Roll" },
              { id: "contact" as AppRoute, labelAr: "التواصل", labelEn: "Contact" }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setActivePreviewPage(p.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  activePreviewPage === p.id
                    ? "bg-slate-800 text-amber-300 shadow-xs border border-slate-700"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {isRTL ? p.labelAr : p.labelEn}
              </button>
            ))}
          </div>

          {/* Language Toggle for Testing */}
          <button
            onClick={() => setLanguage(lang === "ar" ? "en" : "ar")}
            className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5"
            title={isRTL ? "تبديل لغة المعاينة" : "Switch Preview Language"}
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span>{lang === "ar" ? "🇬🇧 English" : "🇸🇦 عربي"}</span>
          </button>
        </div>

        {/* Right: Publish, Save & Exit Actions */}
        <div className="flex items-center gap-2">
          {/* Toggle Sidebar Button */}
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
              isPanelOpen
                ? "bg-blue-600/20 text-blue-400 border-blue-500/30"
                : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800"
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isPanelOpen ? (isRTL ? "إخفاء لوحة التعديل" : "Hide Controls") : (isRTL ? "إظهار لوحة التعديل" : "Show Controls")}
            </span>
          </button>

          {/* Save / Publish Button */}
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-md ${
              saveSuccess
                ? "bg-emerald-600 text-white"
                : hasUnsavedChanges
                ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black animate-pulse"
                : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{isRTL ? "جارٍ الحفظ للسحابة..." : "Saving..."}</span>
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>{isRTL ? "تم الحفظ بنجاح!" : "Published!"}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isRTL ? "حفظ ونشر التعديلات" : "Publish to Site"}</span>
              </>
            )}
          </button>

          {/* Exit / Return to Admin or Public Site */}
          {onExit && (
            <button
              onClick={onExit}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
              title={isRTL ? "إغلاق المحرر" : "Close Editor"}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* 2. MAIN SPLIT WORKSPACE */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT/RIGHT: SLIDE-OUT EDIT CONTROLS DRAWER */}
        {isPanelOpen && (
          <aside className="w-full sm:w-[420px] bg-slate-950 border-e border-slate-800 flex flex-col z-40 shrink-0 h-[calc(100vh-57px)] overflow-y-auto custom-scrollbar">
            {/* Control Tabs Header */}
            <div className="p-3 border-b border-slate-800 bg-slate-900/60 sticky top-0 z-20 backdrop-blur-md">
              <div className="grid grid-cols-4 gap-1">
                <button
                  onClick={() => setActivePanel("branding")}
                  className={`p-2 rounded-xl text-center flex flex-col items-center gap-1 transition ${
                    activePanel === "branding"
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[10px] font-bold">{isRTL ? "الشعار والهوية" : "Branding"}</span>
                </button>

                <button
                  onClick={() => setActivePanel("images")}
                  className={`p-2 rounded-xl text-center flex flex-col items-center gap-1 transition ${
                    activePanel === "images"
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-[10px] font-bold">{isRTL ? "الصور والوسائط" : "Images"}</span>
                </button>

                <button
                  onClick={() => setActivePanel("texts")}
                  className={`p-2 rounded-xl text-center flex flex-col items-center gap-1 transition ${
                    activePanel === "texts"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Type className="w-4 h-4" />
                  <span className="text-[10px] font-bold">{isRTL ? "نصوص الصفحات" : "Page Copy"}</span>
                </button>

                <button
                  onClick={() => setActivePanel("visibility")}
                  className={`p-2 rounded-xl text-center flex flex-col items-center gap-1 transition ${
                    activePanel === "visibility"
                      ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                  <span className="text-[10px] font-bold">{isRTL ? "ظهور الأقسام" : "Visibility"}</span>
                </button>
              </div>
            </div>

            {/* TAB 1: BRANDING & LOGO STUDIO */}
            {activePanel === "branding" && (
              <div className="p-4 flex flex-col gap-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>{isRTL ? "استوديو الشعار وهوية الأكاديمية" : "Branding & Logo Studio"}</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isRTL ? "تغيير اسم الأكاديمية، الشعار، والاسلوجن" : "Customize academy name, logo, & slogan"}
                    </p>
                  </div>
                </div>

                {/* Academy Name in Ar / En */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-bold text-slate-300">
                    {isRTL ? "اسم الأكاديمية (عربي / English)" : "Academy Name (Arabic / English)"}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={brandingForm.academyNameAr}
                      onChange={e => {
                        setBrandingForm(prev => ({ ...prev, academyNameAr: e.target.value }));
                        markDirty();
                      }}
                      placeholder="أكاديمية GoStars"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="text"
                      value={brandingForm.academyNameEn}
                      onChange={e => {
                        setBrandingForm(prev => ({ ...prev, academyNameEn: e.target.value }));
                        markDirty();
                      }}
                      placeholder="GoStars Academy"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Academy Slogan in Ar / En */}
                <div className="flex flex-col gap-3">
                  <label className="text-xs font-bold text-slate-300">
                    {isRTL ? "الشعار اللفظي / الاسلوجن (Slogan)" : "Academy Slogan / Tagline"}
                  </label>
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={brandingForm.academySloganAr}
                      onChange={e => {
                        setBrandingForm(prev => ({ ...prev, academySloganAr: e.target.value }));
                        markDirty();
                      }}
                      placeholder="تعليم متميز ومبسط.. وتفوق مستمر لأبنائكم"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="text"
                      value={brandingForm.academySloganEn}
                      onChange={e => {
                        setBrandingForm(prev => ({ ...prev, academySloganEn: e.target.value }));
                        markDirty();
                      }}
                      placeholder="Excellence in Quranic & Academic Education"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Academy Logo Style & Custom Logo Upload */}
                <div className="flex flex-col gap-3 pt-4 border-t border-slate-800">
                  <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>{isRTL ? "شعار الأكاديمية (Logo)" : "Academy Logo"}</span>
                    {brandingForm.logoUrl && (
                      <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        {isRTL ? "شعار مخصص نشط" : "Custom Logo Active"}
                      </span>
                    )}
                  </label>

                  {/* Logo Live Preview */}
                  <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-slate-950 p-2 border border-slate-700 flex items-center justify-center shrink-0">
                        {brandingForm.logoUrl ? (
                          <img
                            src={brandingForm.logoUrl}
                            alt="Logo preview"
                            className="w-full h-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <Logo size="md" variant="light" showSlogan={false} />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          {brandingForm.academyNameAr || "GoStars"}
                        </div>
                        <div className="text-[11px] text-amber-400 max-w-[180px] truncate">
                          {brandingForm.academySloganAr || "Slogan"}
                        </div>
                      </div>
                    </div>

                    {brandingForm.logoUrl && (
                      <button
                        onClick={() => {
                          setBrandingForm(prev => ({ ...prev, logoUrl: "" }));
                          markDirty();
                        }}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs transition"
                        title={isRTL ? "حذف الشعار المخصص واستعادة الشعار الأصلي" : "Remove custom logo"}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Upload Custom Logo Button */}
                  <div className="grid grid-cols-1 gap-2">
                    <input
                      type="file"
                      ref={logoInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={e =>
                        handleFileUpload(e, base64Url => {
                          setBrandingForm(prev => ({ ...prev, logoUrl: base64Url }));
                        })
                      }
                    />
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{isRTL ? "رفع شعار جديد من الجهاز (PNG / SVG / JPG)" : "Upload Custom Logo File"}</span>
                    </button>
                  </div>

                  {/* Preset Vector Badge Styles */}
                  <div className="flex flex-col gap-2 pt-2">
                    <span className="text-[11px] font-semibold text-slate-400">
                      {isRTL ? "أو اختر نمط الشعار الرسمي الافتراضي:" : "Or select an official crest style:"}
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => {
                          setBrandingForm(prev => ({ ...prev, logoStyle: "default_crest", logoUrl: "" }));
                          markDirty();
                        }}
                        className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1.5 transition ${
                          brandingForm.logoStyle === "default_crest" && !brandingForm.logoUrl
                            ? "bg-amber-500/20 border-amber-400 text-amber-300"
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full bg-slate-950 flex items-center justify-center text-amber-400 font-bold text-xs">
                          ⭐
                        </div>
                        <span className="text-[10px] font-bold">{isRTL ? "نجمة ذهبية 8" : "Gold Crest"}</span>
                      </button>

                      <button
                        onClick={() => {
                          setBrandingForm(prev => ({ ...prev, logoStyle: "golden_book", logoUrl: "" }));
                          markDirty();
                        }}
                        className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1.5 transition ${
                          brandingForm.logoStyle === "golden_book" && !brandingForm.logoUrl
                            ? "bg-amber-500/20 border-amber-400 text-amber-300"
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full bg-slate-950 flex items-center justify-center text-amber-400 font-bold text-xs">
                          📖
                        </div>
                        <span className="text-[10px] font-bold">{isRTL ? "مصحف ومعرفة" : "Book Crest"}</span>
                      </button>

                      <button
                        onClick={() => {
                          setBrandingForm(prev => ({ ...prev, logoStyle: "modern_star", logoUrl: "" }));
                          markDirty();
                        }}
                        className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1.5 transition ${
                          brandingForm.logoStyle === "modern_star" && !brandingForm.logoUrl
                            ? "bg-amber-500/20 border-amber-400 text-amber-300"
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full bg-slate-950 flex items-center justify-center text-amber-400 font-bold text-xs">
                          🌟
                        </div>
                        <span className="text-[10px] font-bold">{isRTL ? "نجم حديث" : "Modern Star"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: IMAGES & MEDIA STUDIO */}
            {activePanel === "images" && (
              <div className="p-4 flex flex-col gap-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-blue-400" />
                      <span>{isRTL ? "استوديو الصور والخلفيات والوسائط" : "Images & Media Studio"}</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isRTL ? "تغيير أو حذف أو إضافة صور لجميع صفحات الموقع" : "Manage hero banners, page illustrations & gallery"}
                    </p>
                  </div>
                </div>

                {/* 1. Hero Background Banner Image */}
                <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      {isRTL ? "صورة خلفية القسم الرئيسي (Hero Banner)" : "Hero Background Image"}
                    </span>
                    {imagesForm.heroBannerImage ? (
                      <button
                        onClick={() => {
                          setImagesForm(prev => ({ ...prev, heroBannerImage: "" }));
                          markDirty();
                        }}
                        className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{isRTL ? "حذف الصورة" : "Remove"}</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500">{isRTL ? "تدرج كحلي افتراضي" : "Default Gradient"}</span>
                    )}
                  </div>

                  {imagesForm.heroBannerImage && (
                    <div className="h-24 rounded-xl overflow-hidden border border-slate-700 relative">
                      <img
                        src={imagesForm.heroBannerImage}
                        alt="Hero preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      ref={heroImageInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={e =>
                        handleFileUpload(e, base64Url => {
                          setImagesForm(prev => ({ ...prev, heroBannerImage: base64Url }));
                        })
                      }
                    />
                    <button
                      onClick={() => heroImageInputRef.current?.click()}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isRTL ? "رفع صورة من جهازك" : "Upload Image"}</span>
                    </button>
                  </div>
                </div>

                {/* 2. About Page Story Image */}
                <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      {isRTL ? "صورة صفحة عن الأكاديمية (النشأة والمسيرة)" : "About Story Image"}
                    </span>
                    {imagesForm.aboutStoryImage && (
                      <button
                        onClick={() => {
                          setImagesForm(prev => ({ ...prev, aboutStoryImage: "" }));
                          markDirty();
                        }}
                        className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>{isRTL ? "حذف" : "Remove"}</span>
                      </button>
                    )}
                  </div>

                  {imagesForm.aboutStoryImage && (
                    <div className="h-24 rounded-xl overflow-hidden border border-slate-700 relative">
                      <img
                        src={imagesForm.aboutStoryImage}
                        alt="Story preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}

                  <input
                    type="file"
                    ref={storyImageInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={e =>
                      handleFileUpload(e, base64Url => {
                        setImagesForm(prev => ({ ...prev, aboutStoryImage: base64Url }));
                      })
                    }
                  />
                  <button
                    onClick={() => storyImageInputRef.current?.click()}
                    className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isRTL ? "تغيير صورة القصة والمسيرة" : "Upload Story Image"}</span>
                  </button>
                </div>

                {/* 3. Preset Academy Gallery Library (1-Click Apply) */}
                <div className="flex flex-col gap-3 pt-3 border-t border-slate-800">
                  <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>{isRTL ? "مكتبة الصور الجاهزة للاختيار السريع" : "Curated Preset Library"}</span>
                    <span className="text-[10px] text-blue-400">{isRTL ? "انقر للتعيين" : "Click to apply"}</span>
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    {CURATED_IMAGE_PRESETS.map((preset, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-blue-500 transition group flex flex-col"
                      >
                        <div className="h-18 relative">
                          <img
                            src={preset.url}
                            alt={preset.titleAr}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="p-2 flex flex-col gap-1.5">
                          <span className="text-[10px] font-bold text-white line-clamp-1">
                            {isRTL ? preset.titleAr : preset.titleEn}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setImagesForm(prev => ({ ...prev, heroBannerImage: preset.url }));
                                markDirty();
                              }}
                              className="flex-1 py-1 rounded bg-blue-600/30 hover:bg-blue-600 text-blue-200 hover:text-white text-[9px] font-bold transition"
                            >
                              {isRTL ? "للرئيسية" : "Hero"}
                            </button>
                            <button
                              onClick={() => {
                                setImagesForm(prev => ({ ...prev, aboutStoryImage: preset.url }));
                                markDirty();
                              }}
                              className="flex-1 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[9px] font-bold transition"
                            >
                              {isRTL ? "لعنّا" : "About"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Academy Media Gallery */}
                <div className="flex flex-col gap-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      {isRTL ? "معرض صور وفيديوهات الأنشطة (Gallery)" : "Media Gallery"}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {imagesForm.gallery?.length || 0} {isRTL ? "صور" : "images"}
                    </span>
                  </div>

                  <input
                    type="file"
                    ref={galleryImageInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={e =>
                      handleFileUpload(e, base64Url => {
                        handleAddGalleryItem(base64Url, "صورة نشاط تعليمي", "Academy Activity Photo");
                      })
                    }
                  />
                  <button
                    onClick={() => galleryImageInputRef.current?.click()}
                    className="py-2 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isRTL ? "إضافة صورة جديدة للمعرض" : "Add Image to Gallery"}</span>
                  </button>

                  <div className="grid grid-cols-3 gap-2">
                    {(imagesForm.gallery || []).map(item => (
                      <div key={item.id} className="relative rounded-xl overflow-hidden border border-slate-700 group h-20">
                        <img
                          src={item.url}
                          alt={item.titleAr}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <button
                          onClick={() => handleRemoveGalleryItem(item.id)}
                          className="absolute top-1 end-1 p-1 rounded-lg bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition shadow-md"
                          title={isRTL ? "حذف الصورة" : "Delete photo"}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PAGE COPY & DIRECT TEXT INSPECTOR */}
            {activePanel === "texts" && (
              <div className="p-4 flex flex-col gap-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Type className="w-4 h-4 text-emerald-400" />
                      <span>{isRTL ? "تعديل نصوص الصفحة الحالية" : "Page Text Editor"}</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isRTL ? `أنت تعدل حالياً نصوص: [${activePreviewPage}]` : `Editing page: [${activePreviewPage}]`}
                    </p>
                  </div>
                </div>

                {/* If Home Page is Selected */}
                {activePreviewPage === "home" && (
                  <div className="flex flex-col gap-4">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      {isRTL ? "القسم الرئيسي (Hero)" : "Hero Section Texts"}
                    </span>

                    {/* Badge */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">
                        {isRTL ? "الشارة العلوية (Badge)" : "Top Badge Text"}
                      </label>
                      <input
                        type="text"
                        value={heroForm.badgeAr}
                        onChange={e => {
                          setHeroForm(prev => ({ ...prev, badgeAr: e.target.value }));
                          markDirty();
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                        placeholder="أكاديمية تعليمية متخصصة..."
                      />
                    </div>

                    {/* Main Headline */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">
                        {isRTL ? "العنوان الرئيسي (Headline Ar)" : "Main Headline (Ar)"}
                      </label>
                      <textarea
                        rows={2}
                        value={heroForm.titleAr}
                        onChange={e => {
                          setHeroForm(prev => ({ ...prev, titleAr: e.target.value }));
                          markDirty();
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    {/* Subtitle */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">
                        {isRTL ? "النص التوضيحي (Subtitle Ar)" : "Subtitle Description"}
                      </label>
                      <textarea
                        rows={3}
                        value={heroForm.subtitleAr}
                        onChange={e => {
                          setHeroForm(prev => ({ ...prev, subtitleAr: e.target.value }));
                          markDirty();
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                      />
                    </div>

                    {/* Highlights */}
                    <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                      <label className="text-[11px] font-semibold text-slate-400">
                        {isRTL ? "النقاط البارزة الثلاث (Highlights)" : "Three Key Highlights"}
                      </label>
                      <input
                        type="text"
                        value={heroForm.highlight1Ar}
                        onChange={e => {
                          setHeroForm(prev => ({ ...prev, highlight1Ar: e.target.value }));
                          markDirty();
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                        placeholder="نقطة 1"
                      />
                      <input
                        type="text"
                        value={heroForm.highlight2Ar}
                        onChange={e => {
                          setHeroForm(prev => ({ ...prev, highlight2Ar: e.target.value }));
                          markDirty();
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                        placeholder="نقطة 2"
                      />
                      <input
                        type="text"
                        value={heroForm.highlight3Ar}
                        onChange={e => {
                          setHeroForm(prev => ({ ...prev, highlight3Ar: e.target.value }));
                          markDirty();
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                        placeholder="نقطة 3"
                      />
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                      <label className="text-[11px] font-semibold text-slate-400">
                        {isRTL ? "أزرار الحجز والتسجيل (CTA Buttons)" : "Call to Action Buttons"}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={heroForm.ctaPrimaryAr}
                          onChange={e => {
                            setHeroForm(prev => ({ ...prev, ctaPrimaryAr: e.target.value }));
                            markDirty();
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                          placeholder="الزر الرئيسي"
                        />
                        <input
                          type="text"
                          value={heroForm.ctaSecondaryAr}
                          onChange={e => {
                            setHeroForm(prev => ({ ...prev, ctaSecondaryAr: e.target.value }));
                            markDirty();
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                          placeholder="الزر الثانوي"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* If About Page is Selected */}
                {activePreviewPage === "about" && (
                  <div className="flex flex-col gap-4">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      {isRTL ? "قصة ورسالة الأكاديمية" : "About & Mission Texts"}
                    </span>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">
                        {isRTL ? "عنوان النشأة والمسيرة" : "Story Title"}
                      </label>
                      <input
                        type="text"
                        value={aboutForm.storyTitleAr}
                        onChange={e => {
                          setAboutForm(prev => ({ ...prev, storyTitleAr: e.target.value }));
                          markDirty();
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">
                        {isRTL ? "نص النشأة والمسيرة" : "Story Paragraph"}
                      </label>
                      <textarea
                        rows={4}
                        value={aboutForm.storyContentAr}
                        onChange={e => {
                          setAboutForm(prev => ({ ...prev, storyContentAr: e.target.value }));
                          markDirty();
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">
                        {isRTL ? "رسالة الأكاديمية (Mission)" : "Academy Mission"}
                      </label>
                      <textarea
                        rows={3}
                        value={aboutForm.missionContentAr}
                        onChange={e => {
                          setAboutForm(prev => ({ ...prev, missionContentAr: e.target.value }));
                          markDirty();
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">
                        {isRTL ? "رؤية الأكاديمية (Vision)" : "Academy Vision"}
                      </label>
                      <textarea
                        rows={3}
                        value={aboutForm.visionContentAr}
                        onChange={e => {
                          setAboutForm(prev => ({ ...prev, visionContentAr: e.target.value }));
                          markDirty();
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                )}

                {/* If Contact Page is Selected */}
                {activePreviewPage === "contact" && (
                  <div className="flex flex-col gap-4">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      {isRTL ? "معلومات التواصل والاتصال" : "Contact Coordinates"}
                    </span>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">
                        {isRTL ? "رقم الهاتف المباشر" : "Primary Phone"}
                      </label>
                      <input
                        type="text"
                        value={contactForm.primaryPhone}
                        onChange={e => {
                          setContactForm(prev => ({ ...prev, primaryPhone: e.target.value }));
                          markDirty();
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">
                        {isRTL ? "رقم الواتساب للتسجيل الفوري" : "WhatsApp Number"}
                      </label>
                      <input
                        type="text"
                        value={contactForm.whatsappNumber}
                        onChange={e => {
                          setContactForm(prev => ({ ...prev, whatsappNumber: e.target.value }));
                          markDirty();
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">
                        {isRTL ? "البريد الإلكتروني للدعم" : "Support Email"}
                      </label>
                      <input
                        type="text"
                        value={contactForm.supportEmail}
                        onChange={e => {
                          setContactForm(prev => ({ ...prev, supportEmail: e.target.value }));
                          markDirty();
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-semibold text-slate-400">
                        {isRTL ? "ساعات العمل والتواجد" : "Office Hours"}
                      </label>
                      <input
                        type="text"
                        value={contactForm.officeHoursAr}
                        onChange={e => {
                          setContactForm(prev => ({ ...prev, officeHoursAr: e.target.value }));
                          markDirty();
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                )}

                {/* Announcement Banner Global Edit */}
                <div className="flex flex-col gap-3 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">
                      {isRTL ? "شريط الإعلانات العلوي العام" : "Announcement Banner"}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bannerForm.isActive}
                        onChange={e => {
                          setBannerForm(prev => ({ ...prev, isActive: e.target.checked }));
                          markDirty();
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>

                  <input
                    type="text"
                    value={bannerForm.textAr}
                    onChange={e => {
                      setBannerForm(prev => ({ ...prev, textAr: e.target.value }));
                      markDirty();
                    }}
                    placeholder="نص الإعلان..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: SECTION VISIBILITY */}
            {activePanel === "visibility" && (
              <div className="p-4 flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-purple-400" />
                      <span>{isRTL ? "ظهور وإخفاء أقسام الموقع" : "Section Visibility"}</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isRTL ? "تحكم في إظهار أو إخفاء أي كتلة أو قسم بضغطة زر" : "Toggle sections on/off instantly"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {[
                    { key: "showHero" as keyof CmsSectionVisibility, labelAr: "قسم البداية الرئيسي (Hero Banner)", labelEn: "Hero Section" },
                    { key: "showAnnouncementBanner" as keyof CmsSectionVisibility, labelAr: "شريط الإعلانات العلوي", labelEn: "Announcement Banner" },
                    { key: "showPillars" as keyof CmsSectionVisibility, labelAr: "ركائز التميز الأربعة", labelEn: "Core Pillars" },
                    { key: "showFeaturedCurricula" as keyof CmsSectionVisibility, labelAr: "المناهج الدراسية المميزة", labelEn: "Featured Curricula" },
                    { key: "showWhyGoStars" as keyof CmsSectionVisibility, labelAr: "لماذا تختار GoStars؟", labelEn: "Why Choose Us" },
                    { key: "showHonorStars" as keyof CmsSectionVisibility, labelAr: "نجوم لوحة الشرف", labelEn: "Honor Roll Stars" },
                    { key: "showStats" as keyof CmsSectionVisibility, labelAr: "إحصائيات وإنجازات الأكاديمية", labelEn: "Stats & Metrics" },
                    { key: "showFaq" as keyof CmsSectionVisibility, labelAr: "الأسئلة الشائعة (FAQ)", labelEn: "FAQ Section" },
                    { key: "showBottomCta" as keyof CmsSectionVisibility, labelAr: "شريط الدعوة للتسجيل النهائي", labelEn: "Bottom CTA Banner" }
                  ].map(sec => {
                    const isShown = visibilityForm[sec.key];
                    return (
                      <div
                        key={sec.key}
                        className={`p-3 rounded-xl border flex items-center justify-between transition ${
                          isShown ? "bg-slate-900/80 border-slate-700" : "bg-slate-950 border-slate-800 opacity-60"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {isShown ? (
                            <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-slate-500 shrink-0" />
                          )}
                          <span className="text-xs font-bold text-slate-200">
                            {isRTL ? sec.labelAr : sec.labelEn}
                          </span>
                        </div>

                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isShown}
                            onChange={e => {
                              setVisibilityForm(prev => ({ ...prev, [sec.key]: e.target.checked }));
                              markDirty();
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>
        )}

        {/* RIGHT/LEFT: LIVE REACTIVE PREVIEW CANVAS */}
        <main className="flex-1 bg-slate-950 flex flex-col items-center overflow-y-auto custom-scrollbar p-0 sm:p-4">
          <div
            className={`transition-all duration-300 bg-white min-h-[85vh] shadow-xl ${viewportStyles[viewport]}`}
          >
            {/* Live Interactive Navigation Header */}
            {bannerForm.isActive && visibilityForm.showAnnouncementBanner && (
              <AnnouncementBanner onNavigate={setActivePreviewPage} />
            )}
            <Header currentRoute={activePreviewPage} onNavigate={setActivePreviewPage} />

            {/* Live Page Body */}
            <div className="min-h-[60vh] relative">
              {renderSimulatedPage()}
            </div>

            {/* Live Footer */}
            <Footer onNavigate={setActivePreviewPage} />
          </div>
        </main>
      </div>
    </div>
  );
};
