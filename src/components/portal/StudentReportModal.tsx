import React from "react";
import { CentralReport, CombinedAdminStudent } from "../../types";
import { useLanguage } from "../../i18n/LanguageContext";
import {
  X,
  Printer,
  ShieldCheck,
  Calendar,
  User,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Award,
  FileText,
  Clock
} from "lucide-react";

interface StudentReportModalProps {
  report: CentralReport;
  student: CombinedAdminStudent;
  onClose: () => void;
}

export const StudentReportModal: React.FC<StudentReportModalProps> = ({
  report,
  student,
  onClose
}) => {
  const { isRTL } = useLanguage();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8 transition-all animate-in fade-in zoom-in-95">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 text-amber-400 border border-blue-400/30 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-white">
                {isRTL ? "بطاقة التقرير الأكاديمي المعتمد" : "Official Academic Report Card"}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                ID: {report.id}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1.5 text-xs font-bold"
              title={isRTL ? "طباعة التقرير" : "Print Report"}
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">{isRTL ? "طباعة" : "Print"}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800" id="printable-report">
          {/* Academy Official Letterhead */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-800 to-slate-900 text-white flex items-center justify-center font-black shadow-md">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#0B192C] leading-none">
                  GoStars Academy
                </h2>
                <p className="text-xs text-amber-600 font-bold mt-1">
                  {isRTL ? "آفاق واسعة.. لعلم لا ينتهي" : "Broad Horizons.. For Endless Knowledge"}
                </p>
              </div>
            </div>
            <div className="text-end">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                {isRTL ? "تقرير رسمي معتمد" : "Verified Academic Report"}
              </span>
              <p className="text-xs text-slate-500 mt-1">
                {isRTL ? "تاريخ الحصة:" : "Date:"} {report.date}
              </p>
            </div>
          </div>

          {/* Student & Session Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block mb-1">{isRTL ? "اسم الطالب:" : "Student Name:"}</span>
              <span className="font-bold text-slate-900 text-sm block truncate">{student.name}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">{isRTL ? "المادة التعليمية:" : "Subject:"}</span>
              <span className="font-bold text-blue-700 block truncate">{report.subject || student.subject}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">{isRTL ? "المعلم المشرف:" : "Teacher:"}</span>
              <span className="font-bold text-slate-900 block truncate">{report.teacherName || "المعلم المعتمد"}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-1">{isRTL ? "حالة الحضور:" : "Attendance:"}</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {report.attendanceStatus === "present" ? (isRTL ? "حاضر ومنتظم" : "Present") : (isRTL ? "غائب" : "Absent")}
              </span>
            </div>
          </div>

          {/* Lesson Details & Memorization Progress */}
          {(report.memorizationProgress || report.tajweedLevel) && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <h4 className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                {isRTL ? "إنجاز الحفظ والتجويد في الحصة" : "Memorization & Tajweed Progress"}
              </h4>
              {report.memorizationProgress && (
                <p className="text-xs text-amber-950">
                  <span className="font-bold">{isRTL ? "المقدار المنجز: " : "Progress: "}</span>
                  {report.memorizationProgress}
                </p>
              )}
              {report.tajweedLevel && (
                <p className="text-xs text-amber-950">
                  <span className="font-bold">{isRTL ? "القواعد والتطبيق: " : "Applied Rules: "}</span>
                  {report.tajweedLevel}
                </p>
              )}
            </div>
          )}

          {/* Ratings Summary */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 block mb-1">{isRTL ? "التزام الواجب" : "Homework"}</span>
              <span className="font-black text-xs text-slate-900">
                {report.homeworkRating === "excellent" ? "متميز (10/10)" : "جيد (8/10)"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 block mb-1">{isRTL ? "التفاعل والسلوك" : "Behavior"}</span>
              <span className="font-black text-xs text-slate-900">
                {report.behaviorRating === "excellent" ? "ممتاز مرتفع" : "جيد جداً"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 block mb-1">{isRTL ? "المستوى العام" : "Progress"}</span>
              <span className="font-black text-xs text-emerald-700">
                {report.progressRating === "excellent" ? "تفوق أكاديمي" : "متقدم"}
              </span>
            </div>
          </div>

          {/* Teacher Notes & Feedback */}
          {report.notes && (
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
              <h4 className="text-xs font-black text-blue-900 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                {isRTL ? "ملاحظات المعلم وتقييم الأداء" : "Teacher Evaluation & Notes"}
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                {report.notes}
              </p>
            </div>
          )}

          {/* Strengths & Recommendations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {report.strengths && (
              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200">
                <span className="font-bold text-emerald-900 block mb-1 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  {isRTL ? "نقاط القوة والتميز:" : "Key Strengths:"}
                </span>
                <p className="text-slate-700 leading-relaxed">{report.strengths}</p>
              </div>
            )}
            {report.recommendations && (
              <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200">
                <span className="font-bold text-amber-900 block mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  {isRTL ? "التوجيهات والتوصيات:" : "Recommendations:"}
                </span>
                <p className="text-slate-700 leading-relaxed">{report.recommendations}</p>
              </div>
            )}
          </div>

          {/* Footer Official Stamp & Verification */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{isRTL ? "معتمد إلكترونياً من الإشراف الأكاديمي لـ GoStars" : "Electronically verified by GoStars Supervision"}</span>
            </div>
            <span className="font-mono text-slate-400">
              STAMP: GS-{new Date().getFullYear()}-VERIFIED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
