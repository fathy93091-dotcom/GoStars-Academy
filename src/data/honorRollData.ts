export interface HonorRollStar {
  id: string;
  studentDisplayName: {
    ar: string;
    en: string;
  };
  country: {
    ar: string;
    en: string;
    code: string; // flag emoji or code
  };
  category: 'quran_complete' | 'quran_milestone' | 'arabic_mastery' | 'commitment';
  categoryBadge: {
    ar: string;
    en: string;
  };
  achievementTitle: {
    ar: string;
    en: string;
  };
  achievementDetail: {
    ar: string;
    en: string;
  };
  completionDate: string;
  teacherPraise: {
    ar: string;
    en: string;
  };
  starsCount: number;
  highlighted?: boolean;
}

export const MOCK_HONOR_STARS: HonorRollStar[] = [
  {
    id: 'star-1',
    studentDisplayName: {
      ar: 'الطالب عمر خ.',
      en: 'Omar Kh.',
    },
    country: {
      ar: 'المملكة العربية السعودية',
      en: 'Saudi Arabia',
      code: '🇸🇦',
    },
    category: 'quran_complete',
    categoryBadge: {
      ar: 'ختم القرآن الكريم كاملاً',
      en: 'Quran Full Completion',
    },
    achievementTitle: {
      ar: 'إتمام حفظ القرآن الكريم كاملاً برواية حفص عن عاصم',
      en: 'Completed full Quran memorization with Hafs recitation',
    },
    achievementDetail: {
      ar: 'أتم حفظ المصحف الشريف كاملًا مع الضبط التام لأحكام التجويد ومخارج الحروف خلال ١٨ شهرًا من الالتزام المثالي.',
      en: 'Memorized all 30 Juz with rigorous Tajweed precision within 18 months of diligent dedication.',
    },
    completionDate: '٢٠٢٦ م / رجب ١٤٤٧ هـ',
    teacherPraise: {
      ar: '«نموذج يُحتذى في الانضباط والمواظبة وسرعة الاستيعاب، بارك الله فيه وفي والديه الكرام».',
      en: '"An outstanding role model in discipline, retention, and reverence for the Holy Quran."',
    },
    starsCount: 5,
    highlighted: true,
  },
  {
    id: 'star-2',
    studentDisplayName: {
      ar: 'الطالبة سارة م.',
      en: 'Sarah M.',
    },
    country: {
      ar: 'دولة الإمارات العربية المتحدة',
      en: 'United Arab Emirates',
      code: '🇦🇪',
    },
    category: 'quran_milestone',
    categoryBadge: {
      ar: 'حفظ ١٥ جزءًا متتاليًا',
      en: '15 Juz Milestone',
    },
    achievementTitle: {
      ar: 'إتمام حفظ النصف الأول من القرآن الكريم',
      en: 'Memorization of the first half of the Holy Quran',
    },
    achievementDetail: {
      ar: 'حفظ متقن من سورة البقرة حتى سورة الإسراء مع مراجعة تراكمية منتظمة وتقدير ممتاز في كافة الاختبارات الشهرية.',
      en: 'Mastery from Surah Al-Baqarah to Surah Al-Isra with cumulative revision and straight A evaluations.',
    },
    completionDate: '٢٠٢٦ م / شعبان ١٤٤٧ هـ',
    teacherPraise: {
      ar: '«صوت ندي وتلاوة خاشعة والتزام تام بورد المراجعة اليومي، نجمة متألقة في سماء GoStars».',
      en: '"Melodious recitation and steady daily revision habit; a shining star in our academy."',
    },
    starsCount: 5,
    highlighted: true,
  },
  {
    id: 'star-3',
    studentDisplayName: {
      ar: 'الطالب ياسين ع.',
      en: 'Yaseen A.',
    },
    country: {
      ar: 'جمهورية مصر العربية',
      en: 'Egypt',
      code: '🇪🇬',
    },
    category: 'arabic_mastery',
    categoryBadge: {
      ar: 'التفوق اللغوي والبلاغي',
      en: 'Arabic & Rhetoric Distinction',
    },
    achievementTitle: {
      ar: 'المركز الأول في مسابقة الإلقاء والنحو الوظيفي',
      en: '1st Place in Functional Syntax & Public Speaking',
    },
    achievementDetail: {
      ar: 'إتقان الإعراب التام وتطبيق قواعد النحو والبلاغة في كتابة المقالات والتحدث بالفصحى بطلاقة وثقة بالغة.',
      en: 'Exceptional mastery in parsing, grammatical analysis, and fluent spoken classical Arabic.',
    },
    completionDate: '٢٠٢٦ م',
    teacherPraise: {
      ar: '«يتمتع بفصاحة اللسان والشغف بعلوم لغة الضاد؛ يكتب بأسلوب أدبي رصين يفوق سنه».',
      en: '"Possesses natural eloquence and deep love for Arabic literature; writes with profound elegance."',
    },
    starsCount: 5,
    highlighted: false,
  },
  {
    id: 'star-4',
    studentDisplayName: {
      ar: 'الطالب عبد الله ت.',
      en: 'Abdullah T.',
    },
    country: {
      ar: 'دولة الكويت',
      en: 'Kuwait',
      code: '🇰🇼',
    },
    category: 'commitment',
    categoryBadge: {
      ar: 'نجم المواظبة والانضباط',
      en: 'Exemplary Commitment Star',
    },
    achievementTitle: {
      ar: 'حضور ١٠٠٪ دون أي غياب على مدار عام دراسي كامل',
      en: '100% Perfect Attendance over full academic year',
    },
    achievementDetail: {
      ar: 'التزام تام بالحضور في الموعد المحدد، وتحضير الواجبات المنزلية، والحرص على المشاركة الفعالة في كل دقيقة من الحصة.',
      en: 'Impeccable punctuality, proactive homework completion, and continuous active engagement in every session.',
    },
    completionDate: '٢٠٢٦ م',
    teacherPraise: {
      ar: '«الالتزام والمواظبة هما سر النجاح الحقيقي؛ عبد الله يجسد المعنى الحقيقي لشغف طلب العلم».',
      en: '"Consistency and discipline are the true foundation of excellence; Abdullah embodies genuine dedication."',
    },
    starsCount: 5,
    highlighted: false,
  },
  {
    id: 'star-5',
    studentDisplayName: {
      ar: 'الطالبة لينة ح.',
      en: 'Lina H.',
    },
    country: {
      ar: 'المملكة المتحدة (مغتربون)',
      en: 'United Kingdom (Diaspora)',
      code: '🇬🇧',
    },
    category: 'quran_milestone',
    categoryBadge: {
      ar: 'إتمام جزء عم وتبارك',
      en: 'Juz Amma & Tabarak Mastery',
    },
    achievementTitle: {
      ar: 'إتقان القراءة بالحركات وحفظ جزأي عم وتبارك',
      en: 'Full literacy with vowels and memorizing Juz 29 & 30',
    },
    achievementDetail: {
      ar: 'انطلقت من الصفر في تعلم الحروف عبر القاعدة النورانية، وخلال عام استطاعت قراءة المصحف وحفظ جزأين كاملين بالتجويد.',
      en: 'Started from zero through Nooraniyah phonics and progressed within a year to independent Quran recitation.',
    },
    completionDate: '٢٠٢٦ م',
    teacherPraise: {
      ar: '«إصرار مبهر لتعلم لغة القرآن رغم الإقامة في المهجر؛ فخورون جدًا بما أنجزته لينة».',
      en: '"Inspiring determination to master Arabic and Quran despite living abroad; we are deeply proud of Lina."',
    },
    starsCount: 5,
    highlighted: false,
  },
  {
    id: 'star-6',
    studentDisplayName: {
      ar: 'الطالب حمزة ن.',
      en: 'Hamza N.',
    },
    country: {
      ar: 'دولة قطر',
      en: 'Qatar',
      code: '🇶🇦',
    },
    category: 'quran_milestone',
    categoryBadge: {
      ar: 'حفظ ١٠ أجزاء متقنة',
      en: '10 Juz Certified Milestone',
    },
    achievementTitle: {
      ar: 'إتمام حفظ ١٠ أجزاء مع متن تحفة الأطفال',
      en: '10 Juz Memorization with Tuhfat Al-Atfal poem',
    },
    achievementDetail: {
      ar: 'حفظ متين للأجزاء العشرة الأولى مع حفظ متن تحفة الأطفال كاملًا وفهم قواعده وأحكامه النظرية والعملية.',
      en: 'Solid memorization of 10 Juz accompanied by memorizing the classical Tajweed didactic poem Tuhfat Al-Atfal.',
    },
    completionDate: '٢٠٢٦ م',
    teacherPraise: {
      ar: '«تمكن استثنائي في التطبيق الصوتي وحفظ المتون العلمية، نرجو له مستقبلًا مشرقًا في الإقراء».',
      en: '"Exceptional phonetic execution and classical text retention; a promising future in Quranic scholarship."',
    },
    starsCount: 5,
    highlighted: false,
  },
];
