// Phase 5: Pratha Spirituality & Wellbeing Layer Types (Module N)

export type SpiritualPath = 
  | 'traditional' 
  | 'wellness' 
  | 'modern_spiritual' 
  | 'family' 
  | 'couple';

export interface DailySankalpa {
  date: string;
  theme: string;
  slokaOrAffirmation: string;
  meaning: string;
  practicePrompt: string;
  durationMinutes: number;
}

export interface TempleExperience {
  id: string;
  name: string;
  deity: string;
  location: string;
  state: string;
  spiritualSignificance: string;
  marriageSignificance: string; // Specific relevance to couples/marriage
  recommendedSeva: string;
  dressCode: string;
  bestTimings: string;
  bookingStatus: 'available_direct' | 'advisory_only' | 'seasonal';
  imageUrl: string;
}

export interface PoojaGuide {
  id: string;
  title: string;
  category: 'pre_wedding' | 'wedding_sanskar' | 'home_auspicious' | 'annual_vratha';
  purpose: string;
  duration: string;
  recommendedTithi: string;
  samagriList: string[];
  stepByStepRitual: string[];
  spiritualMeaning: string;
}

export interface CoupleJourneyDay {
  dayNumber: number;
  title: string;
  theme: 'Gratitude' | 'Patience' | 'Forgiveness' | 'Sacred Union' | 'Home Sanctuary' | 'Generosity' | 'Inner Joy';
  exercise: string;
  sharedQuestion: string;
  completedByUser: boolean;
  completedByPartner: boolean;
}

export interface FestivalEvent {
  id: string;
  name: string;
  date: string;
  tithi: string;
  category: 'Major Festival' | 'Couple Observance' | 'Auspicious Muhurat Window';
  spiritualSignificance: string;
  coupleRecommendation: string;
}

export interface MeditationSession {
  id: string;
  title: string;
  category: 'Couple Coherence' | 'Wedding Calm' | 'Morning Vitality' | 'Night Relaxation';
  durationMinutes: number;
  guidanceText: string;
  audioPromptPreview: string;
}
