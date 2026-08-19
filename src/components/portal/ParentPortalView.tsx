import React, { useState, useEffect } from "react";
import { useAuth } from "../../lib/AuthContext";
import { useLanguage } from "../../i18n/LanguageContext";
import { AppRoute } from "../../navigation/routes";
import {
  ParentPortalEngine,
  DEMO_PORTAL_STUDENTS
} from "../../lib/parentPortalEngine";
import {
  CombinedAdminStudent,
  CentralReport,
  MonthlyStudentEvaluation,
  StudentCertificate
} from "../../types";
import { ParentOverviewTab } from "./ParentOverviewTab";
import { ParentReportsTab } from "./ParentReportsTab";
import { ParentAttendanceTab } from "./ParentAttendanceTab";
import { ParentCertificatesTab } from "./ParentCertificatesTab";
import { StudentReportModal } from "./StudentReportModal";
import { StudentCertificateModal } from "./StudentCertificateModal";
import { LinkStudentModal } from "./LinkStudentModal";
import {
  GraduationCap,
  Users,
  FileText,
  Calendar,
  Award,
  Link,
  RotateCw,
  LogOut,
  Globe,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Home,
  CheckCircle2,
  AlertCircle,
  Plus
} from "lucide-react";

interface ParentPortalViewProps {
  onNavigate: (route: AppRoute) => void;
}

type PortalTab = "overview" | "reports" | "attendance" | "certificates";

