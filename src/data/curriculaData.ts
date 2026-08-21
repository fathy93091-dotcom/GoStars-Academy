export interface CurriculumItem {
  id: string;
  country: 'egypt' | 'saudi' | 'uae' | 'kuwait' | 'azhar' | 'international' | string;
  stage: 'foundation' | 'primary' | 'middle' | 'secondary' | string;
  subject: 'quran' | 'arabic' | 'english' | 'islamic' | 'science_math' | 'nooraniyah' | 'general' | string;
  title: {
    ar: string;
    en: string;
  };
  gradeLabel: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  objectives: {
    ar: string[];
    en: string[];
  };
  topics: {
    ar: string[];
    en: string[];
  };
  referenceBooks: {
    ar: string[];
    en: string[];
  };
}

export const COUNTRIES_CONFIG = [
  { id: 'all', label: { ar: 'كافة الدول والمناهج', en: 'All Countries & Curricula' } },
  { id: 'egypt', label: { ar: 'المنهج المصري', en: 'Egyptian Curriculum' } },
  { id: 'saudi', label: { ar: 'المنهج السعودي', en: 'Saudi Curriculum' } },
  { id: 'uae', label: { ar: 'المنهج الإماراتي', en: 'UAE Curriculum' } },
  { id: 'kuwait', label: { ar: 'المنهج الكويتي', en: 'Kuwaiti Curriculum' } },
  { id: 'azhar', label: { ar: 'المنهج الأزهري النموذجي', en: 'Al-Azhar Curriculum' } },
  { id: 'international', label: { ar: 'المنهج الدولي والعام', en: 'International / General' } },
];

export const STAGES_CONFIG = [
  { id: 'all', label: { ar: 'كافة المراحل', en: 'All Stages' } },
  { id: 'foundation', label: { ar: 'التأسيس ورياض الأطفال', en: 'Foundation & KG' } },
  { id: 'primary', label: { ar: 'المرحلة الابتدائية', en: 'Primary / Elementary' } },
  { id: 'middle', label: { ar: 'المرحلة الإعدادية / المتوسطة', en: 'Middle / Preparatory' } },
  { id: 'secondary', label: { ar: 'المرحلة الثانوية', en: 'Secondary / High School' } },
];

export const SUBJECTS_CONFIG = [
  { id: 'all', label: { ar: 'كافة المواد', en: 'All Subjects' } },
  { id: 'quran', label: { ar: 'القرآن الكريم والتجويد', en: 'Quran & Tajweed' } },
  { id: 'arabic', label: { ar: 'اللغة العربية واللسان', en: 'Arabic Language' } },
  { id: 'english', label: { ar: 'اللغة الإنجليزية', en: 'English Language' } },
  { id: 'islamic', label: { ar: 'التربية الإسلامية والفقه', en: 'Islamic Education & Fiqh' } },
  { id: 'science_math', label: { ar: 'العلوم والرياضيات', en: 'Science & Math' } },
  { id: 'nooraniyah', label: { ar: 'القاعدة النورانية والتهجئة', en: 'Nooraniyah & Phonics' } },
  { id: 'general', label: { ar: 'مواد عامة وتأسيسية', en: 'General Studies' } },
];

