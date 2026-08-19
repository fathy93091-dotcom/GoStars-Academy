import React, { useState, useEffect } from "react";
import {
  WhatsAppOutboxMessage,
  WhatsAppRoutingConfig,
  TermuxServerStatus,
  CentralReport,
  CentralGroup,
  CombinedAdminStudent
} from "../../../types";
import { useLanguage } from "../../../i18n/LanguageContext";
import {
  TermuxWhatsAppEngine,
  DEFAULT_ROUTING_CONFIG,
  INITIAL_TERMUX_STATUS
} from "../../../lib/termuxWhatsAppEngine";
import { TermuxServerCard } from "./TermuxServerCard";
import { WhatsAppRoutingCard } from "./WhatsAppRoutingCard";
import { WhatsAppOutboxQueue } from "./WhatsAppOutboxQueue";
import { WhatsAppMessageSimulatorModal } from "./WhatsAppMessageSimulatorModal";
import {
  Smartphone,
  Send,
  Inbox,
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  RotateCw,
  Plus,
  Radio,
  Zap
} from "lucide-react";

interface AdminWhatsAppHubProps {
  reports: CentralReport[];
  groups: CentralGroup[];
  students: CombinedAdminStudent[];
}

export const AdminWhatsAppHub: React.FC<AdminWhatsAppHubProps> = ({
  reports,
  groups,
  students
}) => {
  const { isRTL } = useLanguage();

  const [termuxStatus, setTermuxStatus] = useState<TermuxServerStatus>(INITIAL_TERMUX_STATUS);
  const [routingConfig, setRoutingConfig] = useState<WhatsAppRoutingConfig>(DEFAULT_ROUTING_CONFIG);
  const [outboxMessages, setOutboxMessages] = useState<WhatsAppOutboxMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  const loadAllWhatsAppEngineData = async () => {
    try {
      const [status, config, messages] = await Promise.all([
        TermuxWhatsAppEngine.getTermuxStatus(),
        TermuxWhatsAppEngine.getRoutingConfig(),
        TermuxWhatsAppEngine.getOutboxMessages()
      ]);
      setTermuxStatus(status);
      setRoutingConfig(config);
      setOutboxMessages(messages);
    } catch (err) {
      console.warn("Could not load WhatsApp Hub data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllWhatsAppEngineData();
  }, []);

  const handleSaveRoutingConfig = async (updated: WhatsAppRoutingConfig) => {
    setRoutingConfig(updated);
    await TermuxWhatsAppEngine.saveRoutingConfig(updated);
  };

  const handleUpdateTermuxStatus = async (updated: Partial<TermuxServerStatus>) => {
    const res = await TermuxWhatsAppEngine.updateTermuxStatus(updated);
    setTermuxStatus(res);
  };

  const handleRetryMessage = async (id: string) => {
    await TermuxWhatsAppEngine.retryMessage(id);
    const refreshed = await TermuxWhatsAppEngine.getOutboxMessages();
    setOutboxMessages(refreshed);
  };

  const handleCancelMessage = async (id: string) => {
    await TermuxWhatsAppEngine.cancelMessage(id);
    const refreshed = await TermuxWhatsAppEngine.getOutboxMessages();
    setOutboxMessages(refreshed);
  };

  const handleDeleteMessage = async (id: string) => {
    await TermuxWhatsAppEngine.deleteMessage(id);
    const refreshed = await TermuxWhatsAppEngine.getOutboxMessages();
    setOutboxMessages(refreshed);
  };

  const handleClearCompleted = async () => {
    await TermuxWhatsAppEngine.clearCompleted();
    const refreshed = await TermuxWhatsAppEngine.getOutboxMessages();
    setOutboxMessages(refreshed);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 text-xs">
        <Smartphone className="w-8 h-8 mx-auto text-emerald-600 animate-pulse mb-2" />
        <p className="font-bold">{isRTL ? "جارٍ تحميل مركز خادم Termux والواتساب..." : "Loading Termux WhatsApp Engine..."}</p>
      </div>
    );
  }

  const pendingCount = outboxMessages.filter(m => m.status === "pending").length;
  const sentCount = outboxMessages.filter(m => m.status === "sent").length;
  const failedCount = outboxMessages.filter(m => m.status === "failed").length;

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Actions & Rule 5 Badge */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 end-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>GoStars Termux Daemon v2.4</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isRTL ? "تطبيق صارم للقاعدة 5 (عزل المعلم)" : "Strict Rule 5: Teacher Isolation Active"}</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white">
              {isRTL ? "مركز إدارة خادم Termux وبوت الواتساب الآلي" : "Termux WhatsApp Automation Engine"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isRTL
                ? "إدارة الربط الآلي وتوجيه تقارير الحصص وإيصالات السداد سحابياً بدون كشف أرقام الهواتف أو إتاحة الإرسال اليدوي للمعلمين."
                : "Centralized WhatsApp dispatch engine running on dedicated Android Termux server with dynamic routing."}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={() => setIsSimulatorOpen(true)}
              className="w-full md:w-auto px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isRTL ? "محاكي وإرسال رسالة تجريبية" : "Message Simulator"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Termux Server Telemetry & Baileys Pairing */}
      <TermuxServerCard
        status={termuxStatus}
        onRefresh={loadAllWhatsAppEngineData}
        onUpdateStatus={handleUpdateTermuxStatus}
      />

      {/* 2. Flexible Routing Policies (Private / Group / Dual / Disabled) */}
      <WhatsAppRoutingCard
        config={routingConfig}
        groups={groups}
        onSaveConfig={handleSaveRoutingConfig}
      />

      {/* 3. Live Cloud Outbox Queue */}
      <WhatsAppOutboxQueue
        messages={outboxMessages}
        onRetry={handleRetryMessage}
        onCancel={handleCancelMessage}
        onDelete={handleDeleteMessage}
        onClearCompleted={handleClearCompleted}
        onRefresh={loadAllWhatsAppEngineData}
      />

      {/* Simulator Modal */}
      {isSimulatorOpen && (
        <WhatsAppMessageSimulatorModal
          reports={reports}
          students={students}
          onClose={() => setIsSimulatorOpen(false)}
          onSuccessEnqueued={loadAllWhatsAppEngineData}
        />
      )}
    </div>
  );
};
