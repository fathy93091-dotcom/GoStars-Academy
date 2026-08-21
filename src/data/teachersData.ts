export interface TeacherPublicProfile {
  id: string;
  name: {
    ar: string;
    en: string;
  };
  title: {
    ar: string;
    en: string;
  };
  specialization: 'quran' | 'arabic' | 'islamic' | 'foundation';
  specializationLabel: {
    ar: string;
    en: string;
  };
  experienceYears: number;
  qualifications: {
    ar: string[];
    en: string[];
  };
  teachingPhilosophy: {
    ar: string;
    en: string;
  };
  featuredTag?: {
    ar: string;
    en: string;
  };
}

export const MOCK_TEACHERS: TeacherPublicProfile[] = [];
