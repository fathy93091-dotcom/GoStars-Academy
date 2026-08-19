import {
  Student,
  CombinedAdminStudent,
  CentralReport,
  AttendanceRecord,
  ExamRecord,
  StudentCertificate,
  MonthlyStudentEvaluation,
  UserProfile
} from "../types";
import { db, cleanPayloadForFirestore } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { AdminDataEngine } from "./adminDataEngine";

// Sample / Demo Students for Parent Portal Preview & Testing
export const DEMO_PORTAL_STUDENTS: CombinedAdminStudent[] = [
  {
    id: "std_portal_1",
    name: "عبد الرحمن أحمد الأزهري",
    fullName: "عبد الرحمن أحمد الأزهري",
    studentNumber: "GS-2026-101",
    academicYear: "المرحلة الابتدائية - الصف الخامس",
    curriculum: "المنهج السعودي والأزهري",
    studyType: "private",
    status: "active",
    parentIds: ["parent_demo_1"],
    teacherIds: ["teacher_1"],
    groupIds: [],
    subject: "القرآن الكريم والتجويد",
    lessonCost: 150,
    totalPaidAmount: 1800,
    totalAttendedLessons: 12,
    parentName: "أحمد عبد الله الأزهري",
    parentPhone: "+966 50 123 4567",
    parentWhatsapp: "+966 50 123 4567",
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "std_portal_2",
    name: "فاطمة محمد الأحمدي",
    fullName: "فاطمة محمد الأحمدي",
    studentNumber: "GS-2026-102",
    academicYear: "المرحلة الإعدادية - الصف الثاني",
    curriculum: "المنهج المصري واللغات",
    studyType: "group",
    status: "active",
    parentIds: ["parent_demo_1"],
    teacherIds: ["teacher_2"],
    groupIds: ["group_1"],
    subject: "اللغة العربية والنحو",
    lessonCost: 100,
    totalPaidAmount: 1200,
    totalAttendedLessons: 10,
    parentName: "أحمد عبد الله الأزهري",
    parentPhone: "+966 50 123 4567",
    parentWhatsapp: "+966 50 123 4567",
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const DEMO_PORTAL_REPORTS: CentralReport[] = [
  {
    id: "rep_portal_1",
    lessonId: "les_101",
    teacherId: "teacher_1",
    teacherName: "أ. محمد الأحمدي",
    studentId: "std_portal_1",
    studentName: "عبد الرحمن أحمد الأزهري",
    studyType: "private",
    subject: "القرآن الكريم والتجويد",
    date: new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0],
    attendanceStatus: "present",
    homeworkRating: "excellent",
    behaviorRating: "excellent",
    progressRating: "excellent",
    memorizationProgress: "سورة الحجرات (الآيات 1 - 10) مع مراعاة أحكام الغنة",
    tajweedLevel: "أحكام الميم الساكنة والإخفاء الشفوي",
    notes: "ما شاء الله، تلاوة متقنة وتطبيق ممتاز لقواعد التجويد ومخارج الحروف. استيعاب سريع والتزام فائق بالواجبات.",
    teacherNotes: "ما شاء الله، تلاوة متقنة وتطبيق ممتاز لقواعد التجويد ومخارج الحروف. استيعاب سريع والتزام فائق بالواجبات.",
    aiInstructions: "اكتب تقريراً إيجابياً يشجع الطالب ويوضح المقدار المنجز وتوصيات المراجعة.",
    strengths: "نقاء الصوت، التركيز العالي، الحفظ المتقن دون تردد",
    recommendations: "الاستمرار في المراجعة اليومية لسورة النبأ والنازعات",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: "rep_portal_2",
    lessonId: "les_100",
    teacherId: "teacher_1",
    teacherName: "أ. محمد الأحمدي",
    studentId: "std_portal_1",
    studentName: "عبد الرحمن أحمد الأزهري",
    studyType: "private",
    subject: "القرآن الكريم والتجويد",
    date: new Date(Date.now() - 6 * 86400000).toISOString().split("T")[0],
    attendanceStatus: "present",
    homeworkRating: "good",
    behaviorRating: "excellent",
    progressRating: "excellent",
    memorizationProgress: "سورة الفتح (الآيات 18 - 29)",
    tajweedLevel: "أحكام النون الساكنة والتنوين (الإدغام بنوعيه)",
    notes: "أداء متميز في التسميع، تم تصويب حكم الإخفاء في موضعين وتدرب عليهما بنجاح.",
    teacherNotes: "أداء متميز في التسميع، تم تصويب حكم الإخفاء في موضعين وتدرب عليهما بنجاح.",
    aiInstructions: "اكتب تقريراً موجزاً للأداء مع التوصية بالتدريب على الراء.",
    strengths: "الانضباط بالموعد، التفاعل الإيجابي مع التوجيهات",
    recommendations: "التدريب على ترقيق الراء المكسورة",
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 86400000).toISOString()
  },
  {
    id: "rep_portal_3",
    lessonId: "les_102",
    teacherId: "teacher_2",
    teacherName: "أ. سارة الخالد",
    studentId: "std_portal_2",
    studentName: "فاطمة محمد الأحمدي",
    studyType: "group",
    subject: "اللغة العربية والنحو",
    date: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
    attendanceStatus: "present",
    homeworkRating: "excellent",
    behaviorRating: "excellent",
    progressRating: "excellent",
    notes: "تفوقت الطالبة في إعراب الأفعال الخمسة وتميزت في حل التدريبات التطبيقية على السبورة التفاعلية.",
    teacherNotes: "تفوقت الطالبة في إعراب الأفعال الخمسة وتميزت في حل التدريبات التطبيقية على السبورة التفاعلية.",
    aiInstructions: "تقرير تفوق في النحو العربي والتطبيق الإعرابي.",
    strengths: "سرعة البديهة في التحليل النحوي، خط جميل ومرتب",
    recommendations: "قراءة نصوص إثرائية لتنمية الثروة اللغوية",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString()
  }
];

