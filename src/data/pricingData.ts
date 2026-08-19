export interface PricingPlan {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  badge?: {
    ar: string;
    en: string;
  };
  popular?: boolean;
  lessonsPerMonth: number;
  durationPerLesson: string;
  priceUSD: number;
  priceSAR: number;
  priceEGP: number;
  description: {
    ar: string;
    en: string;
  };
  features: {
    ar: string[];
    en: string[];
  };
  target: {
    ar: string;
    en: string;
  };
}

export interface PricingFaq {
  id: string;
  question: {
    ar: string;
    en: string;
  };
  answer: {
    ar: string;
    en: string;
  };
}

export const MOCK_PRICING_PLANS: PricingPlan[] = [
  {
    id: 'plan-starter',
    name: {
      ar: 'الباقة الأساسية (حصتان أسبوعيًا)',
      en: 'Essential Plan (2 Lessons / Week)',
    },
    popular: false,
    lessonsPerMonth: 8,
    durationPerLesson: '30 - 45 min',
    priceUSD: 45,
    priceSAR: 169,
    priceEGP: 1200,
    description: {
      ar: 'مثالية لتأسيس الصغار، الحفظ التدريجي الهادئ، أو متابعة مادة دراسية واحدة بانتظام.',
      en: 'Ideal for early learners, steady memorization, or focused assistance in a single subject.',
    },
    features: {
      ar: [
        '٨ حصص فردية مباشرة شهريًا (1-on-1)',
        'معلم متخصص مكرس للطالب',
        'جلسة تقييم وتحديد مستوى مجانية',
        'تقرير شهري شامل لمتابعة التقدم',
        'مرونة في تعويض الحصص المعتذر عنها مسبقًا',
      ],
      en: [
        '8 one-on-one live sessions per month',
        'Dedicated qualified instructor',
        'Complimentary diagnostic evaluation',
        'Comprehensive monthly progress report',
        'Flexible makeup policy for pre-notified cancellations',
      ],
    },
    target: {
      ar: 'التأسيس والمتابعة المستمرة للأطفال والناشئة',
      en: 'Foundational learning and steady tracking for kids',
    },
  },
  {
    id: 'plan-advanced',
    name: {
      ar: 'باقة التميز المكثف (٣ حصص أسبوعيًا)',
      en: 'Excellence Plan (3 Lessons / Week)',
    },
    badge: {
      ar: 'الأكثر اختيارًا',
      en: 'Most Popular',
    },
    popular: true,
    lessonsPerMonth: 12,
    durationPerLesson: '45 - 60 min',
    priceUSD: 65,
    priceSAR: 245,
    priceEGP: 1750,
    description: {
      ar: 'الخيار الأفضل للإنجاز السريع في حفظ القرآن الكريم، إتقان التجويد واللغة العربية، أو التفوق في المناهج الوزارية.',
      en: 'The optimal balance for rapid Quran memorization, Arabic fluency, and school curriculum excellence.',
    },
    features: {
      ar: [
        '١٢ حصة فردية مباشرة شهريًا (1-on-1)',
        'معلم أو معلمة من نخبة الكوادر المجازة',
        'خطة دراسية مخصصة وأهداف أسبوعية واضحة',
        'تقريرين شهريين مفصلين لولي الأمر',
        'أولوية في اختيار أوقات الحصص المفضلة',
        'متابعة دورية مباشرة من المشرف الأكاديمي',
      ],
      en: [
        '12 one-on-one live sessions per month',
        'Elite certified educator with verified Ijazah',
        'Custom curriculum roadmap with weekly milestones',
        'Bi-weekly detailed progress reports for parents',
        'Priority scheduling for peak time slots',
        'Direct periodic supervision by Academic Coordinator',
      ],
    },
    target: {
      ar: 'الطلاب الراغبون في الحفظ السريع والتمكن اللغوي والأكاديمي',
      en: 'Students pursuing faster Quran completion & academic mastery',
    },
  },
  {
    id: 'plan-intensive',
    name: {
      ar: 'الباقة اليومية المكثفة (٥ حصص أسبوعيًا)',
      en: 'Intensive Daily Track (5 Lessons / Week)',
    },
    popular: false,
    lessonsPerMonth: 20,
    durationPerLesson: '45 - 60 min',
    priceUSD: 99,
    priceSAR: 375,
    priceEGP: 2600,
    description: {
      ar: 'برنامج يومي متكامل لمدارسة القرآن، المعاهد الأزهرية، المناهج الوزارية المكثفة، أو برامج الإجازة والسند.',
      en: 'Comprehensive daily immersive pathway for rapid memorization, Azhari studies, or Ijazah certification.',
    },
    features: {
      ar: [
        '٢٠ حصة فردية مباشرة شهريًا (1-on-1)',
        'تدريب يومي مستمر لضمان أعلى معدلات التثبيت',
        'إشراف مباشر من كبار المقرئين والمشرفين',
        'تقارير أداء ومتابعة أسبوعية دقيقة',
        'مرونة قصوى وتنسيق جدول مخصص بالكامل',
      ],
      en: [
        '20 one-on-one live sessions per month',
        'Daily immersive practice for maximal retention',
        'Direct mentorship from senior scholars & supervisors',
        'Weekly in-depth performance analytics',
        'Maximum scheduling flexibility & dedicated support',
      ],
    },
    target: {
      ar: 'الراغبون في ختم القرآن، برامج الإجازة، ومناهج الشهادات',
      en: 'Quran completion candidates, Ijazah seekers, and exam tracks',
    },
  },
];

