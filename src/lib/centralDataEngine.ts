import {
  Student,
  Group,
  PrivateLesson,
  Lesson,
  AttendanceRecord,
  PaymentTransaction,
  GeneratedReport,
  GoStarsBackupData,
  TeacherRecord,
  ParentRecord,
  CentralStudent,
  CentralGroup,
  CentralLesson,
  CentralAttendance,
  CentralReport,
  CentralPayment,
  SensitiveContactRecord
} from "../types";
import {
  db,
  cleanPayloadForFirestore
} from "./firebase";
import {
  doc,
  setDoc,
  writeBatch,
  getDocs,
  collection,
  query,
  where
} from "firebase/firestore";
import { StorageEngine } from "./storage";
import { TermuxWhatsAppEngine } from "./termuxWhatsAppEngine";

/**
 * Direct real-time sync of a single report to Centralized Firestore /reports collection
 * and automated queueing into Termux WhatsApp outbox (strictly isolated from teacher)
 */
export async function syncReportToCentralFirestore(
  report: GeneratedReport,
  teacherId: string = "guest_teacher"
): Promise<boolean> {
  try {
    const central = normalizeReport(report, teacherId);
    const reportRef = doc(db, "reports", central.id);
    await setDoc(reportRef, cleanPayloadForFirestore(central), { merge: true });

    // Automated background dispatch to Termux WhatsApp Outbox
    TermuxWhatsAppEngine.routeAndQueueLessonReport(central).catch(err => {
      console.warn("Notice: automated whatsapp queue failed:", err);
    });

    return true;
  } catch (err) {
    console.warn("Could not sync report directly to central Firestore:", err);
    return false;
  }
}

/**
 * Direct real-time sync of a single payment to Centralized Firestore /payments collection
 * and automated receipt queueing into Termux WhatsApp outbox
 */
export async function syncPaymentToCentralFirestore(
  payment: PaymentTransaction,
  teacherId: string = "guest_teacher"
): Promise<boolean> {
  try {
    const central = normalizePayment(payment, teacherId);
    const paymentRef = doc(db, "payments", central.id);
    await setDoc(paymentRef, cleanPayloadForFirestore(central), { merge: true });

    // Automated background dispatch of receipt to Termux WhatsApp Outbox
    TermuxWhatsAppEngine.routeAndQueuePaymentReceipt(central).catch(err => {
      console.warn("Notice: automated payment receipt queue failed:", err);
    });

    return true;
  } catch (err) {
    console.warn("Could not sync payment directly to central Firestore:", err);
    return false;
  }
}

/**
 * Transforms a local/legacy Student into CentralStudent (removing sensitive parent contact)
 * and generates a SensitiveContactRecord for isolated admin-only storage.
 */
export function normalizeStudent(
  student: Student,
  teacherId: string
): { centralStudent: CentralStudent; sensitiveContact?: SensitiveContactRecord; parent?: ParentRecord } {
  const now = new Date().toISOString();
  const parentId = `parent_${student.id}`;

  const centralStudent: CentralStudent = {
    id: student.id,
    name: student.fullName,
    fullName: student.fullName,
    studentNumber: student.studentNumber,
    academicYear: student.academicYear,
    curriculum: student.curriculum,
    studyType: student.studyType || "group",
    status: student.status || "active",
    parentIds: [parentId],
    teacherIds: [teacherId],
    groupIds: student.groupId ? [student.groupId] : [],
    subject: student.subject,
    subjects: student.subjects,
    lessonCost: Number(student.lessonCost || 0),
    totalPaidAmount: Number(student.totalPaidAmount || 0),
    totalAttendedLessons: Number(student.totalAttendedLessons || 0),
    notes: student.notes,
    createdAt: student.createdAt || now,
    updatedAt: now
  };

  const sensitiveContact: SensitiveContactRecord = {
    id: student.id,
    entityType: "student",
    parentContact: student.parentContact || undefined,
    studentPhone: student.studentPhone || undefined,
    whatsappGroupLink: student.whatsappGroupLink || undefined,
    updatedAt: now
  };

  const parent: ParentRecord = {
    id: parentId,
    name: student.fullName ? `ولي أمر ${student.fullName}` : "ولي أمر",
    phone: student.parentContact || undefined,
    studentIds: [student.id],
    status: "active",
    createdAt: student.createdAt || now,
    updatedAt: now
  };

  return { centralStudent, sensitiveContact, parent };
}

/**
 * Transforms a local/legacy Group into CentralGroup (isolating whatsappGroupLink)
 * and generates a SensitiveContactRecord for isolated admin-only storage.
 */
