import React, { useState } from "react";
import { WhatsAppRoutingConfig, WhatsAppRoutingMode, CentralGroup } from "../../../types";
import { useLanguage } from "../../../i18n/LanguageContext";
import {
  Sliders,
  Send,
  Users,
  User,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Save,
  Phone,
  FileText,
  DollarSign,
  Award,
  Sparkles,
  AlertTriangle
} from "lucide-react";

interface WhatsAppRoutingCardProps {
  config: WhatsAppRoutingConfig;
  groups: CentralGroup[];
  onSaveConfig: (updated: WhatsAppRoutingConfig) => Promise<void>;
}

export const WhatsAppRoutingCard: React.FC<WhatsAppRoutingCardProps> = ({
  config,
  groups,
  onSaveConfig
}) => {
  const { isRTL } = useLanguage();
  const [localConfig, setLocalConfig] = useState<WhatsAppRoutingConfig>(config);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleModeChange = (
    field: keyof Pick<
      WhatsAppRoutingConfig,
      "defaultReportRouting" | "defaultPaymentRouting" | "defaultEvaluationRouting" | "defaultCertificateRouting"
    >,
    value: WhatsAppRoutingMode
  ) => {
    setLocalConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGroupCustomModeChange = (groupId: string, value: WhatsAppRoutingMode) => {
    setLocalConfig(prev => ({
      ...prev,
      customGroupRoutings: {
        ...prev.customGroupRoutings,
        [groupId]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    await onSaveConfig(localConfig);
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const routingOptions: { value: WhatsAppRoutingMode; labelAr: string; labelEn: string; icon: any }[] = [
    { value: "dual", labelAr: "إرسال مزدوج (خاص + جروب)", labelEn: "Dual (Private + Group)", icon: Layers },
    { value: "private", labelAr: "خاص فقط لولي الأمر", labelEn: "Private to Parent", icon: User },
    { value: "group", labelAr: "لجروب الواتساب فقط", labelEn: "Group Chat Only", icon: Users },
    { value: "disabled", labelAr: "تعطيل الإرسال الآلي", labelEn: "Disabled", icon: AlertTriangle }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
      {/* Header & Master Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600" />
            <span>{isRTL ? "إعدادات وتوجيهات الإرسال الآلي (Routing Rules)" : "Automated Dispatch & Routing Rules"}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {isRTL
              ? "التحكم في مسار توجيه الرسائل لكل تقرير أو إيصال سداد أو شهادة تقدير (خاص / جروب / مزدوج)"
              : "Define automated WhatsApp destinations for reports, receipts and certificates"}
          </p>
        </div>

        {/* Master Toggle */}
        <label className="flex items-center gap-3 cursor-pointer bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
          <input
            type="checkbox"
            checked={localConfig.autoSendEnabled}
            onChange={e => setLocalConfig(prev => ({ ...prev, autoSendEnabled: e.target.checked }))}
            className="w-4 h-4 text-emerald-600 rounded-md focus:ring-emerald-500"
          />
          <div className="text-start">
            <span className="text-xs font-bold text-slate-900 block">
              {isRTL ? "تفعيل الإرسال الآلي العام" : "Master Auto-Dispatch"}
            </span>
            <span className="text-[10px] text-slate-500">
              {localConfig.autoSendEnabled ? (isRTL ? "البوت يرسل تلقائياً" : "Bot is active") : (isRTL ? "الإرسال متوقف مؤقتاً" : "Paused")}
            </span>
          </div>
        </label>
      </div>

      {/* Main Routing Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Lesson Reports Policy */}
        <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>{isRTL ? "تقارير الحصص اليومية" : "Lesson Reports"}</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
              {localConfig.defaultReportRouting}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {routingOptions.map(opt => {
              const Icon = opt.icon;
              const isSelected = localConfig.defaultReportRouting === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleModeChange("defaultReportRouting", opt.value)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition text-start flex items-center gap-2 ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{isRTL ? opt.labelAr : opt.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Payment Receipts Policy (Rule 13 Prepaid Only) */}
        <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>{isRTL ? "إيصالات السداد وشحن الرصيد" : "Payment Vouchers"}</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              {localConfig.defaultPaymentRouting}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {routingOptions.map(opt => {
              const Icon = opt.icon;
              const isSelected = localConfig.defaultPaymentRouting === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleModeChange("defaultPaymentRouting", opt.value)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition text-start flex items-center gap-2 ${
                    isSelected
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{isRTL ? opt.labelAr : opt.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Monthly Evaluation Summaries */}
        <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{isRTL ? "ملخصات التقييم الشهري" : "Monthly Evaluations"}</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              {localConfig.defaultEvaluationRouting}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {routingOptions.map(opt => {
              const Icon = opt.icon;
              const isSelected = localConfig.defaultEvaluationRouting === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleModeChange("defaultEvaluationRouting", opt.value)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition text-start flex items-center gap-2 ${
                    isSelected
                      ? "bg-amber-600 text-white border-amber-600 shadow-2xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{isRTL ? opt.labelAr : opt.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Certificates and Honors */}
        <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              <span>{isRTL ? "شهادات الشكر والتكريم" : "Diplomas & Honors"}</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
              {localConfig.defaultCertificateRouting}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {routingOptions.map(opt => {
              const Icon = opt.icon;
              const isSelected = localConfig.defaultCertificateRouting === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleModeChange("defaultCertificateRouting", opt.value)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition text-start flex items-center gap-2 ${
                    isSelected
                      ? "bg-purple-600 text-white border-purple-600 shadow-2xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{isRTL ? opt.labelAr : opt.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Anti-Ban Delay & Admin Alert Settings */}
      <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label className="font-bold text-slate-800 block mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>{isRTL ? "فاصل الأمان الزمني ضد الحظر (Anti-Ban):" : "Anti-Ban Safe Delay:"}</span>
            </span>
            <span className="font-mono text-blue-700">{localConfig.sendDelaySeconds} {isRTL ? "ثوانٍ" : "sec"}</span>
          </label>
          <input
            type="range"
            min="3"
            max="30"
            step="1"
            value={localConfig.sendDelaySeconds}
            onChange={e => setLocalConfig(prev => ({ ...prev, sendDelaySeconds: parseInt(e.target.value) || 8 }))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <p className="text-[10px] text-slate-400 mt-1">
            {isRTL ? "المدة الزمنية الفاصلة بين كل رسالة وأخرى لتفادي قيود خوارزميات الواتساب" : "Interval between consecutive dispatches to prevent WhatsApp spam filters"}
          </p>
        </div>

        <div>
          <label className="font-bold text-slate-800 block mb-1 flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-slate-500" />
            <span>{isRTL ? "رقم هاتف إشعارات الإدارة العاجلة:" : "Admin Alert Phone:"}</span>
          </label>
          <input
            type="text"
            value={localConfig.adminNotificationPhone || ""}
            onChange={e => setLocalConfig(prev => ({ ...prev, adminNotificationPhone: e.target.value }))}
            placeholder="+201000000000"
            className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono text-xs focus:outline-hidden focus:border-blue-500"
          />
        </div>
      </div>

      {/* Save Button Row */}
      <div className="flex items-center justify-between pt-2">
        <div>
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isRTL ? "تم حفظ وتطبيق إعدادات التوجيه بنجاح!" : "Routing policies updated successfully!"}</span>
            </span>
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? (isRTL ? "جارٍ الحفظ..." : "Saving...") : (isRTL ? "حفظ إعدادات التوجيه" : "Save Routing Config")}</span>
        </button>
      </div>
    </div>
  );
};