export const MOCK_PRICING_FAQS: PricingFaq[] = [
  {
    id: 'faq-1',
    question: {
      ar: 'هل يمكنني تجربة الحصص قبل دفع الرسوم؟',
      en: 'Can I try a session before making a payment?',
    },
    answer: {
      ar: 'نعم بكل تأكيد. تقدم أكاديمية GoStars جلسة تقييم وتحديد مستوى مجانية وتفاعلية للتعرف على المعلم والمنهج والاطمئنان لملاءمة البرنامج قبل إتمام الاشتراك.',
      en: 'Yes, absolutely. GoStars Academy offers a complimentary diagnostic assessment session to evaluate readiness, meet the educator, and ensure total satisfaction before enrollment.',
    },
  },
  {
    id: 'faq-2',
    question: {
      ar: 'ماذا يحدث إذا تعذر على الطالب حضور إحدى الحصص؟',
      en: 'What happens if a student cannot attend a scheduled session?',
    },
    answer: {
      ar: 'نقدر التزامات الأسرة وظروفها الطارئة. في حال إشعار الإدارة أو المعلم قبل موعد الحصة بـ ٤ ساعات على الأقل، يتم جدولة حصة تعويضية في موعد مناسب دون خصمها من الرصيد.',
      en: 'We understand family commitments. As long as notice is provided at least 4 hours in advance, a makeup session will be scheduled at a convenient time with zero penalty.',
    },
  },
  {
    id: 'faq-3',
    question: {
      ar: 'هل تتوفر خصومات للأخوة أو الاشتراكات العائلية؟',
      en: 'Are sibling discounts or family packages available?',
    },
    answer: {
      ar: 'نعم، نقدم باقات عائلية بخصومات خاصة تبدأ من ١٠٪ للطفل الثاني فأكثر، بالإضافة إلى باقات مخصصة لمن يدرس أكثر من مسار دراسي في نفس الوقت.',
      en: 'Yes, we provide tiered family discounts starting at 10% for the second enrolled sibling, as well as bundled rates for multi-subject enrollments.',
    },
  },
  {
    id: 'faq-4',
    question: {
      ar: 'ما هي طرق الدفع المتاحة في الأكاديمية؟',
      en: 'What payment methods are supported?',
    },
    answer: {
      ar: 'نوفر قنوات دفع إلكترونية آمنة ومتنوعة تشمل البطاقات البنكية الدولية (Visa / Mastercard)، التحويلات البنكية المباشرة، وسائل الدفع المحلية (مثل مدى و STC Pay داخل السعودية، وفودافون كاش وإنستاباي داخل مصر).',
      en: 'We support secure payment options including international credit/debit cards (Visa/Mastercard), bank transfers, and local payment methods (Mada/STC Pay in Saudi Arabia, InstaPay/Vodafone Cash in Egypt).',
    },
  },
];