export function normalizeGroup(
  group: Group,
  teacherId: string
): { centralGroup: CentralGroup; sensitiveContact?: SensitiveContactRecord } {
  const now = new Date().toISOString();

  const centralGroup: CentralGroup = {
    id: group.id,
    name: group.name,
    subject: group.subject,
    teacherIds: [teacherId],
    studentIds: group.studentIds || [],
    days: group.days || [],
    time: group.time || "16:00",
    durationMinutes: Number(group.durationMinutes || 60),
    scheduleSlots: group.scheduleSlots,
    status: group.status || "active",
    createdAt: group.createdAt || now,
    updatedAt: now
  };

  const sensitiveContact: SensitiveContactRecord = {
    id: group.id,
    entityType: "group",
    whatsappGroupLink: group.whatsappGroupLink || undefined,
    parentWhatsapp: group.parentWhatsapp || undefined,
    updatedAt: now
  };

  return { centralGroup, sensitiveContact };
}

/**
 * Transforms a local/legacy Lesson into CentralLesson.
 */
export function normalizeLesson(
  lesson: Lesson,
  teacherId: string
): CentralLesson {
  const now = new Date().toISOString();
  return {
    id: lesson.id,
    studyType: lesson.studyType || "group",
    groupId: lesson.groupId,
    groupName: lesson.groupName,
    studentId: lesson.studentId,
    studentName: lesson.studentName,
    teacherId: teacherId,
    subject: lesson.subject,
    date: lesson.date,
    time: lesson.time,
    durationMinutes: Number(lesson.durationMinutes || 60),
    status: lesson.status || "upcoming",
    teacherNotes: lesson.teacherNotes,
    aiInstructions: lesson.aiInstructions,
    generatedReport: lesson.generatedReport,
    createdAt: lesson.createdAt || now,
    updatedAt: now
  };
}

/**
 * Transforms a local AttendanceRecord into CentralAttendance.
 */
export function normalizeAttendance(
  record: AttendanceRecord,
  teacherId: string
): CentralAttendance {
  const now = new Date().toISOString();
  return {
    id: record.id,
    lessonId: record.lessonId,
    studentId: record.studentId,
    studentName: record.studentName,
    teacherId: teacherId,
    subject: record.subject,
    lessonNumber: record.lessonNumber,
    attendance: record.attendance,
    homeworkStatus: record.homeworkStatus,
    teacherNotes: record.teacherNotes,
    aiInstructions: record.aiInstructions,
    generatedReportText: record.generatedReportText,
    deducted: Boolean(record.deducted),
    date: record.date,
    createdAt: record.date || now,
    updatedAt: now
  };
}

/**
 * Transforms a local GeneratedReport into CentralReport.
 */
export function normalizeReport(
  report: GeneratedReport,
  teacherId: string
): CentralReport {
  const now = new Date().toISOString();
  return {
    id: report.id,
    studentId: report.studentId,
    studentName: report.studentName,
    teacherId: teacherId,
    lessonId: report.lessonId,
    subject: report.subject,
    date: report.date,
    lessonNumber: report.lessonNumber,
    attendance: report.attendance,
    deductCost: report.deductCost,
    homeworkStatus: report.homeworkStatus,
    teacherNotes: report.teacherNotes || "",
    aiInstructions: report.aiInstructions || "",
    reportText: report.reportText || report.generatedText || "",
    generatedText: report.generatedText || report.reportText || "",
    archived: report.archived,
    archivedAt: report.archivedAt,
    createdAt: report.createdAt || now,
    updatedAt: now
  };
}

/**
 * Transforms a local PaymentTransaction into CentralPayment.
 */
export function normalizePayment(
  payment: PaymentTransaction,
  teacherId: string
): CentralPayment {
  const now = new Date().toISOString();
  return {
    id: payment.id,
    studentId: payment.studentId,
    studentName: payment.studentName,
    teacherId: teacherId,
    amount: Number(payment.amount || 0), // المبلغ المدفوع فقط
    date: payment.date,
    paymentMethod: payment.paymentMethod || "كاش",
    receiptNumber: payment.receiptNumber || payment.id,
    notes: payment.notes,
    lessonsCovered: payment.lessonsCovered,
    lessonsCount: payment.lessonsCount,
    lessonCost: payment.lessonCost,
    createdAt: payment.date || now,
    updatedAt: now
  };
}

export interface MigrationSummary {
  success: boolean;
  teacherId: string;
  counts: {
    students: number;
    groups: number;
    lessons: number;
    attendance: number;
    reports: number;
    payments: number;
    sensitiveContacts: number;
  };
  errors?: string[];
  migratedAt: string;
}

/**
 * Safe, Non-Destructive Migration Engine
 * Reads existing teacher workspace from StorageEngine, converts to normalized collections,
 * and writes in batches to Firestore without deleting anything from LocalStorage or legacy files.
 */
