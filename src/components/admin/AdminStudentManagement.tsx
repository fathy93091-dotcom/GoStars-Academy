import React, { useState } from "react";
import { CombinedAdminStudent, TeacherRecord, CentralGroup } from "../../types";
import { useLanguage } from "../../i18n/LanguageContext";
import {
  GraduationCap,
  UserPlus,
  Search,
  Phone,
  MessageCircle,
  Copy,
  Check,
  Shield,
  Edit3,
  Users,
  Building2,
  ExternalLink,
  BookOpen,
  DollarSign,
  UserCheck,
  Link as LinkIcon
} from "lucide-react";

interface AdminStudentManagementProps {
  students: CombinedAdminStudent[];
  teachers: TeacherRecord[];
  groups: CentralGroup[];
  onSaveStudent: (student: CombinedAdminStudent) => Promise<void>;
  canManage: boolean;
  canViewSensitive: boolean;
}

export const AdminStudentManagement: React.FC<AdminStudentManagementProps> = ({
  students,
  teachers,
  groups,
  onSaveStudent,
  canManage,
  canViewSensitive
}) => {
  const { isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [studyTypeFilter, setStudyTypeFilter] = useState<"all" | "group" | "private">("all");
  const [groupFilter, setGroupFilter] = useState<string>("all");
  const [teacherFilter, setTeacherFilter] = useState<string>("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<CombinedAdminStudent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [formName, setFormName] = useState("");
  const [formStudentNumber, setFormStudentNumber] = useState("");
  const [formAcademicYear, setFormAcademicYear] = useState("الصف الأول الثانوي");
  const [formCurriculum, setFormCurriculum] = useState("عام");
  const [formStudyType, setFormStudyType] = useState<"group" | "private">("group");
  const [formSelectedGroup, setFormSelectedGroup] = useState<string>("");
  const [formSelectedTeacher, setFormSelectedTeacher] = useState<string>("");
  const [formSubject, setFormSubject] = useState("الفيزياء");
  const [formLessonCost, setFormLessonCost] = useState<number>(100);
  const [formParentName, setFormParentName] = useState("");
  const [formParentContact, setFormParentContact] = useState("");
  const [formStudentPhone, setFormStudentPhone] = useState("");
  const [formWhatsappLink, setFormWhatsappLink] = useState("");
  const [formNotes, setFormNotes] = useState("");

  const handleCopy = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openAddModal = () => {
    setEditingStudent(null);
    setFormName("");
    setFormStudentNumber(`STD-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormAcademicYear("الصف الأول الثانوي");
    setFormCurriculum("عام");
    setFormStudyType("group");
    setFormSelectedGroup(groups[0]?.id || "");
    setFormSelectedTeacher(teachers[0]?.id || "");
    setFormSubject("الفيزياء");
    setFormLessonCost(100);
    setFormParentName("");
    setFormParentContact("");
    setFormStudentPhone("");
    setFormWhatsappLink("");
    setFormNotes("");
    setIsModalOpen(true);
  };

  const openEditModal = (s: CombinedAdminStudent) => {
    setEditingStudent(s);
    setFormName(s.fullName || s.name);
    setFormStudentNumber(s.studentNumber || "");
    setFormAcademicYear(s.academicYear || "الصف الأول الثانوي");
    setFormCurriculum(s.curriculum || "عام");
    setFormStudyType(s.studyType || "group");
    setFormSelectedGroup(s.groupIds?.[0] || "");
    setFormSelectedTeacher(s.teacherIds?.[0] || "");
    setFormSubject(s.subject || "الفيزياء");
    setFormLessonCost(s.lessonCost || 100);
    setFormParentName(s.parentName || "");
    setFormParentContact(s.parentContact || "");
    setFormStudentPhone(s.studentPhone || "");
    setFormWhatsappLink(s.whatsappGroupLink || "");
    setFormNotes(s.notes || "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setIsSubmitting(true);
    try {
      const studentId = editingStudent ? editingStudent.id : `std_${Date.now()}`;
      const record: CombinedAdminStudent = {
        id: studentId,
        name: formName.trim(),
        fullName: formName.trim(),
        studentNumber: formStudentNumber.trim() || undefined,
        academicYear: formAcademicYear,
        curriculum: formCurriculum,
        studyType: formStudyType,
        status: editingStudent ? editingStudent.status : "active",
        parentIds: [`parent_${studentId}`],
        teacherIds: formSelectedTeacher ? [formSelectedTeacher] : [],
        groupIds: formStudyType === "group" && formSelectedGroup ? [formSelectedGroup] : [],
        subject: formSubject,
        lessonCost: Number(formLessonCost || 0),
        totalPaidAmount: editingStudent ? editingStudent.totalPaidAmount : 0,
        totalAttendedLessons: editingStudent ? editingStudent.totalAttendedLessons : 0,
        notes: formNotes.trim() || undefined,
        parentName: formParentName.trim() || undefined,
        parentContact: formParentContact.trim() || undefined,
        studentPhone: formStudentPhone.trim() || undefined,
        whatsappGroupLink: formWhatsappLink.trim() || undefined,
        createdAt: editingStudent ? editingStudent.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await onSaveStudent(record);
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStudents = students.filter(s => {
    const sName = s.fullName || s.name || "";
    const matchesSearch =
      sName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.studentNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.subject || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.parentContact || "").includes(searchTerm);

    const matchesType =
      studyTypeFilter === "all" ? true : s.studyType === studyTypeFilter;

    const matchesGroup =
      groupFilter === "all" ? true : (s.groupIds || []).includes(groupFilter);

    const matchesTeacher =
      teacherFilter === "all" ? true : (s.teacherIds || []).includes(teacherFilter);

    return matchesSearch && matchesType && matchesGroup && matchesTeacher;
  });

  return (
    <div className="space-y-6">
      {/* Sensitive Contacts Privacy Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                {isRTL ? "سجل الطلاب وقاعدة بيانات التواصل الحساسة" : "Student Registry & Protected Contacts"}
              </h3>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                /sensitive_contacts
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              {isRTL
                ? "تتيح هذه الشاشة للإدارة الرؤية الكاملة لأرقام أولياء الأمور وروابط مجموعات الواتساب المحمية من وصول المعلمين، مع إمكانية ربط كل طالب بالمعلم والمجموعة."
                : "Provides authorized administrators full visibility to parent contacts and WhatsApp links protected from teacher views, with direct teacher & group linkage."}
            </p>
          </div>
        </div>

        {canManage && (
          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-md transition"
          >
            <UserPlus className="w-4 h-4" />
            <span>{isRTL ? "إضافة طالب جديد" : "Enroll New Student"}</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={isRTL ? "ابحث بالاسم، الكود، أو هاتف ولي الأمر..." : "Search name, code, parent phone..."}
              className="w-full ps-9 pe-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Study Type Filter */}
          <select
            value={studyTypeFilter}
            onChange={e => setStudyTypeFilter(e.target.value as any)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-none"
          >
            <option value="all">{isRTL ? "جميع أنواع الدراسة" : "All Study Types"}</option>
            <option value="group">{isRTL ? "مجموعات عامة" : "Group Lessons"}</option>
            <option value="private">{isRTL ? "دروس خاصة فردية" : "Private Lessons"}</option>
          </select>

          {/* Group Filter */}
          <select
            value={groupFilter}
            onChange={e => setGroupFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-none"
          >
            <option value="all">{isRTL ? "جميع المجموعات" : "All Groups"}</option>
            {groups.map(g => (
              <option key={g.id} value={g.id}>
                {g.name} ({g.subject})
              </option>
            ))}
          </select>

          {/* Teacher Filter */}
          <select
            value={teacherFilter}
            onChange={e => setTeacherFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-none"
          >
            <option value="all">{isRTL ? "جميع المعلمين" : "All Teachers"}</option>
            {teachers.map(t => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Students List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-bold text-slate-800">
              {isRTL ? `قائمة الطلاب (${filteredStudents.length})` : `Students Directory (${filteredStudents.length})`}
            </h4>
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">{isRTL ? "لا يوجد طلاب مطابقين لمعايير الفلترة" : "No matching students found"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600">
                  <th className="py-3 px-4 text-start font-bold">{isRTL ? "الطالب" : "Student"}</th>
                  <th className="py-3 px-4 text-start font-bold">{isRTL ? "النوع والمجموعة" : "Group / Study"}</th>
                  <th className="py-3 px-4 text-start font-bold">{isRTL ? "المعلم المسؤول" : "Teacher"}</th>
                  <th className="py-3 px-4 text-start font-bold">
                    {isRTL ? "بيانات ولي الأمر (حساسة 🔒)" : "Parent Contact (🔒)"}
                  </th>
                  <th className="py-3 px-4 text-start font-bold">{isRTL ? "سعر الحصة" : "Lesson Fee"}</th>
                  {canManage && <th className="py-3 px-4 text-center font-bold">{isRTL ? "إجراءات" : "Actions"}</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map(student => {
                  const assignedTeacher = teachers.find(t => (student.teacherIds || []).includes(t.id));
                  const assignedGroup = groups.find(g => (student.groupIds || []).includes(g.id));

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/60 transition">
                      {/* Student Info */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">
                            {(student.fullName || student.name || "ط").charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{student.fullName || student.name}</span>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                              <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-600">{student.studentNumber || "N/A"}</span>
                              <span>•</span>
                              <span>{student.academicYear || "عام"}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Group / Study Type */}
                      <td className="py-3 px-4">
                        {student.studyType === "group" ? (
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="font-semibold text-slate-800">{assignedGroup?.name || "مجموعة عامة"}</span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            {isRTL ? "درس خاص فردي" : "Private Lesson"}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 block mt-0.5">{student.subject || "عام"}</span>
                      </td>

                      {/* Assigned Teacher */}
                      <td className="py-3 px-4">
                        {assignedTeacher ? (
                          <span className="font-semibold text-slate-800">{assignedTeacher.name}</span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">{isRTL ? "غير محدد" : "Unassigned"}</span>
                        )}
                      </td>

                      {/* Sensitive Contact (Protected) */}
                      <td className="py-3 px-4">
                        {canViewSensitive ? (
                          <div className="space-y-1">
                            {student.parentContact ? (
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-slate-800" dir="ltr">
                                  {student.parentContact}
                                </span>
                                <button
                                  onClick={() => handleCopy(student.parentContact!, `p_${student.id}`)}
                                  className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                                  title={isRTL ? "نسخ الرقم" : "Copy Phone"}
                                >
                                  {copiedId === `p_${student.id}` ? (
                                    <Check className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic text-[11px]">{isRTL ? "لم يسجل هاتف" : "No parent contact"}</span>
                            )}

                            {student.whatsappGroupLink && (
                              <a
                                href={student.whatsappGroupLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:underline font-bold"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>{isRTL ? "رابط الواتساب" : "WhatsApp"}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-400 font-mono text-[10px]">
                            {isRTL ? "🔒 محمي بصلاحية" : "🔒 Restricted"}
                          </span>
                        )}
                      </td>

                      {/* Lesson Cost */}
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900">{student.lessonCost || 100} ج.م</span>
                      </td>

                      {/* Actions */}
                      {canManage && (
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => openEditModal(student)}
                            className="p-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition"
                            title={isRTL ? "تعديل بيانات الطالب والربط" : "Edit Student Link"}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {editingStudent
                      ? isRTL ? "تعديل ملف الطالب والربط الإداري" : "Edit Student Profile & Linkages"
                      : isRTL ? "تسجيل وإضافة طالب جديد" : "Enroll New Student"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isRTL ? "ربط فوري بالمعلم، المجموعة، وحساب ولي الأمر المحمي" : "Link with teacher, group, and parent contact"}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isRTL ? "اسم الطالب بالكامل *" : "Student Full Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder={isRTL ? "مثال: يوسف أحمد عبد الله" : "e.g. Youssef Ahmed"}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isRTL ? "كود / رقم الطالب" : "Student Code / Number"}
                  </label>
                  <input
                    type="text"
                    value={formStudentNumber}
                    onChange={e => setFormStudentNumber(e.target.value)}
                    placeholder="STD-1001"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isRTL ? "المرحلة الدراسية" : "Academic Grade"}
                  </label>
                  <input
                    type="text"
                    value={formAcademicYear}
                    onChange={e => setFormAcademicYear(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isRTL ? "المادة الأساسية" : "Subject"}
                  </label>
                  <input
                    type="text"
                    value={formSubject}
                    onChange={e => setFormSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Study Type & Group Linking */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    {isRTL ? "نوع الدراسة والربط بالمجموعة" : "Study Type & Group"}
                  </label>
                  <div className="flex gap-2">
                    <label className="flex items-center gap-1 text-xs cursor-pointer">
                      <input
                        type="radio"
                        name="studyType"
                        value="group"
                        checked={formStudyType === "group"}
                        onChange={() => setFormStudyType("group")}
                        className="text-blue-600 focus:ring-0"
                      />
                      <span className="font-semibold text-slate-700">{isRTL ? "مجموعة" : "Group"}</span>
                    </label>
                    <label className="flex items-center gap-1 text-xs cursor-pointer">
                      <input
                        type="radio"
                        name="studyType"
                        value="private"
                        checked={formStudyType === "private"}
                        onChange={() => setFormStudyType("private")}
                        className="text-amber-600 focus:ring-0"
                      />
                      <span className="font-semibold text-slate-700">{isRTL ? "خاص فردي" : "Private"}</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formStudyType === "group" && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        {isRTL ? "المجموعة الدراسية" : "Select Group"}
                      </label>
                      <select
                        value={formSelectedGroup}
                        onChange={e => setFormSelectedGroup(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                      >
                        <option value="">{isRTL ? "اختر المجموعة..." : "Select Group..."}</option>
                        {groups.map(g => (
                          <option key={g.id} value={g.id}>
                            {g.name} ({g.subject})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      {isRTL ? "المعلم المسؤول *" : "Assigned Teacher *"}
                    </label>
                    <select
                      value={formSelectedTeacher}
                      onChange={e => setFormSelectedTeacher(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
                    >
                      <option value="">{isRTL ? "اختر المعلم..." : "Select Teacher..."}</option>
                      {teachers.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({ (t.specialties || []).join(", ") })
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      {isRTL ? "سعر الحصة (ج.م)" : "Lesson Fee (EGP)"}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formLessonCost}
                      onChange={e => setFormLessonCost(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Sensitive Contacts Section (/sensitive_contacts) */}
              <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-200/80 space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-950">
                    {isRTL ? "بيانات التواصل الحساسة لولي الأمر (/sensitive_contacts)" : "Protected Parent Contacts"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {isRTL ? "اسم ولي الأمر" : "Parent Name"}
                    </label>
                    <input
                      type="text"
                      value={formParentName}
                      onChange={e => setFormParentName(e.target.value)}
                      placeholder={isRTL ? "أ. أحمد عبد الله" : "Parent Name"}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {isRTL ? "رقم هاتف / واتساب ولي الأمر" : "Parent Phone / WhatsApp"}
                    </label>
                    <input
                      type="tel"
                      value={formParentContact}
                      onChange={e => setFormParentContact(e.target.value)}
                      placeholder="+2010..."
                      dir="ltr"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {isRTL ? "هاتف الطالب المباشر (اختياري)" : "Student Direct Phone"}
                    </label>
                    <input
                      type="tel"
                      value={formStudentPhone}
                      onChange={e => setFormStudentPhone(e.target.value)}
                      placeholder="+2011..."
                      dir="ltr"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {isRTL ? "رابط مجموعة الواتساب المخصصة" : "Custom WhatsApp Group Link"}
                    </label>
                    <input
                      type="url"
                      value={formWhatsappLink}
                      onChange={e => setFormWhatsappLink(e.target.value)}
                      placeholder="https://chat.whatsapp.com/..."
                      dir="ltr"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isRTL ? "ملاحظات إدارية" : "Administrative Notes"}
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder={isRTL ? "أي ملاحظات إدارية أو أكاديمية خاصة بالطالب..." : "Any administrative notes..."}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
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
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
                >
                  {isSubmitting
                    ? isRTL ? "جارٍ الحفظ..." : "Saving..."
                    : editingStudent
                    ? isRTL ? "حفظ التعديلات" : "Save Changes"
                    : isRTL ? "تسجيل الطالب" : "Enroll Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
