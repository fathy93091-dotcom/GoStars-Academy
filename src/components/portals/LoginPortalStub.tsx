import React, { useState } from 'react';
import { Container } from '../shared/Container';
import { Logo } from '../shared/Logo';
import { Button } from '../shared/Button';
import { Badge } from '../shared/Badge';
import { useLanguage } from '../../i18n/LanguageContext';
import { useAuth } from '../../lib/AuthContext';
import { AppRoute } from '../../navigation/routes';
import {
  GraduationCap,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Lock,
  Info,
  LogOut,
  UserCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface LoginPortalStubProps {
  onNavigate: (route: AppRoute) => void;
}

export function LoginPortalStub({ onNavigate }: LoginPortalStubProps) {
  const { t, isRTL } = useLanguage();
  const { user, profile, role, isLoading, error, loginWithGoogle, logout } = useAuth();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student');

  const handleGoogleLogin = async () => {
    const targetRole = selectedRole === 'teacher' ? 'teacher' : 'parent';
    await loginWithGoogle(targetRole);
  };

  return (
    <div className="py-12 sm:py-20 flex flex-col items-center justify-center min-h-[75vh]">
      <Container size="sm">
        <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-md p-8 sm:p-12 flex flex-col items-center text-center">
          {/* Logo */}
          <div className="mb-6">
            <Logo size="lg" showSlogan={true} />
          </div>

          <Badge variant="blue" size="md" className="mb-4">
            <Lock className="w-3.5 h-3.5" />
            <span>{isRTL ? 'بوابة الدخول' : 'Users Portal'}</span>
          </Badge>

          <h1 className="text-2xl sm:text-3xl font-black text-[#0B192C] mb-3">
            {isRTL ? 'تسجيل الدخول للمنصة' : 'Portal Sign In'}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 mb-6 max-w-md leading-relaxed">
            {isRTL
              ? 'مرحباً بكم في منصة GoStars. سجل دخولك لمتابعة الحصص الدراسية، التقارير والواجبات، والشهادات.'
              : 'This portal is dedicated to students, parents, and teachers to access schedules, lessons, and academic reports.'}
          </p>

          {error && (
            <div className="w-full mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 text-start">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* If user is logged in, show authenticated account card */}
          {user ? (
            <div className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 mb-6 text-start">
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-200">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "Avatar"}
                    className="w-12 h-12 rounded-2xl border border-slate-200 object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-base">
                    {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-sm text-[#0B192C] truncate">
                      {profile?.name || user.displayName || "مستخدم مسجل"}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold text-[10px] uppercase">
                      {role || "parent"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 mb-6 bg-white p-3 rounded-2xl border border-slate-200/80">
                <span className="flex items-center gap-1.5 font-medium text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {isRTL ? 'حساب نشط ومسجل في المنظومة' : 'Active Authenticated Account'}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">UID: {user.uid.slice(0, 8)}...</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                {role === 'admin' ? (
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={() => onNavigate('admin')}
                    icon={<ArrowIcon className="w-4 h-4" />}
                    iconPosition="end"
                  >
                    {isRTL ? 'لوحة الإدارة المركزية' : 'Admin Hub'}
                  </Button>
                ) : (role === 'teacher' || role === 'supervisor') ? (
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={() => onNavigate('teacher-platform')}
                    icon={<ArrowIcon className="w-4 h-4" />}
                    iconPosition="end"
                  >
                    {isRTL ? 'الدخول لمنصة المعلم' : 'Enter Teacher Platform'}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={() => onNavigate('portal')}
                    icon={<ArrowIcon className="w-4 h-4" />}
                    iconPosition="end"
                  >
                    {isRTL ? 'بوابة الطالب وولي الأمر' : 'Enter Parent & Student Portal'}
                  </Button>
                )}

                <Button
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={() => logout()}
                  icon={<LogOut className="w-4 h-4" />}
                >
                  {isRTL ? 'تسجيل الخروج' : 'Sign Out'}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* User category tabs (Student/Parent or Teacher ONLY) */}
              <div className="grid grid-cols-2 gap-3 w-full mb-6">
                <button
                  type="button"
                  onClick={() => setSelectedRole('student')}
                  className={`p-4 rounded-2xl border transition-all text-start cursor-pointer flex flex-col gap-2 ${
                    selectedRole === 'student'
                      ? 'border-[#0F4C81] bg-[#EFF6FF] text-[#0F4C81] shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${selectedRole === 'student' ? 'bg-[#0F4C81] text-white' : 'bg-slate-200 text-slate-700'}`}>
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    {selectedRole === 'student' && <span className="w-2 h-2 rounded-full bg-[#0F4C81]" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#0B192C]">{isRTL ? 'الطالب / ولي الأمر' : 'Student / Parent'}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                      {isRTL ? 'متابعة الحصص، رصيد الباقات، والتقارير الدورية' : 'Track sessions, lesson balance, and periodic reports'}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole('teacher')}
                  className={`p-4 rounded-2xl border transition-all text-start cursor-pointer flex flex-col gap-2 ${
                    selectedRole === 'teacher'
                      ? 'border-[#0F4C81] bg-[#EFF6FF] text-[#0F4C81] shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${selectedRole === 'teacher' ? 'bg-[#0F4C81] text-white' : 'bg-slate-200 text-slate-700'}`}>
                      <BookOpen className="w-4 h-4" />
                    </div>
                    {selectedRole === 'teacher' && <span className="w-2 h-2 rounded-full bg-[#0F4C81]" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#0B192C]">{isRTL ? 'المعلم' : 'Teacher'}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                      {isRTL ? 'إدارة الحصص والطلاب وتدوين الحضور والتقارير' : 'Manage lessons, attendance records, and evaluations'}
                    </p>
                  </div>
                </button>
              </div>

              {/* Notice Box */}
              <div className="w-full bg-[#F8FAFC] border border-slate-200 rounded-2xl p-4 text-start mb-6 flex items-start gap-3">
                <Info className="w-5 h-5 text-[#0F4C81] shrink-0 mt-0.5" />
                <div className="text-xs text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-800 block mb-1">
                    {selectedRole === 'student'
                      ? (isRTL ? 'تسجيل الدخول متاح للمشتركين' : 'Sign in for registered students')
                      : (isRTL ? 'بوابة المعلم المعتمدة' : 'Official Teacher Gateway')}
                  </span>
                  <span>
                    {selectedRole === 'student'
                      ? (isRTL
                          ? 'يمكنك تسجيل الدخول بحساب Google المعتمد لمتابعة التقارير والمستجدات.'
                          : 'You can sign in with your authorized Google account to view reports and updates.')
                      : (isRTL
                          ? 'سجل دخولك بحساب Google لبدء إدارة طلابك وحصصك بأمان.'
                          : 'Sign in with your Google account to access and manage your teaching workspace.')}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  disabled={isLoading}
                  onClick={handleGoogleLogin}
                  icon={<ArrowIcon className="w-4 h-4" />}
                  iconPosition="end"
                >
                  {isLoading ? (isRTL ? 'جارٍ تسجيل الدخول...' : 'Signing in...') : (isRTL ? 'تسجيل الدخول بحساب Google' : 'Sign In with Google')}
                </Button>

                <Button
                  variant="secondary"
                  size="md"
                  fullWidth
                  onClick={() => onNavigate('home')}
                >
                  {t.ctaBackToHome}
                </Button>
              </div>
            </>
          )}
        </div>
      </Container>
    </div>
  );
}

