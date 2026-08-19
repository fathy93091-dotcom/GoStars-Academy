import React, { useState } from "react";
import { CentralReport, CombinedAdminStudent, WhatsAppRoutingMode } from "../../../types";
import { useLanguage } from "../../../i18n/LanguageContext";
import { WhatsAppMessageFormatter } from "../../../lib/whatsappMessageFormatter";
import { TermuxWhatsAppEngine } from "../../../lib/termuxWhatsAppEngine";
import {
  Send,
  MessageSquare,
  Sparkles,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  User,
  Users
} from "lucide-react";

interface WhatsAppMessageSimulatorModalProps {
  reports: CentralReport[];
  students: CombinedAdminStudent[];
  onClose: () => void;
  onSuccessEnqueued: () => void;
}

export const WhatsAppMessageSimulatorModal: React.FC<WhatsAppMessageSimulatorModalProps> = ({
  reports,
  students,
  onClose,
  onSuccessEnqueued
}) => {
  const { isRTL } = useLanguage();

  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0]?.id || "");
  const [destinationMode, setDestinationMode] = useState<"private" | "group">("private");
  const [customPhone, setCustomPhone] = useState("+201000000000");
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectedReport = reports.find(r => r.id === selectedReportId) || reports[0];
  const selectedStudent = students.find(s => s.id === selectedReport?.studentId);

  const previewText = selectedReport
    ? WhatsAppMessageFormatter.formatLessonReport(selectedReport, destinationMode, selectedStudent)
    : "اختر تقريراً لمعاينة نص رسالة الواتساب";

  const handleSendLiveTest = async () => {
    if (!selectedReport) return;
    setIsSending(true);
    try {
      await TermuxWhatsAppEngine.enqueueMessage({
        recipientType: destinationMode === "group" ? "group_chat" : "parent_private",
        recipientTarget: customPhone,
        recipientName: destinationMode === "group" ? (selectedReport.groupName || "المجموعة") : (selectedReport.studentName || "ولي الأمر"),
        studentId: selectedReport.studentId,
        studentName: selectedReport.studentName,
        subject: selectedReport.subject,
        messageType: "lesson_report",
        messageText: previewText,
        status: "pending",
        attempts: 0,
        maxAttempts: 3,
        scheduledAt: new Date().toISOString(),
        relatedEntityId: selectedReport.id
      });
      setSentSuccess(true);
      onSuccessEnqueued();
      setTimeout(() => {
        setSentSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.warn("Could not enqueue simulated test message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(previewText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900">
                {isRTL ? "محاكي صياغة وإرسال رسائل الواتساب" : "WhatsApp Formatter & Sender Simulator"}
              </h3>
              <p className="text-xs text-slate-500">
                {isRTL ? "اختبار شكل الرسالة المنسقة وإرسالها لطابور خادم Termux" : "Test formatted layout and dispatch to Termux outbox"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Form Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Report Selector */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              {isRTL ? "اختر التقرير الدراسي للتجربة:" : "Select Report:"}
            </label>
            <select
              value={selectedReportId}
              onChange={e => setSelectedReportId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-800 focus:outline-hidden"
            >
              {reports.map(rep => (
                <option key={rep.id} value={rep.id}>
                  {rep.studentName} - {rep.subject} ({rep.date})
                </option>
              ))}
            </select>
          </div>

          {/* Destination Selector */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              {isRTL ? "نمط ونوع الصياغة:" : "Formatting Style:"}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDestinationMode("private")}
                className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition ${
                  destinationMode === "private"
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{isRTL ? "خاص لولي الأمر" : "Private"}</span>
              </button>

              <button
                type="button"
                onClick={() => setDestinationMode("group")}
                className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition ${
                  destinationMode === "group"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>{isRTL ? "إعلان للجروب" : "Group Post"}</span>
              </button>
            </div>
          </div>

          {/* Phone Target */}
          <div className="sm:col-span-2">
            <label className="font-bold text-slate-700 block mb-1">
              {isRTL ? "رقم الهاتف المستهدف للإرسال التجريبي:" : "Target Test Phone Number:"}
            </label>
            <input
              type="text"
              value={customPhone}
              onChange={e => setCustomPhone(e.target.value)}
              placeholder="+201000000000"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>

        {/* Live Preview WhatsApp Bubble */}
        <div>
          <div className="flex items-center justify-between mb-1.5 text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>{isRTL ? "المعاينة الحية لنص رسالة الواتساب:" : "Live WhatsApp Preview:"}</span>
            </span>

            <button
              onClick={handleCopyText}
              className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (isRTL ? "تم النسخ" : "Copied") : (isRTL ? "نسخ النص" : "Copy")}</span>
            </button>
          </div>

          <div className="bg-[#ECE5DD] p-4 rounded-2xl border border-emerald-900/10 max-h-64 overflow-y-auto">
            <div className="bg-[#DCF8C6] text-slate-900 p-4 rounded-2xl rounded-tr-xs shadow-xs text-xs whitespace-pre-wrap font-sans leading-relaxed">
              {previewText}
              <div className="text-[10px] text-slate-500 text-end mt-2 font-mono">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          {sentSuccess ? (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isRTL ? "تمت إضافة الرسالة لطابور الإرسال بنجاح!" : "Message queued in Termux outbox!"}</span>
            </span>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
            >
              {isRTL ? "إلغاء" : "Cancel"}
            </button>

            <button
              onClick={handleSendLiveTest}
              disabled={isSending || sentSuccess}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition flex items-center gap-2 shadow-sm"
            >
              <Send className={`w-4 h-4 ${isSending ? "animate-spin" : ""}`} />
              <span>{isSending ? (isRTL ? "جارٍ الإرسال..." : "Sending...") : (isRTL ? "إرسال لطابور Termux" : "Send to Outbox")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