export const MOCK_CURRICULA: CurriculumItem[] = [
  {
    id: 'curr-quran-all-1',
    country: 'international',
    stage: 'primary',
    subject: 'quran',
    title: {
      ar: 'منهج حفظ وتجويد القرآن الكريم (المستوى التأسيسي والمتوسط)',
      en: 'Quran Memorization & Tajweed Curriculum (Foundational & Intermediate)',
    },
    gradeLabel: {
      ar: 'المرحلة الابتدائية (الصفوف ١ - ٦)',
      en: 'Primary Grades (1 - 6)',
    },
    description: {
      ar: 'منهج قرآني شامل يعتمد التلقين المباشر، وضبط مخارج الحروف، وحفظ الأجزاء المقررة مع التطبيق العملي لأحكام النون الساكنة والتنوين والمدود.',
      en: 'Comprehensive Quranic track utilizing oral recitation, phoneme articulation, and practical Tajweed rules covering Noon Sakinah, Tanween, and elongation.',
    },
    objectives: {
      ar: [
        'حفظ جزء عم وجزء تبارك مع التلاوة المتقنة',
        'تطبيق أحكام التجويد الأساسية أثناء التلاوة',
        'فهم المعاني الإجمالية ومفردات السور المقررة',
        'تعويد الطالب على الورد اليومي والمراجعة المستمرة',
      ],
      en: [
        'Memorize Juz Amma & Juz Tabarak with accurate recitation',
        'Apply essential Tajweed rules seamlessly while reciting',
        'Understand thematic meanings and vocabulary of surahs',
        'Establish a consistent daily recitation and revision habit',
      ],
    },
    topics: {
      ar: ['مخارج وصفات الحروف', 'أحكام النون الساكنة والتنوين', 'أحكام الميم الساكنة', 'المدود وتطبيقاتها', 'آداب حامل القرآن'],
      en: ['Phoneme Articulation Points', 'Rules of Noon Sakinah & Tanween', 'Rules of Meem Sakinah', 'Madd (Elongations)', 'Quranic Etiquette'],
    },
    referenceBooks: {
      ar: ['المصحف الشريف برواية حفص عن عاصم', 'تحفة الأطفال للجمزوري', 'المختصر في التفسير'],
      en: ['The Holy Quran (Hafs)', 'Tuhfat Al-Atfal', 'Al-Mukhtasar in Tafseer'],
    },
  },
  {
    id: 'curr-arabic-saudi-1',
    country: 'saudi',
    stage: 'primary',
    subject: 'arabic',
    title: {
      ar: 'منهج لغتي الجميلة - المنهج السعودي المعتمد',
      en: 'Saudi Curriculum - My Beautiful Language (Elementary)',
    },
    gradeLabel: {
      ar: 'الصفوف الابتدائية (١ - ٦)',
      en: 'Elementary Grades (1 - 6)',
    },
    description: {
      ar: 'تغطية شاملة ومبسطة لكتاب "لغتي" المعتمد في وزارة التعليم السعودية، مع التركيز على فهم المقروء، القواعد النحوية، الإملاء السليم، والتعبير الإبداعي.',
      en: 'Structured coverage of the Saudi Ministry of Education Arabic textbook, focusing on reading comprehension, grammar, orthography, and creative expression.',
    },
    objectives: {
      ar: [
        'تنمية مهارات القراءة الجهرية السليمة وفهم النصوص',
        'إتقان القواعد النحوية المحددة لكل صف (المبتدأ والخبر، الفاعل، المفعول)',
        'معالجة الضعف الإملائي والهمزات والتاء المربوطة والمفتوحة',
        'التمكن من كتابة فقرات تعبيرية متناسقة',
      ],
      en: [
        'Develop fluent reading and text comprehension skills',
        'Master grade-level syntax (Subjects, Predicates, Objects)',
        'Address spelling weaknesses, Hamza rules, and Ta Marbutah',
        'Produce coherent paragraphs and expressive writing',
      ],
    },
    topics: {
      ar: ['الظواهر الإملائية والصوتية', 'الوظيفة النحوية والإعراب', 'الأساليب والتراكيب اللغوية', 'فهم المقروء والتحليل', 'الخط والإملاء'],
      en: ['Orthographic & Phonetic Rules', 'Grammatical Syntax & Parsing', 'Linguistic Structures', 'Reading Analysis', 'Penmanship & Dictation'],
    },
    referenceBooks: {
      ar: ['كتاب لغتي لوزارة التعليم السعودية', 'كراسة النشاط والتدريبات التطبيقية'],
      en: ['Saudi Ministry of Education "Lughati" Textbook', 'Applied Activity Workbooks'],
    },
  },
  {
    id: 'curr-islamic-egypt-1',
    country: 'egypt',
    stage: 'middle',
    subject: 'islamic',
    title: {
      ar: 'منهج التربية الدينية الإسلامية - المنهج المصري',
      en: 'Egyptian Curriculum - Islamic Religious Education (Preparatory)',
    },
    gradeLabel: {
      ar: 'المرحلة الإعدادية (الصفوف الأول والثاني والثالث)',
      en: 'Preparatory Grades (1st, 2nd, 3rd Prep)',
    },
    description: {
      ar: 'دراسة وحدات التربية الإسلامية المقررة في المنهج المصري شاملة العقيدة، فقه العبادات والمعاملات، السيرة النبوية، وشخصيات إسلامية ملهمة.',
      en: 'In-depth study of the Egyptian national curriculum in Islamic Education, covering creed, jurisprudence of worship, Prophetic biography, and historic role models.',
    },
    objectives: {
      ar: [
        'ترسيخ المفاهيم العقدية السليمة وحفظ الأحاديث النبوية المقررة',
        'إتقان أحكام العبادات العملية مثل الصلاة والصيام والزكاة',
        'استخلاص الدروس والعبر من السيرة النبوية والصحابة',
        'الاستعداد التام للاختبارات الوزارية وتحقيق الدرجات النهائية',
      ],
      en: [
        'Anchor sound doctrinal concepts and memorize prescribed Hadiths',
        'Master the jurisprudence of worship (Prayer, Fasting, Zakah)',
        'Extract life lessons from the Prophetic Seerah and Companions',
        'Prepare thoroughly for ministerial exams to achieve top marks',
      ],
    },
    topics: {
      ar: ['أركان الإيمان والإسلام', 'أحكام الطهارة والصلاة والصيام', 'غزوات النبي ﷺ وأخلاقه', 'شخصيات إسلامية رائدة', 'القيم والآداب المجتمعية'],
      en: ['Pillars of Faith & Islam', 'Rules of Purification & Prayer', 'Prophetic Expeditions & Character', 'Pioneering Islamic Figures', 'Social Values'],
    },
    referenceBooks: {
      ar: ['كتاب التربية الإسلامية - وزارة التربية والتعليم المصرية', 'ملخصات وبنوك الأسئلة الامتحانية'],
      en: ['Egyptian Ministry of Education Islamic Education Textbook', 'Curated Exam Question Banks'],
    },
  },
  {
    id: 'curr-nooraniyah-foundation',
    country: 'international',
    stage: 'foundation',
    subject: 'nooraniyah',
    title: {
      ar: 'منهج القاعدة النورانية والتأسيس القرائي للصغار',
      en: 'Nooraniyah Phonics & Early Reading Foundation',
    },
    gradeLabel: {
      ar: 'مرحلة رياض الأطفال والتأسيس (٤ - ٧ سنوات)',
      en: 'Kindergarten & Early Primary (Ages 4 - 7)',
    },
    description: {
      ar: 'المنهج الأكثر فاعلية لتعليم القراءة العربية والقرآنية من الصفر، يركز على أصوات الحروف، الحركات القصيرة والطويلة، السكون والشدة والتنوين بأسلوب شيق وجذاب.',
      en: 'The premier methodology for teaching Arabic and Quranic literacy from scratch, focusing on letter sounds, short/long vowels, Sukoon, Shaddah, and Tanween through engaging repetition.',
    },
    objectives: {
      ar: [
        'التعرف على الحروف الهجائية بأسمائها وأشكالها وأصواتها',
        'النطق الصحيح للحركات (الفتح، الكسر، الضم) والمدود',
        'القدرة على تهجئة وقراءة الكلمات القرآنية بصورة مستقلة',
        'بناء مخارج الحروف الفصيحة منذ الصغر وتجنب اللحن',
      ],
      en: [
        'Recognize Arabic alphabet names, shapes, and distinct phonemes',
        'Accurately vocalize short vowels and letter elongations',
        'Independently spell and read compound Quranic words',
        'Establish authentic pronunciation from early childhood',
      ],
    },
    topics: {
      ar: ['الحروف المفردة والمركبة', 'الحركات والتنوين', 'حروف المد واللين', 'السكون والشدة', 'تدريبات التهجي القرآني المباشر'],
      en: ['Individual & Connected Letters', 'Vowels & Tanween', 'Madd Letters', 'Sukoon & Shaddah', 'Direct Quranic Spelling Practice'],
    },
    referenceBooks: {
      ar: ['كتاب القاعدة النورانية - الطبعة الأصلية المعتمدة', 'البطاقات التفاعلية للتهجئة السريعة'],
      en: ['Al-Qaidah An-Nooraniyyah Official Edition', 'Interactive Phonics Flashcards'],
    },
  },
  {
    id: 'curr-azhar-primary',
    country: 'azhar',
    stage: 'primary',
    subject: 'islamic',
    title: {
      ar: 'منهج العلوم الشرعية الأزهري (القرآن، الفقه، والحديث)',
      en: 'Al-Azhar Primary Islamic Sciences Curriculum',
    },
    gradeLabel: {
      ar: 'المعاهد الأزهرية الابتدائية (الصفوف ١ - ٦)',
      en: 'Al-Azhar Primary Grades (1 - 6)',
    },
    description: {
      ar: 'منهج رصين يواكب خطة الأزهر الشريف في حفظ نصف القرآن الكريم خلال المرحلة الابتدائية، مع دراسة مبادئ الفقه المذهبي، التوحيد، والسيرة العطرة.',
      en: 'A rigorous curriculum aligned with Al-Azhar Al-Sharif standards, covering systematic Quran memorization alongside classical jurisprudence, doctrine, and Seerah.',
    },
    objectives: {
      ar: [
        'مواكبة نصاب الحفظ الأزهري المقرر لكل صف دراسي',
        'دراسة فقه العبادات بأدلته الميسرة وفق المذهب المعتمد',
        'ترسيخ أصول العقيدة الإسلامية الصحيحة',
        'التفوق في اختبارات قطاع المعاهد الأزهرية الدورية',
      ],
      en: [
        'Keep pace with official Al-Azhar memorization quotas per grade',
        'Study fiqh of worship with foundational textual evidence',
        'Anchor orthodox Islamic theology and creed',
        'Achieve distinction in official Al-Azhar periodic exams',
      ],
    },
    topics: {
      ar: ['القرآن الكريم وتجويده النظري', 'الفقه المذهبي المبسط', 'السيرة والقصص النبوي', 'الحديث النبوي الشريف', 'العقيدة والأخلاق'],
      en: ['Quran & Theoretical Tajweed', 'Simplified Fiqh', 'Prophetic Seerah', 'Selected Hadiths', 'Aqeedah & Manners'],
    },
    referenceBooks: {
      ar: ['مقررات قطاع المعاهد الأزهرية الشريفة', 'متن تحفة الأطفال', 'سلسلة الفقه الميسر'],
      en: ['Official Al-Azhar Institute Primary Textbooks', 'Tuhfat Al-Atfal Text', 'Simplified Fiqh Series'],
    },
  },
  {
    id: 'curr-uae-middle-arabic',
    country: 'uae',
    stage: 'middle',
    subject: 'arabic',
    title: {
      ar: 'منهج اللغة العربية والسنع الإماراتي - المرحلة المتوسطة',
      en: 'UAE Curriculum - Arabic Language & Heritage (Middle Stage)',
    },
    gradeLabel: {
      ar: 'الحلقة الثانية (الصفوف ٦ - ٨)',
      en: 'Cycle 2 (Grades 6 - 8)',
    },
    description: {
      ar: 'منهج حديث يركز على مهارات التواصل الشفهي والكتابي، النصوص الأدبية الحديثة والتراثية، النحو الوظيفي، وبناء مهارات التفكير الناقد والتحليل.',
      en: 'A modern curriculum emphasizing verbal and written communication, classical and contemporary literature, functional grammar, and critical analytical thinking.',
    },
    objectives: {
      ar: [
        'تحليل النصوص الأدبية والقصصية واستخراج القيم الجمالية',
        'تطبيق النحو الوظيفي في الكتابة والمحادثة السليمة',
        'إتقان مهارات التلخيص والعرض والتقديم باللغة الفصحى',
        'الاستعداد للاختبارات الوطنية والتقييمات المدرسية',
      ],
      en: [
        'Analyze literary texts and identify rhetorical merits',
        'Apply functional grammar in daily writing and discourse',
        'Master summary, presentation, and public speaking in Fusha',
        'Excel in national exams and continuous school assessments',
      ],
    },
    topics: {
      ar: ['القراءة التحليلية والنصوص الأدبية', 'النحو والصرف الوظيفي', 'الإملاء والترقيم', 'مهارات الكتابة الإقناعية والوصفية', 'البلاغة الميسرة'],
      en: ['Analytical Reading & Literature', 'Functional Syntax & Morphology', 'Punctuation & Spelling', 'Persuasive Writing', 'Simplified Rhetoric'],
    },
    referenceBooks: {
      ar: ['كتاب اللغة العربية - وزارة التربية والتعليم بالإمارات', 'دليل الأنشطة والتطبيقات النحوية'],
      en: ['UAE Ministry of Education Arabic Textbook', 'Grammar & Activity Guide'],
    },
  },
  {
    id: 'curr-kuwait-secondary-arabic',
    country: 'kuwait',
    stage: 'secondary',
    subject: 'arabic',
    title: {
      ar: 'منهج اللغة العربية والبلاغة - المنهج الكويتي',
      en: 'Kuwaiti Curriculum - Arabic Literature & Rhetoric (High School)',
    },
    gradeLabel: {
      ar: 'المرحلة الثانوية (الصفوف ١٠ - ١٢)',
      en: 'High School (Grades 10 - 12)',
    },
    description: {
      ar: 'دراسة معمقة لفنون البلاغة (البيان، البديع، المعاني)، والشعر العربي القديم والمعاصر، والنحو المتقدم لتمكين الطالب من التفوق في اختبارات الثانوية العامة.',
      en: 'Advanced study of Arabic rhetoric (Bayan, Badee, Maani), classical/modern poetry, and advanced syntax to excel in high school exit exams.',
    },
    objectives: {
      ar: [
        'إتقان علوم البلاغة الثلاثة والقدرة على التذوق الأدبي',
        'التمكن من الإعراب التام للمركبات النحوية المتقدمة',
        'كتابة المقال التحليلي الأدبي بلغة رصينة وفصيحة',
        'تحقيق أعلى الدرجات في امتحانات الثانوية العامة',
      ],
      en: [
        'Master the three branches of Arabic rhetoric and aesthetic appreciation',
        'Parse complex sentences and advanced grammatical constructs',
        'Compose sophisticated literary analysis essays',
        'Secure top rankings in national high school examinations',
      ],
    },
    topics: {
      ar: ['علوم البلاغة والنقد الأدبي', 'النحو التراكمي وتدريبات الإعراب', 'تاريخ الأدب العربي والشعر', 'التعبير الإبداعي والمقال', 'المعجم والدلالة'],
      en: ['Rhetorical Arts & Literary Criticism', 'Cumulative Grammar & Parsing', 'History of Arabic Literature & Poetry', 'Essay Writing', 'Lexicography'],
    },
    referenceBooks: {
      ar: ['كتاب اللغة العربية والبلاغة - وزارة التربية بدولة الكويت', 'مذكرات التميز والأسئلة الشاملة'],
      en: ['Kuwait Ministry of Education Arabic & Rhetoric Textbook', 'Comprehensive Exam Review Compendiums'],
    },
  },
];
