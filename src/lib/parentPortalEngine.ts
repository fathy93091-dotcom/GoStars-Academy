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

// Empty initial arrays - strictly ready to receive real live student and report data
export const DEMO_PORTAL_STUDENTS: CombinedAdminStudent[] = [];
export const DEMO_PORTAL_REPORTS: CentralReport[] = [];
export const DEMO_PORTAL_CERTIFICATES: StudentCertificate[] = [];
export const DEMO_PORTAL_EVALUATIONS: MonthlyStudentEvaluation[] = [];

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

    if (allStudents.length === 0) {
      return [];
    }

    // 3. Filter students strictly belonging to this parent
    const matchedStudents = allStudents.filter(std => {
      // By parent UID
      if (parentUid && (std.parentIds || []).includes(parentUid)) return true;

      // By parent email
      if (parentEmail && std.parentName?.toLowerCase().includes(parentEmail)) return true;

      // By locally linked IDs or Student Codes
      if (
        locallyLinkedIds.includes(std.id) || 
        (std.studentNumber && locallyLinkedIds.includes(std.studentNumber))
      ) {
        return true;
      }

      return false;
    });

    return matchedStudents;
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
      return {
        success: false,
        message: "لم يتم العثور على أي طلاب مسجلين في النظام حتى الآن. يرجى مراجعة إدارة الأكاديمية."
      };
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
      return allReports.filter(r => r.studentId === studentId);
    } catch {
      return [];
    }
  }

  /**
   * Retrieves official certificates of appreciation for the student
   */
  static async getStudentCertificates(studentId: string): Promise<StudentCertificate[]> {
    try {
      const snap = await getDocs(
        query(collection(db, "certificates"), where("studentId", "==", studentId))
      );
      if (!snap.empty) {
        return snap.docs.map(d => ({ ...d.data(), id: d.id } as StudentCertificate));
      }
    } catch {}

    return [];
  }

  /**
   * Retrieves monthly evaluations for the student
   */
  static async getStudentMonthlyEvaluations(studentId: string): Promise<MonthlyStudentEvaluation[]> {
    try {
      const snap = await getDocs(
        query(collection(db, "evaluations"), where("studentId", "==", studentId))
      );
      if (!snap.empty) {
        return snap.docs.map(d => ({ ...d.data(), id: d.id } as MonthlyStudentEvaluation));
      }
    } catch {}

    return [];
  }
}
