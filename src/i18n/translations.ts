export type Language = 'ar' | 'en';

export interface TranslationDictionary {
  // Brand
  brandName: string;
  brandSlogan: string;
  brandTagline: string;

  // Nav
  navHome: string;
  navAbout: string;
  navCurricula: string;
  navPricing: string;
  navTeachers: string;
  navHonorRoll: string;
  navContact: string;
  navLogin: string;
  
  // Common Actions
  ctaRegister: string;
  ctaExploreCurricula: string;
  ctaLearnMore: string;
  ctaContactUs: string;
  ctaConsultation: string;
  ctaBackToHome: string;
  viewDetails: string;
  readMore: string;
  allRightsReserved: string;
  switchLanguage: string;
  currentLangLabel: string;
  filterAll: string;
  
  // Home Page
  homeHeroBadge: string;
  homeHeroTitle: string;
  homeHeroSubtitle: string;
  homeHeroHighlight1: string;
  homeHeroHighlight2: string;
  homeHeroHighlight3: string;
  homeHeroCtaPrimary: string;
  homeHeroCtaSecondary: string;
  
  // Home Pillars
  pillarsTitle: string;
  pillarsSubtitle: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Title: string;
  pillar3Desc: string;
  pillar4Title: string;
  pillar4Desc: string;

  // Home Featured Curricula Preview
  featuredCurriculaTitle: string;
  featuredCurriculaSubtitle: string;
  
  // Home Values & Methodology Teaser
  homeWhyGoStarsTitle: string;
  homeWhyGoStarsSubtitle: string;
  homeFeature1Title: string;
  homeFeature1Desc: string;
  homeFeature2Title: string;
  homeFeature2Desc: string;
  homeFeature3Title: string;
  homeFeature3Desc: string;
  homeFeature4Title: string;
  homeFeature4Desc: string;

  // Stats / Numbers
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  stat4Value: string;
  stat4Label: string;

  // CTA Banner
  ctaBannerTitle: string;
  ctaBannerSubtitle: string;
  ctaBannerButton: string;

  // About Page
  aboutPageTitle: string;
  aboutPageSubtitle: string;
  aboutStoryTitle: string;
  aboutStoryP1: string;
  aboutStoryP2: string;
  aboutVisionTitle: string;
  aboutVisionText: string;
  aboutMissionTitle: string;
  aboutMissionText: string;
  aboutValuesTitle: string;
  aboutValuesSubtitle: string;
  value1Title: string;
  value1Desc: string;
  value2Title: string;
  value2Desc: string;
  value3Title: string;
  value3Desc: string;
  value4Title: string;
  value4Desc: string;
  value5Title: string;
  value5Desc: string;

  // Curricula Page (المناهج)
  curriculaPageTitle: string;
  curriculaPageSubtitle: string;
  filterByCountry: string;
  filterByStage: string;
  filterBySubject: string;
  allCountries: string;
  allStages: string;
  allSubjects: string;
  curriculaEmptyState: string;
  curriculaEmptyStateReset: string;
  curriculumGradeLabel: string;
  curriculumSubjectLabel: string;
  curriculumObjectivesLabel: string;
  curriculumTopicsLabel: string;
  curriculumMaterialsLabel: string;
  requestCurriculumPlan: string;

  // Pricing Page (الأسعار)
  pricingPageTitle: string;
  pricingPageSubtitle: string;
  pricingNote: string;
  planDurationMonthly: string;
  planPerLesson: string;
  currencyLabelUSD: string;
  currencyLabelSAR: string;
  currencyLabelEGP: string;
  planFeatureSessions: string;
  planFeatureAssessment: string;
  planFeatureReports: string;
  planFeatureFlexibility: string;
  planFeatureDirectTeacher: string;
  planCustomTitle: string;
  planCustomDesc: string;
  planCustomButton: string;
  pricingFaqTitle: string;
  pricingFaqSubtitle: string;

  // Teachers Page (المعلمون)
  teachersPageTitle: string;
  teachersPageSubtitle: string;
  teachersFilterSubject: string;
  teachersExpLabel: string;
  teachersCertLabel: string;
  teachersApproachLabel: string;
  teachersDisclaimer: string;

