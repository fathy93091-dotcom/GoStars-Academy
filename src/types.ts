/**
 * GoStars - Teacher Management System
 * Core Domain Type Definitions
 */

import { AppRoute } from "./navigation/routes";

// RBAC & Authentication Types
export type UserRole = "admin" | "supervisor" | "teacher" | "parent";

export type UserAccountStatus = "active" | "suspended" | "pending";

export interface SupervisorPermissions {
  canManageTeachers?: boolean;
  canManageStudents?: boolean;
  canViewSensitiveContacts?: boolean;
  canManageGroups?: boolean;
  canViewReports?: boolean;
  canManageFinance?: boolean;
}

export interface UserProfile {
  uid: string;
  role: UserRole;
  name: string;
  email: string;
  status: UserAccountStatus;
  photoURL?: string;
  phoneNumber?: string;
  assignedTeacherId?: string;
  assignedStudentIds?: string[];
  permissions?: SupervisorPermissions;
  createdAt: string;
  updatedAt: string;
}

// Central Academy Data Models (Stage 3.2)
export interface TeacherRecord {
  id: string;
  authUid: string;
  name: string;
  email: string;
  phone?: string;
  specialties?: string[];
  assignedGroupIds?: string[];
  assignedStudentIds?: string[];
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface ParentRecord {
  id: string;
  authUid?: string;
  name: string;
  email?: string;
  phone?: string; // Isolated sensitive contact
  studentIds: string[];
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface SensitiveContactRecord {
  id: string; // studentId or groupId
  entityType: "student" | "group" | "parent";
  parentContact?: string;
  studentPhone?: string;
  whatsappGroupLink?: string;
  parentWhatsapp?: string;
  updatedAt: string;
}

export interface CentralStudent {
  id: string;
  name: string;
  fullName: string;
  studentNumber?: string;
  academicYear?: string;
  curriculum?: string;
  studyType: StudyType;
  status: StudentStatus;
  parentIds: string[];
  teacherIds: string[];
  groupIds: string[];
  subject: string;
  subjects?: StudentSubjectPlan[];
  lessonCost: number;
  totalPaidAmount: number;
  totalAttendedLessons?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CentralGroup {
  id: string;
  name: string;
  subject: string;
  academicYear?: string;
  teacherIds: string[];
  studentIds: string[];
  days: string[];
  time: string;
  durationMinutes: number;
  scheduleSlots?: ScheduleSlot[];
  status: "active" | "paused";
  createdAt: string;
  updatedAt: string;
}

export interface CentralLesson {
  id: string;
  studyType: StudyType;
  groupId?: string;
  groupName?: string;
  studentId?: string;
  studentName?: string;
  teacherId: string;
  subject: string;
  date: string;
  time: string;
  durationMinutes: number;
  status: LessonStatus;
  teacherNotes?: string;
  aiInstructions?: string;
  generatedReport?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CentralAttendance {
  id: string;
  lessonId: string;
  studentId: string;
  studentName?: string;
  teacherId: string;
  groupId?: string;
  subject?: string;
  lessonNumber?: number;
  attendance: AttendanceStatus;
  homeworkStatus: HomeworkStatus;
  teacherNotes?: string;
  aiInstructions?: string;
  generatedReportText?: string;
  deducted: boolean;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CombinedAdminStudent extends CentralStudent {
  parentContact?: string;
  parentPhone?: string;
  studentPhone?: string;
  whatsappGroupLink?: string;
  parentWhatsapp?: string;
  parentName?: string;
  teacherName?: string;
  groupName?: string;
}

export interface CentralReport {
  id: string;
  reportType?: "individual" | "group";
  groupId?: string;
  groupName?: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName?: string;
  studyType?: StudyType;
  lessonId?: string;
  subject: string;
  date: string;
  lessonNumber?: number;
  attendance?: AttendanceStatus;
  attendanceStatus?: AttendanceStatus;
  deductCost?: boolean;
  homeworkStatus?: HomeworkStatus;
  homeworkRating?: "excellent" | "good" | "fair" | "missed";
  behaviorRating?: "excellent" | "good" | "needs_improvement";
  progressRating?: "excellent" | "good" | "slow";
  memorizationProgress?: string;
  tajweedLevel?: string;
  notes?: string;
  teacherNotes: string;
  aiInstructions: string;
  strengths?: string;
  recommendations?: string;
  reportText?: string;
  generatedText?: string;
  archived?: boolean;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CentralPayment {
  id: string;
  studentId: string;
  studentName: string;
  teacherId?: string;
  amount: number; // المبلغ المدفوع فقط
  date: string;
  paymentMethod?: string; // e.g. "كاش", "فودافون كاش", "إنستاباي", "تحويل بنكي"
  receiptNumber?: string;
  notes?: string;
  lessonsCovered?: number;
  lessonsCount?: number;
  lessonCost?: number;
  createdAt: string;
  updatedAt: string;
}

export type StudyType = "group" | "private";

export type StudentStatus = "active" | "stopped";

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export type HomeworkStatus = "done" | "not_done" | "late";

export type PaymentStatus = "paid" | "unpaid";

export type LessonStatus = "upcoming" | "starting_soon" | "completed";

export interface StudentSubjectPlan {
  id: string;
  subject: string;
  studyType: StudyType; // "group" | "private"
  academicYear?: string; // الصف الدراسي e.g. "الصف الأول الثانوي"
  curriculum?: string; // المنهج e.g. "مصري", "سعودي", "إماراتي", "دولي"
  lessonCost: number; // سعر الحصة للمادة
  totalPaidAmount?: number; // إجمالي المسدد لهذه المادة
  totalAttendedLessons?: number; // إجمالي الحصص المنفذة لهذه المادة
  notes?: string;
}

export interface Student {
  id: string;
  fullName: string;
  studentNumber?: string;
  studentPhone?: string;
  academicYear?: string; // الصف الدراسي e.g. "الصف الأول الثانوي", "الصف الثالث الإعدادي"
  curriculum?: string; // المنهج الدراسي
  parentContact: string; // WhatsApp number e.g. "+201000000000"
  whatsappGroupLink?: string; // WhatsApp group link
  studyType: StudyType;
  groupId?: string;
  groupName?: string;
  subject: string;
  subjects?: StudentSubjectPlan[]; // Multi-subject enrollment
  status: StudentStatus;
  
  // Unified Financial System
  paymentStatus: PaymentStatus;
  lessonCost: number; // سعر الحصة
  totalPaidAmount: number; // إجمالي المدفوعات المسددة
  totalAttendedLessons?: number; // إجمالي الحصص المنفذة
  remainingLessons?: number;
  remainingBalance?: number;
  subscriptionType?: string;
  
  notes?: string;
  scheduleSlots?: ScheduleSlot[];
  createdAt: string;
}

export interface ScheduleSlot {
  day: string; // e.g. "السبت", "الأحد"
  time: string; // e.g. "17:00", "19:00", "05:00 PM"
  durationMinutes?: number; // e.g. 60, 90
}

export interface Group {
  id: string;
  name: string; // e.g., "مجموعة الفيزياء أ"
  subject: string;
  days: string[]; // e.g., ["السبت", "الأحد"]
  time: string; // default/fallback time e.g., "16:00"
  durationMinutes: number; // e.g., 90
  scheduleSlots?: ScheduleSlot[]; // mixed/custom per-day times e.g. [{day: "السبت", time: "17:00"}, {day: "الأحد", time: "19:00"}]
  studentIds: string[];
  status: "active" | "paused";
  whatsappGroupLink?: string; // WhatsApp group link
  parentWhatsapp?: string; // Parent or group WhatsApp link/number
  createdAt: string;
}

export interface PrivateLesson {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  days: string[]; // e.g., ["السبت", "الأحد"]
  time: string; // default/fallback time e.g., "16:00"
  durationMinutes: number;
  scheduleSlots?: ScheduleSlot[]; // mixed/custom per-day times e.g. [{day: "السبت", time: "17:00"}, {day: "الأحد", time: "19:00"}]
  status: "active" | "paused";
  whatsappGroupLink?: string; // WhatsApp group link
  parentWhatsapp?: string;
  createdAt: string;
}

export interface AttendanceRecord {
  id: string;
  lessonId: string;
  studentId: string;
  studentName?: string;
  subject?: string;
  lessonNumber?: number;
  attendance: AttendanceStatus;
  homeworkStatus: HomeworkStatus;
  teacherNotes?: string;
  aiInstructions?: string;
  generatedReportText?: string;
  deducted: boolean; // whether 1 lesson was deducted upon "present" or billable absent
  date: string;
}

export interface Lesson {
  id: string;
  studyType: StudyType;
  groupId?: string;
  groupName?: string;
  studentId?: string;
  studentName?: string;
  subject: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  status: LessonStatus;
  whatsappGroupLink?: string; // WhatsApp group link
  teacherNotes?: string; // ماذا حدث في الحصة؟
  aiInstructions?: string; // تعليمات للذكاء الاصطناعي
  generatedReport?: string;
  createdAt: string;
}

export interface ExamRecord {
  id: string;
  studentId: string;
  studentName?: string;
  examName: string;
  score: number;
  totalScore: number;
  date: string;
}

export interface PaymentTransaction {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  date: string;
  paymentMethod?: string; // e.g. "كاش", "فودافون كاش", "إنستاباي", "تحويل بنكي", "أخرى"
  receiptNumber?: string;
  notes?: string;
  lessonsCovered?: number;
  lessonsCount?: number;
  lessonCost?: number;
}

export interface ReportAttachment {
  fileName?: string;
  mimeType: string;
  data: string; // Base64 string without data:mime;base64, prefix
  previewUrl?: string;
}

export interface GeneratedReport {
  id: string;
  reportType?: "individual" | "group";
  lessonId?: string;
  groupId?: string;
  groupName?: string;
  studentId: string;
  studentName: string;
  date: string;
  subject: string;
  lessonNumber?: number;
  attendance?: AttendanceStatus;
  deductCost?: boolean;
  homeworkStatus?: HomeworkStatus;
  teacherNotes: string;
  aiInstructions: string;
  reportText?: string;
  generatedText?: string;
  items?: Record<string, any>;
  archived?: boolean;
  archivedAt?: string;
  createdAt: string;
}

export interface SubjectAiInstruction {
  subject: string;
  instruction: string;
}

export interface AppSettings {
  teacherName: string;
  preferredLanguage: "ar" | "en";
  generalAiInstructions: string;
  defaultSubject?: string;
  subjectDefaults: SubjectAiInstruction[];
  notificationMinutesBefore: number; // 5, 10, 15
  notificationsEnabled: boolean;
}

export interface AppNotification {
  id: string;
  type: "unpaid" | "low_balance" | "reminder" | "system";
  title: string;
  message: string;
  studentId?: string;
  studentName?: string;
  amountDue?: number;
  remainingLessons?: number;
  date?: string;
}

export interface GoStarsBackupData {
  version: string;
  exportedAt: string;
  students: Student[];
  groups: Group[];
  privateLessons: PrivateLesson[];
  lessons: Lesson[];
  attendanceRecords: AttendanceRecord[];
  examRecords: ExamRecord[];
  paymentTransactions: PaymentTransaction[];
  reports: GeneratedReport[];
  settings: AppSettings;
}

// ================= CMS (NO-CODE SITE CONTENT) TYPES =================

export interface CmsHeroSettings {
  badgeAr: string;
  badgeEn: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  highlight1Ar: string;
  highlight1En: string;
  highlight2Ar: string;
  highlight2En: string;
  highlight3Ar: string;
  highlight3En: string;
  ctaPrimaryAr: string;
  ctaPrimaryEn: string;
  ctaSecondaryAr: string;
  ctaSecondaryEn: string;
}

export interface CmsAnnouncementBanner {
  isActive: boolean;
  type: "gold" | "blue" | "emerald" | "rose" | "purple";
  badgeAr: string;
  badgeEn: string;
  textAr: string;
  textEn: string;
  linkRoute?: AppRoute;
  linkTextAr?: string;
  linkTextEn?: string;
  isDismissable?: boolean;
}

export interface CmsSectionVisibility {
  showAnnouncementBanner: boolean;
  showHero: boolean;
  showPillars: boolean;
  showFeaturedCurricula: boolean;
  showWhyGoStars: boolean;
  showHonorStars: boolean;
  showStats: boolean;
  showFaq: boolean;
  showBottomCta: boolean;
}

export interface CmsFaqItem {
  id: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  category: "general" | "curricula" | "pricing" | "sessions" | "teachers";
  order: number;
  isActive: boolean;
}

export interface CmsCurriculumItem {
  id: string;
  country: "egypt" | "saudi" | "uae" | "kuwait" | "azhar" | "international";
  stage: "foundation" | "primary" | "middle" | "secondary";
  subject: "quran" | "arabic" | "islamic" | "science_math" | "nooraniyah";
  titleAr: string;
  titleEn: string;
  gradeLabelAr: string;
  gradeLabelEn: string;
  descriptionAr: string;
  descriptionEn: string;
  topicsAr: string[];
  topicsEn: string[];
  objectivesAr: string[];
  objectivesEn: string[];
  featuredOnHome: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CmsAboutSettings {
  storyTitleAr: string;
  storyTitleEn: string;
  storyContentAr: string;
  storyContentEn: string;
  missionTitleAr: string;
  missionTitleEn: string;
  missionContentAr: string;
  missionContentEn: string;
  visionTitleAr: string;
  visionTitleEn: string;
  visionContentAr: string;
  visionContentEn: string;
}

export interface CmsContactSettings {
  primaryPhone: string;
  whatsappNumber: string;
  supportEmail: string;
  officeHoursAr: string;
  officeHoursEn: string;
  telegramLink?: string;
  addressAr: string;
  addressEn: string;
}

export interface CmsBrandingSettings {
  academyNameAr: string;
  academyNameEn: string;
  academySloganAr: string;
  academySloganEn: string;
  logoUrl?: string;
  logoStyle?: "default_crest" | "modern_star" | "golden_book" | "luxury_crest" | "custom_image";
  faviconUrl?: string;
  primaryColor?: string;
  accentColor?: string;
}

export interface CmsGalleryItem {
  id: string;
  url: string;
  titleAr: string;
  titleEn: string;
  category?: string;
}

export interface CmsPageImages {
  heroBannerImage?: string;
  aboutStoryImage?: string;
  aboutMissionImage?: string;
  curriculaHeaderImage?: string;
  honorRollHeroImage?: string;
  contactHeaderImage?: string;
  pricingBannerImage?: string;
  teachersHeroImage?: string;
  gallery?: CmsGalleryItem[];
}

export interface SiteContentSettings {
  id: string; // "main_config"
  branding: CmsBrandingSettings;
  images: CmsPageImages;
  hero: CmsHeroSettings;
  announcementBanner: CmsAnnouncementBanner;
  visibility: CmsSectionVisibility;
  about: CmsAboutSettings;
  contact: CmsContactSettings;
  faqList: CmsFaqItem[];
  curriculaList: CmsCurriculumItem[];
  updatedAt: string;
  updatedBy?: string;
}

// ================= STUDENT & PARENT PORTAL TYPES =================

export type CertificateType =
  | "honor_roll"
  | "memorization"
  | "academic_excellence"
  | "perfect_attendance";

export interface StudentCertificate {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  titleEn?: string;
  trackOrSubject: string;
  issueDate: string;
  appreciationText: string;
  certificateType: CertificateType;
  teacherName: string;
  serialNumber: string;
  gradeBadge?: string;
}

export interface MonthlyStudentEvaluation {
  id: string;
  studentId: string;
  monthLabel: string;
  year: number;
  attendanceRate: number;
  homeworkRate: number;
  averageScore: number;
  generalRating: "ممتاز مرتفع (A+)" | "ممتاز (A)" | "جيد جداً (B+)" | "جيد (B)";
  strengths: string[];
  recommendations: string[];
  teacherNotes: string;
  memorizationProgress?: string;
  tajweedLevel?: string;
}

// ================= TERMUX WHATSAPP ENGINE TYPES (Phase 11) =================

export type WhatsAppRoutingMode = "private" | "group" | "dual" | "disabled";

export type OutboxMessageStatus = "pending" | "sending" | "sent" | "failed" | "cancelled";

export interface WhatsAppOutboxMessage {
  id: string;
  recipientType: "parent_private" | "group_chat" | "admin_test";
  recipientTarget: string; // Phone number or group link/id
  recipientName: string;
  studentId?: string;
  studentName?: string;
  groupId?: string;
  groupName?: string;
  subject?: string;
  messageType: "lesson_report" | "payment_receipt" | "monthly_evaluation" | "certificate" | "admin_broadcast" | "test";
  messageText: string;
  status: OutboxMessageStatus;
  attempts: number;
  maxAttempts: number;
  scheduledAt: string;
  sentAt?: string;
  errorMessage?: string;
  relatedEntityId?: string; // reportId, paymentId, certId
  createdAt: string;
  updatedAt: string;
}

export interface WhatsAppRoutingConfig {
  defaultReportRouting: WhatsAppRoutingMode;
  defaultPaymentRouting: WhatsAppRoutingMode;
  defaultEvaluationRouting: WhatsAppRoutingMode;
  defaultCertificateRouting: WhatsAppRoutingMode;
  customGroupRoutings: Record<string, WhatsAppRoutingMode>;
  autoSendEnabled: boolean;
  sendDelaySeconds: number;
  adminNotificationPhone?: string;
  termuxServerUrl: string;
  termuxApiKey?: string;
}

export interface TermuxServerStatus {
  instanceId: string;
  status: "online" | "offline" | "connecting" | "qr_ready" | "authenticated";
  serverUrl: string;
  apiKey?: string;
  linkedPhoneNumber?: string;
  qrCodeData?: string;
  batteryLevel?: number;
  isCharging?: boolean;
  cpuUsage?: number;
  memoryUsage?: string;
  lastHeartbeat: string;
  activeSessionName: string;
  pendingQueueCount: number;
  totalSentToday: number;
  totalFailedToday: number;
}
