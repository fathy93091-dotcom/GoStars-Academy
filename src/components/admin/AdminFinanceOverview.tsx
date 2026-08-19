import React, { useState } from "react";
import { CentralPayment, CombinedAdminStudent, TeacherRecord } from "../../types";
import { AcademyFinanceSummary } from "../../lib/adminDataEngine";
import { useLanguage } from "../../i18n/LanguageContext";
import {
  DollarSign,
  TrendingUp,
  AlertCircle,
  PiggyBank,
  Receipt,
  Search,
  Calendar,
  CreditCard,
  Building2,
  FileSpreadsheet,
  Printer,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2
} from "lucide-react";

interface AdminFinanceOverviewProps {
  summary: AcademyFinanceSummary;
  payments: CentralPayment[];
  students: CombinedAdminStudent[];
  teachers: TeacherRecord[];
}

export const AdminFinanceOverview: React.FC<AdminFinanceOverviewProps> = ({
  summary,
  payments,
  students,
  teachers
}) => {
  const { isRTL } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");

  const filteredPayments = payments.filter(p => {
    const sName = p.studentName || "";
    const matchesSearch =
      sName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.receiptNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.notes || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMethod =
      methodFilter === "all" ? true : p.paymentMethod === methodFilter;

    return matchesSearch && matchesMethod;
  });

  return (
    <div className="space-y-6">
      {/* Academy Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Collected Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">{isRTL ? "إجمالي المقبوضات المركزية" : "Total Revenue"}</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900">{summary.totalRevenue.toLocaleString()}</span>
            <span className="text-xs font-bold text-slate-500">ج.م</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-2 flex items-center gap-1">
            <span>{isRTL ? "محصل هذا الشهر:" : "This month:"}</span>
            <span className="font-bold font-mono">{summary.monthRevenue.toLocaleString()} ج.م</span>
          </div>
        </div>

        {/* Executed Lessons Cost */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">{isRTL ? "قيمة الحصص المنفذة" : "Executed Lessons Cost"}</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-900">{summary.totalLessonsCost.toLocaleString()}</span>
            <span className="text-xs font-bold text-slate-500">ج.م</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            {isRTL ? "بناءً على الحضور الفعلي المسجل" : "Calculated from actual attendance"}
          </div>
        </div>

        {/* Total Outstanding Debts */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">{isRTL ? "إجمالي المديونيات المتأخرة" : "Outstanding Debts"}</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-rose-600">{summary.totalDueDebt.toLocaleString()}</span>
            <span className="text-xs font-bold text-rose-500">ج.م</span>
          </div>
          <div className="text-[11px] text-rose-600 font-semibold mt-2">
            {isRTL ? "مستحقات واجبة التحصيل من الطلاب" : "Due from uncollected lessons"}
          </div>
        </div>

        {/* Net Academy Profit / Surplus */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">{isRTL ? "الأرصدة الفائضة للطلاب" : "Credit Surplus"}</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-indigo-700">{summary.totalCreditSurplus.toLocaleString()}</span>
            <span className="text-xs font-bold text-indigo-500">ج.م</span>
          </div>
          <div className="text-[11px] text-indigo-600 font-semibold mt-2">
            {isRTL ? "مدفوعات سابقة لحصص قادمة" : "Prepaid balance for future lessons"}
          </div>
        </div>
      </div>

      {/* Central Transactions Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-bold text-slate-800">
              {isRTL ? `سجل المقبوضات والمعاملات المركزية (${filteredPayments.length})` : `Central Payments Ledger (${filteredPayments.length})`}
            </h4>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute start-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder={isRTL ? "ابحث برقم الإيصال أو الطالب..." : "Search receipt or student..."}
                className="ps-8 pe-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
              />
            </div>

            {/* Method Filter */}
            <select
              value={methodFilter}
              onChange={e => setMethodFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-none"
            >
              <option value="all">{isRTL ? "جميع الطرق" : "All Methods"}</option>
              <option value="كاش">{isRTL ? "كاش نقدي" : "Cash"}</option>
              <option value="فودافون كاش">Vodafone Cash</option>
              <option value="إنستاباي InstaPay">InstaPay</option>
              <option value="تحويل بنكي">{isRTL ? "تحويل بنكي" : "Bank"}</option>
            </select>
          </div>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="p-12 text-center">
            <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">{isRTL ? "لا توجد معاملات مسجلة" : "No payment records found"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600">
                  <th className="py-3 px-4 text-start font-bold">{isRTL ? "رقم الإيصال" : "Receipt #"}</th>
                  <th className="py-3 px-4 text-start font-bold">{isRTL ? "اسم الطالب" : "Student Name"}</th>
                  <th className="py-3 px-4 text-start font-bold">{isRTL ? "المبلغ المسدد" : "Amount Paid"}</th>
                  <th className="py-3 px-4 text-start font-bold">{isRTL ? "طريقة الدفع" : "Payment Method"}</th>
                  <th className="py-3 px-4 text-start font-bold">{isRTL ? "التاريخ" : "Date"}</th>
                  <th className="py-3 px-4 text-start font-bold">{isRTL ? "البيان / الملاحظات" : "Notes"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map(payment => (
                  <tr key={payment.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      {payment.receiptNumber || payment.id.slice(0, 10)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {payment.studentName || "طالب"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-black text-emerald-700 text-sm">
                        +{Number(payment.amount).toLocaleString()} ج.م
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                        {payment.paymentMethod || "كاش"}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {payment.date}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">
                      {payment.notes || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
