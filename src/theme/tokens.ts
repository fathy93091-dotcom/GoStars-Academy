/**
 * GoStars Academy - Brand Identity & Design Tokens
 * 
 * Slogan: "آفاق واسعة.. لعلم لا ينتهي" ("Broad Horizons.. For Endless Knowledge")
 * Primary Colors:
 * - Brand Blue: #0F4C81 (Royal academic blue)
 * - Brand Gold: #C59B27 (Prestige educational gold)
 * - Dark Navy: #0B192C (Solid grounding navy)
 * - Pure White: #FFFFFF
 * - Calm Light Canvas: #F7F9FC
 */

export const BRAND_TOKENS = {
  name: {
    ar: "أكاديمية جو ستارز",
    en: "GoStars Academy",
  },
  slogan: {
    ar: "آفاق واسعة.. لعلم لا ينتهي",
    en: "Broad Horizons.. For Endless Knowledge",
  },
  colors: {
    // Primary Brand Blue
    blue: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      200: '#BFDBFE',
      500: '#2563EB',
      600: '#1D4ED8',
      700: '#0F4C81', // Brand Primary
      800: '#1E3A8A',
      900: '#172554',
    },
    // Prestige Gold
    gold: {
      50: '#FFFDF5',
      100: '#FDF7E2',
      200: '#F7E7B5',
      300: '#EFCF7A',
      400: '#DEAF3E',
      500: '#C59B27', // Brand Gold Accent
      600: '#A77D18',
      700: '#7E5B10',
    },
    // Dark Navy
    navy: {
      800: '#132238',
      900: '#0B192C', // Deep Brand Navy
      950: '#060D17',
    },
    // Canvas & Neutral
    surface: {
      background: '#F7F9FC', // Requested calm background
      card: '#FFFFFF',
      border: '#E2E8F0',
      borderLight: '#EDF2F7',
      textPrimary: '#0F172A',
      textSecondary: '#475569',
      textMuted: '#64748B',
    }
  },
  typography: {
    arabicFont: "'Cairo', system-ui, -apple-system, sans-serif",
    latinFont: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
  },
  contactInfo: {
    phone: "+966 50 000 0000",
    email: "info@gostars-academy.com",
    workingHours: {
      ar: "السبت - الخميس: ٩:٠٠ ص - ٩:٠٠ م",
      en: "Sat - Thu: 9:00 AM - 9:00 PM",
    },
    address: {
      ar: "المملكة العربية السعودية / تعليم تفاعلي عن بُعد لجميع دول العالم",
      en: "Saudi Arabia / Interactive Online Education Worldwide",
    }
  }
} as const;
