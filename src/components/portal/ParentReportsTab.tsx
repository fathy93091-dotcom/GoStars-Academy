import React, { useState } from "react";
import { CombinedAdminStudent, CentralReport } from "../../types";
import { useLanguage } from "../../i18n/LanguageContext";
import {
  FileText,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Printer,
  ChevronDown,
  ChevronUp,
  Download,
  BookOpen
} from "lucide-react";

interface ParentReportsTabProps {
  student: CombinedAdminStudent;
  reports: CentralReport[];
  onOpenReportModal: (report: CentralReport) => void;
}

export const ParentReportsTab: React.FC<ParentReportsTabProps> = ({
  student,
  reports,
  onOpenReportModal
}) => {
  const { isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null);

  // Extract unique subjects
  const subjects = Array.from(new Set(reports.map(r => r.subject).filter(Boolean)));

  const filteredReports = reports.filter(r => {
    const matchesSearch =
      (r.subject && r.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.notes && r.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.memorizationProgress && r.memorizationProgress.toLowerCase().includes(searchTerm.toLowerCase())) ||
      r.date.includes(searchTerm);

    const matchesSubject = subjectFilter === "all" || r.subject === subjectFilter;

    return matchesSearch && matchesSubject;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar & Search Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>{isRTL ? "مركز استعراض التقارير الأكاديمية" : "Academic Reports Center"}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isRTL
              ? `إجمالي ${reports.length} تقارير أكاديمية موثقة للطالب (${student.name})`
              : `Total ${reports.length} verified reports for ${student.name}`}
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={isRTL ? "بحث بالتاريخ أو الملاحظات أو السورة..." : "Search by date, notes, surah..."}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-hidden focus:border-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute top-2.5 start-3 pointer-events-none" />
          </div>

          {subjects.length > 0 && (
            <select
              value={subjectFilter}
              onChange={e => setSubjectFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-hidden"
            >
              <option value="all">{isRTL ? "جميع المواد" : "All Subjects"}</option>
              {subjects.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Reports Listing */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 text-xs">
          <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
          <p>{isRTL ? "لا توجد تقارير مطابقة لخيارات البحث." : "No reports matched your search criteria."}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map(rep => {
            const isExpanded = expandedReportId === rep.id;
            return (
              <div
                key={rep.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:border-blue-300"
              >
                {/* Header Summary Row */}
                <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-black text-base text-slate-900">
                        {rep.subject || student.subject}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-600 font-mono flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {rep.date}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        {rep.attendanceStatus === "present" ? (isRTL ? "حاضر" : "Present") : (isRTL ? "غائب" : "Absent")}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                        {rep.studyType === "private" ? (isRTL ? "حصة فردية خاصة" : "1-on-1 Lesson") : (isRTL ? "مجموعة جماعية" : "Group Lesson")}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center gap-2">
                      <span>{isRTL ? "المعلم المشرف:" : "Teacher:"} <strong className="text-slate-800">{rep.teacherName || "معلم الأكاديمية"}</strong></span>
                    </div>

                    {rep.memorizationProgress && (
                      <p className="text-xs font-semibold text-amber-900 line-clamp-1 mt-1">
                        ★ {rep.memorizationProgress}
                      </p>
                    )}
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onOpenReportModal(rep)}
                      className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5 text-blue-600" />
                      <span>{isRTL ? "معاينة الإيصال الأكاديمي" : "Academic Voucher"}</span>
                    </button>

                    <button
                      onClick={() => setExpandedReportId(isExpanded ? null : rep.id)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                      title={isRTL ? "تفاصيل إضافية" : "More details"}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-4 text-xs animate-in fade-in">
                    {/* Performance Badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-white border border-slate-200">
                        <span className="text-[11px] text-slate-400 block mb-0.5">{isRTL ? "الواجب والتكليف" : "Homework"}</span>
                        <span className="font-bold text-slate-900">{rep.homeworkRating === "excellent" ? "مكتمل وممتاز" : "جيد"}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-slate-200">
                        <span className="text-[11px] text-slate-400 block mb-0.5">{isRTL ? "التفاعل والسلوك" : "Behavior"}</span>
                        <span className="font-bold text-slate-900">{rep.behaviorRating === "excellent" ? "ممتاز جداً" : "جيد جداً"}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-slate-200">
                        <span className="text-[11px] text-slate-400 block mb-0.5">{isRTL ? "الاستيعاب والتطور" : "Progress"}</span>
                        <span className="font-bold text-emerald-700">{rep.progressRating === "excellent" ? "تطور ملحوظ" : "مستمر"}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-slate-200">
                        <span className="text-[11px] text-slate-400 block mb-0.5">{isRTL ? "رقم الجلسة" : "Session ID"}</span>
                        <span className="font-mono text-slate-600">{rep.id}</span>
                      </div>
                    </div>

                    {/* Teacher Notes */}
                    {rep.notes && (
                      <div className="p-3.5 rounded-2xl bg-white border border-slate-200">
                        <span className="font-bold text-slate-900 block mb-1">{isRTL ? "تقييم وملاحظات المعلم:" : "Teacher Notes:"}</span>
                        <p className="text-slate-700 leading-relaxed">{rep.notes}</p>
                      </div>
                    )}

                    {/* Strengths & Recommendations */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {rep.strengths && (
                        <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                          <span className="font-bold text-emerald-900 block mb-1">
                            {isRTL ? "نقاط القوة:" : "Strengths:"}
                          </span>
                          <p className="text-emerald-950">{rep.strengths}</p>
                        </div>
                      )}
                      {rep.recommendations && (
                        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                          <span className="font-bold text-amber-900 block mb-1">
                            {isRTL ? "التوصيات:" : "Recommendations:"}
                          </span>
                          <p className="text-amber-950">{rep.recommendations}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
