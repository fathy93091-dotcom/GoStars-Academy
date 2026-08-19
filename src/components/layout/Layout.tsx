import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { AnnouncementBanner } from './AnnouncementBanner';
import { AppRoute } from '../../navigation/routes';

interface LayoutProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute) => void;
  children: ReactNode;
}

export function Layout({ currentRoute, onNavigate, children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9FC] text-slate-800 antialiased selection:bg-amber-100 selection:text-amber-900">
      <AnnouncementBanner onNavigate={onNavigate} />
      <Header currentRoute={currentRoute} onNavigate={onNavigate} />
      
      <main className="flex-1 w-full flex flex-col">
        {children}
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
