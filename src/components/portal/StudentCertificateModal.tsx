import React from "react";
import { StudentCertificate } from "../../types";
import { useLanguage } from "../../i18n/LanguageContext";
import {
  X,
  Printer,
  Award,
  ShieldCheck,
  Star,
  Sparkles,
  CheckCircle2,
  Calendar
} from "lucide-react";

interface StudentCertificateModalProps {
  certificate: StudentCertificate;
  onClose: () => void;
}

export const StudentCertificateModal: React.FC<StudentCertificateModalProps> = ({
  certificate,
  onClose
}) => {
  const { isRTL } = useLanguage();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-amber-200 my-8 transition-all animate-in fade-in zoom-in-95">
        {/* Modal Toolbar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                {isRTL ? "شهادة التميز والشكر والتقدير" : "Official Certificate of Appreciation"}
              </h3>
              <p className="text-[10px] text-amber-400 font-mono">
                {certificate.serialNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 transition flex items-center gap-1.5 text-xs font-black shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>{isRTL ? "طباعة / حفظ الشهادة" : "Print / Save"}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Canvas Frame */}
        <div className="p-6 sm:p-12 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/30">
          <div className="relative border-4 border-double border-amber-500/60 rounded-3xl p-8 sm:p-12 text-center bg-white shadow-xl overflow-hidden">
            {/* Background Corner Decors */}
            <div className="absolute top-2 left-2 w-12 h-12 border-t-2 border-l-2 border-amber-500 rounded-tl-xl pointer-events-none" />
            <div className="absolute top-2 right-2 w-12 h-12 border-t-2 border-r-2 border-amber-500 rounded-tr-xl pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-12 h-12 border-b-2 border-l-2 border-amber-500 rounded-bl-xl pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-12 h-12 border-b-2 border-r-2 border-amber-500 rounded-br-xl pointer-events-none" />

            {/* Academy Seal & Logo */}
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-center font-black shadow-lg mb-3 border-2 border-amber-400">
                <ShieldCheck className="w-8 h-8 text-amber-400" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-[#0B192C] tracking-tight">
                GoStars Academy
              </h1>
              <p className="text-xs font-bold text-amber-700 mt-1">
                {isRTL ? "أكاديمية جو ستارز للتعليم والتميز القرآني واللغوي" : "GoStars Academy for Excellence"}
              </p>
            </div>

            {/* Certificate Title */}
            <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-amber-100 via-amber-200 to-amber-100 border border-amber-300 text-amber-950 font-black text-sm sm:text-base mb-6 shadow-xs">
              ★ {certificate.title} ★
            </div>

            {/* Presentation Text */}
            <p className="text-xs sm:text-sm text-slate-600 mb-4 font-medium">
              {isRTL
                ? "تتشرف إدارة الأكاديمية وهيئة التدريس بمنح هذا الوسام التقديري للطالب المتميز:"
                : "GoStars Academy proudly awards this Certificate of Distinction to:"}
            </p>

            {/* Student Name Display */}
            <div className="text-2xl sm:text-3xl font-black text-blue-950 mb-4 py-2 border-b-2 border-amber-300 max-w-md mx-auto">
              {certificate.studentName}
            </div>

            {/* Appreciation Statement */}
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-xl mx-auto mb-6">
              {certificate.appreciationText}
            </p>

            {/* Track / Grade Badge */}
            {certificate.gradeBadge && (
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-black mb-8">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{certificate.gradeBadge}</span>
              </div>
            )}

            {/* Signature & Serial Footer */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 mt-6 text-xs text-slate-600">
              <div className="text-start">
                <span className="text-slate-400 block mb-1">{isRTL ? "المعلم / المشرف الأكاديمي" : "Academic Supervisor"}</span>
                <span className="font-bold text-slate-900 text-sm block">{certificate.teacherName}</span>
                <span className="text-[10px] text-amber-700 font-bold">{isRTL ? "إدارة التقييم والاعتماد" : "Evaluation Board"}</span>
              </div>
              <div className="text-end">
                <span className="text-slate-400 block mb-1">{isRTL ? "تاريخ الإصدار والاعتماد" : "Issue Date"}</span>
                <span className="font-bold text-slate-900 text-sm block font-mono">{certificate.issueDate}</span>
                <span className="text-[10px] text-slate-400 font-mono">{certificate.serialNumber}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
