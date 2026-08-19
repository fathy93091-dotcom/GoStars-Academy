export type AppRoute = 
  | 'home'
  | 'about'
  | 'curricula'
  | 'pricing'
  | 'teachers'
  | 'honor-roll'
  | 'contact'
  | 'login'
  | 'portal'
  | 'admin'
  | 'teacher-platform';

export interface NavItemConfig {
  id: AppRoute;
  path: string;
  translationKey: 'navHome' | 'navAbout' | 'navCurricula' | 'navPricing' | 'navTeachers' | 'navHonorRoll' | 'navContact';
}

export const PUBLIC_NAV_ITEMS: NavItemConfig[] = [
  { id: 'home', path: '/', translationKey: 'navHome' },
  { id: 'about', path: '/about', translationKey: 'navAbout' },
  { id: 'curricula', path: '/curricula', translationKey: 'navCurricula' },
  { id: 'pricing', path: '/pricing', translationKey: 'navPricing' },
  { id: 'teachers', path: '/teachers', translationKey: 'navTeachers' },
  { id: 'honor-roll', path: '/honor-roll', translationKey: 'navHonorRoll' },
  { id: 'contact', path: '/contact', translationKey: 'navContact' },
];

export const PORTAL_ROUTES = {
  login: { id: 'login' as AppRoute, path: '/login' },
  portal: { id: 'portal' as AppRoute, path: '/portal' },
  admin: { id: 'admin' as AppRoute, path: '/admin' },
  teacherPlatform: { id: 'teacher-platform' as AppRoute, path: '/teacher-platform' },
};
