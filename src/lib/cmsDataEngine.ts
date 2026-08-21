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
  branding: {
    academyNameAr: "أكاديمية GoStars",
    academyNameEn: "GoStars Academy",
    academySloganAr: "تعليم متميز ومبسط.. وتفوق مستمر لأبنائكم",
    academySloganEn: "Excellence in Quranic & Academic Education with Heritage and Innovation",
    logoStyle: "default_crest"
  },
  images: {
    heroBannerImage: "",
    aboutStoryImage: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80",
    aboutMissionImage: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80",
    curriculaHeaderImage: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1000&q=80",
    honorRollHeroImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80",
    contactHeaderImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      {
        id: "gal_1",
        url: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=800&q=80",
        titleAr: "حلقات القرآن الكريم وتجويده",
        titleEn: "Holy Quran Recitation Classes",
        category: "quran"
      },
      {
        id: "gal_2",
        url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
        titleAr: "تأسيس اللغة العربية والنورانية",
        titleEn: "Arabic & Nooraniyah Foundations",
        category: "arabic"
      },
      {
        id: "gal_3",
        url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
        titleAr: "شرح المناهج الدراسية والتفوق",
        titleEn: "Academic Curricula & Excellence",
        category: "school"
      }
    ]
  },
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
  pillarsList: [
    {
      id: "pillar_1",
      iconName: "BookOpen",
      titleAr: "تعليم القرآن الكريم وتجويده",
      titleEn: "Holy Quran & Tajweed",
      descriptionAr: "تحفيظ متقن وضبط لمخارج الحروف مع الإجازات المسندة لجميع الأعمار والمستويات.",
      descriptionEn: "Mastery of memorization and Tajweed phonetics with authenticated Ijazah standards.",
      badgeAr: "إجازات مسندة",
      badgeEn: "Certified Ijazah",
      isActive: true
    },
    {
      id: "pillar_2",
      iconName: "Target",
      titleAr: "تأسيس وتمكين اللغة العربية",
      titleEn: "Arabic Literacy & Grammar",
      descriptionAr: "القاعدة النورانية، النحو، الصرف، وفنون الإملاء والتعبير بأسلوب تفاعلي ممتع.",
      descriptionEn: "Nooraniyah phonics, syntax, morphology, and creative expression.",
      badgeAr: "من الصفر حتى الإتقان",
      badgeEn: "Foundation to Fluency",
      isActive: true
    },
    {
      id: "pillar_3",
      iconName: "Users",
      titleAr: "المناهج الدراسية والوزارية",
      titleEn: "National Curricula & Exam Prep",
      descriptionAr: "متابعة متخصصة للمناهج المصرية والسعودية والخليجية والأزهرية واللغات.",
      descriptionEn: "Comprehensive coverage of Egyptian, Saudi, Gulf, and Al-Azhar national curricula.",
      badgeAr: "متابعة مستمرة",
      badgeEn: "Continuous Tracking",
      isActive: true
    },
    {
      id: "pillar_4",
      iconName: "ShieldCheck",
      titleAr: "التربية الإسلامية والسيرة",
      titleEn: "Islamic Studies & Values",
      descriptionAr: "غرس القيم والأخلاق الحميدة وتدريس الفقه والحديث والقصص النبوي بأسلوب شيق.",
      descriptionEn: "Instilling core Islamic ethics, jurisprudence, and inspiring Prophetic stories.",
      badgeAr: "غرس الأخلاق",
      badgeEn: "Character Building",
      isActive: true
    }
  ],
  whyGoStarsList: [
    {
      id: "why_1",
      iconName: "Award",
      titleAr: "معلمون ومعلمات على أعلى مستوى",
      titleEn: "Elite Certified Educators",
      descriptionAr: "نخبة من خريجي الأزهر الشريف والجامعات المعتمدة من ذوي الخبرة والصبر في تعليم الصغار والكبار.",
      descriptionEn: "Highly vetted graduates of Al-Azhar and accredited universities with deep pedagogical patience.",
      isActive: true
    },
    {
      id: "why_2",
      iconName: "Sparkles",
      titleAr: "خطط دراسية فردية مخصصة",
      titleEn: "Tailored Individual Learning Paths",
      descriptionAr: "تصميم خطة تعليمية تناسب مستوى كل طالب وسرعة استيعابه مع تحديد أهداف دورية واضحة.",
      descriptionEn: "Custom curricula roadmaps tailored to each student's pace and personal milestones.",
      isActive: true
    },
    {
      id: "why_3",
      iconName: "MessageCircle",
      titleAr: "تقارير متابعة فورية وتواصل مباشر",
      titleEn: "Direct Parent Reports via WhatsApp",
      descriptionAr: "إرسال تقرير تقييم تفصيلي بعد كل حصة لولي الأمر عبر الواتساب وبوابة ولي الأمر الإلكترونية.",
      descriptionEn: "Instant evaluation updates sent directly to parents following every live session.",
      isActive: true
    },
    {
      id: "why_4",
      iconName: "Clock",
      titleAr: "مرونة كاملة في المواعيد والجداول",
      titleEn: "Maximum Scheduling Flexibility",
      descriptionAr: "إمكانية اختيار الأوقات المناسبة لجدول الأسرة وتوافق التوقيتات مع مختلف دول العالم.",
      descriptionEn: "Convenient lesson scheduling tailored across global timezones for diaspora families.",
      isActive: true
    }
  ],
  statsList: [
    {
      id: "stat_1",
      value: "+500",
      labelAr: "طالب وطالبة",
      labelEn: "Active Students",
      descriptionAr: "يتعلمون بانتظام وشغف في مختلف المسارات",
      descriptionEn: "Learning consistently across various tracks",
      isActive: true
    },
    {
      id: "stat_2",
      value: "99%",
      labelAr: "نسبة رضا أولياء الأمور",
      labelEn: "Parent Satisfaction",
      descriptionAr: "عن جودة التعليم والتزام المعلمين والتقارير",
      descriptionEn: "On instructional quality and teacher commitment",
      isActive: true
    },
    {
      id: "stat_3",
      value: "+25",
      labelAr: "معلماً ومعلمة معتمدين",
      labelEn: "Certified Instructors",
      descriptionAr: "من نخبة المقرئين والأساتذة المتخصصين",
      descriptionEn: "Elite scholars and specialized educators",
      isActive: true
    },
    {
      id: "stat_4",
      value: "+10",
      labelAr: "دول حول العالم",
      labelEn: "Countries Worldwide",
      descriptionAr: "يستفيد أبناؤها من خدمات الأكاديمية عن بعد",
      descriptionEn: "Families enrolled from across the globe",
      isActive: true
    }
  ],
  bottomCta: {
    titleAr: "ابدأ رحلة التفوق والتميز لأبنائك اليوم",
    titleEn: "Begin Your Child's Journey of Excellence Today",
    subtitleAr: "احجز جلسة تقييم مجانية وتعرف على معلمك المفضل وخطة الدراسة الأنسب.",
    subtitleEn: "Schedule a complimentary assessment session and discover the ideal pathway for your child.",
    buttonTextAr: "سجل الآن وابدأ مجاناً",
    buttonTextEn: "Enroll Now & Start Free",
    buttonRoute: "contact"
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
      questionAr: "ما هي المناهج والمواد المتوفرة في الأكاديمية؟",
      questionEn: "What subjects and curricula are available in the academy?",
      answerAr:
        "نوفر مسارات متخصصة للقرآن الكريم والتجويد، اللغة العربية والنحو، اللغة الإنجليزية، الرياضيات والعلوم، والقاعدة النورانية، بالإضافة للمناهج المدرسية للدول المختلفة.",
      answerEn:
        "We support English Language, Arabic Language, Holy Quran & Tajweed, Mathematics, Sciences, and Nooraniyah, along with national school tracks.",
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
      id: "curr_arabic_1",
      country: "international",
      stage: "primary",
      subject: "arabic",
      titleAr: "مسار اللغة العربية وإتقان اللسان",
      titleEn: "Arabic Language & Fluency Track",
      gradeLabelAr: "كافة المراحل العمرية",
      gradeLabelEn: "All Age Groups",
      descriptionAr: "تأسيس شامل في القراءة والكتابة والنحو والصرف والإملاء والتعبير البلاغي بأساليب تعليمية تفاعلية حديثة.",
      descriptionEn: "Comprehensive reading, writing, grammar, morphology, and creative expression through modern interactive methods.",
      topicsAr: ["تأسيس القراءة والكتابة", "قواعد النحو والإعراب المبسط", "فنون التعبير والإنشاء", "الإملاء السليم والخط"],
      topicsEn: ["Reading & Writing Foundation", "Simplified Arabic Grammar", "Creative Expression & Composition", "Orthography & Penmanship"],
      objectivesAr: ["التحدث بالفصحى بطلاقة", "إتقان الإعراب وفهم النصوص", "الكتابة بدون أخطاء إملائية"],
      objectivesEn: ["Fluent Arabic speech", "Grammar comprehension", "Error-free written composition"],
      featuredOnHome: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "curr_english_1",
      country: "international",
      stage: "primary",
      subject: "english",
      titleAr: "مسار اللغة الإنجليزية والمحادثة (English Language Track)",
      titleEn: "English Language Mastery & Conversation",
      gradeLabelAr: "لجميع المستويات (Starter to Advanced)",
      gradeLabelEn: "All Levels (Starter to Advanced)",
      descriptionAr: "منهج تفاعلي لتعليم اللغة الإنجليزية وتنمية مهارات التحدث والاستماع والقراءة والكتابة الأكاديمية.",
      descriptionEn: "Interactive curriculum focusing on English conversation, listening comprehension, phonics, grammar, and academic writing.",
      topicsAr: ["Phonics & Reading (الصوتيات والقراءة)", "Grammar & Vocabulary (القواعد والمفردات)", "Speaking & Daily Conversation (المحادثة اليومية)", "Writing & Essay Building (الكتابة الإنشائية)"],
      topicsEn: ["Phonics & Reading", "Grammar & Vocabulary", "Speaking & Daily Conversation", "Writing & Essay Building"],
      objectivesAr: ["الطلاقة في المحادثة باللغة الإنجليزية", "التفوق في الامتحانات والشهادات الدولية", "اكتساب ثروة لغوية وقواعد سليمة"],
      objectivesEn: ["Fluent conversational English", "Excellence in school and international exams", "Strong vocabulary and grammar foundation"],
      featuredOnHome: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "curr_quran_1",
      country: "international",
      stage: "primary",
      subject: "quran",
      titleAr: "مسار القرآن الكريم وأحكام التجويد",
      titleEn: "Holy Quran & Tajweed Recitation Track",
      gradeLabelAr: "للأطفال والناشئة والكبار",
      gradeLabelEn: "Kids, Youth & Adults",
      descriptionAr: "حفظ وتثبيت القرآن الكريم بالتلقين المباشر مع شرح وتطبيق أحكام التجويد والوقف والابتداء.",
      descriptionEn: "Systematic Quran memorization and retention with hands-on practical Tajweed rules.",
      topicsAr: ["مخارج الحروف وصفاتها", "أحكام النون والميم الساكنة والمدود", "تلاوة وتفسير ميسر للسور المقررة"],
      topicsEn: ["Letter Articulation Points", "Tajweed Rules (Noon, Meem, Madd)", "Recitation & Simplified Tafseer"],
      objectivesAr: ["تلاوة القرآن كما أُنزل", "حفظ الأجزاء المحددة بإتقان", "فهم معاني الآيات والتدبر"],
      objectivesEn: ["Authentic Quranic recitation", "Precise memorization", "Reflective understanding of verses"],
      featuredOnHome: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "curr_nooraniyah_1",
      country: "international",
      stage: "foundation",
      subject: "nooraniyah",
      titleAr: "مسار القاعدة النورانية والتأسيس السريع",
      titleEn: "Al-Qaidah An-Nooraniyyah Foundation Track",
      gradeLabelAr: "رياض الأطفال والمبتدئين",
      gradeLabelEn: "KG & Early Beginners",
      descriptionAr: "المنهج العالمي الأسرع في تعليم القراءة ونطق الحروف والكلمات القرآنية بدقة عالية.",
      descriptionEn: "The proven system for mastering Arabic phonics, vowel sounds, and accurate Quranic reading from scratch.",
      topicsAr: ["الحروف الهجائية المفردة والمركبة", "الحركات والمدود والتنوين", "السكون والشدة وتمارين القراءة"],
      topicsEn: ["Single & Compound Letters", "Harakat, Madd & Tanween", "Sukoon, Shaddah & Reading Drills"],
      objectivesAr: ["القراءة الذاتية من المصحف", "سلامة النطق ومخارج الحروف"],
      objectivesEn: ["Independent Quran reading", "Flawless letter articulation"],
      featuredOnHome: true,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  teachersList: [
    {
      id: "teacher_1",
      nameAr: "الشيخ / أحمد المنشاوي",
      nameEn: "Sheikh Ahmed Al-Minshawi",
      titleAr: "معلم أول القرآن الكريم والقراءات العشر",
      titleEn: "Senior Quran & Ten Qira'at Instructor",
      specializationAr: "القرآن الكريم والتجويد والقراءات",
      specializationEn: "Holy Quran, Tajweed & Qira'at",
      experienceYears: 12,
      qualificationsAr: ["إجازة بالسند المتصل برواية حفص وشعبة", "خريج كلية القرآن الكريم بالأزهر الشريف", "خبرة أكثر من 12 عاماً في التعليم عن بعد"],
      qualificationsEn: ["Certified Ijazah with linked Sanad in Hafs and Shu'bah", "Al-Azhar Faculty of Quran graduate", "12+ years of online teaching experience"],
      teachingPhilosophyAr: "التيسير والصبر مع التلقين المتقن حتى يقرأ الطالب بثقة وخشوع.",
      teachingPhilosophyEn: "Gentle pacing, patient repetition, and precise phonetics to build student confidence.",
      rating: 5,
      studentsCount: 140,
      badgeAr: "مُجاز بالقراءات",
      badgeEn: "Master of Qira'at",
      avatarUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80",
      isActive: true,
      order: 1
    },
    {
      id: "teacher_2",
      nameAr: "الأستاذة / فاطمة الزهراء",
      nameEn: "Ms. Fatimah Al-Zahraa",
      titleAr: "معلمة اللغة العربية والنورانية للأطفال",
      titleEn: "Arabic & Nooraniyah Specialist for Children",
      specializationAr: "تأسيس اللغة العربية والقاعدة النورانية",
      specializationEn: "Arabic Literacy & Nooraniyah Phonics",
      experienceYears: 9,
      qualificationsAr: ["شهادة معتمدة في تدريس القاعدة النورانية", "ليسانس آداب لغة عربية ودراسات إسلامية", "دبلوم تربوي في مهارات التعليم التفاعلي للطفل"],
      qualificationsEn: ["Certified Nooraniyah Method Instructor", "BA in Arabic Literature & Islamic Studies", "Pedagogical Diploma in Child Interactive Learning"],
      teachingPhilosophyAr: "تحويل تعلم الحروف والكلمات إلى ألعاب وتحديات ممتعة يحبها الصغار.",
      teachingPhilosophyEn: "Transforming reading into engaging interactive games and creative milestones.",
      rating: 5,
      studentsCount: 190,
      badgeAr: "خبيرة تأسيس الصغار",
      badgeEn: "Early Childhood Specialist",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      isActive: true,
      order: 2
    },
    {
      id: "teacher_3",
      nameAr: "الأستاذ / محمود عبد الله",
      nameEn: "Mr. Mahmoud Abdullah",
      titleAr: "معلم اللغة الإنجليزية والمحادثة",
      titleEn: "English Language & Conversation Tutor",
      specializationAr: "اللغة الإنجليزية والمناهج الدولية والوزارية",
      specializationEn: "English Language & International Curricula",
      experienceYears: 8,
      qualificationsAr: ["شهادة CELTA لتدريس الإنجليزية لغير الناطقين بها", "ليسانس ألسن لغة إنجليزية", "خبرة ممتدة في تدريس المناهج السعودية والمصرية والدولية"],
      qualificationsEn: ["CELTA Certified English Instructor", "BA in English Linguistics", "Extensive experience in Saudi, Egyptian & International curricula"],
      teachingPhilosophyAr: "التركيز على ممارسة المحادثة اليومية وكسر حاجز الخوف من التحدث.",
      teachingPhilosophyEn: "Empowering students through daily conversational fluency and interactive speaking.",
      rating: 5,
      studentsCount: 110,
      badgeAr: "معتمد دولياً",
      badgeEn: "Internationally Certified",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      isActive: true,
      order: 3
    }
  ],
  pricingPlansList: [
    {
      id: "plan_starter",
      nameAr: "الباقة الأساسية (حصتان أسبوعياً)",
      nameEn: "Essential Plan (2 Lessons / Week)",
      badgeAr: "مثالية للتأسيس",
      badgeEn: "Ideal for Starters",
      priceUsd: 45,
      priceSar: 169,
      priceEgp: 1200,
      periodAr: "شهرياً (8 حصص فردية)",
      periodEn: "Monthly (8 Private Lessons)",
      targetAudienceAr: "لتأسيس الصغار أو متابعة مادة واحدة بانتظام",
      targetAudienceEn: "For young learners or steady focus on a single subject",
      descriptionAr: "باقة متميزة تتضمن 8 حصص فردية مباشرة مع معلم متخصص ومتابعة دورية.",
      descriptionEn: "Includes 8 live one-on-one sessions with a qualified tutor and continuous tracking.",
      featuresAr: [
        "8 حصص فردية مباشرة شهرياً (1-on-1)",
        "معلم متخصص مكرس للطالب",
        "جلسة تقييم وتحديد مستوى مجانية",
        "تقرير شهري شامل عبر الواتساب",
        "مرونة في تعويض الحصص المعتذر عنها"
      ],
      featuresEn: [
        "8 one-on-one live sessions per month",
        "Dedicated qualified instructor",
        "Complimentary diagnostic evaluation",
        "Comprehensive monthly progress report",
        "Flexible makeup session policy"
      ],
      isPopular: false,
      ctaTextAr: "اشترك في الباقة الأساسية",
      ctaTextEn: "Choose Essential Plan",
      isActive: true,
      order: 1
    },
    {
      id: "plan_advanced",
      nameAr: "باقة التميز المكثف (3 حصص أسبوعياً)",
      nameEn: "Excellence Plan (3 Lessons / Week)",
      badgeAr: "الأكثر اختياراً",
      badgeEn: "Most Popular",
      priceUsd: 65,
      priceSar: 245,
      priceEgp: 1750,
      periodAr: "شهرياً (12 حصة فردية)",
      periodEn: "Monthly (12 Private Lessons)",
      targetAudienceAr: "للإنجاز السريع في الحفظ وإتقان اللغات والتفوق الدراسي",
      targetAudienceEn: "For fast memorization, language fluency, and academic excellence",
      descriptionAr: "الخيار الأفضل لتحقيق نتائج ملموسة وسريعة مع تقارير متابعة أسبوعية.",
      descriptionEn: "The optimal choice for rapid progress with bi-weekly progress reports.",
      featuresAr: [
        "12 حصة فردية مباشرة شهرياً (1-on-1)",
        "معلم أو معلمة من نخبة الكوادر المجازة",
        "خطة دراسية مخصصة وأهداف أسبوعية",
        "تقريرين شهريين مفصلين لولي الأمر",
        "أولوية في اختيار المواعيد المفضلة",
        "إشراف مباشر من المشرف الأكاديمي"
      ],
      featuresEn: [
        "12 one-on-one live sessions per month",
        "Elite certified educator with verified Ijazah",
        "Custom curriculum roadmap with weekly milestones",
        "Bi-weekly detailed progress reports",
        "Priority scheduling for peak time slots",
        "Direct periodic academic supervision"
      ],
      isPopular: true,
      ctaTextAr: "اشترك في باقة التميز",
      ctaTextEn: "Choose Excellence Plan",
      isActive: true,
      order: 2
    },
    {
      id: "plan_intensive",
      nameAr: "الباقة اليومية المتكاملة (5 حصص أسبوعياً)",
      nameEn: "Intensive Daily Track (5 Lessons / Week)",
      badgeAr: "أعلى معدل إنجاز",
      badgeEn: "Highest Pace",
      priceUsd: 99,
      priceSar: 375,
      priceEgp: 2600,
      periodAr: "شهرياً (20 حصة فردية)",
      periodEn: "Monthly (20 Private Lessons)",
      targetAudienceAr: "لختم القرآن، برامج الإجازة، ومناهج الشهادات المكثفة",
      targetAudienceEn: "For Quran completion, Ijazah programs, and intensive exam tracks",
      descriptionAr: "متابعة يومية مستمرة تضمن أعلى معدلات التثبيت والتمكن الأكاديمي واللغوي.",
      descriptionEn: "Daily immersive practice for maximal retention and mastery.",
      featuresAr: [
        "20 حصة فردية مباشرة شهرياً (1-on-1)",
        "تدريب يومي مستمر لضمان سرعة الإنجاز",
        "إشراف مباشر من كبار المقرئين والمشرفين",
        "تقارير أداء ومتابعة أسبوعية دقيقة",
        "مرونة قصوى وتنسيق جدول مخصص بالكامل"
      ],
      featuresEn: [
        "20 one-on-one live sessions per month",
        "Daily immersive practice for maximal retention",
        "Direct mentorship from senior supervisors",
        "Weekly in-depth performance analytics",
        "Maximum scheduling flexibility"
      ],
      isPopular: false,
      ctaTextAr: "اشترك في الباقة المكثفة",
      ctaTextEn: "Choose Intensive Daily",
      isActive: true,
      order: 3
    }
  ],
  honorStarsList: [
    {
      id: "star_1",
      studentDisplayNameAr: "عبد الرحمن خالد",
      studentDisplayNameEn: "Abdurrahman Khaled",
      achievementTitleAr: "إتمام حفظ 10 أجزاء من القرآن الكريم بإتقان",
      achievementTitleEn: "Memorized 10 Juz with Flawless Tajweed",
      category: "quran_milestone",
      categoryBadgeAr: "إنجاز قرآني متميز",
      categoryBadgeEn: "Quran Milestone",
      achievementDetailAr: "أتم مراجعة واختبار الأجزاء العشرة الأولى وحصل على تقدير ممتاز مرتفع (A+).",
      achievementDetailEn: "Successfully recited and passed the 10-Juz evaluation with distinction (A+).",
      countryCode: "🇸🇦",
      countryAr: "المملكة العربية السعودية",
      countryEn: "Saudi Arabia",
      teacherPraiseAr: "«نموذج للطالب المثابر الحريص على ورده اليومي ومخارج الحروف الدقيقة.»",
      teacherPraiseEn: '"A shining example of diligence, dedication, and accurate Tajweed application."',
      highlighted: true,
      isActive: true,
      order: 1
    },
    {
      id: "star_2",
      studentDisplayNameAr: "مريم أحمد",
      studentDisplayNameEn: "Maryam Ahmed",
      achievementTitleAr: "التفوق في مسار اللغة الإنجليزية والمحادثة",
      achievementTitleEn: "Distinction in English Conversation & Phonics",
      category: "academic_excellence",
      categoryBadgeAr: "تفوق لغوي",
      categoryBadgeEn: "Language Excellence",
      achievementDetailAr: "انتقلت من المستوى المبتدئ إلى المستوى المتقدم في مهارات التحدث بطلاقة خلال 3 أشهر.",
      achievementDetailEn: "Progressed from beginner to advanced conversational fluency in 3 months.",
      countryCode: "🇪🇬",
      countryAr: "مصر",
      countryEn: "Egypt",
      teacherPraiseAr: "«شغف كبير بالتعلم واستيعاب سريع للمفردات والتعبير الإنشائي.»",
      teacherPraiseEn: '"Outstanding enthusiasm, rapid vocabulary acquisition, and natural fluency."',
      highlighted: false,
      isActive: true,
      order: 2
    },
    {
      id: "star_3",
      studentDisplayNameAr: "يوسف عمر",
      studentDisplayNameEn: "Youssef Omar",
      achievementTitleAr: "ختم القاعدة النورانية وبدء القراءة المباشرة من المصحف",
      achievementTitleEn: "Completed Nooraniyah & Direct Quran Reading",
      category: "arabic_mastery",
      categoryBadgeAr: "ختم النورانية",
      categoryBadgeEn: "Nooraniyah Graduate",
      achievementDetailAr: "أتقن تهجئة الكلمات القرآنية الصعبة والحركات والمدود في وقت قياسي.",
      achievementDetailEn: "Mastered complex Quranic phonics, vowels, and connected letters in record time.",
      countryCode: "🇦🇪",
      countryAr: "الإمارات",
      countryEn: "UAE",
      teacherPraiseAr: "«نطق فصيح وتركيز رائع في كل حصة.. بارك الله في والديه.»",
      teacherPraiseEn: '"Eloquent pronunciation and superb engagement in every lesson."',
      highlighted: false,
      isActive: true,
      order: 3
    }
  ],
  updatedAt: new Date().toISOString()
};

