export interface TeacherPublicProfile {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  title: {
    ar: string;
    en: string;
  };
  specialization: 'quran' | 'arabic' | 'islamic' | 'foundation';
  specializationLabel: {
    ar: string;
    en: string;
  };
  experienceYears: number;
  qualifications: {
    ar: string[];
    en: string[];
  };
  teachingPhilosophy: {
    ar: string;
    en: string;
  };
  featuredTag?: {
    ar: string;
    en: string;
  };
}

export const MOCK_TEACHERS: TeacherPublicProfile[] = [
  {
    id: 'teacher-1',
    name: {
      ar: 'الشيخ د. أحمد المنشاوي',
      en: 'Dr. Ahmad Al-Minshawi',
    },
    title: {
      ar: 'كبير معلمي القرآن والقراءات العشر',
      en: 'Senior Scholar of Quranic Readings',
    },
    specialization: 'quran',
    specializationLabel: {
      ar: 'القرآن الكريم والقراءات',
      en: 'Holy Quran & Ten Qira\'at',
    },
    experienceYears: 14,
    qualifications: {
      ar: [
        'إجازة مسندة بالسند المتصل في القراءات العشر الصغرى والكبرى',
        'دكتوراه في الدراسات القرآنية وعلوم التفسير - جامعة الأزهر',
        'خبرة أكثر من ١٤ عامًا في تحفيظ القرآن وإقراء الأعاجم والناطقين بالعربية',
      ],
      en: [
        'Certified Ijazah with continuous Sanad in the Ten Qira\'at',
        'PhD in Quranic Sciences & Exegesis - Al-Azhar University',
        '14+ years of pedagogical expertise in Quran memorization and recitation',
      ],
    },
    teachingPhilosophy: {
      ar: '«القرآن يُتلقى بالحب والإتقان والصبر؛ نعتمد التدرج الصوتي وضبط مخارج الحروف برفق حتى ينطق لسان الطالب بآيات الذكر غضة طرية كما أُنزلت».',
      en: '"The Quran is received with love, precision, and patience. We focus on phonetic refinement and gentle progression until recitation flows naturally."',
    },
    featuredTag: {
      ar: 'مشرف قسم الإجازات',
      en: 'Head of Ijazah Track',
    },
  },
  {
    id: 'teacher-2',
    name: {
      ar: 'الأستاذة مريم الفارس',
      en: 'Ustadhah Maryam Al-Fares',
    },
    title: {
      ar: 'معلمة لغة عربية وبلاغة وتأسيس',
      en: 'Instructor of Arabic & Rhetoric',
    },
    specialization: 'arabic',
    specializationLabel: {
      ar: 'اللغة العربية واللسان',
      en: 'Arabic Language & Fluency',
    },
    experienceYears: 10,
    qualifications: {
      ar: [
        'ماجستير في المناهج وطرق تدريس اللغة العربية - جامعة عين شمس',
        'ليسانس آداب لغة عربية ودراسات إسلامية بمرتبة الشرف',
        'مدربة معتمدة في مهارات القراءة السريعة والتعبير الإبداعي',
      ],
      en: [
        'Master’s in Arabic Curriculum & Pedagogy - Ain Shams University',
        'Bachelor of Arts in Arabic & Islamic Studies with Honors',
        'Certified trainer in advanced reading fluency and creative expression',
      ],
    },
    teachingPhilosophy: {
      ar: '«اللغة العربية ليست مجرد قواعد جافة؛ بل هي ذوق وبلاغة وهوية. نحرص على تحويل دروس النحو والبلاغة إلى أسلوب حياة ومحادثة عذبة».',
      en: '"Arabic is not dry grammar; it is eloquence, culture, and aesthetic expression. We turn grammar into fluent, confident conversational mastery."',
    },
    featuredTag: {
      ar: 'مشرفة قسم اللسان العربي',
      en: 'Lead Arabic Educator',
    },
  },
  {
    id: 'teacher-3',
    name: {
      ar: 'الشيخ عبد الرحمن السعيد',
      en: 'Sheikh Abdulrahman Al-Saeed',
    },
    title: {
      ar: 'معلم الفقه والسيرة النبوية والتربية الإسلامية',
      en: 'Instructor of Islamic Jurisprudence & Seerah',
    },
    specialization: 'islamic',
    specializationLabel: {
      ar: 'الدراسات الإسلامية والسيرة',
      en: 'Islamic Studies & Character',
    },
    experienceYears: 11,
    qualifications: {
      ar: [
        'بكالوريوس الشريعة الإسلامية - كلية الشريعة والقانون',
        'دبلوم تربوي في مهارات توجيه الناشئة واليافعين',
        'إجازة في متون العقيدة والفقه والحديث النبوي الشريف',
      ],
      en: [
        'Bachelor of Islamic Sharia - Faculty of Sharia & Law',
        'Postgraduate Educational Diploma in Youth Mentorship',
        'Certified Ijazah in classical texts of Aqeedah, Fiqh, and Hadith',
      ],
    },
    teachingPhilosophy: {
      ar: '«غايتنا أن يعيش الطالب مع السيرة النبوية ويتمثل أخلاق النبي ﷺ في تعامله اليومي مع أسرته ومدرسته ومجتمعه».',
      en: '"Our ultimate goal is for students to internalize the Prophetic character and exemplify noble morals in their daily interactions."',
    },
  },
  {
    id: 'teacher-4',
    name: {
      ar: 'الأستاذة فاطمة الزهراء النجار',
      en: 'Ustadhah Fatima An-Najjar',
    },
    title: {
      ar: 'أخصائية التأسيس القرائي والقاعدة النورانية للصغار',
      en: 'Early Childhood Phonics & Nooraniyah Specialist',
    },
    specialization: 'foundation',
    specializationLabel: {
      ar: 'تأسيس الأطفال والقاعدة النورانية',
      en: 'Early Phonics & Foundation',
    },
    experienceYears: 8,
    qualifications: {
      ar: [
        'إجازة معتمدة في تدريس القاعدة النورانية بتقدير ممتاز',
        'بكالوريوس رياض أطفال وتربية طفولة مبكرة',
        'خبرة واسعة في استخدام الوسائل التعليمية البصرية والقصص التفاعلية',
      ],
      en: [
        'Certified Teacher in Al-Qaidah An-Nooraniyyah with Distinction',
        'Bachelor in Early Childhood Education & Development',
        'Extensive expertise in multisensory learning tools and interactive storytelling',
      ],
    },
    teachingPhilosophy: {
      ar: '«كل طفل عالم قائم بذاته؛ بالابتسامة والصبر والأسلوب الحركي المحفز نصنع منه قارئًا متقنًا ومحبًا للقرآن منذ أول خطوة».',
      en: '"Every child is unique; with patience, visual games, and warm encouragement, we foster confident young readers who love the Quran."',
    },
    featuredTag: {
      ar: 'مسؤولة برنامج نجوم المستقبل',
      en: 'Young Stars Coordinator',
    },
  },
  {
    id: 'teacher-5',
    name: {
      ar: 'الشيخ محمد كمال عبد الله',
      en: 'Sheikh Muhammad Kamal',
    },
    title: {
      ar: 'معلم القرآن والتجويد والمناهج الأزهرية',
      en: 'Quran & Al-Azhar Curriculum Educator',
    },
    specialization: 'quran',
    specializationLabel: {
      ar: 'القرآن الكريم والمناهج الأزهرية',
      en: 'Quran & Azhari Curricula',
    },
    experienceYears: 12,
    qualifications: {
      ar: [
        'إجازة في القرآن الكريم بروايتي حفص وشعبة عن عاصم',
        'خريج كلية القرآن الكريم للقراءات وعلومها - طنطا',
        'مدرس معتمد للمناهج الأزهرية والمقررات الوزارية',
      ],
      en: [
        'Certified Ijazah in Quran recitation (Hafs & Shu’bah)',
        'Graduate of Faculty of Holy Quran & Qira’at',
        'Accredited instructor for official ministerial and Al-Azhar study plans',
      ],
    },
    teachingPhilosophy: {
      ar: '«الحفظ الرصين يبنى على المراجعة المتينة والتثبيت المتقن؛ نراعي طاقة الطالب ونبني معه عادة المراجعة اليومية الراسخة».',
      en: '"Solid retention is built on structured revision; we adapt to the student’s stamina and instill an unbreakable daily revision habit."',
    },
  },
  {
    id: 'teacher-6',
    name: {
      ar: 'الأستاذة هدى سليمان',
      en: 'Ustadhah Huda Sulaiman',
    },
    title: {
      ar: 'معلمة مناهج وطنية ولغة عربية للمرحلة المتوسطة والثانوية',
      en: 'National Curricula & High School Arabic Specialist',
    },
    specialization: 'arabic',
    specializationLabel: {
      ar: 'المناهج الوطنية واللغة العربية',
      en: 'National School Curricula',
    },
    experienceYears: 9,
    qualifications: {
      ar: [
        'ليسانس لغة عربية وآدابها - جامعة القاهرة',
        'خبرة تخصصية في المناهج الخليجية والمصرية للثانوية العامة',
        'سجل حافل في إعداد الطلاب للاختبارات المعيارية والتحصيلية',
      ],
      en: [
        'Bachelor of Arabic Literature - Cairo University',
        'Specialized expertise in Gulf and Egyptian national high school curricula',
        'Proven track record in preparing students for standardized and national exams',
      ],
    },
    teachingPhilosophy: {
      ar: '«تبسيط المعقد وربط القواعد بالأمثلة الحية يزيل أي رهبة من المناهج المدرسية ويقود الطالب نحو الدرجة الكاملة بثقة».',
      en: '"Simplifying abstract syntax and connecting it with live examples eliminates exam anxiety and leads students to top marks with confidence."',
    },
  },
];