export async function migrateWorkspaceToCentralizedFirestore(
  userId: string,
  teacherName?: string,
  teacherEmail?: string
): Promise<MigrationSummary> {
  if (!userId) {
    throw new Error("Cannot migrate workspace without a valid userId / teacherId.");
  }

  const workspace: GoStarsBackupData = StorageEngine.getUserWorkspace(userId);
  const now = new Date().toISOString();
  const summary: MigrationSummary = {
    success: false,
    teacherId: userId,
    counts: {
      students: 0,
      groups: 0,
      lessons: 0,
      attendance: 0,
      reports: 0,
      payments: 0,
      sensitiveContacts: 0
    },
    errors: [],
    migratedAt: now
  };

  try {
    const batch = writeBatch(db);

    // 1. Teacher Document
    const teacherDocRef = doc(db, "teachers", userId);
    const teacherRecord: TeacherRecord = {
      id: userId,
      authUid: userId,
      name: teacherName || workspace.settings.teacherName || "معلم الأكاديمية",
      email: teacherEmail || "",
      specialties: workspace.settings.defaultSubject ? [workspace.settings.defaultSubject] : [],
      assignedGroupIds: (workspace.groups || []).map(g => g.id),
      assignedStudentIds: (workspace.students || []).map(s => s.id),
      status: "active",
      createdAt: now,
      updatedAt: now
    };
    batch.set(teacherDocRef, cleanPayloadForFirestore(teacherRecord), { merge: true });

    // 2. Students & Sensitive Contacts & Parents
    if (Array.isArray(workspace.students)) {
      for (const student of workspace.students) {
        if (!student.id) continue;
        const { centralStudent, sensitiveContact, parent } = normalizeStudent(student, userId);
        
        // Student Doc
        const studentRef = doc(db, "students", student.id);
        batch.set(studentRef, cleanPayloadForFirestore(centralStudent), { merge: true });
        summary.counts.students++;

        // Parent Doc
        if (parent) {
          const parentRef = doc(db, "parents", parent.id);
          batch.set(parentRef, cleanPayloadForFirestore(parent), { merge: true });
        }

        // Sensitive Contact Doc (Parent WhatsApp / Phone - Protected from teacher access)
        if (sensitiveContact && (sensitiveContact.parentContact || sensitiveContact.whatsappGroupLink)) {
          const contactRef = doc(db, "sensitive_contacts", student.id);
          batch.set(contactRef, cleanPayloadForFirestore(sensitiveContact), { merge: true });
          summary.counts.sensitiveContacts++;
        }
      }
    }

    // 3. Groups & Sensitive Group WhatsApp Links
    if (Array.isArray(workspace.groups)) {
      for (const group of workspace.groups) {
        if (!group.id) continue;
        const { centralGroup, sensitiveContact } = normalizeGroup(group, userId);

        const groupRef = doc(db, "groups", group.id);
        batch.set(groupRef, cleanPayloadForFirestore(centralGroup), { merge: true });
        summary.counts.groups++;

        if (sensitiveContact && (sensitiveContact.whatsappGroupLink || sensitiveContact.parentWhatsapp)) {
          const contactRef = doc(db, "sensitive_contacts", group.id);
          batch.set(contactRef, cleanPayloadForFirestore(sensitiveContact), { merge: true });
          summary.counts.sensitiveContacts++;
        }
      }
    }

    // 4. Lessons
    if (Array.isArray(workspace.lessons)) {
      for (const lesson of workspace.lessons) {
        if (!lesson.id) continue;
        const centralLesson = normalizeLesson(lesson, userId);
        const lessonRef = doc(db, "lessons", lesson.id);
        batch.set(lessonRef, cleanPayloadForFirestore(centralLesson), { merge: true });
        summary.counts.lessons++;
      }
    }

    // 5. Attendance Records
    if (Array.isArray(workspace.attendanceRecords)) {
      for (const record of workspace.attendanceRecords) {
        if (!record.id) continue;
        const centralAttendance = normalizeAttendance(record, userId);
        const attendanceRef = doc(db, "attendance", record.id);
        batch.set(attendanceRef, cleanPayloadForFirestore(centralAttendance), { merge: true });
        summary.counts.attendance++;
      }
    }

    // 6. Reports
    if (Array.isArray(workspace.reports)) {
      for (const report of workspace.reports) {
        if (!report.id) continue;
        const centralReport = normalizeReport(report, userId);
        const reportRef = doc(db, "reports", report.id);
        batch.set(reportRef, cleanPayloadForFirestore(centralReport), { merge: true });
        summary.counts.reports++;
      }
    }

    // 7. Payment Transactions
    if (Array.isArray(workspace.paymentTransactions)) {
      for (const payment of workspace.paymentTransactions) {
        if (!payment.id) continue;
        const centralPayment = normalizePayment(payment, userId);
        const paymentRef = doc(db, "payments", payment.id);
        batch.set(paymentRef, cleanPayloadForFirestore(centralPayment), { merge: true });
        summary.counts.payments++;
      }
    }

    // Commit all normalized batch operations to Firestore
    await batch.commit();
    summary.success = true;
  } catch (err: any) {
    console.error("Migration error:", err);
    summary.errors?.push(err?.message || "Unknown migration error");
  }

  return summary;
}
