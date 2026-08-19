import React, { useState } from "react";
import { CentralReport, TeacherRecord, CombinedAdminStudent } from "../../types";
import { useLanguage } from "../../i18n/LanguageContext";
import {
  FileText,
  Search,
  Calendar,
  User,
  GraduationCap,
  Sparkles,
  Eye,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
  Check,
  Printer,
  Layers,
  Filter
} from "lucide-react";

interface AdminReportsReviewProps {
  reports: CentralReport[];
  teachers: TeacherRecord[];
  students: CombinedAdminStudent[];
}

export const AdminReportsReview: React.FC<AdminReportsReviewProps> = ({
  reports,
  teachers,
  students
}) => {
  const { isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("all");
  const [selectedType, setSelectedType] = useState<"all" | "individual" | "group">("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [activeReport, setActiveReport] = useState<CentralReport | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyReport = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const filteredReports = reports.filter(r => {
    const sName = r.studentName || r.groupName || "";
    const matchesSearch =
      sName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.reportText || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTeacher =
      selectedTeacher === "all" ? true : r.teacherId === selectedTeacher;

    const matchesType =
      selectedType === "all" ? true : r.reportType === selectedType;

    const matchesDate =
      !selectedDate ? true : (r.date && r.date.startsWith(selectedDate));

    return matchesSearch && matchesTeacher && matchesType && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-200">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                {isRTL ? "مركز تدقيق ومراجعة تقارير الحصص" : "Central Reports Audit & Review Hub"}
              </h3>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-800">
                {reports.length} {isRTL ? "تقرير مسجل" : "Reports"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              {isRTL
                ? "مراجعة ومراقبة جودة كافة التقارير الفردية والجماعية الصادرة من المعلمين مع فحص ملاحظات الأداء وتوجيهات الذكاء الاصطناعي."
                : "Review and audit lesson reports generated across teachers, with AI directives and performance notes."}
            </p>
          </div>
        </div>
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
              placeholder={isRTL ? "ابحث باسم الطالب أو المجموعة أو المادة..." : "Search student, group, or subject..."}
              className="w-full ps-9 pe-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          {/* Teacher Filter */}
          <select
            value={selectedTeacher}
            onChange={e => setSelectedTeacher(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-none"
          >
            <option value="all">{isRTL ? "جميع المعلمين" : "All Teachers"}</option>
            {teachers.map(t => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          {/* Report Type Filter */}
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value as any)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-none"
          >
            <option value="all">{isRTL ? "جميع أنواع التقارير" : "All Report Types"}</option>
            <option value="individual">{isRTL ? "تقارير فردية للطلاب" : "Individual Reports"}</option>
            <option value="group">{isRTL ? "تقارير جماعية للمجموعات" : "Group Reports"}</option>
          </select>

          {/* Date Filter */}
          <div className="relative">
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-mono focus:bg-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredReports.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">{isRTL ? "لا توجد تقارير مطابقة لخيارات التصفية" : "No reports found"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600">
                  <th className="py-3 px-4 text-start font-bold">{isRTL ? "الجهة / الطالب" : "Target"}</th>
                  <th className="py-3 px-4 text-start font-bold">{isRTL ? "النوع والمادة" : "Type & Subject"}</th>
                  <th className="py-3 px-4 text-start font-bold">{isRTL ? "المعلم المصدر" : "Teacher"}</th>
                  <th className="py-3 px-4 text-start font-bold">{isRTL ? "التاريخ والحصة" : "Date & Lesson"}</th>
                  <th className="py-3 px-4 text-start font-bold">{isRTL ? "حالة الحضور" : "Attendance"}</th>
                  <th className="py-3 px-4 text-center font-bold">{isRTL ? "معاينة التقرير" : "Preview"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map(report => {
                  const teacher = teachers.find(t => t.id === report.teacherId);
                  const isGroup = report.reportType === "group";

                  return (
                    <tr key={report.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                            isGroup ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                          }`}>
                            {isGroup ? <Layers className="w-3.5 h-3.5" /> : <GraduationCap className="w-3.5 h-3.5" />}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">
                              {isGroup ? report.groupName : (report.studentName || "طالب")}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                          {report.subject}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {isGroup ? (isRTL ? "تقرير مجموعة" : "Group Report") : (isRTL ? "تقرير فردي" : "Individual")}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800">{teacher?.name || "أ. معلم الأكاديمية"}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono text-slate-700 block">{report.date}</span>
                        <span className="text-[10px] text-slate-400">
                          {isRTL ? `حصة رقم #${report.lessonNumber || 1}` : `Lesson #${report.lessonNumber || 1}`}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {report.attendance === "present" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{isRTL ? "حاضر" : "Present"}</span>
                          </span>
                        ) : report.attendance === "excused" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700">
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            <span>{isRTL ? "غائب بعذر" : "Excused"}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>{isRTL ? "غائب بدون عذر" : "Absent"}</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setActiveReport(report)}
                          className="p-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs inline-flex items-center gap-1 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isRTL ? "عرض" : "View"}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Report Preview Modal */}
      {activeReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {isRTL ? "معاينة التقرير الأكاديمي المعتمد" : "Academic Report Preview"}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {activeReport.subject} • {activeReport.date}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveReport(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Metadata Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">{isRTL ? "الجهة / الطالب" : "Target"}</span>
                  <span className="font-bold text-slate-900">{activeReport.studentName || activeReport.groupName}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">{isRTL ? "رقم الحصة" : "Lesson No."}</span>
                  <span className="font-bold text-slate-900">#{activeReport.lessonNumber || 1}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">{isRTL ? "الحضور" : "Attendance"}</span>
                  <span className="font-bold text-emerald-700">{activeReport.attendance}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">{isRTL ? "حالة الواجب" : "Homework"}</span>
                  <span className="font-bold text-slate-900">{activeReport.homeworkStatus || "مكتمل"}</span>
                </div>
              </div>

              {/* Teacher Notes */}
              {activeReport.teacherNotes && (
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs">
                  <span className="font-bold text-amber-900 block mb-1">
                    {isRTL ? "📝 ملاحظات المعلم الأصلية:" : "Teacher Notes:"}
                  </span>
                  <p className="text-amber-800 leading-relaxed">{activeReport.teacherNotes}</p>
                </div>
              )}

              {/* AI Directives */}
              {activeReport.aiInstructions && (
                <div className="p-3 bg-indigo-50/70 border border-indigo-200/80 rounded-2xl text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-900 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{isRTL ? "توجيهات الذكاء الاصطناعي (Gemini):" : "AI Directives:"}</span>
                  </div>
                  <p className="text-indigo-800 leading-relaxed">{activeReport.aiInstructions}</p>
                </div>
              )}

              {/* Report Full Text */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 leading-relaxed whitespace-pre-line font-sans">
                {activeReport.reportText || activeReport.generatedText || (isRTL ? "لا يوجد نص مسجل للتقرير." : "No text content.")}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
              <button
                onClick={() => handleCopyReport(activeReport.reportText || activeReport.generatedText || "")}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? (isRTL ? "تم النسخ بنجاح" : "Copied!") : (isRTL ? "نسخ التقرير" : "Copy Text")}</span>
              </button>

              <button
                onClick={() => setActiveReport(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
              >
                {isRTL ? "إغلاق" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
