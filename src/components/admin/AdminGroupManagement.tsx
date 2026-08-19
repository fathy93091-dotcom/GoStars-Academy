import React, { useState } from "react";
import { CentralGroup, TeacherRecord, CombinedAdminStudent } from "../../types";
import { useLanguage } from "../../i18n/LanguageContext";
import {
  Users,
  Plus,
  Clock,
  Calendar,
  BookOpen,
  Edit2,
  Trash2,
  CheckCircle2,
  Search,
  ExternalLink,
  GraduationCap,
  Sparkles,
  Layers,
  MessageCircle
} from "lucide-react";

interface AdminGroupManagementProps {
  groups: CentralGroup[];
  teachers: TeacherRecord[];
  students: CombinedAdminStudent[];
  onSaveGroup: (group: CentralGroup, whatsappGroupLink?: string) => Promise<void>;
  onDeleteGroup: (groupId: string) => Promise<void>;
  canManage: boolean;
}

const WEEK_DAYS = [
  { id: "sat", nameAr: "السبت", nameEn: "Saturday" },
  { id: "sun", nameAr: "الأحد", nameEn: "Sunday" },
  { id: "mon", nameAr: "الإثنين", nameEn: "Monday" },
  { id: "tue", nameAr: "الثلاثاء", nameEn: "Tuesday" },
  { id: "wed", nameAr: "الأربعاء", nameEn: "Wednesday" },
  { id: "thu", nameAr: "الخميس", nameEn: "Thursday" },
  { id: "fri", nameAr: "الجمعة", nameEn: "Friday" }
];

