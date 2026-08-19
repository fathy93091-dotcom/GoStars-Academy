import React, { useState } from "react";
import { WhatsAppOutboxMessage, OutboxMessageStatus } from "../../../types";
import { useLanguage } from "../../../i18n/LanguageContext";
import {
  Inbox,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCw,
  Trash2,
  Eye,
  XCircle,
  Search,
  Filter,
  User,
  Users,
  MessageSquare,
  FileText,
  DollarSign,
  Award,
  Sparkles,
  Copy,
  Check
} from "lucide-react";

interface WhatsAppOutboxQueueProps {
  messages: WhatsAppOutboxMessage[];
  onRetry: (messageId: string) => Promise<void>;
  onCancel: (messageId: string) => Promise<void>;
  onDelete: (messageId: string) => Promise<void>;
  onClearCompleted: () => Promise<void>;
  onRefresh: () => Promise<void>;
}

export const WhatsAppOutboxQueue: React.FC<WhatsAppOutboxQueueProps> = ({
  messages,
  onRetry,
  onCancel,
  onDelete,
  onClearCompleted,
  onRefresh
}) => {
  const { isRTL } = useLanguage();
  const [statusFilter, setStatusFilter] = useState<"all" | OutboxMessageStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [previewMessage, setPreviewMessage] = useState<WhatsAppOutboxMessage | null>(null);
  const [copiedPreview, setCopiedPreview] = useState(false);
  const [actionInProgressId, setActionInProgressId] = useState<string | null>(null);

  const filtered = messages.filter(m => {
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    const matchesSearch =
      m.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.recipientTarget.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.studentName && m.studentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      m.messageText.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleRetry = async (id: string) => {
    setActionInProgressId(id);
    await onRetry(id);
    setActionInProgressId(null);
  };

  const handleCopyPreview = () => {
    if (!previewMessage) return;
    navigator.clipboard.writeText(previewMessage.messageText);
    setCopiedPreview(true);
    setTimeout(() => setCopiedPreview(false), 2000);
  };

  const getStatusBadge = (status: OutboxMessageStatus) => {
    switch (status) {
      case "sent":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{isRTL ? "تم الإرسال بنجاح" : "Sent"}</span>
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-600 animate-spin" />
            <span>{isRTL ? "في طابور الإرسال" : "Pending"}</span>
          </span>
        );
      case "sending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Send className="w-3 h-3 text-amber-600 animate-pulse" />
            <span>{isRTL ? "جارٍ الإرسال..." : "Sending..."}</span>
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" />
            <span>{isRTL ? "فشل الإرسال" : "Failed"}</span>
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <XCircle className="w-3 h-3 text-slate-500" />
            <span>{isRTL ? "ملغي" : "Cancelled"}</span>
          </span>
        );
    }
  };

  const getMessageTypeBadge = (type: WhatsAppOutboxMessage["messageType"]) => {
    switch (type) {
      case "lesson_report":
        return (
          <span className="text-[11px] font-bold text-blue-700 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />
            <span>{isRTL ? "تقرير حصة" : "Report"}</span>
          </span>
        );
      case "payment_receipt":
        return (
          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" />
            <span>{isRTL ? "إيصال سداد" : "Receipt"}</span>
          </span>
        );
      case "certificate":
        return (
          <span className="text-[11px] font-bold text-purple-700 flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            <span>{isRTL ? "شهادة تكريم" : "Diploma"}</span>
          </span>
        );
      case "monthly_evaluation":
        return (
          <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isRTL ? "تقييم شهري" : "Evaluation"}</span>
          </span>
        );
      default:
        return (
          <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{isRTL ? "رسالة عامة" : "Message"}</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
            <Inbox className="w-5 h-5 text-indigo-600" />
            <span>{isRTL ? "طابور الرسائل السحابي المباشر (/whatsapp_outbox)" : "Live WhatsApp Cloud Outbox"}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isRTL
              ? `إجمالي ${messages.length} رسائل مسجلة في طابور الإرسال التلقائي لخادم Termux`
              : `Total ${messages.length} messages scheduled in Termux cloud outbox`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onClearCompleted}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isRTL ? "تفريغ المكتمل" : "Clear Sent"}</span>
          </button>

          <button
            onClick={onRefresh}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
            title={isRTL ? "تحديث الطابور" : "Refresh"}
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 rounded-xl transition ${
              statusFilter === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {isRTL ? "الكل" : "All"} ({messages.length})
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-3 py-1.5 rounded-xl transition ${
              statusFilter === "pending" ? "bg-white text-blue-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {isRTL ? "قيد الانتظار" : "Pending"} ({messages.filter(m => m.status === "pending").length})
          </button>
          <button
            onClick={() => setStatusFilter("sent")}
            className={`px-3 py-1.5 rounded-xl transition ${
              statusFilter === "sent" ? "bg-white text-emerald-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {isRTL ? "تم الإرسال" : "Sent"} ({messages.filter(m => m.status === "sent").length})
          </button>
          <button
            onClick={() => setStatusFilter("failed")}
            className={`px-3 py-1.5 rounded-xl transition ${
              statusFilter === "failed" ? "bg-white text-rose-700 shadow-2xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {isRTL ? "فشل" : "Failed"} ({messages.filter(m => m.status === "failed").length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative sm:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder={isRTL ? "بحث باسم المستلم أو المحتوى..." : "Search recipient, phone..."}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-hidden focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute top-2.5 start-3 pointer-events-none" />
        </div>
      </div>

      {/* Messages Table */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
          <Inbox className="w-8 h-8 mx-auto text-slate-300 mb-2" />
          <p>{isRTL ? "لا توجد رسائل مطابقة في طابور الواتساب." : "No messages found in outbox queue."}</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-xs text-start">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="px-4 py-3 text-start">{isRTL ? "نوع الرسالة" : "Type"}</th>
                <th className="px-4 py-3 text-start">{isRTL ? "المستلم / الوجهة" : "Recipient"}</th>
                <th className="px-4 py-3 text-start">{isRTL ? "رقم الهاتف / الجروب" : "Target"}</th>
                <th className="px-4 py-3 text-start">{isRTL ? "الحالة" : "Status"}</th>
                <th className="px-4 py-3 text-start">{isRTL ? "الوقت المجدول" : "Scheduled"}</th>
                <th className="px-4 py-3 text-start">{isRTL ? "المحاولات" : "Attempts"}</th>
                <th className="px-4 py-3 text-end">{isRTL ? "الإجراءات" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filtered.map(msg => (
                <tr key={msg.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-4 py-3">
                    {getMessageTypeBadge(msg.messageType)}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      {msg.recipientType === "group_chat" ? (
                        <Users className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      )}
                      <span className="truncate max-w-[150px]">{msg.recipientName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-600 text-[11px]">
                    {msg.recipientTarget}
                  </td>
                  <td className="px-4 py-3">
                    {getStatusBadge(msg.status)}
                    {msg.errorMessage && (
                      <span className="text-[10px] text-rose-600 block mt-0.5 max-w-xs truncate" title={msg.errorMessage}>
                        {msg.errorMessage}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-500 text-[11px]">
                    {new Date(msg.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-700">
                    {msg.attempts}/{msg.maxAttempts}
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setPreviewMessage(msg)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                        title={isRTL ? "معاينة نص الرسالة" : "View Message Text"}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {msg.status === "failed" && (
                        <button
                          onClick={() => handleRetry(msg.id)}
                          disabled={actionInProgressId === msg.id}
                          className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition flex items-center gap-1"
                          title={isRTL ? "إعادة الإرسال الآن" : "Retry Now"}
                        >
                          <RotateCw className={`w-3 h-3 ${actionInProgressId === msg.id ? "animate-spin" : ""}`} />
                          <span>{isRTL ? "إعادة" : "Retry"}</span>
                        </button>
                      )}

                      {msg.status === "pending" && (
                        <button
                          onClick={() => onCancel(msg.id)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition"
                          title={isRTL ? "إلغاء الإرسال" : "Cancel"}
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => onDelete(msg.id)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition"
                        title={isRTL ? "حذف السجل" : "Delete"}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Message Preview Modal */}
      {previewMessage && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="font-black text-sm text-slate-900">
                    {isRTL ? "معاينة رسالة الواتساب المنسقة" : "WhatsApp Formatted Preview"}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {previewMessage.recipientName} ({previewMessage.recipientTarget})
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPreviewMessage(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* WhatsApp Chat Bubble Mockup */}
            <div className="bg-[#ECE5DD] p-4 rounded-2xl border border-emerald-900/10 max-h-96 overflow-y-auto">
              <div className="bg-[#DCF8C6] text-slate-900 p-4 rounded-2xl rounded-tr-xs shadow-xs text-xs whitespace-pre-wrap font-sans leading-relaxed">
                {previewMessage.messageText}
                <div className="text-[10px] text-slate-500 text-end mt-2 font-mono">
                  {new Date(previewMessage.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleCopyPreview}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
              >
                {copiedPreview ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPreview ? (isRTL ? "تم النسخ" : "Copied") : (isRTL ? "نسخ النص" : "Copy Text")}</span>
              </button>

              <button
                onClick={() => setPreviewMessage(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
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
