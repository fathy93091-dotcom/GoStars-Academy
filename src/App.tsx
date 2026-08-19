import React, { useState, useEffect } from 'react';
import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider } from './lib/AuthContext';
import { SiteContentProvider } from './lib/SiteContentContext';
import { Layout } from './components/layout/Layout';
import { AppRoute } from './navigation/routes';
import { HomePage } from './components/pages/HomePage';
import { AboutPage } from './components/pages/AboutPage';
import { CurriculaPage } from './components/pages/CurriculaPage';
import { PricingPage } from './components/pages/PricingPage';
import { TeachersPage } from './components/pages/TeachersPage';
import { HonorRollPage } from './components/pages/HonorRollPage';
import { ContactPage } from './components/pages/ContactPage';
import { LoginPortalStub } from './components/portals/LoginPortalStub';
import { TeacherPlatformView } from './components/TeacherPlatformView';
import { AdminProtectedGate } from './components/admin/AdminProtectedGate';
import { ParentPortalView } from './components/portal/ParentPortalView';

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
    return <TeacherPlatformView onBackToPublicSite={() => handleNavigate('home')} />;
  }

  // If on /admin, render the protected Admin Gate verifying RBAC permissions
  if (currentRoute === 'admin') {
    return <AdminProtectedGate onNavigate={handleNavigate} />;
  }

  // If on /portal, render the Student & Parent Portal
  if (currentRoute === 'portal') {
    return <ParentPortalView onNavigate={handleNavigate} />;
  }

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'curricula':
        return <CurriculaPage onNavigate={handleNavigate} />;
      case 'pricing':
        return <PricingPage onNavigate={handleNavigate} />;
      case 'teachers':
        return <TeachersPage onNavigate={handleNavigate} />;
      case 'honor-roll':
        return <HonorRollPage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPortalStub onNavigate={handleNavigate} />;
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