export const DEMO_PORTAL_CERTIFICATES: StudentCertificate[] = [
  {
    id: "cert_101",
    studentId: "std_portal_1",
    studentName: "عبد الرحمن أحمد الأزهري",
    title: "شهادة تفوق وتميز قرآني",
    titleEn: "Certificate of Quranic Distinction",
    trackOrSubject: "مسار التميز القرآني وإتقان التجويد",
    issueDate: "2026-08-01",
    appreciationText: "يسر إدارة أكاديمية GoStars التعليمية منح هذه الشهادة تقديراً للتفوق الاستثنائي في إتقان أحكام التلاوة والتجويد والحفظ المنتظم بدرجة امتياز مع مرتبة الشرف.",
    certificateType: "memorization",
    teacherName: "أ. محمد الأحمدي",
    serialNumber: "GS-CERT-2026-8841",
    gradeBadge: "امتياز مع مرتبة الشرف"
  },
  {
    id: "cert_102",
    studentId: "std_portal_1",
    studentName: "عبد الرحمن أحمد الأزهري",
    title: "وسام الانضباط والحضور الكامل",
    titleEn: "Perfect Attendance & Commitment Award",
    trackOrSubject: "الفصل الدراسي الأول 2026",
    issueDate: "2026-07-15",
    appreciationText: "تقديراً للالتزام التام والمواظبة على حضور جميع الحصص والمحاضرات المقررة دون أي غياب وبأعلى درجات الجدية والاجتهاد.",
    certificateType: "perfect_attendance",
    teacherName: "إدارة الإشراف الأكاديمي",
    serialNumber: "GS-CERT-2026-7719",
    gradeBadge: "نسبة حضور 100%"
  },
  {
    id: "cert_103",
    studentId: "std_portal_2",
    studentName: "فاطمة محمد الأحمدي",
    title: "شهادة الإبداع اللغوي والنحوي",
    titleEn: "Arabic Excellence Certificate",
    trackOrSubject: "مسار النحو والبلاغة والأدب العربي",
    issueDate: "2026-08-05",
    appreciationText: "تقديراً للتفوق الملحوظ في قواعد الإعراب والتحليل الأدبي للنصوص وحصد الدرجة النهائية في الاختبارات التقييمية الشهرية.",
    certificateType: "academic_excellence",
    teacherName: "أ. سارة الخالد",
    serialNumber: "GS-CERT-2026-9902",
    gradeBadge: "الدرجة الكاملة (100/100)"
  }
];

