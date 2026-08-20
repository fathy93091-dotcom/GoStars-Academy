import React, { useState, useEffect } from "react";
import { useAuth } from "../../lib/AuthContext";
import { useLanguage } from "../../i18n/LanguageContext";
import { AppRoute } from "../../navigation/routes";
import {
  AdminDataEngine,
  CombinedAdminStudent,
  AcademyFinanceSummary
} from "../../lib/adminDataEngine";
import {
  TeacherRecord,
  CentralGroup,
  CentralReport,
  CentralPayment,
  UserProfile,
  SupervisorPermissions
} from "../../types";
import { AdminTeacherManagement } from "./AdminTeacherManagement";
import { AdminStudentManagement } from "./AdminStudentManagement";
import { AdminGroupManagement } from "./AdminGroupManagement";
import { AdminReportsReview } from "./AdminReportsReview";
import { AdminFinanceOverview } from "./AdminFinanceOverview";
import { AdminSupervisorRBAC } from "./AdminSupervisorRBAC";
import { AdminCmsManager } from "./cms/AdminCmsManager";
import { AdminWhatsAppHub } from "./whatsapp/AdminWhatsAppHub";
import { AdminBackupMaintenanceHub } from "./backup/AdminBackupMaintenanceHub";
import { useSiteContent } from "../../lib/SiteContentContext";
import {
  ShieldCheck,
  Users,
  GraduationCap,
  Layers,
  FileText,
  DollarSign,
  Lock,
  LogOut,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  Sparkles,
  Building2,
  CheckCircle2,
  ChevronRight,
  Globe,
  Sliders,
  Layout,
  Smartphone,
  Database
} from "lucide-react";

interface AdminPlatformViewProps {
  onNavigate: (route: AppRoute) => void;
}

type AdminTab = "teachers" | "students" | "groups" | "reports" | "finance" | "whatsapp" | "cms" | "backup" | "rbac";

