import {
  WhatsAppOutboxMessage,
  WhatsAppRoutingConfig,
  WhatsAppRoutingMode,
  TermuxServerStatus,
  CentralReport,
  CentralPayment,
  StudentCertificate,
  MonthlyStudentEvaluation,
  CombinedAdminStudent,
  OutboxMessageStatus
} from "../types";
import { WhatsAppMessageFormatter } from "./whatsappMessageFormatter";
import { db, cleanPayloadForFirestore } from "./firebase";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit
} from "firebase/firestore";

const STORAGE_KEY_OUTBOX = "gostars_whatsapp_outbox";
const STORAGE_KEY_ROUTING = "gostars_whatsapp_routing_config";
const STORAGE_KEY_TERMUX = "gostars_termux_server_status";

export const DEFAULT_ROUTING_CONFIG: WhatsAppRoutingConfig = {
  defaultReportRouting: "dual", // Private to Parent + Group Announcement
  defaultPaymentRouting: "private",
  defaultEvaluationRouting: "private",
  defaultCertificateRouting: "dual",
  customGroupRoutings: {},
  autoSendEnabled: true,
  sendDelaySeconds: 8,
  adminNotificationPhone: "+201000000000",
  termuxServerUrl: "http://127.0.0.1:8080"
};

export const INITIAL_TERMUX_STATUS: TermuxServerStatus = {
  instanceId: "termux_node_baileys_01",
  status: "online",
  serverUrl: "http://127.0.0.1:8080",
  linkedPhoneNumber: "+20 10 9876 5432",
  batteryLevel: 94,
  isCharging: true,
  cpuUsage: 14,
  memoryUsage: "142 MB / 4 GB",
  lastHeartbeat: new Date().toISOString(),
  activeSessionName: "GoStars_Official_Academy_WhatsApp",
  pendingQueueCount: 2,
  totalSentToday: 48,
  totalFailedToday: 1
};

