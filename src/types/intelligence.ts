// Phase 3: Marriage Intelligence, Couple Space, Risk Signals & Journey Types

export interface TalkBeforeMarriageTopic {
  id: string;
  category: 'Money & Finances' | 'Parents & Family Duties' | 'Children & Parenting' | 'Career & Relocation' | 'Living Arrangements' | 'Conflict & Communication' | 'Spirituality & Festivals' | 'Future Ambitions';
  prompt: string;
  guidance: string;
  userPrivateReflection: string;
  isSharedWithPartner: boolean;
  partnerSharedReflection?: string;
  status: 'not_started' | 'private_draft' | 'shared';
  updatedAt?: string;
}

export interface RelationshipRiskSignal {
  id: string;
  title: string;
  level: 'Advisory (Green)' | 'Needs Discussion (Amber)' | 'Important Conversation (Rose)';
  observation: string;
  evidenceSource: string;
  suggestedAction: string;
  questionsToAsk: string[];
  professionalSupportNote?: string;
}

export interface CoupleSharedNote {
  id: string;
  topic: string;
  content: string;
  authorId: string;
  authorName: string;
  timestamp: string;
}

export interface CoupleSpaceState {
  partnerId: string;
  partnerName: string;
  isCoupleModeActive: boolean;
  userOptIn: boolean;
  partnerOptIn: boolean;
  activatedAt?: string;
  activeTopic: 'know_each_other' | 'money' | 'family' | 'home' | 'children' | 'spirituality' | 'intimacy' | 'wellbeing' | 'career' | 'future';
  sharedNotes: CoupleSharedNote[];
}

export interface JourneyMilestone {
  id: string;
  title: string;
  description: string;
  stage: 'Pre-Marriage' | 'Engagement & Wedding' | 'Post-Marriage';
  order: number;
  completedByUser: boolean;
  completedByPartner: boolean;
  isMutualCompleted: boolean;
  completedAt?: string;
}

export interface HundredDaysPrompt {
  id: string;
  dayRange: 'Days 1–7' | 'Days 8–30' | 'Days 31–60' | 'Days 61–90' | 'Days 91–100';
  theme: string;
  question: string;
  userResponse: string;
  isShared: boolean;
  partnerResponse?: string;
}

export interface AnnualHealthCheck {
  year: number;
  lastCheckedDate?: string;
  communicationHarmony: 'Deeply Connected' | 'Healthy with room to grow' | 'Needs focused conversation';
  financialStressLevel: 'Low / Aligned' | 'Moderate / Occasional tension' | 'High / Requires restructuring';
  emotionalCloseness: 'Warm & Present' | 'Steady' | 'Distracted / Need quality time';
  spiritualConnection: 'Nurturing' | 'Individual respect' | 'Wants more shared ritual';
  jointGoals: string;
}
