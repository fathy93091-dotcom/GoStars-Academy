export interface HonorRollStar {
  id: string;
  studentDisplayName: {
    ar: string;
    en: string;
  };
  country: {
    ar: string;
    en: string;
    code: string; // flag emoji or code
  };
  category: 'quran_complete' | 'quran_milestone' | 'arabic_mastery' | 'commitment';
  categoryBadge: {
    ar: string;
    en: string;
  };
  achievementTitle: {
    ar: string;
    en: string;
  };
  achievementDetail: {
    ar: string;
    en: string;
  };
  completionDate: string;
  teacherPraise: {
    ar: string;
    en: string;
  };
  starsCount: number;
  highlighted?: boolean;
}

export const MOCK_HONOR_STARS: HonorRollStar[] = [];