export const AdminPlatformView: React.FC<AdminPlatformViewProps> = ({ onNavigate }) => {
  const { user, profile, role, isAdmin, isSupervisor, logout } = useAuth();
  const { isRTL, lang, toggleLanguage } = useLanguage();
  const { content: siteContent, updateContent: updateSiteContent, resetContent: resetSiteContent } = useSiteContent();

  const [activeTab, setActiveTab] = useState<AdminTab>("teachers");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Core Data States
  const [teachers, setTeachers] = useState<TeacherRecord[]>([]);
  const [students, setStudents] = useState<CombinedAdminStudent[]>([]);
  const [groups, setGroups] = useState<CentralGroup[]>([]);
  const [reports, setReports] = useState<CentralReport[]>([]);
  const [payments, setPayments] = useState<CentralPayment[]>([]);
  const [supervisors, setSupervisors] = useState<UserProfile[]>([]);
  const [financeSummary, setFinanceSummary] = useState<AcademyFinanceSummary>({
    totalRevenue: 0,
    monthRevenue: 0,
    totalLessonsCost: 0,
    totalDueDebt: 0,
    totalCreditSurplus: 0,
    netAcademyProfit: 0,
    totalTeachersCount: 0,
    totalStudentsCount: 0,
    totalGroupsCount: 0,
    totalReportsCount: 0
  });

  // Effective permissions
  const permissions: SupervisorPermissions = profile?.permissions || {
    canManageTeachers: isAdmin,
    canManageStudents: true,
    canViewSensitiveContacts: true,
    canManageGroups: true,
    canViewReports: true,
    canManageFinance: isAdmin
  };

  const canManageTeachers = isAdmin || !!permissions.canManageTeachers;
  const canManageStudents = isAdmin || !!permissions.canManageStudents;
  const canViewSensitiveContacts = isAdmin || !!permissions.canViewSensitiveContacts;
  const canManageGroups = isAdmin || !!permissions.canManageGroups;
  const canViewReports = isAdmin || !!permissions.canViewReports;
  const canManageFinance = isAdmin || !!permissions.canManageFinance;

  const loadAllAdminData = async () => {
    try {
      const [tList, sList, gList, rList, pList, supList, fSummary] = await Promise.all([
        AdminDataEngine.getTeachers(),
        AdminDataEngine.getStudentsWithSensitiveData(),
        AdminDataEngine.getGroups(),
        AdminDataEngine.getCentralReports(),
        AdminDataEngine.getPayments(),
        AdminDataEngine.getSupervisors(),
        AdminDataEngine.calculateAcademyFinanceSummary()
      ]);

      setTeachers(tList);
      setStudents(sList);
      setGroups(gList);
      setReports(rList);
      setPayments(pList);
      setSupervisors(supList);
      setFinanceSummary(fSummary);
    } catch (err) {
      console.warn("Notice loading admin data:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadAllAdminData();
  };

  // Handlers for Teachers
  const handleSaveTeacher = async (teacher: TeacherRecord) => {
    await AdminDataEngine.saveTeacher(teacher);
    await loadAllAdminData();
  };

  const handleToggleTeacherStatus = async (teacherId: string, currentStatus: "active" | "inactive") => {
    await AdminDataEngine.toggleTeacherStatus(teacherId, currentStatus);
    await loadAllAdminData();
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    await AdminDataEngine.deleteTeacher(teacherId);
    await loadAllAdminData();
  };

  // Handlers for Students
  const handleSaveStudent = async (student: CombinedAdminStudent) => {
    await AdminDataEngine.saveStudentWithSensitiveContacts(student);
    await loadAllAdminData();
  };

  // Handlers for Groups
  const handleSaveGroup = async (group: CentralGroup, whatsappLink?: string) => {
    await AdminDataEngine.saveGroup(group, whatsappLink);
    await loadAllAdminData();
  };

  const handleDeleteGroup = async (groupId: string) => {
    await AdminDataEngine.deleteGroup(groupId);
    await loadAllAdminData();
  };

  // Handlers for Supervisor Permissions
  const handleSaveSupervisorPermissions = async (uid: string, perms: SupervisorPermissions) => {
    await AdminDataEngine.saveSupervisorPermissions(uid, perms);
    await loadAllAdminData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center animate-pulse mb-3">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-slate-600">
          {isRTL ? "جارٍ تحميل لوحة الإدارة المركزية..." : "Loading Admin Dashboard..."}
        </p>
      </div>
    );
  }

  const tabsConfig = [
    {
      id: "teachers" as AdminTab,
      labelAr: "إدارة المعلمين",
      labelEn: "Teachers",
      icon: Users,
      allowed: canManageTeachers || isAdmin,
      count: teachers.length
    },
    {
      id: "students" as AdminTab,
      labelAr: "الطلاب وجهات الاتصال",
      labelEn: "Students & Contacts",
      icon: GraduationCap,
      allowed: canManageStudents,
      count: students.length
    },
    {
      id: "groups" as AdminTab,
      labelAr: "المجموعات والجدول",
      labelEn: "Groups & Schedule",
      icon: Layers,
      allowed: canManageGroups,
      count: groups.length
    },
    {
      id: "reports" as AdminTab,
      labelAr: "مراجعة التقارير",
      labelEn: "Reports Review",
      icon: FileText,
      allowed: canViewReports,
      count: reports.length
    },
    {
      id: "finance" as AdminTab,
      labelAr: "المالية العامة",
      labelEn: "Academy Finance",
      icon: DollarSign,
      allowed: canManageFinance,
      badge: `${financeSummary.totalRevenue.toLocaleString()} ج.م`
    },
    {
      id: "whatsapp" as AdminTab,
      labelAr: "خادم Termux والواتساب",
      labelEn: "Termux WhatsApp Bot",
      icon: Smartphone,
      allowed: isAdmin || isSupervisor
    },
    {
      id: "cms" as AdminTab,
      labelAr: "إدارة محتوى الموقع (CMS)",
      labelEn: "Site Content CMS",
      icon: Layout,
      allowed: isAdmin || isSupervisor
    },
    {
      id: "backup" as AdminTab,
      labelAr: "النسخ الاحتياطي والصيانة",
      labelEn: "Backup & Maintenance",
      icon: Database,
      allowed: isAdmin || isSupervisor
    },
    ...(isAdmin
      ? [
          {
            id: "rbac" as AdminTab,
            labelAr: "صلاحيات المشرفين",
            labelEn: "Supervisor RBAC",
            icon: Sliders,
            allowed: isAdmin,
            count: supervisors.length
          }
        ]
      : [])
  ];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 font-sans" dir={isRTL ? "rtl" : "ltr"}>
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Platform Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white flex items-center justify-center font-black shadow-sm">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-black text-slate-900 leading-none">GoStars Academy</h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 uppercase tracking-wider">
                    {role === "admin" ? (isRTL ? "المدير العام" : "ADMIN") : (isRTL ? "مشرف أكاديمي" : "SUPERVISOR")}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  {isRTL ? "لوحة الإدارة والمتابعة المركزية" : "Central Management & Supervision Hub"}
                </span>
              </div>
            </div>

            {/* Right Action Icons & Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                title={isRTL ? "تحديث البيانات" : "Refresh Data"}
              >
                <RotateCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-blue-600" : ""}`} />
              </button>

              {/* Language Switch */}
              <button
                onClick={toggleLanguage}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1 transition"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{lang === "ar" ? "English" : "عربي"}</span>
              </button>

              {/* Workspace Switcher */}
              <button
                onClick={() => onNavigate("teacher-platform")}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition border border-indigo-200 cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{isRTL ? "منصة المعلم" : "Teacher Workspace"}</span>
              </button>

              {/* Live Visual Site Editor Button */}
              <button
                onClick={() => onNavigate("site-editor")}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-black transition shadow-sm cursor-pointer active:scale-95"
                title={isRTL ? "فتح محرر وتصميم صفحات الموقع المباشر" : "Launch Live Visual Editor"}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isRTL ? "المحرر البصري للموقع" : "Live Visual Editor"}</span>
              </button>

              {/* Sign Out / Exit */}
              <button
                onClick={() => logout()}
                className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition"
                title={isRTL ? "تسجيل الخروج" : "Sign Out"}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100">
          <div className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar">
            {tabsConfig.map(tab => {
              if (!tab.allowed) return null;
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
        {activeTab === "teachers" && (
          <AdminTeacherManagement
            teachers={teachers}
            groups={groups}
            students={students}
            onSaveTeacher={handleSaveTeacher}
            onToggleStatus={handleToggleTeacherStatus}
            onDeleteTeacher={handleDeleteTeacher}
            canManage={canManageTeachers}
          />
        )}

        {activeTab === "students" && (
          <AdminStudentManagement
            students={students}
            teachers={teachers}
            groups={groups}
            onSaveStudent={handleSaveStudent}
            canManage={canManageStudents}
            canViewSensitive={canViewSensitiveContacts}
          />
        )}

        {activeTab === "groups" && (
          <AdminGroupManagement
            groups={groups}
            teachers={teachers}
            students={students}
            onSaveGroup={handleSaveGroup}
            onDeleteGroup={handleDeleteGroup}
            canManage={canManageGroups}
          />
        )}

        {activeTab === "reports" && (
          <AdminReportsReview
            reports={reports}
            teachers={teachers}
            students={students}
          />
        )}

        {activeTab === "finance" && (
          <AdminFinanceOverview
            summary={financeSummary}
            payments={payments}
            students={students}
            teachers={teachers}
          />
        )}

        {activeTab === "whatsapp" && (
          <AdminWhatsAppHub
            reports={reports}
            groups={groups}
            students={students}
          />
        )}

        {activeTab === "cms" && (
          <AdminCmsManager
            content={siteContent}
            onSaveContent={async (updated) => {
              await updateSiteContent(updated, profile?.name || user?.displayName);
            }}
            onResetContent={async () => {
              await resetSiteContent(profile?.name || user?.displayName);
            }}
          />
        )}

        {activeTab === "backup" && (
          <AdminBackupMaintenanceHub
            teachers={teachers}
            students={students}
            groups={groups}
            reports={reports}
            payments={payments}
            financeSummary={financeSummary}
            onRefreshData={loadAllAdminData}
          />
        )}

        {activeTab === "rbac" && isAdmin && (
          <AdminSupervisorRBAC
            supervisors={supervisors}
            onSavePermissions={handleSaveSupervisorPermissions}
            isAdmin={isAdmin}
          />
        )}
      </main>
    </div>
  );
};