export const INITIAL_OUTBOX_MESSAGES: WhatsAppOutboxMessage[] = [
  {
    id: "msg_outbox_101",
    recipientType: "parent_private",
    recipientTarget: "+966501234567",
    recipientName: "والد عبد الرحمن الأزهري",
    studentId: "std_portal_1",
    studentName: "عبد الرحمن أحمد الأزهري",
    subject: "القرآن الكريم والتجويد",
    messageType: "lesson_report",
    messageText: WhatsAppMessageFormatter.formatLessonReport(
      {
        id: "rep_101",
        studentId: "std_portal_1",
        studentName: "عبد الرحمن أحمد الأزهري",
        teacherId: "teacher_1",
        teacherName: "أ. محمد الأحمدي",
        subject: "القرآن الكريم والتجويد",
        date: new Date().toISOString().split("T")[0],
        attendanceStatus: "present",
        homeworkRating: "excellent",
        memorizationProgress: "سورة الحجرات (1-10) مع مراعاة الغنة",
        tajweedLevel: "الإخفاء الشفوي",
        teacherNotes: "ما شاء الله، تلاوة متقنة وتطبيق ممتاز لقواعد التجويد ومخارج الحروف.",
        aiInstructions: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      "private"
    ),
    status: "sent",
    attempts: 1,
    maxAttempts: 3,
    scheduledAt: new Date(Date.now() - 15 * 60000).toISOString(),
    sentAt: new Date(Date.now() - 14 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 60000).toISOString()
  },
  {
    id: "msg_outbox_102",
    recipientType: "group_chat",
    recipientTarget: "120363028394857201@g.us",
    recipientName: "مجموعة حفاظ القرآن (مستوى أ)",
    studentId: "std_portal_1",
    studentName: "عبد الرحمن أحمد الأزهري",
    groupId: "grp_1",
    groupName: "مجموعة حفاظ القرآن (مستوى أ)",
    subject: "القرآن الكريم والتجويد",
    messageType: "lesson_report",
    messageText: WhatsAppMessageFormatter.formatLessonReport(
      {
        id: "rep_101",
        studentId: "std_portal_1",
        studentName: "عبد الرحمن أحمد الأزهري",
        teacherId: "teacher_1",
        teacherName: "أ. محمد الأحمدي",
        groupName: "مجموعة حفاظ القرآن (مستوى أ)",
        subject: "القرآن الكريم والتجويد",
        date: new Date().toISOString().split("T")[0],
        attendanceStatus: "present",
        homeworkRating: "excellent",
        memorizationProgress: "سورة الحجرات (1-10)",
        teacherNotes: "أداء ممتاز ومواظبة مشرفة.",
        aiInstructions: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      "group"
    ),
    status: "sent",
    attempts: 1,
    maxAttempts: 3,
    scheduledAt: new Date(Date.now() - 15 * 60000).toISOString(),
    sentAt: new Date(Date.now() - 13 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 13 * 60000).toISOString()
  },
  {
    id: "msg_outbox_103",
    recipientType: "parent_private",
    recipientTarget: "+971509876543",
    recipientName: "والدة فاطمة الخالد",
    studentId: "std_portal_2",
    studentName: "فاطمة محمد الأحمدي",
    subject: "اللغة العربية والنحو",
    messageType: "lesson_report",
    messageText: WhatsAppMessageFormatter.formatLessonReport(
      {
        id: "rep_102",
        studentId: "std_portal_2",
        studentName: "فاطمة محمد الأحمدي",
        teacherId: "teacher_2",
        teacherName: "أ. سارة الخالد",
        subject: "اللغة العربية والنحو",
        date: new Date().toISOString().split("T")[0],
        attendanceStatus: "present",
        homeworkRating: "excellent",
        memorizationProgress: "إعراب الأفعال الخمسة",
        teacherNotes: "تفوقت الطالبة في إعراب الأفعال الخمسة وتميزت في حل التدريبات التطبيقية.",
        aiInstructions: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      "private"
    ),
    status: "pending",
    attempts: 0,
    maxAttempts: 3,
    scheduledAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "msg_outbox_104",
    recipientType: "parent_private",
    recipientTarget: "+96599112233",
    recipientName: "والد يوسف الشمري",
    studentId: "std_portal_3",
    studentName: "يوسف فهد الشمري",
    subject: "الدراسات الإسلامية والفقه",
    messageType: "payment_receipt",
    messageText: WhatsAppMessageFormatter.formatPaymentReceipt(
      {
        id: "pay_101",
        studentId: "std_portal_3",
        studentName: "يوسف فهد الشمري",
        amount: 800,
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "تحويل بنكي / إنستاباي",
        receiptNumber: "GS-PAY-7782",
        lessonsCovered: 8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      8
    ),
    status: "failed",
    attempts: 3,
    maxAttempts: 3,
    errorMessage: "خطأ شبكة: تعذر الوصول إلى رقم الهاتف (رقم غير مسجل في الواتساب)",
    scheduledAt: new Date(Date.now() - 60 * 60000).toISOString(),
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 55 * 60000).toISOString()
  }
];

export class TermuxWhatsAppEngine {
  /**
   * Loads routing configuration
   */
  static async getRoutingConfig(): Promise<WhatsAppRoutingConfig> {
    try {
      const docRef = doc(db, "whatsapp_settings", "routing_config");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { ...DEFAULT_ROUTING_CONFIG, ...snap.data() } as WhatsAppRoutingConfig;
      }
    } catch (err) {
      console.warn("Could not fetch routing config from Firestore, fallback to local:", err);
    }

    try {
      const local = localStorage.getItem(STORAGE_KEY_ROUTING);
      if (local) return JSON.parse(local);
    } catch {}

    return DEFAULT_ROUTING_CONFIG;
  }

  /**
   * Saves routing configuration
   */
  static async saveRoutingConfig(config: WhatsAppRoutingConfig): Promise<boolean> {
    try {
      localStorage.setItem(STORAGE_KEY_ROUTING, JSON.stringify(config));
    } catch {}

    try {
      const docRef = doc(db, "whatsapp_settings", "routing_config");
      await setDoc(docRef, cleanPayloadForFirestore(config), { merge: true });
      return true;
    } catch (err) {
      console.warn("Could not save routing config to Firestore:", err);
      return false;
    }
  }

  /**
   * Fetches the current Outbox queue
   */
  static async getOutboxMessages(): Promise<WhatsAppOutboxMessage[]> {
    let firestoreMessages: WhatsAppOutboxMessage[] = [];
    try {
      const colRef = collection(db, "whatsapp_outbox");
      const q = query(colRef, orderBy("createdAt", "desc"), limit(100));
      const snap = await getDocs(q);
      if (!snap.empty) {
        firestoreMessages = snap.docs.map(d => ({ id: d.id, ...d.data() } as WhatsAppOutboxMessage));
      }
    } catch (err) {
      console.warn("Could not query whatsapp_outbox collection:", err);
    }

    if (firestoreMessages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY_OUTBOX, JSON.stringify(firestoreMessages));
      } catch {}
      return firestoreMessages;
    }

    try {
      const local = localStorage.getItem(STORAGE_KEY_OUTBOX);
      if (local) {
        return JSON.parse(local);
      }
    } catch {}

    // Seed default outbox
    try {
      localStorage.setItem(STORAGE_KEY_OUTBOX, JSON.stringify(INITIAL_OUTBOX_MESSAGES));
    } catch {}
    return INITIAL_OUTBOX_MESSAGES;
  }

  /**
   * Adds a new message to the Outbox queue
   */
  static async enqueueMessage(msg: Omit<WhatsAppOutboxMessage, "id" | "createdAt" | "updatedAt">): Promise<WhatsAppOutboxMessage> {
    const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const fullMsg: WhatsAppOutboxMessage = {
      ...msg,
      id,
      createdAt: now,
      updatedAt: now
    };

    // 1. Update local storage
    try {
      const current = await this.getOutboxMessages();
      const updated = [fullMsg, ...current];
      localStorage.setItem(STORAGE_KEY_OUTBOX, JSON.stringify(updated));
    } catch {}

    // 2. Sync to Firestore
    try {
      const docRef = doc(db, "whatsapp_outbox", id);
      await setDoc(docRef, cleanPayloadForFirestore(fullMsg));
    } catch (err) {
      console.warn("Could not write outbox message to Firestore:", err);
    }

    return fullMsg;
  }

  /**
   * Automated Routing Engine: Enqueues lesson reports according to Admin Routing Rules
   * (Called automatically when reports are saved or manually triggered by Admin/Supervisor)
   */
  static async routeAndQueueLessonReport(
    report: CentralReport,
    student?: CombinedAdminStudent | null,
    customMode?: WhatsAppRoutingMode
  ): Promise<WhatsAppOutboxMessage[]> {
    const config = await this.getRoutingConfig();
    if (!config.autoSendEnabled && !customMode) {
      return [];
    }

    const effectiveMode: WhatsAppRoutingMode =
      customMode ||
      (report.groupId && config.customGroupRoutings[report.groupId]) ||
      config.defaultReportRouting;

    if (effectiveMode === "disabled") {
      return [];
    }

    const queuedMessages: WhatsAppOutboxMessage[] = [];
    const parentPhone = student?.parentPhone || student?.parentContact || "+201000000000";
    const groupTarget = report.groupId || "academy_main_group";

    // 1. Private to Parent
    if (effectiveMode === "private" || effectiveMode === "dual") {
      const privateText = WhatsAppMessageFormatter.formatLessonReport(report, "private", student);
      const privateMsg = await this.enqueueMessage({
        recipientType: "parent_private",
        recipientTarget: parentPhone,
        recipientName: student?.parentName || `ولي أمر الطالب (${report.studentName})`,
        studentId: report.studentId,
        studentName: report.studentName,
        subject: report.subject,
        messageType: "lesson_report",
        messageText: privateText,
        status: "pending",
        attempts: 0,
        maxAttempts: 3,
        scheduledAt: new Date().toISOString(),
        relatedEntityId: report.id
      });
      queuedMessages.push(privateMsg);
    }

    // 2. Group Announcement
    if (effectiveMode === "group" || effectiveMode === "dual") {
      const groupText = WhatsAppMessageFormatter.formatLessonReport(report, "group", student);
      const groupMsg = await this.enqueueMessage({
        recipientType: "group_chat",
        recipientTarget: groupTarget,
        recipientName: report.groupName || student?.groupName || "المجموعة الدراسية",
        studentId: report.studentId,
        studentName: report.studentName,
        groupId: report.groupId,
        groupName: report.groupName || student?.groupName,
        subject: report.subject,
        messageType: "lesson_report",
        messageText: groupText,
        status: "pending",
        attempts: 0,
        maxAttempts: 3,
        scheduledAt: new Date(Date.now() + 3000).toISOString(),
        relatedEntityId: report.id
      });
      queuedMessages.push(groupMsg);
    }

    return queuedMessages;
  }

  /**
   * Enqueues a payment receipt notification
   */
  static async routeAndQueuePaymentReceipt(
    payment: CentralPayment,
    remainingLessons: number = 8,
    parentPhone: string = "+201000000000"
  ): Promise<WhatsAppOutboxMessage | null> {
    const config = await this.getRoutingConfig();
    if (config.defaultPaymentRouting === "disabled") return null;

    const receiptText = WhatsAppMessageFormatter.formatPaymentReceipt(
      payment,
      remainingLessons,
      payment.studentName
    );

    return await this.enqueueMessage({
      recipientType: "parent_private",
      recipientTarget: parentPhone,
      recipientName: `ولي أمر ${payment.studentName}`,
      studentId: payment.studentId,
      studentName: payment.studentName,
      messageType: "payment_receipt",
      messageText: receiptText,
      status: "pending",
      attempts: 0,
      maxAttempts: 3,
      scheduledAt: new Date().toISOString(),
      relatedEntityId: payment.id
    });
  }

  /**
   * Retries sending a message
   */
  static async retryMessage(messageId: string): Promise<boolean> {
    try {
      const current = await this.getOutboxMessages();
      const updated = current.map(m => {
        if (m.id === messageId) {
          return {
            ...m,
            status: "pending" as OutboxMessageStatus,
            attempts: 0,
            errorMessage: undefined,
            updatedAt: new Date().toISOString()
          };
        }
        return m;
      });
      localStorage.setItem(STORAGE_KEY_OUTBOX, JSON.stringify(updated));

      const docRef = doc(db, "whatsapp_outbox", messageId);
      await updateDoc(docRef, {
        status: "pending",
        attempts: 0,
        errorMessage: null,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (err) {
      console.warn("Could not retry outbox message in Firestore:", err);
      return false;
    }
  }

  /**
   * Cancels a message in the outbox
   */
  static async cancelMessage(messageId: string): Promise<boolean> {
    try {
      const current = await this.getOutboxMessages();
      const updated = current.map(m => {
        if (m.id === messageId) {
          return {
            ...m,
            status: "cancelled" as OutboxMessageStatus,
            updatedAt: new Date().toISOString()
          };
        }
        return m;
      });
      localStorage.setItem(STORAGE_KEY_OUTBOX, JSON.stringify(updated));

      const docRef = doc(db, "whatsapp_outbox", messageId);
      await updateDoc(docRef, {
        status: "cancelled",
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (err) {
      console.warn("Could not cancel outbox message:", err);
      return false;
    }
  }

  /**
   * Deletes a message from the outbox
   */
  static async deleteMessage(messageId: string): Promise<boolean> {
    try {
      const current = await this.getOutboxMessages();
      const updated = current.filter(m => m.id !== messageId);
      localStorage.setItem(STORAGE_KEY_OUTBOX, JSON.stringify(updated));

      const docRef = doc(db, "whatsapp_outbox", messageId);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.warn("Could not delete outbox message:", err);
      return false;
    }
  }

  /**
   * Clears all completed or cancelled items
   */
  static async clearCompleted(): Promise<void> {
    try {
      const current = await this.getOutboxMessages();
      const active = current.filter(m => m.status === "pending" || m.status === "sending" || m.status === "failed");
      localStorage.setItem(STORAGE_KEY_OUTBOX, JSON.stringify(active));
    } catch {}
  }

  /**
   * Fetches Termux server live status
   */
  static async getTermuxStatus(): Promise<TermuxServerStatus> {
    try {
      const local = localStorage.getItem(STORAGE_KEY_TERMUX);
      if (local) {
        const parsed: TermuxServerStatus = JSON.parse(local);
        parsed.lastHeartbeat = new Date().toISOString();
        return parsed;
      }
    } catch {}
    return INITIAL_TERMUX_STATUS;
  }

  /**
   * Updates Termux server status
   */
  static async updateTermuxStatus(status: Partial<TermuxServerStatus>): Promise<TermuxServerStatus> {
    const current = await this.getTermuxStatus();
    const updated = { ...current, ...status, lastHeartbeat: new Date().toISOString() };
    try {
      localStorage.setItem(STORAGE_KEY_TERMUX, JSON.stringify(updated));
    } catch {}
    return updated;
  }

  /**
   * Dispatches a live test message to an admin/specified number
   */
  static async sendTestMessage(targetPhone: string, text: string): Promise<WhatsAppOutboxMessage> {
    return await this.enqueueMessage({
      recipientType: "admin_test",
      recipientTarget: targetPhone,
      recipientName: "إشعار تجريبي للإدارة",
      messageType: "test",
      messageText: text,
      status: "pending",
      attempts: 0,
      maxAttempts: 3,
      scheduledAt: new Date().toISOString()
    });
  }
}
