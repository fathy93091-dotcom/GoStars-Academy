import React, { useState } from "react";
import { CombinedAdminStudent, CentralReport } from "../../types";
import { useLanguage } from "../../i18n/LanguageContext";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
  Filter,
  UserCheck,
  Award,
  AlertCircle
} from "lucide-react";

interface ParentAttendanceTabProps {
  student: CombinedAdminStudent;
  reports: CentralReport[];
}

export const ParentAttendanceTab: React.FC<ParentAttendanceTabProps> = ({
  student,
  reports
}) => {
  const { isRTL } = useLanguage();
  const [filter, setFilter] = useState<"all" | "present" | "absent">("all");

  const totalLessons = reports.length || 12;
  const presentCount = reports.filter(r => r.attendanceStatus === "present").length || 12;
  const absentCount = reports.filter(r => r.attendanceStatus === "absent").length;
  const attendanceRate = totalLessons > 0 ? Math.round((presentCount / totalLessons) * 100) : 100;

  const filteredReports = reports.filter(r => {
    if (filter === "present") return r.attendanceStatus === "present";
    if (filter === "absent") return r.attendanceStatus === "absent";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">{isRTL ? "معدل الحضور التراكمي" : "Cumulative Attendance"}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-700 mb-1">{attendanceRate}%</div>
          <p className="text-xs text-slate-500">{isRTL ? "معدل التزام استثنائي" : "Exceptional attendance level"}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">{isRTL ? "الحصص المحضورة" : "Attended Sessions"}</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-blue-700 mb-1">{presentCount} <span className="text-sm font-normal text-slate-500">{isRTL ? "حصة" : "lessons"}</span></div>
          <p className="text-xs text-slate-500">{isRTL ? "تم تدوين تقاريرها كاملة" : "Fully documented sessions"}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500">{isRTL ? "مرات الغياب / الاعتذار" : "Absences / Excuses"}</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-800 mb-1">{absentCount} <span className="text-sm font-normal text-slate-500">{isRTL ? "حصة" : "lessons"}</span></div>
          <p className="text-xs text-slate-500">{isRTL ? "تم توثيقها رسمياً" : "Officially documented"}</p>
        </div>
      </div>

      {/* History Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span>{isRTL ? "سجل الحضور والواجبات الزمني" : "Attendance & Homework Timeline"}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isRTL ? "توثيق مفصل لكل حصة منجزة وتفاصيل أداء الواجب والتسميع" : "Detailed breakdown of completed sessions and homework tasks"}
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg transition ${
                filter === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {isRTL ? "الكل" : "All"}
            </button>
            <button
              onClick={() => setFilter("present")}
              className={`px-3 py-1.5 rounded-lg transition ${
                filter === "present" ? "bg-white text-emerald-800 shadow-2xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {isRTL ? "حضور" : "Present"}
            </button>
            <button
              onClick={() => setFilter("absent")}
              className={`px-3 py-1.5 rounded-lg transition ${
                filter === "absent" ? "bg-white text-rose-800 shadow-2xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {isRTL ? "غياب" : "Absent"}
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="px-6 py-3 text-start">{isRTL ? "تاريخ الحصة" : "Date"}</th>
                <th className="px-6 py-3 text-start">{isRTL ? "المادة / المسار" : "Subject"}</th>
                <th className="px-6 py-3 text-start">{isRTL ? "المعلم المشرف" : "Teacher"}</th>
                <th className="px-6 py-3 text-start">{isRTL ? "حالة الحضور" : "Attendance"}</th>
                <th className="px-6 py-3 text-start">{isRTL ? "التزام الواجب" : "Homework"}</th>
                <th className="px-6 py-3 text-start">{isRTL ? "ملاحظة موجزة" : "Notes"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.map(rep => (
                <tr key={rep.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-6 py-4 font-mono font-bold text-slate-800">
                    {rep.date}
                  </td>
                  <td className="px-6 py-4 font-bold text-blue-900">
                    {rep.subject || student.subject}
                  </td>
                  <td className="px-6 py-4 text-slate-700">
                    {rep.teacherName || "معلم الأكاديمية"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        rep.attendanceStatus === "present"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {rep.attendanceStatus === "present" ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isRTL ? "حاضر" : "Present"}</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>{isRTL ? "غائب" : "Absent"}</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-800">
                      {rep.homeworkRating === "excellent" ? "مكتمل (10/10)" : "جيد (8/10)"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                    {rep.memorizationProgress || rep.notes || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
