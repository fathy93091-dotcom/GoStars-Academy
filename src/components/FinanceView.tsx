import React, { useState, useMemo } from "react";
import {
  DollarSign,
  TrendingUp,
  Receipt,
  Search,
  Layers,
  Sparkles,
  User,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  FileText,
  CreditCard,
  X,
  History,
  Check,
  Share2,
  LayoutGrid,
  List,
  Printer,
  Trash2,
  Filter,
  Download,
  Copy,
  ExternalLink,
  Building,
  GraduationCap,
  Calendar,
  Wallet
} from "lucide-react";
import { Student, PaymentTransaction, AppSettings, AttendanceRecord, Group } from "../types";
import {
  calculateStudentFinancialProfile,
  buildCentralTransactionsLog,
  StudentFinancialProfile,
  FinancialStatusType,
  CentralTransactionItem
} from "../lib/financeEngine";

interface FinanceViewProps {
  settings: AppSettings;
  students: Student[];
  groups?: Group[];
  attendanceRecords?: AttendanceRecord[];
  paymentTransactions: PaymentTransaction[];
  onRecordPayment: (
    studentId: string,
    amount: number,
    notes?: string,
    date?: string,
    paymentMethod?: string
  ) => void;
  onDeletePayment?: (txId: string) => void;
}

const PAYMENT_METHODS = [
  { id: "cash", labelAr: "كاش (نقدي)", labelEn: "Cash" },
  { id: "vodafone_cash", labelAr: "فودافون كاش", labelEn: "Vodafone Cash" },
  { id: "instapay", labelAr: "إنستاباي (InstaPay)", labelEn: "InstaPay" },
  { id: "bank_transfer", labelAr: "تحويل بنكي", labelEn: "Bank Transfer" },
  { id: "other", labelAr: "أخرى", labelEn: "Other" }
];

