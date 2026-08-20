import React, { useState, useEffect } from "react";
import {
  Student,
  Group,
  PrivateLesson,
  Lesson,
  AttendanceRecord,
  AttendanceStatus,
  HomeworkStatus,
  ExamRecord,
  PaymentTransaction,
  GeneratedReport,
  AppSettings,
  StudentStatus,
  GoStarsBackupData,
  ReportAttachment
} from "../types";
import { StorageEngine } from "../lib/storage";
import { useAuth } from "../lib/AuthContext";
import { syncReportToCentralFirestore, syncPaymentToCentralFirestore } from "../lib/centralDataEngine";
import { Header, NavTab } from "./Header";
import { MobileBottomNav } from "./MobileBottomNav";
import { DashboardView } from "./DashboardView";
import { StudentsView } from "./StudentsView";
import { GroupsView } from "./GroupsView";
import { ScheduleView } from "./ScheduleView";
import { FinanceView } from "./FinanceView";
import { ReportsArchiveView } from "./ReportsArchiveView";
import { StudentPersonalReportView } from "./StudentPersonalReportView";
import { GroupReportView } from "./GroupReportView";
import { SettingsAndBackupModal } from "./SettingsAndBackupModal";
import { Building2 } from "lucide-react";

interface TeacherPlatformViewProps {
  onBackToPublicSite: () => void;
}