  // Honor Roll Page (لوحة الشرف)
  honorRollPageTitle: string;
  honorRollPageSubtitle: string;
  honorFilterAll: string;
  honorFilterQuran: string;
  honorFilterArabic: string;
  honorFilterCommitment: string;
  honorAchievementLabel: string;
  honorQuoteLabel: string;
  honorInspirationTitle: string;
  honorInspirationText: string;

  // Admissions & Contact
  admissionsPageTitle: string;
  admissionsPageSubtitle: string;
  enrollStepsTitle: string;
  enrollStep1Title: string;
  enrollStep1Desc: string;
  enrollStep2Title: string;
  enrollStep2Desc: string;
  enrollStep3Title: string;
  enrollStep3Desc: string;
  enrollStep4Title: string;
  enrollStep4Desc: string;
  inquiryFormTitle: string;
  inquiryFormSubtitle: string;
  formParentName: string;
  formStudentName: string;
  formStudentAge: string;
  formEmail: string;
  formPhone: string;
  formCountry: string;
  formInterestedSubject: string;
  formNotes: string;
  formSubmitBtn: string;
  formSuccessMessage: string;

  // Contact Page
  contactPageTitle: string;
  contactPageSubtitle: string;
  contactChannelsTitle: string;
  contactAddressLabel: string;
  contactPhoneLabel: string;
  contactEmailLabel: string;
  contactHoursLabel: string;
  contactFormSendBtn: string;
  contactFormSuccess: string;

  // Footer
  footerAboutText: string;
  footerQuickLinks: string;
  footerAcademicCurricula: string;
  footerContactInfo: string;
  footerAccreditation: string;

