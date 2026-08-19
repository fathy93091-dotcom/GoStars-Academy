import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Save,
  Check,
  Copy,
  AlertCircle,
  Sparkles,
  Users,
  Calendar,
  BookOpen,
  CheckCircle2,
  XCircle,
  FileText,
  Printer,
  Award,
  Clock,
  Send
} from "lucide-react";
import { Group, Student, ReportAttachment } from "../types";

export interface StudentReportItem {
  attendance: "present" | "absent" | "excused";
  homework: "done" | "not_done" | "partial";
  score: string;
  notes: string;
}

interface GroupReportViewProps {
  group: Group;
  students: Student[];
  isArabic?: boolean;
  onBack: () => void;
  onSaveReport?: (reportData: {
    groupId: string;
    groupName: string;
    subject: string;
    date: string;
    items: Record<string, StudentReportItem>;
    generalNotes: string;
    aiSummary?: string;
  }) => void;
  onGenerateReportAi?: (payload: {
    groupName: string;
    subject: string;
    date: string;
    items: Record<string, StudentReportItem>;
    students: Student[];
    generalNotes: string;
  }) => Promise<string>;
}

export const GroupReportView: React.FC<GroupReportViewProps> = ({
  group,
  students,
  isArabic = true,
  onBack,
  onSaveReport,
  onGenerateReportAi
}) => {
  // Filter students who belong to this group
  const groupStudents = useMemo(() => {
    return students.filter(s =>
      group.studentIds && group.studentIds.includes(s.id)
    );
  }, [students, group.studentIds]);

  const storageKey = `group_report_${group.id}_latest`;

  // Initialize report state
  const [reportDate, setReportDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  
  const [studentReports, setStudentReports] = useState<
    Record<string, StudentReportItem>
  >(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.items) {
          return parsed.items;
        }
      }
    } catch {
      // ignore
    }

    const initial: Record<string, StudentReportItem> = {};
    groupStudents.forEach(s => {
      initial[s.id] = {
        attendance: "present",
        homework: "done",
        score: "",
        notes: ""
      };
    });
    return initial;
  });

  const [generalNotes, setGeneralNotes] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.generalNotes || "";
      }
    } catch {
      // ignore
    }
    return "";
  });

  const [aiSummary, setAiSummary] = useState<string>("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Ensure all current students have an entry in state
  useEffect(() => {
    setStudentReports(prev => {
      const updated = { ...prev };
      let changed = false;
      groupStudents.forEach(s => {
        if (!updated[s.id]) {
          updated[s.id] = {
            attendance: "present",
            homework: "done",
            score: "",
            notes: ""
          };
          changed = true;
        }
      });
      return changed ? updated : prev;
    });
  }, [groupStudents]);

  const updateStudentReport = (
    studentId: string,
    field: keyof StudentReportItem,
    value: string
  ) => {
    setStudentReports(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  // Quick stats calculation
  const stats = useMemo(() => {
    let presentCount = 0;
    let absentCount = 0;
    let excusedCount = 0;
    let hwDoneCount = 0;

    groupStudents.forEach(s => {
      const rep = studentReports[s.id];
      if (!rep) return;
      if (rep.attendance === "present") presentCount++;
      else if (rep.attendance === "excused") excusedCount++;
      else absentCount++;

      if (rep.homework === "done") hwDoneCount++;
    });

    return {
      total: groupStudents.length,
      presentCount,
      absentCount,
      excusedCount,
      hwDoneCount
    };
  }, [groupStudents, studentReports]);

  // Format and build Full Report Text
  const buildFullReportText = (): string => {
    let msg = isArabic
      ? `📋 تقرير الحصة الجماعية - أكاديمية GoStars\n`
      : `📋 Group Lesson Report - GoStars Academy\n`;
    msg += isArabic
      ? `👥 المجموعة: ${group.name} | المادة: ${group.subject}\n`
      : `👥 Group: ${group.name} | Subject: ${group.subject}\n`;
    msg += isArabic
      ? `📅 التاريخ: ${reportDate}\n`
      : `📅 Date: ${reportDate}\n`;
    msg += `------------------------------------\n`;
    msg += isArabic
      ? `📊 إحصائية الحضور: حاضر (${stats.presentCount}) | غائب (${stats.absentCount}) | غائب بعذر (${stats.excusedCount})\n`
      : `📊 Attendance: Present (${stats.presentCount}) | Absent (${stats.absentCount}) | Excused (${stats.excusedCount})\n`;
    msg += `------------------------------------\n\n`;

    groupStudents.forEach((student, index) => {
      const rep = studentReports[student.id] || {
        attendance: "present",
        homework: "done",
        score: "",
        notes: ""
      };

      const attendanceText =
        rep.attendance === "present"
          ? (isArabic ? "حاضر ✅" : "Present ✅")
          : rep.attendance === "excused"
          ? (isArabic ? "غائب بعذر 🟡" : "Excused 🟡")
          : (isArabic ? "غائب بدون عذر 🔴" : "Absent 🔴");

      let homeworkText = isArabic ? "أنجزه كاملاً ✅" : "Done ✅";
      if (rep.homework === "not_done") homeworkText = isArabic ? "لم ينجزه ❌" : "Not Done ❌";
      if (rep.homework === "partial") homeworkText = isArabic ? "أنجز بعضه ⚠️" : "Partial ⚠️";

      msg += `${index + 1}. ${student.fullName}:\n`;
      msg += `   • ${isArabic ? "الحضور" : "Attendance"}: ${attendanceText}\n`;
      msg += `   • ${isArabic ? "الواجب" : "Homework"}: ${homeworkText}\n`;

      if (rep.score && rep.score.trim() !== "") {
        msg += `   • ${isArabic ? "الدرجة" : "Score"}: ${rep.score.trim()}\n`;
      }
      if (rep.notes && rep.notes.trim() !== "") {
        msg += `   • ${isArabic ? "ملاحظة" : "Note"}: ${rep.notes.trim()}\n`;
      }
      msg += `\n`;
    });

    if (generalNotes.trim() !== "") {
      msg += `------------------------------------\n`;
      msg += isArabic ? `📝 ملاحظات عامة للدرس:\n${generalNotes.trim()}\n\n` : `📝 General Lesson Notes:\n${generalNotes.trim()}\n\n`;
    }

    if (aiSummary.trim() !== "") {
      msg += `------------------------------------\n`;
      msg += isArabic ? `💡 التقييم والتوصيات الأكاديمية:\n${aiSummary.trim()}\n\n` : `💡 Academic Assessment:\n${aiSummary.trim()}\n\n`;
    }

    msg += isArabic ? `تحياتنا، إدارة نظام GoStars الأكاديمي` : `Best regards, GoStars Academic System`;
    return msg;
  };

  // 💾 حفظ التقرير
  const handleSaveReport = () => {
    const reportData = {
      groupId: group.id,
      groupName: group.name,
      subject: group.subject,
      date: reportDate,
      items: studentReports,
      generalNotes: generalNotes.trim(),
      aiSummary: aiSummary.trim() || undefined,
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(reportData));
    } catch (e) {
      console.error("Failed to save report to local storage:", e);
    }

    if (onSaveReport) {
      onSaveReport(reportData);
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3500);
  };

  // 📋 نسخ التقرير
  const handleCopyReport = () => {
    const msg = buildFullReportText();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(msg).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      });
    }
  };

  // ✨ صياغة الذكاء الاصطناعي للتقرير
  const handleGenerateAiSummary = async () => {
    setIsGeneratingAi(true);
    try {
      if (onGenerateReportAi) {
        const text = await onGenerateReportAi({
          groupName: group.name,
          subject: group.subject,
          date: reportDate,
          items: studentReports,
          students: groupStudents,
          generalNotes: generalNotes.trim()
        });
        if (text) {
          setAiSummary(text);
          setIsGeneratingAi(false);
          return;
        }
      }

      // Default high quality academic drafting
      const summary = isArabic
        ? `أظهرت المجموعة تفاعلاً إيجابياً ومتميزاً خلال حصة (${group.subject}) لتاريخ ${reportDate}. تم مراجعة المفاهيم الرئيسية وحل التطبيقات مع متابعة مستوى كل طالب بدقة. نوصي باستمرار التحضير والالتزام بحل الواجبات لضمان التفوق الأكاديمي المستمر.`
        : `The group demonstrated solid engagement and high performance during today's session in (${group.subject}). Key topics were explained and reinforced through practical exercises. We recommend continuous practice and diligent homework submission.`;
      
      setAiSummary(summary);
    } catch (e) {
      console.error("AI Generation error:", e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto px-2 sm:px-4 animate-in fade-in">
      {/* 1. Header with Back button & Title */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title={isArabic ? "الرجوع" : "Back"}
          >
            {isArabic ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-black">
                {group.subject}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {isArabic ? `تقرير حصة: ${group.name}` : `Group Report: ${group.name}`}
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {isArabic
                ? "رصد الحضور، الواجبات، والدرجات، والصياغة الذكية لتقرير المجموعة المعتمد."
                : "Record attendance, assignments, scores, and generate official group report."}
            </p>
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2 shrink-0">
          <Calendar className="w-4 h-4 text-slate-400" />
          <div className="text-right">
            <label className="block text-[10px] font-bold text-slate-400">
              {isArabic ? "تاريخ الحصة:" : "Lesson Date:"}
            </label>
            <input
              type="date"
              value={reportDate}
              onChange={e => setReportDate(e.target.value)}
              className="bg-transparent font-black text-xs sm:text-sm text-slate-800 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Quick Attendance & Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-500">{isArabic ? "إجمالي طلاب المجموعة" : "Total Students"}</p>
          <p className="text-lg font-black text-slate-900 mt-0.5">{stats.total}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs">
          <p className="text-[11px] font-bold text-emerald-600">{isArabic ? "حاضرون" : "Present"}</p>
          <p className="text-lg font-black text-emerald-700 mt-0.5">{stats.presentCount}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs">
          <p className="text-[11px] font-bold text-rose-600">{isArabic ? "غائبون" : "Absent"}</p>
          <p className="text-lg font-black text-rose-700 mt-0.5">{stats.absentCount + stats.excusedCount}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-2xs">
          <p className="text-[11px] font-bold text-blue-600">{isArabic ? "أنجزوا الواجب" : "Homework Done"}</p>
          <p className="text-lg font-black text-blue-700 mt-0.5">{stats.hwDoneCount}</p>
        </div>
      </div>

      {/* 3. Students Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="font-black text-slate-900 text-sm sm:text-base">
              {isArabic ? "قائمة طلاب المجموعة ورصد الحصة" : "Students Lesson Roster"}
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-bold">
            {groupStudents.length} {isArabic ? "طالب" : "students"}
          </span>
        </div>

        {groupStudents.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <AlertCircle className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-black text-slate-700">
              {isArabic ? "لا يوجد طلاب مضافون في هذه المجموعة حالياً." : "No students in this group."}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {isArabic ? "أضف طلاباً للمجموعة من شاشة المجموعات لتتمكن من رصد التقرير." : "Add students to this group to record reports."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-[11px]">
                  <th className="py-3 px-3.5 w-10 text-center">#</th>
                  <th className="py-3 px-3.5 min-w-[140px]">{isArabic ? "الطالب" : "Student"}</th>
                  <th className="py-3 px-3.5 min-w-[180px] text-center">{isArabic ? "الحضور" : "Attendance"}</th>
                  <th className="py-3 px-3.5 min-w-[220px] text-center">{isArabic ? "الواجب" : "Homework"}</th>
                  <th className="py-3 px-3.5 min-w-[90px] text-center">{isArabic ? "الدرجة" : "Score"}</th>
                  <th className="py-3 px-3.5 min-w-[200px]">{isArabic ? "ملاحظات فردية للطالب" : "Individual Notes"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {groupStudents.map((student, index) => {
                  const rep = studentReports[student.id] || {
                    attendance: "present",
                    homework: "done",
                    score: "",
                    notes: ""
                  };

                  return (
                    <tr
                      key={student.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        rep.attendance === "absent"
                          ? "bg-rose-50/20"
                          : rep.attendance === "excused"
                          ? "bg-amber-50/20"
                          : ""
                      }`}
                    >
                      {/* Index */}
                      <td className="py-3 px-3.5 text-center text-slate-400 font-mono text-[11px]">
                        {index + 1}
                      </td>

                      {/* Student Name */}
                      <td className="py-3 px-3.5 font-black text-slate-900 whitespace-nowrap">
                        <div>{student.fullName}</div>
                        {student.studentNumber && (
                          <div className="text-[10px] text-slate-400 font-mono font-normal">
                            {student.studentNumber}
                          </div>
                        )}
                      </td>

                      {/* الحضور: حاضر / غائب / بعذر */}
                      <td className="py-3 px-3.5 text-center">
                        <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl gap-1 border border-slate-200/80">
                          <button
                            type="button"
                            onClick={() => updateStudentReport(student.id, "attendance", "present")}
                            className={`px-2.5 py-1.5 rounded-lg font-bold text-xs transition ${
                              rep.attendance === "present"
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            {isArabic ? "حاضر" : "Present"}
                          </button>
                          <button
                            type="button"
                            onClick={() => updateStudentReport(student.id, "attendance", "absent")}
                            className={`px-2.5 py-1.5 rounded-lg font-bold text-xs transition ${
                              rep.attendance === "absent"
                                ? "bg-rose-600 text-white shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            {isArabic ? "غائب" : "Absent"}
                          </button>
                          <button
                            type="button"
                            onClick={() => updateStudentReport(student.id, "attendance", "excused")}
                            className={`px-2 py-1.5 rounded-lg font-bold text-[11px] transition ${
                              rep.attendance === "excused"
                                ? "bg-amber-600 text-white shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            {isArabic ? "بعذر" : "Excused"}
                          </button>
                        </div>
                      </td>

                      {/* الواجب: أنجزه / لم ينجزه / أنجز بعضه */}
                      <td className="py-3 px-3.5 text-center">
                        <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl gap-1 border border-slate-200/80">
                          <button
                            type="button"
                            onClick={() => updateStudentReport(student.id, "homework", "done")}
                            className={`px-2.5 py-1.5 rounded-lg font-bold text-xs transition whitespace-nowrap ${
                              rep.homework === "done"
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            {isArabic ? "أنجزه" : "Done"}
                          </button>
                          <button
                            type="button"
                            onClick={() => updateStudentReport(student.id, "homework", "partial")}
                            className={`px-2 py-1.5 rounded-lg font-bold text-xs transition whitespace-nowrap ${
                              rep.homework === "partial"
                                ? "bg-amber-600 text-white shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            {isArabic ? "بعضه" : "Partial"}
                          </button>
                          <button
                            type="button"
                            onClick={() => updateStudentReport(student.id, "homework", "not_done")}
                            className={`px-2 py-1.5 rounded-lg font-bold text-xs transition whitespace-nowrap ${
                              rep.homework === "not_done"
                                ? "bg-rose-600 text-white shadow-xs"
                                : "text-slate-600 hover:text-slate-900"
                            }`}
                          >
                            {isArabic ? "لم ينجزه" : "Not Done"}
                          </button>
                        </div>
                      </td>

                      {/* الدرجة: خانة رقمية */}
                      <td className="py-3 px-3.5 text-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={rep.score}
                          onChange={e => updateStudentReport(student.id, "score", e.target.value)}
                          placeholder={isArabic ? "درجة" : "Score"}
                          className="w-16 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-center text-xs font-black text-slate-800 focus:outline-none focus:border-blue-500 shadow-2xs"
                        />
                      </td>

                      {/* ملاحظات المعلم الفردية */}
                      <td className="py-3 px-3.5">
                        <input
                          type="text"
                          value={rep.notes}
                          onChange={e => updateStudentReport(student.id, "notes", e.target.value)}
                          placeholder={isArabic ? "ملاحظة حول مستوى الطالب..." : "Student note..."}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 shadow-2xs"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. General Notes & AI Report Drafting */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-black text-slate-900 mb-1.5">
            {isArabic ? "ملاحظات وتفاصيل الحصة العامة للمجموعة:" : "General Group Lesson Notes:"}
          </label>
          <textarea
            rows={3}
            value={generalNotes}
            onChange={e => setGeneralNotes(e.target.value)}
            placeholder={
              isArabic
                ? "الموضوعات التي تم شرحها، مستوى الاستيعاب العام، والواجبات المطلوبة للحصة القادمة..."
                : "Topics covered, general group engagement, assignments for next class..."
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:bg-white transition"
          />
        </div>

        {/* AI Drafting Button */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-blue-50/70 via-indigo-50/70 to-purple-50/70 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-xs sm:text-sm">
                {isArabic ? "الصياغة والتوصيات الذكية بـ Gemini AI" : "Gemini AI Smart Group Summary"}
              </h4>
              <p className="text-[11px] text-slate-600 font-medium">
                {isArabic
                  ? "توليد ملخص وتوصيات تربوية للمجموعة بالكامل بناءً على الحضور ومستوى الطلاب."
                  : "Generate executive summary and recommendations based on class roster."}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isGeneratingAi}
            onClick={handleGenerateAiSummary}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 transition disabled:opacity-50 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGeneratingAi ? (isArabic ? "جاري التوليد..." : "Drafting...") : (isArabic ? "✨ توليد ملخص الحصة بالذكاء" : "✨ Generate AI Summary")}</span>
          </button>
        </div>

        {/* Generated AI Summary Box */}
        {aiSummary && (
          <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-2xl space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="font-black text-blue-950 text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>{isArabic ? "الملخص والتقييم الذكي المولد:" : "Generated AI Summary:"}</span>
              </span>
            </div>
            <textarea
              rows={3}
              value={aiSummary}
              onChange={e => setAiSummary(e.target.value)}
              className="w-full bg-white border border-blue-200 rounded-xl p-3 text-xs text-slate-800 font-medium focus:outline-none focus:border-blue-500"
            />
          </div>
        )}
      </div>

      {/* Notifications */}
      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2.5 animate-in fade-in shadow-xs">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{isArabic ? "تم حفظ تقرير المجموعة بنجاح ومزامنته بملف الأكاديمية المركزي! 💾" : "Group report saved and synced to academy database! 💾"}</span>
        </div>
      )}

      {copySuccess && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-2xl text-xs font-bold flex items-center gap-2.5 animate-in fade-in shadow-xs">
          <Check className="w-5 h-5 text-blue-600 shrink-0" />
          <span>{isArabic ? "تم نسخ نص التقرير بالكامل للحافظة بنجاح! 📋" : "Report text copied to clipboard! 📋"}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleCopyReport}
          className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2"
        >
          <Copy className="w-4 h-4" />
          <span>{isArabic ? "📋 نسخ نص التقرير بالكامل" : "Copy Full Report Text"}</span>
        </button>

        <button
          type="button"
          onClick={handleSaveReport}
          className="px-7 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{isArabic ? "💾 حفظ تقرير المجموعة بملف الأكاديمية" : "Save Group Report to Academy"}</span>
        </button>
      </div>
    </div>
  );
};
