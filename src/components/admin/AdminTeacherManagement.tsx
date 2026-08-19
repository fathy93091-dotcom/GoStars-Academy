import React, { useState } from "react";
import { TeacherRecord, CentralGroup, CombinedAdminStudent } from "../../types";
import { useLanguage } from "../../i18n/LanguageContext";
import {
  Users,
  UserPlus,
  ShieldCheck,
  Power,
  Edit2,
  Trash2,
  BookOpen,
  Phone,
  Mail,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Lock,
  Layers,
  GraduationCap
} from "lucide-react";

interface AdminTeacherManagementProps {
  teachers: TeacherRecord[];
  groups: CentralGroup[];
  students: CombinedAdminStudent[];
  onSaveTeacher: (teacher: TeacherRecord) => Promise<void>;
  onToggleStatus: (teacherId: string, currentStatus: "active" | "inactive") => Promise<void>;
  onDeleteTeacher: (teacherId: string) => Promise<void>;
  canManage: boolean;
}

export const AdminTeacherManagement: React.FC<AdminTeacherManagementProps> = ({
  teachers,
  groups,
  students,
  onSaveTeacher,
  onToggleStatus,
  onDeleteTeacher,
  canManage
}) => {
  const { isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formSpecialties, setFormSpecialties] = useState<string>("");
  const [formAssignedGroups, setFormAssignedGroups] = useState<string[]>([]);
  const [formAssignedStudents, setFormAssignedStudents] = useState<string[]>([]);
  const [formStatus, setFormStatus] = useState<"active" | "inactive">("active");

  const openAddModal = () => {
    setEditingTeacher(null);
    setFormName("");
    setFormEmail("");
    setFormPhone("");
    setFormSpecialties("");
    setFormAssignedGroups([]);
    setFormAssignedStudents([]);
    setFormStatus("active");
    setIsModalOpen(true);
  };

  const openEditModal = (t: TeacherRecord) => {
    setEditingTeacher(t);
    setFormName(t.name);
    setFormEmail(t.email);
    setFormPhone(t.phone || "");
    setFormSpecialties((t.specialties || []).join(", "));
    setFormAssignedGroups(t.assignedGroupIds || []);
    setFormAssignedStudents(t.assignedStudentIds || []);
    setFormStatus(t.status);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) return;

    setIsSubmitting(true);
    try {
      const specialtiesArray = formSpecialties
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

      const record: TeacherRecord = {
        id: editingTeacher ? editingTeacher.id : `teacher_${Date.now()}`,
        authUid: editingTeacher ? editingTeacher.authUid : `teacher_${Date.now()}`,
        name: formName.trim(),
        email: formEmail.trim().toLowerCase(),
        phone: formPhone.trim() || undefined,
        specialties: specialtiesArray.length > 0 ? specialtiesArray : ["عام"],
        assignedGroupIds: formAssignedGroups,
        assignedStudentIds: formAssignedStudents,
        status: formStatus,
        createdAt: editingTeacher ? editingTeacher.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await onSaveTeacher(record);
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTeachers = teachers.filter(t => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.specialties || []).some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ? true : t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Rule 2 Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-5 shadow-lg border border-blue-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center shrink-0 text-blue-300">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {isRTL ? "إدارة المعلمين وضابط التسجيل (القاعدة 2)" : "Teacher Management & Access Control (Rule 2)"}
                </h3>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  {isRTL ? "إنشاء إداري حصري" : "Admin Only Provisioning"}
                </span>
              </div>
              <p className="text-xs text-blue-200/80 mt-1 max-w-2xl leading-relaxed">
                {isRTL
                  ? "يُحظر التسجيل المفتوح للمعلمين. يتم إصدار حسابات المعلمين وتفعيلها وإسناد الطلاب والمجموعات الدراسية حصرياً عبر لوحة الإدارة."
                  : "Self-registration for teachers is restricted. Teacher accounts, assignments, and subjects are provisioned exclusively by Academy Administrators."}
              </p>
            </div>
          </div>

          {canManage && (
            <button
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-bold text-xs shadow-md transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isRTL ? "إضافة معلم جديد" : "Add New Teacher"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Control Bar: Search & Status Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={isRTL ? "ابحث باسم المعلم، البريد، أو المادة التخصصية..." : "Search by teacher name, email, or specialty..."}
            className="w-full ps-9 pe-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">
            {isRTL ? "الحالة:" : "Status:"}
          </span>
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                statusFilter === "all" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {isRTL ? "الكل" : "All"} ({teachers.length})
            </button>
            <button
              onClick={() => setStatusFilter("active")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                statusFilter === "active" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {isRTL ? "نشط" : "Active"} ({teachers.filter(t => t.status === "active").length})
            </button>
            <button
              onClick={() => setStatusFilter("inactive")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                statusFilter === "inactive" ? "bg-rose-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {isRTL ? "معطل" : "Inactive"} ({teachers.filter(t => t.status === "inactive").length})
            </button>
          </div>
        </div>
      </div>

      {/* Teachers Cards Grid */}
      {filteredTeachers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-700 mb-1">
            {isRTL ? "لا يوجد معلمين مطابقين للبحث" : "No teachers found"}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {isRTL ? "يمكنك إضافة معلم جديد من الزر العلوي أو تعديل خيارات التصفية." : "You can add a new teacher using the top button."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTeachers.map(teacher => {
            const assignedGroupCount = (teacher.assignedGroupIds || []).length;
            const assignedStudentCount = (teacher.assignedStudentIds || []).length;
            const isActive = teacher.status === "active";

            return (
              <div
                key={teacher.id}
                className={`bg-white rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between ${
                  isActive
                    ? "border-slate-200 hover:border-blue-300 hover:shadow-md"
                    : "border-slate-200 bg-slate-50/70 opacity-80"
                }`}
              >
                <div>
                  {/* Top Bar: Name & Status */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
                        {teacher.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{teacher.name}</span>
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              isActive
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {isActive ? (
                              <>
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                <span>{isRTL ? "حساب نشط" : "Active"}</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-2.5 h-2.5" />
                                <span>{isRTL ? "معطل مؤقتاً" : "Inactive"}</span>
                              </>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {canManage && (
                      <button
                        onClick={() => onToggleStatus(teacher.id, teacher.status)}
                        title={isActive ? (isRTL ? "إيقاف الحساب" : "Deactivate") : (isRTL ? "تفعيل الحساب" : "Activate")}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition ${
                          isActive
                            ? "bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600"
                            : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        }`}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1.5 py-2.5 border-y border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono text-slate-700 truncate">{teacher.email}</span>
                    </div>
                    {teacher.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono text-slate-700" dir="ltr">{teacher.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Specialties */}
                  <div className="py-2.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      {isRTL ? "المواد والتخصصات" : "Specialties"}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {(teacher.specialties || ["عام"]).map((sp, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-100"
                        >
                          {sp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Assignments Metrics */}
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 text-xs">
                    <div className="bg-slate-50 rounded-xl p-2 text-center">
                      <span className="text-slate-400 block text-[10px]">{isRTL ? "المجموعات" : "Groups"}</span>
                      <span className="font-bold text-slate-800 text-sm">{assignedGroupCount}</span>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2 text-center">
                      <span className="text-slate-400 block text-[10px]">{isRTL ? "الطلاب المسندين" : "Students"}</span>
                      <span className="font-bold text-slate-800 text-sm">{assignedStudentCount}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                {canManage && (
                  <div className="flex items-center gap-2 pt-4 mt-3 border-t border-slate-100">
                    <button
                      onClick={() => openEditModal(teacher)}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>{isRTL ? "تعديل البيانات" : "Edit"}</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(isRTL ? "هل أنت متأكد من رغبتك في حذف هذا المعلم؟" : "Are you sure you want to delete this teacher?")) {
                          onDeleteTeacher(teacher.id);
                        }
                      }}
                      className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition"
                      title={isRTL ? "حذف المعلم" : "Delete Teacher"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Teacher Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {editingTeacher
                      ? isRTL ? "تعديل بيانات المعلم" : "Edit Teacher Details"
                      : isRTL ? "إضافة وتعيين معلم جديد" : "Provision New Teacher Account"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isRTL ? "تفعيل فوري مع ربط الصلاحيات والمواد الدراسية" : "Instant activation with direct assignments"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isRTL ? "اسم المعلم بالكامل *" : "Teacher Full Name *"}
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder={isRTL ? "مثال: أ. أحمد مصطفى" : "e.g. Mr. Ahmed Mostafa"}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isRTL ? "البريد الإلكتروني *" : "Email Address *"}
                  </label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    placeholder="teacher@gostars.edu"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isRTL ? "رقم الهاتف / واتساب" : "Phone Number"}
                  </label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    placeholder="+2010..."
                    dir="ltr"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isRTL ? "المواد والتخصصات (مفصولة بفاصلة)" : "Specialties / Subjects (comma separated)"}
                </label>
                <input
                  type="text"
                  value={formSpecialties}
                  onChange={e => setFormSpecialties(e.target.value)}
                  placeholder={isRTL ? "الفيزياء, الكيمياء, العلوم المتكاملة" : "Physics, Chemistry, Science"}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Group Assignment Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isRTL ? "إسناد المجموعات الدراسية" : "Assign Study Groups"}
                </label>
                <div className="max-h-28 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  {groups.length === 0 ? (
                    <p className="text-[11px] text-slate-400">{isRTL ? "لا توجد مجموعات مسجلة حالياً" : "No groups available"}</p>
                  ) : (
                    groups.map(g => {
                      const isChecked = formAssignedGroups.includes(g.id);
                      return (
                        <label key={g.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer p-1 hover:bg-slate-100 rounded-lg">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setFormAssignedGroups(formAssignedGroups.filter(id => id !== g.id));
                              } else {
                                setFormAssignedGroups([...formAssignedGroups, g.id]);
                              }
                            }}
                            className="rounded text-blue-600 focus:ring-0"
                          />
                          <span>{g.name} ({g.subject})</span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isRTL ? "حالة الحساب" : "Account Status"}
                </label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={formStatus === "active"}
                      onChange={() => setFormStatus("active")}
                      className="text-blue-600 focus:ring-0"
                    />
                    <span className="font-bold text-emerald-700">{isRTL ? "نشط ومصرح بالدخول" : "Active & Authorized"}</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={formStatus === "inactive"}
                      onChange={() => setFormStatus("inactive")}
                      className="text-rose-600 focus:ring-0"
                    />
                    <span className="font-bold text-rose-700">{isRTL ? "معطل وموقف مؤقتاً" : "Inactive / Suspended"}</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  {isRTL ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  {isSubmitting
                    ? isRTL ? "جارٍ الحفظ..." : "Saving..."
                    : editingTeacher
                    ? isRTL ? "حفظ التعديلات" : "Save Changes"
                    : isRTL ? "إنشاء وتفعيل الحساب" : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