  // Future Portals Notice (for clean gateway)
  portalModalTitle: string;
  portalModalDesc: string;
  portalModalClose: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  ar: {
    // Brand
    brandName: "أكاديمية GoStars",
    brandSlogan: "آفاق واسعة.. لعلم لا ينتهي",
    brandTagline: "أكاديمية تعليمية متخصصة في تدريس القرآن الكريم، اللغة العربية، والمناهج الدراسية لجميع المراحل بأسلوب سهل وممتع.",

    // Nav
    navHome: "الرئيسية",
    navAbout: "من نحن",
    navCurricula: "المناهج الدراسية",
    navPricing: "الأسعار والباقات",
    navTeachers: "المعلمون",
    navHonorRoll: "لوحة الشرف",
    navContact: "تواصل معنا",
    navLogin: "تسجيل الدخول",

    // Common Actions
    ctaRegister: "سجل معنا الآن",
    ctaExploreCurricula: "استعرض المناهج",
    ctaLearnMore: "تعرف علينا أكثر",
    ctaContactUs: "تواصل معنا",
    ctaConsultation: "طلب استشارة مجانية",
    ctaBackToHome: "العودة للرئيسية",
    viewDetails: "عرض التفاصيل",
    readMore: "اقرأ المزيد",
    allRightsReserved: "جميع الحقوق محفوظة لأكاديمية GoStars التعليمية",
    switchLanguage: "English",
    currentLangLabel: "العربية",
    filterAll: "الكل",

    // Home Page
    homeHeroBadge: "تعليم مباشر عبر الإنترنت • معايير معتمدة",
    homeHeroTitle: "تعليم متميز.. ومستقبل مشرق لأبنائكم",
    homeHeroSubtitle: "نساعد أبناءكم على حفظ القرآن الكريم، وإتقان اللغة العربية، والتفوق في المواد الدراسية مع نخبة من أفضل المعلمين والمعلمات بأسلوب بسيط وتفاعلي.",
    homeHeroHighlight1: "مناهج معتمدة لكل الدول والمراحل الدراسية",
    homeHeroHighlight2: "معلمون ومعلمات متخصصون وذوو خبرة",
    homeHeroHighlight3: "متابعة مستمرة وتقارير دورية لولي الأمر",
    homeHeroCtaPrimary: "ابدأ التعلم الآن",
    homeHeroCtaSecondary: "استعرض المناهج الدراسية",

    // Home Pillars
    pillarsTitle: "لماذا تختار أكاديمية GoStars؟",
    pillarsSubtitle: "نقدم تجربة تعليمية ممتعة وبسيطة تضمن تفوق الطالب خطوة بخطوة",
    pillar1Title: "معلمون متخصصون ومعتمدون",
    pillar1Desc: "فريق من المعلمين والمعلمات ذوي الخبرة في الشرح المبسط والتعامل التربوي الممتاز مع الطلاب.",
    pillar2Title: "مناهج واضحة ودروس تفاعلية",
    pillar2Desc: "خطة دراسية مرتبة تراعي مستوى كل طالب وتساعده على الفهم السريع والتركيز.",
    pillar3Title: "متابعة دورية وتقارير مستمرة",
    pillar3Desc: "تقرير واضح بعد كل حصة يصل لولي الأمر لمعرفة مستوى الطالب وتطوره أولاً بأول.",
    pillar4Title: "بيئة تعليمية محفزة وآمنة",
    pillar4Desc: "حصص ممتعة تشجع الطالب على المشاركة وبناء الثقة بالنفس وحب التعلم.",

    // Featured Curricula Preview
    featuredCurriculaTitle: "المناهج والمسارات التعليمية",
    featuredCurriculaSubtitle: "نوفر برامج تعليمية شاملة للقرآن، اللغة العربية، والمناهج الوطنية والدولية",

    // Home Why GoStars
    homeWhyGoStarsTitle: "مميزات الدراسة معنا",
    homeWhyGoStarsSubtitle: "نوفر كل ما يحتاجه الطالب للنجاح والتفوق بكل سهولة",
    homeFeature1Title: "حصص فردية ومجموعات صغيرة",
    homeFeature1Desc: "اهتمام كامل بكل طالب لضمان الفهم وحل الواجبات والإجابة عن كل الأسئلة.",
    homeFeature2Title: "مواعيد مرنة تناسب الجميع",
    homeFeature2Desc: "أوقات دراسية متنوعة تناسب جدول الطالب وفروق التوقيت في جميع الدول.",
    homeFeature3Title: "تواصل دائم مع ولي الأمر",
    homeFeature3Desc: "تقارير واضحة ومباشرة توضح حضور الطالب، أداءه في الواجبات، ومستوى تقدمه.",
    homeFeature4Title: "بناء الأخلاق والقيم",
    homeFeature4Desc: "نحرص على ربط العلم بالأخلاق الفاضلة وغرس حب القرآن واللغة العربية في نفوس الأبناء.",

    // Stats
    stat1Value: "+١,٥٠٠",
    stat1Label: "طالب وطالبة يدرسون معنا",
    stat2Value: "+٥٠",
    stat2Label: "معلم ومعلمة من ذوي الخبرة",
    stat3Value: "٩٨٪",
    stat3Label: "نسبة رضا أولياء الأمور",
    stat4Value: "+١٥",
    stat4Label: "دولة حول العالم نصل إليها",

    // CTA Banner
    ctaBannerTitle: "سجل ابنك اليوم في أكاديمية GoStars",
    ctaBannerSubtitle: "انضم إلينا الآن لنبدأ معاً رحلة التفوق في القرآن الكريم والدراسة بكل يسر وسهولة.",
    ctaBannerButton: "احجز حصة تجريبية مجانية",

    // About Page
    aboutPageTitle: "من نحن - أكاديمية GoStars",
    aboutPageSubtitle: "أكاديمية تعليمية متخصصة تهدف إلى تقديم تعليم عالي الجودة بأسلوب مبسط يناسب الجميع",
    aboutStoryTitle: "هدفنا ورؤيتنا في التعليم",
    aboutStoryP1: "تأسست أكاديمية GoStars لمساعدة الطلاب وأولياء الأمور في كل مكان على تعلم القرآن الكريم واللغة العربية والمناهج الدراسية بأسهل الطرق وبأعلى درجات الإتقان.",
    aboutStoryP2: "نوفر بيئة تعليمية مرنة وتفاعلية تناسب جميع الأعمار، مع اختيار دقيق للمعلمين لضمان تقديم أفضل شرح ومتابعة مستمرة لكل طالب.",
    aboutVisionTitle: "رؤيتنا",
    aboutVisionText: "أن نكون الخيار الأول والموثوق لكل أسرة تبحث عن تعليم قرآني وأكاديمي متميز ومبسط لأبنائها في أي مكان بالعالم.",
    aboutMissionTitle: "رسالتنا",
    aboutMissionText: "تقديم دروس تفاعلية ممتعة وشاملة تلبي احتياجات الطلاب، وتساعدهم على التفوق الدراسي وبناء شخصية واثقة ومتعلمة.",
    aboutValuesTitle: "قيمنا ومبادئنا",
    aboutValuesSubtitle: "المبادئ الأساسية التي نلتزم بها في كل درس ومع كل طالب",
    value1Title: "الإتقان والأمانة",
    value1Desc: "نحرص على أعلى درجات الدقة والوضوح في الشرح والتدريس.",
    value2Title: "التربية والأخلاق",
    value2Desc: "غرس الأخلاق الكريمة وحب العلم والعمل الصالح في نفوس الأبناء.",
    value3Title: "مراعاة مستوى كل طالب",
    value3Desc: "كل طالب له قدراته وسرعته الخاصة، ونحن ندعمه بالصبر والتشجيع المستمر.",
    value4Title: "التشجيع والتحفيز",
    value4Desc: "جعل وقت الحصة ممتعاً ومحبباً للطالب حتى ينتظر موعد الدرس بشوق.",
    value5Title: "الوضوح والتعاون مع الأهل",
    value5Desc: "مشاركة ولي الأمر بكل تفاصيل مستوى ابنه لضمان استمرار التفوق.",

    // Curricula Page (المناهج)
    curriculaPageTitle: "المناهج والبرامج الدراسية",
    curriculaPageSubtitle: "اختر المنهج المناسب لبلدك ومرحلتك الدراسية بسهولة ووضوح",
    filterByCountry: "اختر الدولة أو المنهج:",
    filterByStage: "المرحلة الدراسية:",
    filterBySubject: "المادة الدراسية:",
    allCountries: "جميع المناهج والدول",
    allStages: "جميع المراحل الدراسية",
    allSubjects: "جميع المواد",
    curriculaEmptyState: "لم نجد نتائج مطابقة لاختياراتك الحالية. يرجى تجربة خيارات أخرى.",
    curriculaEmptyStateReset: "إعادة تعيين البحث",
    curriculumGradeLabel: "الصف الدراسي",
    curriculumSubjectLabel: "المادة",
    curriculumObjectivesLabel: "أهداف المنهج:",
    curriculumTopicsLabel: "الموضوعات والدروس الأساسية:",
    curriculumMaterialsLabel: "الكتب والمراجع:",
    requestCurriculumPlan: "طلب التسجيل في هذا المنهج",

    // Pricing Page (الأسعار)
    pricingPageTitle: "الأسعار والباقات",
    pricingPageSubtitle: "باقات واضحة ومناسبة للجميع مع متابعة شاملة لحصص ابنك",
    pricingNote: "تتضمن جميع الباقات جلسة تحديد مستوى مجانية وتقارير دورية لولي الأمر.",
    planDurationMonthly: "شهرياً",
    planPerLesson: "للحصة الواحدة",
    currencyLabelUSD: "دولار ($)",
    currencyLabelSAR: "ريال سعودي (ر.س)",
    currencyLabelEGP: "جنيه مصري (ج.م)",
    planFeatureSessions: "حصص مباشرة وممتعة مع المعلم المخصص",
    planFeatureAssessment: "جلسة تحديد مستوى مجانية قبل البدء",
    planFeatureReports: "تقارير أداء ومتابعة ترسل لولي الأمر",
    planFeatureFlexibility: "إمكانية تنسيق وتعديل المواعيد بسهولة",
    planFeatureDirectTeacher: "إشراف ومتابعة دائمة من المعلم وإدارة الأكاديمية",
    planCustomTitle: "هل تريد باقة مخصصة للعائلة أو لأكثر من مادة؟",
    planCustomDesc: "يسعدنا توفير باقة عائلية مخصصة بأسعار مخفضة تناسب عدد أبنائكم ومواعيدهم.",
    planCustomButton: "تواصل معنا لطلب باقة خاصة",
    pricingFaqTitle: "الأسئلة الشائعة عن الاشتراكات",
    pricingFaqSubtitle: "إجابات واضحة وبسيطة على أهم الأسئلة التي تهم ولي الأمر",

    // Teachers Page (المعلمون)
    teachersPageTitle: "معلمو ومعلمات الأكاديمية",
    teachersPageSubtitle: "فريق متميز من المعلمين والمعلمات المتخصصين في تدريس القرآن واللغة العربية والمناهج المختلفة",
    teachersFilterSubject: "التخصص:",
    teachersExpLabel: "سنوات الخبرة:",
    teachersCertLabel: "المؤهلات والإجازات:",
    teachersApproachLabel: "طريقة التدريس:",
    teachersDisclaimer: "نحرص على خصوصية وسرية بيانات جميع المعلمين والطلاب لتوفير بيئة دراسية آمنة ومريحة.",

    // Honor Roll Page (لوحة الشرف)
    honorRollPageTitle: "لوحة الشرف وتكريم الطلاب",
    honorRollPageSubtitle: "نفتخر بأبنائنا وبناتنا المتفوقين الذين أظهروا التزاماً وتميزاً في الحفظ والدراسة",
    honorFilterAll: "جميع الإنجازات",
    honorFilterQuran: "حفظ القرآن الكريم والأجزاء",
    honorFilterArabic: "التفوق في اللغة العربية",
    honorFilterCommitment: "الالتزام والانضباط في الحصص",
    honorAchievementLabel: "الإنجاز:",
    honorQuoteLabel: "كلمة المعلم المشرف:",
    honorInspirationTitle: "كن النجم القادم في لوحة الشرف",
    honorInspirationText: "كل خطوة في التعلم تقربك من النجاح والتفوق. نحن في انتظارك لنبدأ معاً رحلة التميز.",

    // Admissions
    admissionsPageTitle: "خطوات التسجيل والالتحاق",
    admissionsPageSubtitle: "خطوات بسيطة وسريعة للانضمام إلى الأكاديمية وبدء الدروس",
    enrollStepsTitle: "كيف تسجل معنا؟",
    enrollStep1Title: "١. إرسال طلب التسجيل",
    enrollStep1Desc: "اكتب بياناتك الأساسية واختر المادة أو المنهج الذي ترغب فيه.",
    enrollStep2Title: "٢. التواصل وتحديد الموعد",
    enrollStep2Desc: "نتواصل معك هاتفياً أو عبر الواتساب لتحديد موعد مناسب للحصة الأولى.",
    enrollStep3Title: "٣. جلسة تحديد المستوى (مجاناً)",
    enrollStep3Desc: "جلسة قصيرة وممتعة مع المعلم لمعرفة مستوى الطالب واحتياجاته.",
    enrollStep4Title: "٤. اعتماد الجدول وبدء الحصص",
    enrollStep4Desc: "تأكيد المواعيد المنتظمة والبدء مباشرة في التعلم بكل سهولة.",
    inquiryFormTitle: "نموذج طلب التسجيل والاستفسار",
    inquiryFormSubtitle: "اكتب بياناتك وسيقوم فريقنا بالتواصل معك في أقرب وقت.",
    formParentName: "اسم ولي الأمر",
    formStudentName: "اسم الطالب أو الطالبة",
    formStudentAge: "عمر الطالب",
    formEmail: "البريد الإلكتروني",
    formPhone: "رقم الهاتف / الواتساب (مع رمز الدولة)",
    formCountry: "الدولة أو المنهج المطلوب",
    formInterestedSubject: "المادة أو المسار التعليمي",
    formNotes: "ملاحظات إضافية أو الوقت المناسب للاتصال",
    formSubmitBtn: "إرسال طلب التسجيل",
    formSuccessMessage: "شكراً لتواصلك معنا! تم استلام طلبك وسنتواصل معك قريباً جداً.",

    // Contact
    contactPageTitle: "تواصل مع أكاديمية GoStars",
    contactPageSubtitle: "يسعدنا الرد على جميع استفساراتكم ومساعدتكم في أي وقت",
    contactChannelsTitle: "طرق التواصل المتاحة",
    contactAddressLabel: "المقر ونطاق العمل:",
    contactPhoneLabel: "رقم الهاتف والواتساب:",
    contactEmailLabel: "البريد الإلكتروني:",
    contactHoursLabel: "أوقات العمل واستقبال الرسائل:",
    contactFormSendBtn: "إرسال الرسالة",
    contactFormSuccess: "تم إرسال رسالتك بنجاح! سنقوم بالرد عليك في أقرب وقت.",

    // Footer
    footerAboutText: "أكاديمية تعليمية متخصصة تقدم دروساً تفاعلية في القرآن الكريم، اللغة العربية، والمناهج الدراسية بأسلوب مبسط يناسب جميع الطلاب وأولياء الأمور.",
    footerQuickLinks: "روابط سريعة",
    footerAcademicCurricula: "المناهج الدراسية",
    footerContactInfo: "معلومات التواصل",
    footerAccreditation: "أكاديمية GoStars التعليمية - آفاق واسعة لعلم لا ينتهي",

    // Future Portals
    portalModalTitle: "بوابة GoStars التعليمية",
    portalModalDesc: "بوابة سهلة للطلاب وأولياء الأمور والمعلمين لمتابعة الحصص والتقارير والشهادات.",
    portalModalClose: "إغلاق النافذة",
  },
  en: {
    // Brand
    brandName: "GoStars Academy",
    brandSlogan: "Broad Horizons.. For Endless Knowledge",
    brandTagline: "A leading educational institution blending authentic curriculum with modern interactive teaching to graduate exceptional Quranic, linguistic, and ethical learners.",

    // Nav
    navHome: "Home",
    navAbout: "About Us",
    navCurricula: "Curricula",
    navPricing: "Pricing",
    navTeachers: "Teachers",
    navHonorRoll: "Honor Roll",
    navContact: "Contact Us",
    navLogin: "Login",

    // Common Actions
    ctaRegister: "Enroll Now",
    ctaExploreCurricula: "Explore Curricula",
    ctaLearnMore: "Discover the Academy",
    ctaContactUs: "Get in Touch",
    ctaConsultation: "Request Academic Consultation",
    ctaBackToHome: "Back to Home",
    viewDetails: "View Details",
    readMore: "Read More",
    allRightsReserved: "All rights reserved to GoStars Academy",
    switchLanguage: "العربية",
    currentLangLabel: "English",
    filterAll: "All",

    // Home Page
    homeHeroBadge: "Prestigious Education • Global Academic Standards",
    homeHeroTitle: "Broad Horizons.. For Endless Knowledge",
    homeHeroSubtitle: "Guiding your children through an enriching educational journey combining Quran mastery, Arabic fluency, and accredited curricula taught by elite specialized educators.",
    homeHeroHighlight1: "Accredited curricula for every country & grade level",
    homeHeroHighlight2: "Certified instructors with verified Ijazat",
    homeHeroHighlight3: "Continuous progress tracking & close parent partnership",
    homeHeroCtaPrimary: "Start Learning Today",
    homeHeroCtaSecondary: "Explore Curricula",

    // Home Pillars
    pillarsTitle: "Pillars of Excellence at GoStars",
    pillarsSubtitle: "A balanced educational framework ensuring high academic standards and tangible learning outcomes",
    pillar1Title: "Elite Certified Educators",
    pillar1Desc: "Instructors meticulously selected for academic excellence, pedagogical mastery, and inspiring teaching.",
    pillar2Title: "Progressive & Structured Curricula",
    pillar2Desc: "Balanced study plans that adapt to individual pace, fostering comprehension and retention.",
    pillar3Title: "Precision Monitoring & Assessment",
    pillar3Desc: "A transparent assessment ecosystem providing parents with periodic in-depth analytical progress reports.",
    pillar4Title: "Safe & Inspiring Environment",
    pillar4Desc: "Interactive lessons focused on positive encouragement, confidence building, and a passion for learning.",

    // Featured Curricula Preview
    featuredCurriculaTitle: "Diverse Academic Tracks & Curricula",
    featuredCurriculaSubtitle: "Covering national, international, and Islamic curricula with precision and care",

    // Home Why GoStars
    homeWhyGoStarsTitle: "Why Families Choose GoStars Academy",
    homeWhyGoStarsSubtitle: "An experience uniting authentic values with modern pedagogical techniques",
    homeFeature1Title: "1-on-1 & Small Group Sessions",
    homeFeature1Desc: "Full undivided attention for every student ensuring deep comprehension and timely feedback.",
    homeFeature2Title: "Full Schedule Flexibility",
    homeFeature2Desc: "Customizable timetables accommodating global time zones and school commitments.",
    homeFeature3Title: "Periodic Progress Reports",
    homeFeature3Desc: "Transparent updates for parents on memorization, application, and reinforcement areas.",
    homeFeature4Title: "Values & Character Building",
    homeFeature4Desc: "Knowledge deeply intertwined with ethical conduct, manners, and authentic identity.",

    // Stats
    stat1Value: "1,500+",
    stat1Label: "Enrolled Students",
    stat2Value: "50+",
    stat2Label: "Certified Expert Teachers",
    stat3Value: "98%",
    stat3Label: "Parent Satisfaction Rate",
    stat4Value: "15+",
    stat4Label: "Countries Reached Worldwide",

    // CTA Banner
    ctaBannerTitle: "Begin Your Academic Journey with GoStars Today",
    ctaBannerSubtitle: "Join our academy family and experience real transformation in your children's proficiency and love for knowledge.",
    ctaBannerButton: "Request Enrollment & Assessment",

    // About Page
    aboutPageTitle: "About GoStars Academy",
    aboutPageSubtitle: "An educational institution built on authenticity and pedagogical innovation to nurture empowered generations",
    aboutStoryTitle: "Our Story & Educational Vision",
    aboutStoryP1: "GoStars Academy was founded on the firm belief that true education transcends mere memorization to develop cognitive intellect, refine skills, and instill noble character.",
    aboutStoryP2: "From the beginning, we designed a flexible educational ecosystem embracing diverse Arab, Islamic, and international curricula, led by inspiring educators who combine academic mastery with nurturing care.",
    aboutVisionTitle: "Our Vision",
    aboutVisionText: "To be the foremost trusted global educational destination delivering refined Quranic, linguistic, and academic learning that keeps pace with modern times while anchoring deep roots.",
    aboutMissionTitle: "Our Mission",
    aboutMissionText: "To deliver high-caliber interactive individual and group education fulfilling every student's goals across national and religious curricula through modern pedagogical strategies.",
    aboutValuesTitle: "Our Core Educational Values",
    aboutValuesSubtitle: "The guiding principles behind every classroom interaction and educational decision",
    value1Title: "Excellence & Mastery (Ihsan)",
    value1Desc: "We uphold rigorous academic and pedagogical standards in all materials and teaching methods.",
    value2Title: "Moral & Character Impact",
    value2Desc: "Knowledge is a tool to refine character, build balanced intellect, and anchor steadfast values.",
    value3Title: "Individual Learning Pace",
    value3Desc: "Every student has unique readiness; our duty is to deliver tailored instructional support.",
    value4Title: "Passion & Inspiration",
    value4Desc: "Transforming study into an enjoyable experience fostering curiosity and lifelong discovery.",
    value5Title: "Sincere Parent Partnership",
    value5Desc: "Continuous and transparent communication with families is essential to student success.",

    // Curricula Page (المناهج)
    curriculaPageTitle: "Academic Curricula & Tracks",
    curriculaPageSubtitle: "Browse our structured educational programs organized by Country, Grade Stage, and Subject",
    filterByCountry: "Select Country / Curriculum:",
    filterByStage: "Academic Stage:",
    filterBySubject: "Subject Area:",
    allCountries: "All Countries & Curricula",
    allStages: "All Academic Stages",
    allSubjects: "All Subjects",
    curriculaEmptyState: "No curricula found matching the selected filters. Try adjusting your search criteria.",
    curriculaEmptyStateReset: "Reset All Filters",
    curriculumGradeLabel: "Stage / Grade",
    curriculumSubjectLabel: "Subject",
    curriculumObjectivesLabel: "Learning Objectives:",
    curriculumTopicsLabel: "Key Units & Topics:",
    curriculumMaterialsLabel: "Prescribed References & Books:",
    requestCurriculumPlan: "Request Enrollment for this Curriculum",

    // Pricing Page (الأسعار)
    pricingPageTitle: "Tuition & Packages",
    pricingPageSubtitle: "Clear, transparent pricing designed to suit family needs with unmatched quality and academic oversight",
    pricingNote: "All packages include a free initial diagnostic assessment session and periodic progress reports.",
    planDurationMonthly: "Monthly",
    planPerLesson: "Per Lesson",
    currencyLabelUSD: "USD ($)",
    currencyLabelSAR: "SAR (ر.س)",
    currencyLabelEGP: "EGP (ج.م)",
    planFeatureSessions: "Live interactive sessions with dedicated teacher",
    planFeatureAssessment: "Complimentary diagnostic level evaluation",
    planFeatureReports: "Periodic progress & mastery reports for parents",
    planFeatureFlexibility: "Flexible timetable scheduling and rescheduling",
    planFeatureDirectTeacher: "Continuous teacher guidance & academic oversight",
    planCustomTitle: "Need a customized plan for siblings or multiple subjects?",
    planCustomDesc: "Our academic team can craft a consolidated family package with preferred rates matching your children's schedules.",
    planCustomButton: "Contact for Custom Plan",
    pricingFaqTitle: "Frequently Asked Questions About Tuition",
    pricingFaqSubtitle: "Clear answers to common questions from parents and prospective students",

    // Teachers Page (المعلمون)
    teachersPageTitle: "Our Faculty & Educators",
    teachersPageSubtitle: "A distinguished team of certified teachers, scholars, and educators in Quranic studies, Arabic language, and academic curricula",
    teachersFilterSubject: "Subject Specialization:",
    teachersExpLabel: "Experience:",
    teachersCertLabel: "Qualifications & Ijazat:",
    teachersApproachLabel: "Teaching Approach:",
    teachersDisclaimer: "GoStars Academy enforces strict privacy guidelines to protect educator and student data, providing a safe and professional environment.",

    // Honor Roll Page (لوحة الشرف)
    honorRollPageTitle: "Honor Roll & Wall of Excellence",
    honorRollPageSubtitle: "Celebrating our distinguished stars who demonstrated exceptional dedication, memorization milestones, and academic growth",
    honorFilterAll: "All Milestones",
    honorFilterQuran: "Quran Completion & Memorization",
    honorFilterArabic: "Arabic Language & Eloquence",
    honorFilterCommitment: "Exemplary Attendance & Diligence",
    honorAchievementLabel: "Academic Milestone:",
    honorQuoteLabel: "Supervisor's Commendation:",
    honorInspirationTitle: "Become the Next Star on Our Honor Board",
    honorInspirationText: "Every step in your learning journey brings you closer to mastery. Our academic team is ready to guide your ascent.",

    // Admissions
    admissionsPageTitle: "Admissions & Enrollment",
    admissionsPageSubtitle: "Simple steps to join the GoStars student community and begin your educational journey",
    enrollStepsTitle: "Enrollment Stages",
    enrollStep1Title: "1. Submit Initial Inquiry",
    enrollStep1Desc: "Fill in the basic form and select your desired curriculum or track.",
    enrollStep2Title: "2. Consultation & Scheduling",
    enrollStep2Desc: "An academic counselor contacts you to schedule the assessment and discuss preferred hours.",
    enrollStep3Title: "3. Diagnostic Evaluation",
    enrollStep3Desc: "A brief, friendly online session to evaluate readiness and establish the ideal starting level.",
    enrollStep4Title: "4. Schedule Confirmation & Launch",
    enrollStep4Desc: "Finalize timings and commence live sessions with your assigned dedicated instructor.",
    inquiryFormTitle: "Enrollment Inquiry Form",
    inquiryFormSubtitle: "Please enter your details and our academic admissions team will contact you within 24 hours.",
    formParentName: "Parent / Guardian Full Name",
    formStudentName: "Student Full Name",
    formStudentAge: "Student Age",
    formEmail: "Email Address",
    formPhone: "Phone / WhatsApp (with country code)",
    formCountry: "Country / Target Curriculum",
    formInterestedSubject: "Subject or Academic Area",
    formNotes: "Additional Notes or Preferred Call Times",
    formSubmitBtn: "Submit Enrollment Inquiry",
    formSuccessMessage: "Thank you! Your inquiry has been received and our admissions team will contact you shortly.",

    // Contact
    contactPageTitle: "Contact GoStars Academy",
    contactPageSubtitle: "Our academic team is delighted to assist with your questions and provide tailored guidance",
    contactChannelsTitle: "General Contact Channels",
    contactAddressLabel: "Location & Scope:",
    contactPhoneLabel: "Customer Support & WhatsApp:",
    contactEmailLabel: "Official Email Address:",
    contactHoursLabel: "Academic Office & Support Hours:",
    contactFormSendBtn: "Send Message",
    contactFormSuccess: "Your message has been sent successfully! We will get in touch with you promptly.",

    // Footer
    footerAboutText: "A premier educational academy offering specialized tracks in Quran, Arabic Language, and national & international curricula with distinguished academic rigor.",
    footerQuickLinks: "Quick Navigation",
    footerAcademicCurricula: "Curricula & Tracks",
    footerContactInfo: "Contact Information",
    footerAccreditation: "GoStars Educational Academy - Broad Horizons for Endless Knowledge",

    // Future Portals
    portalModalTitle: "GoStars Academy Portal",
    portalModalDesc: "The student, parent, and teacher portal login gateway will be activated in an upcoming phase of our platform.",
    portalModalClose: "Close Window",
  }
};
