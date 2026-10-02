export type LifeEra = 'roots' | 'youth' | 'family' | 'everyday' | 'wisdom';

export type MoodType = 'Joyful' | 'Peaceful' | 'Loved' | 'Nostalgic' | 'Proud' | 'Bittersweet';

export type VisionCategory = 'Wellbeing' | 'Loved Ones' | 'Nature & Travel' | 'Creativity' | 'Simple Joys' | 'Legacy';

export type TimeHorizon = 'This Season' | 'This Year' | 'Someday';

export type ColorTheme = 'warm-parchment' | 'sepia' | 'high-contrast' | 'twilight';

export interface MemoryEntry {
  id: string;
  title: string;
  text: string;
  promptUsed?: string;
  era: LifeEra;
  decade?: string;
  people?: string;
  location?: string;
  mood: MoodType;
  photoUrl?: string;
  photoCaption?: string;
  voiceNoteUrl?: string;
  voiceNoteDuration?: number;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VisionItem {
  id: string;
  title: string;
  category: VisionCategory;
  timeHorizon: TimeHorizon;
  smallStep: string;
  imageUrl?: string;
  notes?: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface ComfortSettings {
  fontScale: number; // 1, 1.15, 1.3
  colorTheme: ColorTheme;
  reducedMotion: boolean;
  readingSpeed: number; // 0.85, 1.0, 1.15
}

export interface MemoryPrompt {
  id: string;
  text: string;
  era: LifeEra;
  eraLabel: string;
  followUp: string;
}