export const FinanceView: React.FC<FinanceViewProps> = ({
  settings,
  students,
  groups = [],
  attendanceRecords = [],
  paymentTransactions,
  onRecordPayment,
  onDeletePayment
}) => {
  const isArabic = settings.preferredLanguage === "ar";

  // Navigation Sub-tab: "students" (حسابات الطلاب) | "transactions" (سجل المعاملات المركزي)
  const [mainSection, setMainSection] = useState<"students" | "transactions">("students");
  const [financeLayout, setFinanceLayout] = useState<"grid" | "table">("grid");

  // Filters for Student Accounts
  const [statusFilter, setStatusFilter] = useState<"all" | FinancialStatusType>("all");
  const [groupFilter, setGroupFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filters for Central Transactions
  const [txTypeFilter, setTxTypeFilter] = useState<"all" | "payment" | "lesson_attendance">("all");
  const [txSearchQuery, setTxSearchQuery] = useState("");

  // Modals State
  // 1. Record Payment Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [amount, setAmount] = useState<number>(100);
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [paymentMethod, setPaymentMethod] = useState<string>("كاش (نقدي)");
  const [paymentNotes, setPaymentNotes] = useState<string>("");

  // 2. Student Statement Modal (كشف حساب الطالب)
  const [statementModalProfile, setStatementModalProfile] = useState<StudentFinancialProfile | null>(null);

  // 3. Receipt Voucher Modal (إيصال استلام نقدية)
  const [receiptVoucherTx, setReceiptVoucherTx] = useState<PaymentTransaction | null>(null);

  // 4. Delete Transaction Confirmation
  const [deletingTxId, setDeletingTxId] = useState<string | null>(null);

  // 5. Toast Feedback State
  const [copyToast, setCopyToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setCopyToast(msg);
    setTimeout(() => setCopyToast(null), 3000);
  };

  // Compute all profiles
  const allProfiles = useMemo(() => {
    return students
      .filter(s => s.status === "active")
      .map(s => calculateStudentFinancialProfile(s, attendanceRecords, paymentTransactions));
  }, [students, attendanceRecords, paymentTransactions]);

  // KPIs
  const currentMonthStr = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  }, []);

  // 1. إيرادات الشهر الحالي
  const monthRevenue = useMemo(() => {
    return paymentTransactions
      .filter(pt => pt.date && pt.date.startsWith(currentMonthStr))
      .reduce((sum, pt) => sum + Number(pt.amount || 0), 0);
  }, [paymentTransactions, currentMonthStr]);

  // Total All-Time Revenue
  const totalRevenue = useMemo(() => {
    return paymentTransactions.reduce((sum, pt) => sum + Number(pt.amount || 0), 0);
  }, [paymentTransactions]);

  // 2. إجمالي تكلفة الحصص المنفذة
  const totalAttendedCost = useMemo(() => {
    return allProfiles.reduce((sum, p) => sum + p.attendedLessonsCost, 0);
  }, [allProfiles]);

  // 3. إجمالي المستحقات المطلوبة
  const totalAmountDue = useMemo(() => {
    return allProfiles.reduce((sum, p) => sum + p.amountDue, 0);
  }, [allProfiles]);

  // 4. إجمالي الأرصدة المتبقية الفائضة
  const totalCreditRemaining = useMemo(() => {
    return allProfiles.reduce((sum, p) => sum + p.creditRemaining, 0);
  }, [allProfiles]);

  // 5. إجمالي الحصص المنفذة
  const totalAttendedCount = useMemo(() => {
    return allProfiles.reduce((sum, p) => sum + p.attendedLessonsCount, 0);
  }, [allProfiles]);

  // Count by Status
  const dueCount = useMemo(() => allProfiles.filter(p => p.amountDue > 0).length, [allProfiles]);
  const creditCount = useMemo(() => allProfiles.filter(p => p.creditRemaining > 0).length, [allProfiles]);
  const settledCount = useMemo(() => allProfiles.filter(p => p.status.type === "settled").length, [allProfiles]);

  // Filtered Profiles
  const filteredProfiles = useMemo(() => {
    return allProfiles.filter(p => {
      // 1. Status Filter
      if (statusFilter !== "all" && p.status.type !== statusFilter) {
        return false;
      }

      // 2. Group / Study Type Filter
      if (groupFilter === "private") {
        if (p.student.studyType !== "private") return false;
      } else if (groupFilter !== "all") {
        if (p.student.groupId !== groupFilter) return false;
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = p.fullName.toLowerCase().includes(q);
        const subjMatch = (p.subjectName || "").toLowerCase().includes(q);
        const codeMatch = (p.student.studentNumber || "").toLowerCase().includes(q);
        const groupMatch = (p.student.groupName || "").toLowerCase().includes(q);
        if (!nameMatch && !subjMatch && !codeMatch && !groupMatch) return false;
      }

      return true;
    });
  }, [allProfiles, statusFilter, groupFilter, searchQuery]);

  // Central Transactions Log
  const centralTransactions = useMemo(() => {
    const list = buildCentralTransactionsLog(paymentTransactions, attendanceRecords, students);
    return list.filter(item => {
      if (txTypeFilter !== "all" && item.type !== txTypeFilter) return false;
      if (txSearchQuery.trim()) {
        const q = txSearchQuery.toLowerCase().trim();
        const matchName = item.studentName.toLowerCase().includes(q);
        const matchSubj = (item.subjectName || "").toLowerCase().includes(q);
        const matchNotes = (item.notes || "").toLowerCase().includes(q);
        const matchReceipt = (item.receiptNumber || item.id || "").toLowerCase().includes(q);
        if (!matchName && !matchSubj && !matchNotes && !matchReceipt) return false;
      }
      return true;
    });
  }, [paymentTransactions, attendanceRecords, students, txTypeFilter, txSearchQuery]);

  // Handle open payment modal for a specific student or generic
  const handleOpenPaymentModal = (profile?: StudentFinancialProfile) => {
    if (profile) {
      setSelectedStudentId(profile.studentId);
      // If there's an amount due, pre-fill it; otherwise default to lessonCost or 100
      setAmount(profile.amountDue > 0 ? profile.amountDue : profile.lessonCost || 100);
    } else {
      setSelectedStudentId(students[0]?.id || "");
      setAmount(100);
    }
    setPaymentDate(new Date().toISOString().split("T")[0]);
    setPaymentMethod(isArabic ? "كاش (نقدي)" : "Cash");
    setPaymentNotes("");
    setIsPaymentModalOpen(true);
  };

  // Submit payment
  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || amount <= 0) return;

    const fullNotes = paymentMethod
      ? `[${paymentMethod}] ${paymentNotes}`.trim()
      : paymentNotes;

    onRecordPayment(
      selectedStudentId,
      amount,
      fullNotes,
      paymentDate,
      paymentMethod
    );

    setIsPaymentModalOpen(false);
    showToast(isArabic ? "تم تسجيل الدفعة وتحديث الحساب بنجاح" : "Payment recorded successfully");
  };

  // Confirm delete payment
  const handleConfirmDeletePayment = () => {
    if (!deletingTxId || !onDeletePayment) return;
    onDeletePayment(deletingTxId);
    setDeletingTxId(null);
    showToast(isArabic ? "تم حذف المعاملة وتعديل رصيد الطالب" : "Transaction deleted successfully");
  };

  // Copy statement text
  const handleCopyStatement = (profile: StudentFinancialProfile) => {
    const text = `📋 كشف حساب الطالب: ${profile.fullName}
المادة: ${profile.subjectName} | ${profile.studyTypeLabel}
سعر الحصة: ${profile.lessonCost} ج.م
----------------------------------
الحصص المنفذة: ${profile.attendedLessonsCount} حصة (${profile.attendedLessonsCost} ج.م)
إجمالي المسدد: ${profile.totalPaidAmount} ج.م
${profile.amountDue > 0 ? `المبلغ المستحق: ${profile.amountDue} ج.م` : `الرصيد المتبقي: +${profile.creditRemaining} ج.م`}
----------------------------------
منصة GoStars Academy التعليمية`;

    navigator.clipboard.writeText(text).then(() => {
      showToast(isArabic ? "تم نسخ كشف الحساب إلى الحافظة" : "Statement copied to clipboard");
    });
  };

  // Print single statement
  const handlePrintStatement = () => {
    window.print();
  };

  // Find active student for payment modal info
  const modalSelectedStudentProfile = useMemo(() => {
    if (!selectedStudentId) return null;
    return allProfiles.find(p => p.studentId === selectedStudentId) || null;
  }, [selectedStudentId, allProfiles]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 text-slate-800">
      {/* Toast Notification */}
      {copyToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2.5 animate-in slide-in-from-bottom-5 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{copyToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-5 sm:p-6 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10 space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                {isArabic ? "النظام المالي والحسابات البسيطة" : "Finance & Accounting Ledger"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                {isArabic
                  ? "إدارة مالية شفافة: تسجيل المقبوضات الفعلية واحتساب المستحقات آلياً من سجل الحضور (القاعدة 13)."
                  : "Transparent accounting: direct payment tracking and automated lesson deduction."}
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2.5 flex-wrap">
          {/* Quick Record Payment Button */}
          <button
            type="button"
            onClick={() => handleOpenPaymentModal()}
            className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{isArabic ? "تسجيل دفعة مالية جديدة" : "Record New Payment"}</span>
          </button>

          {/* Print Summary Report */}
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3.5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition flex items-center gap-1.5 backdrop-blur-md border border-white/10 active:scale-95"
            title={isArabic ? "طباعة تقرير الحسابات" : "Print Finance Report"}
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">{isArabic ? "طباعة التقرير" : "Print Report"}</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. المحصل هذا الشهر */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-slate-500">
              {isArabic ? "المحصل هذا الشهر" : "Collected This Month"}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-slate-900">{monthRevenue}</span>
            <span className="text-xs font-bold text-slate-400">{isArabic ? "ج.م" : "EGP"}</span>
          </div>
          <p className="text-[10.5px] text-slate-400 mt-1 font-medium">
            {isArabic ? `إجمالي العام: ${totalRevenue} ج.م` : `All-time: ${totalRevenue} EGP`}
          </p>
        </div>

        {/* 2. قيمة الحصص المنفذة */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-slate-500">
              {isArabic ? "قيمة الحصص المنفذة" : "Attended Lessons Cost"}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-blue-700">{totalAttendedCost}</span>
            <span className="text-xs font-bold text-slate-400">{isArabic ? "ج.م" : "EGP"}</span>
          </div>
          <p className="text-[10.5px] text-slate-400 mt-1 font-medium">
            {isArabic ? `${totalAttendedCount} حصة حضور مسجلة` : `${totalAttendedCount} lessons attended`}
          </p>
        </div>

        {/* 3. إجمالي المستحقات (مديونيات) */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-rose-200/80 shadow-2xs relative overflow-hidden bg-rose-50/20">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-rose-700">
              {isArabic ? "المستحقات المطلوبة" : "Total Due (Debt)"}
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-rose-600">{totalAmountDue}</span>
            <span className="text-xs font-bold text-rose-400">{isArabic ? "ج.م" : "EGP"}</span>
          </div>
          <p className="text-[10.5px] text-rose-600/80 mt-1 font-medium">
            {isArabic ? `على ${dueCount} طالب` : `from ${dueCount} students`}
          </p>
        </div>

        {/* 4. الأرصدة المتبقية الفائضة */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-emerald-200/80 shadow-2xs relative overflow-hidden bg-emerald-50/20">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-emerald-700">
              {isArabic ? "الأرصدة الفائضة للطلاب" : "Prepaid Surplus"}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black text-emerald-600">+{totalCreditRemaining}</span>
            <span className="text-xs font-bold text-emerald-400">{isArabic ? "ج.م" : "EGP"}</span>
          </div>
          <p className="text-[10.5px] text-emerald-600/80 mt-1 font-medium">
            {isArabic ? `لدى ${creditCount} طالب` : `held by ${creditCount} students`}
          </p>
        </div>
      </div>

      {/* Main Section Switcher Tabs */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3 flex-wrap">
        <div className="flex items-center gap-2 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => setMainSection("students")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 cursor-pointer ${
              mainSection === "students"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <User className="w-4 h-4 text-blue-600" />
            <span>{isArabic ? "حسابات الطلاب والمجموعات" : "Student Accounts"}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black">
              {filteredProfiles.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMainSection("transactions")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition flex items-center gap-2 cursor-pointer ${
              mainSection === "transactions"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Receipt className="w-4 h-4 text-emerald-600" />
            <span>{isArabic ? "سجل المعاملات والمدفوعات المركزي" : "Central Ledger"}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black">
              {centralTransactions.length}
            </span>
          </button>
        </div>

        {/* Layout Mode (Only for Students section) */}
        {mainSection === "students" && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setFinanceLayout("grid")}
              className={`p-1.5 rounded-lg transition ${
                financeLayout === "grid" ? "bg-white text-blue-700 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-700"
              }`}
              title={isArabic ? "عرض البطاقات" : "Grid View"}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setFinanceLayout("table")}
              className={`p-1.5 rounded-lg transition ${
                financeLayout === "table" ? "bg-white text-blue-700 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-700"
              }`}
              title={isArabic ? "عرض الجدول" : "Table View"}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* SECTION 1: حسابات الطلاب والمجموعات (Student Accounts) */}
      {mainSection === "students" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Search input */}
              <div className="sm:col-span-6 relative">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={isArabic ? "بحث باسم الطالب، المادة، المجموعة، أو الكود..." : "Search student, subject, group..."}
                  className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-blue-500 text-slate-800"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Group / Type Filter */}
              <div className="sm:col-span-3">
                <select
                  value={groupFilter}
                  onChange={e => setGroupFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">{isArabic ? "جميع المجموعات والدروس" : "All Groups & Private"}</option>
                  <option value="private">{isArabic ? "الدروس الخاصة (فردي)" : "Private Lessons"}</option>
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.subject})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Record Button */}
              <div className="sm:col-span-3">
                <button
                  type="button"
                  onClick={() => handleOpenPaymentModal()}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm rounded-2xl transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isArabic ? "تسجيل دفعة" : "Record Payment"}</span>
                </button>
              </div>
            </div>

            {/* Financial Status Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100 text-xs">
              <span className="text-[11px] font-bold text-slate-400 ml-1">
                {isArabic ? "الحالة المالية:" : "Status:"}
              </span>

              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`px-3 py-1 rounded-xl font-bold transition ${
                  statusFilter === "all"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {isArabic ? `الكل (${allProfiles.length})` : `All (${allProfiles.length})`}
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter("balance_due")}
                className={`px-3 py-1 rounded-xl font-bold transition flex items-center gap-1 ${
                  statusFilter === "balance_due"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/60"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>{isArabic ? `مستحق عليه / مديونية (${dueCount})` : `Due (${dueCount})`}</span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter("available_credit")}
                className={`px-3 py-1 rounded-xl font-bold transition flex items-center gap-1 ${
                  statusFilter === "available_credit"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>{isArabic ? `رصيد متبقي (${creditCount})` : `Credit (${creditCount})`}</span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter("settled")}
                className={`px-3 py-1 rounded-xl font-bold transition flex items-center gap-1 ${
                  statusFilter === "settled"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span>{isArabic ? `خالص بالكامل (${settledCount})` : `Settled (${settledCount})`}</span>
              </button>
            </div>
          </div>

          {/* Empty State */}
          {filteredProfiles.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-2xs space-y-3">
              <Receipt className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-black text-slate-700 text-base">
                {isArabic ? "لم يتم العثور على أي حسابات مطابقة" : "No matching financial profiles found"}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {isArabic
                  ? "جرب تعديل خيارات البحث أو تصفية الحالة المالية لعرض حسابات الطلاب."
                  : "Try clearing search filters or selecting another financial status."}
              </p>
            </div>
          ) : financeLayout === "table" ? (
            /* Table View */
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold">
                    <tr>
                      <th className="py-3.5 px-4">{isArabic ? "الطالب والمادة" : "Student & Subject"}</th>
                      <th className="py-3.5 px-3 text-center">{isArabic ? "سعر الحصة" : "Cost/Lesson"}</th>
                      <th className="py-3.5 px-3 text-center">{isArabic ? "الحصص المنفذة" : "Attended"}</th>
                      <th className="py-3.5 px-3 text-center">{isArabic ? "قيمة الحصص" : "Total Cost"}</th>
                      <th className="py-3.5 px-3 text-center">{isArabic ? "إجمالي المسدد" : "Total Paid"}</th>
                      <th className="py-3.5 px-3 text-center">{isArabic ? "الرصيد / المستحق" : "Balance / Due"}</th>
                      <th className="py-3.5 px-3 text-center">{isArabic ? "الحالة" : "Status"}</th>
                      <th className="py-3.5 px-4 text-center">{isArabic ? "الإجراءات" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredProfiles.map(profile => {
                      const isDue = profile.amountDue > 0;
                      const isCredit = profile.creditRemaining > 0;

                      return (
                        <tr key={profile.studentId} className="hover:bg-slate-50/60 transition">
                          <td className="py-3 px-4">
                            <div className="font-black text-slate-900 text-sm">{profile.fullName}</div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                                {profile.subjectName}
                              </span>
                              <span>•</span>
                              <span>{profile.studyTypeLabel}</span>
                              {profile.student.groupName && (
                                <>
                                  <span>•</span>
                                  <span>{profile.student.groupName}</span>
                                </>
                              )}
                            </div>
                          </td>

                          <td className="py-3 px-3 text-center font-bold text-slate-700">
                            {profile.lessonCost} ج.م
                          </td>

                          <td className="py-3 px-3 text-center">
                            <span className="font-black text-blue-700 bg-blue-50/80 px-2 py-0.5 rounded-lg">
                              {profile.attendedLessonsCount} حصة
                            </span>
                          </td>

                          <td className="py-3 px-3 text-center font-bold text-slate-600">
                            {profile.attendedLessonsCost} ج.م
                          </td>

                          <td className="py-3 px-3 text-center font-black text-emerald-600">
                            {profile.totalPaidAmount} ج.م
                          </td>

                          <td className="py-3 px-3 text-center">
                            <span
                              className={`font-black text-xs px-2.5 py-1 rounded-xl ${
                                isDue
                                  ? "bg-rose-100 text-rose-700"
                                  : isCredit
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {isDue
                                ? `${profile.amountDue} ج.م مستحق`
                                : isCredit
                                ? `+${profile.creditRemaining} ج.م رصيد`
                                : "0 ج.م خالص"}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${profile.status.badgeBg}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${profile.status.dotColor}`}></span>
                              <span>{isArabic ? profile.status.labelAr : profile.status.labelEn}</span>
                            </span>
                          </td>

                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setStatementModalProfile(profile)}
                                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                                title={isArabic ? "كشف حساب مفصل" : "Statement"}
                              >
                                <FileText className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenPaymentModal(profile)}
                                className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition flex items-center gap-1 shadow-2xs active:scale-95 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                <span>{isArabic ? "دفعة" : "Pay"}</span>
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
          ) : (
            /* Grid View (Interactive Cards) */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProfiles.map(profile => {
                const isDue = profile.amountDue > 0;
                const isCredit = profile.creditRemaining > 0;

                return (
                  <div
                    key={profile.studentId}
                    className={`rounded-3xl border transition p-4 sm:p-5 flex flex-col justify-between gap-3 shadow-2xs ${
                      isDue
                        ? "bg-rose-50/20 border-rose-200 hover:border-rose-300"
                        : isCredit
                        ? "bg-emerald-50/20 border-emerald-200 hover:border-emerald-300"
                        : "bg-white border-slate-200/90 hover:border-slate-300"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="space-y-1 min-w-0">
                        <h3 className="font-black text-slate-900 text-sm sm:text-base truncate">
                          {profile.fullName}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
                          <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg text-[11px]">
                            {profile.subjectName}
                          </span>
                          <span>•</span>
                          <span className="text-[11px] font-medium">{profile.studyTypeLabel}</span>
                          {profile.student.groupName && (
                            <>
                              <span>•</span>
                              <span className="text-[11px] font-medium text-slate-600 truncate max-w-[120px]">
                                {profile.student.groupName}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border shrink-0 ${profile.status.badgeBg}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${profile.status.dotColor}`}></span>
                        <span>{isArabic ? profile.status.labelAr : profile.status.labelEn}</span>
                      </span>
                    </div>

                    {/* Financial Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50/90 p-2.5 rounded-2xl border border-slate-100 text-center">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">
                          {isArabic ? "الحصص المنفذة" : "Attended"}
                        </span>
                        <span className="text-xs font-black text-blue-700">
                          {profile.attendedLessonsCount} <span className="text-[10px] font-normal">{isArabic ? "حصة" : "ls"}</span>
                        </span>
                        <span className="text-[9.5px] font-bold text-slate-400 block">
                          ({profile.attendedLessonsCost} ج.م)
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">
                          {isArabic ? "سعر الحصة" : "Lesson Cost"}
                        </span>
                        <span className="text-xs font-black text-slate-800">
                          {profile.lessonCost} <span className="text-[10px] font-normal">{isArabic ? "ج.م" : "EGP"}</span>
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">
                          {isArabic ? "إجمالي المسدد" : "Total Paid"}
                        </span>
                        <span className="text-xs font-black text-emerald-600">
                          {profile.totalPaidAmount} <span className="text-[10px] font-normal">{isArabic ? "ج.م" : "EGP"}</span>
                        </span>
                      </div>
                    </div>

                    {/* Balance Highlight Banner */}
                    <div
                      className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center justify-between ${
                        isDue
                          ? "bg-rose-100/70 border-rose-200 text-rose-800"
                          : isCredit
                          ? "bg-emerald-100/70 border-emerald-200 text-emerald-800"
                          : "bg-slate-100 border-slate-200 text-slate-700"
                      }`}
                    >
                      <span>
                        {isDue
                          ? (isArabic ? "المبلغ المستحق المطلوب:" : "Amount Due:")
                          : isCredit
                          ? (isArabic ? "الرصيد المتبقي له:" : "Prepaid Credit:")
                          : (isArabic ? "حالة الحساب:" : "Status:")}
                      </span>
                      <span className="text-sm font-black">
                        {isDue
                          ? `${profile.amountDue} ج.م`
                          : isCredit
                          ? `+${profile.creditRemaining} ج.م`
                          : "مسدد بالكامل"}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setStatementModalProfile(profile)}
                        className="px-3 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition active:scale-95"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{isArabic ? "كشف حساب" : "Statement"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenPaymentModal(profile)}
                        className={`px-4 py-2 rounded-2xl font-black text-xs text-white shadow-xs transition flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                          isDue
                            ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                            : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isArabic ? "تسجيل دفعة" : "Pay"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: سجل المعاملات والمدفوعات المركزي (Central Ledger) */}
      {mainSection === "transactions" && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-black text-slate-900 text-base sm:text-lg flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                <span>{isArabic ? "سجل المعاملات والمدفوعات المركزي" : "Central Transactions Ledger"}</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {isArabic
                  ? "سجل محاسبي موحد يرصد عمليات التحصيل النقدية وتفاصيل الحصص المنفذة المخصومة."
                  : "Chronological log of all collected payments and attended lessons."}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Type Filter */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setTxTypeFilter("all")}
                  className={`px-3 py-1.5 rounded-xl font-bold transition ${
                    txTypeFilter === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {isArabic ? "الكل" : "All"}
                </button>
                <button
                  type="button"
                  onClick={() => setTxTypeFilter("payment")}
                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 ${
                    txTypeFilter === "payment" ? "bg-emerald-600 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <DollarSign className="w-3 h-3" />
                  <span>{isArabic ? "المدفوعات فقط" : "Payments"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTxTypeFilter("lesson_attendance")}
                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 ${
                    txTypeFilter === "lesson_attendance" ? "bg-blue-600 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>{isArabic ? "الحصص المنفذة" : "Lessons"}</span>
                </button>
              </div>

              {/* Search Bar for Transactions */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={txSearchQuery}
                  onChange={e => setTxSearchQuery(e.target.value)}
                  placeholder={isArabic ? "بحث بالسجل أو الإيصال..." : "Search ledger..."}
                  className="pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 w-40 sm:w-48 text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Transactions List */}
          {centralTransactions.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Receipt className="w-12 h-12 mx-auto opacity-40 text-slate-400" />
              <p className="text-sm font-bold text-slate-600">
                {isArabic ? "لا توجد معاملات مطابقة للسجل حتى الآن." : "No matching transactions found."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 overflow-hidden">
              {centralTransactions.map(item => {
                const isPayment = item.type === "payment";

                // Matching payment transaction for voucher modal
                const originalTx = isPayment
                  ? paymentTransactions.find(pt => pt.id === item.id)
                  : null;

                return (
                  <div
                    key={item.id}
                    className={`py-3.5 px-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition hover:bg-slate-50/80 rounded-2xl ${
                      isPayment ? "bg-emerald-50/15" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold shrink-0 shadow-2xs ${
                          isPayment ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {isPayment ? <DollarSign className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-slate-900 text-sm truncate">{item.studentName}</span>
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                            {item.subjectName}
                          </span>
                          {item.paymentMethod && (
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                              {item.paymentMethod}
                            </span>
                          )}
                          {item.receiptNumber && (
                            <span className="text-[9.5px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                              #{item.receiptNumber}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                          {isArabic ? item.descriptionAr : item.descriptionEn}
                          {item.notes && <span className="text-slate-400"> • {item.notes}</span>}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="text-right sm:text-left">
                        <span
                          className={`font-black text-sm sm:text-base block ${
                            isPayment ? "text-emerald-600" : "text-slate-800"
                          }`}
                        >
                          {isPayment ? `+${item.amount}` : `${item.amount}`} {isArabic ? "ج.م" : "EGP"}
                        </span>
                        <span className="text-[10.5px] text-slate-400 font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{item.date}</span>
                        </span>
                      </div>

                      {/* Transaction Actions */}
                      {isPayment && originalTx && (
                        <div className="flex items-center gap-1.5">
                          {/* View Receipt Voucher */}
                          <button
                            type="button"
                            onClick={() => setReceiptVoucherTx(originalTx)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                            title={isArabic ? "معاينة إيصال الاستلام" : "View Receipt"}
                          >
                            <Receipt className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Payment Button */}
                          {onDeletePayment && (
                            <button
                              type="button"
                              onClick={() => setDeletingTxId(originalTx.id)}
                              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                              title={isArabic ? "حذف المعاملة" : "Delete Transaction"}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= MODAL 1: تسجيل دفعة مالية جديدة ================= */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl animate-in fade-in my-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    {isArabic ? "تسجيل دفعة مالية جديدة" : "Record Payment"}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {isArabic ? "إضافة دفعة مباشرة وتحديث الرصيد فوراً" : "Add direct payment to student ledger"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="space-y-4 text-xs">
              {/* 1. Student Selection */}
              <div>
                <label className="block font-black text-slate-700 mb-1.5">
                  {isArabic ? "اختيار الطالب:" : "Select Student:"}
                </label>
                <select
                  value={selectedStudentId}
                  onChange={e => {
                    const sid = e.target.value;
                    setSelectedStudentId(sid);
                    const prof = allProfiles.find(p => p.studentId === sid);
                    if (prof && prof.amountDue > 0) {
                      setAmount(prof.amountDue);
                    } else if (prof) {
                      setAmount(prof.lessonCost || 100);
                    }
                  }}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                >
                  <option value="" disabled>{isArabic ? "-- اختر الطالب --" : "-- Select student --"}</option>
                  {students
                    .filter(s => s.status === "active")
                    .map(s => (
                      <option key={s.id} value={s.id}>
                        {s.fullName} ({s.subject} - {s.studyType === "group" ? "مجموعة" : "خاص"})
                      </option>
                    ))}
                </select>
              </div>

              {/* Quick Info Box for Selected Student */}
              {modalSelectedStudentProfile && (
                <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between font-bold text-slate-700">
                    <span>{isArabic ? "الحصص المنفذة:" : "Attended:"}</span>
                    <span className="text-blue-800 font-black">
                      {modalSelectedStudentProfile.attendedLessonsCount} حصة ({modalSelectedStudentProfile.attendedLessonsCost} ج.م)
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-slate-700">
                    <span>{isArabic ? "إجمالي المسدد سابقاً:" : "Total Paid Previously:"}</span>
                    <span className="text-emerald-700 font-black">
                      {modalSelectedStudentProfile.totalPaidAmount} ج.م
                    </span>
                  </div>
                  {modalSelectedStudentProfile.amountDue > 0 && (
                    <div className="flex items-center justify-between font-black text-rose-700 pt-1 border-t border-blue-200/50">
                      <span>{isArabic ? "المبلغ المستحق المطلوب:" : "Amount Due:"}</span>
                      <span className="text-xs">{modalSelectedStudentProfile.amountDue} ج.م</span>
                    </div>
                  )}
                </div>
              )}

              {/* 2. Amount Input & Quick Preset Buttons */}
              <div>
                <label className="block font-black text-slate-700 mb-1.5">
                  {isArabic ? "المبلغ المدفوع (بالجنيه المصري):" : "Amount (EGP):"}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="1"
                    value={amount}
                    onChange={e => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2.5 font-black text-lg text-emerald-700 focus:outline-none focus:border-emerald-500 shadow-2xs"
                    placeholder="100"
                  />
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    {isArabic ? "ج.م" : "EGP"}
                  </span>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {[50, 100, 200, 500].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition"
                    >
                      +{val} ج.م
                    </button>
                  ))}
                  {modalSelectedStudentProfile && modalSelectedStudentProfile.amountDue > 0 && (
                    <button
                      type="button"
                      onClick={() => setAmount(modalSelectedStudentProfile.amountDue)}
                      className="px-2.5 py-1 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-black text-[11px] transition"
                    >
                      {isArabic ? `كامل المستحق (${modalSelectedStudentProfile.amountDue} ج.م)` : `Full Due (${modalSelectedStudentProfile.amountDue})`}
                    </button>
                  )}
                </div>
              </div>

              {/* 3. Payment Method */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  {isArabic ? "طريقة الدفع:" : "Payment Method:"}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {PAYMENT_METHODS.map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(isArabic ? m.labelAr : m.labelEn)}
                      className={`p-2 rounded-xl font-bold text-[11px] border text-center transition cursor-pointer ${
                        paymentMethod === (isArabic ? m.labelAr : m.labelEn)
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {isArabic ? m.labelAr : m.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Payment Date */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  {isArabic ? "تاريخ الدفعة:" : "Payment Date:"}
                </label>
                <input
                  type="date"
                  required
                  value={paymentDate}
                  onChange={e => setPaymentDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 font-bold"
                />
              </div>

              {/* 5. Notes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  {isArabic ? "ملاحظات إضافية (اختياري):" : "Notes (Optional):"}
                </label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={e => setPaymentNotes(e.target.value)}
                  placeholder={isArabic ? "رقم التحويل، اسم المستلم، دفعة مقدمة..." : "Reference number, recipient name..."}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-4 py-2 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition"
                >
                  {isArabic ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{isArabic ? "حفظ وتأكيد السداد" : "Confirm Payment"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: كشف حساب مفصل للطالب (Statement Modal) ================= */}
      {statementModalProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full shadow-2xl animate-in fade-in my-6 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 font-black flex items-center justify-center text-sm shadow-2xs">
                  {statementModalProfile.fullName ? statementModalProfile.fullName.charAt(0) : "ط"}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">
                    {isArabic ? `كشف حساب: ${statementModalProfile.fullName}` : `Statement: ${statementModalProfile.fullName}`}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {statementModalProfile.subjectName} • {statementModalProfile.studyTypeLabel}
                    {statementModalProfile.student.groupName && ` • ${statementModalProfile.student.groupName}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleCopyStatement(statementModalProfile)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition"
                  title={isArabic ? "نسخ كشف الحساب" : "Copy Statement"}
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handlePrintStatement}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition"
                  title={isArabic ? "طباعة" : "Print"}
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setStatementModalProfile(null)}
                  className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-200/60 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              {/* Summary Stats Grid */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-center">
                <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block">{isArabic ? "الحصص المنفذة" : "Attended"}</span>
                  <span className="text-sm font-black text-blue-700">{statementModalProfile.attendedLessonsCount}</span>
                  <span className="text-[9.5px] text-slate-400 block">({statementModalProfile.attendedLessonsCost} ج.م)</span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block">{isArabic ? "إجمالي المدفوع" : "Total Paid"}</span>
                  <span className="text-sm font-black text-emerald-600">{statementModalProfile.totalPaidAmount} ج.م</span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block">
                    {statementModalProfile.amountDue > 0 ? (isArabic ? "المستحق المطلوب" : "Amount Due") : (isArabic ? "الرصيد المتبقي" : "Credit")}
                  </span>
                  <span
                    className={`text-sm font-black ${
                      statementModalProfile.amountDue > 0 ? "text-rose-600" : "text-emerald-600"
                    }`}
                  >
                    {statementModalProfile.amountDue > 0
                      ? `${statementModalProfile.amountDue} ج.م`
                      : `+${statementModalProfile.creditRemaining} ج.م`}
                  </span>
                </div>
              </div>

              {/* Status Explanation */}
              <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-100 text-slate-800 font-semibold leading-relaxed">
                {isArabic ? statementModalProfile.explanationAr : statementModalProfile.explanationEn}
              </div>

              {/* 1. سجل المدفوعات المسددة */}
              <div className="space-y-2">
                <h4 className="font-black text-slate-900 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isArabic ? "سجل الدفعات المسددة:" : "Payment History:"}</span>
                  </span>
                  <span className="text-[10.5px] font-bold text-slate-400">
                    {statementModalProfile.paymentHistory.length} {isArabic ? "دفعة" : "payments"}
                  </span>
                </h4>

                {statementModalProfile.paymentHistory.length === 0 ? (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center text-slate-400 font-medium">
                    {isArabic ? "لم تسجل أي دفعات بعد." : "No payments recorded."}
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                    {statementModalProfile.paymentHistory.map(pt => (
                      <div
                        key={pt.id}
                        className="p-3 rounded-2xl bg-emerald-50/40 border border-emerald-100 flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-emerald-700 text-xs">+{pt.amount} ج.م</span>
                            {pt.paymentMethod && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[9.5px]">
                                {pt.paymentMethod}
                              </span>
                            )}
                          </div>
                          {pt.notes && <p className="text-[10.5px] text-slate-500 mt-0.5">{pt.notes}</p>}
                        </div>
                        <div className="text-left flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400">{pt.date}</span>
                          <button
                            type="button"
                            onClick={() => setReceiptVoucherTx(pt)}
                            className="p-1 text-emerald-600 hover:text-emerald-800"
                            title={isArabic ? "عرض الإيصال" : "View Receipt"}
                          >
                            <Receipt className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. سجل الحصص المنفذة */}
              <div className="space-y-2">
                <h4 className="font-black text-slate-900 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>{isArabic ? "سجل الحصص المنفذة المسجلة بالحضور:" : "Attended Lessons History:"}</span>
                  </span>
                  <span className="text-[10.5px] font-bold text-slate-400">
                    {statementModalProfile.attendanceHistory.length} {isArabic ? "حصة" : "lessons"}
                  </span>
                </h4>

                {statementModalProfile.attendanceHistory.length === 0 ? (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center text-slate-400 font-medium">
                    {isArabic ? "لا توجد حصص مسجلة بالحضور حتى الآن." : "No attended lessons recorded."}
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                    {statementModalProfile.attendanceHistory.map((ar, aIdx) => (
                      <div
                        key={ar.id || aIdx}
                        className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded-lg bg-blue-100 text-blue-700 font-black text-[10px]">
                            #{ar.lessonNumber || (aIdx + 1)}
                          </span>
                          <div>
                            <p className="font-bold text-slate-800">{ar.subject || statementModalProfile.subjectName}</p>
                            <p className="text-[10px] text-slate-400">
                              {ar.teacherNotes || (ar.attendance === "present" ? "حضور مؤكد" : "غياب مع احتساب الحصة")}
                            </p>
                          </div>
                        </div>
                        <div className="text-left">
                          <span className="font-bold text-slate-900 block">-{statementModalProfile.lessonCost} ج.م</span>
                          <span className="text-[10px] text-slate-400">{ar.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/70">
              <button
                type="button"
                onClick={() => setStatementModalProfile(null)}
                className="px-4 py-2 rounded-2xl bg-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-300 transition"
              >
                {isArabic ? "إغلاق" : "Close"}
              </button>

              <button
                type="button"
                onClick={() => {
                  const p = statementModalProfile;
                  setStatementModalProfile(null);
                  handleOpenPaymentModal(p);
                }}
                className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isArabic ? "تسجيل دفعة لهذا الطالب" : "Record Payment"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: إيصال استلام نقدية معتمد (Academy Receipt Voucher) ================= */}
      {receiptVoucherTx && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border-2 border-slate-300 rounded-3xl max-w-lg w-full shadow-2xl animate-in fade-in my-6 overflow-hidden">
            {/* Action Bar */}
            <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">
                {isArabic ? "معاينة إيصال استلام نقدية أكاديمي" : "Payment Voucher Preview"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintStatement}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isArabic ? "طباعة الإيصال" : "Print"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReceiptVoucherTx(null)}
                  className="text-slate-400 hover:text-slate-700 p-1.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Printable Voucher Content */}
            <div className="p-6 space-y-4 text-xs font-medium text-slate-800 bg-white">
              {/* Academy Voucher Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-blue-700" />
                  <div>
                    <h2 className="font-black text-slate-900 text-base">GoStars Academy</h2>
                    <p className="text-[10px] text-slate-500 font-bold">{isArabic ? "منصة إدارة التعليم الذكية" : "Smart Academy Platform"}</p>
                  </div>
                </div>

                <div className="text-left font-mono">
                  <span className="text-xs font-black text-slate-900 block">
                    #{receiptVoucherTx.receiptNumber || receiptVoucherTx.id}
                  </span>
                  <span className="text-[10.5px] text-slate-500 font-bold">{receiptVoucherTx.date}</span>
                </div>
              </div>

              <div className="text-center py-1">
                <h3 className="font-black text-slate-900 text-sm tracking-wider uppercase bg-slate-100 py-1 rounded-xl">
                  {isArabic ? "إيصال استلام نقدية / Payment Voucher" : "Payment Voucher"}
                </h3>
              </div>

              {/* Receipt Details Table */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <span className="font-bold text-slate-500">{isArabic ? "استلمنا من الطالب:" : "Received From:"}</span>
                  <span className="font-black text-slate-900 text-sm">{receiptVoucherTx.studentName}</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <span className="font-bold text-slate-500">{isArabic ? "المبلغ المستلم:" : "Amount Received:"}</span>
                  <span className="font-black text-emerald-600 text-base">
                    {receiptVoucherTx.amount} {isArabic ? "جنيه مصري فقط لا غير" : "EGP"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                  <span className="font-bold text-slate-500">{isArabic ? "طريقة الدفع:" : "Payment Method:"}</span>
                  <span className="font-bold text-slate-800">
                    {receiptVoucherTx.paymentMethod || "كاش"}
                  </span>
                </div>

                {receiptVoucherTx.notes && (
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-500">{isArabic ? "البيان / ملاحظات:" : "Notes:"}</span>
                    <span className="text-slate-700 font-medium">{receiptVoucherTx.notes}</span>
                  </div>
                )}
              </div>

              {/* Signatures */}
              <div className="pt-4 flex items-center justify-between text-[11px] font-bold text-slate-500">
                <div>
                  <span>{isArabic ? "المستلم / إدارة الأكاديمية:" : "Received By:"}</span>
                  <div className="h-8 border-b border-slate-300 w-32 mt-1"></div>
                </div>
                <div className="text-left font-mono text-[10px] text-slate-400">
                  <span>GoStars Verified Voucher</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: تأكيد حذف المعاملة المالية ================= */}
      {deletingTxId && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 max-w-sm w-full shadow-2xl animate-in fade-in space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>

            <h3 className="font-black text-slate-900 text-center text-sm">
              {isArabic ? "تأكيد حذف المعاملة المالية" : "Confirm Transaction Deletion"}
            </h3>

            <p className="text-xs text-slate-500 text-center font-medium">
              {isArabic
                ? "هل أنت متأكد من حذف هذه الدفعة؟ سيتم تعديل رصيد الطالب وإعادة احتساب المستحقات فوراً."
                : "Are you sure you want to delete this payment? The student ledger will be recalculated."}
            </p>

            <div className="pt-2 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => setDeletingTxId(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </button>
              <button
                type="button"
                onClick={handleConfirmDeletePayment}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs"
              >
                {isArabic ? "تأكيد الحذف" : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