/**
 * Ensures all CMS content properties and nested objects are completely safe and defined
 */
export function sanitizeSiteContent(raw?: Partial<SiteContentSettings> | null): SiteContentSettings {
  if (!raw || typeof raw !== 'object') {
    return DEFAULT_CMS_CONTENT;
  }
  return {
    ...DEFAULT_CMS_CONTENT,
    ...raw,
    branding: { ...DEFAULT_CMS_CONTENT.branding, ...(raw.branding || {}) },
    images: {
      ...DEFAULT_CMS_CONTENT.images,
      ...(raw.images || {}),
      gallery: Array.isArray(raw.images?.gallery) && raw.images.gallery.length > 0
        ? raw.images.gallery
        : DEFAULT_CMS_CONTENT.images.gallery
    },
    hero: { ...DEFAULT_CMS_CONTENT.hero, ...(raw.hero || {}) },
    announcementBanner: {
      ...DEFAULT_CMS_CONTENT.announcementBanner,
      ...(raw.announcementBanner || {})
    },
    visibility: {
      ...DEFAULT_CMS_CONTENT.visibility,
      ...(raw.visibility || {})
    },
    about: { ...DEFAULT_CMS_CONTENT.about, ...(raw.about || {}) },
    contact: { ...DEFAULT_CMS_CONTENT.contact, ...(raw.contact || {}) },
    bottomCta: { ...DEFAULT_CMS_CONTENT.bottomCta, ...(raw.bottomCta || {}) },
    pillarsList: Array.isArray(raw.pillarsList) && raw.pillarsList.length > 0
      ? raw.pillarsList
      : DEFAULT_CMS_CONTENT.pillarsList,
    whyGoStarsList: Array.isArray(raw.whyGoStarsList) && raw.whyGoStarsList.length > 0
      ? raw.whyGoStarsList
      : DEFAULT_CMS_CONTENT.whyGoStarsList,
    statsList: Array.isArray(raw.statsList) && raw.statsList.length > 0
      ? raw.statsList
      : DEFAULT_CMS_CONTENT.statsList,
    teachersList: Array.isArray(raw.teachersList) && raw.teachersList.length > 0
      ? raw.teachersList
      : DEFAULT_CMS_CONTENT.teachersList,
    pricingPlansList: Array.isArray(raw.pricingPlansList) && raw.pricingPlansList.length > 0
      ? raw.pricingPlansList
      : DEFAULT_CMS_CONTENT.pricingPlansList,
    honorStarsList: Array.isArray(raw.honorStarsList) && raw.honorStarsList.length > 0
      ? raw.honorStarsList
      : DEFAULT_CMS_CONTENT.honorStarsList,
    faqList: Array.isArray(raw.faqList) && raw.faqList.length > 0
      ? raw.faqList
      : DEFAULT_CMS_CONTENT.faqList,
    curriculaList: Array.isArray(raw.curriculaList) && raw.curriculaList.length > 0
      ? raw.curriculaList
      : DEFAULT_CMS_CONTENT.curriculaList
  };
}

