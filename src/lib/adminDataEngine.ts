import {
  TeacherRecord,
  ParentRecord,
  SensitiveContactRecord,
  CentralStudent,
  CentralGroup,
  CentralReport,
  CentralPayment,
  CentralAttendance,
  UserProfile,
  SupervisorPermissions,
  Student,
  Group,
  CombinedAdminStudent
} from "../types";
import {
  db,
  cleanPayloadForFirestore
} from "./firebase";
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  updateDoc,
  onSnapshot
} from "firebase/firestore";
import { StorageEngine } from "./storage";

// Empty Initial Teachers when Firestore is clean
const INITIAL_DEMO_TEACHERS: TeacherRecord[] = [];

export type { CombinedAdminStudent };

export interface AcademyFinanceSummary {
  totalRevenue: number;
  monthRevenue: number;
  totalLessonsCost: number;
  totalDueDebt: number;
  totalCreditSurplus: number;
  netAcademyProfit: number;
  totalTeachersCount: number;
  totalStudentsCount: number;
  totalGroupsCount: number;
  totalReportsCount: number;
}

export class AdminDataEngine {
  // ================= 1. TEACHERS MANAGEMENT (القاعدة 2: الإدارة فقط تنشئ المعلمين) =================

  static async getTeachers(): Promise<TeacherRecord[]> {
    try {
      const snap = await getDocs(collection(db, "teachers"));
      if (!snap.empty) {
        return snap.docs.map(d => ({ ...d.data(), id: d.id } as TeacherRecord));
      }
    } catch (err) {
      console.warn("Notice reading Firestore /teachers:", err);
    }

    // Fallback to local storage or demo seed
    const local = localStorage.getItem("gostars_admin_teachers");
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }
    return INITIAL_DEMO_TEACHERS;
  }

  static async saveTeacher(teacher: TeacherRecord): Promise<void> {
    const now = new Date().toISOString();
    const payload: TeacherRecord = {
      ...teacher,
      updatedAt: now,
      createdAt: teacher.createdAt || now
    };

    // 1. Write to Firestore /teachers
    try {
      const ref = doc(db, "teachers", teacher.id);
      await setDoc(ref, cleanPayloadForFirestore(payload), { merge: true });
    } catch (err) {
      console.warn("Notice saving to Firestore /teachers:", err);
    }

    // 2. Also register in /users as teacher if email is present
    try {
      const userRef = doc(db, "users", teacher.authUid || teacher.id);
      await setDoc(
        userRef,
        cleanPayloadForFirestore({
          uid: teacher.authUid || teacher.id,
          name: teacher.name,
          email: teacher.email,
          role: "teacher",
          status: teacher.status,
          assignedTeacherId: teacher.id,
          updatedAt: now
        }),
        { merge: true }
      );
    } catch (err) {
      console.warn("Notice updating user role for teacher:", err);
    }

    // 3. Local fallback cache
    const current = await this.getTeachers();
    const index = current.findIndex(t => t.id === teacher.id);
    if (index >= 0) {
      current[index] = payload;
    } else {
      current.unshift(payload);
    }
    localStorage.setItem("gostars_admin_teachers", JSON.stringify(current));
  }

  static async toggleTeacherStatus(teacherId: string, currentStatus: "active" | "inactive"): Promise<void> {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const now = new Date().toISOString();

    try {
      const ref = doc(db, "teachers", teacherId);
      await updateDoc(ref, { status: newStatus, updatedAt: now });
    } catch (err) {
      console.warn("Notice toggling teacher in Firestore:", err);
    }

    // Local fallback
    const current = await this.getTeachers();
    const target = current.find(t => t.id === teacherId);
    if (target) {
      target.status = newStatus;
      target.updatedAt = now;
      localStorage.setItem("gostars_admin_teachers", JSON.stringify(current));
    }
  }

  static async deleteTeacher(teacherId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "teachers", teacherId));
    } catch (err) {
      console.warn("Notice deleting teacher in Firestore:", err);
    }

    const current = await this.getTeachers();
    const filtered = current.filter(t => t.id !== teacherId);
    localStorage.setItem("gostars_admin_teachers", JSON.stringify(filtered));
  }

  // ================= 2. STUDENTS, PARENTS & SENSITIVE CONTACTS =================

  static async getStudentsWithSensitiveData(): Promise<CombinedAdminStudent[]> {
    const studentsMap = new Map<string, CombinedAdminStudent>();

    // 1. Fetch Students from Firestore /students
    try {
      const snap = await getDocs(collection(db, "students"));
      if (!snap.empty) {
        snap.docs.forEach(d => {
          const data = d.data() as CentralStudent;
          studentsMap.set(d.id, {
            ...data,
            id: d.id
          });
        });
      }
    } catch (err) {
      console.warn("Notice reading /students from Firestore:", err);
    }

    // 2. Fetch Sensitive Contacts from Firestore /sensitive_contacts (Admin/Supervisor Authorized)
    try {
      const contactSnap = await getDocs(collection(db, "sensitive_contacts"));
      if (!contactSnap.empty) {
        contactSnap.docs.forEach(d => {
          const cData = d.data() as SensitiveContactRecord;
          const student = studentsMap.get(d.id);
          if (student) {
            student.parentContact = cData.parentContact || student.parentContact;
            student.studentPhone = cData.studentPhone || student.studentPhone;
            student.whatsappGroupLink = cData.whatsappGroupLink || student.whatsappGroupLink;
          }
        });
      }
    } catch (err) {
      console.warn("Notice reading /sensitive_contacts:", err);
    }

    // 3. Fallback / Merge from Persistent Local Cache
    try {
      const cached = localStorage.getItem("gostars_admin_students");
      if (cached) {
        const parsed: CombinedAdminStudent[] = JSON.parse(cached);
        parsed.forEach(cs => {
          if (!studentsMap.has(cs.id)) {
            studentsMap.set(cs.id, cs);
          }
        });
      }
    } catch {}

    const results = Array.from(studentsMap.values());
    if (results.length > 0) {
      try {
        localStorage.setItem("gostars_admin_students", JSON.stringify(results));
      } catch {}
    }

    return results;
  }

  static async saveStudentWithSensitiveContacts(student: CombinedAdminStudent): Promise<void> {
    const now = new Date().toISOString();
    const parentId = `parent_${student.id}`;

    // 1. Central Student Record
    const centralStudent: CentralStudent = {
      id: student.id,
      name: student.fullName || student.name,
      fullName: student.fullName || student.name,
      studentNumber: student.studentNumber,
      academicYear: student.academicYear,
      curriculum: student.curriculum,
      studyType: student.studyType || "group",
      status: student.status || "active",
      parentIds: [parentId],
      teacherIds: student.teacherIds || ["teacher_1"],
      groupIds: student.groupIds || [],
      subject: student.subject,
      subjects: student.subjects,
      lessonCost: Number(student.lessonCost || 0),
      totalPaidAmount: Number(student.totalPaidAmount || 0),
      totalAttendedLessons: Number(student.totalAttendedLessons || 0),
      notes: student.notes,
      createdAt: student.createdAt || now,
      updatedAt: now
    };

    // 2. Sensitive Contact Record (Parent WhatsApp / Phone)
    const sensitiveContact: SensitiveContactRecord = {
      id: student.id,
      entityType: "student",
      parentContact: student.parentContact,
      studentPhone: student.studentPhone,
      whatsappGroupLink: student.whatsappGroupLink,
      updatedAt: now
    };

    // 3. Parent Record
    const parentRecord: ParentRecord = {
      id: parentId,
      name: student.parentName || `ولي أمر ${student.fullName || student.name}`,
      phone: student.parentContact,
      studentIds: [student.id],
      status: "active",
      createdAt: student.createdAt || now,
      updatedAt: now
    };

    // Write all three to Firestore
    try {
      await setDoc(doc(db, "students", student.id), cleanPayloadForFirestore(centralStudent), { merge: true });
      await setDoc(doc(db, "sensitive_contacts", student.id), cleanPayloadForFirestore(sensitiveContact), { merge: true });
      await setDoc(doc(db, "parents", parentId), cleanPayloadForFirestore(parentRecord), { merge: true });
    } catch (err) {
      console.warn("Notice saving student to Firestore:", err);
    }

    // Save to local cache immediately to prevent any loss
    try {
      const current = await this.getStudentsWithSensitiveData();
      const idx = current.findIndex(s => s.id === student.id);
      if (idx >= 0) {
        current[idx] = { ...current[idx], ...student, updatedAt: now };
      } else {
        current.unshift({ ...student, createdAt: now, updatedAt: now });
      }
      localStorage.setItem("gostars_admin_students", JSON.stringify(current));
    } catch {}
  }

  static async deleteStudent(studentId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "students", studentId));
      await deleteDoc(doc(db, "sensitive_contacts", studentId));
      await deleteDoc(doc(db, "parents", `parent_${studentId}`));
    } catch (err) {
      console.warn("Notice deleting student in Firestore:", err);
    }

    try {
      const current = await this.getStudentsWithSensitiveData();
      const filtered = current.filter(s => s.id !== studentId);
      localStorage.setItem("gostars_admin_students", JSON.stringify(filtered));
    } catch {}
  }

  // ================= 3. GROUPS & CENTRAL SCHEDULE =================

  static async getGroups(): Promise<CentralGroup[]> {
    const groupsMap = new Map<string, CentralGroup>();

    try {
      const snap = await getDocs(collection(db, "groups"));
      if (!snap.empty) {
        snap.docs.forEach(d => {
          groupsMap.set(d.id, { ...d.data(), id: d.id } as CentralGroup);
        });
      }
    } catch (err) {
      console.warn("Notice reading /groups from Firestore:", err);
    }

    // Merge / Fallback from Persistent Local Cache
    try {
      const cached = localStorage.getItem("gostars_admin_groups");
      if (cached) {
        const parsed: CentralGroup[] = JSON.parse(cached);
        parsed.forEach(cg => {
          if (!groupsMap.has(cg.id)) {
            groupsMap.set(cg.id, cg);
          }
        });
      }
    } catch {}

    const results = Array.from(groupsMap.values());
    if (results.length > 0) {
      try {
        localStorage.setItem("gostars_admin_groups", JSON.stringify(results));
      } catch {}
    }

    return results;
  }

  static async saveGroup(group: CentralGroup, whatsappGroupLink?: string): Promise<void> {
    const now = new Date().toISOString();
    const payload: CentralGroup = {
      ...group,
      updatedAt: now,
      createdAt: group.createdAt || now
    };

    try {
      await setDoc(doc(db, "groups", group.id), cleanPayloadForFirestore(payload), { merge: true });
      if (whatsappGroupLink) {
        const contact: SensitiveContactRecord = {
          id: group.id,
          entityType: "group",
          whatsappGroupLink,
          updatedAt: now
        };
        await setDoc(doc(db, "sensitive_contacts", group.id), cleanPayloadForFirestore(contact), { merge: true });
      }
    } catch (err) {
      console.warn("Notice saving group in Firestore:", err);
    }

    // Cache locally immediately
    try {
      const current = await this.getGroups();
      const idx = current.findIndex(g => g.id === group.id);
      if (idx >= 0) {
        current[idx] = payload;
      } else {
        current.unshift(payload);
      }
      localStorage.setItem("gostars_admin_groups", JSON.stringify(current));
    } catch {}
  }

  static async deleteGroup(groupId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, "groups", groupId));
      await deleteDoc(doc(db, "sensitive_contacts", groupId));
    } catch (err) {
      console.warn("Notice deleting group from Firestore:", err);
    }

    try {
      const current = await this.getGroups();
      const filtered = current.filter(g => g.id !== groupId);
      localStorage.setItem("gostars_admin_groups", JSON.stringify(filtered));
    } catch {}
  }

  // ================= 4. REPORTS AUDIT HUB =================

  static async getCentralReports(): Promise<CentralReport[]> {
    const reportsMap = new Map<string, CentralReport>();

    try {
      const snap = await getDocs(collection(db, "reports"));
      if (!snap.empty) {
        snap.docs.forEach(d => {
          reportsMap.set(d.id, { ...d.data(), id: d.id } as CentralReport);
        });
      }
    } catch (err) {
      console.warn("Notice reading /reports from Firestore:", err);
    }

    // Fallback from Persistent Local Cache
    try {
      const cached = localStorage.getItem("gostars_admin_reports");
      if (cached) {
        const parsed: CentralReport[] = JSON.parse(cached);
        parsed.forEach(cr => {
          if (!reportsMap.has(cr.id)) {
            reportsMap.set(cr.id, cr);
          }
        });
      }
    } catch {}

    const results = Array.from(reportsMap.values()).sort(
      (a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime()
    );

    if (results.length > 0) {
      try {
        localStorage.setItem("gostars_admin_reports", JSON.stringify(results));
      } catch {}
    }

    return results;
  }

  // ================= 5. ACADEMY FINANCE OVERVIEW =================

  static async getPayments(): Promise<CentralPayment[]> {
    const paymentsMap = new Map<string, CentralPayment>();

    try {
      const snap = await getDocs(collection(db, "payments"));
      if (!snap.empty) {
        snap.docs.forEach(d => {
          paymentsMap.set(d.id, { ...d.data(), id: d.id } as CentralPayment);
        });
      }
    } catch (err) {
      console.warn("Notice reading /payments from Firestore:", err);
    }

    // Fallback from Persistent Local Cache
    try {
      const cached = localStorage.getItem("gostars_admin_payments");
      if (cached) {
        const parsed: CentralPayment[] = JSON.parse(cached);
        parsed.forEach(cp => {
          if (!paymentsMap.has(cp.id)) {
            paymentsMap.set(cp.id, cp);
          }
        });
      }
    } catch {}

    const results = Array.from(paymentsMap.values()).sort(
      (a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime()
    );

    if (results.length > 0) {
      try {
        localStorage.setItem("gostars_admin_payments", JSON.stringify(results));
      } catch {}
    }

    return results;
  }

  static async calculateAcademyFinanceSummary(): Promise<AcademyFinanceSummary> {
    const payments = await this.getPayments();
    const students = await this.getStudentsWithSensitiveData();
    const teachers = await this.getTeachers();
    const groups = await this.getGroups();
    const reports = await this.getCentralReports();

    const now = new Date();
    const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const monthRevenue = payments
      .filter(p => p.date && p.date.startsWith(currentMonthStr))
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    let totalLessonsCost = 0;
    let totalDueDebt = 0;
    let totalCreditSurplus = 0;

    students.forEach(s => {
      const attended = s.totalAttendedLessons || 0;
      const cost = s.lessonCost || 100;
      const consumed = attended * cost;
      totalLessonsCost += consumed;

      const net = (s.totalPaidAmount || 0) - consumed;
      if (net < 0) {
        totalDueDebt += Math.abs(net);
      } else if (net > 0) {
        totalCreditSurplus += net;
      }
    });

    const netAcademyProfit = totalRevenue - (totalLessonsCost * 0.7); // Example: 70% teacher share, 30% academy margin

    return {
      totalRevenue,
      monthRevenue,
      totalLessonsCost,
      totalDueDebt,
      totalCreditSurplus,
      netAcademyProfit: Math.round(netAcademyProfit),
      totalTeachersCount: teachers.length,
      totalStudentsCount: students.length,
      totalGroupsCount: groups.length,
      totalReportsCount: reports.length
    };
  }

  // ================= 6. SUPERVISOR & RBAC MANAGEMENT =================

  static async getSupervisors(): Promise<UserProfile[]> {
    try {
      const q = query(collection(db, "users"), where("role", "in", ["supervisor", "admin"]));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map(d => ({ ...d.data(), uid: d.id } as UserProfile));
      }
    } catch (err) {
      console.warn("Notice reading supervisors:", err);
    }

    // Return empty array when no supervisors configured yet
    return [];
  }

  static async saveSupervisorPermissions(
    uid: string,
    permissions: SupervisorPermissions
  ): Promise<void> {
    const now = new Date().toISOString();
    try {
      const ref = doc(db, "users", uid);
      await updateDoc(ref, {
        permissions,
        updatedAt: now
      });
    } catch (err) {
      console.warn("Notice updating supervisor permissions:", err);
    }
  }
}
