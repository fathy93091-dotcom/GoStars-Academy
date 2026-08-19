import React, { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext";
import { ParentPortalEngine } from "../../lib/parentPortalEngine";
import { CombinedAdminStudent } from "../../types";
import {
  X,
  Link,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  QrCode,
  GraduationCap,
  Sparkles
} from "lucide-react";

interface LinkStudentModalProps {
  parentUid?: string;
  parentEmail?: string;
  onSuccess: (student: CombinedAdminStudent) => void;
  onClose: () => void;
}

export const LinkStudentModal: React.FC<LinkStudentModalProps> = ({
  parentUid,
  parentEmail,
  onSuccess,
  onClose
}) => {
  const { isRTL } = useLanguage();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError(isRTL ? "يرجى كتابة كود الطالب أو رقمه التعريفي" : "Please enter the student code or ID");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await ParentPortalEngine.linkStudentByCode(code, parentUid, parentEmail);
      if (res.success && res.student) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          onSuccess(res.student!);
          onClose();
        }, 800);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err?.message || (isRTL ? "حدث خطأ أثناء محاولة ربط الطالب" : "Error linking student"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-400/30 flex items-center justify-center">
              <Link className="w-4 h-4" />
            </div>
            <h3 className="font-black text-sm text-white">
              {isRTL ? "ربط حساب طالب جديد" : "Link a New Student"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            {isRTL
              ? "أدخل كود الطالب المعتمد من الأكاديمية (مثل: GS-2026-101) أو رقم هاتفه المسجل لربط ملفه بحسابك واستعراض تقاريره فوراً."
              : "Enter the student's authorized code (e.g. GS-2026-101) or registered phone to link their profile and access academic reports."}
          </p>

          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isRTL ? "كود الطالب / الرقم التعريفي" : "Student Code / ID"}
            </label>
            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="GS-2026-101"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:border-blue-500 font-mono text-sm uppercase text-slate-900"
              />
              <QrCode className="w-4 h-4 text-slate-400 absolute top-3 end-3 pointer-events-none" />
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {isRTL ? "أو يمكنك تجربة الأكواد التجريبية: GS-2026-101 أو GS-2026-102" : "Or test with demo codes: GS-2026-101 or GS-2026-102"}
            </span>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition"
            >
              {isRTL ? "إلغاء" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-700/20"
            >
              {loading ? (
                <span>{isRTL ? "جارٍ التحقق..." : "Verifying..."}</span>
              ) : (
                <>
                  <Link className="w-4 h-4" />
                  <span>{isRTL ? "تأكيد الربط" : "Link Student"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
