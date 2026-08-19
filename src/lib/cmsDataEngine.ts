import {
  SiteContentSettings,
  CmsHeroSettings,
  CmsAnnouncementBanner,
  CmsSectionVisibility,
  CmsFaqItem,
  CmsCurriculumItem,
  CmsAboutSettings,
  CmsContactSettings
} from "../types";
import { db, cleanPayloadForFirestore } from "./firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

const CMS_STORAGE_KEY = "gostars_site_content_v1";

export const DEFAULT_CMS_CONTENT: SiteContentSettings = {
  id: "main_config",
  hero: {
    badgeAr: "أكاديمية تعليمية متخصصة للقرآن واللغة العربية والمناهج",
    badgeEn: "Premier Educational Academy for Quran & Arabic",
    titleAr: "تعليم متميز ومبسط.. وتفوق مستمر لأبنائكم",
    titleEn: "Excellence in Quranic & Academic Education with Heritage and Innovation",
    subtitleAr:
      "حصص فردية ومجموعات صغيرة للمناهج المصرية والسعودية والإماراتية والكويتية والأزهرية والدولية مع أفضل المعلمين والمعلمات.",
    subtitleEn:
      "Offering personalized and group educational programs for Egyptian, Saudi, UAE, Kuwaiti, Azhar, and International curricula led by certified expert educators.",
    highlight1Ar: "معلمون متخصصون وذوو خبرة",
    highlight1En: "Certified Expert Native Tutors",
    highlight2Ar: "تقارير متابعة دورية لولي الأمر",
    highlight2En: "Periodic Certified Progress Reports",
    highlight3Ar: "مواعيد مرنة تناسب جميع الدول",
    highlight3En: "Flexible Schedules Across Timezones",
    ctaPrimaryAr: "سجل الآن وتواصل معنا",
    ctaPrimaryEn: "Enroll Now & Contact Us",
    ctaSecondaryAr: "استعرض المناهج الدراسية",
    ctaSecondaryEn: "Explore Educational Tracks"
  },
  announcementBanner: {
    isActive: true,
    type: "gold",
    badgeAr: "تسجيل جديد",
    badgeEn: "New Term",
    textAr: "✨ تم فتح باب التسجيل للفصل الدراسي الجديد لجميع المناهج مع خصم خاص للمجموعات والإخوة!",
    textEn: "✨ Registration is now open for the new semester across all curricula with special group discounts!",
    linkRoute: "contact",
    linkTextAr: "احجز حصتك الآن",
    linkTextEn: "Book Your Slot Now",
    isDismissable: true
  },
  visibility: {
    showAnnouncementBanner: true,
    showHero: true,
    showPillars: true,
    showFeaturedCurricula: true,
    showWhyGoStars: true,
    showHonorStars: true,
    showStats: true,
    showFaq: true,
    showBottomCta: true
  },
  about: {
    storyTitleAr: "عن أكاديمية GoStars",
    storyTitleEn: "The Journey of GoStars Academy",
    storyContentAr:
      "تأسست أكاديمية GoStars لتقديم تجربة تعليمية ممتعة وسهلة في القرآن الكريم، واللغة العربية، والمناهج المدرسية عبر الإنترنت. نحرص على مساعدة كل طالب وتطوير مستواه خطوة بخطوة بالصبر والتشجيع المستمر.",
    storyContentEn:
      "GoStars Academy was founded to bridge authentic Quranic and linguistic mastery with cutting-edge interactive online learning. We believe every student deserves a tailored educational journey that fosters character and academic excellence.",
    missionTitleAr: "رسالتنا",
    missionTitleEn: "Our Mission",
    missionContentAr:
      "توفير تعليم مبسط وعالي الجودة في القرآن الكريم واللغة العربية والمواد الدراسية لجميع الطلاب وأبناء الجاليات في كل مكان مع إشراف ومتابعة دائمة.",
    missionContentEn:
      "Delivering accessible, world-class education in Holy Quran, Arabic, and academic disciplines for Arab communities and expatriate families worldwide through modern tools and dedicated supervision.",
    visionTitleAr: "رؤيتنا",
    visionTitleEn: "Our Vision",
    visionContentAr:
      "أن نكون الأكاديمية المفضلة والموثوقة لكل أسرة تبحث عن تعليم قرآني ودراسي متميز لأبنائها بأسلوب ميسر ومحبب.",
    visionContentEn:
      "To be the premier, globally trusted platform cultivating a Quranic generation confident in their language, proud of their heritage, and excelling academically."
  },
  contact: {
    primaryPhone: "+20 100 123 4567",
    whatsappNumber: "+20 100 123 4567",
    supportEmail: "info@gostars-academy.com",
    officeHoursAr: "يومياً من 9:00 صباحاً حتى 11:00 مساءً بتوقيت مكة المكرمة",
    officeHoursEn: "Daily from 9:00 AM to 11:00 PM (Makkah Time)",
    telegramLink: "https://t.me/gostars_academy",
    addressAr: "القاهرة، جمهورية مصر العربية (متاحون لجميع الطلاب في جميع الدول عبر الإنترنت)",
    addressEn: "Cairo, Egypt (Serving international students worldwide online)"
  },
  faqList: [
    {
      id: "faq_1",
      questionAr: "كيف يتم تحديد مستوى الطالب قبل بدء الدروس؟",
      questionEn: "How is the student level assessed before starting?",
      answerAr:
        "يتم إجراء جلسة قصيرة ومجانية عبر الإنترنت مع المعلم لمعرفة مستوى الطالب وتحديد الخطة المناسبة له.",
      answerEn:
        "A complimentary live assessment session is conducted with an educational supervisor to determine the best track and curriculum matching the student's needs.",
      category: "sessions",
      order: 1,
      isActive: true
    },
    {
      id: "faq_2",
      questionAr: "هل الدروس فردية أم في مجموعات؟",
      questionEn: "Does the academy offer private or group sessions?",
      answerAr:
        "نوفر الخيارين: حصص فردية خاصة (طالب مع معلم)، أو مجموعات صغيرة (من 4 إلى 6 طلاب) لضمان الفهم والمشاركة الفعالة.",
      answerEn:
        "We offer both: 1-on-1 personalized private lessons and small homogeneous groups of 4 to 6 students to ensure high engagement and focus.",
      category: "general",
      order: 2,
      isActive: true
    },
    {
      id: "faq_3",
      questionAr: "ما هي المناهج الدراسية المتوفرة في الأكاديمية؟",
      questionEn: "What curricula are supported in the academy?",
      answerAr:
        "نوفر المنهج المصري، السعودي، الإماراتي، الكويتي، الأزهري، والمنهج الدولي، بالإضافة إلى برامج تحفيظ القرآن الكريم وتجويده لجميع الأعمار.",
      answerEn:
        "We support Egyptian, Saudi, UAE, Kuwaiti, Al-Azhar, and International tracks for Languages, Sciences, Math, along with open Quranic recitation and memorization tracks.",
      category: "curricula",
      order: 3,
      isActive: true
    },
    {
      id: "faq_4",
      questionAr: "كيف تصل تقارير المتابعة لولي الأمر؟",
      questionEn: "How are student progress reports shared with parents?",
      answerAr:
        "يتم إرسال تقرير واضح بعد كل حصة عبر الواتساب وبوابة ولي الأمر، يوضح حضور الطالب ومستواه في الواجب وملاحظات المعلم.",
      answerEn:
        "Teachers generate detailed progress reports after every lesson detailing attendance, homework ratings, strengths, and recommendations, sent directly to parents.",
      category: "sessions",
      order: 4,
      isActive: true
    },
    {
      id: "faq_5",
      questionAr: "ما هي طرق الدفع المتاحة؟",
      questionEn: "What payment methods are supported?",
      answerAr:
        "طرق دفع سهلة وآمنة تشمل: إنستاباي InstaPay، فودافون كاش، التحويلات البنكية، والتحويلات الدولية، مع إصدار إيصال فوري لكل دفعة.",
      answerEn:
        "We support convenient payment channels including InstaPay, Vodafone Cash, Bank Transfers, and International Wire with formal receipts for all transactions.",
      category: "pricing",
      order: 5,
      isActive: true
    }
  ],
  curriculaList: [
    {
      id: "curr_dynamic_1",
      country: "saudi",
      stage: "primary",
      subject: "quran",
      titleAr: "مسار التميز القرآني والتجويد (المنهج السعودي)",
      titleEn: "Quranic Excellence & Tajweed Track (Saudi Curriculum)",
      gradeLabelAr: "المرحلة الابتدائية والمتوسطة",
      gradeLabelEn: "Primary & Middle Stages",
      descriptionAr:
        "شرح مخارج الحروف وأحكام التلاوة والتجويد وحفظ السور المقررة في المنهج السعودي مع التفسير الميسر.",
      descriptionEn:
        "Comprehensive recitation rules, memorization of Saudi curriculum surahs, with simplified tafseer.",
      topicsAr: ["أحكام النون الساكنة والتنوين", "المدود والغنن", "تلاوة سور جزء عم وتدبرها"],
      topicsEn: ["Noon Sakinah Rules", "Madd & Ghunnah", "Juz Amma Recitation & Tafseer"],
      objectivesAr: ["إتقان القراءة بالحركات", "حفظ المقرر الفصلي", "تطبيق أحكام التجويد عملياً"],
      objectivesEn: ["Accurate vocalization", "Term syllabus memorization", "Practical Tajweed application"],
      featuredOnHome: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "curr_dynamic_2",
      country: "egypt",
      stage: "middle",
      subject: "arabic",
      titleAr: "مسار النحو والبلاغة والإملاء (المنهج المصري)",
      titleEn: "Arabic Grammar, Rhetoric & Dictation (Egyptian Curriculum)",
      gradeLabelAr: "المرحلة الإعدادية والثانوية",
      gradeLabelEn: "Preparatory & Secondary Stages",
      descriptionAr:
        "تأسيس متين في قواعد الإعراب، الصرف، وفنون التعبير الكتابي والتحليل الأدبي للنصوص المقررة.",
      descriptionEn:
        "Solid foundation in Arabic parsing, morphology, literary analysis, and essay writing.",
      topicsAr: ["الإعراب التفاعلي", "علم البيان والبديع", "القواعد الإملائية الشائعة"],
      topicsEn: ["Interactive Parsing", "Bayan & Badi Rhetoric", "Spelling & Punctuation Rules"],
      objectivesAr: ["التفوق في الامتحانات النهائية", "صياغة مقالات سليمة لغوياً", "فهم النصوص الأدبية"],
      objectivesEn: ["Exam excellence", "Fluent composition", "Literary comprehension"],
      featuredOnHome: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "curr_dynamic_3",
      country: "international",
      stage: "foundation",
      subject: "nooraniyah",
      titleAr: "القاعدة النورانية لأبناء المغتربين والناطقين بغير العربية",
      titleEn: "Al-Qaidah An-Nooraniyyah for Diaspora & Non-Native Speakers",
      gradeLabelAr: "تأسيس الصغار واليافعين",
      gradeLabelEn: "Young Learners & Beginners",
      descriptionAr:
        "المنهج التأسيسي الأقوى لتعليم القراءة العربية الصحيحة من الصفر بالتهجئة ونطق الحروف بمخارجها الصحيحة.",
      descriptionEn:
        "The premier foundational system for teaching fluent Arabic reading and accurate letter pronunciation from scratch.",
      topicsAr: ["الحروف المفردة والمركبة", "الحركات والمدود", "التنوين والسكون والشدة"],
      topicsEn: ["Single & Compound Letters", "Harakat & Madd", "Tanween & Shaddah"],
      objectivesAr: ["قراءة الكلمات القرآنية بطلاقة", "ربط الحروف وكتابتها", "النطق العربي السليم"],
      objectivesEn: ["Fluent Quranic word reading", "Letter connections", "Authentic pronunciation"],
      featuredOnHome: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  updatedAt: new Date().toISOString()
};

export class CmsDataEngine {
  private static cachedData: SiteContentSettings | null = null;

  /**
   * Retrieves the current site content from LocalStorage cache or Firestore
   */
  static async getSiteContent(): Promise<SiteContentSettings> {
    if (this.cachedData) {
      return this.cachedData;
    }

    // Try LocalStorage first for instant rendering
    try {
      const local = localStorage.getItem(CMS_STORAGE_KEY);
      if (local) {
        this.cachedData = JSON.parse(local);
      }
    } catch {
      // ignore localStorage errors
    }

    try {
      const docRef = doc(db, "site_content", "main_config");
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const remoteData = snap.data() as SiteContentSettings;
        const merged: SiteContentSettings = {
          ...DEFAULT_CMS_CONTENT,
          ...remoteData,
          hero: { ...DEFAULT_CMS_CONTENT.hero, ...(remoteData.hero || {}) },
          announcementBanner: {
            ...DEFAULT_CMS_CONTENT.announcementBanner,
            ...(remoteData.announcementBanner || {})
          },
          visibility: {
            ...DEFAULT_CMS_CONTENT.visibility,
            ...(remoteData.visibility || {})
          },
          about: { ...DEFAULT_CMS_CONTENT.about, ...(remoteData.about || {}) },
          contact: { ...DEFAULT_CMS_CONTENT.contact, ...(remoteData.contact || {}) },
          faqList: remoteData.faqList || DEFAULT_CMS_CONTENT.faqList,
          curriculaList: remoteData.curriculaList || DEFAULT_CMS_CONTENT.curriculaList
        };

        this.cachedData = merged;
        localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(merged));
        return merged;
      } else {
        // Seed default content to Firestore
        await setDoc(docRef, cleanPayloadForFirestore(DEFAULT_CMS_CONTENT));
        this.cachedData = DEFAULT_CMS_CONTENT;
        localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(DEFAULT_CMS_CONTENT));
        return DEFAULT_CMS_CONTENT;
      }
    } catch (err) {
      console.warn("Notice: Firestore CMS fetch fallback to default/cached:", err);
      return this.cachedData || DEFAULT_CMS_CONTENT;
    }
  }

  /**
   * Saves updated CMS site content to Firestore and updates local cache
   */
  static async saveSiteContent(
    settings: SiteContentSettings,
    updatedBy?: string
  ): Promise<SiteContentSettings> {
    const updated: SiteContentSettings = {
      ...settings,
      updatedAt: new Date().toISOString(),
      updatedBy: updatedBy || "admin"
    };

    try {
      const docRef = doc(db, "site_content", "main_config");
      await setDoc(docRef, cleanPayloadForFirestore(updated), { merge: true });
    } catch (err) {
      console.warn("Notice: Saving CMS to Firestore offline fallback:", err);
    }

    this.cachedData = updated;
    try {
      localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    return updated;
  }

  /**
   * Subscribes to real-time changes of the CMS content
   */
  static subscribeSiteContent(callback: (content: SiteContentSettings) => void): () => void {
    const docRef = doc(db, "site_content", "main_config");

    const unsubscribe = onSnapshot(
      docRef,
      snap => {
        if (snap.exists()) {
          const remoteData = snap.data() as SiteContentSettings;
          const merged: SiteContentSettings = {
            ...DEFAULT_CMS_CONTENT,
            ...remoteData,
            hero: { ...DEFAULT_CMS_CONTENT.hero, ...(remoteData.hero || {}) },
            announcementBanner: {
              ...DEFAULT_CMS_CONTENT.announcementBanner,
              ...(remoteData.announcementBanner || {})
            },
            visibility: {
              ...DEFAULT_CMS_CONTENT.visibility,
              ...(remoteData.visibility || {})
            },
            about: { ...DEFAULT_CMS_CONTENT.about, ...(remoteData.about || {}) },
            contact: { ...DEFAULT_CMS_CONTENT.contact, ...(remoteData.contact || {}) },
            faqList: remoteData.faqList || DEFAULT_CMS_CONTENT.faqList,
            curriculaList: remoteData.curriculaList || DEFAULT_CMS_CONTENT.curriculaList
          };
          this.cachedData = merged;
          try {
            localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(merged));
          } catch {}
          callback(merged);
        } else {
          callback(this.cachedData || DEFAULT_CMS_CONTENT);
        }
      },
      err => {
        console.warn("CMS Snapshot listener notice:", err);
        callback(this.cachedData || DEFAULT_CMS_CONTENT);
      }
    );

    return unsubscribe;
  }

  /**
   * Resets CMS to initial default settings
   */
  static async resetToDefaults(updatedBy?: string): Promise<SiteContentSettings> {
    return this.saveSiteContent(DEFAULT_CMS_CONTENT, updatedBy);
  }
}
