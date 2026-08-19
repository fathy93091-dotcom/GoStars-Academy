import React from "react";
import { CombinedAdminStudent, MonthlyStudentEvaluation, StudentCertificate } from "../../types";
import { useLanguage } from "../../i18n/LanguageContext";
import {
  Award,
  Sparkles,
  Calendar,
  CheckCircle2,
  Printer,
  FileText,
  Star,
  GraduationCap,
  ShieldCheck
} from "lucide-react";

interface ParentCertificatesTabProps {
  student: CombinedAdminStudent;
  evaluations: MonthlyStudentEvaluation[];
  certificates: StudentCertificate[];
  onOpenCertificateModal: (cert: StudentCertificate) => void;
}

export const ParentCertificatesTab: React.FC<ParentCertificatesTabProps> = ({
  student,
  evaluations,
  certificates,
  onOpenCertificateModal
}) => {
  const { isRTL } = useLanguage();

  return (
    <div className="space-y-8">
      {/* Certificates of Appreciation Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>{isRTL ? "شهادات التميز والأوسمة الأكاديمية" : "Official Certificates & Honors"}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isRTL ? "شهادات التقدير والتكريم الصادرة من إدارة الأكاديمية للطالب" : "Appreciation diplomas and honors issued by GoStars Academy"}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
            {certificates.length} {isRTL ? "شهادات معتمدة" : "Verified Diplomas"}
          </span>
        </div>

        {certificates.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 text-slate-400 text-xs">
            <Award className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p>{isRTL ? "لا توجد شهادات صادرة حالياً." : "No certificates issued currently."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certificates.map(cert => (
              <div
                key={cert.id}
                className="bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 rounded-3xl border-2 border-amber-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400/20 text-amber-900 border border-amber-400/30">
                      ★ {isRTL ? "شهادة رسمية" : "Official Award"}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {cert.serialNumber}
                    </span>
                  </div>

                  <h3 className="font-black text-base text-slate-900">{cert.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {cert.appreciationText}
                  </p>
                </div>

                <div className="pt-4 border-t border-amber-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">{isRTL ? "المشرف / المعلم:" : "Supervisor:"}</span>
                    <span className="font-bold text-xs text-slate-800">{cert.teacherName}</span>
                  </div>

                  <button
                    onClick={() => onOpenCertificateModal(cert)}
                    className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>{isRTL ? "معاينة وطباعة" : "View & Print"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Monthly Comprehensive Evaluations Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span>{isRTL ? "التقييمات والملخصات الشهرية الشاملة" : "Monthly Comprehensive Evaluations"}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isRTL ? "تقييم أداء الطالب ونقاط القوة والتحسين الصادرة نهاية كل شهر" : "End-of-month academic evaluation, strengths, and recommendations"}
          </p>
        </div>

        {evaluations.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 text-slate-400 text-xs">
            <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p>{isRTL ? "لا توجد تقييمات شهرية حتى الآن." : "No monthly evaluations recorded yet."}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {evaluations.map(ev => (
              <div
                key={ev.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 font-black flex items-center justify-center text-base">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-base text-slate-900">{ev.monthLabel}</h3>
                      <p className="text-xs text-slate-500">{isRTL ? "التقرير التقييمي الشامل" : "Comprehensive Review"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-4 py-1.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-200">
                      {ev.generalRating}
                    </span>
                  </div>
                </div>

                {/* Score Meters */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-xs text-slate-500 block mb-1">{isRTL ? "نسبة الحضور" : "Attendance"}</span>
                    <span className="text-2xl font-black text-slate-900">{ev.attendanceRate}%</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-xs text-slate-500 block mb-1">{isRTL ? "إنجاز الواجبات" : "Homework"}</span>
                    <span className="text-2xl font-black text-slate-900">{ev.homeworkRate}%</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-xs text-slate-500 block mb-1">{isRTL ? "معدل الاختبارات" : "Quiz Average"}</span>
                    <span className="text-2xl font-black text-emerald-700">{ev.averageScore}%</span>
                  </div>
                </div>

                {/* Progress Details */}
                {(ev.memorizationProgress || ev.tajweedLevel) && (
                  <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1.5 text-xs">
                    {ev.memorizationProgress && (
                      <p className="text-amber-950">
                        <strong className="text-amber-900">{isRTL ? "الحفظ والمراجعة المنجزة: " : "Completed: "}</strong>
                        {ev.memorizationProgress}
                      </p>
                    )}
                    {ev.tajweedLevel && (
                      <p className="text-amber-950">
                        <strong className="text-amber-900">{isRTL ? "أحكام التجويد المتقنة: " : "Tajweed: "}</strong>
                        {ev.tajweedLevel}
                      </p>
                    )}
                  </div>
                )}

                {/* Teacher Summary Notes */}
                {ev.teacherNotes && (
                  <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs">
                    <span className="font-bold text-blue-950 block mb-1">{isRTL ? "رأي وملاحظات المعلم:" : "Teacher Feedback:"}</span>
                    <p className="text-slate-700 leading-relaxed">{ev.teacherNotes}</p>
                  </div>
                )}

                {/* Strengths and Recommendations Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {ev.strengths && ev.strengths.length > 0 && (
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                      <span className="font-bold text-emerald-900 block flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        {isRTL ? "نقاط القوة والإشادة:" : "Key Strengths:"}
                      </span>
                      <ul className="space-y-1 text-slate-700">
                        {ev.strengths.map((st, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">•</span>
                            <span>{st}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {ev.recommendations && ev.recommendations.length > 0 && (
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                      <span className="font-bold text-amber-900 block flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        {isRTL ? "توصيات الشهر القادم:" : "Recommendations:"}
                      </span>
                      <ul className="space-y-1 text-slate-700">
                        {ev.recommendations.map((rc, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-amber-600 font-bold">•</span>
                            <span>{rc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