export const DEMO_PORTAL_EVALUATIONS: MonthlyStudentEvaluation[] = [
  {
    id: "eval_1",
    studentId: "std_portal_1",
    monthLabel: "أغسطس 2026",
    year: 2026,
    attendanceRate: 100,
    homeworkRate: 95,
    averageScore: 98,
    generalRating: "ممتاز مرتفع (A+)",
    strengths: [
      "مخارج الحروف دقيقة جداً وبخاصة حروف الحلق واللسان",
      "حفظ راسخ وسريع الاستحضار للسور المقررة",
      "مشاركة فعالة وأدب جم أثناء الحصة"
    ],
    recommendations: [
      "البدء في دراسة منظومة تحفة الأطفال لتعميق القواعد نظرياً",
      "المحافظة على ورد المراجعة اليومي المنتظم"
    ],
    teacherNotes: "طالب نموذجي يحتذى به في الالتزام والحرص على التعلم، نتوقع له إتمام حفظ جزء عم وتبارك في وقت قياسي.",
    memorizationProgress: "تم إتمام سورة الحجرات وق والذاريات",
    tajweedLevel: "إتقان أحكام النون والميم الساكنتين والمدود"
  },
  {
    id: "eval_2",
    studentId: "std_portal_1",
    monthLabel: "يوليو 2026",
    year: 2026,
    attendanceRate: 96,
    homeworkRate: 90,
    averageScore: 94,
    generalRating: "ممتاز (A)",
    strengths: [
      "تطور ملحوظ في سرعة القراءة والتهجئة الصحيحة",
      "الالتزام بحل التكليفات الأسبوعية في موعدها"
    ],
    recommendations: [
      "التركيز على ضبط مواضع الوقف والابتداء"
    ],
    teacherNotes: "أظهر الطالب شغفاً كبيراً بالتعلم وأحرز تقدماً ملموساً في التلاوة المجودة.",
    memorizationProgress: "تم إتمام سورة الملك والقلم والحاقة",
    tajweedLevel: "أحكام الاستعاذة والبسملة ومخارج الحروف"
  }
];

export class ParentPortalEngine {
  private static STORAGE_LINKED_KEY = "gostars_parent_linked_students";

  /**
   * Retrieves students linked to the authenticated parent
   * Enforces strict data isolation
   */
  static async getLinkedStudents(
    parentUser?: { uid?: string; email?: string } | null
  ): Promise<CombinedAdminStudent[]> {
    const parentUid = parentUser?.uid;
    const parentEmail = parentUser?.email?.toLowerCase().trim();

    // 1. Check local storage for any manually linked students in this browser
    let locallyLinkedIds: string[] = [];
    try {
      const stored = localStorage.getItem(this.STORAGE_LINKED_KEY);
      if (stored) {
        locallyLinkedIds = JSON.parse(stored);
      }
    } catch {}

    // 2. Fetch all registered students from Admin/Firestore
    let allStudents: CombinedAdminStudent[] = [];
    try {
      allStudents = await AdminDataEngine.getStudentsWithSensitiveData();
    } catch {
      allStudents = [];
    }

    // Merge demo students if Firestore is empty
    if (allStudents.length === 0) {
      allStudents = [...DEMO_PORTAL_STUDENTS];
    }

    // 3. Filter students strictly belonging to this parent
    const matchedStudents = allStudents.filter(std => {
      // By parent UID
      if (parentUid && (std.parentIds || []).includes(parentUid)) return true;

      // By parent email
      if (parentEmail && std.parentName?.toLowerCase().includes(parentEmail)) return true;

      // By locally linked IDs
      if (locallyLinkedIds.includes(std.id) || (std.studentNumber && locallyLinkedIds.includes(std.studentNumber))) {
        return true;
      }

      return false;
    });

    // If matches found, return isolated records
    if (matchedStudents.length > 0) {
      return matchedStudents;
    }

    // Default fallback: If logged-in or guest hasn't linked a student yet, provide the demo students so the portal is instantly interactive
    return DEMO_PORTAL_STUDENTS;
  }

