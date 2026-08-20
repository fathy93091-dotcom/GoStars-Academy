import React, { useState, useEffect } from "react";
import { useAuth } from "../../lib/AuthContext";
import { useLanguage } from "../../i18n/LanguageContext";
import { AppRoute } from "../../navigation/routes";
import { Container } from "../shared/Container";
import { Logo } from "../shared/Logo";
import { Button } from "../shared/Button";
import { Badge } from "../shared/Badge";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  ArrowRight,
  ArrowLeft,
  LogOut,
  UserCheck,
  Building2,
  Sparkles
} from "lucide-react";

import { AdminPlatformView } from "./AdminPlatformView";

interface AdminProtectedGateProps {
  onNavigate: (route: AppRoute) => void;
}

export const AdminProtectedGate: React.FC<AdminProtectedGateProps> = ({ onNavigate }) => {
  const { user, profile, role, isAdmin, isSupervisor, isLoading, loginWithGoogle, logout } = useAuth();
  const { isRTL } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const [forceShowGate, setForceShowGate] = useState(false);

  // Failsafe: Never stay on spinner for more than 1 second
  useEffect(() => {
    const timer = setTimeout(() => {
      setForceShowGate(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const isMaster = Boolean(user?.email && user.email.toLowerCase() === "fathy93091@gmail.com");

  // 1. Authorized State (Admin, Supervisor, or Master Admin Email)
  if (user && (isAdmin || isSupervisor || isMaster)) {
    return <AdminPlatformView onNavigate={onNavigate} />;
  }

  // 2. Loading State (Only if not force-shown)
  if (isLoading && !forceShowGate && !user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center animate-pulse mb-3">
          <Lock className="w-6 h-6" />
        </div>
        <p className="text-sm font-bold text-slate-600">
          {isRTL ? "جارٍ التحقق من الصلاحيات..." : "Verifying authorization..."}
        </p>
      </div>
    );
  }

  // 3. Not Authenticated State
  if (!user) {
    return (
      <div className="py-12 sm:py-20 flex flex-col items-center justify-center min-h-[75vh]">
        <Container size="sm">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-12 flex flex-col items-center text-center">
            <div className="mb-6">
              <Logo size="lg" showSlogan={true} />
            </div>

            <Badge variant="blue" size="md" className="mb-4">
              <Lock className="w-3.5 h-3.5" />
              <span>{isRTL ? "منطقة إدارية مقيدة" : "Restricted Admin Area"}</span>
            </Badge>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
              {isRTL ? "بوابة الإدارة المركزية" : "Central Administration Gateway"}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 mb-6 max-w-md leading-relaxed">
              {isRTL
                ? "هذا المسار مخصص حصرياً للمدير العام والمشرفين المعتمدين في أكاديمية جو ستارز. يرجى تسجيل الدخول بحسابك الإداري المعتمد."
                : "This route is strictly restricted to GoStars Academy Administrators and Supervisors. Please sign in with your authorized administrative account."}
            </p>

            <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-start mb-6 flex items-start gap-3">
              <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-800 block mb-0.5">
                  {isRTL ? "المصادقة الأمنية المعتمدة" : "Secure Authentication"}
                </span>
                <span>
                  {isRTL
                    ? "يتم التحقق من الصلاحيات الإدارية عبر قواعد أمان Firebase Security Rules لمنع أي وصول غير مصرح به."
                    : "Administrative privileges are enforced via Firebase Security Rules to prevent unauthorized access."}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => loginWithGoogle("admin")}
                icon={<ArrowIcon className="w-4 h-4" />}
                iconPosition="end"
              >
                {isRTL ? "تسجيل الدخول بحساب Google" : "Sign In with Google"}
              </Button>

              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={() => onNavigate("home")}
              >
                {isRTL ? "الرجوع للموقع العام" : "Return to Public Site"}
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // 2. Authenticated but Unauthorized (Not Admin & Not Supervisor)
  if (!isAdmin && !isSupervisor) {
    return (
      <div className="py-12 sm:py-20 flex flex-col items-center justify-center min-h-[75vh]">
        <Container size="sm">
          <div className="bg-white rounded-3xl border border-rose-200 shadow-xl p-8 sm:p-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-5 shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <Badge variant="neutral" size="md" className="mb-4 text-rose-700 bg-rose-50 border-rose-200">
              <span>{isRTL ? "403 - وصول غير مصرح به" : "403 - Access Denied"}</span>
            </Badge>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
              {isRTL ? "عذراً، ليس لديك صلاحية إدارية" : "Administrative Access Denied"}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 mb-6 max-w-md leading-relaxed">
              {isRTL
                ? `أنت مسجل حالياً بالبريد الإلكتروني (${user.email}) بدور "${role || "مستخدم"}"، وهذا المسار مخصص فقط للمدير والمشرفين.`
                : `You are signed in as (${user.email}) with role "${role || "user"}", which is not authorized for administrative access.`}
            </p>

            <div className="w-full bg-rose-50/50 border border-rose-200/80 rounded-2xl p-4 text-start mb-6 text-xs text-rose-800 space-y-1">
              <p className="font-bold">{isRTL ? "بيانات الحساب الحالي:" : "Current Account Details:"}</p>
              <p>• {isRTL ? "الاسم:" : "Name:"} {user.displayName || "مستخدم"}</p>
              <p>• {isRTL ? "البريد:" : "Email:"} {user.email}</p>
              <p>• {isRTL ? "الدور المسجل:" : "Assigned Role:"} <span className="font-mono font-bold uppercase">{role || "NONE"}</span></p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              <Button
                variant="secondary"
                size="md"
                fullWidth
                onClick={() => logout()}
                icon={<LogOut className="w-4 h-4" />}
              >
                {isRTL ? "تسجيل الخروج والتبديل" : "Sign Out / Switch"}
              </Button>

              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => onNavigate("home")}
              >
                {isRTL ? "الرجوع للرئيسية" : "Return to Home"}
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // 3. Authorized State (Admin or Supervisor)
  return <AdminPlatformView onNavigate={onNavigate} />;
};
