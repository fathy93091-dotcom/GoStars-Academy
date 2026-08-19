import React, { useState } from "react";
import { UserProfile, SupervisorPermissions } from "../../types";
import { useLanguage } from "../../i18n/LanguageContext";
import {
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Lock,
  Check,
  Save,
  Users,
  Eye,
  DollarSign,
  GraduationCap,
  Layers,
  FileText,
  UserPlus
} from "lucide-react";

interface AdminSupervisorRBACProps {
  supervisors: UserProfile[];
  onSavePermissions: (uid: string, permissions: SupervisorPermissions) => Promise<void>;
  isAdmin: boolean;
}

export const AdminSupervisorRBAC: React.FC<AdminSupervisorRBACProps> = ({
  supervisors,
  onSavePermissions,
  isAdmin
}) => {
  const { isRTL } = useLanguage();
  const [savingUid, setSavingUid] = useState<string | null>(null);
  const [localPermissions, setLocalPermissions] = useState<{ [uid: string]: SupervisorPermissions }>(() => {
    const initial: { [uid: string]: SupervisorPermissions } = {};
    supervisors.forEach(s => {
      initial[s.uid] = s.permissions || {
        canManageTeachers: false,
        canManageStudents: true,
        canViewSensitiveContacts: true,
        canManageGroups: true,
        canViewReports: true,
        canManageFinance: false
      };
    });
    return initial;
  });

  const handleToggle = (uid: string, key: keyof SupervisorPermissions) => {
    if (!isAdmin) return;
    setLocalPermissions(prev => {
      const current = prev[uid] || {
        canManageTeachers: false,
        canManageStudents: true,
        canViewSensitiveContacts: true,
        canManageGroups: true,
        canViewReports: true,
        canManageFinance: false
      };
      return {
        ...prev,
        [uid]: {
          ...current,
          [key]: !current[key]
        }
      };
    });
  };

  const handleSave = async (uid: string) => {
    if (!isAdmin) return;
    setSavingUid(uid);
    try {
      const perms = localPermissions[uid];
      await onSavePermissions(uid, perms);
    } finally {
      setSavingUid(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                {isRTL ? "إدارة وتخصيص صلاحيات المشرفين (RBAC Controls)" : "Supervisor RBAC & Fine-Grained Permissions"}
              </h3>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                {isRTL ? "مخصص للمدير العام فقط" : "Admin Master Role Only"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              {isRTL
                ? "تحديد النطاقات والصلاحيات الممنوحة لكل مشرف بدقة (مثل: إدارة الطلاب فقط، رؤية جهات الاتصال الحساسة، أو مراجعة التقارير دون الصلاحيات المالية)."
                : "Configure granular capabilities per supervisor (student management, viewing sensitive contacts, auditing reports, or financial access)."}
            </p>
          </div>
        </div>
      </div>

      {/* Supervisors List Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {supervisors.map(supervisor => {
          const perms = localPermissions[supervisor.uid] || {
            canManageTeachers: false,
            canManageStudents: true,
            canViewSensitiveContacts: true,
            canManageGroups: true,
            canViewReports: true,
            canManageFinance: false
          };
          const isSaving = savingUid === supervisor.uid;

          return (
            <div
              key={supervisor.uid}
              className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between shadow-sm"
            >
              <div>
                {/* Supervisor Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-sm">
                      {supervisor.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{supervisor.name}</h4>
                      <span className="text-xs text-slate-500 font-mono block">{supervisor.email}</span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                    {supervisor.role}
                  </span>
                </div>

                {/* Granular Permissions Matrix */}
                <div className="space-y-2.5 mb-5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {isRTL ? "مصفوفة الصلاحيات المتاحة:" : "Granted Permissions Matrix:"}
                  </span>

                  {/* 1. Manage Students */}
                  <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100/80 transition">
                    <div className="flex items-center gap-2.5 text-xs">
                      <GraduationCap className="w-4 h-4 text-blue-600" />
                      <div>
                        <span className="font-bold text-slate-800 block">
                          {isRTL ? "إدارة وتعديل بيانات الطلاب" : "Manage Students"}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {isRTL ? "تسجيل الطلاب وتعديل الربط بالمجموعات" : "Enroll & edit student records"}
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      disabled={!isAdmin}
                      checked={!!perms.canManageStudents}
                      onChange={() => handleToggle(supervisor.uid, "canManageStudents")}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-0"
                    />
                  </label>

                  {/* 2. View Sensitive Contacts */}
                  <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100/80 transition">
                    <div className="flex items-center gap-2.5 text-xs">
                      <Eye className="w-4 h-4 text-emerald-600" />
                      <div>
                        <span className="font-bold text-slate-800 block">
                          {isRTL ? "رؤية جهات الاتصال الحساسة (/sensitive_contacts)" : "View Sensitive Contacts"}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {isRTL ? "أرقام أولياء الأمور وروابط مجموعات الواتساب" : "Parent phones & WhatsApp links"}
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      disabled={!isAdmin}
                      checked={!!perms.canViewSensitiveContacts}
                      onChange={() => handleToggle(supervisor.uid, "canViewSensitiveContacts")}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-0"
                    />
                  </label>

                  {/* 3. Manage Groups */}
                  <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100/80 transition">
                    <div className="flex items-center gap-2.5 text-xs">
                      <Layers className="w-4 h-4 text-indigo-600" />
                      <div>
                        <span className="font-bold text-slate-800 block">
                          {isRTL ? "إدارة المجموعات والجدول المركزي" : "Manage Groups & Schedule"}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {isRTL ? "إنشاء المجموعات وتعديل المواعيد" : "Create groups & adjust slots"}
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      disabled={!isAdmin}
                      checked={!!perms.canManageGroups}
                      onChange={() => handleToggle(supervisor.uid, "canManageGroups")}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-0"
                    />
                  </label>

                  {/* 4. View Reports */}
                  <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100/80 transition">
                    <div className="flex items-center gap-2.5 text-xs">
                      <FileText className="w-4 h-4 text-purple-600" />
                      <div>
                        <span className="font-bold text-slate-800 block">
                          {isRTL ? "مراجعة وتدقيق التقارير الصادرة" : "Review & Audit Reports"}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {isRTL ? "الاطلاع على تقارير المعلمين وتوجيهات AI" : "Access all lesson reports"}
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      disabled={!isAdmin}
                      checked={!!perms.canViewReports}
                      onChange={() => handleToggle(supervisor.uid, "canViewReports")}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-0"
                    />
                  </label>

                  {/* 5. Manage Finance */}
                  <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100/80 transition">
                    <div className="flex items-center gap-2.5 text-xs">
                      <DollarSign className="w-4 h-4 text-emerald-700" />
                      <div>
                        <span className="font-bold text-slate-800 block">
                          {isRTL ? "الوصول للإدارة المالية العامة" : "Access Finance Hub"}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {isRTL ? "سجلات المقبوضات والمديونيات وأرباح الأكاديمية" : "Ledger, debts, and revenue"}
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      disabled={!isAdmin}
                      checked={!!perms.canManageFinance}
                      onChange={() => handleToggle(supervisor.uid, "canManageFinance")}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-0"
                    />
                  </label>

                  {/* 6. Manage Teachers (Restricted) */}
                  <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100/80 transition">
                    <div className="flex items-center gap-2.5 text-xs">
                      <Users className="w-4 h-4 text-slate-600" />
                      <div>
                        <span className="font-bold text-slate-800 block">
                          {isRTL ? "إدارة وتعيين المعلمين (مقيدة)" : "Manage Teachers"}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {isRTL ? "إضافة المعلمين وتفعيل الحسابات" : "Create & deactivate teachers"}
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      disabled={!isAdmin}
                      checked={!!perms.canManageTeachers}
                      onChange={() => handleToggle(supervisor.uid, "canManageTeachers")}
                      className="w-4 h-4 rounded text-amber-600 focus:ring-0"
                    />
                  </label>
                </div>
              </div>

              {/* Action Button */}
              {isAdmin && (
                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleSave(supervisor.uid)}
                    disabled={isSaving}
                    className="w-full py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSaving ? (isRTL ? "جارٍ الحفظ..." : "Saving...") : (isRTL ? "حفظ الصلاحيات للمشرف" : "Save Permissions")}</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
