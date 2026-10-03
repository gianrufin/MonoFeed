export type FactCategory = 
  | 'Geography' 
  | 'History & Archaeology' 
  | 'Biodiversity & Nature' 
  | 'Culture & Heritage' 
  | 'Science & Innovation' 
  | 'Language & Linguistics';

export interface Fact {
  id: string;
  dayIndex: number; // 1-indexed daily sequence
  title: string;
  summary: string;
  body: string;
  category: FactCategory;
  verificationStatus: '100% FACT CHECKED';
  primarySource: string;
  sourceCitation: string;
  sourceUrl?: string;
  corroboratingEntity: string;
  didYouKnow: string;
  location?: string;
  historicalPeriod?: string;
  keywords: string[];
}

export type ThemeMode = 'dark' | 'light' | 'oled';
export type FontSize = 'normal' | 'large' | 'extralarge';

export interface NotificationPreferences {
  enabled: boolean;
  time: string; // e.g. "09:00"
  hasPermission: boolean;
}

export interface ShareOptions {
  platform: 'twitter' | 'instagram' | 'native' | 'copy';
  format?: 'feed' | 'story';
}