export class CmsDataEngine {
  private static cachedData: SiteContentSettings | null = null;

  /**
   * Retrieves the current site content from LocalStorage cache or Firestore
   */
  static async getSiteContent(): Promise<SiteContentSettings> {
    if (this.cachedData) {
      return this.cachedData;
    }

    // Try LocalStorage first for instant 0ms rendering
    try {
      const local = localStorage.getItem(CMS_STORAGE_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        this.cachedData = sanitizeSiteContent(parsed);
        return this.cachedData;
      }
    } catch {
      // ignore localStorage errors
    }

    // Return instant default immediately so UI renders with 0 delay,
    // while firestore doc is fetched/seeded asynchronously in background
    this.cachedData = DEFAULT_CMS_CONTENT;
    
    // Non-blocking background fetch
    (async () => {
      try {
        const docRef = doc(db, "site_content", "main_config");
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const remoteData = snap.data() as SiteContentSettings;
          const merged = sanitizeSiteContent(remoteData);

          this.cachedData = merged;
          localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(merged));
        } else {
          await setDoc(docRef, cleanPayloadForFirestore(DEFAULT_CMS_CONTENT));
          localStorage.setItem(CMS_STORAGE_KEY, JSON.stringify(DEFAULT_CMS_CONTENT));
        }
      } catch (err) {
        console.warn("Notice: Non-blocking Firestore CMS fetch notice:", err);
      }
    })();

    return DEFAULT_CMS_CONTENT;
  }

  /**
   * Saves updated CMS site content to Firestore and updates local cache
   */
  static async saveSiteContent(
    settings: SiteContentSettings,
    updatedBy?: string
  ): Promise<SiteContentSettings> {
    const sanitized = sanitizeSiteContent(settings);
    const updated: SiteContentSettings = {
      ...sanitized,
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
          const merged = sanitizeSiteContent(remoteData);
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