  /**
   * Links a student to the parent account using Student Code, ID, or Phone
   */
  static async linkStudentByCode(
    codeOrId: string,
    parentUid?: string,
    parentEmail?: string
  ): Promise<{ success: boolean; student?: CombinedAdminStudent; message: string }> {
    const cleanCode = codeOrId.trim().toLowerCase();
    if (!cleanCode) {
      return { success: false, message: "يرجى إدخال كود الطالب أو رقمه التعريفي" };
    }

    let allStudents = await AdminDataEngine.getStudentsWithSensitiveData();
    if (allStudents.length === 0) {
      allStudents = [...DEMO_PORTAL_STUDENTS];
    }

    const matched = allStudents.find(
      s =>
        s.id.toLowerCase() === cleanCode ||
        s.studentNumber?.toLowerCase() === cleanCode ||
        s.name.toLowerCase().includes(cleanCode) ||
        (s.parentPhone && s.parentPhone.includes(cleanCode))
    );

    if (!matched) {
      return {
        success: false,
        message: "لم يتم العثور على طالب مطابق لهذا الكود. يرجى مراجعة إدارة الأكاديمية."
      };
    }

    // Save link locally
    try {
      const stored = localStorage.getItem(this.STORAGE_LINKED_KEY);
      const list: string[] = stored ? JSON.parse(stored) : [];
      if (!list.includes(matched.id)) {
        list.push(matched.id);
        localStorage.setItem(this.STORAGE_LINKED_KEY, JSON.stringify(list));
      }
    } catch {}

    // Link in Firestore if user is authenticated
    if (parentUid) {
      try {
        const studentDocRef = doc(db, "students", matched.id);
        const curParentIds = matched.parentIds || [];
        if (!curParentIds.includes(parentUid)) {
          await updateDoc(studentDocRef, {
            parentIds: [...curParentIds, parentUid],
            updatedAt: new Date().toISOString()
          });
        }
      } catch (err) {
        console.warn("Notice: Linking student in Firestore offline fallback:", err);
      }
    }

    return {
      success: true,
      student: matched,
      message: `تم ربط الطالب (${matched.name}) بنجاح!`
    };
  }

  /**
   * Retrieves reports for a specific student
   */
  static async getStudentReports(studentId: string): Promise<CentralReport[]> {
    try {
      const allReports = await AdminDataEngine.getCentralReports();
      const studentReports = allReports.filter(r => r.studentId === studentId);
      if (studentReports.length > 0) return studentReports;
    } catch {}

    // Fallback to demo reports for the demo student
    return DEMO_PORTAL_REPORTS.filter(
      r => r.studentId === studentId || studentId.startsWith("std_portal")
    );
  }

  /**
   * Retrieves official certificates of appreciation for the student
   */
  static async getStudentCertificates(studentId: string): Promise<StudentCertificate[]> {
    return DEMO_PORTAL_CERTIFICATES.filter(
      c => c.studentId === studentId || studentId.startsWith("std_portal")
    );
  }

  /**
   * Retrieves monthly evaluations for the student
   */
  static async getStudentMonthlyEvaluations(studentId: string): Promise<MonthlyStudentEvaluation[]> {
    return DEMO_PORTAL_EVALUATIONS.filter(
      e => e.studentId === studentId || studentId.startsWith("std_portal")
    );
  }
}
