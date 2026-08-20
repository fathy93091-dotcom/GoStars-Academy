import React, { useState, useEffect, lazy, Suspense } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider } from './lib/AuthContext';
import { SiteContentProvider } from './lib/SiteContentContext';
import { Layout } from './components/layout/Layout';
import { AppRoute } from './navigation/routes';
import { HomePage } from './components/pages/HomePage';

// Lazy load secondary pages and platforms for ultra-fast initial bundle and instantaneous page load
const AboutPage = lazy(() => import('./components/pages/AboutPage').then(m => ({ default: m.AboutPage })));
const CurriculaPage = lazy(() => import('./components/pages/CurriculaPage').then(m => ({ default: m.CurriculaPage })));
const PricingPage = lazy(() => import('./components/pages/PricingPage').then(m => ({ default: m.PricingPage })));
const TeachersPage = lazy(() => import('./components/pages/TeachersPage').then(m => ({ default: m.TeachersPage })));
const HonorRollPage = lazy(() => import('./components/pages/HonorRollPage').then(m => ({ default: m.HonorRollPage })));
const ContactPage = lazy(() => import('./components/pages/ContactPage').then(m => ({ default: m.ContactPage })));
const LoginPortalStub = lazy(() => import('./components/portals/LoginPortalStub').then(m => ({ default: m.LoginPortalStub })));
const TeacherPlatformView = lazy(() => import('./components/TeacherPlatformView').then(m => ({ default: m.TeacherPlatformView })));
const AdminProtectedGate = lazy(() => import('./components/admin/AdminProtectedGate').then(m => ({ default: m.AdminProtectedGate })));
const ParentPortalView = lazy(() => import('./components/portal/ParentPortalView').then(m => ({ default: m.ParentPortalView })));

// Ultra lightweight page loader
function PageLoader() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
      <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center animate-pulse mb-3">
        <span className="text-xl">✨</span>
      </div>
      <p className="text-xs font-bold text-slate-500 animate-pulse">جارٍ التحميل السريع...</p>
    </div>
  );
}

function AppContent() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    try {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const validRoutes: AppRoute[] = [
        'home', 
        'about', 
        'curricula', 
        'pricing', 
        'teachers', 
        'honor-roll', 
        'contact', 
        'login',
        'portal',
        'admin',
        'teacher-platform'
      ];
      if (validRoutes.includes(hash as AppRoute)) {
        return hash as AppRoute;
      }
    } catch {}
    return 'home';
  });

  // Listen to browser hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const validRoutes: AppRoute[] = [
        'home', 
        'about', 
        'curricula', 
        'pricing', 
        'teachers', 
        'honor-roll', 
        'contact', 
        'login',
        'portal',
        'admin',
        'teacher-platform'
      ];
      if (validRoutes.includes(hash as AppRoute)) {
        setCurrentRoute(hash as AppRoute);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (route: AppRoute) => {
    setCurrentRoute(route);
    try {
      window.location.hash = route === 'home' ? '' : `#${route}`;
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If on Teacher Platform, render the complete Teacher Platform with its own dedicated layout
  if (currentRoute === 'teacher-platform') {
    return (
      <Suspense fallback={<PageLoader />}>
        <TeacherPlatformView onBackToPublicSite={() => handleNavigate('home')} />
      </Suspense>
    );
  }

  // If on /admin, render the protected Admin Gate verifying RBAC permissions
  if (currentRoute === 'admin') {
    return (
      <Suspense fallback={<PageLoader />}>
        <AdminProtectedGate onNavigate={handleNavigate} />
      </Suspense>
    );
  }

  // If on /portal, render the Student & Parent Portal
  if (currentRoute === 'portal') {
    return (
      <Suspense fallback={<PageLoader />}>
        <ParentPortalView onNavigate={handleNavigate} />
      </Suspense>
    );
  }

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'about':
        return (
          <Suspense fallback={<PageLoader />}>
            <AboutPage onNavigate={handleNavigate} />
          </Suspense>
        );
      case 'curricula':
        return (
          <Suspense fallback={<PageLoader />}>
            <CurriculaPage onNavigate={handleNavigate} />
          </Suspense>
        );
      case 'pricing':
        return (
          <Suspense fallback={<PageLoader />}>
            <PricingPage onNavigate={handleNavigate} />
          </Suspense>
        );
      case 'teachers':
        return (
          <Suspense fallback={<PageLoader />}>
            <TeachersPage onNavigate={handleNavigate} />
          </Suspense>
        );
      case 'honor-roll':
        return (
          <Suspense fallback={<PageLoader />}>
            <HonorRollPage onNavigate={handleNavigate} />
          </Suspense>
        );
      case 'contact':
        return (
          <Suspense fallback={<PageLoader />}>
            <ContactPage onNavigate={handleNavigate} />
          </Suspense>
        );
      case 'login':
        return (
          <Suspense fallback={<PageLoader />}>
            <LoginPortalStub onNavigate={handleNavigate} />
          </Suspense>
        );
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout currentRoute={currentRoute} onNavigate={handleNavigate}>
      {renderCurrentPage()}
    </Layout>
  );
}

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SiteContentProvider>
          <AppContent />
        </SiteContentProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