export const TeacherPlatformView: React.FC<TeacherPlatformViewProps> = ({
  onBackToPublicSite
}) => {
  const { user } = useAuth();
  const currentTeacherId = user?.uid || "guest_teacher";

  // 1. Core State loaded from StorageEngine
  const [settings, setSettings] = useState<AppSettings>(() => StorageEngine.getSettings());
  const [students, setStudents] = useState<Student[]>(() => StorageEngine.getStudents());
  const [groups, setGroups] = useState<Group[]>(() => StorageEngine.getGroups());
  const [privateLessons, setPrivateLessons] = useState<PrivateLesson[]>(() => StorageEngine.getPrivateLessons());
  const [lessons, setLessons] = useState<Lesson[]>(() => StorageEngine.getLessons());
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => StorageEngine.getAttendanceRecords());
  const [examRecords, setExamRecords] = useState<ExamRecord[]>(() => StorageEngine.getExams());
  const [paymentTransactions, setPaymentTransactions] = useState<PaymentTransaction[]>(() => StorageEngine.getPayments());
  const [reports, setReports] = useState<GeneratedReport[]>(() => StorageEngine.getReports());

  // UI State
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [dismissedNotificationIds, setDismissedNotificationIds] = useState<string[]>([]);
  const [activeReportStudent, setActiveReportStudent] = useState<Student | null>(null);
  const [activeReportGroup, setActiveReportGroup] = useState<Group | null>(null);

  const isArabic = settings.preferredLanguage === "ar";

  // 2. Persist to storage whenever state updates
  useEffect(() => {
    StorageEngine.saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    StorageEngine.saveStudents(students);
  }, [students]);

  useEffect(() => {
    StorageEngine.saveGroups(groups);
  }, [groups]);

  useEffect(() => {
    StorageEngine.savePrivateLessons(privateLessons);
  }, [privateLessons]);

  useEffect(() => {
    StorageEngine.saveLessons(lessons);
  }, [lessons]);

  useEffect(() => {
    StorageEngine.saveAttendanceRecords(attendanceRecords);
  }, [attendanceRecords]);

  useEffect(() => {
    StorageEngine.saveExams(examRecords);
  }, [examRecords]);

  useEffect(() => {
    StorageEngine.savePayments(paymentTransactions);
  }, [paymentTransactions]);

  useEffect(() => {
    StorageEngine.saveReports(reports);
  }, [reports]);

  // 3. Handlers for Students
  const handleAddStudent = (studentData: Omit<Student, "id" | "createdAt">) => {
    const newStudent: Student = {
      ...studentData,
      id: `student_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setStudents(prev => [newStudent, ...prev]);
  };

  const handleEditStudent = (studentId: string, updatedFields: Partial<Student>) => {
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, ...updatedFields } : s))
    );
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
  };

  const handleUpdateStudentStatus = (studentId: string, status: StudentStatus) => {
    setStudents(prev =>
      prev.map(s => (s.id === studentId ? { ...s, status } : s))
    );
  };

  // 4. Financial Transaction Recording
  const handleRecordPayment = (
    studentId: string,
    amount: number,
    notes?: string,
    date?: string,
    paymentMethod?: string
  ) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const receiptNumber = `REC-${Date.now().toString().slice(-6)}`;
    const newTx: PaymentTransaction = {
      id: `tx_${Date.now()}`,
      studentId,
      studentName: student.fullName,
      amount: Number(amount) || 0,
      date: date || new Date().toISOString().split("T")[0],
      paymentMethod: paymentMethod || "كاش",
      receiptNumber,
      notes
    };

    setPaymentTransactions(prev => [newTx, ...prev]);
    syncPaymentToCentralFirestore(newTx, currentTeacherId).catch(() => {});
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          const newTotal = (s.totalPaidAmount || 0) + Number(amount);
          return {
            ...s,
            totalPaidAmount: newTotal,
            paymentStatus: newTotal > 0 ? "paid" : s.paymentStatus
          };
        }
        return s;
      })
    );
  };

  const handleDeletePayment = (txId: string) => {
    const targetTx = paymentTransactions.find(tx => tx.id === txId);
    if (!targetTx) return;

    setPaymentTransactions(prev => prev.filter(tx => tx.id !== txId));
    
    // Recalculate student totalPaidAmount
    setStudents(prev =>
      prev.map(s => {
        if (s.id === targetTx.studentId) {
          const remainingTotal = Math.max(0, (s.totalPaidAmount || 0) - (targetTx.amount || 0));
          return {
            ...s,
            totalPaidAmount: remainingTotal
          };
        }
        return s;
      })
    );
  };

  // 5. Exam Records
  const handleAddExamRecord = (
    studentId: string,
    examName: string,
    score: number,
    totalScore: number,
    date: string
  ) => {
    const student = students.find(s => s.id === studentId);
    const newExam: ExamRecord = {
      id: `exam_${Date.now()}`,
      studentId,
      studentName: student?.fullName,
      examName,
      score,
      totalScore,
      date
    };
    setExamRecords(prev => [newExam, ...prev]);
  };

  // 6. Reports
  const handleAddReport = (reportData: Omit<GeneratedReport, "id" | "createdAt">) => {
    const newReport: GeneratedReport = {
      ...reportData,
      id: `report_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setReports(prev => [newReport, ...prev]);
    syncReportToCentralFirestore(newReport, currentTeacherId).catch(() => {});
  };

  const handleSaveGroupReport = (groupReportData: {
    groupId: string;
    groupName: string;
    subject: string;
    date: string;
    items: Record<string, any>;
    generalNotes: string;
    aiSummary?: string;
  }) => {
    const newReport: GeneratedReport = {
      id: `rep_grp_${Date.now()}`,
      reportType: "group",
      groupId: groupReportData.groupId,
      groupName: groupReportData.groupName,
      studentId: "",
      studentName: groupReportData.groupName,
      date: groupReportData.date,
      subject: groupReportData.subject,
      teacherNotes: groupReportData.generalNotes,
      aiInstructions: groupReportData.aiSummary || "",
      reportText: groupReportData.aiSummary || groupReportData.generalNotes,
      generatedText: groupReportData.aiSummary || groupReportData.generalNotes,
      items: groupReportData.items,
      createdAt: new Date().toISOString()
    };
    setReports(prev => [newReport, ...prev]);
    syncReportToCentralFirestore(newReport, currentTeacherId).catch(() => {});
  };

  const handleDeleteReport = (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
  };

  const handleToggleArchiveReport = (reportId: string) => {
    setReports(prev =>
      prev.map(r =>
        r.id === reportId
          ? { ...r, archived: !r.archived, archivedAt: !r.archived ? new Date().toISOString() : undefined }
          : r
      )
    );
  };

  // Group AI Generation
  const handleGenerateGroupReportAi = async (payload: {
    groupName: string;
    subject: string;
    date: string;
    items: Record<string, any>;
    students: Student[];
    generalNotes: string;
  }): Promise<string> => {
    try {
      const idToken = user ? await user.getIdToken().catch(() => null) : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (idToken) {
        headers["Authorization"] = `Bearer ${idToken}`;
      } else {
        headers["Authorization"] = `Bearer session_${currentTeacherId}`;
      }

      const response = await fetch("/api/ai/generate-report", {
        method: "POST",
        headers,
        body: JSON.stringify({
          studentName: payload.groupName,
          subject: payload.subject,
          teacherNotes: `تقرير حصة جماعية لمجموعة ${payload.groupName}. الملاحظات العامة: ${payload.generalNotes}. إجمالي عدد الطلاب: ${payload.students.length}.`,
          aiInstructions: "قم بصياغة ملخص أكاديمي تنفيذي شامل للحصة الجماعية مع توجيهات تربوية لتحفيز الطلاب.",
          preferredLanguage: settings.preferredLanguage
        })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.reportText) return data.reportText;
      }
    } catch (e) {
      console.warn("Group report AI generation failed, using fallback:", e);
    }

    if (isArabic) {
      return `أظهرت المجموعة تفاعلاً إيجابياً ومتميزاً خلال حصة (${payload.subject}) لتاريخ ${payload.date}. تم مراجعة المفاهيم الرئيسية وحل التطبيقات العملية مع رصد مستوى الطلاب بدقة. نوصي باستمرار التحضير والالتزام بحل الواجبات لضمان التميز المستمر.`;
    } else {
      return `The group demonstrated solid engagement and high performance during today's session in (${payload.subject}). Key topics were thoroughly covered with dedicated individual support. We recommend continuous practice and homework submission.`;
    }
  };

  // AI Report Generation
  const handleGenerateReportAi = async (payload: {
    studentName: string;
    subject: string;
    teacherNotes: string;
    aiInstructions: string;
    attachment?: ReportAttachment;
  }): Promise<string> => {
    try {
      const idToken = user ? await user.getIdToken().catch(() => null) : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (idToken) {
        headers["Authorization"] = `Bearer ${idToken}`;
      } else {
        headers["Authorization"] = `Bearer session_${currentTeacherId}`;
      }

      const response = await fetch("/api/ai/generate-report", {
        method: "POST",
        headers,
        body: JSON.stringify({
          ...payload,
          preferredLanguage: settings.preferredLanguage
        })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.reportText) return data.reportText;
      }
    } catch (e) {
      console.warn("API report generation failed, using fallback:", e);
    }

    if (isArabic) {
      return `عزيزي ولي أمر الطالب/الطالبة ${payload.studentName}،

تحية طيبة وبعد،،
يسرنا أن نضع بين أيديكم تقرير المتابعة الخاص بحصة مادة (${payload.subject}):

📝 ملاحظات وتفاصيل الحصة:
${payload.teacherNotes || "تم الشرح والتطبيق العملي ومتابعة مستوى الطالب بكفاءة."}

💡 التوجيه والتوصية:
${payload.aiInstructions || "نوصي بمتابعة المراجعة الدورية للحفاظ على هذا المستوى المتميز."}

شاكرين لكم حسن تعاونكم ودعمكم المستمر.
مع أطيب التحيات،
نظام GoStars لإدارة المعلم`;
    } else {
      return `Dear Parent of ${payload.studentName},

We are pleased to share the lesson progress update for (${payload.subject}):

Lesson Details:
${payload.teacherNotes || "The lesson was conducted smoothly with active student engagement."}

Teacher's Recommendation:
${payload.aiInstructions || "We recommend continuing the regular review to maintain this high performance."}

Thank you for your ongoing support!
Best regards,
GoStars Academic System`;
    }
  };

  // 7. Handlers for Groups
  const handleAddGroup = (groupData: Omit<Group, "id" | "createdAt">) => {
    const newGroup: Group = {
      ...groupData,
      id: `group_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setGroups(prev => [newGroup, ...prev]);
  };

  const handleUpdateGroup = (groupId: string, updatedFields: Partial<Group>) => {
    setGroups(prev =>
      prev.map(g => (g.id === groupId ? { ...g, ...updatedFields } : g))
    );
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
  };

  // 8. Handlers for Private Lessons
  const handleAddPrivateLesson = (lessonData: Omit<PrivateLesson, "id" | "createdAt">) => {
    const newLesson: PrivateLesson = {
      ...lessonData,
      id: `priv_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setPrivateLessons(prev => [newLesson, ...prev]);
  };

  const handleUpdatePrivateLesson = (id: string, updatedFields: Partial<PrivateLesson>) => {
    setPrivateLessons(prev =>
      prev.map(l => (l.id === id ? { ...l, ...updatedFields } : l))
    );
  };

  const handleDeletePrivateLesson = (id: string) => {
    setPrivateLessons(prev => prev.filter(l => l.id !== id));
  };

  // 9. Save Lesson Attendance & Notes from Groups View
  const handleSaveAttendanceAndNotes = (
    lessonId: string,
    attendanceList: { studentId: string; attendance: AttendanceStatus; homeworkStatus: HomeworkStatus }[],
    teacherNotes: string,
    aiInstructions: string,
    generatedReportText?: string
  ) => {
    const dateToday = new Date().toISOString().split("T")[0];
    const newRecords: AttendanceRecord[] = attendanceList.map(item => {
      const student = students.find(s => s.id === item.studentId);
      return {
        id: `att_${Date.now()}_${item.studentId}`,
        lessonId,
        studentId: item.studentId,
        studentName: student?.fullName,
        attendance: item.attendance,
        homeworkStatus: item.homeworkStatus,
        teacherNotes,
        aiInstructions,
        generatedReportText,
        deducted: item.attendance === "present",
        date: dateToday
      };
    });

    setAttendanceRecords(prev => [...newRecords, ...prev]);

    // Update lesson notes
    setLessons(prev =>
      prev.map(l =>
        l.id === lessonId
          ? {
              ...l,
              status: "completed",
              teacherNotes,
              aiInstructions,
              generatedReport: generatedReportText
            }
          : l
      )
    );
  };

  // 10. Backup & Settings Handlers
  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    setIsSettingsOpen(false);
    setIsBackupOpen(false);
  };

  const handleExportBackup = (): GoStarsBackupData => {
    return StorageEngine.exportBackupJSON();
  };

  const handleRestoreBackup = (backupData: GoStarsBackupData): boolean => {
    if (backupData.settings) setSettings(backupData.settings);
    if (backupData.students) setStudents(backupData.students);
    if (backupData.groups) setGroups(backupData.groups);
    if (backupData.privateLessons) setPrivateLessons(backupData.privateLessons);
    if (backupData.lessons) setLessons(backupData.lessons);
    if (backupData.attendanceRecords) setAttendanceRecords(backupData.attendanceRecords);
    if (backupData.examRecords) setExamRecords(backupData.examRecords);
    if (backupData.paymentTransactions) setPaymentTransactions(backupData.paymentTransactions);
    if (backupData.reports) setReports(backupData.reports);
    StorageEngine.saveUserWorkspace(undefined, backupData);
    setIsBackupOpen(false);
    return true;
  };

  const handleToggleLanguage = () => {
    setSettings(prev => ({
      ...prev,
      preferredLanguage: prev.preferredLanguage === "ar" ? "en" : "ar"
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Top Banner with Quick Switch to Public Academy Website */}
      <div className="bg-[#0B192C] border-b border-slate-800 py-2 px-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-amber-300">
            {isArabic ? "بيئة المعلم والإدارة الذكية (GoStars Teacher Suite)" : "GoStars Teacher Suite"}
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-400">
            {isArabic ? "جميع الوظائف الأساسية نشطة وقابلة للاختبار والتجربة المباشرة" : "All core functionalities active and testable"}
          </span>
        </div>

        <button
          onClick={onBackToPublicSite}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/40 text-xs font-bold transition cursor-pointer"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>{isArabic ? "العودة إلى الموقع العام للأكاديمية" : "Back to Public Website"}</span>
        </button>
      </div>

      {/* Main Teacher Platform Header */}
      <Header
        settings={settings}
        students={students}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveReportStudent(null);
          setActiveReportGroup(null);
          setActiveTab(tab);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenBackupModal={() => setIsBackupOpen(true)}
        onSearchChange={setActiveSearchQuery}
        activeSearchQuery={activeSearchQuery}
        onToggleLanguage={handleToggleLanguage}
        dismissedNotificationIds={dismissedNotificationIds}
        onDismissNotification={(id) => setDismissedNotificationIds(prev => [...prev, id])}
        onDismissAllNotifications={(ids) => setDismissedNotificationIds(prev => [...prev, ...ids])}
        onRestoreNotifications={() => setDismissedNotificationIds([])}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-[1750px] w-full mx-auto p-3 sm:p-5 lg:p-6 pb-24 lg:pb-8">
        {activeReportStudent ? (
          <StudentPersonalReportView
            student={activeReportStudent}
            settings={settings}
            reports={reports}
            attendanceRecords={attendanceRecords}
            isArabic={isArabic}
            onBack={() => setActiveReportStudent(null)}
            onAddReport={(rep) => {
              handleAddReport(rep);
            }}
            onDeleteReport={handleDeleteReport}
            onToggleArchiveReport={handleToggleArchiveReport}
            onGenerateReportAi={handleGenerateReportAi}
          />
        ) : activeReportGroup ? (
          <GroupReportView
            group={activeReportGroup}
            students={students}
            isArabic={isArabic}
            onBack={() => setActiveReportGroup(null)}
            onSaveReport={handleSaveGroupReport}
            onGenerateReportAi={handleGenerateGroupReportAi}
          />
        ) : (
          <>
            {activeTab === "home" && (
              <DashboardView
                settings={settings}
                students={students}
                groups={groups}
                privateLessons={privateLessons}
                lessons={lessons}
                attendanceRecords={attendanceRecords}
                onOpenLessonDetails={() => setActiveTab("schedule")}
                onNavigateToTab={(tab) => {
                  setActiveReportStudent(null);
                  setActiveReportGroup(null);
                  setActiveTab(tab as NavTab);
                }}
                dismissedNotificationIds={dismissedNotificationIds}
                onDismissNotification={(id) => setDismissedNotificationIds(prev => [...prev, id])}
                onDismissAllNotifications={(ids) => setDismissedNotificationIds(prev => [...prev, ...ids])}
                onRestoreNotifications={() => setDismissedNotificationIds([])}
              />
            )}

            {activeTab === "students" && (
              <StudentsView
                settings={settings}
                students={students}
                attendanceRecords={attendanceRecords}
                examRecords={examRecords}
                paymentTransactions={paymentTransactions}
                reports={reports}
                onAddStudent={handleAddStudent}
                onEditStudent={handleEditStudent}
                onDeleteStudent={handleDeleteStudent}
                onUpdateStudentStatus={handleUpdateStudentStatus}
                onRecordPayment={handleRecordPayment}
                onAddExamRecord={handleAddExamRecord}
                onAddReport={handleAddReport}
                onDeleteReport={handleDeleteReport}
                onToggleArchiveReport={handleToggleArchiveReport}
                onGenerateReportAi={handleGenerateReportAi}
              />
            )}

            {activeTab === "groups" && (
              <GroupsView
                settings={settings}
                groups={groups}
                privateLessons={privateLessons}
                students={students}
                lessons={lessons}
                attendanceRecords={attendanceRecords}
                examRecords={examRecords}
                paymentTransactions={paymentTransactions}
                reports={reports}
                onAddGroup={handleAddGroup}
                onAddPrivateLesson={handleAddPrivateLesson}
                onUpdateGroup={handleUpdateGroup}
                onDeleteGroup={handleDeleteGroup}
                onUpdatePrivateLesson={handleUpdatePrivateLesson}
                onDeletePrivateLesson={handleDeletePrivateLesson}
                onAddStudent={handleAddStudent}
                onEditStudent={handleEditStudent}
                onDeleteStudent={handleDeleteStudent}
                onUpdateStudentStatus={handleUpdateStudentStatus}
                onRecordPayment={(studentId, amount, _lessonsCount, notes) => handleRecordPayment(studentId, amount, notes)}
                onAddExamRecord={handleAddExamRecord}
                onSaveAttendanceAndNotes={handleSaveAttendanceAndNotes}
                onGenerateReportAi={handleGenerateReportAi}
              />
            )}

            {activeTab === "schedule" && (
              <ScheduleView
                settings={settings}
                groups={groups}
                privateLessons={privateLessons}
                lessons={lessons}
                onOpenLesson={() => setActiveTab("groups")}
              />
            )}

            {activeTab === "reports" && (
              <ReportsArchiveView
                settings={settings}
                students={students}
                groups={groups}
                reports={reports}
                isArabic={isArabic}
                onOpenPersonalReport={(student) => {
                  setActiveReportStudent(student);
                  setActiveReportGroup(null);
                }}
                onOpenGroupReport={(group) => {
                  setActiveReportGroup(group);
                  setActiveReportStudent(null);
                }}
                onDeleteReport={handleDeleteReport}
                onToggleArchiveReport={handleToggleArchiveReport}
              />
            )}

            {activeTab === "finance" && (
              <FinanceView
                settings={settings}
                students={students}
                groups={groups}
                attendanceRecords={attendanceRecords}
                paymentTransactions={paymentTransactions}
                onRecordPayment={handleRecordPayment}
                onDeletePayment={handleDeletePayment}
              />
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveReportStudent(null);
          setActiveReportGroup(null);
          setActiveTab(tab);
        }}
        isArabic={isArabic}
      />

      {/* Settings & Backup Modal */}
      {isSettingsOpen && (
        <SettingsAndBackupModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onSaveSettings={handleSaveSettings}
          onExportBackup={handleExportBackup}
          onRestoreBackup={handleRestoreBackup}
        />
      )}

      {/* Backup Modal */}
      {isBackupOpen && (
        <SettingsAndBackupModal
          isOpen={isBackupOpen}
          onClose={() => setIsBackupOpen(false)}
          settings={settings}
          onSaveSettings={handleSaveSettings}
          onExportBackup={handleExportBackup}
          onRestoreBackup={handleRestoreBackup}
        />
      )}
    </div>
  );
};