export const AdminGroupManagement: React.FC<AdminGroupManagementProps> = ({
  groups,
  teachers,
  students,
  onSaveGroup,
  onDeleteGroup,
  canManage
}) => {
  const { isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<CentralGroup | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formSubject, setFormSubject] = useState("الفيزياء");
  const [formAcademicYear, setFormAcademicYear] = useState("الصف الأول الثانوي");
  const [formTeacherId, setFormTeacherId] = useState("");
  const [formDays, setFormDays] = useState<string[]>(["السبت", "الثلاثاء"]);
  const [formTime, setFormTime] = useState("16:00");
  const [formDuration, setFormDuration] = useState<number>(90);
  const [formWhatsappLink, setFormWhatsappLink] = useState("");
  const [formStudentIds, setFormStudentIds] = useState<string[]>([]);

  const openAddModal = () => {
    setEditingGroup(null);
    setFormName("");
    setFormSubject("الفيزياء");
    setFormAcademicYear("الصف الأول الثانوي");
    setFormTeacherId(teachers[0]?.id || "");
    setFormDays(["السبت", "الثلاثاء"]);
    setFormTime("16:00");
    setFormDuration(90);
    setFormWhatsappLink("");
    setFormStudentIds([]);
    setIsModalOpen(true);
  };

  const openEditModal = (g: CentralGroup) => {
    setEditingGroup(g);
    setFormName(g.name);
    setFormSubject(g.subject);
    setFormAcademicYear(g.academicYear || "الصف الأول الثانوي");
    setFormTeacherId(g.teacherIds?.[0] || "");
    setFormDays(g.days || []);
    setFormTime(g.time || "16:00");
    setFormDuration(g.durationMinutes || 90);
    setFormWhatsappLink("");
    setFormStudentIds(g.studentIds || []);
    setIsModalOpen(true);
  };

  const handleDayToggle = (dayName: string) => {
    if (formDays.includes(dayName)) {
      setFormDays(formDays.filter(d => d !== dayName));
    } else {
      setFormDays([...formDays, dayName]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSubject.trim()) return;

    setIsSubmitting(true);
    try {
      const record: CentralGroup = {
        id: editingGroup ? editingGroup.id : `group_${Date.now()}`,
        name: formName.trim(),
        subject: formSubject.trim(),
        academicYear: formAcademicYear,
        teacherIds: formTeacherId ? [formTeacherId] : [],
        studentIds: formStudentIds,
        days: formDays,
        time: formTime,
        durationMinutes: Number(formDuration || 60),
        status: editingGroup ? editingGroup.status : "active",
        createdAt: editingGroup ? editingGroup.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await onSaveGroup(record, formWhatsappLink.trim() || undefined);
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredGroups = groups.filter(g => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTeacher =
      selectedTeacherId === "all" ? true : (g.teacherIds || []).includes(selectedTeacherId);

    return matchesSearch && matchesTeacher;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-200">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isRTL ? "إدارة المجموعات الدراسية والجدول المركزي" : "Central Study Groups & Schedule"}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              {isRTL
                ? "إنشاء وضبط المجموعات الدراسية، تحديد مواعيد الحصص الأسبوعية، وتعيين المعلم المسؤول ومتابعة الطلاب المسجلين."
                : "Create study groups, configure schedule slots, and assign lead teachers and enrolled students."}
            </p>
          </div>
        </div>

        {canManage && (
          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            <span>{isRTL ? "إنشاء مجموعة جديدة" : "Create Study Group"}</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={isRTL ? "ابحث باسم المجموعة أو المادة..." : "Search group name or subject..."}
            className="w-full ps-9 pe-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <select
          value={selectedTeacherId}
          onChange={e => setSelectedTeacherId(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-none"
        >
          <option value="all">{isRTL ? "جميع المعلمين" : "All Teachers"}</option>
          {teachers.map(t => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Groups Grid */}
      {filteredGroups.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-700 mb-1">
            {isRTL ? "لا توجد مجموعات مطابقة" : "No study groups found"}
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {isRTL ? "يمكنك إنشاء مجموعة دراسية جديدة وتعيين المعلم والطلاب." : "You can create a new study group and assign teachers and students."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredGroups.map(group => {
            const leadTeacher = teachers.find(t => (group.teacherIds || []).includes(t.id));
            const enrolledStudents = students.filter(s => (s.groupIds || []).includes(group.id));

            return (
              <div
                key={group.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between hover:border-indigo-300 hover:shadow-md transition duration-200"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {group.subject}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{group.name}</h4>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{group.academicYear || "عام"}</span>
                    </div>

                    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                      {enrolledStudents.length} {isRTL ? "طالب" : "st"}
                    </div>
                  </div>

                  {/* Teacher in Charge */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 mb-3 text-xs">
                    <span className="text-[10px] font-bold text-slate-400 block mb-0.5">
                      {isRTL ? "المعلم المسؤول:" : "Lead Teacher:"}
                    </span>
                    <span className="font-bold text-slate-800">
                      {leadTeacher?.name || (isRTL ? "غير محدد" : "Unassigned")}
                    </span>
                  </div>

                  {/* Schedule Info */}
                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="font-semibold text-slate-700">
                        {(group.days || []).join("، ") || (isRTL ? "لم تحدد أيام" : "No days")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="font-mono text-slate-700">
                        {group.time || "16:00"} ({group.durationMinutes || 90} {isRTL ? "دقيقة" : "min"})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {canManage && (
                  <div className="flex items-center gap-2 pt-4 mt-3 border-t border-slate-100">
                    <button
                      onClick={() => openEditModal(group)}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>{isRTL ? "تعديل المجموعة" : "Edit Group"}</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(isRTL ? "هل أنت متأكد من رغبتك في حذف هذه المجموعة؟" : "Delete this group?")) {
                          onDeleteGroup(group.id);
                        }
                      }}
                      className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center transition"
                      title={isRTL ? "حذف" : "Delete"}
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

      {/* Add / Edit Group Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {editingGroup
                      ? isRTL ? "تعديل المجموعة الدراسية" : "Edit Study Group"
                      : isRTL ? "إنشاء مجموعة دراسية جديدة" : "Create Study Group"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isRTL ? "تحديد المواعيد وإسناد المعلم المسؤول" : "Set schedule and assign teacher"}
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
                  {isRTL ? "اسم المجموعة *" : "Group Name *"}
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder={isRTL ? "مثال: فيزياء 1 ثانوى - مجموعة السبت والثلاثاء" : "e.g. Physics Grade 10 - Group A"}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isRTL ? "المادة الدراسية *" : "Subject *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={formSubject}
                    onChange={e => setFormSubject(e.target.value)}
                    placeholder="الفيزياء"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isRTL ? "المرحلة الدراسية" : "Grade / Stage"}
                  </label>
                  <input
                    type="text"
                    value={formAcademicYear}
                    onChange={e => setFormAcademicYear(e.target.value)}
                    placeholder="الصف الأول الثانوي"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Teacher Assignment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isRTL ? "المعلم المسؤول عن المجموعة *" : "Lead Teacher *"}
                </label>
                <select
                  value={formTeacherId}
                  onChange={e => setFormTeacherId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                >
                  <option value="">{isRTL ? "اختر المعلم..." : "Select Teacher..."}</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({ (t.specialties || []).join(", ") })
                    </option>
                  ))}
                </select>
              </div>

              {/* Days Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isRTL ? "أيام الحصص الأسبوعية" : "Weekly Schedule Days"}
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                  {WEEK_DAYS.map(day => {
                    const isSelected = formDays.includes(day.nameAr);
                    return (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => handleDayToggle(day.nameAr)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold transition text-center ${
                          isSelected
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {isRTL ? day.nameAr : day.nameEn.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isRTL ? "وقت بدء الحصة" : "Start Time"}
                  </label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={e => setFormTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isRTL ? "مدة الحصة (دقيقة)" : "Duration (minutes)"}
                  </label>
                  <input
                    type="number"
                    min="30"
                    step="15"
                    value={formDuration}
                    onChange={e => setFormDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              {/* Sensitive WhatsApp Group Link */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isRTL ? "رابط مجموعة الواتساب الإدارية (/sensitive_contacts)" : "WhatsApp Group Link"}</span>
                </label>
                <input
                  type="url"
                  value={formWhatsappLink}
                  onChange={e => setFormWhatsappLink(e.target.value)}
                  placeholder="https://chat.whatsapp.com/..."
                  dir="ltr"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
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
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  {isSubmitting
                    ? isRTL ? "جارٍ الحفظ..." : "Saving..."
                    : editingGroup
                    ? isRTL ? "حفظ التعديلات" : "Save Changes"
                    : isRTL ? "إنشاء المجموعة" : "Create Group"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