export const ParentPortalView: React.FC<ParentPortalViewProps> = ({ onNavigate }) => {
  const { user, profile, role, logout } = useAuth();
  const { isRTL, lang, toggleLanguage } = useLanguage();

  const [activeTab, setActiveTab] = useState<PortalTab>("overview");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data states
  const [students, setStudents] = useState<CombinedAdminStudent[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [reports, setReports] = useState<CentralReport[]>([]);
  const [evaluations, setEvaluations] = useState<MonthlyStudentEvaluation[]>([]);
  const [certificates, setCertificates] = useState<StudentCertificate[]>([]);

  // Modals state
  const [activeReportModal, setActiveReportModal] = useState<CentralReport | null>(null);
  const [activeCertModal, setActiveCertModal] = useState<StudentCertificate | null>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  // Load student list
  const loadPortalData = async () => {
    try {
      const linkedStudents = await ParentPortalEngine.getLinkedStudents(
        user ? { uid: user.uid, email: user.email || undefined } : null
      );
      setStudents(linkedStudents);

      // Select initial student
      if (linkedStudents.length > 0) {
        const defaultStudent = linkedStudents[0];
        setSelectedStudentId(defaultStudent.id);
        await loadStudentDetails(defaultStudent.id);
      }
    } catch (err) {
      console.warn("Notice loading parent portal data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load details for the currently active student
  const loadStudentDetails = async (studentId: string) => {
    try {
      const [reps, evals, certs] = await Promise.all([
        ParentPortalEngine.getStudentReports(studentId),
        ParentPortalEngine.getStudentMonthlyEvaluations(studentId),
        ParentPortalEngine.getStudentCertificates(studentId)
      ]);
      setReports(reps);
      setEvaluations(evals);
      setCertificates(certs);
    } catch (err) {
      console.warn("Notice loading student details:", err);
    }
  };

  useEffect(() => {
    loadPortalData();
  }, [user]);

  const handleStudentChange = async (studentId: string) => {
    setSelectedStudentId(studentId);
    await loadStudentDetails(studentId);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (selectedStudentId) {
      await loadStudentDetails(selectedStudentId);
    } else {
      await loadPortalData();
    }
    setRefreshing(false);
  };

  const handleStudentLinked = (newStudent: CombinedAdminStudent) => {
    setStudents(prev => {
      const exists = prev.some(s => s.id === newStudent.id);
      if (exists) return prev;
      return [newStudent, ...prev];
    });
    setSelectedStudentId(newStudent.id);
    loadStudentDetails(newStudent.id);
  };

  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0] || DEMO_PORTAL_STUDENTS[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center animate-pulse mb-3">
          <GraduationCap className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-slate-600">
          {isRTL ? "جارٍ تحميل بوابة ولي الأمر والطالب..." : "Loading Student & Parent Portal..."}
        </p>
      </div>
    );
  }

  const tabsConfig = [
    {
      id: "overview" as PortalTab,
      labelAr: "نظرة عامة",
      labelEn: "Overview",
      icon: Home
    },
    {
      id: "reports" as PortalTab,
      labelAr: "مركز التقارير الأكاديمية",
      labelEn: "Reports",
      icon: FileText,
      count: reports.length
    },
    {
      id: "attendance" as PortalTab,
      labelAr: "سجل الحضور والواجبات",
      labelEn: "Attendance & Tasks",
      icon: Calendar
    },
    {
      id: "certificates" as PortalTab,
      labelAr: "التقييمات والشهادات",
      labelEn: "Evaluations & Honors",
      icon: Award,
      count: certificates.length
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 font-sans" dir={isRTL ? "rtl" : "ltr"}>
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Platform Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white flex items-center justify-center font-black shadow-sm">
                <GraduationCap className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-black text-slate-900 leading-none">GoStars Academy</h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 uppercase tracking-wider">
                    {isRTL ? "بوابة ولي الأمر والطالب" : "STUDENT & PARENT PORTAL"}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  {isRTL ? "متابعة أداء الأبناء والتقارير والشهادات المعتمدة" : "Academic Monitoring, Reports & Diplomas"}
                </span>
              </div>
            </div>

            {/* Child Selector & Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Student Switcher Dropdown */}
              {students.length > 0 && (
                <div className="relative">
                  <select
                    value={selectedStudentId}
                    onChange={e => handleStudentChange(e.target.value)}
                    className="appearance-none bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold py-1.5 pl-3 pr-8 rounded-xl border border-slate-200 focus:outline-hidden cursor-pointer"
                  >
                    {students.map(std => (
                      <option key={std.id} value={std.id}>
                        {std.name} ({std.studentNumber || std.id})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute top-2.5 end-2.5 pointer-events-none" />
                </div>
              )}

              {/* Link Student Button */}
              <button
                onClick={() => setIsLinkModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition border border-blue-200"
                title={isRTL ? "ربط طالب آخر بالكود" : "Link Student Code"}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isRTL ? "ربط طالب جديد" : "Link Student"}</span>
              </button>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                title={isRTL ? "تحديث البيانات" : "Refresh"}
              >
                <RotateCw className={`w-4 h-4 ${refreshing ? "animate-spin text-blue-600" : ""}`} />
              </button>

              {/* Language Switch */}
              <button
                onClick={toggleLanguage}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1 transition"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{lang === "ar" ? "English" : "عربي"}</span>
              </button>

              {/* Back to Public Site */}
              <button
                onClick={() => onNavigate("home")}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                title={isRTL ? "الرئيسية" : "Home"}
              >
                <Home className="w-4 h-4" />
              </button>

              {/* Sign Out / Exit */}
              {user && (
                <button
                  onClick={() => logout()}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition"
                  title={isRTL ? "تسجيل الخروج" : "Sign Out"}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100">
          <div className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar">
            {tabsConfig.map(tab => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{isRTL ? tab.labelAr : tab.labelEn}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                        isActive ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "overview" && currentStudent && (
          <ParentOverviewTab
            student={currentStudent}
            reports={reports}
            evaluations={evaluations}
            certificates={certificates}
            onOpenReportModal={report => setActiveReportModal(report)}
            onOpenCertificateModal={cert => setActiveCertModal(cert)}
            onSwitchTab={tab => setActiveTab(tab)}
          />
        )}

        {activeTab === "reports" && currentStudent && (
          <ParentReportsTab
            student={currentStudent}
            reports={reports}
            onOpenReportModal={report => setActiveReportModal(report)}
          />
        )}

        {activeTab === "attendance" && currentStudent && (
          <ParentAttendanceTab
            student={currentStudent}
            reports={reports}
          />
        )}

        {activeTab === "certificates" && currentStudent && (
          <ParentCertificatesTab
            student={currentStudent}
            evaluations={evaluations}
            certificates={certificates}
            onOpenCertificateModal={cert => setActiveCertModal(cert)}
          />
        )}
      </main>

      {/* Modals */}
      {activeReportModal && currentStudent && (
        <StudentReportModal
          report={activeReportModal}
          student={currentStudent}
          onClose={() => setActiveReportModal(null)}
        />
      )}

      {activeCertModal && (
        <StudentCertificateModal
          certificate={activeCertModal}
          onClose={() => setActiveCertModal(null)}
        />
      )}

      {isLinkModalOpen && (
        <LinkStudentModal
          parentUid={user?.uid}
          parentEmail={user?.email || undefined}
          onSuccess={handleStudentLinked}
          onClose={() => setIsLinkModalOpen(false)}
        />
      )}
    </div>
  );
};
