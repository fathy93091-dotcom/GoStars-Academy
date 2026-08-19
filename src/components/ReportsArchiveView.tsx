import React, { useState, useMemo } from "react";
import {
  FileText,
  Search,
  Filter,
  Calendar,
  Sparkles,
  Copy,
  Check,
  Eye,
  Trash2,
  Archive,
  RotateCcw,
  Printer,
  X,
  UserPlus,
  Users,
  GraduationCap,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpDown,
  LayoutGrid,
  List,
  Layers,
  Award
} from "lucide-react";
import {
  AppSettings,
  Student,
  Group,
  GeneratedReport,
  AttendanceStatus,
  HomeworkStatus
} from "../types";

interface ReportsArchiveViewProps {
  settings: AppSettings;
  students: Student[];
  groups: Group[];
  reports: GeneratedReport[];
  isArabic?: boolean;
  onOpenPersonalReport: (student: Student) => void;
  onOpenGroupReport: (group: Group) => void;
  onDeleteReport: (reportId: string) => void;
  onToggleArchiveReport?: (reportId: string) => void;
}

export const ReportsArchiveView: React.FC<ReportsArchiveViewProps> = ({
  settings,
  students,
  groups,
  reports,
  isArabic = true,
  onOpenPersonalReport,
  onOpenGroupReport,
  onDeleteReport,
  onToggleArchiveReport
}) => {
  // State for Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedType, setSelectedType] = useState<"all" | "individual" | "group">("all");
  const [selectedAttendance, setSelectedAttendance] = useState<"all" | AttendanceStatus>("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState<"all" | "today" | "week" | "month" | "custom">("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [archiveFilter, setArchiveFilter] = useState<"active" | "archived" | "all">("active");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Selection Modals & Details Modal
  const [showStudentSelector, setShowStudentSelector] = useState(false);
  const [showGroupSelector, setShowGroupSelector] = useState(false);
  const [selectorSearch, setSelectorSearch] = useState("");
  const [selectedReportForView, setSelectedReportForView] = useState<GeneratedReport | null>(null);

  // Toast / Feedback State
  const [copiedReportId, setCopiedReportId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string>("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // 6 months check helper
  const isReportOlderThan6Months = (dateStr: string): boolean => {
    if (!dateStr) return false;
    const rDate = new Date(dateStr);
    if (isNaN(rDate.getTime())) return false;
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    return rDate < sixMonthsAgo;
  };

  // Extract unique subjects
  const allSubjects = useMemo(() => {
    const subs = new Set<string>();
    reports.forEach(r => {
      if (r.subject && r.subject.trim()) subs.add(r.subject.trim());
    });
    students.forEach(s => {
      if (s.subject && s.subject.trim()) subs.add(s.subject.trim());
      s.subjects?.forEach(sub => {
        if (sub.subject && sub.subject.trim()) subs.add(sub.subject.trim());
      });
    });
    groups.forEach(g => {
      if (g.subject && g.subject.trim()) subs.add(g.subject.trim());
    });
    return Array.from(subs);
  }, [reports, students, groups]);

  // Filter Reports
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      // 1. Archive status
      const isArchived = report.archived === true || (report.archived !== false && isReportOlderThan6Months(report.date));
      if (archiveFilter === "active" && isArchived) return false;
      if (archiveFilter === "archived" && !isArchived) return false;

      // 2. Report Type (individual vs group)
      const reportType = report.reportType || (report.groupId ? "group" : "individual");
      if (selectedType !== "all" && reportType !== selectedType) return false;

      // 3. Subject filter
      if (selectedSubject !== "all" && (report.subject || "").trim().toLowerCase() !== selectedSubject.trim().toLowerCase()) {
        return false;
      }

      // 4. Attendance filter
      if (selectedAttendance !== "all" && report.attendance !== selectedAttendance) {
        return false;
      }

      // 5. Time Range filter
      if (selectedTimeRange !== "all") {
        const repDate = new Date(report.date);
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        if (selectedTimeRange === "today") {
          const todayStr = new Date().toISOString().split("T")[0];
          if (report.date !== todayStr) return false;
        } else if (selectedTimeRange === "week") {
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          if (repDate < weekAgo) return false;
        } else if (selectedTimeRange === "month") {
          const monthAgo = new Date();
          monthAgo.setMonth(now.getMonth() - 1);
          if (repDate < monthAgo) return false;
        } else if (selectedTimeRange === "custom") {
          if (customStartDate && new Date(report.date) < new Date(customStartDate)) return false;
          if (customEndDate && new Date(report.date) > new Date(customEndDate)) return false;
        }
      }

      // 6. Text Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const studentNameMatch = (report.studentName || "").toLowerCase().includes(q);
        const groupNameMatch = (report.groupName || "").toLowerCase().includes(q);
        const subjectMatch = (report.subject || "").toLowerCase().includes(q);
        const textMatch = (report.reportText || report.generatedText || "").toLowerCase().includes(q);
        const notesMatch = (report.teacherNotes || "").toLowerCase().includes(q);
        const dateMatch = (report.date || "").toLowerCase().includes(q);

        if (!studentNameMatch && !groupNameMatch && !subjectMatch && !textMatch && !notesMatch && !dateMatch) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [reports, archiveFilter, selectedType, selectedSubject, selectedAttendance, selectedTimeRange, customStartDate, customEndDate, searchQuery]);

  // KPI Calculations
  const stats = useMemo(() => {
    const total = reports.length;
    const individual = reports.filter(r => (r.reportType || (r.groupId ? "group" : "individual")) === "individual").length;
    const group = reports.filter(r => (r.reportType || (r.groupId ? "group" : "individual")) === "group").length;
    const present = reports.filter(r => r.attendance === "present").length;
    const absent = reports.filter(r => r.attendance === "absent").length;
    const archivedCount = reports.filter(r => r.archived === true || (r.archived !== false && isReportOlderThan6Months(r.date))).length;

    return { total, individual, group, present, absent, archivedCount };
  }, [reports]);

  // Copy helper
  const handleCopyReportText = (report: GeneratedReport) => {
    const textToCopy = report.reportText || report.generatedText || report.teacherNotes || "";
    if (!textToCopy) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        setCopiedReportId(report.id);
        showToast(isArabic ? "تم نسخ نص التقرير للحافظة بنجاح! 📋" : "Report copied to clipboard! 📋");
        setTimeout(() => setCopiedReportId(null), 3000);
      });
    }
  };

  // Helper to find student code or group info
  const getStudentCode = (studentId: string): string => {
    const st = students.find(s => s.id === studentId);
    if (st && st.studentNumber) return st.studentNumber;
    return studentId ? `STU-${studentId.slice(-4)}` : "";
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in max-w-[1700px] mx-auto px-2 sm:px-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white border border-slate-700 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-bold text-xs sm:text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner & Quick Actions */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Title & Description */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {isArabic ? "أرشيف وسجل التقارير المركزي" : "Central Reports Archive"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-black text-xs">
                  {reports.length} {isArabic ? "تقرير مسجل" : "reports"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                {isArabic
                  ? "إدارة وتوثيق تقارير الحصص الفردية والجماعية، المتابعة الأكاديمية، والبحث الشامل في سجلات الطلاب."
                  : "Central repository for student & group lesson reports, academic feedback, and past records."}
              </p>
            </div>
          </div>

          {/* Action Buttons: New Personal / New Group */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              type="button"
              onClick={() => {
                setSelectorSearch("");
                setShowStudentSelector(true);
              }}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md shadow-purple-600/25"
            >
              <GraduationCap className="w-4 h-4" />
              <span>{isArabic ? "➕ تقرير شخصي لطالب" : "➕ Personal Student Report"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectorSearch("");
                setShowGroupSelector(true);
              }}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md shadow-blue-600/25"
            >
              <Users className="w-4 h-4" />
              <span>{isArabic ? "➕ تقرير مجموعة دراسية" : "➕ Group Lesson Report"}</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Stats Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <p className="text-[11px] font-bold text-slate-500">{isArabic ? "إجمالي التقارير" : "Total Reports"}</p>
            <p className="text-xl font-black text-slate-900 mt-1">{stats.total}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-200/80">
            <p className="text-[11px] font-bold text-purple-700">{isArabic ? "تقارير فردية" : "Individual"}</p>
            <p className="text-xl font-black text-purple-900 mt-1">{stats.individual}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200/80">
            <p className="text-[11px] font-bold text-blue-700">{isArabic ? "تقارير مجموعات" : "Group"}</p>
            <p className="text-xl font-black text-blue-900 mt-1">{stats.group}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
            <p className="text-[11px] font-bold text-emerald-700">{isArabic ? "حضور مؤكد" : "Present"}</p>
            <p className="text-xl font-black text-emerald-900 mt-1">{stats.present}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200/80">
            <p className="text-[11px] font-bold text-rose-700">{isArabic ? "غياب مرصود" : "Absent"}</p>
            <p className="text-xl font-black text-rose-900 mt-1">{stats.absent}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
            <p className="text-[11px] font-bold text-amber-800">{isArabic ? "الأرشيف (>6 أشهر)" : "Archived"}</p>
            <p className="text-xl font-black text-amber-950 mt-1">{stats.archivedCount}</p>
          </div>
        </div>
      </div>

      {/* Search, Filter Toolbar & View Mode */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
        {/* Main Search Input & View Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={
                isArabic
                  ? "بحث باسم الطالب، اسم المجموعة، المادة، التاريخ، أو كلمة في التقرير..."
                  : "Search student, group, subject, notes, or date..."
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pr-10 pl-9 py-2.5 text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-purple-500 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Mode (Grid vs List) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === "grid"
                  ? "bg-white text-purple-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title={isArabic ? "عرض البطاقات" : "Grid View"}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden md:inline">{isArabic ? "بطاقات" : "Grid"}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === "table"
                  ? "bg-white text-purple-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title={isArabic ? "عرض الجدول" : "Table View"}
            >
              <List className="w-4 h-4" />
              <span className="hidden md:inline">{isArabic ? "جدول" : "Table"}</span>
            </button>
          </div>
        </div>

        {/* Multi-Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-2 border-t border-slate-100 text-xs">
          {/* 1. Archive Status */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-600 text-[11px]">
              {isArabic ? "حالة الأرشفة:" : "Archive Status:"}
            </label>
            <select
              value={archiveFilter}
              onChange={e => setArchiveFilter(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold focus:outline-none focus:border-purple-500"
            >
              <option value="active">{isArabic ? "⚡ التقارير النشطة (<6 أشهر)" : "Active Reports"}</option>
              <option value="archived">{isArabic ? "🗄️ المؤرشفة (سابق)" : "Archived"}</option>
              <option value="all">{isArabic ? "🌐 كافة التقارير (الكل)" : "All Reports"}</option>
            </select>
          </div>

          {/* 2. Report Type */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-600 text-[11px]">
              {isArabic ? "نوع التقرير:" : "Report Type:"}
            </label>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold focus:outline-none focus:border-purple-500"
            >
              <option value="all">{isArabic ? "الكل (فردي ومجموعات)" : "All Types"}</option>
              <option value="individual">{isArabic ? "👤 تقرير شخصي لطالب" : "Individual Report"}</option>
              <option value="group">{isArabic ? "👥 تقرير مجموعة دراسية" : "Group Report"}</option>
            </select>
          </div>

          {/* 3. Subject Filter */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-600 text-[11px]">
              {isArabic ? "المادة الدراسية:" : "Subject:"}
            </label>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold focus:outline-none focus:border-purple-500"
            >
              <option value="all">{isArabic ? "كافة المواد" : "All Subjects"}</option>
              {allSubjects.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* 4. Attendance Filter */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-600 text-[11px]">
              {isArabic ? "حالة الحضور:" : "Attendance:"}
            </label>
            <select
              value={selectedAttendance}
              onChange={e => setSelectedAttendance(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold focus:outline-none focus:border-purple-500"
            >
              <option value="all">{isArabic ? "الكل (حاضر وغائب)" : "All Statuses"}</option>
              <option value="present">{isArabic ? "🟢 حاضر" : "Present"}</option>
              <option value="absent">{isArabic ? "🔴 غائب" : "Absent"}</option>
            </select>
          </div>

          {/* 5. Date Range Filter */}
          <div className="space-y-1">
            <label className="block font-bold text-slate-600 text-[11px]">
              {isArabic ? "الفترة الزمنية:" : "Time Range:"}
            </label>
            <select
              value={selectedTimeRange}
              onChange={e => setSelectedTimeRange(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold focus:outline-none focus:border-purple-500"
            >
              <option value="all">{isArabic ? "كافة الفترات" : "All Time"}</option>
              <option value="today">{isArabic ? "📅 تقارير اليوم" : "Today"}</option>
              <option value="week">{isArabic ? "🗓️ آخر 7 أيام" : "Last 7 Days"}</option>
              <option value="month">{isArabic ? "📆 هذا الشهر" : "This Month"}</option>
              <option value="custom">{isArabic ? "⚙️ فترة مخصصة..." : "Custom Range..."}</option>
            </select>
          </div>
        </div>

        {/* Custom Date Range Inputs */}
        {selectedTimeRange === "custom" && (
          <div className="p-3 bg-purple-50/50 border border-purple-200 rounded-2xl flex flex-wrap items-center gap-3 text-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="font-bold text-purple-900">{isArabic ? "من تاريخ:" : "From:"}</span>
              <input
                type="date"
                value={customStartDate}
                onChange={e => setCustomStartDate(e.target.value)}
                className="bg-white border border-purple-300 rounded-xl px-3 py-1.5 font-bold text-slate-800 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold text-purple-900">{isArabic ? "إلى تاريخ:" : "To:"}</span>
              <input
                type="date"
                value={customEndDate}
                onChange={e => setCustomEndDate(e.target.value)}
                className="bg-white border border-purple-300 rounded-xl px-3 py-1.5 font-bold text-slate-800 focus:outline-none"
              />
            </div>

            {(customStartDate || customEndDate) && (
              <button
                type="button"
                onClick={() => {
                  setCustomStartDate("");
                  setCustomEndDate("");
                }}
                className="px-2.5 py-1 text-[11px] font-bold text-purple-700 hover:text-rose-600 bg-white rounded-lg border border-purple-200"
              >
                {isArabic ? "إعادة ضبط التواريخ" : "Reset"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Reports Listing: Cards Grid or Table View */}
      {filteredReports.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-base font-black text-slate-800">
            {isArabic ? "لا توجد تقارير مطابقة للمعايير المحددة" : "No matching reports found"}
          </h3>
          <p className="text-xs text-slate-500 font-medium max-w-md mx-auto mt-1">
            {isArabic
              ? "جرّب تغيير فلاتر البحث أو إنشاء تقرير جديد للطالب أو المجموعة الدراسية."
              : "Try adjusting search or filters, or create a new lesson report."}
          </p>
          <div className="flex items-center justify-center gap-2.5 mt-5">
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedSubject("all");
                setSelectedType("all");
                setSelectedAttendance("all");
                setSelectedTimeRange("all");
                setArchiveFilter("all");
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            >
              {isArabic ? "إعادة ضبط الفلاتر" : "Reset Filters"}
            </button>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map(report => {
            const isGroup = (report.reportType || (report.groupId ? "group" : "individual")) === "group";
            const reportText = report.reportText || report.generatedText || report.teacherNotes || "";
            const isArchived = report.archived === true || (report.archived !== false && isReportOlderThan6Months(report.date));

            return (
              <div
                key={report.id}
                className={`bg-white border rounded-3xl p-4 sm:p-5 shadow-xs transition hover:shadow-md flex flex-col justify-between ${
                  isArchived ? "border-slate-200/80 bg-slate-50/40" : "border-slate-200"
                }`}
              >
                <div>
                  {/* Top Bar: Badges & Date */}
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-black flex items-center gap-1 ${
                          isGroup
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : "bg-purple-100 text-purple-800 border border-purple-200"
                        }`}
                      >
                        {isGroup ? <Users className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
                        <span>{isGroup ? (isArabic ? "مجموعة" : "Group") : (isArabic ? "فردي" : "Personal")}</span>
                      </span>

                      {report.lessonNumber && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black">
                          #{report.lessonNumber}
                        </span>
                      )}

                      {/* Attendance Badge */}
                      {report.attendance === "present" ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {isArabic ? "حاضر ✅" : "Present"}
                        </span>
                      ) : report.attendance === "absent" ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                          {report.deductCost ? (isArabic ? "غائب (مخصوم) 🔴" : "Absent") : (isArabic ? "غائب بعذر 🟡" : "Excused")}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-1 text-slate-400 text-[11px] font-mono shrink-0">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{report.date}</span>
                    </div>
                  </div>

                  {/* Student / Group & Subject Info */}
                  <div className="py-3">
                    <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center justify-between">
                      <span className="truncate">{report.studentName || report.groupName || (isArabic ? "تقرير دراسي" : "Report")}</span>
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-purple-700 font-bold flex-wrap">
                      <span className="bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100">{report.subject}</span>
                      {!isGroup && report.studentId && (
                        <span className="text-slate-400 font-mono text-[11px] font-normal">
                          {getStudentCode(report.studentId)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content Preview */}
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-slate-700 leading-relaxed font-sans line-clamp-4">
                    {reportText || (isArabic ? "لا يوجد نص مسجل للتقرير." : "No text content recorded.")}
                  </div>
                </div>

                {/* Bottom Actions Toolbar */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setSelectedReportForView(report)}
                      className="px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs transition flex items-center gap-1"
                      title={isArabic ? "استعراض كامل التقرير والطباعة" : "View & Print"}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isArabic ? "استعراض" : "View"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyReportText(report)}
                      className={`p-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1 ${
                        copiedReportId === report.id
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                      title={isArabic ? "نسخ نص التقرير للحافظة" : "Copy Report Text"}
                    >
                      {copiedReportId === report.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    {onToggleArchiveReport && (
                      <button
                        type="button"
                        onClick={() => onToggleArchiveReport(report.id)}
                        className={`p-1.5 rounded-xl transition ${
                          isArchived
                            ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                            : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        }`}
                        title={isArchived ? (isArabic ? "إلغاء الأرشفة" : "Unarchive") : (isArabic ? "أرشفة التقرير" : "Archive")}
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(isArabic ? "هل أنت متأكد من رغبتك في حذف هذا التقرير نهائياً؟" : "Delete this report permanently?")) {
                          onDeleteReport(report.id);
                          showToast(isArabic ? "تم حذف التقرير بنجاح" : "Report deleted");
                        }
                      }}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title={isArabic ? "حذف التقرير" : "Delete Report"}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE DETAILED VIEW */
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">{isArabic ? "التاريخ / الحصة" : "Date / Lesson"}</th>
                  <th className="py-3 px-4">{isArabic ? "النوع" : "Type"}</th>
                  <th className="py-3 px-4">{isArabic ? "الطالب / المجموعة" : "Student / Group"}</th>
                  <th className="py-3 px-4">{isArabic ? "المادة" : "Subject"}</th>
                  <th className="py-3 px-4">{isArabic ? "حالة الحضور" : "Attendance"}</th>
                  <th className="py-3 px-4">{isArabic ? "موجز التقرير" : "Report Summary"}</th>
                  <th className="py-3 px-4 text-center">{isArabic ? "إجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map(report => {
                  const isGroup = (report.reportType || (report.groupId ? "group" : "individual")) === "group";
                  const reportText = report.reportText || report.generatedText || report.teacherNotes || "";

                  return (
                    <tr key={report.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-700 whitespace-nowrap">
                        <div>{report.date}</div>
                        {report.lessonNumber && (
                          <div className="text-[10px] text-purple-700 font-sans font-bold">#{report.lessonNumber}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            isGroup ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {isGroup ? (isArabic ? "مجموعة" : "Group") : (isArabic ? "فردي" : "Personal")}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-black text-slate-900 whitespace-nowrap">
                        <div>{report.studentName || report.groupName}</div>
                        {!isGroup && report.studentId && (
                          <div className="text-[10px] text-slate-400 font-mono font-normal">
                            {getStudentCode(report.studentId)}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-bold text-purple-800 whitespace-nowrap">
                        {report.subject}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {report.attendance === "present" ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10.5px] font-bold">
                            {isArabic ? "حاضر ✅" : "Present"}
                          </span>
                        ) : report.attendance === "absent" ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10.5px] font-bold">
                            {report.deductCost ? (isArabic ? "غائب (مخصوم) 🔴" : "Absent") : (isArabic ? "غائب بعذر 🟡" : "Excused")}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate font-sans">
                        {reportText}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedReportForView(report)}
                            className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 transition"
                            title={isArabic ? "استعراض كامل" : "View"}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopyReportText(report)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                            title={isArabic ? "نسخ" : "Copy"}
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {onToggleArchiveReport && (
                            <button
                              type="button"
                              onClick={() => onToggleArchiveReport(report.id)}
                              className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-700 transition"
                              title={isArabic ? "أرشفة" : "Archive"}
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(isArabic ? "حذف التقرير نهائياً؟" : "Delete?")) {
                                onDeleteReport(report.id);
                                showToast(isArabic ? "تم حذف التقرير" : "Deleted");
                              }
                            }}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                            title={isArabic ? "حذف" : "Delete"}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* STUDENT SELECTOR MODAL FOR NEW PERSONAL REPORT */}
      {showStudentSelector && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    {isArabic ? "اختيار طالب لإنشاء تقرير شخصي" : "Select Student for Report"}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {isArabic ? "اختر الطالب لفتح صفحة التقرير الفردي المستقلة" : "Select a student to open personal report page"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowStudentSelector(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={selectorSearch}
                onChange={e => setSelectorSearch(e.target.value)}
                placeholder={isArabic ? "بحث باسم الطالب أو الكود أو المادة..." : "Search student..."}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-3 py-2 text-xs text-slate-800 font-bold focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Students List */}
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {students
                .filter(s => {
                  if (!selectorSearch.trim()) return true;
                  const q = selectorSearch.toLowerCase();
                  return (
                    s.fullName.toLowerCase().includes(q) ||
                    (s.subject && s.subject.toLowerCase().includes(q)) ||
                    (s.studentNumber && s.studentNumber.toLowerCase().includes(q))
                  );
                })
                .map(st => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      setShowStudentSelector(false);
                      onOpenPersonalReport(st);
                    }}
                    className="w-full p-3 rounded-2xl border border-slate-200 hover:border-purple-300 bg-slate-50/50 hover:bg-purple-50/40 text-right transition flex items-center justify-between gap-3 group"
                  >
                    <div>
                      <h4 className="font-black text-slate-900 text-xs sm:text-sm group-hover:text-purple-700 transition">
                        {st.fullName}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                        <span className="font-bold text-purple-700">{st.subject}</span>
                        <span>•</span>
                        <span className="font-mono text-slate-600">{st.studentNumber || `STU-${st.id.slice(-4)}`}</span>
                        {st.academicYear && (
                          <>
                            <span>•</span>
                            <span>{st.academicYear}</span>
                          </>
                        )}
                      </p>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 group-hover:border-purple-300 text-xs font-bold text-purple-700 shadow-2xs">
                      {isArabic ? "فتح التقرير 📝" : "Open 📝"}
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* GROUP SELECTOR MODAL FOR NEW GROUP REPORT */}
      {showGroupSelector && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    {isArabic ? "اختيار مجموعة لإنشاء تقرير جماعي" : "Select Group for Report"}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {isArabic ? "اختر المجموعة لفتح صفحة تقرير الحصة الجماعية" : "Select a group to open group report view"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGroupSelector(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Groups List */}
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {groups.map(grp => (
                <button
                  key={grp.id}
                  type="button"
                  onClick={() => {
                    setShowGroupSelector(false);
                    onOpenGroupReport(grp);
                  }}
                  className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-blue-300 bg-slate-50/50 hover:bg-blue-50/40 text-right transition flex items-center justify-between gap-3 group"
                >
                  <div>
                    <h4 className="font-black text-slate-900 text-xs sm:text-sm group-hover:text-blue-700 transition">
                      {grp.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                      <span className="font-bold text-blue-700">{grp.subject}</span>
                      <span>•</span>
                      <span>{grp.studentIds?.length || 0} {isArabic ? "طلاب" : "students"}</span>
                    </p>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 group-hover:border-blue-300 text-xs font-bold text-blue-700 shadow-2xs">
                    {isArabic ? "فتح التقرير 📋" : "Open 📋"}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FULL REPORT DETAILS & PRINT MODAL */}
      {selectedReportForView && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 max-w-2xl w-full shadow-2xl animate-in zoom-in-95 max-h-[92vh] flex flex-col my-4">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base sm:text-lg">
                    {isArabic ? "معاينة التقرير الأكاديمي" : "Academic Report Preview"}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedReportForView.studentName || selectedReportForView.groupName} • {selectedReportForView.subject}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    handleCopyReportText(selectedReportForView);
                  }}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  title={isArabic ? "نسخ نص التقرير" : "Copy"}
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  title={isArabic ? "طباعة التقرير" : "Print"}
                >
                  <Printer className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedReportForView(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Printable Body */}
            <div className="overflow-y-auto py-5 space-y-4 text-xs sm:text-sm font-sans pr-1 print:p-0">
              {/* Meta Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block">{isArabic ? "التاريخ:" : "Date:"}</span>
                  <span className="font-black text-slate-800">{selectedReportForView.date}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">{isArabic ? "رقم الحصة:" : "Lesson #:"}</span>
                  <span className="font-black text-purple-700">#{selectedReportForView.lessonNumber || 1}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">{isArabic ? "حالة الحضور:" : "Attendance:"}</span>
                  <span className="font-black text-slate-800">
                    {selectedReportForView.attendance === "present"
                      ? (isArabic ? "حاضر ✅" : "Present")
                      : (isArabic ? "غائب 🔴" : "Absent")}
                  </span>
                </div>
                {selectedReportForView.homeworkStatus && (
                  <div>
                    <span className="text-slate-400 font-bold block">{isArabic ? "الواجب:" : "Homework:"}</span>
                    <span className="font-black text-slate-800">
                      {selectedReportForView.homeworkStatus === "done"
                        ? (isArabic ? "تم الحل كاملاً ✅" : "Done")
                        : selectedReportForView.homeworkStatus === "not_done"
                        ? (isArabic ? "لم يتم الحل ❌" : "Not Done")
                        : (isArabic ? "جزئي / متأخر ⚠️" : "Partial")}
                    </span>
                  </div>
                )}
              </div>

              {/* Report Full Formatted Text */}
              <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2 leading-relaxed">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>{isArabic ? "نص التقرير الأكاديمي الرسمي:" : "Official Report Content:"}</span>
                </h4>
                <div className="whitespace-pre-wrap text-slate-800 leading-relaxed font-sans text-xs sm:text-sm pt-2 border-t border-slate-100">
                  {selectedReportForView.reportText || selectedReportForView.generatedText || selectedReportForView.teacherNotes}
                </div>
              </div>

              {/* Extra Teacher Raw Notes if available */}
              {selectedReportForView.teacherNotes && selectedReportForView.reportText !== selectedReportForView.teacherNotes && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <span className="text-slate-500 font-bold text-xs block">{isArabic ? "ملاحظات المعلم الأصلية:" : "Teacher Raw Notes:"}</span>
                  <p className="text-slate-700 text-xs">{selectedReportForView.teacherNotes}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedReportForView(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                {isArabic ? "إغلاق" : "Close"}
              </button>

              <button
                type="button"
                onClick={() => handleCopyReportText(selectedReportForView)}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs sm:text-sm shadow-md shadow-purple-600/25 flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                <span>{isArabic ? "📋 نسخ نص التقرير" : "Copy Report"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
